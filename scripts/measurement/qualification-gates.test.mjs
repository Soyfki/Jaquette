import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { URL } from 'node:url'
import { test } from 'node:test'
import { evaluateGate, requiredTargets } from './qualification-gates.mjs'

// All reports in these tests are synthetic fixtures, never campaign evidence.
const sha = 'a'.repeat(40), hash = 'b'.repeat(64)
const expected = { campaignId: 'fixture-current', gateId: 'A-technical', scope: 'device', sha, requiredControlIds: ['contract'] }
function pass(overrides = {}) {
  return { ...expected, controlId: 'contract', oracleId: 'fixture', state: 'PASS', buildHash: null, buildNotApplicable: true,
    environment: { os: 'fixture OS', arch: 'fixture x64', runtime: 'fixture Node' }, command: 'fixture command', exitCode: 0,
    startedAt: '2026-10-06T00:00:00Z', finishedAt: '2026-10-06T00:00:01Z', evidenceRefs: [{ path: 'fixtures/synthetic.log', sha256: hash }], ...overrides }
}
function pending(state) { return pass({ state, reason: 'Not executed: fixture only', missing: ['real implementation'] }) }
function state(result, context = expected) { return evaluateGate([result], context).state }

test('S71-03: PLANNED/BLOCKED are never PASS; complete current device evidence passes', () => {
  assert.equal(state(pending('PLANNED')), 'PLANNED')
  assert.equal(state(pending('BLOCKED')), 'BLOCKED')
  assert.equal(state(pass()), 'PASS')
  assert.equal(evaluateGate([], expected).state, 'BLOCKED')
})

test('S71-03: stale or incomplete PASS is blocked with an explicit reason', () => {
  for (const patch of [
    { sha: 'c'.repeat(40) }, { sha: undefined }, { command: '' }, { exitCode: 1 }, { exitCode: null },
    { environment: {} }, { evidenceRefs: [] }, { evidenceRefs: [{ path: '../secret', sha256: hash }] },
    { evidenceRefs: [{ path: 'C:\\private.log', sha256: hash }] }, { evidenceRefs: [{ path: 'proof.log', sha256: 'wrong' }] },
    { startedAt: 'bad' }, { finishedAt: '2026-10-05T00:00:00Z' }, { buildNotApplicable: false },
  ]) {
    const result = evaluateGate([pass(patch)], expected)
    assert.equal(result.state, 'BLOCKED', JSON.stringify(patch))
    assert.ok(result.controls[0].reasons.length)
  }
  const built = { ...expected, buildHash: hash }
  assert.equal(state(pass({ buildHash: hash }), built), 'PASS')
  assert.equal(state(pass({ buildHash: 'd'.repeat(64) }), built), 'BLOCKED')
})

test('S71-03: malformed campaign, unknown/duplicate controls and states fail closed', () => {
  for (const context of [null, { ...expected, requiredControlIds: [] }, { ...expected, requiredControlIds: ['contract', 'contract'] }, { ...expected, sha: 'short' }, { ...expected, buildHash: 'bad' }]) assert.throws(() => evaluateGate([], context))
  for (const patch of [{ controlId: 'other' }, { oracleId: '' }, { state: 'SUCCESS' }, { campaignId: 'old' }, { gateId: 'other' }, { scope: 'unknown' }, { state: 'BLOCKED', reason: '', missing: [] }]) assert.throws(() => state(pass(patch)))
  assert.throws(() => evaluateGate([pass(), pass()], expected))
})

test('S71-03: FAIL retains execution failure, with precedence over BLOCKED and PLANNED', () => {
  const context = { ...expected, requiredControlIds: ['contract', 'other', 'later'] }
  const fail = pass({ state: 'FAIL', exitCode: 1, reason: 'oracle mismatch' })
  assert.equal(evaluateGate([fail, { ...pending('BLOCKED'), controlId: 'other' }, { ...pending('PLANNED'), controlId: 'later' }], context).state, 'FAIL')
  assert.equal(state({ ...fail, evidenceRefs: [] }), 'FAIL')
  assert.throws(() => state({ ...fail, reason: '' }))
  assert.equal(evaluateGate([pass(), { ...pending('PLANNED'), controlId: 'other' }], { ...expected, requiredControlIds: ['contract', 'other'] }).state, 'PLANNED')
})

test('S71-04: current/future PASS cannot rewrite the historical H-W18 BLOCKED/0.4 NO_GO fixture', () => {
  const bytes = readFileSync(new URL('./fixtures/T-71/historical.json', import.meta.url), 'utf8')
  const history = JSON.parse(bytes), before = JSON.stringify(history)
  const report = pass(); Object.freeze(report)
  assert.equal(state(report), 'PASS')
  assert.equal(JSON.stringify(history), before)
  assert.equal(history.state, 'BLOCKED'); assert.equal(history.conclusion04, 'NO_GO')
  assert.ok(Object.values(history.unknowns).every(value => value === null))
  assert.equal(readFileSync(new URL('./fixtures/T-71/historical.json', import.meta.url), 'utf8'), bytes)
})

test('S71-05: physical gate requires real output/audibility/aspects, never headless/device proof', () => {
  const physical = { ...expected, scope: 'physical-listening', gateId: 'D-listening', buildHash: hash }
  const observation = pass({ gateId: physical.gateId, scope: physical.scope, buildHash: hash,
    environment: { os: 'fixture OS', arch: 'fixture x64', runtime: 'fixture runtime', browser: 'fixture Chrome', headless: false },
    observation: 'Synthetic fixture, not actual listening', physicalObservation: { observed: true, output: 'fixture wired output', audible: true,
      aspects: { transitions: 'fixture observed', loops: 'fixture observed', levels: 'fixture observed', spatialisation: 'fixture observed', dropouts: 'fixture observed' } } })
  assert.equal(state(observation, physical), 'PASS')
  for (const patch of [{ scope: 'device' }, { environment: { ...observation.environment, headless: true } }, { physicalObservation: { ...observation.physicalObservation, output: '' } }, { physicalObservation: { ...observation.physicalObservation, audible: null } }, { physicalObservation: { ...observation.physicalObservation, aspects: {} } }]) assert.equal(state({ ...observation, ...patch }, physical), 'BLOCKED')
  assert.equal(evaluateGate([], physical).state, 'BLOCKED')
  assert.throws(() => evaluateGate([], { ...physical, buildHash: null }))
})

test('S71-05: M1/native Safari deferred until H, then required; never an anticipated PASS', () => {
  assert.deepEqual(requiredTargets('D'), ['W18/Chrome', 'W18/Firefox', 'Windows-x64/native'])
  assert.ok(!requiredTargets('A').some(target => target.startsWith('M1/')))
  assert.ok(requiredTargets('H').includes('M1/Safari'))
  assert.ok(requiredTargets('H').includes('macOS-arm64/native'))
  assert.equal(requiredTargets('H').length, 7)
  assert.throws(() => requiredTargets('I'))
})
