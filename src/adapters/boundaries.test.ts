import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { describe, expect, it } from 'vitest'
import ts from 'typescript'
import { fixture, command } from '../core/testing/fixtures'
import { assertRoundTrip } from '../core/testing/adapterOracle'
import { applyChange } from '../core/commands/addAudioOccurrence'
const root = resolve(import.meta.dirname, '../..')
function graph(entry: string, forbidden: RegExp): void {
  const visited = new Set<string>()
  function walk(path: string) {
    if (visited.has(path)) return
    visited.add(path)
    const text = readFileSync(path, 'utf8')
    const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
    const visit = (node: ts.Node): void => {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        const module = node.moduleSpecifier
        if (module && ts.isStringLiteral(module)) {
          if (!module.text.startsWith('.')) throw new Error('External import in boundary: ' + module.text)
          walk(resolve(dirname(path), module.text + '.ts'))
        }
      }
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) throw new Error('Dynamic import in boundary')
      if (ts.isIdentifier(node) && forbidden.test(node.text)) throw new Error('Forbidden platform dependency: ' + node.text)
      ts.forEachChild(node, visit)
    }
    visit(file)
  }
  walk(resolve(root, entry))
}
describe('contract boundaries and negative oracle', () => {
  it('keeps the core import graph platform-free and the Web graph without disk/IPC', () => {
    graph('src/core/executeCommand.ts', /^(window|document|HTMLElement|React|process|require|Buffer|fetch|XMLHttpRequest)$/)
    graph('src/adapters/web/createWebAdapter.ts', /^(window|document|process|require|Buffer|fetch|XMLHttpRequest|ipcRenderer)$/)
  })
  it('rejects a controlled adapter mutation that regenerates the persisted occurrence ID', () => {
    const before = fixture(), expected = command()
    const correct = applyChange(before, expected, 'next')
    expect(() => assertRoundTrip(before, correct, expected)).not.toThrow()
    const mutant = applyChange(before, command({ occurrenceId: 'regenerated' }), 'next')
    expect(() => assertRoundTrip(before, mutant, expected)).toThrow('round-trip mismatch')
  })
})
