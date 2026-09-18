import { expect, test as base, type ConsoleMessage } from '@playwright/test'

// Auto fixture covers every browser scenario, including teardown. No exclusions.
export const test = base.extend<{ browserDiagnostics: void }>({
  browserDiagnostics: [async ({ page }, runTest) => {
    const diagnostics: string[] = []
    const onConsole = (message: ConsoleMessage) => {
      if (message.type() === 'error' || message.type() === 'warning') diagnostics.push(`${message.type()}: ${message.text()}`)
    }
    const onPageError = (error: Error) => diagnostics.push(`pageerror: ${error.message}`)
    page.on('console', onConsole)
    page.on('pageerror', onPageError)
    try {
      await runTest()
      expect(diagnostics, 'Unexpected browser errors or warnings').toEqual([])
    } finally {
      page.off('console', onConsole)
      page.off('pageerror', onPageError)
    }
  }, { auto: true }],
})
