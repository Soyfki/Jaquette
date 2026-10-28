/* global Response */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { createHash, webcrypto } from 'node:crypto'
import { runInNewContext } from 'node:vm'
import { setImmediate } from 'node:timers/promises'
import { URL } from 'node:url'
import { TextEncoder } from 'node:util'

const source = await readFile(process.env.T75_WORKER_SOURCE || 'public/sw.js', 'utf8')
const hash = (value) => createHash('sha256').update(value).digest('hex')
console.log(JSON.stringify({ workerSha256: hash(source), source: process.env.T75_WORKER_SOURCE || 'public/sw.js' }))
const marker = '/__jaquette_public_assets_ready__'
function generation(label) {
  const bodies = new Map([['/app.js', label + ' script'], ['/style.css', label + ' css'], ['/index.html', label + ' HTML']])
  const assets = [...bodies].map(([url, body]) => ({ url, bytes: Buffer.byteLength(body), sha256: hash(body) }))
  const manifest = { assets, buildId: hash(JSON.stringify(assets)) }
  const entries = new Map([...bodies].map(([url, body]) => [url, new Response(body)]))
  entries.set(marker, new Response(JSON.stringify(manifest)))
  return { name: 'jaquette-public-assets-' + manifest.buildId, entries, manifest }
}
function host(generations, beforeMatch = async () => {}) {
  const handlers = new Map(); const reads = []
  const caches = {
    keys: async () => generations.map((generation) => generation.name),
    open: async (name) => ({ match: async (url) => {
      const generation = generations.find((generation) => generation.name === name)
      reads.push({ name, url })
      await beforeMatch(generation, url)
      return generation.entries.get(url)?.clone()
    } }),
  }
  runInNewContext(source, {
    self: { location: { origin: 'https://test.invalid' }, addEventListener: (name, handler) => handlers.set(name, handler) },
    caches, crypto: webcrypto, Response, URL, TextEncoder, fetch: async () => { throw new Error('offline') },
  })
  return { reads, fetch: async (path, mode = 'cors') => {
    let response
    handlers.get('fetch')({ request: { url: 'https://test.invalid' + path, method: 'GET', mode }, respondWith: (promise) => { response = promise } })
    return (await response).text()
  } }
}
for (const fault of ['altered', 'missing']) {
  test(`${fault} newer script: concurrent HTML/assets use the complete older generation`, async () => {
    const older = generation('older'); const newer = generation('newer')
    if (fault === 'missing') newer.entries.delete('/app.js')
    else newer.entries.set('/app.js', new Response('corrupt'))
    const worker = host([older, newer])
    assert.deepEqual(await Promise.all([worker.fetch('/projet', 'navigate'), worker.fetch('/app.js'), worker.fetch('/style.css')]), ['older HTML', 'older script', 'older css'])
    assert.equal(newer.entries.has(marker), true)
    assert.equal(newer.entries.has('/app.js'), fault !== 'missing')
  })
}
test('overlapping requests share one scan; later corruption triggers a fresh verification', async () => {
  const only = generation('only')
  let release; const gate = new Promise((resolve) => { release = resolve })
  let reached; const entered = new Promise((resolve) => { reached = resolve })
  let blocked = true
  const worker = host([only], async (_, url) => { if (url === '/app.js' && blocked) { reached(); await gate } })
  const burst = Promise.all(Array.from({ length: 6 }, () => worker.fetch('/app.js')))
  await entered; await setImmediate(); await setImmediate()
  const scans = worker.reads.filter((read) => read.url === marker).length
  blocked = false; release()
  assert.deepEqual(await burst, Array(6).fill('only script'))
  assert.equal(scans, 1, 'an overlapping burst must not run six full cache scans')
  only.entries.set('/app.js', new Response('corrupt after completed scan'))
  await assert.rejects(worker.fetch('/app.js'), /offline/)
  assert.ok(worker.reads.filter((read) => read.url === marker).length > scans)
  console.log(JSON.stringify({ requests: 6, overlappingGenerationScans: scans, laterCorruptionRefused: true }))
})
test('a script changed after its scan is checked again before serving, with older-generation recovery', async () => {
  const older = generation('older'); const newer = generation('newer')
  let release; const gate = new Promise((resolve) => { release = resolve })
  let reached; const entered = new Promise((resolve) => { reached = resolve })
  let blocked = true
  const worker = host([older, newer], async (generation, url) => {
    if (generation === newer && url === '/index.html' && blocked) { reached(); await gate }
  })
  const response = worker.fetch('/app.js')
  await entered
  newer.entries.set('/app.js', new Response('changed during verification'))
  blocked = false; release()
  assert.equal(await response, 'older script')
})
