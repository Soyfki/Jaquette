import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { afterEach, describe, expect, it } from 'vitest'
import { executeCommand } from '../core/executeCommand'
import { failure, success, type Access, type ErrorCode, type Ports, type Repository } from '../core/contracts'
import { command, fixture, actor } from '../core/testing/fixtures'
import { assertRoundTrip } from '../core/testing/adapterOracle'
import { createWebAdapter } from './web/createWebAdapter'
import { createDesktopAdapter } from './desktop/createDesktopAdapter'
import { initializeFixture, openFixtureHost } from './testing/nodeFixtureHost'
import { encodeFixture } from './testing/fixtureProtocol'

const temporary: string[] = []
afterEach(async () => {
  for (const path of temporary.splice(0)) {
    // Delete only directories made by this test under its explicit temp prefix.
    if (!resolve(path).startsWith(resolve(tmpdir(), 'jaquette-t73-test-'))) throw new Error('Unowned directory')
    await rm(path, { recursive: true, force: true })
  }
})
async function harness(kind: 'web' | 'desktop') {
  const initial = fixture()
  let allowed = true, disposed = false, commits = 0
  const access: Access = { authorizeEdit: (person, project, chapter) => allowed
    && person?.identityId === actor.identityId && person.workspaceId === actor.workspaceId && person.teamId === actor.teamId
    && project === initial.projectId && chapter === initial.chapters[0].id }
  let web = createWebAdapter(initial, access, randomUUID)
  let directory = ''
  let host: Awaited<ReturnType<typeof openFixtureHost>> | undefined
  if (kind === 'desktop') {
    directory = await mkdtemp(join(tmpdir(), 'jaquette-t73-test-'))
    temporary.push(directory)
    await initializeFixture(directory, initial)
    host = await openFixtureHost(directory, initial, access, randomUUID)
  }
  let repository = kind === 'web' ? web.repository : createDesktopAdapter(host!.repository)
  const ports: Ports = {
    access, audio: { describe: async () => success({ available: true }) },
    repository: {
      readContext: (...args) => repository.readContext(...args),
      commitChapter: async request => { commits++; return repository.commitChapter(request) },
    },
  }
  const snapshot = async () => {
    const loaded = await ports.repository.readContext(initial.projectId, initial.chapters[0].id)
    if (!loaded.ok) throw new Error('Read failed')
    return loaded.value
  }
  return {
    ports, snapshot, initial, commits: () => commits, deny: () => { allowed = false },
    raw: async () => kind === 'web' ? web.exportFixture() : readFile(join(directory, 'contract-fixture.json'), 'utf8'),
    replaceRaw: async (text: string) => kind === 'web' ? web.importFixture(text) : writeFile(join(directory, 'contract-fixture.json'), text),
    reopen: async () => {
      const previous = repository
      if (kind === 'web') {
        const text = web.exportFixture()
        web = createWebAdapter(initial, access, randomUUID)
        expect(web.importFixture(text).ok).toBe(true)
        repository = web.repository
      } else {
        await host!.close()
        disposed = true
        expect(await previous.readContext(initial.projectId, initial.chapters[0].id)).toEqual(failure('unavailable'))
        host = await openFixtureHost(directory, initial, access, randomUUID)
        repository = createDesktopAdapter(host.repository)
      }
    },
    close: async () => { if (host) await host.close(); return disposed },
  }
}
for (const kind of ['web', 'desktop'] as const) describe('same contract oracle: ' + kind, () => {
  it('runs without DOM, preserves IDs/text/common/other chapter and survives reconstruction', async () => {
    expect(typeof window).toBe('undefined')
    const h = await harness(kind)
    try {
      const before = await h.snapshot()
      expect((await executeCommand(command(), actor, h.ports)).ok).toBe(true)
      await h.reopen()
      const loaded = await h.snapshot()
      assertRoundTrip(before, loaded, command())
      expect(loaded.common).toEqual(before.common)
      expect(loaded.chapters[1]).toEqual(before.chapters[1])
      expect(loaded.chapters[0].occurrences).toEqual([command()])
      expect([loaded.projectId, loaded.bookId, loaded.chapters[0].id]).toEqual([before.projectId, before.bookId, before.chapters[0].id])
      expect((await executeCommand(command({ occurrenceId: 'occurrence-2', family: 'Ambiance' }), actor, h.ports)).ok).toBe(true)
      expect((await h.snapshot()).chapters[0].occurrences[0]).toEqual(command())
    } finally { await h.close() }
  })
  const corpus: [string, unknown, ErrorCode][] = [
    ['null', null, 'invalid-input'], ['array', [], 'invalid-input'],
    ['family', { ...command(), family: 'voice' }, 'invalid-input'],
    ['empty', { ...command(), mediaId: '' }, 'invalid-input'],
    ['actor injection', { ...command(), actor: 'admin' }, 'invalid-input'],
    ['book', command({ bookId: 'wrong-book' }), 'unknown-book'],
    ['token', command({ range: { startTokenId: 'absent', endTokenId: 't-a' } }), 'unknown-token'],
    ['cross chapter', command({ range: { startTokenId: 't-z', endTokenId: 't-other' } }), 'cross-chapter-range'],
    ['reverse logical order', command({ range: { startTokenId: 't-a', endTokenId: 't-z' } }), 'reversed-range'],
    ['media', command({ mediaId: 'absent' }), 'unknown-media'],
  ]
  it.each(corpus)('rejects %s with no commit or audio effects', async (_name, input, error) => {
    const h = await harness(kind)
    let audioCalls = 0
    h.ports.audio.describe = async () => { audioCalls++; return success({ available: true }) }
    try {
      const before = await h.raw()
      expect(await executeCommand(input, actor, h.ports)).toEqual(failure(error))
      expect(h.commits()).toBe(0)
      expect(audioCalls).toBe(0)
      expect(await h.raw()).toBe(before)
    } finally { await h.close() }
  })
  it('refuses wrong scopes, forged actor and host capabilities without file effects', async () => {
    const h = await harness(kind)
    try {
      const before = await h.raw()
      for (const input of [command({ projectId: '../outside' }), command({ projectId: 'C:/outside' }), command({ chapterId: 'unknown' })]) {
        expect(await executeCommand(input, actor, h.ports)).toEqual(failure('forbidden'))
      }
      for (const identityId of ['reviewer', 'team-lead', 'admin', '']) {
        expect(await executeCommand(command(), { ...actor, identityId }, h.ports)).toEqual(failure('forbidden'))
      }
      expect(await h.raw()).toBe(before)
      expect(h.commits()).toBe(0)
    } finally { await h.close() }
  })
  it('rechecks revoked access and cancellation at commit', async () => {
    const h = await harness(kind)
    const cancellation = { aborted: false }
    try {
      const before = await h.raw()
      h.ports.audio.describe = async () => { h.deny(); return success({ available: true }) }
      expect(await executeCommand(command(), actor, h.ports)).toEqual(failure('forbidden'))
      expect(await h.raw()).toBe(before)
    } finally { await h.close() }
    const h2 = await harness(kind)
    try {
      const before = await h2.raw()
      h2.ports.audio.describe = async () => { cancellation.aborted = true; return success({ available: true }) }
      expect(await executeCommand(command(), actor, h2.ports, cancellation)).toEqual(failure('cancelled'))
      expect(await h2.raw()).toBe(before)
      expect(h2.commits()).toBe(0)
    } finally { await h2.close() }
  })
  it('rejects stale concurrent writes and duplicate IDs; does not overwrite', async () => {
    const h = await harness(kind)
    try {
      const revision = (await h.snapshot()).revision
      const requests = [command(), command({ occurrenceId: 'second' })].map(c => ({
        command: c, expectedRevision: revision, actor,
      }))
      const results = await Promise.all(requests.map(r => h.ports.repository.commitChapter(r)))
      expect(results.filter(r => r.ok)).toHaveLength(1)
      expect(results.filter(r => !r.ok)).toEqual([failure('stale-revision')])
      expect(await executeCommand(command(), actor, h.ports)).toEqual(failure('duplicate-id'))
      expect((await h.snapshot()).chapters[0].occurrences).toHaveLength(1)
    } finally { await h.close() }
  })
  it('detaches read snapshots and refuses cancellation at the repository boundary', async () => {
    const h = await harness(kind)
    try {
      const before = await h.raw()
      const loaded = await h.snapshot()
      expect(await h.ports.repository.commitChapter({
        command: command(), actor, expectedRevision: loaded.revision, cancellation: { aborted: true },
      })).toEqual(failure('cancelled'))
      const mutable = loaded as unknown as { common: { text: { tokens: { text: string }[] }[] } }
      mutable.common.text[0].tokens[0].text = 'changed outside repository'
      expect(await h.raw()).toBe(before)
    } finally { await h.close() }
  })
  it('keeps simultaneous SFX/ambience placement but refuses overlapping principal music without crossfade', async () => {
    const h = await harness(kind)
    try {
      for (const [index, family] of ['SFX', 'SFX', 'SFX', 'SFX', 'Ambiance', 'Musique'].entries()) {
        expect((await executeCommand(command({ occurrenceId: 'event-' + index, family }), actor, h.ports)).ok).toBe(true)
      }
      expect(await executeCommand(command({ occurrenceId: 'second-music', family: 'Musique' }), actor, h.ports)).toEqual(failure('unsupported-workflow'))
    } finally { await h.close() }
  })
  it('makes transport uncertainty explicit, reads back and never retries a commit', async () => {
    const h = await harness(kind)
    const original = h.ports.repository
    let attempts = 0
    h.ports.repository = { ...original, commitChapter: async request => {
      attempts++
      await original.commitChapter(request)
      throw new Error('Transport lost after write')
    } }
    try {
      expect(await executeCommand(command(), actor, h.ports)).toEqual(failure('outcome-unknown'))
      expect(attempts).toBe(1)
      expect((await h.snapshot()).chapters[0].occurrences).toEqual([command()])
    } finally { await h.close() }
  })
  it('refuses unavailable media, early abort and read errors without writing', async () => {
    const h = await harness(kind)
    try {
      const before = await h.raw()
      expect(await executeCommand(command(), actor, h.ports, { aborted: true })).toEqual(failure('cancelled'))
      h.ports.audio.describe = async () => success({ available: false })
      expect(await executeCommand(command(), actor, h.ports)).toEqual(failure('unavailable'))
      h.ports.repository.readContext = async () => { throw new Error('private host details') }
      expect(await executeCommand(command(), actor, h.ports)).toEqual(failure('unavailable'))
      expect(h.commits()).toBe(0)
      expect(await h.raw()).toBe(before)
    } finally { await h.close() }
  })
})
it('rejects malformed/referenced/duplicate fixture reloads without replacing Web state', async () => {
  const adapter = createWebAdapter(fixture(), { authorizeEdit: () => true }, randomUUID)
  const before = adapter.exportFixture()
  const corruptions = [
    'not json', JSON.stringify({ kind: 'unknown', snapshot: fixture() }),
    encodeFixture({ ...fixture(), common: { ...fixture().common, text: [
      ...fixture().common.text, fixture().common.text[0],
    ] } }),
    encodeFixture({ ...fixture(), chapters: [{ ...fixture().chapters[0], occurrences: [command({ mediaId: 'missing' })] }, fixture().chapters[1]] }),
    encodeFixture({ ...fixture(), chapters: [{ ...fixture().chapters[0], occurrences: [command(), command()] }, fixture().chapters[1]] }),
  ]
  for (const text of corruptions) {
    expect(adapter.importFixture(text).ok).toBe(false)
    expect(adapter.exportFixture()).toBe(before)
  }
})
it('refuses edits of actively validated chapters and immutable source mutation', async () => {
  const snapshot = fixture()
  const validated = { ...snapshot, chapters: snapshot.chapters.map(c => ({ ...c, activeValidations: true })) }
  const access = { authorizeEdit: () => true }
  const adapter = createWebAdapter(validated, access, randomUUID)
  const before = adapter.exportFixture()
  expect(await executeCommand(command(), actor, {
    repository: adapter.repository, access, audio: { describe: async () => success({ available: true }) },
  })).toEqual(failure('unsupported-workflow'))
  expect(adapter.exportFixture()).toBe(before)
})
it('Desktop host refuses corrupt fixture bytes and does not repair or write over them', async () => {
  const h = await harness('desktop')
  try {
    await h.replaceRaw('corrupted fixture')
    expect(await executeCommand(command(), actor, h.ports)).toEqual(failure('invalid-input'))
    expect(await h.raw()).toBe('corrupted fixture')
    expect(h.commits()).toBe(0)
  } finally { await h.close() }
})
// A false adapter is deliberately not assignable; tsc verifies the negative contract.
const nonconforming = { readContext: async () => 42 }
// @ts-expect-error missing commitChapter and incompatible read result
const rejectedAdapter: Repository = nonconforming
void rejectedAdapter
