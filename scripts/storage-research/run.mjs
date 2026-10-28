import { mkdir, writeFile, readdir, stat, rename } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'
import { platform, release } from 'node:os'
import { performance } from 'node:perf_hooks'
import { LaboratoryStore, fixture, preflight, untouchedWrites } from './store.mjs'

const args = process.argv.slice(2)
if (args.length === 1 && args[0] === '--help') {
  console.log('T74 research ONLY. --adapter directory|append|monolith --fixture small|large --output NEW_DIRECTORY [--bytes N]')
  console.log('small defaults 1 MiB / 3 chapters; large defaults 5_000_000_000 real bytes / 100 chapters. No cleanup. OPFS unavailable => NOT_PROVEN, never a fake Node fallback.')
  process.exit(0)
}
const options = {}
for (let i = 0; i < args.length; i += 2) {
  if (!['--adapter', '--fixture', '--output', '--bytes'].includes(args[i]) || !args[i + 1] || Object.hasOwn(options, args[i])) throw new Error('INVALID_ARGUMENTS')
  options[args[i]] = args[i + 1]
}
if (!['directory', 'append', 'monolith'].includes(options['--adapter']) || !['small', 'large'].includes(options['--fixture']) || !options['--output']) throw new Error('Use --help; unsupported adapters are not emulated.')
const adapter = options['--adapter']
const size = Number(options['--bytes'] ?? (options['--fixture'] === 'large' ? 5_000_000_000 : 1024 ** 2))
if (!Number.isSafeInteger(size) || size <= 0 || size > 5_000_000_000) throw new Error('INVALID_SIZE')
const output = resolve(options['--output'])
const space = await preflight(dirname(output), size)
await mkdir(output) // Existing targets are never replaced or cleaned.
const started = new Date().toISOString(); const start = performance.now()
const events = []
const event = (value) => events.push({ milliseconds: performance.now() - start, ...value })
let result
try {
  const store = new LaboratoryStore(join(output, 'source'), adapter, { event })
  await store.create(fixture(options['--fixture'] === 'large' ? 100 : 3))
  const initial = await store.read(); const from = events.length
  await store.mutateChapter({ expectedGeneration: 1, growth: 10000, mediaBytes: size })
  const mutation = events.slice(from)
  const beforeDedup = (await store.read()).state
  // Repeat same media only on small runs; do not silently double a 5 GB campaign.
  if (size <= 256 * 1024 ** 2) await store.mutateChapter({ expectedGeneration: 2, mediaBytes: size })
  const latest = await store.read()
  const portable = await store.exportTo(join(output, 'portable'))
  const imported = await portable.exportTo(join(output, 'imported'))
  await rename(store.root, join(output, 'source-unavailable'))
  await rename(portable.root, join(output, 'portable-unavailable'))
  const independent = await imported.read()
  const allocated = async (root) => {
    let bytes = 0
    for (const entry of await readdir(root, { withFileTypes: true })) {
      const path = join(root, entry.name)
      bytes += entry.isDirectory() ? await allocated(path) : (await stat(path)).size
    }
    return bytes
  }
  result = {
    outcome: adapter === 'monolith' ? 'NO_GO' : 'NOT_PROVEN',
    apiUntouchedChapterWrites: untouchedWrites(mutation, initial.state).length,
    negativeControlExpected: adapter === 'monolith',
    independentPhysicalTrace: 'NOT_EXECUTED',
    durablePowerLossOrOsCrash: 'NOT_PROVEN', realQuotaExhaustion: 'NOT_EXECUTED',
    sourceInaccessibleDuringImportRead: true,
    selfContained: JSON.stringify(independent.chapters) === JSON.stringify(latest.chapters),
    generation: independent.state.generation,
    mediaCount: Object.keys(independent.state.media).length,
    dedupReusedReference: JSON.stringify(Object.values(beforeDedup.media)[0]) === JSON.stringify(Object.values(latest.state.media)[0]),
    logicalAllocatedBytes: await allocated(output),
    apiWriteBytes: events.filter((e) => e.operation === 'write').reduce((n, e) => n + e.bytes, 0),
    apiExportWriteBytes: events.filter((e) => e.operation === 'export-write').reduce((n, e) => n + e.bytes, 0),
    limits: ['Logical file sizes are not physical allocation.', 'API trace cannot certify physical writes.', 'File sync + rename does not qualify directory durability.', 'Failed/stale writer lock requires explicit recovery; no automatic takeover.', 'Not a product format; no production adoption.'],
  }
} catch (error) {
  result = { outcome: 'FAILED', error: error.code ?? error.message }
  process.exitCode = 1
} finally {
  const metadata = {
    adapter, fixture: options['--fixture'], mediaBytes: size, seed: 73, started,
    ended: new Date().toISOString(), durationMs: performance.now() - start,
    node: process.version, platform: platform(), release: release(),
    command: process.argv.slice(1),
    sha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    dirty: !!execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim(),
    space, maxRssKiB: process.resourceUsage().maxRSS, memoryAtEnd: process.memoryUsage(), result,
  }
  await writeFile(join(output, 'api-events.json'), JSON.stringify(events), { flag: 'wx' })
  await writeFile(join(output, 'report.json'), JSON.stringify(metadata, null, 2), { flag: 'wx' })
  console.log(JSON.stringify(metadata, null, 2))
}
