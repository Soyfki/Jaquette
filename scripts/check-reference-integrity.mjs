import { readAsset, readManifest, rootArgument } from './reference-manifest.mjs'

try {
  const root = rootArgument()
  const manifest = readManifest(root)
  const failures = []
  for (const asset of manifest.assets) {
    try {
      readAsset(root, asset)
      console.log(`PASS ${asset.file} : ${asset.sizeBytes} octets ; SHA-256 ${asset.sha256}`)
    } catch (error) {
      failures.push(error.message)
    }
  }
  if (failures.length) throw new Error(failures.join('\n'))
  console.log('6/6 ressources obligatoires conformes au manifeste canonique.')
} catch (error) {
  console.error(`FAIL intégrité des références :\n${error.message}`)
  process.exitCode = 1
}
