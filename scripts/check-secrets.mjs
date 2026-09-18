import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

const root = process.cwd()
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'playwright-report', 'test-results', 'reference-data', 'EPUB tests'])
const allowedExtensions = new Set(['', '.css', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.ts', '.tsx', '.yaml', '.yml'])
const findings = []
const privateKeyMarker = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ')
const patterns = [
  ['clé privée', new RegExp(privateKeyMarker, 'i')],
  ['jeton GitHub', /gh[pousr]_[A-Za-z0-9]{20,}/],
  ['clé AWS', /AKIA[0-9A-Z]{16}/],
  ['clé API de type sk', /sk-[A-Za-z0-9]{20,}/],
  ['secret assigné', /(?:password|passwd|api[_-]?key|secret)\s*[:=]\s*['"][^'"]{8,}['"]/i],
]

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue
    const path = join(directory, entry)
    const stats = statSync(path)
    if (stats.isDirectory()) {
      walk(path)
      continue
    }
    if (!allowedExtensions.has(extname(entry).toLowerCase())) continue
    const content = readFileSync(path, 'utf8')
    for (const [label, pattern] of patterns) {
      if (pattern.test(content)) findings.push(`${path.slice(root.length + 1)} : ${label}`)
    }
  }
}

walk(root)

if (findings.length > 0) {
  console.error(`Secrets potentiels détectés:\n${findings.join('\n')}`)
  process.exitCode = 1
} else {
  console.log('Aucun motif de secret courant détecté dans les nouveaux contenus textuels.')
}
