// Test data only. This is neither a Jaquette importer nor a .jacq/.chpt schema.
import { createHash } from 'node:crypto'
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, statfsSync, statSync, writeFileSync, writeSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { crc32, deflateRawSync } from 'node:zlib'

export const VERSION = '0.4.1'
export const PRESETS = Object.freeze({
  ci: { words: 1200, chapters: 4, annotations: 40, mediaBytes: 1000000, bankEntries: 100, bankBytes: 10000000, projects: 4, members: 6 },
  reference: { words: 48, chapters: 4, annotations: 12, mediaBytes: 1000000, bankEntries: 13, bankBytes: 13000000, projects: 2, members: 3 },
  nominal: { words: 150000, chapters: 30, annotations: 3000, mediaBytes: 1000000000, bankEntries: 10000, bankBytes: 100000000000, projects: 20, members: 30 },
  strong: { words: 500000, chapters: 100, annotations: 20000, mediaBytes: 5000000000, bankEntries: 100000, bankBytes: 1000000000000, projects: 200, members: 100 },
})
const json = (x) => JSON.stringify(x, null, 2) + '\n'
const hash = (x) => createHash('sha256').update(x).digest('hex')
export const SOURCE_HASH = hash(readFileSync(fileURLToPath(import.meta.url)).toString().replaceAll('\r\n', '\n'))
const vocabulary = [
  ['fr', 'ltr', 'Le vent traverse la cour puis une porte résonne doucement ici'.split(' ')],
  ['en', 'ltr', 'The wind crosses the yard then a door echoes softly here'.split(' ')],
  ['ar', 'rtl', 'هذا صوت ريح في ساحة هادئة ثم باب يفتح عند الفجر'.split(' ')],
  ['ar', 'rtl', ['ريح', 'door', 'pluie', 'كتاب', 'night', 'musique', 'صوت', 'wind', 'lumière', 'باب', 'quiet', 'ici']],
]

function validateOptions(preset, seed, mode) {
  if (!Object.hasOwn(PRESETS, preset)) throw new Error('Unknown preset')
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('Seed must be uint32')
  if (!['logical', 'used', 'bank'].includes(mode)) throw new Error('Mode must be logical, used or bank')
}

// ZIP has fixed timestamps, order, UTF-8 flag and compression settings.
// Scope: a tiny deterministic EPUB writer, not a generic archive parser.
export function zip(entries) {
  const local = [], central = []
  let offset = 0
  for (const [path, value] of entries) {
    const name = Buffer.from(path), raw = Buffer.from(value)
    const method = path === 'mimetype' ? 0 : 8
    const data = method ? deflateRawSync(raw, { level: 9 }) : raw
    const h = Buffer.alloc(30)
    h.writeUInt32LE(0x04034b50); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x800, 6)
    h.writeUInt16LE(method, 8); h.writeUInt16LE(33, 12); h.writeUInt32LE(crc32(raw), 14)
    h.writeUInt32LE(data.length, 18); h.writeUInt32LE(raw.length, 22); h.writeUInt16LE(name.length, 26)
    const c = Buffer.alloc(46)
    c.writeUInt32LE(0x02014b50); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6)
    h.copy(c, 8, 6, 30); c.writeUInt32LE(offset, 42)
    local.push(h, name, data); central.push(c, name); offset += h.length + name.length + data.length
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, cd, end])
}

function chapter(p, seed, i) {
  const count = Math.floor(p.words / p.chapters) + (i < p.words % p.chapters ? 1 : 0)
  const [lang, dir, words] = vocabulary[i % 4]
  const tokens = Array.from({ length: count }, (_, n) => words[(n + seed % words.length + i) % words.length])
  return { id: `chapter-${i + 1}`, words: count, lang, dir, tokens }
}

export function mediaPlan(preset) {
  const p = PRESETS[preset], small = ['ci', 'reference'].includes(preset)
  let remaining = p.mediaBytes
  return Array.from({ length: 13 }, (_, i) => {
    const type = i < 3 ? 'SFX' : i < 11 ? 'Ambiance' : 'Musique'
    const rate = [44100, 48000, 96000][i % 3], channels = 1 + i % 2
    const proposed = i < 3 ? rate * channels * 2 * (small ? 0.05 : 2 + i) + 44 : Math.floor(remaining / (13 - i))
    const bytes = i === 12 ? remaining : 44 + Math.floor((proposed - 44) / 4) * 4
    remaining -= bytes
    return { id: `media-${i + 1}`, path: `media/${i + 1}.wav`, type, bytes, sampleRate: rate, channels, bits: 16, durationSeconds: (bytes - 44) / (rate * channels * 2) }
  })
}

// PCM block <= 64 KiB, deterministic per-file pseudo-random samples, low level.
function* wavChunks(bytes, sampleRate, channels, seed) {
  if (bytes < 44 || bytes > 0xffffffff || (bytes - 44) % (channels * 2)) throw new Error('Invalid PCM length')
  const h = Buffer.alloc(44)
  h.write('RIFF'); h.writeUInt32LE(bytes - 8, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16)
  h.writeUInt16LE(1, 20); h.writeUInt16LE(channels, 22); h.writeUInt32LE(sampleRate, 24)
  h.writeUInt32LE(sampleRate * channels * 2, 28); h.writeUInt16LE(channels * 2, 32)
  h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(bytes - 44, 40)
  yield h
  let state = seed >>> 0, left = bytes - 44
  while (left) {
    const block = Buffer.alloc(Math.min(65536, left))
    for (let i = 0; i < block.length; i += 2) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0
      block.writeInt16LE((state >>> 21) - 1024, i)
    }
    yield block; left -= block.length
  }
}

function* lines(count, make) { for (let i = 0; i < count; i++) yield JSON.stringify(make(i)) + '\n' }

function* recipe(preset, seed, mode) {
  const p = PRESETS[preset], chapters = Array.from({ length: p.chapters }, (_, i) => chapter(p, seed, i))
  const entries = [['mimetype', 'application/epub+zip'], ['META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>']]
  const xhtml = (body, lang = 'fr', dir = 'ltr') => `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}" dir="${dir}"><head><title>Synthetic Jaquette</title></head><body>${body}</body></html>`
  for (const c of chapters) entries.push([`EPUB/${c.id}.xhtml`, xhtml(`<p id="text">${c.tokens.join(' ')}</p>`, c.lang, c.dir)])
  entries.push(['EPUB/nav.xhtml', xhtml(`<nav epub:type="toc"><ol>${chapters.map(c => `<li><a href="${c.id}.xhtml">${c.id}</a></li>`).join('')}</ol></nav>`)])
  entries.push(['EPUB/package.opf', `<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">urn:jaquette:synthetic:${VERSION}:${preset}:${seed}</dc:identifier><dc:title>Synthetic Jaquette</dc:title><dc:language>fr</dc:language><dc:language>en</dc:language><dc:language>ar</dc:language><meta property="dcterms:modified">2026-09-18T00:00:00Z</meta><meta property="rendition:layout">reflowable</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>${chapters.map(c => `<item id="${c.id}" href="${c.id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}</manifest><spine>${chapters.map(c => `<itemref idref="${c.id}"/>`).join('')}</spine></package>`])
  const epub = zip(entries)
  if (epub.length > 10000000) throw new Error('EPUB >10 Mo')
  yield ['book.epub', [epub]]
  yield ['chapters.json', [json(chapters.map(({ tokens, ...c }) => ({ ...c, firstToken: tokens[0], lastToken: tokens.at(-1) })))]]
  yield ['annotations.jsonl', lines(p.annotations, i => {
    const c = chapters[i % chapters.length], start = (seed + i) % c.words
    return { id: `annotation-${i + 1}`, chapter: c.id, fromWord: start, toWord: start, media: `media-${i % 13 + 1}`, type: i % 13 < 3 ? 'SFX' : i % 13 < 11 ? 'Ambiance' : 'Musique' }
  })]
  yield ['bank.jsonl', lines(p.bankEntries, i => ({ id: `bank-${i + 1}`, path: `bank/${i + 1}.wav`, logicalBytes: p.bankBytes / p.bankEntries, materialized: mode === 'bank', tag: ['pluie', 'wind', 'ريح'][i % 3] }))]
  yield ['projects.jsonl', lines(p.projects, i => ({ id: `project-${i + 1}`, team: `team-${i % 2 + 1}`, status: 'Doublage' }))]
  yield ['members.jsonl', lines(p.members, i => ({ id: `synthetic-member-${i + 1}`, team: `team-${i % 2 + 1}` }))]
  const media = mediaPlan(preset)
  yield ['audio.json', [json({ media, materialized: mode !== 'logical', dense: { sfx: 3, ambiances: 8, musicOutsideCrossfade: 1, musicDuringCrossfade: 2, crossfadeStartWord: 4, crossfadeEndWord: 8, ambienceCountIsBusinessLimit: false } })]]
  yield ['endurance.json', [json({ durationSeconds: 28800, cycles: Array.from({ length: 100 }, (_, i) => ({ cycle: i + 1, atSecond: 144 + i * 288, interruptionPoint: ['before-write', 'during-chapter-write', 'after-data-flush', 'before-confirmation', 'after-confirmation'][i % 5] })), execution: 'PLANNED; requires real storage/audio' })]]
  if (mode !== 'logical') for (const [i, m] of media.entries()) yield [m.path, wavChunks(m.bytes, m.sampleRate, m.channels, seed + i)]
  if (mode === 'bank') for (let i = 0; i < p.bankEntries; i++) yield [`bank/${i + 1}.wav`, wavChunks(p.bankBytes / p.bankEntries, 48000, 2, seed + i)]
}

export function estimate(preset, mode) {
  validateOptions(preset, 0, mode)
  const p = PRESETS[preset]
  const audioBytes = (mode === 'logical' ? 0 : p.mediaBytes) + (mode === 'bank' ? p.bankBytes : 0)
  return { audioBytes, conservativeRequiredBytes: audioBytes + 200000000 + p.bankEntries * 8192, reserveBytes: 1000000000 }
}

function fingerprints(preset, seed, mode, consume) {
  const files = []
  for (const [path, chunks] of recipe(preset, seed, mode)) {
    const h = createHash('sha256'); let bytes = 0
    const sink = consume?.(path)
    try { for (const chunk of chunks) { const b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk); h.update(b); bytes += b.length; sink?.write(b) } }
    finally { sink?.close() }
    files.push({ path, bytes, sha256: h.digest('hex') })
  }
  return files
}

export function generate({ output, preset = 'ci', seed = 20260918, mode = 'logical', confirmBytes, availableBytes }) {
  validateOptions(preset, seed, mode)
  if (!output) throw new Error('Output directory required')
  const root = resolve(output), e = estimate(preset, mode)
  if (existsSync(root)) throw new Error('Output already exists; never overwritten')
  if (e.audioBytes > 10000000 && confirmBytes !== e.audioBytes) throw new Error(`Explicit --confirm-bytes ${e.audioBytes} required`)
  const parent = dirname(root)
  if (!existsSync(parent)) throw new Error('Create output parent first')
  const fs = statfsSync(parent), free = availableBytes ?? fs.bavail * fs.bsize
  if (free < e.conservativeRequiredBytes + e.reserveBytes) throw new Error('Insufficient free space (includes reserve)')
  mkdirSync(root)
  const files = fingerprints(preset, seed, mode, path => {
    // Recheck space before each file, then bounded writes. Partial outputs have no manifest.
    const current = statfsSync(root)
    if (current.bavail * current.bsize < e.reserveBytes) throw new Error('Free-space reserve reached')
    const target = join(root, path); mkdirSync(dirname(target), { recursive: true })
    const fd = openSync(target, 'wx')
    return { write(b) { let n = 0; while (n < b.length) n += writeSync(fd, b, n, b.length - n) }, close() { closeSync(fd) } }
  })
  const manifest = { generator: VERSION, generatorSha256: SOURCE_HASH, preset, seed, mode, units: 'decimal bytes; Mo=1000000 Go=1000000000 To=1000000000000', provenance: 'Synthetic data authored for Jaquette testing; no personal manuscript', license: 'CC0-1.0', parameters: PRESETS[preset], logicalMediaBytes: PRESETS[preset].mediaBytes, logicalBankBytes: PRESETS[preset].bankBytes, materializedAudioBytes: e.audioBytes, files }
  writeFileSync(join(root, 'manifest.json'), json(manifest), { flag: 'wx' })
  return manifest
}

export function verify(output) {
  const root = resolve(output), m = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'))
  validateOptions(m.preset, m.seed, m.mode)
  if (m.generator !== VERSION || m.generatorSha256 !== SOURCE_HASH || json(m.parameters) !== json(PRESETS[m.preset])) throw new Error('Generator/parameters mismatch')
  const expected = fingerprints(m.preset, m.seed, m.mode)
  if (json(expected) !== json(m.files)) throw new Error('Manifest differs from deterministic recipe')
  const paths = readdirSync(root, { recursive: true, withFileTypes: true }).filter(x => x.isFile()).map(x => join(x.parentPath, x.name).slice(root.length + 1).replaceAll('\\', '/')).sort()
  if (json(paths) !== json(['manifest.json', ...expected.map(x => x.path)].sort())) throw new Error('Incomplete or unexpected inventory')
  for (const f of expected) {
    const target = join(root, f.path)
    if (statSync(target).size !== f.bytes) throw new Error(`Size mismatch: ${f.path}`)
    // Bound verification memory too; no readFile on large media.
    const fd = openSync(target, 'r'), h = createHash('sha256'), b = Buffer.alloc(65536)
    try { let n; while ((n = readChunk(fd, b))) h.update(b.subarray(0, n)) } finally { closeSync(fd) }
    if (h.digest('hex') !== f.sha256) throw new Error(`Hash mismatch: ${f.path}`)
  }
  if (m.materializedAudioBytes !== estimate(m.preset, m.mode).audioBytes || m.logicalMediaBytes !== m.parameters.mediaBytes || m.logicalBankBytes !== m.parameters.bankBytes) throw new Error('Byte accounting mismatch')
  return { status: 'PASS', preset: m.preset, seed: m.seed, files: expected.length, parameters: m.parameters, materializedAudioBytes: m.materializedAudioBytes, manifestSha256: hash(readFileSync(join(root, 'manifest.json'))) }
}

import { readSync as readChunk } from 'node:fs'
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2), opts = {}
    for (let i = 0; i < args.length; i += 2) { if (!['--output', '--preset', '--seed', '--mode', '--confirm-bytes'].includes(args[i]) || args[i + 1] === undefined) throw new Error('Invalid arguments'); opts[args[i].slice(2)] = args[i + 1] }
    if (command === 'verify') console.log(json(verify(opts.output)))
    else if (command === 'estimate') console.log(json(estimate(opts.preset ?? 'ci', opts.mode ?? 'logical')))
    else if (command === 'generate') console.log(json(generate({ ...opts, seed: opts.seed === undefined ? 20260918 : Number(opts.seed), confirmBytes: Number(opts['confirm-bytes']) })))
    else throw new Error('Use generate|verify|estimate --output DIR --preset ci|reference|nominal|strong --mode logical|used|bank --seed UINT32')
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
