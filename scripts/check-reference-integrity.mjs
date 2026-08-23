import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(readFileSync(join(root, 'reference-data', 'manifest.json'), 'utf8'))
const referenceRoot = join(root, 'reference-data', 'files')
const checked = []
const absent = []
const mismatches = []

for (const asset of manifest.assets) {
  const path = join(referenceRoot, asset.file)
  if (!existsSync(path)) {
    absent.push(asset.file)
    continue
  }
  const actual = createHash('sha256').update(readFileSync(path)).digest('hex')
  if (actual !== asset.sha256) mismatches.push(`${asset.file}: ${actual}`)
  else checked.push(asset.file)
}

if (mismatches.length > 0) {
  console.error(`Empreintes de référence modifiées:\n${mismatches.join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`${checked.length} ressources locales vérifiées contre le manifeste ; ${absent.length} absentes et laissées hors dépôt.`)
}
