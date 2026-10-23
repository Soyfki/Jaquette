// T-74 laboratory only. This is NOT a .jacq/.chpt format or a production adapter.
import { open, mkdir, readdir, rename, unlink, lstat, statfs } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { join, resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { serialize, deserialize } from 'node:v8'

export const hash = (data) => createHash('sha256').update(data).digest('hex')
const json = (data) => Buffer.from(JSON.stringify(data))
const fail = (code) => { throw Object.assign(new Error(code), { code }) }
const hex = /^[a-f0-9]{64}$/
const filename = /^(?:common|chapter-[1-9]\d*|media)-[a-f0-9]{64}\.bin$/
const indexName = /^commit-(\d{8})\.json$/
const cap = 1024 * 1024
const clone = (value) => deserialize(serialize(value))

export function fixture(count = 3) {
  if (![3, 100].includes(count)) fail('INVALID_FIXTURE')
  return {
    common: { projectId: 'synthetic-project', bookId: 'synthetic-book',
      tokens: Array.from({ length: count }, (_, i) => `chapter-${i + 1}:word-1`) },
    chapters: Object.fromEntries(Array.from({ length: count }, (_, i) => [
      `chapter-${i + 1}`, { id: `chapter-${i + 1}`, occurrences: [] },
    ])),
  }
}

// Incompressible-enough seeded bytes, bounded allocation; not audio, not sparse files.
export async function* syntheticBytes(size, seed = 73) {
  if (!Number.isSafeInteger(size) || size < 0) fail('INVALID_SIZE')
  let state = seed >>> 0
  for (let position = 0; position < size;) {
    const chunk = Buffer.allocUnsafe(Math.min(65536, size - position))
    for (let i = 0; i < chunk.length; i++) {
      state ^= state << 13; state ^= state >>> 17; state ^= state << 5
      chunk[i] = state & 255
    }
    position += chunk.length
    yield chunk
  }
}

export async function preflight(parent, mediaBytes) {
  const fs = await statfs(parent)
  const available = Number(fs.bavail) * Number(fs.bsize)
  // Source + export + import + staging, plus 1 GiB reserve. No disk filling.
  const required = mediaBytes * 4 + 1024 ** 3
  if (!Number.isSafeInteger(mediaBytes) || mediaBytes < 0 || available < required) fail('INSUFFICIENT_PREFLIGHT_SPACE')
  return { available, required, mediaBytes }
}

export class LaboratoryStore {
  constructor(root, adapter, { event = () => {}, checkpoint = async () => {} } = {}) {
    if (!['directory', 'append', 'monolith'].includes(adapter)) fail('INVALID_ADAPTER')
    this.root = resolve(root); this.adapter = adapter
    this.event = event; this.checkpoint = checkpoint
  }

  async assertOwned() {
    const root = await lstat(this.root)
    if (!root.isDirectory() || root.isSymbolicLink()) fail('UNOWNED_ROOT')
    const marker = await this.safeRead('laboratory.json', cap)
    const data = JSON.parse(marker)
    if (data.laboratory !== 'T-74' || data.adapter !== this.adapter) fail('UNOWNED_ROOT')
  }

  async safePath(name) {
    if (!/^[a-zA-Z0-9.-]+$/.test(name)) fail('INVALID_PATH')
    const path = join(this.root, name)
    const info = await lstat(path).catch((error) => {
      if (error.code === 'ENOENT') return null
      throw error
    })
    if (info && (!info.isFile() || info.isSymbolicLink())) fail('UNSAFE_ENTRY')
    return path
  }

  async safeRead(name, maximum) {
    const path = await this.safePath(name)
    const handle = await open(path, 'r')
    try {
      if ((await handle.stat()).size > maximum) fail('OVERSIZED_METADATA')
      return await handle.readFile()
    } finally { await handle.close() }
  }

  async exclusive(name, bytes) {
    const handle = await open(await this.safePath(name), 'wx')
    try {
      let position = 0
      while (position < bytes.length) {
        const { bytesWritten } = await handle.write(bytes, position, bytes.length - position, position)
        if (!bytesWritten) fail('SHORT_WRITE')
        this.event({ operation: 'write', file: name, offset: position, bytes: bytesWritten })
        position += bytesWritten
      }
      await handle.sync()
      this.event({ operation: 'flush', file: name })
    } finally { await handle.close() }
  }

  async create(data = fixture()) {
    await mkdir(this.root) // Deliberately refuses any existing target; no recursive cleanup.
    await this.exclusive('laboratory.json', json({ laboratory: 'T-74', adapter: this.adapter }))
    return this.lock(async () => {
      const state = { generation: 1, previous: null, common: await this.put('common', json(data.common)), chapters: {}, media: {} }
      for (const [id, chapter] of Object.entries(data.chapters)) state.chapters[id] = await this.put(id, json(chapter))
      await this.publish(state)
      return state
    })
  }

  async lock(work) {
    await this.assertOwned()
    const name = 'writer.lock'
    const handle = await open(await this.safePath(name), 'wx').catch((error) => {
      if (error.code === 'EEXIST') fail('WRITER_OR_RECOVERY_REQUIRED')
      throw error
    })
    try { return await work() } finally {
      await handle.close()
      await unlink(join(this.root, name))
    }
  }

  async put(kind, bytes) {
    if (bytes.length > cap) fail('OVERSIZED_METADATA')
    return this.putStream(kind, (async function* () { yield bytes })())
  }

  async putStream(kind, chunks) {
    if (!/^(common|chapter-[1-9]\d*|media)$/.test(kind)) fail('INVALID_KIND')
    const temporary = `staging-${randomUUID()}.bin`
    const file = this.adapter === 'append' ? 'sections.bin' : temporary
    const handle = await open(await this.safePath(file), this.adapter === 'append' ? 'a+' : 'wx')
    const offset = (await handle.stat()).size
    const digest = createHash('sha256')
    let length = 0
    try {
      for await (const chunk of chunks) {
        if (!Buffer.isBuffer(chunk) || !chunk.length) fail('INVALID_CHUNK')
        let written = 0
        while (written < chunk.length) {
          const { bytesWritten } = await handle.write(chunk, written, chunk.length - written, null)
          if (!bytesWritten) fail('SHORT_WRITE')
          this.event({ operation: 'write', file, unit: kind, offset: offset + length + written, bytes: bytesWritten })
          written += bytesWritten
        }
        length += chunk.length; digest.update(chunk)
        await this.checkpoint('data-chunk', { kind, length })
      }
      await handle.sync()
      this.event({ operation: 'flush', file, unit: kind })
    } finally { await handle.close() }
    const sha256 = digest.digest('hex')
    if (this.adapter === 'append') return { file, offset, length, sha256 }
    const final = `${kind}-${sha256}.bin`
    try {
      // Dedup only after checking existing content. No source replacement.
      await lstat(join(this.root, final))
      await this.verify({ file: final, offset: 0, length, sha256 })
      await unlink(join(this.root, temporary))
      this.event({ operation: 'deduplicate', file: final, unit: kind, length })
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      await rename(join(this.root, temporary), join(this.root, final))
      this.event({ operation: 'rename', file: temporary, destination: final, unit: kind })
    }
    return { file: final, offset: 0, length, sha256 }
  }

  async verify(ref, collect = false) {
    if (!ref || !Number.isSafeInteger(ref.offset) || ref.offset < 0 ||
        !Number.isSafeInteger(ref.length) || ref.length <= 0 || !hex.test(ref.sha256) ||
        !(filename.test(ref.file) || (this.adapter === 'append' && ref.file === 'sections.bin'))) fail('INVALID_REFERENCE')
    if (collect && ref.length > cap) fail('OVERSIZED_METADATA')
    const path = await this.safePath(ref.file)
    const handle = await open(path, 'r')
    const digest = createHash('sha256'); const parts = []
    try {
      if ((await handle.stat()).size < ref.offset + ref.length) fail('TRUNCATED_SECTION')
      const buffer = Buffer.allocUnsafe(65536)
      let read = 0
      while (read < ref.length) {
        const { bytesRead } = await handle.read(buffer, 0, Math.min(buffer.length, ref.length - read), ref.offset + read)
        if (!bytesRead) fail('TRUNCATED_SECTION')
        digest.update(buffer.subarray(0, bytesRead))
        if (collect) parts.push(Buffer.from(buffer.subarray(0, bytesRead)))
        this.event({ operation: 'read', file: ref.file, offset: ref.offset + read, bytes: bytesRead })
        read += bytesRead
      }
    } finally { await handle.close() }
    if (digest.digest('hex') !== ref.sha256) fail('CORRUPT_SECTION')
    return collect ? Buffer.concat(parts) : undefined
  }

  async publish(state) {
    await this.checkpoint('before-publish')
    const bytes = json(state)
    const envelope = json({ state, sha256: hash(bytes) })
    if (envelope.length > cap) fail('OVERSIZED_METADATA')
    const staging = `staging-${randomUUID()}.json`
    await this.exclusive(staging, envelope)
    await this.checkpoint('index-flushed')
    const target = `commit-${String(state.generation).padStart(8, '0')}.json`
    await rename(join(this.root, staging), join(this.root, target))
    this.event({ operation: 'rename', file: staging, destination: target, unit: 'common-index' })
    await this.checkpoint('published')
    // File sync + rename is NOT a proven durable directory transaction on Windows.
    this.event({ operation: 'ack-experimental', generation: state.generation })
  }

  async read() {
    await this.assertOwned()
    const names = (await readdir(this.root)).filter((name) => indexName.test(name)).sort()
    if (!names.length) fail('NO_COMMITTED_GENERATION')
    let previous = null; let expected = 1; let state
    for (const name of names) {
      const envelope = JSON.parse(await this.safeRead(name, cap))
      state = envelope.state
      if (!state || state.generation !== expected || state.previous !== previous ||
          Number(indexName.exec(name)[1]) !== expected || envelope.sha256 !== hash(json(state))) fail('CORRUPT_INDEX_CHAIN')
      previous = envelope.sha256; expected++
    }
    if (!state.chapters || !state.media) fail('INVALID_INDEX')
    const common = JSON.parse(await this.verify(state.common, true))
    if (common.projectId !== 'synthetic-project' || common.bookId !== 'synthetic-book' || !Array.isArray(common.tokens)) fail('INVALID_COMMON')
    const chapters = {}
    for (const [id, ref] of Object.entries(state.chapters)) {
      if (!/^chapter-[1-9]\d*$/.test(id)) fail('INVALID_CHAPTER')
      const chapter = JSON.parse(await this.verify(ref, true))
      if (chapter.id !== id || !Array.isArray(chapter.occurrences)) fail('INVALID_CHAPTER')
      for (const occurrence of chapter.occurrences) {
        if (!common.tokens.includes(occurrence.anchor) || !occurrence.anchor.startsWith(`${id}:`) ||
            !state.media[occurrence.media]) fail('INVALID_OCCURRENCE')
      }
      chapters[id] = chapter
    }
    for (const [digest, ref] of Object.entries(state.media)) {
      if (!hex.test(digest) || ref.sha256 !== digest) fail('INVALID_MEDIA')
      await this.verify(ref)
    }
    return { state, common, chapters, indexHash: previous }
  }

  async mutateChapter({ expectedGeneration, chapterId = 'chapter-2', growth = 0, mediaBytes = 4096, seed = 73 }) {
    if (!Number.isSafeInteger(growth) || growth < 0 || growth > 10000) fail('INVALID_GROWTH')
    if (!Number.isSafeInteger(mediaBytes) || mediaBytes <= 0 || mediaBytes > 5_000_000_000 ||
        !Number.isInteger(seed) || seed <= 0 || seed > 0xffffffff) fail('INVALID_MEDIA_INPUT')
    return this.lock(async () => {
      const current = await this.read()
      if (current.state.generation !== expectedGeneration) fail('STALE_GENERATION')
      if (expectedGeneration >= 99999999) fail('GENERATION_LIMIT')
      if (!Object.hasOwn(current.chapters, chapterId)) fail('UNKNOWN_CHAPTER')
      const media = await this.putStream('media', syntheticBytes(mediaBytes, seed))
      const state = clone(current.state)
      // Append option can discover duplicates only after streaming; orphan section is measured.
      state.media[media.sha256] ??= media
      const chapter = clone(current.chapters[chapterId])
      chapter.occurrences.push({ id: `occurrence-${state.generation}`, anchor: `${chapterId}:word-1`, media: media.sha256, note: 'x'.repeat(growth) })
      state.chapters[chapterId] = await this.put(chapterId, json(chapter))
      if (this.adapter === 'monolith') {
        // Negative control: same bytes and hashes, but rewrites untouched chapters.
        for (const [id, value] of Object.entries(current.chapters)) {
          if (id === chapterId) continue
          const ref = state.chapters[id]
          const handle = await open(await this.safePath(ref.file), 'r+')
          try {
            const bytes = json(value)
            await handle.writeFile(bytes); await handle.sync()
            this.event({ operation: 'write', file: ref.file, unit: id, offset: 0, bytes: bytes.length })
          } finally { await handle.close() }
        }
      }
      state.generation++; state.previous = current.indexHash
      await this.publish(state)
      return state
    })
  }

  async exportTo(destination, checkpoint = async () => {}) {
    return this.lock(async () => {
      const { state } = await this.read()
      const target = new LaboratoryStore(destination, this.adapter, { event: this.event })
      await mkdir(target.root) // No overwrite of an existing valid destination.
      await target.exclusive('laboratory.json', json({ laboratory: 'T-74', adapter: this.adapter }))
      const names = new Set(['laboratory.json', ...Object.values(state.chapters).map((ref) => ref.file),
        ...Object.values(state.media).map((ref) => ref.file), state.common.file,
        ...(await readdir(this.root)).filter((name) => indexName.test(name))])
      names.delete('laboratory.json')
      for (const name of names) {
        const handle = await open(await target.safePath(name), 'wx')
        try {
          let position = 0
          for await (const chunk of createReadStream(await this.safePath(name))) {
            let used = 0
            while (used < chunk.length) {
              const { bytesWritten } = await handle.write(chunk, used, chunk.length - used, null)
              if (!bytesWritten) fail('SHORT_WRITE')
              this.event({ operation: 'export-write', file: name, offset: position, bytes: bytesWritten })
              used += bytesWritten; position += bytesWritten
            }
            await checkpoint('export-chunk')
          }
          await handle.sync()
        } finally { await handle.close() }
      }
      await target.read()
      return target
    })
  }
}

// API trace oracle only. An independent OS trace remains a separate prerequisite.
export function untouchedWrites(events, state, changed = 'chapter-2') {
  return events.filter((event) => event.operation === 'write' && Object.entries(state.chapters).some(([id, ref]) =>
    id !== changed && event.file === ref.file && event.offset < ref.offset + ref.length && event.offset + event.bytes > ref.offset))
}
