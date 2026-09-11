import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// JSON.stringify of the canonical manifest at d7ddeea09f3fc60146454b935192cb3d1c91ee54.
// Whitespace/CRLF changes are harmless; changing the corpus requires a separate decision.
export const canonicalManifestSha256 = '183af98c06d5478330c2a99396a6cc8a6243589a3d5e6a3743aaf02329224b75'
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')

export function readManifest(root) {
  let manifest
  try {
    manifest = JSON.parse(readFileSync(join(root, 'reference-data', 'manifest.json'), 'utf8'))
  } catch (error) {
    throw new Error(`Manifeste absent, illisible ou JSON invalide : ${error.code ?? error.message}`, { cause: error })
  }
  if (sha256(JSON.stringify(manifest)) !== canonicalManifestSha256) {
    throw new Error('Manifeste invalide : contenu différent du manifeste canonique (six ressources, tailles, empreintes et provenance). Ne pas recalculer les empreintes pour passer la campagne.')
  }
  return manifest
}

export function verifyBytes(asset, bytes) {
  const errors = []
  if (bytes.length !== asset.sizeBytes) errors.push(`taille ${bytes.length}, attendue ${asset.sizeBytes}`)
  const actual = sha256(bytes)
  if (actual !== asset.sha256) errors.push(`SHA-256 ${actual}, attendu ${asset.sha256}`)
  if (errors.length) throw new Error(`${asset.file} : ${errors.join(' ; ')}`)
}

export function readAsset(root, asset) {
  let bytes
  try {
    bytes = readFileSync(join(root, 'reference-data', 'files', asset.file))
  } catch (error) {
    throw new Error(`${asset.file} : ressource obligatoire absente ou illisible (${error.code})`, { cause: error })
  }
  verifyBytes(asset, bytes)
  return bytes
}

export function rootArgument(args = process.argv.slice(2)) {
  if (args.length === 0) return process.cwd()
  if (args.length === 2 && args[0] === '--root' && args[1]) return resolve(args[1])
  throw new Error('Usage : node scripts/<commande>.mjs [--root <dossier de copie isolée>]')
}
