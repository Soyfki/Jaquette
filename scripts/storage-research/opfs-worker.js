// Dedicated-worker experiment; intentionally outside production app and its build.
self.onmessage = async ({ data }) => {
  const events = []
  try {
    const root = await navigator.storage.getDirectory()
    const project = await root.getDirectoryHandle('T74-synthetic-project', { create: data.mode === 'create' })
    const encoder = new TextEncoder()
    const write = async (name, bytes) => {
      const file = await project.getFileHandle(name, { create: true })
      const handle = await file.createSyncAccessHandle()
      try {
        handle.truncate(0); events.push({ operation: 'truncate', file: name, bytes: 0 })
        let position = 0
        while (position < bytes.length) {
          const count = handle.write(bytes.subarray(position), { at: position })
          if (!count) throw new Error('SHORT_WRITE')
          events.push({ operation: 'write', file: name, offset: position, bytes: count })
          position += count
        }
        handle.flush(); events.push({ operation: 'flush', file: name })
      } finally { handle.close() }
    }
    const read = async (name) => (await (await project.getFileHandle(name)).getFile()).text()
    const chapter = (id, occurrences = []) => JSON.stringify({ id, occurrences })
    const digest = async (name) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(await read(name))))).map((b) => b.toString(16).padStart(2, '0')).join('')
    if (data.mode === 'create') {
      await write('common.json', encoder.encode(JSON.stringify({ projectId: 'synthetic-project', token: 'chapter-2:word-1' })))
      for (let id = 1; id <= 3; id++) await write(`chapter-${id}-1.json`, encoder.encode(chapter(`chapter-${id}`)))
      await write('commit-1.json', encoder.encode(JSON.stringify({ generation: 1 })))
      const hashes = [await digest('chapter-1-1.json'), await digest('chapter-3-1.json')]
      const from = events.length
      const file = await project.getFileHandle('media.bin', { create: true })
      const handle = await file.createSyncAccessHandle()
      try {
        let position = 0; let state = 73
        while (position < data.bytes) {
          const bytes = new Uint8Array(Math.min(65536, data.bytes - position))
          for (let i = 0; i < bytes.length; i++) { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; bytes[i] = state & 255 }
          let used = 0
          while (used < bytes.length) {
            const count = handle.write(bytes.subarray(used), { at: position + used })
            if (!count) throw new Error('SHORT_WRITE')
            events.push({ operation: 'write', file: 'media.bin', offset: position + used, bytes: count })
            used += count
          }
          position += bytes.length
        }
        handle.flush()
      } finally { handle.close() }
      await write('chapter-2-2.json', encoder.encode(chapter('chapter-2', [{ id: 'occurrence-1', anchor: 'chapter-2:word-1', media: 'media.bin' }])))
      await write('commit-2.json', encoder.encode(JSON.stringify({ generation: 2, mediaBytes: data.bytes })))
      self.postMessage({ ok: true, hashes, mutation: events.slice(from), events, estimate: await navigator.storage.estimate(), persisted: await navigator.storage.persisted() })
    } else if (data.mode === 'read') {
      const commit = JSON.parse(await read('commit-2.json'))
      const current = JSON.parse(await read('chapter-2-2.json'))
      const media = await (await project.getFileHandle('media.bin')).getFile()
      if (commit.generation !== 2 || media.size !== commit.mediaBytes || current.occurrences[0].anchor !== 'chapter-2:word-1') throw new Error('INVALID_REOPEN')
      self.postMessage({ ok: true, commit, current, mediaSize: media.size, hashes: [await digest('chapter-1-1.json'), await digest('chapter-3-1.json')], estimate: await navigator.storage.estimate() })
    } else throw new Error('INVALID_MODE')
  } catch (error) { self.postMessage({ ok: false, error: error.name, message: error.message, events }) }
}
