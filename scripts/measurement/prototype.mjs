import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { chromium } from '@playwright/test'
import { generate, verify } from './corpus.mjs'
import { stats } from './contract.mjs'

const output = resolve(process.env.MEASUREMENT_OUTPUT ?? 'test-results/measurement-prototype')
mkdirSync(output, { recursive: true })
const gitArgs = ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`]
const git = (...args) => { const r = spawnSync('git', [...gitArgs, ...args], { encoding: 'utf8' }); if (r.status !== 0) throw new Error('Git unavailable'); return r.stdout.trim() }
const sha = git('rev-parse', 'HEAD')
assert.equal(git('status', '--porcelain'), '', 'Commit changes before measuring; SHA must identify tested files')
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
let serverLog = '', browser
server.stdout.on('data', b => { serverLog += b })
server.stderr.on('data', b => { serverLog += b })
const report = { sha, startedAt: new Date().toISOString(), status: 'BLOCKED', scope: 'measurement device smoke, NOT product budgets B01/B04', environment: { node: process.version, os: process.platform, arch: process.arch, build: 'Vite production build served locally; not installed/distributed/offline qualified', headless: true, agent: 'present; not CPU/RAM qualification', cache: 'fresh browser contexts, warm OS; not cold-boot' }, navigationMs: [], interactionMs: [], consoleErrors: [], pageErrors: [] }
try {
  let ready = false
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error('Preview server exited')
    try { if ((await fetch('http://127.0.0.1:4174')).ok) { ready = true; break } } catch { /* bounded startup retry */ }
    await setTimeout(100)
  }
  assert.ok(ready, 'Preview ready')
  const corpus = resolve(output, 'ci-corpus')
  generate({ output: corpus, preset: 'ci', mode: 'used' })
  report.corpus = verify(corpus)
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  report.environment.browser = browser.version()
  for (let n = 0; n < 10; n++) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await context.newPage()
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) report.consoleErrors.push(m.text()) })
    page.on('pageerror', e => report.pageErrors.push(e.message))
    await page.goto('http://127.0.0.1:4174/projet')
    await page.getByRole('button', { name: 'Réviseur', exact: true }).waitFor()
    const navigationElapsed = await page.evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now())))
    }))
    report.navigationMs.push(navigationElapsed)
    if (n === 9) {
      await context.tracing.start({ screenshots: true, snapshots: true })
      await page.evaluate(() => {
        window.measurementClicks = []
        document.addEventListener('click', e => {
          if (e.target.closest('button')?.textContent?.match(/Réviseur|Sound Designer/)) {
            const start = performance.now()
            requestAnimationFrame(() => requestAnimationFrame(() => window.measurementClicks.push(performance.now() - start)))
          }
        }, true)
      })
      for (let i = 0; i < 110; i++) {
        const role = i % 2 ? 'Sound Designer' : 'Réviseur'
        const before = await page.evaluate(() => window.measurementClicks.length)
        await page.getByRole('button', { name: role, exact: true }).click()
        await page.waitForFunction(({ role, before }) => [...document.querySelectorAll('button')].some(b => b.textContent?.trim() === role && b.getAttribute('aria-pressed') === 'true') && window.measurementClicks.length > before, { role, before })
      }
      const samples = await page.evaluate(() => window.measurementClicks)
      assert.equal(samples.length, 110)
      report.interactionMs = samples.slice(10)
      report.interactionBoundary = 'capture click listener to second rAF; includes JS/render opportunity, excludes OS input/compositor/physical display; not B04'
      report.dom = { h1: await page.locator('h1').count(), activeRole: await page.getByRole('button', { name: 'Sound Designer', exact: true }).getAttribute('aria-pressed') }
      assert.equal(report.dom.h1, 1); assert.equal(report.dom.activeRole, 'true')
      await page.screenshot({ path: resolve(output, 'prototype.png'), fullPage: true })
      await context.tracing.stop({ path: resolve(output, 'prototype-trace.zip') })
    }
    await context.close()
  }
  report.navigation = stats(report.navigationMs, 10); report.interaction = stats(report.interactionMs, 100)
  assert.deepEqual(report.consoleErrors, []); assert.deepEqual(report.pageErrors, [])
  report.status = 'PASS'
} catch (error) { report.status = 'FAIL'; report.error = error.message; process.exitCode = 1 }
finally {
  await browser?.close(); server.kill()
  report.finishedAt = new Date().toISOString()
  // The generated corpus is verified above; only its manifest is a shared proof.
  const manifestPath = resolve(output, 'ci-corpus/manifest.json')
  try { writeFileSync(resolve(output, 'corpus-manifest.json'), readFileSync(manifestPath)) } catch { /* failure recorded in report */ }
  writeFileSync(resolve(output, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  writeFileSync(resolve(output, 'server.log'), serverLog)
  console.log(JSON.stringify(report, null, 2))
}
