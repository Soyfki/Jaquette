import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { zip } from './corpus.mjs'

const source = 'scripts/measurement', output = resolve('test-results/measurement-kit')
mkdirSync(output, { recursive: true })
const files = ['FORMULAIRE.md', 'RELEVER-WINDOWS.cmd', 'collect-windows.ps1', 'RELEVER-MAC.command', 'collect-macos.js', 'essai-materiel.html']
const entries = files.map(path => {
  let value = readFileSync(join(source, path), 'utf8').replaceAll('\r\n', '\n')
  if (path.endsWith('.cmd') || path.endsWith('.ps1')) value = value.replaceAll('\n', '\r\n')
  // Windows PowerShell 5.1 recognizes UTF-8 with BOM.
  if (path.endsWith('.ps1')) value = '\ufeff' + value
  return [path, Buffer.from(value)]
})
const hashes = entries.map(([path, data]) => `${createHash('sha256').update(data).digest('hex')}  ${path}`).join('\n') + '\n'
entries.push(['SHA256SUMS.txt', Buffer.from(hashes)])
for (const [path, data] of entries) writeFileSync(join(output, path), data)
const archive = zip(entries)
writeFileSync(resolve('test-results/jaquette-releve-0.4.zip'), archive)
console.log(JSON.stringify({ archive: 'test-results/jaquette-releve-0.4.zip', bytes: archive.length, sha256: createHash('sha256').update(archive).digest('hex'), files }, null, 2))
