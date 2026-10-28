import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile, readFile, rename, readdir, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { fileURLToPath, URL } from 'node:url'
import { LaboratoryStore, fixture, hash, untouchedWrites, syntheticBytes } from './store.mjs'

async function workspace(t) {
  const root = await mkdtemp(join(tmpdir(), 'jaquette-T74-owned-'))
  t.after(() => rm(root, { recursive: true, force: true })) // Exact mkdtemp capability only.
  return root
}

async function child(root, adapter, mode, barrier) {
  const process = fork(fileURLToPath(new URL('./child.mjs', import.meta.url)), [mode, root, adapter, barrier ?? ''], { stdio: ['ignore', 'ignore', 'pipe', 'ipc'] })
  const message = await Promise.race([
    once(process, 'message').then(([value]) => value),
    once(process, 'exit').then(([code]) => { throw new Error(`child exited ${code} before message`) }),
  ])
  return { process, message }
}

for (const adapter of ['directory', 'append']) {
  test(`${adapter}: chapter growth, stable IDs, dedup, reopen and isolated portable copy`, async (t) => {
    const root = await workspace(t); const events = []
    const store = new LaboratoryStore(join(root, 'source'), adapter, { event: (e) => events.push(e) })
    await store.create(fixture(100))
    const before = await store.read(); events.length = 0
    await store.mutateChapter({ expectedGeneration: 1, growth: 10000 })
    assert.equal(untouchedWrites(events, before.state).length, 0)
    const after = await store.read()
    assert.deepEqual(after.common, before.common)
    assert.deepEqual(after.chapters['chapter-1'], before.chapters['chapter-1'])
    assert.deepEqual(after.state.chapters['chapter-3'], before.state.chapters['chapter-3'])
    await store.mutateChapter({ expectedGeneration: 2 })
    assert.equal(Object.keys((await store.read()).state.media).length, 1)
    const copy = await store.exportTo(join(root, 'portable'))
    const imported = await copy.exportTo(join(root, 'imported'))
    await rename(store.root, join(root, 'source-unavailable'))
    await rename(copy.root, join(root, 'portable-unavailable'))
    assert.deepEqual((await imported.read()).chapters, (await new LaboratoryStore(join(root, 'source-unavailable'), adapter).read()).chapters)
    await assert.rejects(imported.exportTo(join(root, 'imported')), { code: 'EEXIST' })
    assert.equal((await imported.read()).state.generation, 3)
  })

  for (const point of ['data-chunk', 'before-publish', 'index-flushed', 'published']) {
    for (const code of ['ABORT_ERR', 'ENOSPC']) {
      test(`${adapter}: injected ${code} at ${point}, no mixed/empty generation`, async (t) => {
        const root = await workspace(t); const path = join(root, 'project')
        await new LaboratoryStore(path, adapter).create()
        const store = new LaboratoryStore(path, adapter, { checkpoint: async (at) => {
          if (at === point) throw Object.assign(new Error(code), { code })
        } })
        await assert.rejects(store.mutateChapter({ expectedGeneration: 1 }), { code })
        const result = await new LaboratoryStore(path, adapter).read()
        assert.equal(result.state.generation, point === 'published' ? 2 : 1)
        assert.equal(result.chapters['chapter-2'].occurrences.length, point === 'published' ? 1 : 0)
      })
    }

    test(`${adapter}: own process killed at ${point}; fresh process recovery`, { timeout: 30000 }, async (t) => {
      const root = await workspace(t); const path = join(root, 'project')
      await new LaboratoryStore(path, adapter).create()
      const active = await child(path, adapter, 'mutate', point)
      assert.deepEqual(active.message, { barrier: point })
      const exited = once(active.process, 'exit')
      active.process.kill('SIGKILL')
      await exited
      const fresh = await child(path, adapter, 'read')
      assert.equal(fresh.message.generation, point === 'published' ? 2 : 1)
      assert.equal(fresh.message.chapters['chapter-2'].occurrences.length, point === 'published' ? 1 : 0)
      // A crashed writer's lock cannot be silently stolen to resume mutation.
      await assert.rejects(new LaboratoryStore(path, adapter).mutateChapter({ expectedGeneration: fresh.message.generation }), { code: 'WRITER_OR_RECOVERY_REQUIRED' })
    })
  }

  test(`${adapter}: writer exclusion, stale generation, invalid chapter and corrupt media fail closed`, async (t) => {
    const root = await workspace(t); const path = join(root, 'project')
    const store = new LaboratoryStore(path, adapter); await store.create()
    await assert.rejects(store.create(), { code: 'EEXIST' })
    await writeFile(join(path, 'writer.lock'), 'other')
    await assert.rejects(store.mutateChapter({ expectedGeneration: 1 }), { code: 'WRITER_OR_RECOVERY_REQUIRED' })
    await rm(join(path, 'writer.lock'))
    await assert.rejects(store.mutateChapter({ expectedGeneration: 99 }), { code: 'STALE_GENERATION' })
    await assert.rejects(store.mutateChapter({ expectedGeneration: 1, mediaBytes: 0 }), { code: 'INVALID_MEDIA_INPUT' })
    assert.equal((await store.read()).state.generation, 1)
    await assert.rejects(store.mutateChapter({ expectedGeneration: 1, chapterId: '../outside' }), { code: 'UNKNOWN_CHAPTER' })
    await store.mutateChapter({ expectedGeneration: 1 })
    const { state } = await store.read()
    await writeFile(join(path, Object.values(state.media)[0].file), 'truncated')
    await assert.rejects(store.read(), /TRUNCATED_SECTION|CORRUPT_SECTION/)
  })

  test(`${adapter}: corrupted committed index is not silently replaced by an older snapshot`, async (t) => {
    const root = await workspace(t); const path = join(root, 'project')
    const store = new LaboratoryStore(path, adapter); await store.create()
    await store.mutateChapter({ expectedGeneration: 1 })
    await writeFile(join(path, 'commit-00000002.json'), '{}')
    await assert.rejects(store.read(), { code: 'CORRUPT_INDEX_CHAIN' })
  })

  test(`${adapter}: failed export preserves source and existing valid destination`, async (t) => {
    const root = await workspace(t); const path = join(root, 'source')
    const store = new LaboratoryStore(path, adapter); await store.create()
    await store.mutateChapter({ expectedGeneration: 1, mediaBytes: 150000 })
    for (const code of ['ABORT_ERR', 'ENOSPC']) {
      await assert.rejects(store.exportTo(join(root, code), async () => { throw Object.assign(new Error(code), { code }) }), { code })
      assert.equal((await store.read()).state.generation, 2)
    }
    const good = await store.exportTo(join(root, 'good'))
    await assert.rejects(store.exportTo(good.root), { code: 'EEXIST' })
    assert.equal((await good.read()).state.generation, 2)
  })
}

test('negative oracle: unchanged hashes do not hide writes to other chapters; no-op is clean', async (t) => {
  const root = await workspace(t); const events = []
  const store = new LaboratoryStore(join(root, 'control'), 'monolith', { event: (e) => events.push(e) })
  await store.create(); const before = await store.read(); events.length = 0
  await store.read(); assert.equal(untouchedWrites(events, before.state).length, 0)
  events.length = 0
  await store.mutateChapter({ expectedGeneration: 1 })
  assert.equal(untouchedWrites(events, before.state).length, 2)
  assert.equal((await store.read()).state.chapters['chapter-1'].sha256, before.state.chapters['chapter-1'].sha256)
})

test('hostile index path is refused before reading outside the owned project', async (t) => {
  const root = await workspace(t); const path = join(root, 'project')
  const store = new LaboratoryStore(path, 'directory'); await store.create()
  const indexPath = join(path, 'commit-00000001.json')
  const envelope = JSON.parse(await readFile(indexPath, 'utf8'))
  envelope.state.common.file = '../sentinel'
  envelope.sha256 = hash(JSON.stringify(envelope.state))
  await writeFile(indexPath, JSON.stringify(envelope))
  await assert.rejects(store.read(), { code: 'INVALID_REFERENCE' })
  assert.ok((await readdir(root)).includes('project'))
})

test('seeded byte stream is reproducible across chunks with bounded allocation', async () => {
  const digest = async () => { let result = ''; for await (const bytes of syntheticBytes(65537)) result += hash(bytes); return result }
  assert.equal(await digest(), await digest())
  await assert.rejects(async () => { for await (const bytes of syntheticBytes(-1)) assert.fail(bytes) }, { code: 'INVALID_SIZE' })
})

test('junction/symlink project root is refused, leaving the real project unchanged', async (t) => {
  const root = await workspace(t); const path = join(root, 'real')
  const store = new LaboratoryStore(path, 'directory'); await store.create()
  const link = join(root, 'link')
  await symlink(path, link, process.platform === 'win32' ? 'junction' : 'dir')
  await assert.rejects(new LaboratoryStore(link, 'directory').read(), { code: 'UNOWNED_ROOT' })
  assert.equal((await store.read()).state.generation, 1)
})
