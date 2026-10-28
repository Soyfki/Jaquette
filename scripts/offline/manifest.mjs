import { readdir, readFile, writeFile, lstat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join, relative, resolve } from 'node:path'

const root = resolve('dist')
const assets = []
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if ((await lstat(path)).isSymbolicLink()) throw new Error('Symlink in build')
    if (entry.isDirectory()) await walk(path)
    else {
      const url = '/' + relative(root, path).replaceAll('\\', '/')
      if (['/offline-manifest.json', '/sw.js'].includes(url)) continue
      const bytes = await readFile(path)
      assets.push({ url, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') })
    }
  }
}
await walk(root)
assets.sort((a, b) => a.url.localeCompare(b.url, 'en'))
const buildId = createHash('sha256').update(JSON.stringify(assets)).digest('hex')
await writeFile(join(root, 'offline-manifest.json'), JSON.stringify({ buildId, assets }))
console.log(`Offline public assets: ${assets.length}, build ${buildId}`)
