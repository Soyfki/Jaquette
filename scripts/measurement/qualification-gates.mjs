// Pure report validation. A valid report is not proof that its facts happened:
// the reviewer must inspect the referenced bytes and execution provenance.
const states = new Set(['PLANNED', 'BLOCKED', 'PASS', 'FAIL'])
const scopes = new Set(['device', 'product-budget', 'physical-listening'])
const shaPattern = /^[a-f0-9]{40}$/i
const hashPattern = /^[a-f0-9]{64}$/i
export const listeningAspects = Object.freeze(['transitions', 'loops', 'levels', 'spatialisation', 'dropouts'])

function text(value) { return typeof value === 'string' && value.trim().length > 0 }
function invalid(message) { throw new TypeError(message) }
function digest(value, pattern) { return typeof value === 'string' && pattern.test(value) }
function evidenceReference(ref) {
  return ref && text(ref.path) && !/^(?:[a-z]+:|\/|\\)/i.test(ref.path)
    && !ref.path.split(/[\\/]/).some(part => part === '..' || part === '')
    && digest(ref.sha256, hashPattern)
}

export function validateResult(result, expected) {
  if (!result || !states.has(result.state)) invalid('Unknown observation state')
  for (const key of ['campaignId', 'gateId', 'controlId', 'oracleId']) if (!text(result[key])) invalid(`Missing ${key}`)
  if (!scopes.has(result.scope)) invalid('Unknown scope')
  if (result.campaignId !== expected.campaignId || result.gateId !== expected.gateId) invalid('Wrong campaign or gate')
  if (!expected.requiredControlIds.includes(result.controlId)) invalid('Unknown control')
  const reasons = []
  if (result.scope !== expected.scope) reasons.push('Scope mismatch; technical proof cannot replace physical listening')
  if (result.state === 'PLANNED' || result.state === 'BLOCKED') {
    if (!text(result.reason) || !Array.isArray(result.missing) || !result.missing.length || !result.missing.every(text)) invalid('Missing reason/unknowns')
    return { controlId: result.controlId, state: result.state, reasons: [...reasons, result.reason], missing: [...result.missing] }
  }
  if (!digest(result.sha, shaPattern) || result.sha !== expected.sha) reasons.push('Missing or stale SHA')
  if (expected.buildHash) {
    if (!digest(result.buildHash, hashPattern) || result.buildHash !== expected.buildHash) reasons.push('Missing or stale build hash')
  } else if (result.scope !== 'device' || result.buildHash !== null || result.buildNotApplicable !== true) {
    reasons.push('Build must be identified, or explicitly not applicable to a device test')
  }
  const env = result.environment
  if (!env || !['os', 'arch', 'runtime'].every(key => text(env[key]))) reasons.push('Incomplete execution environment')
  if (expected.scope !== 'device' && !text(env?.browser)) reasons.push('Missing actual browser/native runtime')
  const start = Date.parse(result.startedAt), end = Date.parse(result.finishedAt)
  if (!/Z$/.test(result.startedAt ?? '') || !/Z$/.test(result.finishedAt ?? '') || !Number.isFinite(start) || !Number.isFinite(end) || end < start) reasons.push('Invalid UTC execution interval')
  if (!Array.isArray(result.evidenceRefs) || !result.evidenceRefs.length || !result.evidenceRefs.every(evidenceReference)) reasons.push('Missing or invalid evidence references')
  if (expected.scope === 'physical-listening') {
    const observation = result.physicalObservation
    if (env?.headless !== false || !text(result.observation) || observation?.observed !== true || !text(observation?.output) || observation?.audible !== true
      || !listeningAspects.every(aspect => text(observation?.aspects?.[aspect]))) reasons.push('Physical output, audibility and required listening aspects not observed')
  } else {
    if (!text(result.command) || !Number.isInteger(result.exitCode)) reasons.push('Missing actual command/exit code')
    if (result.state === 'PASS' && result.exitCode !== 0) reasons.push('Nonzero exit code cannot PASS')
  }
  if (result.state === 'FAIL') {
    if (!text(result.reason)) invalid('FAIL needs a reason')
    // An execution failure must never be concealed by reclassifying it BLOCKED.
    return { controlId: result.controlId, state: 'FAIL', reasons: [...reasons, result.reason] }
  }
  return { controlId: result.controlId, state: reasons.length ? 'BLOCKED' : 'PASS', reasons }
}

export function evaluateGate(results, expected) {
  if (!expected || !text(expected.gateId) || !text(expected.campaignId) || !scopes.has(expected.scope) || !digest(expected.sha, shaPattern)) invalid('Invalid campaign contract')
  if (expected.scope !== 'device' && !digest(expected.buildHash, hashPattern)) invalid('A product/physical campaign requires a build hash')
  if (expected.buildHash != null && !digest(expected.buildHash, hashPattern)) invalid('Invalid build hash')
  if (!Array.isArray(expected.requiredControlIds) || !expected.requiredControlIds.length || !expected.requiredControlIds.every(text)
    || new Set(expected.requiredControlIds).size !== expected.requiredControlIds.length) invalid('Required controls must be explicit, nonempty and unique')
  if (!Array.isArray(results)) invalid('Results must be an array')
  const ids = results.map(result => result?.controlId)
  if (new Set(ids).size !== ids.length) invalid('Duplicate control')
  const controls = results.map(result => validateResult(result, expected))
  for (const id of expected.requiredControlIds) if (!ids.includes(id)) controls.push({ controlId: id, state: 'BLOCKED', reasons: ['Required control has no result'] })
  const state = ['FAIL', 'BLOCKED', 'PLANNED'].find(candidate => controls.some(control => control.state === candidate)) ?? 'PASS'
  return { campaignId: expected.campaignId, gateId: expected.gateId, scope: expected.scope, sha: expected.sha, buildHash: expected.buildHash ?? null, state, controls }
}

// D04-04 / D71-01: targets remain required at their milestone, never prequalified.
export function requiredTargets(milestone) {
  if (!['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(milestone)) invalid('Unknown milestone')
  const intermediate = ['W18/Chrome', 'W18/Firefox', 'Windows-x64/native']
  return milestone === 'H' ? [...intermediate, 'M1/Chrome', 'M1/Firefox', 'M1/Safari', 'macOS-arm64/native'] : intermediate
}
