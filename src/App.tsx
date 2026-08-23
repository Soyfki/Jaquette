import { useState, type CSSProperties, type ReactNode } from 'react'

type SwatchDefinition = {
  name: string
  token: string
  value: string
  textTone?: 'dark' | 'light'
}

type TrackDefinition = {
  name: 'SFX' | 'Ambiance' | 'Musique'
  token: string
  description: string
  icon: ReactNode
  iconName: string
}

const generalPalette: SwatchDefinition[] = [
  { name: 'Fond / noir', token: '--color-background', value: '#1B1B3A' },
  { name: 'Texte / blanc', token: '--color-text', value: '#EFF2FF', textTone: 'dark' },
  { name: 'Accent', token: '--color-accent', value: '#FFDFB2', textTone: 'dark' },
  { name: 'Secondaire', token: '--color-secondary', value: '#74A4BC', textTone: 'dark' },
  { name: 'Validation', token: '--color-validation', value: '#CFF2EC', textTone: 'dark' },
]

const tracks: TrackDefinition[] = [
  {
    name: 'SFX',
    token: '--color-track-sfx',
    description: 'Impact précis sur un mot',
    iconName: 'Étincelle',
    icon: <SparkIcon />,
  },
  {
    name: 'Ambiance',
    token: '--color-track-ambience',
    description: 'Atmosphère sur une plage',
    iconName: 'Ondes',
    icon: <WavesIcon />,
  },
  {
    name: 'Musique',
    token: '--color-track-music',
    description: 'Narration musicale continue',
    iconName: 'Note de musique',
    icon: <MusicIcon />,
  },
]

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
    </svg>
  )
}

function WavesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8c2.2-2 4.2-2 6 0s3.8 2 6 0 4.2-2 6 0" />
      <path d="M3 12c2.2-2 4.2-2 6 0s3.8 2 6 0 4.2-2 6 0" />
      <path d="M3 16c2.2-2 4.2-2 6 0s3.8 2 6 0 4.2-2 6 0" />
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V5l10-2v13" />
      <ellipse cx="6" cy="18" rx="3" ry="2.2" />
      <ellipse cx="16" cy="16" rx="3" ry="2.2" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  )
}

function Swatch({ definition }: { definition: SwatchDefinition }) {
  const style = {
    '--swatch-color': `var(${definition.token})`,
  } as CSSProperties

  return (
    <li className={`swatch swatch--${definition.textTone ?? 'light'}`} style={style}>
      <span className="swatch__sample" aria-hidden="true" />
      <span className="swatch__meta">
        <strong>{definition.name}</strong>
        <code>{definition.value}</code>
      </span>
    </li>
  )
}

function TrackIcon({ track }: { track: TrackDefinition }) {
  return (
    <span className="track-icon" aria-label={track.iconName} role="img">
      {track.icon}
    </span>
  )
}

export function FoundationsPage() {
  const [activeFilter, setActiveFilter] = useState('Tous')

  return (
    <div className="foundations-page">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__eyebrow">Design system de base</div>
          <div className="hero__layout">
            <div className="hero__copy">
              <h1 id="hero-title">La voix du livre commence ici.</h1>
              <p>
                Une fondation visuelle calme et expressive pour associer le son au texte,
                sans jamais perdre le fil de la lecture.
              </p>
              <div className="hero__actions" aria-label="Accès aux sections des fondations">
                <a className="button button--primary" href="#palette-title">
                  Explorer les fondations
                  <span className="button__icon"><ArrowIcon /></span>
                </a>
                <a className="button button--secondary" href="#book-title">
                  Voir la page du livre
                </a>
                <button className="button button--secondary" type="button" disabled>
                  Action indisponible
                </button>
              </div>
            </div>

            <aside className="hero__note" aria-label="Principe produit central">
              <span className="hero__note-index">01</span>
              <p>Le texte est la timeline de Jaquette.</p>
              <span className="hero__note-line" aria-hidden="true" />
            </aside>
          </div>
        </section>

        <section className="section" aria-labelledby="palette-title">
          <div className="section-heading">
            <div>
              <span className="section-heading__index">01 — Fondations</span>
              <h2 id="palette-title">Palette générale</h2>
            </div>
            <p>Les couleurs produit sont centralisées dans des tokens uniques et réutilisables.</p>
          </div>
          <ul className="swatch-grid" aria-label="Couleurs générales">
            {generalPalette.map((definition) => (
              <Swatch key={definition.token} definition={definition} />
            ))}
          </ul>
        </section>

        <section className="section" aria-labelledby="components-title">
          <div className="section-heading">
            <div>
              <span className="section-heading__index">02 — Composants</span>
              <h2 id="components-title">Un langage précis, une forme douce</h2>
            </div>
            <p>Capsules, focus net et libellés explicites rendent chaque action immédiatement lisible.</p>
          </div>

          <div className="component-grid">
            <article className="component-card component-card--controls">
              <span className="component-card__label">Champ &amp; tag</span>
              <label className="field">
                <span className="field__label">Rechercher dans les sons</span>
                <span className="field__control">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6" />
                    <path d="m16 16 4 4" />
                  </svg>
                  <input type="search" placeholder="Pluie, pas, forêt…" />
                </span>
              </label>
              <span className="tag">
                <span aria-hidden="true">✦</span>
                Favori
              </span>
            </article>

            <article className="component-card component-card--filters">
              <span className="component-card__label">Filtres</span>
              <div className="filter-list" aria-label="Filtrer les types de pistes">
                {['Tous', 'SFX', 'Ambiance', 'Musique'].map((filter) => (
                  <button
                    className="filter"
                    type="button"
                    key={filter}
                    aria-pressed={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <p className="filter-result" aria-live="polite">
                Filtre actif : <strong>{activeFilter}</strong>
              </p>
            </article>
          </div>
        </section>

        <section className="section" aria-labelledby="tracks-title">
          <div className="section-heading">
            <div>
              <span className="section-heading__index">03 — Pistes</span>
              <h2 id="tracks-title">Trois familles, trois signatures</h2>
            </div>
            <p>Une couleur fixe, un pictogramme et un libellé distinguent toujours chaque piste.</p>
          </div>
          <div className="track-grid">
            {tracks.map((track) => (
              <article
                className={`track-card track-card--${track.name.toLowerCase()}`}
                key={track.name}
                style={{ '--track-color': `var(${track.token})` } as CSSProperties}
                data-track={track.name}
              >
                <TrackIcon track={track} />
                <div>
                  <h3>{track.name}</h3>
                  <p>{track.description}</p>
                </div>
                <span className="track-card__rail" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="semantic-title">
          <div className="section-heading">
            <div>
              <span className="section-heading__index">04 — États</span>
              <h2 id="semantic-title">Retour clair, contexte juste</h2>
            </div>
            <p>Le succès s’adapte au fond ; l’erreur associe couleur, icône et message.</p>
          </div>
          <div className="semantic-grid">
            <article className="semantic-card semantic-card--dark">
              <span className="semantic-icon" aria-hidden="true">✓</span>
              <div>
                <h3>Succès sur fond sombre</h3>
                <p>Version enregistrée</p>
                <code>#83B692</code>
              </div>
            </article>
            <article className="semantic-card semantic-card--light">
              <span className="semantic-icon" aria-hidden="true">✓</span>
              <div>
                <h3>Succès sur fond clair</h3>
                <p>Chapitre validé</p>
                <code>#355A40</code>
              </div>
            </article>
            <article className="semantic-card semantic-card--error" role="alert">
              <span className="semantic-icon" aria-hidden="true">!</span>
              <div>
                <h3>Erreur</h3>
                <p>Média introuvable</p>
                <code>#A20021</code>
              </div>
            </article>
          </div>
        </section>

        <section className="section section--book" aria-labelledby="book-title">
          <div className="section-heading">
            <div>
              <span className="section-heading__index">05 — Lecture</span>
              <h2 id="book-title">La page reste la lumière</h2>
            </div>
            <p>Literata porte le texte, tandis qu’un vrai fallback serif assure une lecture arabe naturelle.</p>
          </div>

          <article className="book-page" aria-label="Exemple de page de livre">
            <header className="book-page__header">
              <span>Chapitre I</span>
              <span>La traversée</span>
            </header>
            <div className="book-page__content">
              <p className="book-page__dropcap">
                La pluie s’était tue. Sur le pont encore humide, les pas de Phileas Fogg
                semblaient mesurer la distance qui le séparait déjà de Londres.
              </p>
              <blockquote>
                « Le monde ne se découvre pas en le regardant passer, mais en prêtant
                attention à ce qu’il murmure. »
              </blockquote>

              <div className="annotation-sample" aria-label="Annotations audio associées au passage">
                {tracks.map((track) => (
                  <div
                    className="annotation-rail"
                    key={track.name}
                    style={{ '--track-color': `var(${track.token})` } as CSSProperties}
                  >
                    <TrackIcon track={track} />
                    <span>{track.name}</span>
                    <span className="annotation-rail__line" aria-hidden="true" />
                  </div>
                ))}
              </div>

              <div className="arabic-sample" lang="ar" dir="rtl">
                <span className="arabic-sample__label">مثال باللغة العربية</span>
                <p>كان البحر هادئًا، وكانت الكلمات تسير مع ضوء الصباح.</p>
              </div>
            </div>
            <footer className="book-page__footer" aria-label="Page 14">14</footer>
          </article>
        </section>
    </div>
  )
}
