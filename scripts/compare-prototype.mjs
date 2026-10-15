import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { URL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { chromium } from '@playwright/test'

function option(name) {
  const index = process.argv.indexOf(name)
  if (index < 0 || !process.argv[index + 1] || process.argv[index + 1].startsWith('--')) throw new Error(`Missing ${name}`)
  return process.argv[index + 1]
}
function loopback(value) {
  const url = new URL(value)
  if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(url.hostname) || url.username || url.password || url.pathname !== '/') throw new Error('Use an HTTP loopback origin without credentials or a path')
  return url.origin
}
const baseline = loopback(option('--baseline-url')), candidate = loopback(option('--candidate-url'))
assert.notEqual(baseline, candidate, 'Baseline and candidate must be distinct origins')
const output = resolve(option('--output-dir'))
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--force-color-profile=srgb'] })
const report = { baseline, candidate, browser: browser.version(), platform: process.platform, arch: process.arch, node: process.version, startedAt: new Date().toISOString(), cases: [], mutantRejected: false }
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
let caseIndex = 0

async function renderedProfile(page) {
  return page.evaluate(() => {
    const styleProfile = style => Object.fromEntries([...style].sort().map(key => [key, style.getPropertyValue(key).replaceAll(globalThis.location.origin, '<origin>')]))
    return [globalThis.document.body, ...globalThis.document.body.querySelectorAll('*')].map(element => {
      const bounds = element.getBoundingClientRect()
      const pseudo = name => {
        const style = globalThis.getComputedStyle(element, name)
        return style.content === 'none' ? null : styleProfile(style)
      }
      return {
        tag: element.tagName, id: element.id, class: element.getAttribute('class'),
        attributes: Object.fromEntries([...element.attributes].sort((a, b) => a.name.localeCompare(b.name)).map(attribute => [attribute.name, attribute.value.replaceAll(globalThis.location.origin, '<origin>')])),
        text: [...element.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent),
        rect: [bounds.x, bounds.y, bounds.width, bounds.height],
        style: styleProfile(globalThis.getComputedStyle(element)), before: pseudo('::before'), after: pseudo('::after'),
      }
    })
  })
}

async function stableScreenshot(page, path) {
  await page.mouse.move(0, 0)
  await page.evaluate(async () => {
    const fonts = [
      ['400 16px Manrope', 'Aaé'], ['600 16px Manrope', 'Aaé'], ['700 16px Manrope', 'Aaé'],
      ['400 16px Literata', 'Aaé'], ['700 16px Literata', 'Aaé'],
      ['400 16px "Noto Naskh Arabic"', 'العربية'], ['700 16px "Noto Naskh Arabic"', 'العربية'],
    ]
    for (const [font, text] of fonts) {
      const faces = await globalThis.document.fonts.load(font, text)
      if (!faces.length || faces.some(face => face.status !== 'loaded')) throw new Error(`Required local font not loaded: ${font}`)
    }
    await globalThis.document.fonts.ready
    await new Promise(resolve => globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(resolve)))
  })
  const options = { fullPage: true, animations: 'disabled', caret: 'hide' }
  let previous = await page.screenshot(options)
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await page.screenshot(options)
    if (previous.equals(current)) {
      await writeFile(path, current)
      return current
    }
    previous = current
  }
  throw new Error('Rendered state did not stabilize; comparison is inconclusive')
}

try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }]) {
    // Replay both versions in the same page, sequentially: no background-tab focus race.
    const context = await browser.newContext({ viewport, colorScheme: 'dark', reducedMotion: 'reduce' })
    try {
      const page = await context.newPage()
      const cases = [
        ['sound-designer', ['Sound Designer']], ['reviewer', ['Réviseur']],
        ['team-lead', ['Chef d’équipe']], ['admin', ['Admin Maison']],
        ['menu', ['Ouvrir la navigation générale']],
        ...(viewport.width === 1440
          ? [['history', ['Historique']]]
          : [['library-drawer', [/Ouvrir la bibliothèque/]], ['inspector-drawer', [/Ouvrir l’inspecteur/]], ['simulation-history-drawer', [/Ouvrir Simulation/, 'Historique']]]),
      ]
      for (const [name, actions] of cases) {
        const prefix = `${String(++caseIndex).padStart(2, '0')}-${viewport.width}-${name}`
        const bytes = [], profiles = []
        for (const [index, origin] of [baseline, candidate].entries()) {
          await page.goto(origin + '/projet')
          await page.getByRole('heading', { level: 1 }).waitFor()
          for (const name of actions) await page.getByRole('button', { name }).click()
          bytes.push(await stableScreenshot(page, resolve(output, `${prefix}-${index ? 'candidate' : 'baseline'}.png`)))
          const profile = Buffer.from(JSON.stringify(await renderedProfile(page)))
          profiles.push(profile)
          await writeFile(resolve(output, `${prefix}-${index ? 'candidate' : 'baseline'}.json.gz`), gzipSync(profile))
        }
        const equal = profiles[0].equals(profiles[1])
        report.cases.push({ name, viewport, baselineSha256: hash(bytes[0]), candidateSha256: hash(bytes[1]), pngBytesEqual: bytes[0].equals(bytes[1]), baselineProfileSha256: hash(profiles[0]), candidateProfileSha256: hash(profiles[1]), equal })
        console.log(`${equal ? 'PASS' : 'FAIL'} ${prefix}`)
        if (caseIndex === 14) {
          await page.addStyleTag({ content: 'body::after { content: ""; position: fixed; inset: 0 auto auto 0; width: 32px; height: 32px; z-index: 2147483647; background: #ff00ff; }' })
          const mutant = await stableScreenshot(page, resolve(output, 'synthetic-mutant.png'))
          report.mutantRejected = !profiles[1].equals(Buffer.from(JSON.stringify(await renderedProfile(page)))) && !bytes[1].equals(mutant)
          assert.equal(report.mutantRejected, true, 'Comparator must reject a visibly altered candidate')
        }
      }
    } finally {
      await context.close()
    }
  }
} finally {
  report.finishedAt = new Date().toISOString()
  await browser.close()
  await writeFile(resolve(output, 'comparison.json'), JSON.stringify(report, null, 2) + '\n')
}
assert.ok(report.cases.length === 14 && report.cases.every(row => row.equal), 'Every rendered layout/style profile must match exactly')
console.log('PASS 14 rendered layout/style comparisons; synthetic visible mutation rejected; PNG equality is diagnostic only')
