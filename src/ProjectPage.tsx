import type { CSSProperties, ReactNode } from 'react'

type TrackFamily = {
  name: 'SFX' | 'Ambiance' | 'Musique'
  example: string
  description: string
  token: string
  icon: ReactNode
}

const trackFamilies: TrackFamily[] = [
  {
    name: 'SFX',
    example: 'Pas dans le gravier',
    description: 'Déclenchement futur sur un mot précis',
    token: '--color-track-sfx',
    icon: <SparkIcon />,
  },
  {
    name: 'Ambiance',
    example: 'Jardin après la pluie',
    description: 'Atmosphère future sur une plage de mots',
    token: '--color-track-ambience',
    icon: <WavesIcon />,
  },
  {
    name: 'Musique',
    example: 'Thème de l’heure bleue',
    description: 'Narration musicale future liée au texte',
    token: '--color-track-music',
    icon: <MusicIcon />,
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

function LibraryPanel() {
  return (
    <section
      className="sound-panel sound-library"
      aria-labelledby="sound-library-title"
      data-workspace-region="library"
    >
      <header className="sound-panel__header">
        <div>
          <span className="sound-panel__index">01</span>
          <h2 id="sound-library-title">Bibliothèque</h2>
        </div>
        <span className="passive-status">Aucun dossier</span>
      </header>
      <p className="sound-panel__description">
        Les sons locaux seront organisés ici. Aucun dossier réel n’est indexé dans ce prototype.
      </p>
      <ul className="track-family-list" aria-label="Exemples fictifs des familles audio">
        {trackFamilies.map((track) => (
          <li
            key={track.name}
            className="track-family"
            data-project-track={track.name}
            style={{ '--track-color': `var(${track.token})` } as CSSProperties}
          >
            <span className="track-family__icon" role="img" aria-label={`Pictogramme ${track.name}`}>
              {track.icon}
            </span>
            <span className="track-family__copy">
              <strong>{track.name}</strong>
              <span>{track.example}</span>
              <small>{track.description}</small>
            </span>
            <span className="fiction-chip">Fictif</span>
          </li>
        ))}
      </ul>
      <p className="sound-panel__footnote">Présentation passive · aucune recherche, préécoute ou action disponible</p>
    </section>
  )
}

function BookPanel() {
  return (
    <section
      className="sound-panel sound-book"
      aria-labelledby="sound-book-title"
      data-workspace-region="book"
    >
      <header className="sound-panel__header sound-book__header">
        <div>
          <span className="sound-panel__index">02 · Timeline textuelle</span>
          <h2 id="sound-book-title">Livre</h2>
        </div>
        <span className="passive-status passive-status--attention">Aucun EPUB chargé</span>
      </header>
      <article className="project-book-page" aria-label="Page de livre fictive non éditable">
        <header className="project-book-page__header">
          <span>Chapitre fictif 01</span>
          <span>Prototype non éditable</span>
        </header>
        <div className="project-book-page__content">
          <span className="project-book-page__kicker">Le Jardin de Minuit · contenu fictif</span>
          <h3>L’heure bleue</h3>
          <p>
            À l’instant où la ville retenait son souffle, Alma poussa la grille du jardin.
            Sous ses pas, le gravier humide racontait un chemin que personne n’avait emprunté
            depuis l’hiver.
          </p>
          <p>
            Les feuilles frémirent au-dessus d’elle. Quelque part derrière les murs, une cloche
            très douce sembla répondre à la pluie.
          </p>
          <aside className="text-timeline-note" aria-label="Principe de la timeline textuelle">
            <span className="text-timeline-note__icon"><CursorIcon /></span>
            <p><strong>Le texte sera la timeline.</strong> Les sons s’attacheront aux mots, jamais à une échelle en secondes.</p>
          </aside>
        </div>
        <footer className="project-book-page__footer">Page fictive · 01</footer>
      </article>
      <p className="book-empty-note">
        Aucun EPUB réel n’est chargé. Ce court passage sert uniquement à montrer une page claire,
        lisible et non éditable.
      </p>
    </section>
  )
}

function InspectorPanel() {
  return (
    <section
      className="sound-panel sound-inspector"
      aria-labelledby="sound-inspector-title"
      data-workspace-region="inspector"
    >
      <header className="sound-panel__header">
        <div>
          <span className="sound-panel__index">03</span>
          <h2 id="sound-inspector-title">Inspecteur audio</h2>
        </div>
      </header>
      <div className="inspector-empty">
        <span className="inspector-empty__icon"><SlidersIcon /></span>
        <strong>Aucune occurrence sélectionnée</strong>
        <p>Les réglages apparaîtront après la sélection future d’un son associé au texte.</p>
      </div>
      <div className="setting-preview" aria-label="Aperçu passif des réglages futurs">
        <span>Niveau &amp; source</span>
        <span>Boucle &amp; fondus</span>
        <span>Ducking &amp; espace</span>
      </div>
      <p className="sound-panel__footnote">Catégories indicatives · aucun réglage actif</p>
    </section>
  )
}

function SimulationPanel() {
  return (
    <section
      className="sound-panel sound-simulation"
      aria-labelledby="sound-simulation-title"
      data-workspace-region="simulation"
    >
      <div className="simulation-heading">
        <span className="simulation-heading__mark" aria-hidden="true"><CursorIcon /></span>
        <div>
          <span className="sound-panel__index">04 · Contrôle</span>
          <h2 id="sound-simulation-title">Simulation</h2>
        </div>
      </div>
      <div className="simulation-status" aria-label="État de la simulation">
        <span aria-hidden="true" />
        <strong>Inactive</strong>
      </div>
      <p>Indisponible dans ce prototype. Aucun son n’est joué et aucun contrôle de lecture n’est simulé.</p>
      <span className="simulation-principle">Lecture future guidée par l’avancement dans le texte</span>
    </section>
  )
}

export function ProjectPage() {
  return (
    <div className="prototype-page project-workspace-page">
      <header className="project-workspace-intro">
        <div>
          <span className="page-intro__eyebrow">Projet entièrement fictif · Sound Designer</span>
          <h1 tabIndex={-1}>Le livre attend sa scène.</h1>
        </div>
        <p>
          <strong>Le Jardin de Minuit</strong> est un projet de démonstration vide : aucun livre,
          média ou réglage réel n’est chargé.
        </p>
      </header>
      <div className="sound-workspace" aria-label="Workspace Sound Designer fictif">
        <LibraryPanel />
        <BookPanel />
        <InspectorPanel />
        <SimulationPanel />
      </div>
    </div>
  )
}
