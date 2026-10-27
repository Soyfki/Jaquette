/* global self, caches, crypto, Response, URL, TextEncoder, fetch */
const prefix = 'jaquette-public-assets-'
const marker = '/__jaquette_public_assets_ready__'
const routes = new Set(['/', '/accueil', '/connexion', '/projet', '/parametres', '/fondations', '/404'])
const digest = async (bytes) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).map((byte) => byte.toString(16).padStart(2, '0')).join('')
function valid(value) {
  return value && /^[a-f0-9]{64}$/.test(value.buildId) && Array.isArray(value.assets) && value.assets.length > 0 && value.assets.length < 200 &&
    value.assets.some((a) => a.url === '/index.html') && new Set(value.assets.map((a) => a.url)).size === value.assets.length &&
    value.assets.every((a) => typeof a.url === 'string' && /^\/[a-zA-Z0-9_./-]+$/.test(a.url) && !a.url.includes('..') &&
      !['/sw.js', '/offline-manifest.json', marker].includes(a.url) && Number.isSafeInteger(a.bytes) && a.bytes > 0 &&
      a.bytes <= 20 * 1024 ** 2 && /^[a-f0-9]{64}$/.test(a.sha256))
}
async function verify(cache, manifest) {
  if (!valid(manifest) || await digest(new TextEncoder().encode(JSON.stringify(manifest.assets))) !== manifest.buildId) return false
  for (const asset of manifest.assets) {
    const response = await cache.match(asset.url)
    if (!response?.ok) return false
    const bytes = await response.arrayBuffer()
    if (bytes.byteLength !== asset.bytes || await digest(bytes) !== asset.sha256) return false
  }
  return true
}
async function ready(verifyAll = false) {
  for (const name of (await caches.keys()).filter((n) => n.startsWith(prefix)).reverse()) {
    const cache = await caches.open(name)
    const saved = await cache.match(marker)
    if (!saved) continue
    try {
      const manifest = await saved.json()
      if (valid(manifest) && (!verifyAll || await verify(cache, manifest))) return { cache, manifest }
    } catch { /* Partial/corrupt generations are never ready. */ }
  }
  return null
}
let preparing = null
async function prepare() {
  const response = await fetch('/offline-manifest.json', { cache: 'no-store', redirect: 'error' })
  if (!response.ok) throw new Error('MANIFEST_UNAVAILABLE')
  const manifest = await response.json()
  if (!valid(manifest)) throw new Error('INVALID_MANIFEST')
  const candidate = await caches.open(prefix + manifest.buildId + '-' + crypto.randomUUID())
  for (const asset of manifest.assets) {
    const response = await fetch(asset.url, { cache: 'no-store', redirect: 'error' })
    if (!response.ok || response.type === 'opaque') throw new Error('ASSET_UNAVAILABLE')
    const bytes = await response.arrayBuffer()
    if (bytes.byteLength !== asset.bytes || await digest(bytes) !== asset.sha256) throw new Error('ASSET_INTEGRITY')
    await candidate.put(asset.url, new Response(bytes, { headers: response.headers }))
  }
  if (!await verify(candidate, manifest)) throw new Error('CACHE_INCOMPLETE')
  // Only public application assets. Keep private IndexedDB and previous ready generations intact.
  await candidate.put(marker, new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } }))
  return manifest.buildId
}
self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('message', (event) => {
  event.waitUntil((async () => {
    const port = event.ports[0]
    if (!port) return
    try {
      if (!event.source || new URL(event.source.url).origin !== self.location.origin || !event.data ||
          Object.keys(event.data).join(',') !== 'command' || !['prepare', 'status'].includes(event.data.command)) throw new Error('INVALID_MESSAGE')
      if (event.data.command === 'prepare') {
        if (!preparing) preparing = prepare().finally(() => { preparing = null })
        port.postMessage({ ok: true, buildId: await preparing })
      } else port.postMessage({ ok: true, buildId: (await ready(true))?.manifest.buildId ?? null })
    } catch { port.postMessage({ ok: false, error: 'OFFLINE_PREPARATION_UNAVAILABLE' }) }
  })())
})
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin || event.request.method !== 'GET') return
  event.respondWith((async () => {
    const navigation = event.request.mode === 'navigate'
    const path = url.pathname.replace(/\/+$/, '') || '/'
    const current = await ready(navigation)
    if (current) {
      if (navigation && routes.has(path)) return current.cache.match('/index.html')
      if (!url.search && current.manifest.assets.some((a) => a.url === url.pathname)) {
        const response = await current.cache.match(url.pathname)
        if (response) return response
      }
    }
    return fetch(event.request)
  })())
})
