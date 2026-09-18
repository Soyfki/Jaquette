import { expect, type Page } from '@playwright/test'
import { test } from './fixtures'

async function expectFoundationsFocus(page: Page) {
  await expect(page).toHaveURL('/fondations')
  await expect(page).toHaveTitle('Jaquette — Fondations')
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toHaveCount(1)
  await expect(heading).toHaveText('La voix du livre commence ici.')
  await expect(heading).toBeFocused()
  const outline = await heading.evaluate(element => {
    const css = getComputedStyle(element)
    return { style: css.outlineStyle, width: parseFloat(css.outlineWidth) }
  })
  expect(outline.style).toBe('solid')
  expect(outline.width).toBeGreaterThan(0)
}

test('focuses Foundations through keyboard, direct entry and browser history', async ({ page }, info) => {
  await page.goto('/fondations')
  await expectFoundationsFocus(page)
  await page.getByRole('link', { name: 'Projet', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await page.evaluate(() => { Object.assign(window, { __spaProof: '0.3' }) })
  await page.getByRole('button', { name: 'Ouvrir la navigation générale' }).focus()
  await page.keyboard.press('Enter')
  const link = page.getByRole('link', { name: /Fondations 1.1/ })
  for (let step = 0; step < 25; step++) {
    await page.keyboard.press('Tab')
    if (await link.evaluate(element => document.activeElement === element)) break
  }
  await expect(link).toBeFocused()
  await page.keyboard.press('Enter')
  await expectFoundationsFocus(page)
  await page.goBack()
  await expect(page).toHaveURL('/projet')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await page.goForward()
  await expectFoundationsFocus(page)
  expect(await page.evaluate(() => Reflect.get(window, '__spaProof'))).toBe('0.3')
  await page.screenshot({ path: `test-results/visual/fondations-focus-${info.project.name}.png`, fullPage: true })
})

test('shows complete prerequisites only for the submitted scenario', async ({ page }) => {
  await page.goto('/accueil')
  const project = page.locator('[data-demo-project="jardin-minuit"]')
  await expect(project).toContainText('En attente Chef')
  await expect(project).toContainText('30 validations sur 30')
  await expect(project.getByRole('progressbar', { name: /10 chapitres doublés sur 10/ })).toHaveAttribute('value', '10')
  await expect(project.getByRole('progressbar')).toHaveAttribute('max', '10')
  // Unfinished projects keep their own legitimate progress.
  await expect(page.locator('[data-demo-project="atlas-brumes"]')).toContainText('18 validations obtenues sur 24')
  await project.getByRole('button').click()
  await page.getByRole('button', { name: 'Chef d’équipe', exact: true }).click()
  const progress = page.getByRole('region', { name: 'Progression', exact: true })
  await expect(progress.locator('article')).toHaveCount(3)
  await expect(progress).toContainText('10 chapitres × 3 Réviseurs = 30 validations attendues')
  await expect(progress.getByRole('progressbar').nth(0)).toHaveAttribute('value', '10')
  await expect(progress.getByRole('progressbar').nth(0)).toHaveAttribute('max', '10')
  await expect(progress.getByRole('progressbar').nth(1)).toHaveAttribute('value', '30')
  await expect(progress.getByRole('progressbar').nth(1)).toHaveAttribute('max', '30')
  await expect(progress).toContainText('En attente Chef')
  await expect(page.getByRole('region', { name: 'Validation finale', exact: true })).toContainText('30 validations sur 30')
  const history = page.getByRole('region', { name: 'Historique', exact: true }).locator('li')
  await expect(history.nth(0)).toContainText('09:42')
  await expect(history.nth(1)).toContainText('09:30')
  await expect(history.nth(1)).toContainText('30e validation')
  await expect(history.nth(2)).toContainText('Hier')
  await expect(page.locator('[data-workspace-region="publication-preparation"], input[type="file"], .sound-library, .sound-inspector')).toHaveCount(0)
  await page.getByRole('button', { name: 'Admin Maison', exact: true }).click()
  await expect(page.getByRole('row', { name: /Le Jardin de Minuit/ })).toContainText('En attente Chef')
  await page.getByRole('button', { name: 'Réviseur', exact: true }).click()
  await expect(page.getByText(/Scénario de révision antérieur à la soumission/)).toBeVisible()
  await expect(page.getByRole('region', { name: 'Validation', exact: true })).toContainText('2 sur 3')
  await expect(page.getByRole('region', { name: 'Validation', exact: true })).toContainText('Bloquée')
})

test('finishes and restarts three times, then cleans timers on roles, panels and navigation', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-18T10:00:00Z') })
  await page.addInitScript(() => {
    const pending = new Set<number>()
    let fired = 0
    const timeout = window.setTimeout.bind(window)
    const interval = window.setInterval.bind(window)
    const clearTimeout = window.clearTimeout.bind(window)
    const clearInterval = window.clearInterval.bind(window)
    const isSimulationDelay = (delay?: number) => [1, 2, 4].some(speed => Math.abs((delay ?? 0) - 60_000 / (180 * speed)) < 0.01)
    window.setTimeout = ((callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (!isSimulationDelay(delay) || typeof callback !== 'function') return timeout(callback, delay, ...args)
      const id = timeout(() => { pending.delete(id); fired++; callback(...args) }, delay)
      pending.add(id)
      return id
    }) as typeof window.setTimeout
    window.setInterval = ((callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      const id = interval(callback, delay, ...args)
      if (isSimulationDelay(delay)) pending.add(id)
      return id
    }) as typeof window.setInterval
    window.clearTimeout = ((id?: number) => { if (id !== undefined) pending.delete(id); clearTimeout(id) }) as typeof window.clearTimeout
    window.clearInterval = ((id?: number) => { if (id !== undefined) pending.delete(id); clearInterval(id) }) as typeof window.clearInterval
    Object.assign(window, { __simulationProbe: { pending, get fired() { return fired } } })
  })
  const timerCount = () => page.evaluate(() => Reflect.get(window, '__simulationProbe').pending.size as number)
  const fireCount = () => page.evaluate(() => Reflect.get(window, '__simulationProbe').fired as number)
  await page.goto('/projet') // main.tsx mounts StrictMode in the actual app.
  await page.clock.pauseAt(new Date('2026-09-18T11:00:00Z'))
  await page.getByRole('button', { name: 'Chef d’équipe', exact: true }).click()
  await page.getByRole('button', { name: 'x4', exact: true }).click()
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.getByRole('button', { name: 'Lancer la simulation', exact: true }).click()
    await expect(page.locator('[data-active-word]')).toHaveText('À')
    expect(await timerCount()).toBe(1)
    // Commit/render between each tick; fastForward intentionally skips callbacks.
    for (let word = 1; word < 48; word++) await page.clock.runFor(84)
    await expect(page.locator('[data-active-word]')).toHaveText('pluie.')
    await expect(page.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
    expect(await timerCount()).toBe(0)
    const stopped = await fireCount()
    await page.clock.runFor(10_000)
    expect(await fireCount()).toBe(stopped)
  }
  for (const role of ['Réviseur', 'Chef d’équipe', 'Admin Maison']) {
    await page.getByRole('button', { name: 'Lancer la simulation', exact: true }).click()
    await page.getByRole('button', { name: role, exact: true }).click()
    expect(await timerCount()).toBe(0)
    const stopped = await fireCount()
    await page.clock.runFor(1000)
    expect(await fireCount()).toBe(stopped)
    await expect(page.locator('[data-active-word]')).toHaveCount(0)
  }
  await page.getByRole('button', { name: 'Sound Designer', exact: true }).click()
  const reduced = page.viewportSize()!.width < 896
  if (reduced) await page.getByRole('button', { name: 'Ouvrir Simulation/Navigation', exact: true }).click()
  await page.getByRole('button', { name: 'Lancer la simulation', exact: true }).click()
  if (reduced) await page.locator('#sound-simulation-drawer').getByRole('button', { name: 'Fermer Simulation/Navigation', exact: true }).click()
  else await page.getByRole('button', { name: 'Masquer Simulation/Navigation', exact: true }).click()
  expect(await timerCount()).toBe(0)
  await page.getByRole('button', { name: reduced ? 'Ouvrir Simulation/Navigation' : 'Afficher Simulation/Navigation', exact: true }).click()
  await expect(page.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
  await page.getByRole('button', { name: 'Lancer la simulation', exact: true }).click()
  await page.getByRole('button', { name: 'Ouvrir la navigation générale' }).click()
  await page.getByRole('link', { name: 'Accueil', exact: true }).click()
  expect(await timerCount()).toBe(0)
  const stopped = await fireCount()
  await page.clock.runFor(60_000)
  expect(await fireCount()).toBe(stopped)
  await expect(page.locator('[data-workspace-region="simulation"], [data-active-word]')).toHaveCount(0)
})
