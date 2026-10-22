import { applyChange, prepareChange } from '../../core/commands/addAudioOccurrence'
import { failure, success, type Access, type Repository, type Snapshot } from '../../core/contracts'
import { decodeFixture, encodeFixture, fixtureCopy } from '../testing/fixtureProtocol'
export function createWebAdapter(initial: Snapshot, access: Access, nextRevision: () => string) {
  let current = fixtureCopy(initial)
  const repository: Repository = {
    async readContext(projectId, chapterId) {
      if (projectId !== current.projectId) return failure('unknown-project')
      if (!current.chapters.some(c => c.id === chapterId)) return failure('unknown-chapter')
      return success(fixtureCopy(current))
    },
    async commitChapter({ command, expectedRevision, actor, cancellation }) {
      if (cancellation?.aborted) return failure('cancelled')
      if (!access.authorizeEdit(actor, command.projectId, command.chapterId)) return failure('forbidden')
      if (current.revision !== expectedRevision) return failure('stale-revision')
      const prepared = prepareChange(current, command)
      if (!prepared.ok) return prepared
      const revision = nextRevision()
      if (!revision.trim() || revision === current.revision) return failure('storage-failure')
      current = fixtureCopy(applyChange(current, command, revision))
      return success({ revision })
    },
  }
  return { repository, exportFixture: () => encodeFixture(current), importFixture(text: string) {
    const parsed = decodeFixture(text)
    if (!parsed.ok) return parsed
    if (parsed.value.projectId !== current.projectId || parsed.value.bookId !== current.bookId) return failure('unknown-project')
    current = parsed.value
    return success(undefined)
  } }
}
