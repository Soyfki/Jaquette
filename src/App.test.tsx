import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

  it('renders one h1 and the four named Sound Designer regions', () => {
    setPath('/projet')
    render(<AppShell />)
    const workspace = screen.getByLabelText('Workspace Sound Designer fictif')
    expect(within(workspace).getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
    expect(within(workspace).getByRole('region', { name: 'Livre' })).toBeVisible()
    expect(within(workspace).getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
    expect(within(workspace).getByRole('region', { name: 'Simulation/Contrôles' })).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('opens and closes the project menu while preserving SPA navigation', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const menu = screen.getByRole('button', { name: 'Ouvrir la navigation générale' })
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Navigation principale' })).not.toBeInTheDocument()

    await user.click(menu)
    expect(screen.getByRole('button', { name: 'Fermer la navigation générale' })).toHaveAttribute('aria-expanded', 'true')
    const projectLink = screen.getByRole('link', { name: /Projet.*Écran actif/ })
    expect(projectLink).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('link', { name: 'Accueil' }))
    expect(window.location.pathname).toBe('/accueil')
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'Bonjour, Noémie.' })).toHaveFocus())
  })

  it('closes the project menu with Escape and restores focus', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const menu = screen.getByRole('button', { name: 'Ouvrir la navigation générale' })
    await user.click(menu)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: 'Navigation principale' })).not.toBeInTheDocument()
    expect(menu).toHaveFocus()
  })

  it('renders an explicit fictive audio tree with folders, subfolders and files', () => {
    setPath('/projet')
    render(<AppShell />)
    const tree = screen.getByRole('list', { name: 'Arborescence audio fictive' })
    expect(within(tree).getByRole('button', { name: 'Replier Bibliothèque locale — démo' })).toBeVisible()
    for (const family of ['SFX', 'Ambiance', 'Musique']) {
      const item = document.querySelector(`[data-project-track="${family}"]`)
      expect(item).not.toBeNull()
      expect(within(item as HTMLElement).getByRole('img', { name: `Pictogramme ${family}` })).toBeVisible()
      expect(within(item as HTMLElement).getAllByText('Fictif').length).toBeGreaterThanOrEqual(3)
    }
    expect(within(tree).getByRole('button', { name: 'Replier Pas & mouvements' })).toBeVisible()
    expect(within(tree).getByText('pas-gravier.wav')).toBeVisible()
    expect(within(tree).getByText('jardin-pluie.ogg')).toBeVisible()
    expect(within(tree).getByText('heure-bleue.opus')).toBeVisible()
    expect(within(tree).getByText('Google Drive')).toBeVisible()
    expect(within(tree).getByText(/Prévu · démonstration uniquement/)).toBeVisible()
  })

  it('filters only the fictive library names and presents an empty state', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const search = screen.getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' })
    await user.type(search, 'pluie')
    expect(screen.getByText('jardin-pluie.ogg')).toBeVisible()
    expect(screen.queryByText('pas-gravier.wav')).not.toBeInTheDocument()
    await user.clear(search)
    await user.type(search, 'introuvable')
    expect(screen.getByText('Aucun résultat dans les données fictives.')).toBeVisible()
  })

  it('updates the fictive chapter and page controls', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const chapter = screen.getByRole('combobox', { name: 'Chapitre' })
    const slider = screen.getByRole('slider', { name: 'Page fictive' })
    expect(screen.getByText('L’heure bleue', { selector: 'h3' })).toBeVisible()

    await user.selectOptions(chapter, '1')
    expect(screen.getByText('Le pavillon fermé', { selector: 'h3' })).toBeVisible()
    expect(screen.getByText('Page 1 sur 9')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Chapitre suivant' }))
    expect(screen.getByText('La dernière cloche', { selector: 'h3' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Chapitre précédent' }))
    expect(screen.getByText('Le pavillon fermé', { selector: 'h3' })).toBeVisible()
    fireEvent.change(slider, { target: { value: '4' } })
    expect(screen.getByText('Page 4 sur 9')).toBeVisible()
  })

  it('opens and closes the fictive project history', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const history = screen.getByRole('button', { name: 'Historique' })
    await user.click(history)
    expect(history).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: 'Historique fictif du projet' })).toBeVisible()
    expect(screen.getByText('Version de repérage')).toBeVisible()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'Historique fictif du projet' })).not.toBeInTheDocument()
    expect(history).toHaveFocus()
  })

  it('keeps project content fictive, non-editable and without role switching', () => {
    setPath('/projet')
    render(<AppShell />)
    const workspace = screen.getByLabelText('Workspace Sound Designer fictif')
    expect(within(workspace).getByText('Aucune occurrence sélectionnée')).toBeVisible()
    expect(within(workspace).getByText('Inactive')).toBeVisible()
    expect(within(workspace).getByLabelText('Page de livre fictive non éditable')).toBeVisible()
    expect(workspace.querySelector('[contenteditable], audio')).toBeNull()
    expect(screen.queryByRole('combobox', { name: /rôle/i })).not.toBeInTheDocument()
    expect(screen.getByText(/Aucun disque indexé · aucune connexion Drive · aucun média réel/)).toBeVisible()
  })

  it('uses the expected unfilled Material Symbols Rounded instead of initials', () => {
    render(<AppShell />)
    const symbols = Array.from(document.querySelectorAll<SVGElement>('[data-material-symbol]'))
    expect(symbols.map((symbol) => symbol.dataset.materialSymbol)).toEqual(['login', 'home', 'book_2', 'settings', 'palette'])
    expect(symbols.every((symbol) => symbol.dataset.materialStyle === 'rounded-outlined')).toBe(true)
    expect(Array.from(document.querySelectorAll('.nav-link__marker')).every((marker) => marker.textContent === '')).toBe(true)
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
    const user = userEvent.setup()
    render(<AppShell />)
    window.history.pushState(null, '', '/projet')
    window.dispatchEvent(new PopStateEvent('popstate'))
    const heading = await screen.findByRole('heading', { level: 1, name: 'Le livre attend sa scène.' })
    await waitFor(() => expect(heading).toHaveFocus())
    await user.click(screen.getByRole('button', { name: 'Ouvrir la navigation générale' }))
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

  it('provides a skip link and named landmarks on the regular shell', () => {
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
