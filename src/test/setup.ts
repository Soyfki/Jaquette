import '@testing-library/jest-dom/vitest'



import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect, vi } from 'vitest'

let diagnostics: string[]
let restoreConsole: () => void

beforeEach(() => {
  diagnostics = []
  const originalError = console.error
  const originalWarn = console.warn
  const error = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    diagnostics.push(args.map(String).join(' '))
    originalError(...args)
  })
  const warn = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    diagnostics.push(args.map(String).join(' '))
    originalWarn(...args)
  })
  restoreConsole = () => { error.mockRestore(); warn.mockRestore() }
})

afterEach(() => {
  try {
    cleanup()
    expect(diagnostics, 'Unexpected console.error/console.warn').toEqual([])
  } finally {
    restoreConsole()
  }
})
