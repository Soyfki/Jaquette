import { describe, expect, it } from 'vitest'
import { parseCommand, parseSnapshot } from './commands/addAudioOccurrence'
import { command, fixture, actor } from './testing/fixtures'
import { createWebAdapter } from '../adapters/web/createWebAdapter'
import { executeCommand } from './executeCommand'
import { success } from './contracts'

describe('review regressions: lossless accepted data', () => {
  it.each(['projectId', 'bookId', 'chapterId', 'occurrenceId', 'family', 'range', 'mediaId'])('refuses hidden command field %s', key => {
    const input = command()
    Object.defineProperty(input, key, { enumerable: false })
    expect(parseCommand(input)).toEqual({ ok: false, error: 'invalid-input' })
  })
  it.each(['startTokenId', 'endTokenId'])('refuses hidden range field %s', key => {
    const input = command()
    Object.defineProperty(input.range, key, { enumerable: false })
    expect(parseCommand(input).ok).toBe(false)
  })
  it.each(['project', 'common', 'text', 'token', 'chapter', 'occurrence'])('refuses hidden required snapshot field at %s', level => {
    const value = fixture()
    const targets = {
      project: [value, 'projectId'], common: [value.common, 'text'],
      text: [value.common.text[0], 'chapterId'], token: [value.common.text[0].tokens[0], 'id'],
      chapter: [value.chapters[0], 'id'], occurrence: [command(), 'mediaId'],
    } as const
    const [target, key] = targets[level as keyof typeof targets]
    Object.defineProperty(target, key, { enumerable: false })
    if (level === 'occurrence') {
      const changed = { ...value, chapters: [{ ...value.chapters[0], occurrences: [target] }, value.chapters[1]] }
      expect(parseSnapshot(changed).ok).toBe(false)
    } else expect(parseSnapshot(value).ok).toBe(false)
  })
  it.each(['media', 'text', 'tokens', 'chapters', 'occurrences'])('refuses holes in %s', field => {
    const value = fixture()
    const sparse: unknown[] = new Array(1)
    const input = field === 'media' ? { ...value, common: { ...value.common, media: sparse } }
      : field === 'text' ? { ...value, common: { ...value.common, text: sparse } }
      : field === 'tokens' ? { ...value, common: { ...value.common, text: [{ ...value.common.text[0], tokens: sparse }, value.common.text[1]] } }
      : field === 'chapters' ? { ...value, chapters: sparse }
      : { ...value, chapters: [{ ...value.chapters[0], occurrences: sparse }, value.chapters[1]] }
    expect(parseSnapshot(input)).toEqual({ ok: false, error: 'invalid-input' })
  })
  it('refuses sparse arrays disguised by an index beyond array length', () => {
    const value = fixture()
    const media = new Array(1)
    Object.defineProperty(media, '4294967295', { value: 'media-1', enumerable: true })
    expect(parseSnapshot({ ...value, common: { ...value.common, media } }).ok).toBe(false)
  })
  it('rejects a hidden-ID fixture before Web construction and preserves existing state on import', () => {
    const value = fixture()
    Object.defineProperty(value.common.text[0].tokens[0], 'id', { enumerable: false })
    expect(() => createWebAdapter(value, { authorizeEdit: () => true }, () => 'next')).toThrow('Invalid contract fixture')
    const existing = createWebAdapter(fixture(), { authorizeEdit: () => true }, () => 'next')
    const before = existing.exportFixture()
    expect(existing.importFixture(JSON.stringify({ kind: 'jaquette-contract-fixture', snapshot: value })).ok).toBe(false)
    expect(existing.exportFixture()).toBe(before)
  })
  it('keeps success outputs self-validating and IDs unchanged across copy and JSON', async () => {
    const original = fixture(), input = command()
    const parsed = parseCommand(input), snapshot = parseSnapshot(original)
    expect(parsed).toEqual({ ok: true, value: input })
    expect(snapshot).toEqual({ ok: true, value: original })
    if (!parsed.ok || !snapshot.ok) throw new Error('Valid data refused')
    expect(parseCommand(parsed.value)).toEqual(parsed)
    expect(parseSnapshot(snapshot.value)).toEqual(snapshot)
    expect(parseSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toEqual(snapshot)
    const adapter = createWebAdapter(snapshot.value, { authorizeEdit: () => true }, () => 'next')
    expect((await executeCommand(input, actor, { repository: adapter.repository, access: { authorizeEdit: () => true },
      audio: { describe: async () => success({ available: true }) } })).ok).toBe(true)
    const read = await adapter.repository.readContext(original.projectId, original.chapters[0].id)
    expect(read.ok).toBe(true)
    if (!read.ok) throw new Error('Successful commit became unreadable')
    expect(parseSnapshot(read.value)).toEqual(read)
    expect(read.value.chapters[0].occurrences[0]).toEqual(input)
  })
})
