import { Buffer } from 'node:buffer'
import { lstatSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { readAsset, readManifest, rootArgument, verifyBytes } from './reference-manifest.mjs'

try {
  const root = rootArgument()
  const manifest = readManifest(root)
  const failures = []
  for (const asset of manifest.assets) {
    try {
      const destination = join(root, manifest.localDirectory, asset.file)
      const existing = lstatSync(destination, { throwIfNoEntry: false })
      if (existing) {
        readAsset(root, asset)
        console.log(`PASS déjà présent et vérifié : ${asset.file}`)
        continue
      }
      console.log(`GET ${asset.downloadUrl}`)
      const response = await globalThis.fetch(asset.downloadUrl, {
        signal: globalThis.AbortSignal.timeout(30_000),
        headers: { 'User-Agent': 'Jaquette-reference-validation/0.0.0 (https://github.com/Soyfki/Jaquette)' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      // Read a bounded body; never accept an upstream replacement or an HTML error page.
      const chunks = []
      let size = 0
      for await (const chunk of response.body) {
        size += chunk.length
        if (size > asset.sizeBytes) throw new Error(`taille téléchargée supérieure aux ${asset.sizeBytes} octets attendus (au moins ${size}) ; source modifiée ou réponse inattendue`)
        chunks.push(chunk)
      }
      const bytes = Buffer.concat(chunks)
      verifyBytes(asset, bytes)
      mkdirSync(dirname(destination), { recursive: true })
      // Exclusive creation preserves any file that appeared during the download.
      writeFileSync(destination, bytes, { flag: 'wx' })
      readAsset(root, asset)
      console.log(`PASS acquis et vérifié : ${asset.file} ; ${asset.sizeBytes} octets ; SHA-256 ${asset.sha256}`)
    } catch (error) {
      failures.push(`${asset.file} depuis ${asset.downloadUrl} : ${error.message} ; ${error.cause?.code ?? ''}`)
    }
  }
  if (failures.length) throw new Error(failures.join('\n'))
  console.log('6/6 références préparées ; licences et provenance conservées dans manifest.json et INVENTORY.md.')
} catch (error) {
  console.error(`BLOCKED préparation des références :\n${error.message}\nAucun manifeste ni fichier existant remplacé. Récupérer les octets canoniques ; ne pas substituer un EPUB personnel.`)
  process.exitCode = 1
}
