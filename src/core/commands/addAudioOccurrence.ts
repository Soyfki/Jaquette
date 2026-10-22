import { failure, success, type Command, type Result, type Snapshot } from '../contracts'
import { isId } from '../ids'

// Only data objects cross the boundary; accessors must not execute during validation.
export function dataRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
    && Object.values(Object.getOwnPropertyDescriptors(value)).every(d => 'value' in d)
}
function onlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.getOwnPropertySymbols(value).length === 0
    && Object.getOwnPropertyNames(value).sort().join(',') === keys.sort().join(',')
}
function dataArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype
    && Reflect.ownKeys(value).every(key => key === 'length' || (typeof key === 'string' && /^(0|[1-9][0-9]*)$/.test(key)))
    && Object.values(Object.getOwnPropertyDescriptors(value)).every(d => 'value' in d)
}
export function parseCommand(input: unknown): Result<Command> {
  try { return parseDataCommand(input) } catch { return failure('invalid-input') }
}
function parseDataCommand(input: unknown): Result<Command> {
  if (!dataRecord(input) || !dataRecord(input.range)) return failure('invalid-input')
  if (!onlyKeys(input, ['bookId', 'chapterId', 'family', 'mediaId', 'occurrenceId', 'projectId', 'range'])
    || !onlyKeys(input.range, ['endTokenId', 'startTokenId'])) return failure('invalid-input')
  if (![input.projectId, input.bookId, input.chapterId, input.occurrenceId, input.mediaId,
    input.range.startTokenId, input.range.endTokenId].every(isId)
    || typeof input.family !== 'string' || !['SFX', 'Ambiance', 'Musique'].includes(input.family)) return failure('invalid-input')
  return success({ ...input, range: { ...input.range } } as Command)
}
export function prepareChange(snapshot: Snapshot, command: Command): Result<Command> {
  if (snapshot.projectId !== command.projectId) return failure('unknown-project')
  if (snapshot.bookId !== command.bookId) return failure('unknown-book')
  const chapter = snapshot.chapters.find(c => c.id === command.chapterId)
  if (!chapter) return failure('unknown-chapter')
  if (chapter.activeValidations) return failure('unsupported-workflow')
  if (snapshot.chapters.some(c => c.occurrences.some(o => o.occurrenceId === command.occurrenceId))) return failure('duplicate-id')
  if (!snapshot.common.media.includes(command.mediaId)) return failure('unknown-media')
  const startChapter = snapshot.common.text.find(c => c.tokens.some(t => t.id === command.range.startTokenId))
  const endChapter = snapshot.common.text.find(c => c.tokens.some(t => t.id === command.range.endTokenId))
  if (!startChapter || !endChapter) return failure('unknown-token')
  if (startChapter.chapterId !== command.chapterId || endChapter.chapterId !== command.chapterId) return failure('cross-chapter-range')
  const position = (id: string) => startChapter.tokens.findIndex(t => t.id === id)
  const start = position(command.range.startTokenId), end = position(command.range.endTokenId)
  if (start > end) return failure('reversed-range')
  if (command.family === 'Musique' && chapter.occurrences.some(o => o.family === 'Musique'
    && position(o.range.startTokenId) <= end && position(o.range.endTokenId) >= start)) return failure('unsupported-workflow')
  return success(command)
}
export function applyChange(snapshot: Snapshot, command: Command, revision: string): Snapshot {
  return { ...snapshot, revision, chapters: snapshot.chapters.map(c => c.id === command.chapterId
    ? { ...c, occurrences: [...c.occurrences, command] } : c) }
}
// Fixture protocol only. Not a .jacq/.chpt schema or format-version decision.
export function parseSnapshot(value: unknown): Result<Snapshot> {
  try { return parseSnapshotData(value) } catch { return failure('invalid-input') }
}
function parseSnapshotData(value: unknown): Result<Snapshot> {
  if (!dataRecord(value) || !onlyKeys(value, ['projectId', 'bookId', 'revision', 'common', 'chapters'])
    || !isId(value.projectId) || !isId(value.bookId) || !isId(value.revision)
    || !dataRecord(value.common) || !onlyKeys(value.common, ['text', 'media'])
    || !dataArray(value.common.text) || !dataArray(value.common.media)
    || !dataArray(value.chapters) || !value.chapters.length) return failure('invalid-input')
  const chapterIds = new Set<string>(), tokenIds = new Set<string>(), occurrenceIds = new Set<string>()
  for (const c of value.chapters) {
    if (!dataRecord(c) || !onlyKeys(c, ['id', 'activeValidations', 'occurrences'])
      || !isId(c.id) || chapterIds.has(c.id) || typeof c.activeValidations !== 'boolean'
      || !dataArray(c.occurrences)) return failure('invalid-input')
    chapterIds.add(c.id)
  }
  const textChapters = new Set<string>()
  for (const c of value.common.text) {
    if (!dataRecord(c) || !onlyKeys(c, ['chapterId', 'tokens'])
      || !isId(c.chapterId) || !chapterIds.has(c.chapterId) || textChapters.has(c.chapterId)
      || !dataArray(c.tokens)) return failure('invalid-input')
    textChapters.add(c.chapterId)
    for (const t of c.tokens) {
      if (!dataRecord(t) || !onlyKeys(t, ['id', 'text']) || !isId(t.id) || tokenIds.has(t.id) || typeof t.text !== 'string') return failure('invalid-input')
      tokenIds.add(t.id)
    }
  }
  if (textChapters.size !== chapterIds.size || !value.common.media.every(isId)
    || new Set(value.common.media).size !== value.common.media.length) return failure('invalid-input')
  const snapshot = value as unknown as Snapshot
  // Validate loaded references using an empty, editable chapter projection.
  const validationBase: Snapshot = { ...snapshot, chapters: snapshot.chapters.map(c => ({ ...c, activeValidations: false, occurrences: [] })) }
  let progressive = validationBase
  for (const c of snapshot.chapters) for (const o of c.occurrences) {
    const parsed = parseCommand(o)
    if (!parsed.ok || parsed.value.chapterId !== c.id || occurrenceIds.has(parsed.value.occurrenceId)) return failure('invalid-input')
    if (!prepareChange(progressive, parsed.value).ok) return failure('invalid-input')
    occurrenceIds.add(parsed.value.occurrenceId)
    progressive = applyChange(progressive, parsed.value, snapshot.revision)
  }
  // Detach every accepted data record; callers never retain a write reference.
  return success(JSON.parse(JSON.stringify(snapshot)) as Snapshot)
}
