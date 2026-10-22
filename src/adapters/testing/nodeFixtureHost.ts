import { readFile, writeFile, lstat, open } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { resolve, join } from 'node:path'
import { applyChange, prepareChange } from '../../core/commands/addAudioOccurrence'
import { failure, success, type Access, type Repository, type Snapshot } from '../../core/contracts'
import { decodeFixture, encodeFixture, fixtureCopy } from './fixtureProtocol'

// Harness only: directory is created by the test, never accepted from a command.
// Whole fixture writes make no crash/partial-file/production-storage claim.
export async function openFixtureHost(directory: string, scope: Snapshot, access: Access, nextRevision: () => string) {
  scope = fixtureCopy(scope)
  const root = resolve(directory), file = join(root, 'contract-fixture.json')
  if (!(await lstat(root)).isDirectory() || (await lstat(root)).isSymbolicLink()) throw new Error('Owned fixture directory required')
  let closed = false
  // Serialize all clients using this host, including awaits in file operations.
  let queue = Promise.resolve()
  const exclusive = <T>(operation: () => Promise<T>): Promise<T> => {
    const run = queue.then(operation)
    queue = run.then(() => undefined, () => undefined)
    return run
  }
  async function load() {
    const metadata = await lstat(file)
    if (!metadata.isFile() || metadata.isSymbolicLink()) return failure('storage-failure')
    const parsed = decodeFixture(await readFile(file, 'utf8'))
    if (parsed.ok && (parsed.value.projectId !== scope.projectId || parsed.value.bookId !== scope.bookId)) return failure('unknown-project')
    return parsed
  }
  const repository: Repository = {
    readContext: (projectId, chapterId) => exclusive(async () => {
      if (closed) return failure('unavailable')
      if (projectId !== scope.projectId) return failure('unknown-project')
      if (!scope.chapters.some(c => c.id === chapterId)) return failure('unknown-chapter')
      try { return await load() } catch { return failure('storage-failure') }
    }),
    commitChapter: request => exclusive(async () => {
      if (closed) return failure('unavailable')
      const { command, expectedRevision, actor, cancellation } = request
      if (command.projectId !== scope.projectId || !scope.chapters.some(c => c.id === command.chapterId)) return failure('forbidden')
      try {
        const loaded = await load()
        if (!loaded.ok) return loaded
        if (cancellation?.aborted) return failure('cancelled')
        if (!access.authorizeEdit(actor, command.projectId, command.chapterId)) return failure('forbidden')
        if (loaded.value.revision !== expectedRevision) return failure('stale-revision')
        const prepared = prepareChange(loaded.value, command)
        if (!prepared.ok) return prepared
        const revision = nextRevision()
        if (!revision.trim() || revision === loaded.value.revision) return failure('storage-failure')
        const next = fixtureCopy(applyChange(loaded.value, command, revision))
        // Recheck immediately before write; actual IPC revocation belongs to T-75.
        if (cancellation?.aborted) return failure('cancelled')
        if (!access.authorizeEdit(actor, command.projectId, command.chapterId)) return failure('forbidden')
        try {
          const bytes = Buffer.from(encodeFixture(next))
          const handle = await open(file, 'r+')
          try {
            if (cancellation?.aborted) return failure('cancelled')
            if (!access.authorizeEdit(actor, command.projectId, command.chapterId)) return failure('forbidden')
            await handle.writeFile(bytes)
            await handle.truncate(bytes.length)
          }
          finally { await handle.close() }
        }
        catch { return failure('outcome-unknown') }
        return success({ revision })
      } catch { return failure('storage-failure') }
    }),
  }
  return { repository, close: async () => { await exclusive(async () => { closed = true }) } }
}
export async function initializeFixture(directory: string, snapshot: Snapshot) {
  const copy = fixtureCopy(snapshot)
  await writeFile(join(resolve(directory), 'contract-fixture.json'), encodeFixture(copy), { encoding: 'utf8', flag: 'wx' })
}
