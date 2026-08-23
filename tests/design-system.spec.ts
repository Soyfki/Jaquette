import { expect, test } from '@playwright/test'

test('loads the design system in Chrome without visual overflow or console errors', async ({ page }, testInfo) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/')
  await expect(page).toHaveTitle('Jaquette — Design system')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('La voix du livre commence ici.')
  await expect(page.locator('[data-track]')).toHaveCount(3)
  await expect(page.getByText('كان البحر هادئًا، وكانت الكلمات تسير مع ضوء الصباح.')).toBeVisible()

  const viewport = page.viewportSize()
  expect(viewport).not.toBeNull()
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)

  const fontFamilies = await page.evaluate(() => ({
    interface: getComputedStyle(document.body).fontFamily,
    book: getComputedStyle(document.querySelector('.book-page__content')!).fontFamily,
    arabic: getComputedStyle(document.querySelector('.arabic-sample')!).fontFamily,
    arabicDirection: getComputedStyle(document.querySelector('.arabic-sample')!).direction,
  }))
  expect(fontFamilies.interface).toContain('Manrope')
  expect(fontFamilies.book).toContain('Literata')
  expect(fontFamilies.arabic).toContain('Noto Naskh Arabic')
  expect(fontFamilies.arabicDirection).toBe('rtl')

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: /Explorer les fondations/ })).toBeFocused()
  const focusOutline = await page.getByRole('button', { name: /Explorer les fondations/ }).evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: style.outlineWidth }
  })
  expect(focusOutline.style).not.toBe('none')
  expect(Number.parseFloat(focusOutline.width)).toBeGreaterThan(0)

  await page.getByRole('button', { name: 'Musique' }).click()
  await expect(page.getByRole('button', { name: 'Musique' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toHaveCSS('opacity', '0')

  const screenshotName = `${testInfo.project.name}-${viewport!.width}x${viewport!.height}.png`
  await page.screenshot({ path: `test-results/visual/${screenshotName}`, fullPage: true })

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})
