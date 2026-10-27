/* global document, navigator, caches, MessageChannel, indexedDB, setTimeout, clearTimeout, fetch, Cache, DOMException */
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { resolve, join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { execFileSync } from 'node:child_process'
import { URL } from 'node:url'
import { chromium, expect } from '@playwright/test'

const args = process.argv.slice(2)
if (args.length === 1 && args[0] === '--help') {
  console.log('node scripts/offline/smoke.mjs --output NEW_DIRECTORY : built dist, own Chrome profiles/loopback servers; no Electron or global network changes. Run pnpm build first.')
  process.exit(0)
}
if (args.length && (args.length !== 2 || args[0] !== '--output')) throw new Error('Use --help')
if (!args.length) await mkdir(resolve('test-results'), { recursive: true })
const output = args.length ? resolve(args[1]) : resolve('test-results', 'offline-' + randomUUID())
await mkdir(output)
const dist = resolve('dist')
const manifest = JSON.parse(await readFile(join(dist, 'offline-manifest.json'), 'utf8'))
const files = new Map()
for (const asset of manifest.assets) files.set(asset.url, await readFile(join(dist, asset.url.slice(1))))
files.set('/sw.js', await readFile(join(dist, 'sw.js')))
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const routes = new Set(['/', '/accueil', '/connexion', '/projet', '/parametres', '/fondations', '/404'])
const contexts = new Set(); const servers = new Set(); const results = []; const versions = []
const requests = []; const start = performance.now(); const started = new Date().toISOString()
let currentPage
async function serve() {
  const state = { mode: 'normal', pending: null }
  const server = createServer((request, response) => {
    const path = new URL(request.url, 'http://127.0.0.1').pathname
    requests.push({ path, mode: state.mode })
    if (request.method !== 'GET') { response.writeHead(405); response.end(); return }
    let body
    if (path === '/offline-manifest.json') {
      let value = manifest
      if (['update-failure', 'interrupted'].includes(state.mode)) {
        const assets = [...manifest.assets, { url: '/new-generation.txt', bytes: 3, sha256: hash('new') }]
        value = { assets, buildId: hash(JSON.stringify(assets)) }
      }
      body = JSON.stringify(value); response.setHeader('Content-Type', 'application/json')
    } else if (state.mode === 'interrupted' && path === '/new-generation.txt') {
      state.pending = response; return // Controlled barrier; only this owned test response is held.
    } else if ((state.mode === 'font-failure' && path === manifest.assets.find((a) => a.url.endsWith('.woff2')).url) || path === '/new-generation.txt') {
      response.writeHead(503); response.end('controlled incomplete generation'); return
    } else {
      const normalized = path.replace(/\/+$/, '') || '/'
      const resource = routes.has(normalized) ? '/index.html' : path
      body = files.get(resource)
      const extension = resource.split('.').at(-1)
      response.setHeader('Content-Type', ({ html: 'text/html', js: 'text/javascript', css: 'text/css', svg: 'image/svg+xml', woff2: 'font/woff2', woff: 'font/woff' })[extension] ?? 'application/octet-stream')
    }
    response.setHeader('Cache-Control', 'no-store')
    if (body === undefined) { response.writeHead(404); response.end('missing'); return }
    response.end(body)
  })
  await new Promise((done) => server.listen(0, '127.0.0.1', done)); servers.add(server)
  return { state, url: `http://127.0.0.1:${server.address().port}`, close: async () => { await new Promise((done) => server.close(done)); servers.delete(server) } }
}
async function launch(name) {
  const context = await chromium.launchPersistentContext(join(output, name), { channel: 'chrome', headless: true, chromiumSandbox: true })
  contexts.add(context)
  const page = await context.newPage(); currentPage = page
  versions.push(await page.evaluate(() => navigator.userAgent))
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  return { context, page, close: async () => { await context.close(); contexts.delete(context) } }
}
const prepared = async (page) => {
  await page.getByRole('button', { name: 'Préparer la démonstration hors ligne', exact: true }).click()
  await expect(page.getByText('Démonstration prête hors ligne', { exact: true })).toBeVisible({ timeout: 30000 })
  await expect(page.getByTestId('offline-project')).toHaveAttribute('data-token-id', 'T75-chapter-1:word-1')
}
const workerStatus = (page) => page.evaluate(async () => {
  const registration = await navigator.serviceWorker.ready
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()
    const timer = setTimeout(() => reject(new Error('status timeout')), 15000)
    channel.port1.onmessage = ({ data }) => { clearTimeout(timer); channel.port1.close(); resolve(data) }
    registration.active.postMessage({ command: 'status' }, [channel.port2])
  })
})
async function record(name, run) {
  const at = performance.now()
  try { const proof = await run(); results.push({ name, outcome: 'PASS', durationMs: performance.now() - at, proof }); console.log('PASS: ' + name) }
  catch (error) { results.push({ name, outcome: 'FAIL', durationMs: performance.now() - at, error: error.message }); throw error }
}
try {
  await record('cold built Web project after browser restart, content server stopped and offline', async () => {
    const server = await serve(); let browser = await launch('cold-profile')
    await browser.page.goto(server.url + '/parametres'); await prepared(browser.page)
    const before = await browser.page.getByTestId('offline-project').textContent()
    await browser.close(); await server.close()
    browser = await launch('cold-profile'); await browser.context.setOffline(true)
    const responses = []
    browser.page.on('response', (r) => responses.push({ url: r.url(), status: r.status(), serviceWorker: r.fromServiceWorker() }))
    await browser.page.goto(server.url + '/projet?qualification=1#fixture')
    await expect(browser.page.getByTestId('offline-project')).toHaveText(before)
    await expect(browser.page.getByText('Démonstration prête hors ligne', { exact: true })).toBeVisible()
    await expect(browser.page).toHaveTitle('Jaquette — Projet')
    for (const [path, title] of [['/accueil', 'Accueil'], ['/parametres', 'Paramètres'], ['/fondations', 'Fondations'], ['/404', 'Écran introuvable'], ['/projet/', 'Projet']]) {
      await browser.page.goto(server.url + path)
      await expect(browser.page).toHaveTitle('Jaquette — ' + title)
      await expect(browser.page.getByTestId('offline-project')).toHaveText(before)
    }
    await browser.page.goBack(); await expect(browser.page).toHaveTitle('Jaquette — Écran introuvable')
    await browser.page.goForward(); await expect(browser.page).toHaveTitle('Jaquette — Projet')
    const fonts = await browser.page.evaluate(async () => { await document.fonts.ready; return Array.from(document.fonts).filter((font) => font.status === 'loaded').map((font) => font.family) })
    expect(fonts.some((font) => font.includes('Manrope'))).toBe(true)
    expect(responses.filter((r) => r.status >= 200 && r.status < 400 && !r.serviceWorker)).toEqual([])
    expect(await browser.page.evaluate(() => fetch('/arbitrary-missing.js').then(() => 'unexpected').catch(() => 'refused'))).toBe('refused')
    await browser.page.screenshot({ path: join(output, 'cold-project.png'), fullPage: true })
    await browser.close()
    const fresh = await launch('unprepared-profile'); await fresh.context.setOffline(true)
    let unavailable = false
    try { await fresh.page.goto(server.url + '/projet', { timeout: 15000 }) } catch { unavailable = true }
    expect(unavailable).toBe(true); await fresh.close()
    return { buildId: manifest.buildId, marker: before, fonts, responses, serverStopped: true, browserRestarted: true, httpCacheDisabled: true, networkMethod: 'owned context offline; not physical cable removal', freshOfflineProfileUnavailable: unavailable }
  })
  await record('incomplete font cache cannot publish ready or create a project', async () => {
    const server = await serve(); server.state.mode = 'font-failure'
    const browser = await launch('incomplete-profile'); await browser.page.goto(server.url + '/parametres')
    await browser.page.getByRole('button', { name: 'Préparer la démonstration hors ligne', exact: true }).click()
    await expect(browser.page.getByRole('alert')).toContainText('Préparation hors ligne impossible', { timeout: 30000 })
    expect((await workerStatus(browser.page)).buildId).toBe(null)
    await expect(browser.page.getByTestId('offline-project')).toHaveCount(0)
    await browser.close(); await server.close(); return { noReady: true, noProjectCreated: true }
  })
  await record('failed replacement preserves last ready generation and private fixture; corruption detected', async () => {
    const server = await serve(); const browser = await launch('update-profile')
    await browser.page.goto(server.url + '/parametres'); await prepared(browser.page)
    const old = await workerStatus(browser.page)
    server.state.mode = 'update-failure'
    await browser.page.getByRole('button', { name: 'Préparer la démonstration hors ligne', exact: true }).click()
    await expect(browser.page.getByRole('alert')).toContainText('Préparation hors ligne impossible', { timeout: 30000 })
    expect((await workerStatus(browser.page)).buildId).toBe(old.buildId)
    await expect(browser.page.getByTestId('offline-project')).toHaveAttribute('data-project-id', 'T75-synthetic-project')
    await browser.page.evaluate(async () => {
      for (const name of await caches.keys()) {
        if (!name.startsWith('jaquette-public-assets-')) continue
        const cache = await caches.open(name)
        for (const request of await cache.keys()) if (request.url.endsWith('.woff2')) { await cache.delete(request); break }
      }
    })
    expect((await workerStatus(browser.page)).buildId).toBe(null)
    await browser.page.reload()
    await expect(browser.page.getByText('Démonstration non préparée ou copie locale incomplète', { exact: true })).toBeVisible()
    await expect(browser.page.getByTestId('offline-project')).toHaveAttribute('data-project-id', 'T75-synthetic-project')
    await browser.close(); await server.close(); return { previousReadyPreserved: true, missingFontDetected: true, privateProjectPreserved: true }
  })
  await record('corrupt private fixture is diagnosed and never overwritten by preparation', async () => {
    const server = await serve(); const browser = await launch('corrupt-profile')
    await browser.page.goto(server.url + '/parametres'); await prepared(browser.page)
    await browser.page.evaluate(() => new Promise((resolve, reject) => {
      const request = indexedDB.open('jaquette-T75-qualification', 1)
      request.onsuccess = () => {
        const db = request.result; const tx = db.transaction('qualification', 'readwrite')
        tx.objectStore('qualification').put({ marker: 'corrupt-sentinel' }, 'project')
        tx.oncomplete = () => { db.close(); resolve() }; tx.onerror = reject
      }; request.onerror = reject
    }))
    await browser.page.reload()
    await expect(browser.page.getByRole('alert')).toContainText('illisible')
    await browser.page.getByRole('button', { name: 'Préparer la démonstration hors ligne', exact: true }).click()
    await expect(browser.page.getByRole('alert')).toContainText('non remplacé', { timeout: 30000 })
    await browser.page.reload(); await expect(browser.page.getByRole('alert')).toContainText('illisible')
    await browser.close(); await server.close(); return { corruptedFixturePreserved: true, noFalseReady: true }
  })
  await record('injected browser Cache quota failure preserves last ready generation and project', async () => {
    const server = await serve(); const browser = await launch('quota-profile')
    await browser.page.goto(server.url + '/parametres'); await prepared(browser.page)
    const before = await workerStatus(browser.page)
    const worker = browser.context.serviceWorkers()[0]
    await worker.evaluate(() => {
      globalThis.__T75_originalPut = Cache.prototype.put
      Cache.prototype.put = async () => { throw new DOMException('T75 controlled quota injection', 'QuotaExceededError') }
    })
    await browser.page.getByRole('button', { name: 'Préparer la démonstration hors ligne', exact: true }).click()
    await expect(browser.page.getByRole('alert')).toContainText('Préparation hors ligne impossible', { timeout: 30000 })
    expect((await workerStatus(browser.page)).buildId).toBe(before.buildId)
    await expect(browser.page.getByText('Démonstration prête hors ligne', { exact: true })).toBeVisible()
    await expect(browser.page.getByTestId('offline-project')).toHaveAttribute('data-project-id', 'T75-synthetic-project')
    await worker.evaluate(() => { Cache.prototype.put = globalThis.__T75_originalPut; delete globalThis.__T75_originalPut })
    await browser.close(); await server.close()
    return { injected: true, realQuotaExhaustion: false, previousReadyPreserved: true, projectPreserved: true }
  })
  await record('browser closure during replacement leaves previous complete generation readable', async () => {
    const server = await serve(); let browser = await launch('interrupted-profile')
    await browser.page.goto(server.url + '/parametres'); await prepared(browser.page)
    const before = await workerStatus(browser.page)
    server.state.mode = 'interrupted'
    await browser.page.getByRole('button', { name: 'Préparer la démonstration hors ligne', exact: true }).click()
    await expect.poll(() => !!server.state.pending, { timeout: 15000 }).toBe(true)
    await browser.close()
    server.state.pending.destroy(); server.state.mode = 'normal'
    browser = await launch('interrupted-profile'); await browser.page.goto(server.url + '/projet')
    expect((await workerStatus(browser.page)).buildId).toBe(before.buildId)
    await expect(browser.page.getByText('Démonstration prête hors ligne', { exact: true })).toBeVisible()
    await expect(browser.page.getByTestId('offline-project')).toHaveAttribute('data-token-id', 'T75-chapter-1:word-1')
    await browser.close(); await server.close()
    return { closedDuringPendingResponse: true, previousReadyPreserved: true, projectPreserved: true, osCrashOrPowerLoss: false }
  })
} catch (error) {
  process.exitCode = 1
  if (currentPage && !currentPage.isClosed()) await currentPage.screenshot({ path: join(output, 'failure.png') }).catch(() => {})
  console.error(error.message)
} finally {
  for (const context of contexts) await context.close().catch(() => {})
  for (const server of servers) await new Promise((done) => server.close(done))
  const report = { sha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), dirty: !!execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim(), command: process.argv.slice(1), started, ended: new Date().toISOString(), durationMs: performance.now() - start, node: process.version, platform: process.platform, versions, results, requests, limits: ['Web qualification fixture only; no .jacq format.', 'No Electron, installer, hardware, cable-removal or human workshop proof.', 'Real quota exhaustion and abrupt browser/OS crash not qualified.'] }
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2), { flag: 'wx' })
  console.log(JSON.stringify({ passed: results.filter((r) => r.outcome === 'PASS').length, failed: results.filter((r) => r.outcome === 'FAIL').length, durationMs: report.durationMs }))
}
