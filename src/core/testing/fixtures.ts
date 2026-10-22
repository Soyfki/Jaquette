import { parseCommand, parseSnapshot } from '../commands/addAudioOccurrence'
import type { Actor, Command, Snapshot } from '../contracts'
export const actor: Actor = { identityId: 'person-1', workspaceId: 'house-1', teamId: 'team-1' }
export function fixture(): Snapshot {
  const parsed = parseSnapshot({
    projectId: 'project-1', bookId: 'book-1', revision: 'base',
    common: { text: [
      { chapterId: 'chapter-1', tokens: [{ id: 't-z', text: 'Bonjour' }, { id: 't-a', text: 'world' }, { id: 't-ع', text: 'مرحبا' }] },
      { chapterId: 'chapter-2', tokens: [{ id: 't-other', text: 'ailleurs' }] },
    ], media: ['media-1'] },
    chapters: [{ id: 'chapter-1', activeValidations: false, occurrences: [] }, { id: 'chapter-2', activeValidations: false, occurrences: [] }],
  })
  if (!parsed.ok) throw new Error('Invalid test fixture')
  return parsed.value
}
export function command(changes: Record<string, unknown> = {}): Command {
  const parsed = parseCommand({
    projectId: 'project-1', bookId: 'book-1', chapterId: 'chapter-1', occurrenceId: 'occurrence-1',
    family: 'SFX', range: { startTokenId: 't-z', endTokenId: 't-ع' }, mediaId: 'media-1', ...changes,
  })
  if (!parsed.ok) throw new Error('Invalid command fixture')
  return parsed.value
}
