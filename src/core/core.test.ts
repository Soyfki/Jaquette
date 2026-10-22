import { describe, expect, it } from 'vitest'
import { parseCommand, parseSnapshot, prepareChange } from './commands/addAudioOccurrence'
import { command, fixture } from './testing/fixtures'
describe('pure command', () => {
  it('refuses unknown fixture fields and serialization hooks without invoking them', () => {
    let called = false
    const initial = fixture()
    expect(parseSnapshot({ ...initial, unknownFormatVersion: 999 }).ok).toBe(false)
    expect(parseSnapshot({ ...initial, toJSON() { called = true; return initial } }).ok).toBe(false)
    const text = [...initial.common.text]
    Object.defineProperty(text, 'toJSON', { value: () => { called = true; return [] } })
    expect(parseSnapshot({ ...initial, common: { ...initial.common, text } }).ok).toBe(false)
    expect(called).toBe(false)
  })
  it('validates without DOM and does not mutate frozen inputs', () => {
    expect(typeof window).toBe('undefined')
    const snapshot = fixture()
    const freeze = (value: unknown): void => {
      if (typeof value === 'object' && value !== null) { Object.freeze(value); Object.values(value).forEach(freeze) }
    }
    freeze(snapshot)
    const input = command()
    freeze(input)
    const before = JSON.stringify(snapshot)
    expect(prepareChange(snapshot, input)).toEqual({ ok: true, value: input })
    expect(JSON.stringify(snapshot)).toBe(before)
  })
  it('refuses getters and non-string family without invoking conversion', () => {
    let calls = 0
    const hostile = { ...command(), get mediaId() { calls++; return 'media-1' } }
    expect(parseCommand(hostile).ok).toBe(false)
    expect(calls).toBe(0)
    expect(parseCommand(new Proxy({}, { getPrototypeOf() { throw new Error('hostile proxy') } })).ok).toBe(false)
    expect(parseCommand({ ...command(), family: { toString() { calls++; return 'SFX' } } }).ok).toBe(false)
    expect(calls).toBe(0)
  })
  it('preserves opaque IDs byte-for-byte and uses token order instead of lexicographic IDs', () => {
    const input = command({ occurrenceId: 'é - ع' })
    const parsed = parseCommand(input)
    expect(parsed).toEqual({ ok: true, value: input })
    expect(prepareChange(fixture(), input).ok).toBe(true)
  })
})
