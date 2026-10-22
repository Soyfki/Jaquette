import type { Command, Snapshot } from '../contracts'
// Observable identity/source contract reused for both adapters and the negative control.
export function assertRoundTrip(before: Snapshot, after: Snapshot, expected: Command): void {
  const actual = after.chapters.find(c => c.id === expected.chapterId)?.occurrences
  if (after.projectId !== before.projectId || after.bookId !== before.bookId
    || JSON.stringify(after.common) !== JSON.stringify(before.common)
    || JSON.stringify(actual) !== JSON.stringify([expected])
    || JSON.stringify(after.chapters.filter(c => c.id !== expected.chapterId))
      !== JSON.stringify(before.chapters.filter(c => c.id !== expected.chapterId))) throw new Error('Identity/source round-trip mismatch')
}
