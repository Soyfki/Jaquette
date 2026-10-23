import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join, dirname } from 'node:path'
import { inspectDesktop } from './inspect.mjs'

async function workspace(t, declared = true) {
  const parent = resolve(tmpdir())
  const root = await mkdtemp(join(parent, 'jaquette-T75-inspect-'))
  t.after(async () => {
    assert.equal(dirname(resolve(root)), parent)
    assert.ok(root.startsWith(join(parent, 'jaquette-T75-inspect-')))
    await rm(root, { recursive: true, force: true })
  })
  const versions = { electron: '45.0.0', 'electron-builder': '26.15.3' }
  await writeFile(join(root, 'package.json'), JSON.stringify({ devDependencies: declared ? versions : {} }))
  for (const [name, version] of Object.entries(versions)) {
    const directory = join(root, 'node_modules', name)
    await mkdir(directory, { recursive: true })
    await writeFile(join(directory, 'package.json'), JSON.stringify({ name, version, main: 'index.js' }))
    await writeFile(join(directory, 'index.js'), "throw new Error('THIS_PACKAGE_MUST_NEVER_BE_IMPORTED')")
  }
  return root
}

test('metadata inspection does not import packages, download, create a binary or approve pending builds', async (t) => {
  const root = await workspace(t)
  const policy = 'allowBuilds:\n  electron-winstaller: set this to true or false\n'
  await writeFile(join(root, 'pnpm-workspace.yaml'), policy)
  const result = await inspectDesktop(root)
  assert.equal(result.unresolvedPolicy, true)
  assert.ok(result.blockers.includes('dependency-build-approval-pending'))
  assert.ok(result.blockers.includes('electron:windows-binary-not-observed'))
  assert.equal(await readFile(join(root, 'pnpm-workspace.yaml'), 'utf8'), policy)
  await assert.rejects(access(join(root, 'node_modules', 'electron', 'path.txt')), { code: 'ENOENT' })
  assert.equal(result.productReady, false)
})

test('installed but undeclared packages cannot make the worktree ready', async (t) => {
  const result = await inspectDesktop(await workspace(t, false))
  assert.equal(result.blockers.filter((value) => value.includes('missing-exact-declaration')).length, 2)
  assert.equal(result.productReady, false)
})

test('binary traversal reference is refused without touching a sentinel', async (t) => {
  const root = await workspace(t)
  await writeFile(join(root, 'sentinel'), 'unchanged')
  await writeFile(join(root, 'node_modules', 'electron', 'path.txt'), '../../../sentinel')
  const result = await inspectDesktop(root)
  assert.equal(result.binaryPresent, false)
  assert.ok(result.blockers.includes('electron:unexpected-binary-reference'))
  assert.equal(await readFile(join(root, 'sentinel'), 'utf8'), 'unchanged')
})

test('observing an executable file is not installation, renderer isolation or offline proof', async (t) => {
  const root = await workspace(t)
  const directory = join(root, 'node_modules', 'electron')
  await mkdir(join(directory, 'dist'))
  await writeFile(join(directory, 'dist', 'electron.exe'), 'synthetic file, not executed')
  await writeFile(join(directory, 'path.txt'), 'electron.exe')
  const result = await inspectDesktop(root)
  assert.equal(result.binaryPresent, true)
  assert.deepEqual(result.blockers, [])
  assert.equal(result.diagnosticOnly, true)
  assert.equal(result.productReady, false)
})
