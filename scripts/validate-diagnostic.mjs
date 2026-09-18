import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { arch, platform, release } from 'node:os'
import { join } from 'node:path'

const pnpm = process.env.npm_execpath
if (!pnpm) throw new Error('Lancer avec pnpm validate:diagnostic pour utiliser le gestionnaire fixé.')
const output = 'test-results/qualification'
mkdirSync(output, { recursive: true })
const git = spawnSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, 'rev-parse', 'HEAD'], { encoding: 'utf8' })
if (git.status !== 0) throw new Error('SHA Git non identifiable ; campagne refusée.')
const state = spawnSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, 'status', '--porcelain=v1'], { encoding: 'utf8' })
if (state.status !== 0) throw new Error('État Git non identifiable ; campagne refusée.')
const report = {
  sha: git.stdout.trim(), startedAt: new Date().toISOString(),
  workingTree: state.stdout.trim() || 'clean',
  environment: { platform: platform(), release: release(), arch: arch(), node: process.version },
  checks: [],
}
for (const name of ['typecheck', 'lint', 'test', 'build', 'check:links', 'check:secrets', 'check:reference', 'test:tooling', 'test:e2e']) {
  const result = spawnSync(process.execPath, [pnpm, name], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 })
  const log = `${result.stdout ?? ''}${result.stderr ?? ''}${result.error?.message ?? ''}`
  const file = `${name.replaceAll(':', '-')}.log`
  writeFileSync(join(output, file), log)
  const status = result.error ? 'BLOCKED' : result.status === 0 ? 'PASS' : 'FAIL'
  report.checks.push({ command: `pnpm ${name}`, code: result.status, signal: result.signal, status, log: file })
  console.log(`${status} pnpm ${name} (code ${result.status})\n${log}`)
}
report.finishedAt = new Date().toISOString()
writeFileSync(join(output, 'summary.json'), JSON.stringify(report, null, 2) + '\n')
if (report.checks.some((check) => check.status !== 'PASS')) process.exitCode = 1
