import { expect, test, type Page } from '@playwright/test'

const routeCases = [
  { path: '/connexion', heading: 'Entrez dans l’atelier Jaquette', title: 'Jaquette — Connexion' },
  { path: '/accueil', heading: 'Bonjour, Noémie.', title: 'Jaquette — Accueil' },
  { path: '/projet', heading: 'Le livre attend sa scène.', title: 'Jaquette — Projet' },
  { path: '/parametres', heading: 'Paramètres du prototype', title: 'Jaquette — Paramètres' },
] as const

function collectErrors(page: Page) {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  return { consoleErrors, pageErrors }
}

async function expectNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

test('opens every primary URL directly with a stable, accessible shell', async ({ page }, testInfo) => {
  const errors = collectErrors(page)

  for (const route of routeCases) {
    await page.goto(route.path)
    await expect(page).toHaveURL(route.path)
    await expect(page).toHaveTitle(route.title)
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('.nav-link[aria-current="page"]')).toContainText(route.path === '/parametres' ? 'Paramètres' : route.title.replace('Jaquette — ', ''))
    await expectNoOverflow(page)
    await page.screenshot({
      path: `test-results/visual/${route.path.slice(1)}-${testInfo.project.name}.png`,
      fullPage: true,
    })
  }

  const viewport = page.viewportSize()!
  await page.screenshot({
    path: `test-results/visual/shell-${testInfo.project.name}-${viewport.width}x${viewport.height}.png`,
    fullPage: true,
  })
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('renders the Sound Designer workspace with its visual and responsive hierarchy', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/projet')
  await expect(page.getByRole('heading', { level: 1, name: 'Le livre attend sa scène.' })).toBeVisible()

  const library = page.locator('[data-workspace-region="library"]')
  const book = page.locator('[data-workspace-region="book"]')
  const inspector = page.locator('[data-workspace-region="inspector"]')
  const simulation = page.locator('[data-workspace-region="simulation"]')
  await expect(library).toBeVisible()
  await expect(book).toBeVisible()
  await expect(inspector).toBeVisible()
  await expect(simulation).toBeVisible()
  await expect(page.locator('[data-project-track]')).toHaveCount(3)
  await expect(page.locator('[data-project-track] [role="img"]')).toHaveCount(3)
  await expect(page.getByText('Aucune occurrence sélectionnée')).toBeVisible()
  await expect(page.getByText('Inactive')).toBeVisible()
  await expect(page.locator('.project-book-page')).toHaveCSS('background-color', 'rgb(239, 242, 255)')
  await expect(page.locator('.project-book-page__content')).toHaveCSS('font-family', /Literata/)
  await expect(page.locator('body')).toHaveCSS('font-family', /Manrope/)
  await expect(page.locator('.sound-workspace').locator('input, textarea, select, button, audio')).toHaveCount(0)
  await expect(page.locator('[contenteditable]')).toHaveCount(0)
  await expect(page.getByRole('combobox')).toHaveCount(0)
  await expectNoOverflow(page)

  const rectangles = await page.locator('[data-workspace-region]').evaluateAll((regions) => (
    Object.fromEntries(regions.map((region) => {
      const rect = region.getBoundingClientRect()
      return [
        region.getAttribute('data-workspace-region'),
        { left: rect.left, right: rect.right, top: rect.top, width: rect.width },
      ]
    }))
  )) as Record<string, { left: number; right: number; top: number; width: number }>

  if (testInfo.project.name === 'chrome-desktop') {
    expect(rectangles.library.right).toBeLessThanOrEqual(rectangles.book.left)
    expect(rectangles.book.right).toBeLessThanOrEqual(rectangles.inspector.left)
    expect(rectangles.book.width).toBeGreaterThan(rectangles.library.width)
    expect(rectangles.book.width).toBeGreaterThan(rectangles.inspector.width)
  } else {
    expect(rectangles.book.top).toBeLessThan(rectangles.library.top)
    expect(rectangles.book.top).toBeLessThan(rectangles.inspector.top)
    expect(rectangles.library.width).toBeGreaterThan(250)
    expect(rectangles.inspector.width).toBeGreaterThan(250)
  }

  const viewport = page.viewportSize()!
  await page.screenshot({
    path: `test-results/visual/projet-workspace-${testInfo.project.name}-${viewport.width}x${viewport.height}.png`,
    fullPage: true,
  })
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('navigates from home to the project without reloading the shell', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/accueil')
  await page.evaluate(() => {
    ;(window as Window & { __jaquetteProjectMarker?: string }).__jaquetteProjectMarker = 'preserved'
  })

  await page.getByRole('button', { name: /Ouvrir l’état du projet/ }).click()
  await expect(page).toHaveURL('/projet')
  await expect(page).toHaveTitle('Jaquette — Projet')
  await expect(page.getByRole('heading', { level: 1, name: 'Le livre attend sa scène.' })).toBeFocused()
  await expect(page.locator('a[href="/projet"]')).toHaveAttribute('aria-current', 'page')
  expect(await page.evaluate(() => (window as Window & { __jaquetteProjectMarker?: string }).__jaquetteProjectMarker)).toBe('preserved')

  await page.goBack()
  await expect(page).toHaveURL('/accueil')
  await page.goForward()
  await expect(page).toHaveURL('/projet')
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('uses semantic Material Symbols Rounded in every navigation marker', async ({ page }) => {
  await page.goto('/accueil')
  await expect(page.locator('[data-material-style="rounded-outlined"]')).toHaveCount(5)
  expect(await page.locator('[data-material-symbol]').evaluateAll((symbols) => (
    symbols.map((symbol) => symbol.getAttribute('data-material-symbol'))
  ))).toEqual(['login', 'home', 'book_2', 'settings', 'palette'])
  expect(await page.locator('.nav-link__marker').allTextContents()).toEqual(['', '', '', '', ''])
})

test('navigates without reload and restores history, URL, title and focus', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/accueil')
  await page.evaluate(() => {
    ;(window as Window & { __jaquetteShellMarker?: string }).__jaquetteShellMarker = 'preserved'
  })

  await page.getByRole('link', { name: 'Paramètres' }).click()
  await expect(page).toHaveURL('/parametres')
  await expect(page).toHaveTitle('Jaquette — Paramètres')
  await expect(page.getByRole('heading', { level: 1, name: 'Paramètres du prototype' })).toBeFocused()
  expect(await page.evaluate(() => (window as Window & { __jaquetteShellMarker?: string }).__jaquetteShellMarker)).toBe('preserved')
  await expect(page.locator('a[href="/parametres"]')).toHaveAttribute('aria-current', 'page')

  await page.getByRole('link', { name: 'Projet' }).click()
  await expect(page).toHaveURL('/projet')
  await page.goBack()
  await expect(page).toHaveURL('/parametres')
  await expect(page.getByRole('heading', { level: 1, name: 'Paramètres du prototype' })).toBeFocused()
  await page.goForward()
  await expect(page).toHaveURL('/projet')
  await expect(page.getByRole('heading', { level: 1, name: 'Le livre attend sa scène.' })).toBeFocused()

  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('supports the skip link and a visible keyboard navigation path', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/accueil')
  const skipLink = page.getByRole('link', { name: 'Aller au contenu' })
  await skipLink.focus()
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toHaveCSS('opacity', '1')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()

  await page.goto('/accueil')
  const brandLink = page.getByRole('link', { name: 'Jaquette, aller à l’accueil' })
  await brandLink.focus()
  await expect(brandLink).toBeFocused()
  await page.keyboard.press('Tab')
  const connectionLink = page.getByRole('link', { name: 'Connexion' })
  await expect(connectionLink).toBeFocused()
  const focus = await connectionLink.evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
  })
  expect(focus.style).not.toBe('none')
  expect(focus.width).toBeGreaterThan(0)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/connexion')

  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('canonicalizes the root and handles an unknown URL explicitly', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/')
  await expect(page).toHaveURL('/accueil')
  await expect(page.getByRole('heading', { level: 1, name: 'Bonjour, Noémie.' })).toBeVisible()

  await page.goto('/adresse-inconnue')
  await expect(page).toHaveURL('/adresse-inconnue')
  await expect(page).toHaveTitle('Jaquette — Écran introuvable')
  await expect(page.getByRole('heading', { level: 1, name: 'Cet écran n’existe pas.' })).toBeVisible()

  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('preserves the complete foundations 1.1 demonstration', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/fondations')
  await expect(page).toHaveTitle('Jaquette — Fondations')
  await expect(page.getByRole('heading', { level: 1, name: 'La voix du livre commence ici.' })).toBeVisible()
  await expect(page.locator('[data-track]')).toHaveCount(3)
  await expect(page.locator('[data-track="SFX"]')).toContainText('SFX')
  await expect(page.locator('[data-track="Ambiance"]')).toContainText('Ambiance')
  await expect(page.locator('[data-track="Musique"]')).toContainText('Musique')
  await expect(page.locator('.arabic-sample')).toHaveAttribute('dir', 'rtl')

  const foundations = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const body = getComputedStyle(document.body)
    const book = getComputedStyle(document.querySelector('.book-page')!)
    const bookContent = getComputedStyle(document.querySelector('.book-page__content')!)
    const arabic = getComputedStyle(document.querySelector('.arabic-sample')!)
    return {
      colors: [
        '--color-background',
        '--color-text',
        '--color-accent',
        '--color-secondary',
        '--color-validation',
        '--color-track-sfx',
        '--color-track-ambience',
        '--color-track-music',
        '--color-success-dark',
        '--color-success-light',
        '--color-error',
      ].map((token) => root.getPropertyValue(token).trim()),
      interfaceFont: body.fontFamily,
      bookFont: bookContent.fontFamily,
      arabicFont: arabic.fontFamily,
      arabicDirection: arabic.direction,
      bookBackground: book.backgroundColor,
    }
  })

  expect(foundations.colors).toEqual([
    '#1B1B3A', '#EFF2FF', '#FFDFB2', '#74A4BC', '#CFF2EC', '#FFAF87',
    '#E56399', '#9358FF', '#83B692', '#355A40', '#A20021',
  ])
  expect(foundations.interfaceFont).toContain('Manrope')
  expect(foundations.bookFont).toContain('Literata')
  expect(foundations.arabicFont).toContain('Noto Naskh Arabic')
  expect(foundations.arabicDirection).toBe('rtl')
  expect(foundations.bookBackground).toBe('rgb(239, 242, 255)')
  await expectNoOverflow(page)

  const viewport = page.viewportSize()!
  await page.screenshot({
    path: `test-results/visual/fondations-${testInfo.project.name}-${viewport.width}x${viewport.height}.png`,
    fullPage: true,
  })
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})
