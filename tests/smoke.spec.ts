import { expect } from '@playwright/test'
import { test } from './fixtures'

// Test de fumée exécuté en CI : l'application démarre et affiche l'accueil.
// La fixture partagée fait échouer le test sur toute erreur ou alerte du navigateur.
test('démarre et affiche l’accueil', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/accueil')
  await expect(page).toHaveTitle('Jaquette — Accueil')
  await expect(page.getByRole('heading', { level: 1, name: 'Bonjour, Noémie.' })).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
})
