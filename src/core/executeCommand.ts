import { failure, type Actor, type Cancellation, type Ports, type Result } from './contracts'
import { parseCommand, prepareChange } from './commands/addAudioOccurrence'
export async function executeCommand(input: unknown, actor: Actor, ports: Ports, cancellation?: Cancellation): Promise<Result<{ revision: string }>> {
  const parsed = parseCommand(input)
  if (!parsed.ok) return parsed
  if (cancellation?.aborted) return failure('cancelled')
  const command = parsed.value
  try {
    if (!ports.access.authorizeEdit(actor, command.projectId, command.chapterId)) return failure('forbidden')
    const loaded = await ports.repository.readContext(command.projectId, command.chapterId)
    if (!loaded.ok) return loaded
    const prepared = prepareChange(loaded.value, command)
    if (!prepared.ok) return prepared
    const audio = await ports.audio.describe(command.mediaId)
    if (!audio.ok) return audio
    if (!audio.value.available) return failure('unavailable')
    if (cancellation?.aborted) return failure('cancelled')
    // Repositories revalidate authority, cancellation and revision at commit.
    try {
      return await ports.repository.commitChapter({ command, expectedRevision: loaded.value.revision, actor, cancellation })
    } catch { return failure('outcome-unknown') }
  } catch { return failure('unavailable') }
}
