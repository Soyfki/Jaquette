import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { crc32, inflateRawSync } from 'node:zlib'
import { JSDOM } from 'jsdom'
import { generate, mediaPlan, PRESETS, verify } from './corpus.mjs'
import { budgets, stats } from './contract.mjs'

function temp(t) {
  const parent = resolve(tmpdir()), dir = mkdtempSync(join(parent, 'jaquette-0-4-'))
  t.after(() => { assert.equal(dirname(resolve(dir)), parent); assert.ok(dir.startsWith(join(parent, 'jaquette-0-4-'))); rmSync(dir, { recursive: true, force: true }) })
  return dir
}
// Independent narrow ZIP reader for the emitted archive; checks local headers,
// central-directory offsets/counts, actual CRC and XML well-formedness.
function unzip(bytes) {
  const entries = new Map(), positions = new Map(); let offset = 0
  while (bytes.readUInt32LE(offset) === 0x04034b50) {
    const method = bytes.readUInt16LE(offset + 8), size = bytes.readUInt32LE(offset + 18)
    const nameLength = bytes.readUInt16LE(offset + 26), extra = bytes.readUInt16LE(offset + 28)
    const name = bytes.subarray(offset + 30, offset + 30 + nameLength).toString()
    assert.ok(!entries.has(name)); positions.set(name, offset)
    const begin = offset + 30 + nameLength + extra, compressed = bytes.subarray(begin, begin + size)
    const data = method === 0 ? compressed : inflateRawSync(compressed)
    assert.equal(data.length, bytes.readUInt32LE(offset + 22)); assert.equal(crc32(data), bytes.readUInt32LE(offset + 14))
    entries.set(name, data); offset = begin + size
  }
  const cdOffset = offset; let count = 0
  while (bytes.readUInt32LE(offset) === 0x02014b50) {
    const length = bytes.readUInt16LE(offset + 28)
    const name = bytes.subarray(offset + 46, offset + 46 + length).toString()
    assert.equal(bytes.readUInt32LE(offset + 42), positions.get(name))
    offset += 46 + length + bytes.readUInt16LE(offset + 30) + bytes.readUInt16LE(offset + 32); count++
  }
  assert.equal(bytes.readUInt32LE(offset), 0x06054b50); assert.equal(bytes.readUInt16LE(offset + 10), count)
  assert.equal(bytes.readUInt32LE(offset + 16), cdOffset); assert.equal(count, entries.size)
  assert.equal([...entries.keys()][0], 'mimetype'); assert.equal(bytes.readUInt16LE(8), 0)
  assert.equal(entries.get('mimetype').toString(), 'application/epub+zip')
  return entries
}

for (const preset of Object.keys(PRESETS)) test(`structure and counts ${preset}`, t => {
  const dir = join(temp(t), preset), p = PRESETS[preset]
  const m = generate({ output: dir, preset, seed: 20260918, mode: 'logical' })
  assert.equal(verify(dir).status, 'PASS'); assert.equal(m.materializedAudioBytes, 0)
  const entries = unzip(readFileSync(join(dir, 'book.epub')))
  assert.ok(readFileSync(join(dir, 'book.epub')).length <= 10000000)
  let words = 0, chapters = 0
  for (const [name, value] of entries) if (/\.(xml|opf|xhtml)$/.test(name)) {
    const doc = new JSDOM(value.toString(), { contentType: 'application/xml' }).window.document
    assert.equal(doc.querySelector('parsererror'), null)
    if (/chapter-\d+\.xhtml$/.test(name)) { words += doc.querySelector('#text').textContent.trim().split(/\s+/u).length; chapters++ }
    if (name.endsWith('package.opf')) { assert.equal(doc.querySelectorAll('itemref').length, p.chapters); assert.equal(doc.querySelectorAll('item').length, p.chapters + 1) }
  }
  assert.equal(words, p.words); assert.equal(chapters, p.chapters)
  const metadata = JSON.parse(readFileSync(join(dir, 'chapters.json')))
  assert.deepEqual(metadata.slice(0, 4).map(x => x.lang), ['fr', 'en', 'ar', 'ar'])
  assert.deepEqual(metadata.slice(0, 4).map(x => x.dir), ['ltr', 'ltr', 'rtl', 'rtl'])
  if (preset === 'reference') { assert.equal(metadata[0].firstToken, 'porte'); assert.equal(metadata[3].firstToken, 'door') }
  for (const [file, count] of [['annotations', p.annotations], ['bank', p.bankEntries], ['projects', p.projects], ['members', p.members]]) {
    const rows = readFileSync(join(dir, `${file}.jsonl`), 'utf8').trim().split('\n').map(JSON.parse)
    assert.equal(rows.length, count); assert.equal(new Set(rows.map(x => x.id)).size, count)
    if (file === 'annotations') for (const row of rows) { const c = metadata.find(x => x.id === row.chapter); assert.ok(c && row.fromWord >= 0 && row.toWord < c.words && row.fromWord <= row.toWord) }
    if (file === 'bank') assert.equal(rows.reduce((sum, x) => sum + x.logicalBytes, 0), p.bankBytes)
  }
})

test('identical seed produces byte-identical inventory including actual PCM; another seed changes it', t => {
  const root = temp(t), a = generate({ output: join(root, 'a'), preset: 'ci', mode: 'used' })
  const b = generate({ output: join(root, 'b'), preset: 'ci', mode: 'used' })
  assert.deepEqual(a, b); assert.equal(verify(join(root, 'b')).materializedAudioBytes, 1000000)
  const c = generate({ output: join(root, 'c'), preset: 'ci', mode: 'used', seed: 7 }); assert.notDeepEqual(a.files, c.files)
  for (const m of mediaPlan('ci')) {
    const wav = readFileSync(join(root, 'a', m.path))
    assert.equal(wav.subarray(0, 4).toString(), 'RIFF'); assert.equal(wav.length, m.bytes)
    assert.equal(wav.readUInt32LE(24), m.sampleRate); assert.equal(wav.readUInt16LE(22), m.channels)
    assert.equal(wav.readUInt32LE(40), m.bytes - 44)
  }
})

test('missing, truncated, altered, extra file and rewritten manifest are refused', t => {
  const root = temp(t)
  for (const [i, alter] of [
    dir => rmSync(join(dir, 'book.epub')),
    dir => writeFileSync(join(dir, 'book.epub'), 'truncated'),
    dir => { const bytes = readFileSync(join(dir, 'book.epub')); bytes[100] ^= 1; writeFileSync(join(dir, 'book.epub'), bytes) },
    dir => writeFileSync(join(dir, 'unexpected.txt'), 'extra'),
    dir => { const m = JSON.parse(readFileSync(join(dir, 'manifest.json'))); m.files.pop(); writeFileSync(join(dir, 'manifest.json'), JSON.stringify(m)) },
    dir => { const m = JSON.parse(readFileSync(join(dir, 'manifest.json'))); m.parameters.words++; writeFileSync(join(dir, 'manifest.json'), JSON.stringify(m)) },
  ].entries()) {
    const dir = join(root, String(i)); generate({ output: dir }); alter(dir); assert.throws(() => verify(dir))
    const r = spawnSync(process.execPath, ['scripts/measurement/corpus.mjs', 'verify', '--output', dir], { encoding: 'utf8' }); assert.equal(r.status, 1)
  }
  assert.throws(() => verify(join(root, 'absent')))
})

test('allocation guard, invalid input, reserve and no overwrite', t => {
  const root = temp(t), output = join(root, 'a')
  assert.throws(() => generate({ output, preset: 'strong', mode: 'bank' }), /confirm-bytes/)
  assert.throws(() => generate({ output, preset: 'nominal', mode: 'used' }), /confirm-bytes/)
  assert.throws(() => generate({ output, availableBytes: 0 }), /Insufficient/)
  for (const seed of [-1, 1.5, NaN, 2 ** 32]) assert.throws(() => generate({ output, seed }), /Seed/)
  assert.throws(() => generate({ output, preset: '__proto__' }), /preset/)
  assert.throws(() => generate({ output, mode: 'other' }), /Mode/)
  mkdirSync(output); writeFileSync(join(output, 'keep'), 'original')
  assert.throws(() => generate({ output }), /already exists/); assert.equal(readFileSync(join(output, 'keep'), 'utf8'), 'original')
})

test('reduced bank mode writes real files and exact bytes', t => {
  const dir = join(temp(t), 'bank'), m = generate({ output: dir, preset: 'ci', mode: 'bank', confirmBytes: 11000000 })
  assert.equal(verify(dir).materializedAudioBytes, 11000000)
  assert.equal(m.files.filter(x => x.path.startsWith('bank/')).length, 100)
})

test('dense audio and endurance are scenarios, no new business limits or simulated success', () => {
  for (const [preset, p] of Object.entries(PRESETS)) {
    const media = mediaPlan(preset)
    assert.equal(media.reduce((sum, x) => sum + x.bytes, 0), p.mediaBytes)
    assert.deepEqual(['SFX', 'Ambiance', 'Musique'].map(type => media.filter(x => x.type === type).length), [3, 8, 2])
    assert.deepEqual([...new Set(media.map(x => x.sampleRate))], [44100, 48000, 96000])
    assert.ok(media.every(x => x.bytes > 44 && (x.bytes - 44) % (x.channels * 2) === 0))
  }
})

test('p95 nearest rank and median, sample size and non-finite values', () => {
  assert.deepEqual(stats([10, 1, 3, 2]), { n: 4, median: 2.5, p95: 10, max: 10, min: 1 })
  assert.equal(stats(Array.from({ length: 100 }, (_, i) => 100 - i), 100).p95, 95)
  assert.equal(stats([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10).p95, 9)
  for (const values of [[], [NaN], [Infinity], [-1]]) assert.throws(() => stats(values))
  assert.throws(() => stats([1], 100))
})

test('all 14 adopted budgets have concrete protocols, boundaries, evidence and future prerequisite', () => {
  assert.equal(budgets.length, 14)
  const doc = readFileSync('docs/measurement/PROTOCOLS.md', 'utf8')
  for (const [i, b] of budgets.entries()) {
    assert.equal(b.id, `B${String(i + 1).padStart(2, '0')}`)
    for (const key of ['target', 'load', 'start', 'end', 'cache', 'instrumentation', 'statistics', 'protocol', 'evidence', 'phase', 'prerequisite']) assert.ok(b[key].length > 2, `${b.id}.${key}`)
    assert.ok(doc.includes(b.protocol)); assert.equal(b.targetState, 'ADOPTED'); assert.equal(b.observationState, 'PLANNED')
    assert.equal(b.platforms.length, 11); assert.equal(b.longRuns, 10); assert.equal(b.interactionEvents, 100)
  }
})
