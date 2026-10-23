// T75 diagnostic only: never import Electron (45 lazily downloads on require).
import { readFile, lstat, realpath } from 'node:fs/promises'
import { resolve, join, relative, isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'

async function optionalFile(path) {
  try { return await readFile(path, 'utf8') } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

export async function inspectDesktop(root) {
  root = resolve(root)
  const directory = await lstat(root)
  if (!directory.isDirectory() || directory.isSymbolicLink()) throw new Error('INVALID_ROOT')
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  const policy = await optionalFile(join(root, 'pnpm-workspace.yaml'))
  const unresolvedPolicy = !!policy?.includes('set this to true or false')
  const installed = {}
  const blockers = []
  for (const name of ['electron', 'electron-builder']) {
    const declaration = manifest.devDependencies?.[name] ?? null
    const bytes = await optionalFile(join(root, 'node_modules', name, 'package.json'))
    const metadata = bytes ? JSON.parse(bytes) : null
    installed[name] = { declared: declaration, installed: metadata?.version ?? null }
    if (!declaration || !/^\d+\.\d+\.\d+$/.test(declaration)) blockers.push(`${name}:missing-exact-declaration`)
    else if (metadata?.version !== declaration) blockers.push(`${name}:installed-version-mismatch`)
  }
  if (unresolvedPolicy) blockers.push('dependency-build-approval-pending')
  const pathFile = await optionalFile(join(root, 'node_modules', 'electron', 'path.txt'))
  let binaryPresent = false
  if (pathFile !== null) {
    // Windows qualification only; never follow a supplied general filesystem path.
    if (pathFile !== 'electron.exe') blockers.push('electron:unexpected-binary-reference')
    else {
      const packageRoot = await realpath(join(root, 'node_modules', 'electron'))
      const distRoot = join(packageRoot, 'dist')
      const path = join(distRoot, pathFile)
      const info = await lstat(path).catch((e) => { if (e.code === 'ENOENT') return null; throw e })
      if (info?.isFile() && !info.isSymbolicLink()) {
        const resolved = await realpath(path)
        const local = relative(distRoot, resolved)
        binaryPresent = !local.startsWith('..') && !isAbsolute(local)
      }
    }
  }
  if (!binaryPresent) blockers.push('electron:windows-binary-not-observed')
  return {
    diagnosticOnly: true, productReady: false, platform: process.platform,
    installed, binaryPresent, unresolvedPolicy, blockers,
    effect: 'Read metadata and file presence only; no import, download, approval, build, installation or launch.',
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2)
  if (args.length === 1 && args[0] === '--help') {
    console.log('node scripts/desktop/inspect.mjs --root WORKTREE : static diagnostic, no package import/download/approval/launch; not a qualification.')
  } else {
    if (args.length !== 2 || args[0] !== '--root') throw new Error('Use --help')
    const result = await inspectDesktop(args[1])
    console.log(JSON.stringify(result, null, 2))
    if (result.blockers.length) process.exitCode = 2
  }
}
