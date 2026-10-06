import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { URL } from 'node:url'
import { test } from 'node:test'
import { budgets, common, stats } from './contract.mjs'

const read = name => JSON.parse(readFileSync(new URL(`./fixtures/T-71/${name}.json`, import.meta.url), 'utf8'))
const adopted = read('adopted-pr12')
const oracle = read('routing-oracle')
const routingKeys = ['protocol', 'name', 'phase', 'lots', 'tickets', 'milestone', 'qualificationMilestones']
const plan = readFileSync(new URL('../../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md', import.meta.url), 'utf8')

function assertRouting(candidate) {
  for (const [id, expected] of Object.entries(oracle.routing)) {
    const budget = candidate.find(row => row.id === id)
    assert.ok(budget, id)
    for (const key of routingKeys) assert.deepEqual(budget[key], expected[key], `${id}.${key}`)
  }
}

test('S71-01: budget/function/lot/phase correspondences match an independent oracle', () => {
  assertRouting(budgets)
  for (const row of Object.values(oracle.routing)) assert.ok(plan.includes(row.planTitle), row.planTitle)
  for (const [id, patch] of [['B06', { phase: '4.1-4.2' }], ['B12', { lots: ['JQ-50'], tickets: ['T-90'] }], ['B13', { phase: '11; 15-16' }], ['B06', { name: 'Metadata indexing' }]]) {
    const mutant = budgets.map(row => row.id === id ? { ...row, ...patch } : row)
    assert.throws(() => assertRouting(mutant))
  }
})

function assertAdopted(candidate) {
  assert.equal(candidate.length, 14)
  const changedCommon = new Set(['version', 'phaseScope', 'macQualificationPhase'])
  for (const [i, original] of adopted.budgets.entries()) {
    assert.equal(candidate[i].id, original.id)
    for (const [key, value] of Object.entries(original)) {
      if (changedCommon.has(key) || (key === 'phase' && oracle.routing[original.id]) || (key === 'prerequisite' && original.id === 'B13')) continue
      assert.deepEqual(candidate[i][key], value, `${original.id}.${key}`)
    }
  }
}

test('S71-02: all fourteen adopted targets, scientific parameters and other phases preserved', () => {
  assert.equal(adopted.source.blob, '357ea192fc03175da801eaa68cef573e423fbcf6')
  assertAdopted(budgets)
  for (const [key, value] of Object.entries({ target: 'p95 <=99999 ms', longRuns: 1, interactionEvents: 10, percentile: 'interpolated', units: { ms: 'second' }, cache: 'any', statistics: 'median only', load: 'empty', end: 'first placeholder', instrumentation: 'DOM only' })) {
    const mutant = budgets.map(row => row.id === 'B06' ? { ...row, [key]: value } : row)
    assert.throws(() => assertAdopted(mutant), key)
  }
  assert.match(budgets.find(row => row.id === 'B13').prerequisite, /13\.2-13\.3 \/ JQ-31/)
  assert.equal(common.targetState, 'ADOPTED')
  assert.equal(common.observationState, 'PLANNED')
})

test('statistics preserve nearest rank p95, median and reject invalid or insufficient samples', () => {
  assert.deepEqual(stats([10, 1, 3, 2]), { n: 4, median: 2.5, p95: 10, max: 10, min: 1 })
  assert.equal(stats(Array.from({ length: 100 }, (_, i) => 100 - i), 100).p95, 95)
  for (const samples of [[], [NaN], [Infinity], [-1]]) assert.throws(() => stats(samples))
  assert.throws(() => stats([1], 100))
})

test('S71-06: active docs expose corrected routes and immutable source, without fictitious commands', () => {
  const doc = readFileSync(new URL('../../docs/measurement/T-71-BUDGETS-ET-GATES.md', import.meta.url), 'utf8')
  for (const [id, row] of Object.entries(oracle.routing)) {
    assert.ok(doc.includes(id))
    for (const ticket of row.tickets) assert.ok(doc.includes(ticket))
  }
  for (const token of ['D71-01', 'H-W18', 'BLOCKED', 'NO_GO', 'PLANNED', adopted.source.sha, 'transitions', 'spatialisation', 'décrochages']) assert.ok(doc.includes(token), token)
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))
  assert.ok(pkg.scripts['test:tooling'].includes('scripts/measurement/contract.test.mjs'))
  assert.ok(pkg.scripts['test:tooling'].includes('scripts/measurement/qualification-gates.test.mjs'))
  assert.equal(pkg.scripts['test:measurement'], undefined)
})
