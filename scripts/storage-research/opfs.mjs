/* global Worker */
import { createServer } from 'node:http'
import { URL } from 'node:url'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { chromium } from '@playwright/test'

const [flag, directory] = process.argv.slice(2)
if (flag !== '--output' || !directory || process.argv.length !== 4) throw new Error('Usage: node scripts/storage-research/opfs.mjs --output NEW_DIRECTORY (64 MiB Chrome OPFS only)')
const output = resolve(directory)
await mkdir(output)
const worker = await readFile(new URL('./opfs-worker.js', import.meta.url))
const server = createServer((request, response) => {
  if (request.url === '/worker.js') { response.setHeader('Content-Type', 'text/javascript'); response.end(worker) }
  else if (request.url === '/') { response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><title>T74 synthetic storage laboratory</title>') }
  else { response.statusCode = 404; response.end() }
})
await new Promise((done) => server.listen(0, '127.0.0.1', done))
const url = `http://127.0.0.1:${server.address().port}`
const started = performance.now()
let context
let report
try {
  const run = async (mode) => {
    context = await chromium.launchPersistentContext(join(output, 'chrome-profile'), { channel: 'chrome', headless: true })
    const page = await context.newPage()
    await page.goto(url)
    const version = await page.evaluate(() => navigator.userAgent)
    const result = await page.evaluate((mode) => new Promise((resolve, reject) => {
      const worker = new Worker('/worker.js')
      worker.onerror = (e) => { worker.terminate(); reject(new Error(e.message)) }
      worker.onmessage = ({ data }) => { worker.terminate(); resolve(data) }
      worker.postMessage({ mode, bytes: 64 * 1024 ** 2 })
    }), mode)
    await context.close(); context = null
    return { version, result }
  }
  const initial = await run('create')
  if (!initial.result.ok) throw new Error(JSON.stringify(initial.result))
  const reopened = await run('read')
  if (!reopened.result.ok || JSON.stringify(initial.result.hashes) !== JSON.stringify(reopened.result.hashes)) throw new Error('INVALID_REOPEN')
  report = { initial, reopened, outcome: 'NOT_PROVEN', physicalIo: 'NOT_EXECUTED', crash: 'NOT_EXECUTED', quotaExhaustion: 'NOT_EXECUTED', exportImport: 'NOT_IMPLEMENTED', mediaFullIntegrity: 'NOT_PROVEN', limitation: 'Graceful Chrome restart and logical OPFS calls/hashes only; no physical partial-write or durability guarantee.' }
} catch (error) { report = { outcome: 'FAILED', error: error.message }; process.exitCode = 1 }
finally {
  await context?.close()
  await new Promise((done) => server.close(done))
  await writeFile(join(output, 'report.json'), JSON.stringify({ command: process.argv.slice(1), node: process.version, durationMs: performance.now() - started, report }, null, 2), { flag: 'wx' })
  console.log(JSON.stringify({ outcome: report.outcome, durationMs: performance.now() - started, error: report.error }))
}
