import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { createServer } from 'vite'

function option(name) {
  const index = process.argv.indexOf(name)
  if (index < 0 || !process.argv[index + 1] || process.argv[index + 1].startsWith('--')) throw new Error(`Missing ${name}`)
  return resolve(process.argv[index + 1])
}
const baseline = option('--baseline-root')
const candidate = fileURLToPath(new URL('..', import.meta.url))
const output = option('--output-dir')
assert.notEqual(baseline, resolve(candidate), 'Use an independent baseline checkout')
const provenance = root => ({ root, sha: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), clean: !execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim() })
const context = { baseline: provenance(baseline), candidate: provenance(candidate), startedAt: new Date().toISOString(), exitCode: null }
const servers = []
await mkdir(output, { recursive: true })
try {
  for (const [root, port] of [[baseline, 4174], [candidate, 4175]]) {
    const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port, strictPort: true, open: false } })
    servers.push(server)
    await server.listen()
    console.log(`Owned Vite ${root} on 127.0.0.1:${port}`)
  }
  const child = spawn(process.execPath, [fileURLToPath(new URL('./compare-prototype.mjs', import.meta.url)), '--baseline-url', 'http://127.0.0.1:4174', '--candidate-url', 'http://127.0.0.1:4175', '--output-dir', output], { cwd: candidate, stdio: 'inherit' })
  context.exitCode = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', code => resolve(code ?? 1)) })
  process.exitCode = context.exitCode
} finally {
  await Promise.all(servers.map(server => server.close()))
  context.finishedAt = new Date().toISOString()
  await writeFile(resolve(output, 'context.json'), JSON.stringify(context, null, 2) + '\n')
  console.log('Both owned Vite instances closed')
}
