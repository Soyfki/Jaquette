import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { expectedValidations, submittedProject } from './demoScenario'

type TrackName = 'SFX' | 'Ambiance' | 'Musique'
type AudioFolder = { name: string; files: string[] }
type LibraryFamily = { name: TrackName; token: string; icon: ReactNode; folders: AudioFolder[] }
type LocalFileMetadata = { name: string; size: number; type: string }
type SimulationState = 'inactive' | 'paused' | 'playing'
type WorkspacePanel = 'library' | 'inspector' | 'simulation'
type ResponsiveDrawer = WorkspacePanel | null
type DesktopPanelState = Record<WorkspacePanel, boolean>
type FinalValidationState = 'Non soumis' | 'En attente Chef' | 'À corriger' | 'Validé' | 'Prêt à publier' | 'Publié'

export type SimulatedProjectRole = 'sound-designer' | 'reviewer' | 'team-lead' | 'publishing-house-admin'

const REDUCED_WORKSPACE_QUERY = '(max-width: 56rem)'
const BASE_WORDS_PER_MINUTE = 180
const TEAM_LEAD_DEMO_FINAL_VALIDATION_STATE: FinalValidationState = submittedProject.finalValidationState
const PUBLICATION_PREPARATION_STATES: readonly FinalValidationState[] = ['Validé', 'Prêt à publier']

function canShowPublicationPreparation(state: FinalValidationState) {
  return PUBLICATION_PREPARATION_STATES.includes(state)
}

const simulatedRoleOptions: ReadonlyArray<{ value: SimulatedProjectRole; label: string }> = [
  { value: 'sound-designer', label: 'Sound Designer' },
  { value: 'reviewer', label: 'Réviseur' },
  { value: 'team-lead', label: 'Chef d’équipe' },
  { value: 'publishing-house-admin', label: 'Admin Maison' },
]

const simulatedRolePresentation: Record<SimulatedProjectRole, { label: string; title: string }> = {
  'sound-designer': { label: 'Sound Designer', title: 'Le livre attend sa scène.' },
  reviewer: { label: 'Réviseur', title: 'Le livre passe en révision.' },
  'team-lead': { label: 'Chef d’équipe', title: 'Le projet garde son cap.' },
  'publishing-house-admin': { label: 'Admin Maison', title: 'La maison organise ses équipes.' },
}

const libraryFamilies: LibraryFamily[] = [
  {
    name: 'SFX',
    token: '--color-track-sfx',
    icon: <SparkIcon />,
    folders: [{ name: 'Pas & mouvements', files: ['pas-gravier.wav', 'porte-bois.wav', 'branche-cassee.wav'] }],
  },
  {
    name: 'Ambiance',
    token: '--color-track-ambience',
    icon: <WavesIcon />,
    folders: [{ name: 'Jardins nocturnes', files: ['jardin-pluie.ogg', 'vent-feuillage.wav', 'grillons-lointains.wav'] }],
  },
  {
    name: 'Musique',
    token: '--color-track-music',
    icon: <MusicIcon />,
    folders: [{ name: 'Thèmes narratifs', files: ['heure-bleue.opus', 'aube-piano.wav', 'minuit-cordes.opus'] }],
  },
]

const chapters = [
  {
    title: 'L’heure bleue',
    label: 'Chapitre 1 — L’heure bleue',
    pages: 12,
    paragraphs: [
      'À l’instant où la ville retenait son souffle, Alma poussa la grille du jardin. Sous ses pas, le gravier humide racontait un chemin que personne n’avait emprunté depuis l’hiver.',
      'Les feuilles frémirent au-dessus d’elle. Quelque part derrière les murs, une cloche très douce sembla répondre à la pluie.',
    ],
  },
  {
    title: 'Le pavillon fermé',
    label: 'Chapitre 2 — Le pavillon fermé',
    pages: 9,
    paragraphs: [
      'Au bout de l’allée, le pavillon gardait ses volets clos. Une lumière fine dessinait pourtant le contour de la porte.',
      'Alma posa la main sur le bois froid et entendit, de l’autre côté, le froissement patient d’une page.',
    ],
  },
  {
    title: 'La dernière cloche',
    label: 'Chapitre 3 — La dernière cloche',
    pages: 14,
    paragraphs: [
      'La pluie s’était tue lorsque la cloche sonna de nouveau. Cette fois, le jardin entier parut écouter avec elle.',
      'Au premier rayon du jour, le chemin de gravier avait disparu sous une poussière de fleurs pâles.',
    ],
  },
]

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.45 5.55L19 10l-5.55 1.45L12 17l-1.45-5.55L5 10l5.55-1.45L12 3Z" />
      <path d="m18.5 16 .65 2.35 2.35.65-2.35.65L18.5 22l-.65-2.35L15.5 19l2.35-.65L18.5 16Z" />
    </svg>
  )
}

function WavesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0" />
      <path d="M3 12c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0" />
      <path d="M3 16c2-1.8 4-1.8 6 0s4 1.8 6 0 4-1.8 6 0" />
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V6l10-2v12" />
      <ellipse cx="6" cy="18" rx="3" ry="2" />
      <ellipse cx="16" cy="16" rx="3" ry="2" />
    </svg>
  )
}

function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 3 11.2 9.1-5.2.8-2.8 4.4L6 3Z" />
      <path d="m13 13 4 6" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h8M16 18h4" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="14" cy="18" r="2" />
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 6.5h6l1.6 2H20.5v9h-17v-11Z" />
      <path d="M3.5 9h17" />
    </svg>
  )
}

function useMediaQuery(query: string) {
  const getMatches = () => typeof window.matchMedia === 'function' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(getMatches)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mediaQuery = window.matchMedia(query)
    const updateMatches = () => setMatches(mediaQuery.matches)
    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)
    return () => mediaQuery.removeEventListener('change', updateMatches)
  }, [query])

  return matches
}

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr')
}

function FolderToggle({
  expanded,
  label,
  onToggle,
  tone,
}: {
  expanded: boolean
  label: string
  onToggle: () => void
  tone?: TrackName
}) {
  const family = tone ? libraryFamilies.find((item) => item.name === tone) : undefined
  return (
    <button
      className="tree-toggle"
      type="button"
      aria-expanded={expanded}
      aria-label={`${expanded ? 'Replier' : 'Déplier'} ${label}`}
      onClick={onToggle}
    >
      <span className="tree-chevron" aria-hidden="true">{expanded ? '⌄' : '›'}</span>
      <span className="tree-folder" aria-hidden="true">▰</span>
      {family && <span className="tree-family-icon" role="img" aria-label={`Pictogramme ${tone}`}>{family.icon}</span>}
      <span>{label}</span>
    </button>
  )
}

function LibraryPanel({ id }: { id?: string }) {
  const [query, setQuery] = useState('')
  const [localFile, setLocalFile] = useState<LocalFileMetadata | null>(null)
  const localFileInputRef = useRef<HTMLInputElement>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    local: true,
    SFX: true,
    'Pas & mouvements': true,
    Ambiance: true,
    'Jardins nocturnes': true,
    Musique: true,
    'Thèmes narratifs': true,
  })
  const normalizedQuery = normalizeSearch(query.trim())
  const filteredFamilies = useMemo(() => libraryFamilies.flatMap((family) => {
    const familyMatches = normalizeSearch(family.name).includes(normalizedQuery)
    const folders = family.folders.flatMap((folder) => {
      const folderMatches = normalizeSearch(folder.name).includes(normalizedQuery)
      const files = folder.files.filter((file) => (
        !normalizedQuery || familyMatches || folderMatches || normalizeSearch(file).includes(normalizedQuery)
      ))
      return files.length > 0 ? [{ ...folder, files }] : []
    })
    return folders.length > 0 ? [{ ...family, folders }] : []
  }), [normalizedQuery])
  const showDrive = !normalizedQuery || normalizeSearch('Google Drive prévu démonstration').includes(normalizedQuery)
  const hasResults = filteredFamilies.length > 0 || showDrive
  const isOpen = (key: string) => Boolean(expanded[key]) || Boolean(normalizedQuery)
  const toggle = (key: string) => setExpanded((current) => ({ ...current, [key]: !current[key] }))
  const clearLocalFile = () => {
    setLocalFile(null)
    if (localFileInputRef.current) localFileInputRef.current.value = ''
  }

  return (
    <section id={id} className="sound-panel sound-library" aria-labelledby="sound-library-title" data-workspace-region="library">
      <header className="sound-panel__header">
        <div><span className="sound-panel__index">01 · Sources fictives</span><h2 id="sound-library-title">Bibliothèque</h2></div>
        <span className="fiction-chip fiction-chip--static">Démo</span>
      </header>
      <div className="library-search">
        <label htmlFor="library-search">Rechercher dans la bibliothèque fictive</label>
        <div className="library-search__field">
          <span aria-hidden="true">⌕</span>
          <input id="library-search" type="search" value={query} placeholder="Nom d’un son…" onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>
      <div className="local-file-picker">
        <input
          ref={localFileInputRef}
          className="local-file-input"
          id="local-audio-file"
          type="file"
          accept="audio/mpeg,audio/mp4,audio/ogg,audio/opus,audio/wav,audio/webm,.aac,.flac,.m4a,.mp3,.oga,.ogg,.opus,.wav,.webm"
          onChange={(event) => {
            const file = event.target.files?.[0]
            setLocalFile(file ? { name: file.name, size: file.size, type: file.type || 'Type audio non renseigné' } : null)
          }}
        />
        <label className="local-file-trigger" id="local-audio-file-label" htmlFor="local-audio-file">
          {localFile ? 'Remplacer le fichier local' : 'Ouvrir un fichier local'}
        </label>
        {localFile && (
          <div className="local-file-selection" role="status" aria-live="polite">
            <strong>{localFile.name}</strong>
            <span>{localFile.type} · {Math.max(1, Math.ceil(localFile.size / 1024))} Ko</span>
            <span>sélection locale de démonstration — fichier non importé</span>
            <button type="button" onClick={clearLocalFile}>Effacer la sélection</button>
          </div>
        )}
      </div>
      {hasResults ? (
        <ul className="library-tree" aria-label="Arborescence audio fictive">
          {filteredFamilies.length > 0 && (
            <li className="tree-source">
              <FolderToggle expanded={isOpen('local')} label="Bibliothèque locale — démo" onToggle={() => toggle('local')} />
              {isOpen('local') && (
                <ul>
                  {filteredFamilies.map((family) => (
                    <li key={family.name} className="tree-family" data-project-track={family.name} style={{ '--track-color': `var(${family.token})` } as CSSProperties}>
                      <FolderToggle expanded={isOpen(family.name)} label={family.name} tone={family.name} onToggle={() => toggle(family.name)} />
                      {isOpen(family.name) && (
                        <ul>
                          {family.folders.map((folder) => (
                            <li key={folder.name}>
                              <FolderToggle expanded={isOpen(folder.name)} label={folder.name} onToggle={() => toggle(folder.name)} />
                              {isOpen(folder.name) && (
                                <ul>
                                  {folder.files.map((file) => (
                                    <li className="tree-file" key={file}><span aria-hidden="true">♪</span><span>{file}</span><small>Fictif</small></li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
          {showDrive && (
            <li className="tree-drive">
              <span className="tree-drive__icon" aria-hidden="true">◆</span>
              <span><strong>Google Drive</strong><small>Prévu · démonstration uniquement</small></span>
            </li>
          )}
        </ul>
      ) : (
        <p className="library-empty" role="status">Aucun résultat dans les données fictives.</p>
      )}
      <p className="sound-panel__footnote">Aucun disque indexé · aucune connexion Drive · aucun média réel</p>
    </section>
  )
}

function BookPanel({ activeWordIndex, chapterIndex, page }: { activeWordIndex: number | null; chapterIndex: number; page: number }) {
  const chapter = chapters[chapterIndex]
  let wordIndex = 0
  return (
    <section className="sound-panel sound-book" aria-labelledby="sound-book-title" data-workspace-region="book">
      <header className="sound-panel__header sound-book__header">
        <div><span className="sound-panel__index">02 · Timeline textuelle</span><h2 id="sound-book-title">Livre</h2></div>
        <span className="passive-status passive-status--attention">Aucun EPUB chargé</span>
      </header>
      <article className="project-book-page" aria-label="Page de livre fictive non éditable">
        <header className="project-book-page__header"><span>{chapter.label}</span><span>Prototype non éditable</span></header>
        <div className="project-book-page__content">
          <span className="project-book-page__kicker">Le Jardin de Minuit · contenu fictif</span>
          <h3>{chapter.title}</h3>
          {chapter.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              {paragraph.match(/\S+|\s+/g)?.map((part) => {
                if (/^\s+$/.test(part)) return part
                const currentWordIndex = wordIndex
                wordIndex += 1
                return currentWordIndex === activeWordIndex
                  ? <mark className="active-demo-word" data-active-word="true" aria-current="true" key={`${currentWordIndex}-${part}`}>{part}</mark>
                  : <span className="demo-word" key={`${currentWordIndex}-${part}`}>{part}</span>
              })}
            </p>
          ))}
          <aside className="text-timeline-note" aria-label="Principe de la timeline textuelle">
            <span className="text-timeline-note__icon"><CursorIcon /></span>
            <p><strong>Le texte sera la timeline.</strong> Les sons s’attacheront aux mots, jamais à une échelle en secondes.</p>
          </aside>
        </div>
        <footer className="project-book-page__footer">Page fictive · {String(page).padStart(2, '0')}</footer>
      </article>
    </section>
  )
}

function InspectorPanel({ id }: { id?: string }) {
  return (
    <section id={id} className="sound-panel sound-inspector" aria-labelledby="sound-inspector-title" data-workspace-region="inspector">
      <header className="sound-panel__header"><div><span className="sound-panel__index">03</span><h2 id="sound-inspector-title">Inspecteur audio</h2></div></header>
      <div className="inspector-empty">
        <span className="inspector-empty__icon"><SlidersIcon /></span>
        <strong>Aucune occurrence sélectionnée</strong>
        <p>Les réglages apparaîtront après la sélection future d’un son associé au texte.</p>
      </div>
      <div className="setting-preview" aria-label="Aperçu passif des réglages futurs">
        <span>Niveau &amp; source</span><span>Boucle &amp; fondus</span><span>Ducking &amp; espace</span>
      </div>
      <p className="sound-panel__footnote">Catégories indicatives · aucun réglage actif</p>
    </section>
  )
}

function SimulationControls({
  id,
  activeWordIndex,
  chapterIndex,
  historyOpen,
  page,
  setActiveWordIndex,
  setChapterIndex,
  setHistoryOpen,
  setPage,
  historyButtonRef,
}: {
  id?: string
  activeWordIndex: number | null
  chapterIndex: number
  historyOpen: boolean
  page: number
  setActiveWordIndex: React.Dispatch<React.SetStateAction<number | null>>
  setChapterIndex: (value: number) => void
  setHistoryOpen: (value: boolean) => void
  setPage: (value: number) => void
  historyButtonRef: React.RefObject<HTMLButtonElement | null>
}) {
  const chapter = chapters[chapterIndex]
  const [simulationState, setSimulationState] = useState<SimulationState>('inactive')
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const wordCount = useMemo(() => chapter.paragraphs.join(' ').match(/\S+/g)?.length ?? 0, [chapter])
  const lastWordIndex = Math.max(0, wordCount - 1)
  const moveChapter = (next: number) => {
    setChapterIndex(next)
    setPage(1)
    setActiveWordIndex(null)
    setSimulationState('inactive')
  }

  useEffect(() => {
    if (simulationState !== 'playing') return
    const timer = window.setTimeout(() => {
      const next = Math.min(lastWordIndex, activeWordIndex === null ? 0 : activeWordIndex + 1)
      setActiveWordIndex(next)
      if (next === lastWordIndex) setSimulationState('inactive')
    }, 60_000 / (BASE_WORDS_PER_MINUTE * speedMultiplier))
    return () => window.clearTimeout(timer)
  }, [activeWordIndex, lastWordIndex, setActiveWordIndex, simulationState, speedMultiplier])

  const toggleSimulation = () => {
    if (simulationState === 'playing') {
      setSimulationState('paused')
      return
    }
    if (activeWordIndex === null || activeWordIndex >= lastWordIndex) setActiveWordIndex(0)
    setSimulationState('playing')
  }
  const moveActiveWord = (direction: -1 | 1) => {
    const next = Math.min(lastWordIndex, Math.max(0, (activeWordIndex ?? (direction > 0 ? -1 : 1)) + direction))
    setActiveWordIndex(next)
    if (next === lastWordIndex) setSimulationState('inactive')
  }
  const simulationLabel = simulationState === 'playing' ? 'En cours' : simulationState === 'paused' ? 'En pause' : 'Inactive'
  const simulationButtonLabel = simulationState === 'playing'
    ? 'Mettre en pause'
    : simulationState === 'paused'
      ? 'Reprendre la simulation'
      : 'Lancer la simulation'

  return (
    <section id={id} className="sound-panel sound-controls" aria-labelledby="sound-controls-title" data-workspace-region="simulation">
      <div className="controls-title">
        <div><span className="sound-panel__index">04 · Démonstrations locales</span><h2 id="sound-controls-title">Simulation/Navigation</h2></div>
      </div>
      <div className="control-demonstrations">
        <div className="book-navigation" aria-labelledby="book-navigation-title">
          <h3 id="book-navigation-title">Navigation fictive du livre</h3>
          <div className="chapter-history-row">
            <label className="chapter-select">Chapitre
              <select value={chapterIndex} onChange={(event) => moveChapter(Number(event.target.value))}>
                {chapters.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
              </select>
            </label>
            <button ref={historyButtonRef} type="button" className="history-button" aria-expanded={historyOpen} aria-controls="project-history" onClick={() => setHistoryOpen(!historyOpen)}>Historique</button>
          </div>
          <div className="page-navigation-group" role="group" aria-label="Pagination fictive du livre">
            <button type="button" className="icon-button" aria-label="Page précédente" disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
            <label className="page-slider" htmlFor="book-page-slider">Page fictive
              <input
                id="book-page-slider"
                aria-label="Page fictive"
                type="range"
                min="1"
                max={chapter.pages}
                value={page}
                aria-valuetext={`Page ${page} sur ${chapter.pages}`}
                onChange={(event) => setPage(Number(event.target.value))}
              />
              <output className="page-output" htmlFor="book-page-slider" aria-live="polite">Page {page} sur {chapter.pages}</output>
            </label>
            <button type="button" className="icon-button" aria-label="Page suivante" disabled={page === chapter.pages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
        <div className="text-simulation" aria-labelledby="text-simulation-title">
          <div className="text-simulation__heading">
            <h3 id="text-simulation-title">Simulation fictive du texte</h3>
            <span className={`simulation-status simulation-status--${simulationState}`} role="status" aria-live="polite" aria-label={`État de la simulation : ${simulationLabel}`}>
              <span aria-hidden="true" /><strong>{simulationLabel}</strong>
            </span>
          </div>
          <div className="simulation-actions">
            <button type="button" className="simulation-toggle" onClick={toggleSimulation}>{simulationButtonLabel}</button>
            <button type="button" className="simulation-step" disabled={activeWordIndex === null || activeWordIndex === 0} onClick={() => moveActiveWord(-1)}>Mot précédent</button>
            <button type="button" className="simulation-step" disabled={activeWordIndex === lastWordIndex} onClick={() => moveActiveWord(1)}>Mot suivant</button>
          </div>
          <div className="simulation-speed" aria-label="Vitesse de la simulation">
            <span>Base : {BASE_WORDS_PER_MINUTE} mots par minute</span>
            <div className="speed-buttons" role="group" aria-label="Multiplicateur de vitesse">
              {[1, 2, 4].map((multiplier) => (
                <button
                  type="button"
                  key={multiplier}
                  aria-pressed={speedMultiplier === multiplier}
                  onClick={() => setSpeedMultiplier(multiplier)}
                >x{multiplier}</button>
              ))}
            </div>
            <strong>Multiplicateur actif : x{speedMultiplier}</strong>
          </div>
        </div>
      </div>
      {historyOpen && (
        <div id="project-history" className="project-history" role="region" aria-label="Historique fictif du projet">
          <div><strong>Version de repérage</strong><span>Aujourd’hui · 09:42 · démonstration</span></div>
          <div><strong>Structure du livre préparée</strong><span>Hier · 17:18 · démonstration</span></div>
          <div><strong>Projet fictif créé</strong><span>12 août · 11:03 · démonstration</span></div>
        </div>
      )}
      <p className="controls-disclaimer">Démonstration locale uniquement : aucun son joué, aucune pagination EPUB définie et aucune donnée persistée.</p>
    </section>
  )
}

function SoundDesignerWorkspace() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [desktopPanels, setDesktopPanels] = useState<DesktopPanelState>({
    library: true,
    inspector: true,
    simulation: true,
  })
  const [responsiveDrawer, setResponsiveDrawer] = useState<ResponsiveDrawer>(null)
  const isReducedWorkspace = useMediaQuery(REDUCED_WORKSPACE_QUERY)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const libraryButtonRef = useRef<HTMLButtonElement>(null)
  const inspectorButtonRef = useRef<HTMLButtonElement>(null)
  const simulationButtonRef = useRef<HTMLButtonElement>(null)
  const libraryCloseButtonRef = useRef<HTMLButtonElement>(null)
  const inspectorCloseButtonRef = useRef<HTMLButtonElement>(null)
  const simulationCloseButtonRef = useRef<HTMLButtonElement>(null)

  const resetSimulation = () => {
    setActiveWordIndex(null)
    setHistoryOpen(false)
  }

  const closeResponsiveDrawer = (restoreFocus = true) => {
    const drawerToClose = responsiveDrawer
    if (drawerToClose === 'simulation') resetSimulation()
    setResponsiveDrawer(null)
    if (!restoreFocus) return
    if (drawerToClose === 'library') libraryButtonRef.current?.focus()
    if (drawerToClose === 'inspector') inspectorButtonRef.current?.focus()
    if (drawerToClose === 'simulation') simulationButtonRef.current?.focus()
  }

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mediaQuery = window.matchMedia(REDUCED_WORKSPACE_QUERY)
    const resetPanelsAtBreakpoint = (event: MediaQueryListEvent) => {
      setResponsiveDrawer(null)
      setActiveWordIndex(null)
      setHistoryOpen(false)
      if (!event.matches) {
        setDesktopPanels({ library: true, inspector: true, simulation: true })
      }
    }
    mediaQuery.addEventListener('change', resetPanelsAtBreakpoint)
    return () => mediaQuery.removeEventListener('change', resetPanelsAtBreakpoint)
  }, [])

  useEffect(() => {
    if (!isReducedWorkspace || !responsiveDrawer) return
    const focusTarget = responsiveDrawer === 'library'
      ? libraryCloseButtonRef
      : responsiveDrawer === 'inspector'
        ? inspectorCloseButtonRef
        : simulationCloseButtonRef
    focusTarget.current?.focus()
  }, [isReducedWorkspace, responsiveDrawer])

  useEffect(() => {
    const closeOverlay = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (historyOpen) {
        setHistoryOpen(false)
        historyButtonRef.current?.focus()
        return
      }
      if (responsiveDrawer) {
        setResponsiveDrawer(null)
        if (responsiveDrawer === 'library') libraryButtonRef.current?.focus()
        if (responsiveDrawer === 'inspector') inspectorButtonRef.current?.focus()
        if (responsiveDrawer === 'simulation') {
          resetSimulation()
          simulationButtonRef.current?.focus()
        }
        return
      }
    }
    window.addEventListener('keydown', closeOverlay)
    return () => window.removeEventListener('keydown', closeOverlay)
  }, [historyOpen, responsiveDrawer])

  const isPanelOpen = (panel: WorkspacePanel) => isReducedWorkspace
    ? responsiveDrawer === panel
    : desktopPanels[panel]
  const togglePanel = (panel: WorkspacePanel) => {
    if (isReducedWorkspace) {
      if (responsiveDrawer === panel) {
        closeResponsiveDrawer(false)
      } else {
        if (responsiveDrawer === 'simulation') resetSimulation()
        setResponsiveDrawer(panel)
      }
      return
    }
    if (panel === 'simulation' && desktopPanels.simulation) resetSimulation()
    setDesktopPanels((current) => ({ ...current, [panel]: !current[panel] }))
  }
  const panelAction = (panel: WorkspacePanel, name: string) => {
    if (isReducedWorkspace) return `${isPanelOpen(panel) ? 'Fermer' : 'Ouvrir'} ${name}`
    return `${isPanelOpen(panel) ? 'Masquer' : 'Afficher'} ${name}`
  }
  const panelControlId = (panel: WorkspacePanel) => isReducedWorkspace
    ? `sound-${panel}-drawer`
    : `sound-${panel}-panel`
  const workspaceClasses = [
    'sound-workspace',
    `sound-workspace--library-${desktopPanels.library ? 'open' : 'closed'}`,
    `sound-workspace--inspector-${desktopPanels.inspector ? 'open' : 'closed'}`,
    `sound-workspace--simulation-${desktopPanels.simulation ? 'open' : 'closed'}`,
  ].join(' ')

  const toolbar = (
    <div className="responsive-panel-toolbar" aria-label="Panneaux de l’atelier">
      <button
        ref={libraryButtonRef}
        type="button"
        aria-controls={panelControlId('library')}
        aria-expanded={isPanelOpen('library')}
        onClick={() => togglePanel('library')}
      >
        <span className="responsive-panel-toolbar__icon"><LibraryIcon /></span>
        <span>{panelAction('library', 'la bibliothèque')}</span>
      </button>
      <button
        ref={inspectorButtonRef}
        type="button"
        aria-controls={panelControlId('inspector')}
        aria-expanded={isPanelOpen('inspector')}
        onClick={() => togglePanel('inspector')}
      >
        <span className="responsive-panel-toolbar__icon"><SlidersIcon /></span>
        <span>{panelAction('inspector', 'l’inspecteur audio')}</span>
      </button>
      <button
        ref={simulationButtonRef}
        type="button"
        aria-controls={panelControlId('simulation')}
        aria-expanded={isPanelOpen('simulation')}
        onClick={() => togglePanel('simulation')}
      >
        <span className="responsive-panel-toolbar__icon"><CursorIcon /></span>
        <span>{panelAction('simulation', 'Simulation/Navigation')}</span>
      </button>
    </div>
  )

  return (
    <div className={workspaceClasses} aria-label="Workspace Sound Designer fictif">
      {toolbar}
      {!isReducedWorkspace && desktopPanels.library && <LibraryPanel id="sound-library-panel" />}
      {isReducedWorkspace && responsiveDrawer === 'library' && (
        <div id="sound-library-drawer" className="sound-drawer sound-drawer--left">
          <button ref={libraryCloseButtonRef} className="drawer-close-button" type="button" onClick={() => closeResponsiveDrawer()}>Fermer la bibliothèque</button>
          <LibraryPanel />
        </div>
      )}
      <BookPanel activeWordIndex={activeWordIndex} chapterIndex={chapterIndex} page={page} />
      {!isReducedWorkspace && desktopPanels.inspector && <InspectorPanel id="sound-inspector-panel" />}
      {isReducedWorkspace && responsiveDrawer === 'inspector' && (
        <div id="sound-inspector-drawer" className="sound-drawer sound-drawer--right">
          <button ref={inspectorCloseButtonRef} className="drawer-close-button" type="button" onClick={() => closeResponsiveDrawer()}>Fermer l’inspecteur audio</button>
          <InspectorPanel />
        </div>
      )}
      {!isReducedWorkspace && desktopPanels.simulation && (
        <SimulationControls
          id="sound-simulation-panel"
          activeWordIndex={activeWordIndex}
          chapterIndex={chapterIndex}
          historyOpen={historyOpen}
          page={page}
          setActiveWordIndex={setActiveWordIndex}
          setChapterIndex={setChapterIndex}
          setHistoryOpen={setHistoryOpen}
          setPage={setPage}
          historyButtonRef={historyButtonRef}
        />
      )}
      {isReducedWorkspace && responsiveDrawer === 'simulation' && (
        <div id="sound-simulation-drawer" className="sound-drawer sound-drawer--bottom">
          <button ref={simulationCloseButtonRef} className="drawer-close-button" type="button" onClick={() => closeResponsiveDrawer()}>Fermer Simulation/Navigation</button>
          <SimulationControls
            activeWordIndex={activeWordIndex}
            chapterIndex={chapterIndex}
            historyOpen={historyOpen}
            page={page}
            setActiveWordIndex={setActiveWordIndex}
            setChapterIndex={setChapterIndex}
            setHistoryOpen={setHistoryOpen}
            setPage={setPage}
            historyButtonRef={historyButtonRef}
          />
        </div>
      )}
    </div>
  )
}

function ProjectRoleSwitcher({
  role,
  onRoleChange,
}: {
  role: SimulatedProjectRole
  onRoleChange: (role: SimulatedProjectRole) => void
}) {
  return (
    <div className="project-role-switcher">
      <div className="project-role-switcher__heading">
        <span>Rôle simulé</span>
        <small>Local · non persistant</small>
      </div>
      <div className="project-role-switcher__options" role="group" aria-label="Rôle simulé">
        {simulatedRoleOptions.map((option) => {
          const isActive = option.value === role
          return (
            <button
              type="button"
              key={option.value}
              aria-pressed={isActive}
              onClick={() => onRoleChange(option.value)}
            >
              <span>{option.label}</span>
              {isActive && <span className="project-role-switcher__state" aria-hidden="true">Actif</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ReviewerCommentsPanel() {
  return (
    <section className="reviewer-panel reviewer-comments" aria-labelledby="reviewer-comments-title" data-workspace-region="comments">
      <header className="reviewer-panel__header">
        <div><span className="sound-panel__index">03 · Échanges fictifs</span><h2 id="reviewer-comments-title">Commentaires</h2></div>
        <span className="fiction-chip fiction-chip--static">Démo</span>
      </header>
      <ul className="reviewer-comment-list">
        <li>
          <div><strong>Réviseuse A · personne fictive</strong><span className="review-state review-state--open">Ouvert</span></div>
          <p>« La cloche très douce » · plage de mots fictive</p>
          <blockquote>Vérifier la continuité de l’ambiance à cet endroit.</blockquote>
        </li>
        <li>
          <div><strong>Réviseur B · personne fictive</strong><span className="review-state">Résolu</span></div>
          <p>Chapitre entier · cible fictive</p>
          <blockquote>Le niveau général reste lisible dans cette simulation.</blockquote>
        </li>
      </ul>
      <p className="reviewer-panel__note">Aucune saisie n’est enregistrée dans cette sous-livraison.</p>
    </section>
  )
}

function ReviewerCandidatesPanel() {
  return (
    <section className="reviewer-panel reviewer-candidates" aria-labelledby="reviewer-candidates-title" data-workspace-region="candidates">
      <header className="reviewer-panel__header">
        <div><span className="sound-panel__index">04 · Versions fictives</span><h2 id="reviewer-candidates-title">Candidates de chapitre</h2></div>
        <span className="fiction-chip fiction-chip--static">2 démos</span>
      </header>
      <div className="reviewer-candidate-list">
        <article className="reviewer-candidate reviewer-candidate--proposed">
          <div><strong>Candidate A</strong><span>Proposée à l’examen · fictif</span></div>
          <p>Base simulée 04 · Sound Designer A fictif</p>
        </article>
        <article className="reviewer-candidate">
          <div><strong>Candidate B</strong><span>Alternative conservée · fictif</span></div>
          <p>Base simulée 04 · Sound Designer B fictif</p>
        </article>
      </div>
      <p className="candidate-proposal-note"><strong>Proposer n’est ni sélectionner définitivement, ni valider.</strong> Dans le futur workflow, l’approbation unanime des Réviseurs affectés sera requise.</p>
    </section>
  )
}

function ReviewerValidationPanel() {
  return (
    <section className="reviewer-panel reviewer-validation" aria-labelledby="reviewer-validation-title" data-workspace-region="validation">
      <header className="reviewer-panel__header">
        <div><span className="sound-panel__index">05 · État fictif</span><h2 id="reviewer-validation-title">Validation</h2></div>
        <span className="fiction-chip fiction-chip--static">Non exécutoire</span>
      </header>
      <p className="reviewer-panel__note">Scénario de révision antérieur à la soumission · distinct de l’état présenté au Chef.</p>
      <dl className="reviewer-validation-summary">
        <div><dt>État de démonstration</dt><dd>Non révisé</dd></div>
        <div><dt>Approbations fictives</dt><dd>2 sur 3</dd></div>
        <div><dt>Intégration</dt><dd>Bloquée</dd></div>
      </dl>
      <p className="reviewer-panel__note">Aucune validation, invalidation ou tâche réelle n’est créée ici.</p>
    </section>
  )
}

function ReviewerWorkspace() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [historyOpen, setHistoryOpen] = useState(false)
  const historyButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!historyOpen) return
    const closeHistory = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setHistoryOpen(false)
      historyButtonRef.current?.focus()
    }
    window.addEventListener('keydown', closeHistory)
    return () => window.removeEventListener('keydown', closeHistory)
  }, [historyOpen])

  return (
    <div className="reviewer-workspace" aria-label="Workspace Réviseur fictif">
      <BookPanel activeWordIndex={activeWordIndex} chapterIndex={chapterIndex} page={page} />
      <SimulationControls
        id="reviewer-simulation-panel"
        activeWordIndex={activeWordIndex}
        chapterIndex={chapterIndex}
        historyOpen={historyOpen}
        page={page}
        setActiveWordIndex={setActiveWordIndex}
        setChapterIndex={setChapterIndex}
        setHistoryOpen={setHistoryOpen}
        setPage={setPage}
        historyButtonRef={historyButtonRef}
      />
      <aside className="reviewer-sidebar" aria-label="Outils de révision fictifs">
        <ReviewerCommentsPanel />
        <ReviewerCandidatesPanel />
        <ReviewerValidationPanel />
      </aside>
    </div>
  )
}

function TeamLeadDashboardPanel() {
  return (
    <section className="role-panel team-lead-dashboard" aria-labelledby="team-lead-dashboard-title" data-workspace-region="dashboard">
      <header className="role-panel__header">
        <div><span className="sound-panel__index">01 · Pilotage fictif</span><h2 id="team-lead-dashboard-title">Tableau de bord</h2></div>
        <span className="fiction-chip fiction-chip--static">Local · démo</span>
      </header>
      <div className="team-lead-dashboard__summary">
        <div><span>Projet</span><strong>Le Jardin de Minuit</strong></div>
        <div><span>Équipe fictive</span><strong>Studio narratif</strong></div>
        <div><span>Étape simulée</span><strong>Soumis au Chef d’équipe</strong></div>
      </div>
      <p className="role-panel__note">Aucune affectation, décision ou transition de workflow n’est exécutée depuis cet aperçu.</p>
    </section>
  )
}

function TeamLeadProgressPanel({ finalValidationState }: { finalValidationState: FinalValidationState }) {
  return (
    <section className="role-panel team-lead-progress" aria-labelledby="team-lead-progress-title" data-workspace-region="progress">
      <header className="role-panel__header">
        <div><span className="sound-panel__index">02 · Trois axes distincts</span><h2 id="team-lead-progress-title">Progression</h2></div>
      </header>
      <div className="progress-axis-list">
        <article>
          <div><span>Doublage</span><strong>{100 * submittedProject.completedChapterCount / submittedProject.chapterCount} %</strong></div>
          <progress aria-label={`Doublage fictif : ${submittedProject.completedChapterCount} chapitres terminés sur ${submittedProject.chapterCount}`} value={submittedProject.completedChapterCount} max={submittedProject.chapterCount}>{submittedProject.completedChapterCount} sur {submittedProject.chapterCount}</progress>
          <p>{submittedProject.completedChapterCount} chapitres déclarés terminés sur {submittedProject.chapterCount} · données fictives</p>
        </article>
        <article>
          <div><span>Révision</span><strong>{submittedProject.obtainedValidations} / {expectedValidations}</strong></div>
          <progress aria-label={`Révision fictive : ${submittedProject.obtainedValidations} validations obtenues sur ${expectedValidations} attendues`} value={submittedProject.obtainedValidations} max={expectedValidations}>{submittedProject.obtainedValidations} sur {expectedValidations}</progress>
          <p>{submittedProject.obtainedValidations} validations obtenues sur {expectedValidations} attendues · données fictives</p>
          <p>{submittedProject.chapterCount} chapitres × {submittedProject.reviewerCount} Réviseurs = {expectedValidations} validations attendues</p>
        </article>
        <article className="progress-axis-list__final">
          <span>Validation finale</span>
          <strong>{finalValidationState}</strong>
          <p>État textuel fictif · aucun pourcentage global</p>
        </article>
      </div>
    </section>
  )
}

function TeamLeadHistoryPanel() {
  return (
    <section className="role-panel team-lead-history" aria-labelledby="team-lead-history-title" data-workspace-region="history">
      <header className="role-panel__header">
        <div><span className="sound-panel__index">05 · Journal fictif</span><h2 id="team-lead-history-title">Historique</h2></div>
      </header>
      <ol className="role-event-list">
        <li><span>Aujourd’hui · 09:42</span><strong>Projet soumis au Chef d’équipe</strong></li>
        <li><span>Aujourd’hui · 09:30</span><strong>30e validation fictive obtenue · 10 chapitres terminés, révision complète</strong></li>
        <li><span>Hier · 17:18</span><strong>21e validation fictive obtenue</strong></li>
        <li><span>12 août · 11:03</span><strong>Version de repérage conservée</strong></li>
      </ol>
      <p className="role-panel__note">Cet historique est une composition locale de démonstration.</p>
    </section>
  )
}

function TeamLeadCommentsPanel() {
  return (
    <section className="role-panel team-lead-comments" aria-labelledby="team-lead-comments-title" data-workspace-region="comments">
      <header className="role-panel__header">
        <div><span className="sound-panel__index">06 · Suivi fictif</span><h2 id="team-lead-comments-title">Commentaires</h2></div>
        <span className="fiction-chip fiction-chip--static">2 ouverts</span>
      </header>
      <ul className="role-comment-list">
        <li><strong>Chapitre 2 · Révision</strong><p>Clarifier le retour attendu avant un éventuel renvoi fictif.</p></li>
        <li><strong>Livre entier · Production</strong><p>Vérifier la cohérence du niveau général pendant la simulation.</p></li>
      </ul>
      <p className="role-panel__note">Aucun commentaire n’est créé, modifié ou résolu dans ce prototype.</p>
    </section>
  )
}

function TeamLeadFinalValidationPanel({ finalValidationState }: { finalValidationState: FinalValidationState }) {
  return (
    <section className="role-panel team-lead-validation" aria-labelledby="team-lead-validation-title" data-workspace-region="final-validation">
      <header className="role-panel__header">
        <div><span className="sound-panel__index">07 · Décision fictive</span><h2 id="team-lead-validation-title">Validation finale</h2></div>
        <span className="fiction-chip fiction-chip--static">Non exécutoire</span>
      </header>
      <dl className="role-definition-list">
        <div><dt>État présenté</dt><dd>{finalValidationState}</dd></div>
        <div><dt>Révision</dt><dd>{submittedProject.obtainedValidations} validations sur {expectedValidations}</dd></div>
      </dl>
      <div className="non-executive-actions" aria-label="Aperçu fictif des décisions finales">
        <button type="button" disabled>Valider le livre · simulation</button>
        <button type="button" disabled>Retour fictif vers Réviseur</button>
        <button type="button" disabled>Retour fictif vers Sound Designer</button>
      </div>
      <p className="role-panel__note">La préparation de la publication deviendra disponible après la validation finale du livre. Dans l’état présenté, elle reste entièrement absente.</p>
      <p className="role-panel__note">Ces formulations illustrent la hiérarchie future ; aucune validation ni aucun rejet n’est enregistré.</p>
    </section>
  )
}

function TeamLeadPublicationPanel() {
  return (
    <section className="role-panel team-lead-publication" aria-labelledby="team-lead-publication-title" data-workspace-region="publication-preparation">
      <header className="role-panel__header">
        <div><span className="sound-panel__index">08 · Jacques</span><h2 id="team-lead-publication-title">Préparation de la publication</h2></div>
        <span className="fiction-chip fiction-chip--static">Aperçu</span>
      </header>
      <div className="publication-readiness">
        <span>Destination fictive</span><strong>Boutique Jacques</strong>
        <span>État de démonstration</span><strong>Non prêt à publier</strong>
      </div>
      <button className="non-executive-primary" type="button" disabled>Préparer la publication dans Jacques · non exécutoire</button>
      <p className="role-panel__note">La validation finale et la publication restent deux actions distinctes. Le Chef d’équipe n’est pas présenté comme pouvant dépublier un livre.</p>
    </section>
  )
}

function TeamLeadWorkspace() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [historyOpen, setHistoryOpen] = useState(false)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const publicationPreparationAvailable = canShowPublicationPreparation(TEAM_LEAD_DEMO_FINAL_VALIDATION_STATE)

  useEffect(() => {
    if (!historyOpen) return
    const closeHistory = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setHistoryOpen(false)
      historyButtonRef.current?.focus()
    }
    window.addEventListener('keydown', closeHistory)
    return () => window.removeEventListener('keydown', closeHistory)
  }, [historyOpen])

  return (
    <div className="team-lead-workspace" aria-label="Workspace Chef d’équipe fictif">
      <TeamLeadDashboardPanel />
      <TeamLeadProgressPanel finalValidationState={TEAM_LEAD_DEMO_FINAL_VALIDATION_STATE} />
      <BookPanel activeWordIndex={activeWordIndex} chapterIndex={chapterIndex} page={page} />
      <SimulationControls
        id="team-lead-simulation-panel"
        activeWordIndex={activeWordIndex}
        chapterIndex={chapterIndex}
        historyOpen={historyOpen}
        page={page}
        setActiveWordIndex={setActiveWordIndex}
        setChapterIndex={setChapterIndex}
        setHistoryOpen={setHistoryOpen}
        setPage={setPage}
        historyButtonRef={historyButtonRef}
      />
      <aside className="team-lead-sidebar" aria-label="Pilotage Chef d’équipe fictif">
        <TeamLeadHistoryPanel />
        <TeamLeadCommentsPanel />
        <TeamLeadFinalValidationPanel finalValidationState={TEAM_LEAD_DEMO_FINAL_VALIDATION_STATE} />
        {publicationPreparationAvailable && <TeamLeadPublicationPanel />}
      </aside>
    </div>
  )
}

function AdminMembersPanel() {
  return (
    <section className="admin-panel admin-members" aria-labelledby="admin-members-title" data-workspace-region="members">
      <header className="role-panel__header">
        <div><span className="sound-panel__index">01 · Maison fictive</span><h2 id="admin-members-title">Membres</h2></div>
        <span className="fiction-chip fiction-chip--static">12 démos</span>
      </header>
      <ul className="admin-entity-list">
        <li><span className="admin-avatar" aria-hidden="true">AM</span><div><strong>Ana Martin</strong><span>Cheffe d’équipe · identité fictive</span></div><small>Active</small></li>
        <li><span className="admin-avatar" aria-hidden="true">YK</span><div><strong>Yanis Kader</strong><span>Sound Designer · identité fictive</span></div><small>Actif</small></li>
        <li><span className="admin-avatar" aria-hidden="true">LN</span><div><strong>Leïla Nassar</strong><span>Réviseuse · identité fictive</span></div><small>Active</small></li>
      </ul>
      <p className="role-panel__note">Aucun membre réel n’est invité, suspendu ou modifié.</p>
    </section>
  )
}

function AdminTeamsPanel() {
  return (
    <section className="admin-panel admin-teams" aria-labelledby="admin-teams-title" data-workspace-region="teams">
      <header className="role-panel__header"><div><span className="sound-panel__index">02 · Organisation locale</span><h2 id="admin-teams-title">Équipes</h2></div></header>
      <div className="admin-stat-grid">
        <article><strong>Studio narratif</strong><span>7 membres fictifs</span><small>3 projets de démonstration</small></article>
        <article><strong>Révision Minuit</strong><span>5 membres fictifs</span><small>2 projets de démonstration</small></article>
      </div>
      <p className="role-panel__note">Aucune équipe n’est créée, renommée ou affectée.</p>
    </section>
  )
}

function AdminInvitationsPanel() {
  return (
    <section className="admin-panel admin-invitations" aria-labelledby="admin-invitations-title" data-workspace-region="invitations">
      <header className="role-panel__header"><div><span className="sound-panel__index">03 · Accès fictifs</span><h2 id="admin-invitations-title">Invitations</h2></div><span className="fiction-chip fiction-chip--static">Démo locale</span></header>
      <div className="admin-invitation-preview"><span>2 invitations fictives en attente</span><strong>Aucun e-mail réel</strong></div>
      <button className="non-executive-primary" type="button" disabled>Aperçu d’invitation · action indisponible</button>
      <p className="role-panel__note">Aucune invitation n’est envoyée et aucune identité n’est créée.</p>
    </section>
  )
}

function AdminProjectsPanel() {
  return (
    <section className="admin-panel admin-projects" aria-labelledby="admin-projects-title" data-workspace-region="projects">
      <header className="role-panel__header"><div><span className="sound-panel__index">04 · Portefeuille fictif</span><h2 id="admin-projects-title">Projets</h2></div></header>
      <div className="admin-project-table" role="table" aria-label="Projets fictifs de la maison">
        <div role="row"><span role="columnheader">Projet</span><span role="columnheader">Équipe</span><span role="columnheader">Statut</span></div>
        <div role="row"><strong role="cell">Le Jardin de Minuit</strong><span role="cell">Studio narratif</span><small role="cell">{submittedProject.finalValidationState}</small></div>
        <div role="row"><strong role="cell">La Ville Haute</strong><span role="cell">Révision Minuit</span><small role="cell">Doublage</small></div>
      </div>
      <p className="role-panel__note">Données de management fictives ; aucun projet n’est créé, transféré ou publié.</p>
    </section>
  )
}

function AdminPermissionsPanel() {
  return (
    <section className="admin-panel admin-permissions" aria-labelledby="admin-permissions-title" data-workspace-region="permissions">
      <header className="role-panel__header"><div><span className="sound-panel__index">05 · Cadre simulé</span><h2 id="admin-permissions-title">Permissions</h2></div><span className="fiction-chip fiction-chip--static">Lecture seule</span></header>
      <dl className="role-definition-list">
        <div><dt>Administration du workspace</dt><dd>Aperçu autorisé</dd></div>
        <div><dt>Droits métier éditoriaux</dt><dd>Non accordés automatiquement</dd></div>
        <div><dt>Montage audio</dt><dd>Absent de cette interface</dd></div>
      </dl>
      <p className="role-panel__note">Aucune permission réelle n’est consultée, accordée ou retirée.</p>
    </section>
  )
}

function AdminAuditPanel() {
  return (
    <section className="admin-panel admin-audit" aria-labelledby="admin-audit-title" data-workspace-region="audit">
      <header className="role-panel__header"><div><span className="sound-panel__index">06 · Traces fictives</span><h2 id="admin-audit-title">Audit</h2></div></header>
      <ol className="role-event-list">
        <li><span>Aujourd’hui · 10:14</span><strong>Aperçu d’équipe consulté · donnée fictive</strong></li>
        <li><span>Hier · 16:02</span><strong>Invitation de démonstration préparée · non envoyée</strong></li>
        <li><span>12 août · 09:20</span><strong>Projet fictif ajouté au tableau de bord</strong></li>
      </ol>
      <p className="role-panel__note">Aucun événement réel ni identifiant sensible n’est journalisé.</p>
    </section>
  )
}

function PublishingHouseAdminWorkspace() {
  return (
    <div className="admin-workspace" aria-label="Workspace Admin Maison fictif">
      <AdminMembersPanel />
      <AdminTeamsPanel />
      <AdminInvitationsPanel />
      <AdminProjectsPanel />
      <AdminPermissionsPanel />
      <AdminAuditPanel />
    </div>
  )
}

export function ProjectPage({
  role,
  onRoleChange,
}: {
  role: SimulatedProjectRole
  onRoleChange: (role: SimulatedProjectRole) => void
}) {
  const presentation = simulatedRolePresentation[role]
  const workspace = role === 'sound-designer'
    ? <SoundDesignerWorkspace />
    : role === 'reviewer'
      ? <ReviewerWorkspace />
      : role === 'team-lead'
        ? <TeamLeadWorkspace />
        : <PublishingHouseAdminWorkspace />

  return (
    <div className="prototype-page project-workspace-page" data-simulated-role={role}>
      <header className="project-workspace-intro">
        <div className="project-workspace-heading">
          <span className="page-intro__eyebrow">Projet fictif · {presentation.label}</span>
          <h1 tabIndex={-1}>{presentation.title}</h1>
        </div>
        <p><strong>Le Jardin de Minuit</strong><span>Aucun EPUB ni média réel</span></p>
        <ProjectRoleSwitcher role={role} onRoleChange={onRoleChange} />
      </header>
      {workspace}
    </div>
  )
}
