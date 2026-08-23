import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppShell } from './Shell'

function setPath(path: string) {
  window.history.replaceState(null, '', path)
}

describe('Jaquette application shell', () => {
  beforeEach(() => setPath('/accueil'))

  it.each([
    ['/connexion', 'Entrez dans l’atelier Jaquette'],
    ['/accueil', 'Bonjour, Noémie.'],
    ['/projet', 'Le livre attend sa scène.'],
    ['/parametres', 'Paramètres du prototype'],
  ])('renders the %s route', (path, heading) => {
    setPath(path)
    render(<AppShell />)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible()
  })

  it('marks the active destination with aria-current and a textual signal', () => {
    setPath('/projet')
    render(<AppShell />)
    const activeLink = screen.getByRole('link', { name: /Projet.*Écran actif/ })
    expect(activeLink).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Accueil' })).not.toHaveAttribute('aria-current')
  })

  it('navigates internally and updates the URL, title and focus', async () => {
    const user = userEvent.setup()
    render(<AppShell />)
    await user.click(screen.getByRole('link', { name: 'Paramètres' }))
    expect(window.location.pathname).toBe('/parametres')
    const heading = screen.getByRole('heading', { level: 1, name: 'Paramètres du prototype' })
    await waitFor(() => expect(heading).toHaveFocus())
    expect(document.title).toBe('Jaquette — Paramètres')
  })

  it('reacts to popstate navigation', async () => {
    render(<AppShell />)
    window.history.pushState(null, '', '/projet')
    window.dispatchEvent(new PopStateEvent('popstate'))
    const heading = await screen.findByRole('heading', { level: 1, name: 'Le livre attend sa scène.' })
    await waitFor(() => expect(heading).toHaveFocus())
    expect(screen.getByRole('link', { name: /Projet.*Écran actif/ })).toHaveAttribute('aria-current', 'page')
  })

  it('canonicalizes the root path to the home screen', () => {
    setPath('/')
    render(<AppShell />)
    expect(window.location.pathname).toBe('/accueil')
    expect(screen.getByRole('heading', { level: 1, name: 'Bonjour, Noémie.' })).toBeVisible()
  })

  it('renders an explicit not-found screen for an unknown URL', () => {
    setPath('/inconnue')
    render(<AppShell />)
    expect(screen.getByRole('heading', { level: 1, name: 'Cet écran n’existe pas.' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Revenir à l’accueil' })).toBeEnabled()
  })

  it('provides a skip link and named landmarks', () => {
    render(<AppShell />)
    expect(screen.getByRole('link', { name: 'Aller au contenu' })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('banner')).toBeVisible()
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible()
    expect(screen.getByRole('navigation', { name: 'Ressources du prototype' })).toBeVisible()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('keeps the complete 1.1 foundations demonstration available', () => {
    setPath('/fondations')
    render(<AppShell />)
    expect(screen.getByRole('heading', { level: 1, name: 'La voix du livre commence ici.' })).toBeVisible()
    expect(document.querySelectorAll('[data-track]')).toHaveLength(3)
    expect(screen.getByLabelText('Exemple de page de livre')).toBeVisible()
    expect(screen.getByText('كان البحر هادئًا، وكانت الكلمات تسير مع ضوء الصباح.').closest('[lang="ar"]')).toHaveAttribute('dir', 'rtl')
  })
})
