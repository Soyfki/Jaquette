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

test('opens every primary URL directly with its accessible shell', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  for (const route of routeCases) {
    await page.goto(route.path)
    await expect(page).toHaveURL(route.path)
    await expect(page).toHaveTitle(route.title)
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('main')).toBeVisible()
    if (route.path === '/projet') {
      await expect(page.locator('.app-sidebar')).toHaveCount(0)
      const menu = page.getByRole('button', { name: 'Ouvrir la navigation générale' })
      await expect(menu).toHaveAttribute('aria-expanded', 'false')
      await menu.click()
      await expect(page.locator('.nav-link[aria-current="page"]')).toContainText('Projet')
      await page.keyboard.press('Escape')
    } else {
      await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible()
      await expect(page.locator('.nav-link[aria-current="page"]')).toContainText(route.path === '/parametres' ? 'Paramètres' : route.title.replace('Jaquette — ', ''))
    }
    await expectNoOverflow(page)
    await page.screenshot({ path: `test-results/visual/${route.path.slice(1)}-${testInfo.project.name}.png`, fullPage: true })
  }
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('keeps the Sound Designer panels aligned around a dominant book', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/projet')
  const library = page.locator('[data-workspace-region="library"]')
  const book = page.locator('[data-workspace-region="book"]')
  const inspector = page.locator('[data-workspace-region="inspector"]')
  const controls = page.locator('[data-workspace-region="simulation"]')
  for (const region of [library, book, inspector, controls]) await expect(region).toBeVisible()

  await expect(page.getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Livre' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Simulation/Contrôles' })).toBeVisible()
  await expect(page.locator('[data-project-track]')).toHaveCount(3)
  await expect(page.getByText('Aucune occurrence sélectionnée')).toBeVisible()
  await expect(page.getByText('Inactive')).toBeVisible()
  await expect(page.locator('.project-book-page')).toHaveCSS('background-color', 'rgb(239, 242, 255)')
  await expect(page.locator('.project-book-page__content')).toHaveCSS('font-family', /Literata/)
  await expect(page.locator('body')).toHaveCSS('font-family', /Manrope/)
  await expect(page.locator('[contenteditable], audio')).toHaveCount(0)
  await expect(page.locator('.app-sidebar')).toHaveCount(0)
  await expectNoOverflow(page)

  const rectangles = await page.locator('[data-workspace-region]').evaluateAll((regions) => (
    Object.fromEntries(regions.map((region) => {
      const rect = region.getBoundingClientRect()
      return [region.getAttribute('data-workspace-region'), {
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      }]
    }))
  )) as Record<string, { bottom: number; left: number; right: number; top: number; width: number }>

  expect(rectangles.library.left).toBeLessThan(rectangles.book.left)
  expect(rectangles.book.left).toBeLessThan(rectangles.inspector.left)
  expect(Math.abs(rectangles.library.top - rectangles.book.top)).toBeLessThanOrEqual(2)
  expect(Math.abs(rectangles.book.top - rectangles.inspector.top)).toBeLessThanOrEqual(2)
  expect(rectangles.book.width).toBeGreaterThan(rectangles.library.width)
  expect(rectangles.book.width).toBeGreaterThan(rectangles.inspector.width)
  expect(rectangles.simulation.top).toBeGreaterThanOrEqual(rectangles.book.bottom)
  expect(rectangles.simulation.left).toBeGreaterThanOrEqual(rectangles.library.right)
  expect(rectangles.simulation.right).toBeLessThanOrEqual(rectangles.inspector.left)

  if (testInfo.project.name === 'chrome-desktop') {
    const largestSide = Math.max(rectangles.library.width, rectangles.inspector.width)
    expect(Math.abs(rectangles.library.width - rectangles.inspector.width)).toBeLessThanOrEqual(largestSide * 0.22)
  } else {
    expect(rectangles.library.width).toBeGreaterThanOrEqual(170)
    expect(rectangles.inspector.width).toBeGreaterThanOrEqual(135)
  }

  const viewport = page.viewportSize()!
  await page.screenshot({
    path: `test-results/visual/projet-workspace-${testInfo.project.name}-${viewport.width}x${viewport.height}.png`,
    fullPage: true,
  })
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('uses the fictive library, book controls, menu and history', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/projet')

  const search = page.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })
  await search.fill('pluie')
  await expect(page.getByText('jardin-pluie.ogg')).toBeVisible()
  await expect(page.getByText('pas-gravier.wav')).toHaveCount(0)
  await search.fill('aucun-fichier')
  await expect(page.getByText('Aucun résultat dans les données fictives.')).toBeVisible()
  await search.fill('')

  const familyToggle = page.getByRole('button', { name: 'Replier SFX' })
  await familyToggle.click()
  await expect(page.getByRole('button', { name: 'Déplier SFX' })).toBeVisible()
  await page.getByRole('button', { name: 'Déplier SFX' }).click()
  await expect(page.getByText('pas-gravier.wav')).toBeVisible()

  const chapter = page.getByRole('combobox', { name: 'Chapitre' })
  await chapter.selectOption('1')
  await expect(page.locator('.project-book-page h3')).toHaveText('Le pavillon fermé')
  await page.getByRole('button', { name: 'Chapitre suivant' }).click()
  await expect(page.locator('.project-book-page h3')).toHaveText('La dernière cloche')
  await page.getByRole('button', { name: 'Chapitre précédent' }).click()
  await expect(page.locator('.project-book-page h3')).toHaveText('Le pavillon fermé')
  const slider = page.getByRole('slider', { name: 'Page fictive' })
  await slider.fill('4')
  await expect(page.getByText('Page 4 sur 9')).toBeVisible()

  const history = page.getByRole('button', { name: 'Historique' })
  await history.click()
  await expect(page.getByRole('region', { name: 'Historique fictif du projet' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('region', { name: 'Historique fictif du projet' })).toHaveCount(0)
  await expect(history).toBeFocused()

  const menu = page.getByRole('button', { name: 'Ouvrir la navigation générale' })
  await menu.click()
  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('offers a coherent visible keyboard path in the project', async ({ page }) => {
  await page.goto('/projet')
  const menu = page.getByRole('button', { name: 'Ouvrir la navigation générale' })
  await menu.focus()
  await expect(menu).toBeFocused()
  const menuFocus = await menu.evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
  })
  expect(menuFocus.style).not.toBe('none')
  expect(menuFocus.width).toBeGreaterThan(0)

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Jaquette, aller à l’accueil' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })).toBeFocused()
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
  await expect(page.locator('a[href="/parametres"]')).toHaveAttribute('aria-current', 'page')

  await page.getByRole('link', { name: 'Projet' }).click()
  await expect(page).toHaveURL('/projet')
  await expect(page.getByRole('heading', { level: 1, name: 'Le livre attend sa scène.' })).toBeFocused()
  expect(await page.evaluate(() => (window as Window & { __jaquetteShellMarker?: string }).__jaquetteShellMarker)).toBe('preserved')
  await page.goBack()
  await expect(page).toHaveURL('/parametres')
  await expect(page.getByRole('heading', { level: 1, name: 'Paramètres du prototype' })).toBeFocused()
  await page.goForward()
  await expect(page).toHaveURL('/projet')
  await expect(page.getByRole('heading', { level: 1, name: 'Le livre attend sa scène.' })).toBeFocused()
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('supports the regular-shell skip link and visible focus', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/accueil')
  const skipLink = page.getByRole('link', { name: 'Aller au contenu' })
  await skipLink.focus()
  await expect(skipLink).toHaveCSS('opacity', '1')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.goto('/accueil')
  const brandLink = page.getByRole('link', { name: 'Jaquette, aller à l’accueil' })
  await brandLink.focus()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Connexion' })).toBeFocused()
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('canonicalizes unknown routes and preserves the complete foundations 1.1 page', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/')
  await expect(page).toHaveURL('/accueil')
  await page.goto('/adresse-inconnue')
  await expect(page).toHaveTitle('Jaquette — Écran introuvable')
  await expect(page.getByRole('heading', { level: 1, name: 'Cet écran n’existe pas.' })).toBeVisible()

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
        '--color-background', '--color-text', '--color-accent', '--color-secondary',
        '--color-validation', '--color-track-sfx', '--color-track-ambience',
        '--color-track-music', '--color-success-dark', '--color-success-light', '--color-error',
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
  await page.screenshot({ path: `test-results/visual/fondations-${testInfo.project.name}.png`, fullPage: true })
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})
