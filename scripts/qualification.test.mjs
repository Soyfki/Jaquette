import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { test } from 'node:test'
import { readAsset, readManifest, verifyBytes } from './reference-manifest.mjs'
import { referenceDownloadUrl } from './reference-source.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = readManifest(root)
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const checker = join(root, 'scripts', 'check-reference-integrity.mjs')
const prepare = join(root, 'scripts', 'prepare-references.mjs')
const secretChecker = join(root, 'scripts', 'check-secrets.mjs')

function temporary(t) {
  const parent = resolve(tmpdir())
  const directory = mkdtempSync(join(parent, 'jaquette-0-2-'))
  t.after(() => {
    // Only the exact mkdtemp child owned by this test may be removed.
    assert.equal(dirname(resolve(directory)), parent)
    assert.ok(directory.startsWith(join(parent, 'jaquette-0-2-')))
    rmSync(directory, { recursive: true, force: true })
  })
  return directory
}

function isolatedCorpus(t) {
  const directory = temporary(t)
  mkdirSync(join(directory, 'reference-data'))
  copyFileSync(join(root, 'reference-data', 'manifest.json'), join(directory, 'reference-data', 'manifest.json'))
  for (const asset of manifest.assets) {
    // No synthetic hashes stand in for the mandatory canonical positive case.
    const bytes = readAsset(root, asset)
    const destination = join(directory, 'reference-data', 'files', asset.file)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, bytes)
  }
  return directory
}

function run(script, directory) {
  return spawnSync(process.execPath, [script, '--root', directory], { encoding: 'utf8' })
}

function mustFail(result, pattern) {
  assert.ifError(result.error)
  assert.equal(typeof result.status, 'number')
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, pattern)
}

test('complete canonical corpus succeeds, then preparation rechecks all existing files', (t) => {
  const directory = isolatedCorpus(t)
  for (const script of [checker, prepare]) {
    const result = run(script, directory)
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /6\/6/)
    assert.doesNotMatch(result.stdout, /GET /)
  }
})

test('missing mandatory file fails', (t) => {
  const directory = isolatedCorpus(t)
  rmSync(join(directory, 'reference-data', 'files', manifest.assets[0].file))
  mustFail(run(checker, directory), /absente ou illisible/)
})

test('one altered byte at unchanged size fails and preparation preserves it', (t) => {
  const directory = isolatedCorpus(t)
  const file = join(directory, 'reference-data', 'files', manifest.assets[0].file)
  const bytes = readFileSync(file)
  bytes[bytes.length - 1] ^= 1
  writeFileSync(file, bytes)
  mustFail(run(checker, directory), /SHA-256/)
  mustFail(run(prepare, directory), /SHA-256/)
  assert.deepEqual(readFileSync(file), bytes)
})

test('unreadable resource (directory instead of file) fails on Windows and Linux', (t) => {
  const directory = isolatedCorpus(t)
  const file = join(directory, 'reference-data', 'files', manifest.assets[0].file)
  rmSync(file)
  mkdirSync(file)
  mustFail(run(checker, directory), /absente ou illisible/)
})

test('truncated file fails size and hash checks', (t) => {
  const directory = isolatedCorpus(t)
  const file = join(directory, 'reference-data', 'files', manifest.assets[0].file)
  writeFileSync(file, readFileSync(file).subarray(1))
  mustFail(run(checker, directory), /taille .*SHA-256/)
})

for (const [name, mutate] of [
  ['invalid JSON', () => '{'],
  ['invalid shape', () => 'null'],
  ['empty corpus', (value) => { value.assets = []; return JSON.stringify(value) }],
  ['omitted reference', (value) => { value.assets.pop(); return JSON.stringify(value) }],
  ['incorrect declared size', (value) => { value.assets[0].sizeBytes += 1; return JSON.stringify(value) }],
  ['rewritten expected hash', (value) => { value.assets[0].sha256 = '0'.repeat(64); return JSON.stringify(value) }],
  ['duplicate reference', (value) => { value.assets[1] = value.assets[0]; return JSON.stringify(value) }],
  ['path outside corpus', (value) => { value.assets[0].file = '../outside.epub'; return JSON.stringify(value) }],
]) {
  test(`manifest rejection: ${name}`, (t) => {
    const directory = temporary(t)
    mkdirSync(join(directory, 'reference-data'))
    writeFileSync(join(directory, 'reference-data', 'manifest.json'), mutate(globalThis.structuredClone(manifest)))
    mustFail(run(checker, directory), /Manifeste/)
    mustFail(run(prepare, directory), /Manifeste/)
  })
}

test('missing manifest fails', (t) => {
  mustFail(run(checker, temporary(t)), /Manifeste absent/)
})

test('size is verified independently even when expected SHA matches', () => {
  const asset = manifest.assets[0]
  const bytes = readAsset(root, asset)
  assert.throws(() => verifyBytes({ ...asset, sizeBytes: asset.sizeBytes + 1 }, bytes), /taille/)
})

test('explicit French and English archives retain all six canonical expectations', () => {
  const french = manifest.assets.find((asset) => asset.id === 'epub-fr-primary')
  const english = manifest.assets.find((asset) => asset.id === 'epub-en')
  const archives = {
    'epub-fr-primary': `https://github.com/Soyfki/Jaquette/releases/download/fixtures-fr-reference-2026-08-21/epub-fr-primary-${french.sha256}.epub`,
    'epub-en': `https://github.com/Soyfki/Jaquette/releases/download/fixtures-reference-2026-08-21/epub-en-${english.sha256}.epub`,
  }
  for (const asset of manifest.assets) {
    assert.equal(referenceDownloadUrl(asset), archives[asset.id] ?? asset.downloadUrl)
  }
})

for (const assetId of ['epub-en', 'epub-fr-primary']) {
for (const scenario of ['canonical', 'HTTP 404', 'altered byte', 'truncated', 'oversized', 'network error', 'invalid existing file']) {
  test(`${assetId} archive acquisition: ${scenario}, with no fallback or overwrite`, (t) => {
    const directory = isolatedCorpus(t)
    const asset = manifest.assets.find((item) => item.id === assetId)
    const destination = join(directory, manifest.localDirectory, asset.file)
    const bytes = readFileSync(destination)
    rmSync(destination)
    if (['altered byte', 'invalid existing file'].includes(scenario)) bytes[bytes.length - 1] ^= 1
    if (scenario === 'invalid existing file') writeFileSync(destination, bytes)
    const responseFile = join(directory, 'response.epub')
    writeFileSync(responseFile, scenario === 'truncated' ? bytes.subarray(1) : bytes)
    if (scenario === 'oversized') writeFileSync(responseFile, new globalThis.Uint8Array(asset.sizeBytes + 1))
    const requestsFile = join(directory, 'requests.jsonl')
    const stub = join(directory, 'fetch-stub.mjs')
    // Override fetch only in the isolated child process. Production still uses
    // the real network, and the CLI's real exit code and exclusive write are tested.
    writeFileSync(stub, `
      import { appendFileSync, readFileSync } from 'node:fs'
      globalThis.fetch = async (url) => {
        appendFileSync(${JSON.stringify(requestsFile)}, JSON.stringify(url) + '\\n')
        if (url !== ${JSON.stringify(referenceDownloadUrl(asset))}) throw new Error('unexpected source')
        if (${JSON.stringify(scenario)} === 'network error') throw new Error('network unavailable')
        return new Response(readFileSync(${JSON.stringify(responseFile)}), { status: ${scenario === 'HTTP 404' ? 404 : 200} })
      }
    `)
    const result = spawnSync(process.execPath, ['--import', pathToFileURL(stub).href, prepare, '--root', directory], { encoding: 'utf8' })
    const requests = existsSync(requestsFile) ? readFileSync(requestsFile, 'utf8').trim().split('\n').map((line) => JSON.parse(line)) : []
    assert.deepEqual(requests, scenario === 'invalid existing file' ? [] : [referenceDownloadUrl(asset)])
    if (scenario === 'canonical') {
      assert.equal(result.status, 0, result.stderr)
      assert.deepEqual(readAsset(directory, asset), bytes)
      assert.match(result.stdout, /Archive canonique explicite/)
    } else {
      mustFail(result, /BLOCKED préparation/)
      if (scenario === 'invalid existing file') assert.deepEqual(readFileSync(destination), bytes)
      else assert.equal(existsSync(destination), false, 'Rejected bytes must never be installed')
    }
  })
}

}

for (const extension of ['yaml', 'yml']) {
  test(`secret scanning includes .github/workflows/*.${extension}`, (t) => {
    const directory = temporary(t)
    const workflows = join(directory, '.github', 'workflows')
    mkdirSync(workflows, { recursive: true })
    const file = join(workflows, `example.${extension}`)
    writeFileSync(file, 'name: harmless\non: push\n')
    const invoke = () => spawnSync(process.execPath, [secretChecker], { cwd: directory, encoding: 'utf8' })
    assert.equal(invoke().status, 0)
    // Synthetic detector input only; never a real credential.
    writeFileSync(file, ['env:', '  VALUE: gh' + 'p_' + 'A'.repeat(24)].join('\n'))
    mustFail(invoke(), /jeton GitHub/)
  })
}

for (const stage of ['typecheck', 'check:reference', 'test:e2e']) {
  test(`complete command propagates ${stage} failure in an isolated package`, (t) => {
    assert.ok(process.env.npm_execpath, 'Lancer via pnpm test:tooling')
    const directory = stage === 'check:reference' ? isolatedCorpus(t) : temporary(t)
    const scripts = { ...packageJson.scripts }
    // Exercise the real validate/validate:all command graph. Only leaf commands
    // are stubs, so no tools, corpus or application state in the checkout changes.
    for (const key of Object.keys(scripts)) {
      if (!['validate', 'validate:all'].includes(key)) scripts[key] = 'node -e "process.exit(0)"'
    }
    scripts[stage] = 'node -e "process.exit(23)"'
    if (stage === 'check:reference') {
      rmSync(join(directory, 'reference-data', 'files', manifest.assets[0].file))
      scripts[stage] = `node "${checker.replaceAll('\\', '/')}"`
    }
    writeFileSync(join(directory, 'package.json'), JSON.stringify({ ...packageJson, scripts }))
    const result = spawnSync(process.execPath, [process.env.npm_execpath, 'validate:all'], {
      cwd: directory, encoding: 'utf8',
    })
    assert.ifError(result.error)
    assert.equal(typeof result.status, 'number')
    assert.notEqual(result.status, 0)
    assert.match(result.stdout + result.stderr, stage === 'check:reference' ? /absente ou illisible/ : /23/)
    console.log(`validate:all / ${stage} injected failure => exit ${result.status}`)
  })
}
