import { failure, success, type Result, type Snapshot } from '../../core/contracts'
import { dataRecord, parseSnapshot } from '../../core/commands/addAudioOccurrence'
export function decodeFixture(text: string): Result<Snapshot> {
  try {
    const value: unknown = JSON.parse(text)
    if (!dataRecord(value) || Object.keys(value).sort().join(',') !== 'kind,snapshot'
      || value.kind !== 'jaquette-contract-fixture') return failure('invalid-input')
    return parseSnapshot(value.snapshot)
  } catch { return failure('invalid-input') }
}
export function encodeFixture(snapshot: Snapshot): string {
  return JSON.stringify({ kind: 'jaquette-contract-fixture', snapshot })
}
export function fixtureCopy(snapshot: Snapshot): Snapshot {
  const parsed = parseSnapshot(snapshot)
  if (!parsed.ok) throw new Error('Invalid contract fixture')
  return parsed.value
}
export { success }
