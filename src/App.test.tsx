import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppShell } from './Shell'

function setPath(path: string) {
  window.history.replaceState(null, '', path)
}

function mockWorkspaceMedia(initialReduced: boolean) {
  let matches = initialReduced
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mediaQuery = {
    get matches() { return matches },
    media: '(max-width: 56rem)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQuery))
  return (reduced: boolean) => {
    matches = reduced
    const event = { matches, media: mediaQuery.media } as MediaQueryListEvent
    listeners.forEach((listener) => listener(event))
  }
}

function mockReducedWorkspace() {
  return mockWorkspaceMedia(true)
}

describe('Jaquette application shell', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })
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

  it('opens the three desktop panels with synchronized compact controls', () => {
    setPath('/projet')
    render(<AppShell />)
    const workspace = screen.getByLabelText('Workspace Sound Designer fictif')
    expect(within(workspace).getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
    expect(within(workspace).getByRole('region', { name: 'Livre' })).toBeVisible()
    expect(within(workspace).getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
    expect(within(workspace).getByRole('region', { name: 'Simulation/Navigation' })).toBeVisible()
    expect(within(workspace).getByRole('button', { name: 'Masquer la bibliothèque' })).toHaveAttribute('aria-expanded', 'true')
    expect(within(workspace).getByRole('button', { name: 'Masquer l’inspecteur audio' })).toHaveAttribute('aria-expanded', 'true')
    expect(within(workspace).getByRole('button', { name: 'Masquer Simulation/Navigation' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('collapses and restores desktop panels independently and resets a hidden simulation', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)

    const libraryToggle = screen.getByRole('button', { name: 'Masquer la bibliothèque' })
    const inspectorToggle = screen.getByRole('button', { name: 'Masquer l’inspecteur audio' })
    const simulationToggle = screen.getByRole('button', { name: 'Masquer Simulation/Navigation' })
    await user.click(libraryToggle)
    expect(libraryToggle).toHaveAccessibleName('Afficher la bibliothèque')
    expect(libraryToggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region', { name: 'Bibliothèque' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Simulation/Navigation' })).toBeVisible()

    await user.click(inspectorToggle)
    expect(screen.queryByRole('region', { name: 'Inspecteur audio' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Bibliothèque' })).not.toBeInTheDocument()
    await user.click(libraryToggle)
    expect(screen.getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
    expect(screen.queryByRole('region', { name: 'Inspecteur audio' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Lancer la simulation' }))
    expect(document.querySelector('[data-active-word="true"]')).toBeInTheDocument()
    await user.click(simulationToggle)
    expect(screen.queryByRole('region', { name: 'Simulation/Navigation' })).not.toBeInTheDocument()
    expect(document.querySelector('[data-active-word="true"]')).not.toBeInTheDocument()
    await user.click(simulationToggle)
    expect(screen.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
  })

  it('uses exclusive accessible drawers in the reduced workspace', async () => {
    const user = userEvent.setup()
    mockReducedWorkspace()
    setPath('/projet')
    render(<AppShell />)

    const libraryToggle = screen.getByRole('button', { name: 'Ouvrir la bibliothèque' })
    const inspectorToggle = screen.getByRole('button', { name: 'Ouvrir l’inspecteur audio' })
    const simulationToggle = screen.getByRole('button', { name: 'Ouvrir Simulation/Navigation' })
    expect(libraryToggle).toHaveAttribute('aria-expanded', 'false')
    expect(libraryToggle).toHaveAttribute('aria-controls', 'sound-library-drawer')
    expect(inspectorToggle).toHaveAttribute('aria-expanded', 'false')
    expect(inspectorToggle).toHaveAttribute('aria-controls', 'sound-inspector-drawer')
    expect(simulationToggle).toHaveAttribute('aria-expanded', 'false')
    expect(simulationToggle).toHaveAttribute('aria-controls', 'sound-simulation-drawer')
    expect(screen.queryByRole('region', { name: 'Bibliothèque' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Inspecteur audio' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Simulation/Navigation' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Livre' })).toBeVisible()

    await user.click(libraryToggle)
    expect(libraryToggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
    expect(screen.queryByRole('region', { name: 'Inspecteur audio' })).not.toBeInTheDocument()
    const libraryDrawer = document.querySelector('#sound-library-drawer') as HTMLElement
    expect(within(libraryDrawer).getByRole('button', { name: 'Fermer la bibliothèque' })).toHaveFocus()

    await user.type(within(libraryDrawer).getByRole('searchbox', { name: 'Rechercher dans la bibliothèque fictive' }), 'pluie')
    expect(within(libraryDrawer).getByText('jardin-pluie.ogg')).toBeVisible()
    await user.click(inspectorToggle)
    expect(screen.queryByRole('region', { name: 'Bibliothèque' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
    const inspectorDrawer = document.querySelector('#sound-inspector-drawer') as HTMLElement
    expect(within(inspectorDrawer).getByText('Aucune occurrence sélectionnée')).toBeVisible()
    expect(within(inspectorDrawer).getByRole('button', { name: 'Fermer l’inspecteur audio' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'Inspecteur audio' })).not.toBeInTheDocument()
    expect(inspectorToggle).toHaveAttribute('aria-expanded', 'false')
    expect(inspectorToggle).toHaveFocus()

    await user.click(simulationToggle)
    const simulationDrawer = document.querySelector('#sound-simulation-drawer') as HTMLElement
    expect(screen.getByRole('region', { name: 'Simulation/Navigation' })).toBeVisible()
    expect(screen.queryByRole('region', { name: 'Bibliothèque' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Inspecteur audio' })).not.toBeInTheDocument()
    expect(within(simulationDrawer).getByRole('button', { name: 'Fermer Simulation/Navigation' })).toHaveFocus()
    await user.click(within(simulationDrawer).getByRole('button', { name: 'Lancer la simulation' }))
    expect(document.querySelector('[data-active-word="true"]')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'Simulation/Navigation' })).not.toBeInTheDocument()
    expect(document.querySelector('[data-active-word="true"]')).not.toBeInTheDocument()
    expect(simulationToggle).toHaveFocus()
    await user.click(simulationToggle)
    expect(screen.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
    await user.click(simulationToggle)

    await user.click(libraryToggle)
    await user.click(libraryToggle)
    expect(screen.queryByRole('region', { name: 'Bibliothèque' })).not.toBeInTheDocument()
    expect(libraryToggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes everything when reduced and restores the initial desktop panels at the breakpoint', async () => {
    const user = userEvent.setup()
    const setReduced = mockWorkspaceMedia(false)
    setPath('/projet')
    render(<AppShell />)

    await user.click(screen.getByRole('button', { name: 'Masquer la bibliothèque' }))
    await user.click(screen.getByRole('button', { name: 'Lancer la simulation' }))
    expect(document.querySelector('[data-active-word="true"]')).toBeInTheDocument()

    act(() => setReduced(true))
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: 'Bibliothèque' })).not.toBeInTheDocument()
      expect(screen.queryByRole('region', { name: 'Inspecteur audio' })).not.toBeInTheDocument()
      expect(screen.queryByRole('region', { name: 'Simulation/Navigation' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('region', { name: 'Livre' })).toBeVisible()
    expect(document.querySelector('[data-active-word="true"]')).not.toBeInTheDocument()

    act(() => setReduced(false))
    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Bibliothèque' })).toBeVisible()
      expect(screen.getByRole('region', { name: 'Inspecteur audio' })).toBeVisible()
      expect(screen.getByRole('region', { name: 'Simulation/Navigation' })).toBeVisible()
    })
    expect(screen.getAllByRole('button', { expanded: true })).toEqual(expect.arrayContaining([
      screen.getByRole('button', { name: 'Masquer la bibliothèque' }),
      screen.getByRole('button', { name: 'Masquer l’inspecteur audio' }),
      screen.getByRole('button', { name: 'Masquer Simulation/Navigation' }),
    ]))
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

  it('selects, replaces and clears local file metadata without reading audio', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const input = screen.getByLabelText('Ouvrir un fichier local') as HTMLInputElement
    const firstFile = new File([new Uint8Array([1, 2, 3])], 'pas-test.wav', { type: 'audio/wav' })
    const readSpy = vi.spyOn(firstFile, 'arrayBuffer')

    fireEvent.change(input, { target: { files: [firstFile] } })
    expect(screen.getByText('pas-test.wav')).toBeVisible()
    expect(screen.getByText('audio/wav · 1 Ko')).toBeVisible()
    expect(screen.getByText('sélection locale de démonstration — fichier non importé')).toBeVisible()
    expect(readSpy).not.toHaveBeenCalled()
    expect(document.querySelector('audio')).toBeNull()

    const replacement = new File([new Uint8Array([1, 2, 3, 4])], 'ambiance-test.ogg', { type: 'audio/ogg' })
    fireEvent.change(screen.getByLabelText('Remplacer le fichier local'), { target: { files: [replacement] } })
    expect(screen.queryByText('pas-test.wav')).not.toBeInTheDocument()
    expect(screen.getByText('ambiance-test.ogg')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Effacer la sélection' }))
    expect(screen.queryByText('ambiance-test.ogg')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Ouvrir un fichier local')).toBeVisible()
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

  it('keeps chapter selection separate from synchronized page navigation', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const chapter = screen.getByRole('combobox', { name: 'Chapitre' })
    const slider = screen.getByRole('slider', { name: 'Page fictive' })
    const previousPage = screen.getByRole('button', { name: 'Page précédente' })
    const nextPage = screen.getByRole('button', { name: 'Page suivante' })

    expect(screen.queryByRole('button', { name: 'Chapitre précédent' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Chapitre suivant' })).not.toBeInTheDocument()
    expect(previousPage).toBeDisabled()
    expect(nextPage).toBeEnabled()

    await user.click(nextPage)
    expect(slider).toHaveValue('2')
    expect(slider).toHaveAttribute('aria-valuetext', 'Page 2 sur 12')
    expect(screen.getByText('Page 2 sur 12')).toBeVisible()
    expect(previousPage).toBeEnabled()

    await user.click(previousPage)
    expect(slider).toHaveValue('1')
    expect(screen.getByText('Page 1 sur 12')).toBeVisible()

    fireEvent.change(slider, { target: { value: '12' } })
    expect(nextPage).toBeDisabled()
    await user.selectOptions(chapter, '1')
    expect(screen.getByText('Le pavillon fermé', { selector: 'h3' })).toBeVisible()
    expect(slider).toHaveValue('1')
    expect(slider).toHaveAttribute('aria-valuetext', 'Page 1 sur 9')
    expect(screen.getByText('Page 1 sur 9')).toBeVisible()
  })

  it('launches, pauses, resumes and manually advances the text simulation', async () => {
    const user = userEvent.setup()
    setPath('/projet')
    render(<AppShell />)
    const x1 = screen.getByRole('button', { name: 'x1' })
    const x2 = screen.getByRole('button', { name: 'x2' })
    const x4 = screen.getByRole('button', { name: 'x4' })

    expect(x1).toHaveAttribute('aria-pressed', 'true')
    expect(x2).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', { name: 'Lancer la simulation' }))
    expect(screen.getByRole('button', { name: 'Mettre en pause' })).toBeVisible()
    expect(screen.getByRole('status', { name: 'État de la simulation : En cours' })).toBeVisible()
    expect(document.querySelector('[data-active-word="true"]')).toHaveTextContent('À')
    await user.click(screen.getByRole('button', { name: 'Mettre en pause' }))
    expect(screen.getByRole('status', { name: 'État de la simulation : En pause' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Mot suivant' }))
    expect(document.querySelector('[data-active-word="true"]')).toHaveTextContent('l’instant')
    await user.click(screen.getByRole('button', { name: 'Mot précédent' }))
    expect(document.querySelector('[data-active-word="true"]')).toHaveTextContent('À')

    await user.click(x2)
    expect(x2).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Multiplicateur actif : x2')).toBeVisible()
    await user.click(x4)
    expect(x4).toHaveAttribute('aria-pressed', 'true')
    await user.click(x1)
    expect(x1).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Reprendre la simulation' }))
    expect(screen.getByRole('button', { name: 'Mettre en pause' })).toBeVisible()
  })

  it('stops at the last word and clears the simulation timer when its panel closes', () => {
    vi.useFakeTimers()
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    setPath('/projet')
    const firstRender = render(<AppShell />)

    fireEvent.click(screen.getByRole('button', { name: 'Lancer la simulation' }))
    act(() => vi.advanceTimersByTime(20_000))
    expect(screen.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Lancer la simulation' })).toBeVisible()
    expect(document.querySelector('[data-active-word="true"]')).toHaveTextContent('pluie.')
    firstRender.unmount()

    const secondRender = render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Lancer la simulation' }))
    clearIntervalSpy.mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Masquer Simulation/Navigation' }))
    expect(clearIntervalSpy).toHaveBeenCalled()
    expect(document.querySelector('[data-active-word="true"]')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Afficher Simulation/Navigation' }))
    expect(screen.getByRole('status', { name: 'État de la simulation : Inactive' })).toBeVisible()
    secondRender.unmount()
    clearIntervalSpy.mockRestore()
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
