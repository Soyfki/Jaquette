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

test('collapses desktop panels and uses three exclusive reduced drawers', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/projet')
  const book = page.locator('[data-workspace-region="book"]')
  const controls = page.locator('[data-workspace-region="simulation"]')
  const viewport = page.viewportSize()!

  await expect(book).toBeVisible()
  await expect(page.getByRole('region', { name: 'Livre' })).toBeVisible()
  await expect(page.locator('.project-book-page')).toHaveCSS('background-color', 'rgb(239, 242, 255)')
  await expect(page.locator('.project-book-page__content')).toHaveCSS('font-family', /Literata/)
  await expect(page.locator('body')).toHaveCSS('font-family', /Manrope/)
  await expect(page.locator('[contenteditable], audio')).toHaveCount(0)
  await expect(page.locator('.app-sidebar')).toHaveCount(0)
  await expectNoOverflow(page)

  if (testInfo.project.name === 'chrome-desktop') {
    const library = page.locator('[data-workspace-region="library"]')
    const inspector = page.locator('[data-workspace-region="inspector"]')
    const libraryToggle = page.locator('.responsive-panel-toolbar button[aria-controls="sound-library-panel"]')
    const inspectorToggle = page.locator('.responsive-panel-toolbar button[aria-controls="sound-inspector-panel"]')
    const simulationToggle = page.locator('.responsive-panel-toolbar button[aria-controls="sound-simulation-panel"]')
    await expect(library).toBeVisible()
    await expect(inspector).toBeVisible()
    await expect(controls).toBeVisible()
    await expect(page.getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Simulation/Navigation' })).toBeVisible()
    await expect(page.getByText('Inactive')).toBeVisible()
    await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(inspectorToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(simulationToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('[data-project-track]')).toHaveCount(3)
    await expect(page.getByText('Aucune occurrence sélectionnée')).toBeVisible()

    const [libraryRect, bookRect, inspectorRect, controlsRect] = await Promise.all(
      [library, book, inspector, controls].map((region) => region.boundingBox()),
    )
    expect(libraryRect && bookRect && inspectorRect && controlsRect).toBeTruthy()
    expect(libraryRect!.x).toBeLessThan(bookRect!.x)
    expect(bookRect!.x).toBeLessThan(inspectorRect!.x)
    expect(Math.abs(libraryRect!.y - bookRect!.y)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookRect!.y - inspectorRect!.y)).toBeLessThanOrEqual(2)
    expect(bookRect!.width).toBeGreaterThan(libraryRect!.width)
    expect(bookRect!.width).toBeGreaterThan(inspectorRect!.width)
    expect(controlsRect!.y).toBeGreaterThanOrEqual(bookRect!.y + bookRect!.height)
    const largestSide = Math.max(libraryRect!.width, inspectorRect!.width)
    expect(Math.abs(libraryRect!.width - inspectorRect!.width)).toBeLessThanOrEqual(largestSide * 0.22)

    await page.screenshot({
      path: `test-results/visual/projet-desktop-three-open-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })

    await libraryToggle.click()
    await expect(page.getByRole('region', { name: 'Bibliothèque' })).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Simulation/Navigation' })).toBeVisible()
    const bookWithoutLibrary = await book.boundingBox()
    expect(bookWithoutLibrary).toBeTruthy()
    expect(bookWithoutLibrary!.width).toBeGreaterThan(bookRect!.width)
    await libraryToggle.click()
    const bookAfterLibraryRestore = await book.boundingBox()
    expect(bookAfterLibraryRestore).toBeTruthy()
    expect(Math.abs(bookAfterLibraryRestore!.x - bookRect!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookAfterLibraryRestore!.width - bookRect!.width)).toBeLessThanOrEqual(2)

    await inspectorToggle.click()
    await expect(page.getByRole('region', { name: 'Inspecteur audio' })).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
    const bookWithoutInspector = await book.boundingBox()
    expect(bookWithoutInspector).toBeTruthy()
    expect(bookWithoutInspector!.width).toBeGreaterThan(bookRect!.width)
    await inspectorToggle.click()
    const bookAfterInspectorRestore = await book.boundingBox()
    expect(bookAfterInspectorRestore).toBeTruthy()
    expect(Math.abs(bookAfterInspectorRestore!.x - bookRect!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookAfterInspectorRestore!.width - bookRect!.width)).toBeLessThanOrEqual(2)

    await libraryToggle.click()
    await inspectorToggle.click()
    const wideBook = await book.boundingBox()
    expect(wideBook).toBeTruthy()
    expect(wideBook!.width).toBeGreaterThanOrEqual(viewport.width * 0.85)
    await page.getByRole('button', { name: 'Lancer la simulation' }).click()
    await expect(page.locator('[data-active-word="true"]')).toHaveCount(1)
    await simulationToggle.click()
    await expect(page.getByRole('region', { name: 'Simulation/Navigation' })).toHaveCount(0)
    await expect(page.locator('[data-active-word="true"]')).toHaveCount(0)
    const tallBook = await book.boundingBox()
    expect(tallBook).toBeTruthy()
    expect(tallBook!.height).toBeGreaterThan(bookRect!.height)
    await expectNoOverflow(page)
    await page.screenshot({
      path: `test-results/visual/projet-desktop-three-closed-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })
    await simulationToggle.click()
    await expect(page.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
  } else {
    const libraryToggle = page.locator('.responsive-panel-toolbar button[aria-controls="sound-library-drawer"]')
    const inspectorToggle = page.locator('.responsive-panel-toolbar button[aria-controls="sound-inspector-drawer"]')
    const simulationToggle = page.locator('.responsive-panel-toolbar button[aria-controls="sound-simulation-drawer"]')
    await expect(libraryToggle).toBeVisible()
    await expect(inspectorToggle).toBeVisible()
    await expect(simulationToggle).toBeVisible()
    await expect(libraryToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(inspectorToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(simulationToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByRole('region', { name: 'Bibliothèque' })).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Inspecteur audio' })).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Simulation/Navigation' })).toHaveCount(0)

    const bookBefore = await book.boundingBox()
    expect(bookBefore).toBeTruthy()
    expect(bookBefore!.width).toBeGreaterThanOrEqual(viewport.width * 0.95)
    expect(Math.abs((bookBefore!.x + bookBefore!.width / 2) - viewport.width / 2)).toBeLessThanOrEqual(2)

    await page.screenshot({
      path: `test-results/visual/projet-reduced-all-closed-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })

    await libraryToggle.click()
    const libraryDrawer = page.locator('#sound-library-drawer')
    await expect(libraryDrawer).toBeVisible()
    await expect(page.locator('.sound-drawer')).toHaveCount(1)
    await expect(page.getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
    await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(libraryDrawer.getByRole('button', { name: 'Fermer la bibliothèque' })).toBeFocused()
    const libraryDrawerRect = await libraryDrawer.boundingBox()
    const bookWithLibrary = await book.boundingBox()
    expect(libraryDrawerRect && bookWithLibrary).toBeTruthy()
    expect(libraryDrawerRect!.width).toBeLessThanOrEqual(viewport.width * 0.48)
    expect(libraryDrawerRect!.x).toBeLessThanOrEqual(bookBefore!.x + 2)
    expect(libraryDrawerRect!.x + libraryDrawerRect!.width).toBeGreaterThan(bookBefore!.x)
    expect(Math.abs(bookWithLibrary!.x - bookBefore!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithLibrary!.y - bookBefore!.y)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithLibrary!.width - bookBefore!.width)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithLibrary!.height - bookBefore!.height)).toBeLessThanOrEqual(2)
    await expectNoOverflow(page)
    await page.screenshot({
      path: `test-results/visual/projet-reduced-library-open-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })

    await page.keyboard.press('Escape')
    await expect(libraryDrawer).toHaveCount(0)
    await expect(libraryToggle).toBeFocused()
    await libraryToggle.click()
    await inspectorToggle.click()
    const inspectorDrawer = page.locator('#sound-inspector-drawer')
    await expect(page.locator('.sound-drawer')).toHaveCount(1)
    await expect(page.getByRole('region', { name: 'Bibliothèque' })).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
    await expect(page.getByText('Aucune occurrence sélectionnée')).toBeVisible()
    await expect(inspectorDrawer.getByRole('button', { name: 'Fermer l’inspecteur audio' })).toBeFocused()
    const inspectorDrawerRect = await inspectorDrawer.boundingBox()
    const bookWithInspector = await book.boundingBox()
    expect(inspectorDrawerRect && bookWithInspector).toBeTruthy()
    expect(inspectorDrawerRect!.width).toBeLessThanOrEqual(viewport.width * 0.48)
    expect(Math.abs(inspectorDrawerRect!.x + inspectorDrawerRect!.width - (bookBefore!.x + bookBefore!.width))).toBeLessThanOrEqual(2)
    expect(inspectorDrawerRect!.x).toBeLessThan(bookBefore!.x + bookBefore!.width)
    expect(Math.abs(bookWithInspector!.x - bookBefore!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithInspector!.y - bookBefore!.y)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithInspector!.width - bookBefore!.width)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithInspector!.height - bookBefore!.height)).toBeLessThanOrEqual(2)
    await expectNoOverflow(page)
    await page.screenshot({
      path: `test-results/visual/projet-reduced-inspector-open-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })
    await page.keyboard.press('Escape')
    await expect(inspectorDrawer).toHaveCount(0)
    await expect(inspectorToggle).toBeFocused()

    await simulationToggle.click()
    const simulationDrawer = page.locator('#sound-simulation-drawer')
    await expect(simulationDrawer).toBeVisible()
    await expect(page.locator('.sound-drawer')).toHaveCount(1)
    await expect(page.getByRole('region', { name: 'Simulation/Navigation' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'Fermer Simulation/Navigation' })).toBeFocused()
    await expect(simulationDrawer.getByRole('combobox', { name: 'Chapitre' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'Historique' })).toBeVisible()
    await expect(simulationDrawer.getByRole('slider', { name: 'Page fictive' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'Lancer la simulation' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'Mot précédent' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'Mot suivant' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'x1' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'x2' })).toBeVisible()
    await expect(simulationDrawer.getByRole('button', { name: 'x4' })).toBeVisible()
    const simulationDrawerRect = await simulationDrawer.boundingBox()
    const bookWithSimulation = await book.boundingBox()
    expect(simulationDrawerRect && bookWithSimulation).toBeTruthy()
    expect(simulationDrawerRect!.width).toBeLessThanOrEqual(viewport.width - 16)
    expect(simulationDrawerRect!.height).toBeLessThanOrEqual(viewport.height * 0.55 + 2)
    expect(simulationDrawerRect!.x).toBeGreaterThan(0)
    expect(simulationDrawerRect!.x + simulationDrawerRect!.width).toBeLessThan(viewport.width)
    expect(Math.abs(bookWithSimulation!.x - bookBefore!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithSimulation!.y - bookBefore!.y)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithSimulation!.width - bookBefore!.width)).toBeLessThanOrEqual(2)
    expect(Math.abs(bookWithSimulation!.height - bookBefore!.height)).toBeLessThanOrEqual(2)
    await expectNoOverflow(page)
    await page.screenshot({
      path: `test-results/visual/projet-reduced-simulation-open-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    })

    await simulationDrawer.getByRole('button', { name: 'Lancer la simulation' }).click()
    await expect(page.locator('[data-active-word="true"]')).toHaveCount(1)
    await simulationToggle.click()
    await expect(simulationDrawer).toHaveCount(0)
    await expect(page.locator('[data-active-word="true"]')).toHaveCount(0)
    await simulationToggle.click()
    await expect(page.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('region', { name: 'Simulation/Navigation' })).toHaveCount(0)
    await expect(simulationToggle).toBeFocused()
  }

  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('switches the simulated role locally and mounts a wider Reviewer workspace', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/projet')
  const viewport = page.viewportSize()!
  const roleControl = page.getByRole('group', { name: 'Rôle simulé' })
  const soundDesigner = roleControl.getByRole('button', { name: 'Sound Designer' })
  const reviewer = roleControl.getByRole('button', { name: 'Réviseur' })
  const soundDesignerBook = page.locator('[data-workspace-region="book"]')

  await expect(soundDesigner).toHaveAttribute('aria-pressed', 'true')
  await expect(reviewer).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByText('Atelier Sound Designer · rôle simulé')).toBeVisible()
  const soundDesignerBookRect = await soundDesignerBook.boundingBox()
  expect(soundDesignerBookRect).toBeTruthy()
  const browserState = await page.evaluate(() => {
    ;(window as Window & { __jaquetteRoleMarker?: string }).__jaquetteRoleMarker = 'preserved'
    return { historyLength: window.history.length, path: window.location.pathname }
  })
  expect(browserState.path).toBe('/projet')

  if (testInfo.project.name === 'chrome-reduced') {
    await page.getByRole('button', { name: 'Ouvrir Simulation/Navigation' }).click()
  }
  await page.getByRole('button', { name: 'Lancer la simulation' }).click()
  await expect(page.locator('[data-active-word="true"]')).toHaveCount(1)

  await reviewer.focus()
  await expect(reviewer).toBeFocused()
  await reviewer.press('Space')
  await expect(reviewer).toBeFocused()
  await expect(reviewer).toHaveAttribute('aria-pressed', 'true')
  const focus = await reviewer.evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
  })
  expect(focus.style).not.toBe('none')
  expect(focus.width).toBeGreaterThan(0)

  await expect(page).toHaveURL('/projet')
  expect(await page.evaluate(() => window.history.length)).toBe(browserState.historyLength)
  expect(await page.evaluate(() => (window as Window & { __jaquetteRoleMarker?: string }).__jaquetteRoleMarker)).toBe('preserved')
  await expect(page.getByText('Atelier Réviseur · rôle simulé')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Le livre passe en révision.' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByLabel('Workspace Réviseur fictif')).toBeVisible()

  for (const region of ['Livre', 'Simulation/Navigation', 'Commentaires', 'Candidates de chapitre', 'Validation']) {
    await expect(page.getByRole('region', { name: region })).toBeVisible()
  }
  await expect(page.getByText(/Proposer n’est ni sélectionner définitivement, ni valider/)).toBeVisible()
  await expect(page.getByText(/approbation unanime des Réviseurs affectés sera requise/)).toBeVisible()

  await expect(page.getByRole('region', { name: 'Bibliothèque' })).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'Inspecteur audio' })).toHaveCount(0)
  await expect(page.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })).toHaveCount(0)
  await expect(page.getByLabel('Ouvrir un fichier local')).toHaveCount(0)
  await expect(page.locator('[data-project-track], .responsive-panel-toolbar, .sound-drawer')).toHaveCount(0)
  await expect(page.getByText('Niveau & source')).toHaveCount(0)
  await expect(page.locator('[data-active-word="true"], [contenteditable], audio')).toHaveCount(0)

  const reviewerBookRect = await page.locator('[data-workspace-region="book"]').boundingBox()
  expect(reviewerBookRect).toBeTruthy()
  if (testInfo.project.name === 'chrome-desktop') {
    expect(reviewerBookRect!.width).toBeGreaterThanOrEqual(soundDesignerBookRect!.width * 1.18)
  } else {
    expect(reviewerBookRect!.width).toBeGreaterThanOrEqual(viewport.width * 0.95)
  }
  await expectNoOverflow(page)
  await page.screenshot({
    path: 'test-results/visual/projet-reviewer-' + testInfo.project.name + '-' + viewport.width + 'x' + viewport.height + '.png',
    fullPage: true,
  })

  for (let transition = 0; transition < 2; transition += 1) {
    await soundDesigner.click()
    await expect(page.getByLabel('Workspace Sound Designer fictif')).toBeVisible()
    await expect(soundDesigner).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('[data-active-word="true"], .sound-drawer')).toHaveCount(0)
    if (testInfo.project.name === 'chrome-desktop') {
      await expect(page.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
    }
    await reviewer.click()
    await expect(page.getByLabel('Workspace Réviseur fictif')).toBeVisible()
    await expect(reviewer).toHaveAttribute('aria-pressed', 'true')
  }

  await expect(page).toHaveURL('/projet')
  expect(await page.evaluate(() => window.history.length)).toBe(browserState.historyLength)
  await expectNoOverflow(page)

  await page.reload()
  await expect(soundDesigner).toHaveAttribute('aria-pressed', 'true')
  await expect(reviewer).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByLabel('Workspace Sound Designer fictif')).toBeVisible()
  await expect(page).toHaveURL('/projet')
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('mounts the Team Lead and Admin Maison hierarchies as isolated responsive trees', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/projet')
  const viewport = page.viewportSize()!
  const roleControl = page.getByRole('group', { name: 'Rôle simulé' })
  const soundDesigner = roleControl.getByRole('button', { name: 'Sound Designer' })
  const reviewer = roleControl.getByRole('button', { name: 'Réviseur' })
  const teamLead = roleControl.getByRole('button', { name: 'Chef d’équipe' })
  const publishingHouseAdmin = roleControl.getByRole('button', { name: 'Admin Maison' })
  const browserState = await page.evaluate(() => {
    ;(window as Window & { __jaquetteManagementRoleMarker?: string }).__jaquetteManagementRoleMarker = 'preserved'
    return { historyLength: window.history.length, path: window.location.pathname }
  })

  await expect(roleControl.getByRole('button')).toHaveCount(4)
  await expect(soundDesigner).toHaveAttribute('aria-pressed', 'true')
  await expect(reviewer).toHaveAttribute('aria-pressed', 'false')
  await expect(teamLead).toHaveAttribute('aria-pressed', 'false')
  await expect(publishingHouseAdmin).toHaveAttribute('aria-pressed', 'false')

  await teamLead.focus()
  await teamLead.press('Space')
  await expect(teamLead).toBeFocused()
  await expect(teamLead).toHaveAttribute('aria-pressed', 'true')
  const teamLeadFocus = await teamLead.evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
  })
  expect(teamLeadFocus.style).not.toBe('none')
  expect(teamLeadFocus.width).toBeGreaterThan(0)
  await expect(page).toHaveURL('/projet')
  expect(await page.evaluate(() => window.history.length)).toBe(browserState.historyLength)
  await expect(page.getByText('Atelier Chef d’équipe · rôle simulé')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Le projet garde son cap.' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByLabel('Workspace Chef d’équipe fictif')).toBeVisible()

  const teamLeadRegions = [
    'Tableau de bord',
    'Progression',
    'Livre',
    'Simulation/Navigation',
    'Historique',
    'Commentaires',
    'Validation finale',
    'Préparation de la publication',
  ]
  for (const region of teamLeadRegions) {
    await expect(page.getByRole('region', { name: region, exact: true })).toBeVisible()
  }
  await expect(page.getByRole('progressbar', { name: 'Doublage fictif : 7 chapitres terminés sur 10' })).toHaveAttribute('value', '7')
  await expect(page.getByRole('progressbar', { name: 'Révision fictive : 21 validations obtenues sur 30 attendues' })).toHaveAttribute('value', '21')
  await expect(page.getByText('En attente Chef', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Boutique Jacques')).toBeVisible()
  await expect(page.getByText(/aucun pourcentage global/)).toBeVisible()
  await expect(page.getByRole('region', { name: 'Bibliothèque', exact: true })).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'Inspecteur audio', exact: true })).toHaveCount(0)
  await expect(page.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })).toHaveCount(0)
  await expect(page.getByLabel('Ouvrir un fichier local')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /Dépublier/i })).toHaveCount(0)
  await expect(page.locator('[data-project-track], .responsive-panel-toolbar, .sound-drawer, [contenteditable], audio')).toHaveCount(0)
  await expectNoOverflow(page)

  const clippedRoleButtons = await roleControl.getByRole('button').evaluateAll((buttons) => buttons.some((button) => (
    button.scrollWidth > button.clientWidth || button.scrollHeight > button.clientHeight
  )))
  expect(clippedRoleButtons).toBe(false)

  if (testInfo.project.name === 'chrome-reduced') {
    const ordered = await Promise.all(
      ['Tableau de bord', 'Progression', 'Livre', 'Simulation/Navigation', 'Historique'].map((name) => (
        page.getByRole('region', { name, exact: true }).boundingBox()
      )),
    )
    expect(ordered.every(Boolean)).toBe(true)
    for (let index = 1; index < ordered.length; index += 1) {
      expect(ordered[index]!.y).toBeGreaterThanOrEqual(ordered[index - 1]!.y + ordered[index - 1]!.height)
    }
  }
  await page.screenshot({
    path: `test-results/visual/projet-team-lead-${viewport.width}x${viewport.height}.png`,
    fullPage: true,
  })

  await page.getByRole('button', { name: 'Lancer la simulation' }).click()
  await page.getByRole('button', { name: 'Historique' }).click()
  await expect(page.locator('[data-active-word="true"]')).toHaveCount(1)
  await expect(page.getByRole('region', { name: 'Historique fictif du projet' })).toBeVisible()

  await publishingHouseAdmin.click()
  await expect(publishingHouseAdmin).toBeFocused()
  await expect(publishingHouseAdmin).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-active-word="true"]')).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'Historique fictif du projet' })).toHaveCount(0)
  await expect(page.getByText('Atelier Admin Maison · rôle simulé')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'La maison organise ses équipes.' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByLabel('Workspace Admin Maison fictif')).toBeVisible()

  const adminRegions = ['Membres', 'Équipes', 'Invitations', 'Projets', 'Permissions', 'Audit']
  for (const region of adminRegions) {
    await expect(page.getByRole('region', { name: region, exact: true })).toBeVisible()
  }
  await expect(page.getByText('Non accordés automatiquement')).toBeVisible()
  await expect(page.getByText('Aucun e-mail réel')).toBeVisible()
  for (const forbiddenRegion of [
    'Bibliothèque',
    'Livre',
    'Inspecteur audio',
    'Simulation/Navigation',
    'Candidates de chapitre',
    'Validation',
    'Validation finale',
    'Préparation de la publication',
  ]) {
    await expect(page.getByRole('region', { name: forbiddenRegion, exact: true })).toHaveCount(0)
  }
  await expect(page.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })).toHaveCount(0)
  await expect(page.getByLabel('Ouvrir un fichier local')).toHaveCount(0)
  await expect(page.locator('[data-project-track], .responsive-panel-toolbar, .sound-drawer, [contenteditable], audio')).toHaveCount(0)
  await expectNoOverflow(page)

  if (testInfo.project.name === 'chrome-reduced') {
    const ordered = await Promise.all(adminRegions.map((name) => page.getByRole('region', { name, exact: true }).boundingBox()))
    expect(ordered.every(Boolean)).toBe(true)
    for (let index = 1; index < ordered.length; index += 1) {
      expect(ordered[index]!.y).toBeGreaterThanOrEqual(ordered[index - 1]!.y + ordered[index - 1]!.height)
    }
  }
  await page.screenshot({
    path: `test-results/visual/projet-admin-maison-${viewport.width}x${viewport.height}.png`,
    fullPage: true,
  })

  for (let cycle = 0; cycle < 2; cycle += 1) {
    for (const [button, workspace] of [
      [soundDesigner, 'Workspace Sound Designer fictif'],
      [reviewer, 'Workspace Réviseur fictif'],
      [teamLead, 'Workspace Chef d’équipe fictif'],
      [publishingHouseAdmin, 'Workspace Admin Maison fictif'],
    ] as const) {
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByLabel(workspace)).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    }
  }

  await expect(page).toHaveURL('/projet')
  expect(await page.evaluate(() => window.history.length)).toBe(browserState.historyLength)
  expect(await page.evaluate(() => (window as Window & { __jaquetteManagementRoleMarker?: string }).__jaquetteManagementRoleMarker)).toBe('preserved')
  await expectNoOverflow(page)

  await page.reload()
  await expect(soundDesigner).toHaveAttribute('aria-pressed', 'true')
  await expect(reviewer).toHaveAttribute('aria-pressed', 'false')
  await expect(teamLead).toHaveAttribute('aria-pressed', 'false')
  await expect(publishingHouseAdmin).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByLabel('Workspace Sound Designer fictif')).toBeVisible()
  await expect(page).toHaveURL('/projet')

  await publishingHouseAdmin.click()
  await page.getByRole('button', { name: 'Ouvrir la navigation générale' }).click()
  await page.getByRole('link', { name: 'Accueil', exact: true }).click()
  await page.getByRole('button', { name: 'Ouvrir l’état du projet' }).click()
  await expect(soundDesigner).toHaveAttribute('aria-pressed', 'true')
  await expect(publishingHouseAdmin).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByLabel('Workspace Sound Designer fictif')).toBeVisible()
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('uses the local picker, synchronized pagination, chapter select, menu and history', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/projet')

  if (testInfo.project.name === 'chrome-reduced') {
    await page.getByRole('button', { name: 'Ouvrir la bibliothèque' }).click()
  }

  const search = page.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })
  await search.fill('pluie')
  await expect(page.getByText('jardin-pluie.ogg')).toBeVisible()
  await expect(page.getByText('pas-gravier.wav')).toHaveCount(0)
  await search.fill('aucun-fichier')
  await expect(page.getByText('Aucun résultat dans les données fictives.')).toBeVisible()
  await search.fill('')

  const fileInput = page.getByLabel('Ouvrir un fichier local')
  await fileInput.setInputFiles({ name: 'selection-synthetique.wav', mimeType: 'audio/wav', buffer: Buffer.from('synthetic') })
  await expect(page.getByText('selection-synthetique.wav')).toBeVisible()
  await expect(page.getByText('sélection locale de démonstration — fichier non importé')).toBeVisible()
  await expect(page.locator('audio')).toHaveCount(0)
  await page.getByRole('button', { name: 'Effacer la sélection' }).click()
  await expect(page.getByText('selection-synthetique.wav')).toHaveCount(0)

  const familyToggle = page.getByRole('button', { name: 'Replier SFX' })
  await familyToggle.click()
  await expect(page.getByRole('button', { name: 'Déplier SFX' })).toBeVisible()
  await page.getByRole('button', { name: 'Déplier SFX' }).click()
  await expect(page.getByText('pas-gravier.wav')).toBeVisible()

  if (testInfo.project.name === 'chrome-reduced') {
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Ouvrir Simulation/Navigation' }).click()
  }

  const previousPage = page.getByRole('button', { name: 'Page précédente' })
  const slider = page.getByRole('slider', { name: 'Page fictive' })
  const nextPage = page.getByRole('button', { name: 'Page suivante' })
  const pageGroup = page.getByRole('group', { name: 'Pagination fictive du livre' })
  await expect(previousPage).toBeDisabled()
  await expect(nextPage).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Chapitre précédent' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Chapitre suivant' })).toHaveCount(0)
  await expect(previousPage.locator('xpath=..')).toHaveAttribute('aria-label', 'Pagination fictive du livre')
  await expect(pageGroup.locator(':scope > *')).toHaveCount(3)

  const geometry = await Promise.all([previousPage, slider, nextPage].map((locator) => locator.boundingBox()))
  expect(geometry.every(Boolean)).toBe(true)
  expect(geometry[0]!.x + geometry[0]!.width).toBeLessThanOrEqual(geometry[1]!.x)
  expect(geometry[1]!.x + geometry[1]!.width).toBeLessThanOrEqual(geometry[2]!.x)

  await nextPage.click()
  await expect(slider).toHaveValue('2')
  await expect(slider).toHaveAttribute('aria-valuetext', 'Page 2 sur 12')
  await expect(page.getByText('Page 2 sur 12')).toBeVisible()
  await previousPage.click()
  await expect(slider).toHaveValue('1')
  await expect(page.getByText('Page 1 sur 12')).toBeVisible()

  await slider.fill('4')
  const chapter = page.getByRole('combobox', { name: 'Chapitre' })
  await chapter.selectOption('1')
  await expect(page.locator('.project-book-page h3')).toHaveText('Le pavillon fermé')
  await expect(slider).toHaveValue('1')
  await expect(page.getByText('Page 1 sur 9')).toBeVisible()

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

test('runs and pauses the local text simulation without audio', async ({ page }, testInfo) => {
  const errors = collectErrors(page)
  await page.goto('/projet')
  if (testInfo.project.name === 'chrome-reduced') {
    await page.getByRole('button', { name: 'Ouvrir Simulation/Navigation' }).click()
  }

  await page.getByRole('button', { name: 'Lancer la simulation' }).click()
  await expect(page.getByRole('button', { name: 'Mettre en pause' })).toBeVisible()
  await expect(page.getByRole('status', { name: 'État de la simulation : En cours' })).toBeVisible()
  const activeWord = page.locator('[data-active-word="true"]')
  await expect(activeWord).toBeVisible()
  const initialWord = await activeWord.textContent()
  await expect.poll(() => activeWord.textContent()).not.toBe(initialWord)

  await page.getByRole('button', { name: 'Mettre en pause' }).click()
  await expect(page.getByRole('status', { name: 'État de la simulation : En pause' })).toBeVisible()
  const pausedWord = await activeWord.textContent()
  await page.waitForTimeout(500)
  expect(await activeWord.textContent()).toBe(pausedWord)

  await page.getByRole('button', { name: 'Mot suivant' }).click()
  expect(await activeWord.textContent()).not.toBe(pausedWord)

  for (const multiplier of ['x1', 'x2', 'x4']) {
    const speed = page.getByRole('button', { name: multiplier })
    await speed.click()
    await expect(speed).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText(`Multiplicateur actif : ${multiplier}`)).toBeVisible()
  }

  await expect(page.locator('audio')).toHaveCount(0)
  expect(errors.consoleErrors).toEqual([])
  expect(errors.pageErrors).toEqual([])
})

test('offers visible keyboard focus on the project and its new controls', async ({ page }, testInfo) => {
  await page.goto('/projet')
  const menu = page.getByRole('button', { name: 'Ouvrir la navigation générale' })
  await menu.focus()
  await expect(menu).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Jaquette, aller à l’accueil' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Sound Designer' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Réviseur' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Chef d’équipe' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Admin Maison' })).toBeFocused()
  await page.keyboard.press('Tab')
  const libraryToggle = page.getByRole('button', { name: /la bibliothèque/ })
  await expect(libraryToggle).toBeFocused()
  const search = page.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })
  if (testInfo.project.name === 'chrome-reduced') {
    await libraryToggle.click()
    await expect(page.locator('#sound-library-drawer').getByRole('button', { name: 'Fermer la bibliothèque' })).toBeFocused()
    await search.focus()
  } else {
    await search.focus()
    await expect(search).toBeFocused()
  }

  if (testInfo.project.name === 'chrome-reduced') {
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Ouvrir Simulation/Navigation' }).click()
  }
  await page.getByRole('button', { name: 'Page suivante' }).click()
  const focusTargets = [
    page.getByRole('combobox', { name: 'Chapitre' }),
    page.getByRole('button', { name: 'Page précédente' }),
    page.getByRole('slider', { name: 'Page fictive' }),
    page.getByRole('button', { name: 'Page suivante' }),
    page.getByRole('button', { name: 'Historique' }),
    page.getByRole('button', { name: 'Lancer la simulation' }),
  ]
  for (const target of focusTargets) {
    await target.focus()
    await expect(target).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    const focus = await target.evaluate((element) => {
      const style = getComputedStyle(element)
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
    })
    expect(focus.style).not.toBe('none')
    expect(focus.width).toBeGreaterThan(0)
  }

  if (testInfo.project.name === 'chrome-reduced') {
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Ouvrir la bibliothèque' }).click()
  }
  const fileInput = page.getByLabel('Ouvrir un fichier local')
  await fileInput.focus()
  await expect(fileInput).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  const fileTriggerFocus = await page.locator('label[for="local-audio-file"]').evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
  })
  expect(fileTriggerFocus.style).not.toBe('none')
  expect(fileTriggerFocus.width).toBeGreaterThan(0)
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
