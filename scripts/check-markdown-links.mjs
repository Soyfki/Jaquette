import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'

const root = process.cwd()
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'playwright-report', 'test-results'])
const markdownFiles = []

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue
    const path = join(directory, entry)
    const stats = statSync(path)
    if (stats.isDirectory()) walk(path)
    else if (extname(entry).toLowerCase() === '.md') markdownFiles.push(path)
  }
}

walk(root)

const missing = []
const markdownLink = /\[[^\]]*\]\(([^)]+)\)/g

for (const file of markdownFiles) {
  const content = readFileSync(file, 'utf8')
  for (const match of content.matchAll(markdownLink)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, '')
    if (!rawTarget || rawTarget.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(rawTarget)) continue
    const targetWithoutFragment = rawTarget.split('#', 1)[0].split('?', 1)[0]
    if (!targetWithoutFragment) continue
    const target = resolve(dirname(file), decodeURIComponent(targetWithoutFragment))
    if (!existsSync(target)) missing.push(`${file.slice(root.length + 1)} -> ${rawTarget}`)
  }
}

if (missing.length > 0) {
  console.error(`Liens Markdown relatifs manquants:\n${missing.join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`${markdownFiles.length} fichiers Markdown vérifiés : aucun lien relatif manquant.`)
}
