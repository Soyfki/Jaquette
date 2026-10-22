import { afterEach, beforeEach, expect, vi } from 'vitest'
let diagnostics: string[]
let restore: () => void
beforeEach(() => {
  diagnostics = []
  const error = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => { diagnostics.push(args.map(String).join(' ')) })
  const warn = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => { diagnostics.push(args.map(String).join(' ')) })
  restore = () => { error.mockRestore(); warn.mockRestore() }
})
afterEach(() => {
  try { expect(diagnostics, 'Unexpected console.error/console.warn').toEqual([]) }
  finally { restore() }
})
