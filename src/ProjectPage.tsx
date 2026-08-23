import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type TrackName = 'SFX' | 'Ambiance' | 'Musique'
type AudioFolder = { name: string; files: string[] }
type LibraryFamily = { name: TrackName; token: string; icon: ReactNode; folders: AudioFolder[] }

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

function LibraryPanel() {
  const [query, setQuery] = useState('')
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

  return (
    <section className="sound-panel sound-library" aria-labelledby="sound-library-title" data-workspace-region="library">
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

function BookPanel({ chapterIndex, page }: { chapterIndex: number; page: number }) {
  const chapter = chapters[chapterIndex]
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
          {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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

function InspectorPanel() {
  return (
    <section className="sound-panel sound-inspector" aria-labelledby="sound-inspector-title" data-workspace-region="inspector">
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
  chapterIndex,
  historyOpen,
  page,
  setChapterIndex,
  setHistoryOpen,
  setPage,
  historyButtonRef,
}: {
  chapterIndex: number
  historyOpen: boolean
  page: number
  setChapterIndex: (value: number) => void
  setHistoryOpen: (value: boolean) => void
  setPage: (value: number) => void
  historyButtonRef: React.RefObject<HTMLButtonElement | null>
}) {
  const chapter = chapters[chapterIndex]
  const moveChapter = (next: number) => {
    setChapterIndex(next)
    setPage(1)
  }
  return (
    <section className="sound-panel sound-controls" aria-labelledby="sound-controls-title" data-workspace-region="simulation">
      <div className="controls-title">
        <div><span className="sound-panel__index">04 · Navigation fictive</span><h2 id="sound-controls-title">Simulation/Contrôles</h2></div>
        <span className="simulation-status" aria-label="État de la simulation"><span aria-hidden="true" /><strong>Inactive</strong></span>
      </div>
      <div className="book-navigation" aria-label="Navigation fictive du livre">
        <button type="button" className="icon-button" aria-label="Chapitre précédent" disabled={chapterIndex === 0} onClick={() => moveChapter(chapterIndex - 1)}>←</button>
        <label className="chapter-select">Chapitre
          <select value={chapterIndex} onChange={(event) => moveChapter(Number(event.target.value))}>
            {chapters.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
          </select>
        </label>
        <button type="button" className="icon-button" aria-label="Chapitre suivant" disabled={chapterIndex === chapters.length - 1} onClick={() => moveChapter(chapterIndex + 1)}>→</button>
        <label className="page-slider" htmlFor="book-page-slider">Page fictive
          <input id="book-page-slider" type="range" min="1" max={chapter.pages} value={page} onChange={(event) => setPage(Number(event.target.value))} />
        </label>
        <output className="page-output" htmlFor="book-page-slider" aria-live="polite">Page {page} sur {chapter.pages}</output>
        <button ref={historyButtonRef} type="button" className="history-button" aria-expanded={historyOpen} aria-controls="project-history" onClick={() => setHistoryOpen(!historyOpen)}>Historique</button>
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

export function ProjectPage() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [historyOpen, setHistoryOpen] = useState(false)
  const historyButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const closeHistory = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !historyOpen) return
      setHistoryOpen(false)
      historyButtonRef.current?.focus()
    }
    window.addEventListener('keydown', closeHistory)
    return () => window.removeEventListener('keydown', closeHistory)
  }, [historyOpen])

  return (
    <div className="prototype-page project-workspace-page">
      <header className="project-workspace-intro">
        <div><span className="page-intro__eyebrow">Projet fictif · Sound Designer</span><h1 tabIndex={-1}>Le livre attend sa scène.</h1></div>
        <p><strong>Le Jardin de Minuit</strong><span>Aucun EPUB ni média réel</span></p>
      </header>
      <div className="sound-workspace" aria-label="Workspace Sound Designer fictif">
        <LibraryPanel />
        <BookPanel chapterIndex={chapterIndex} page={page} />
        <InspectorPanel />
        <SimulationControls
          chapterIndex={chapterIndex}
          historyOpen={historyOpen}
          page={page}
          setChapterIndex={setChapterIndex}
          setHistoryOpen={setHistoryOpen}
          setPage={setPage}
          historyButtonRef={historyButtonRef}
        />
      </div>
    </div>
  )
}
