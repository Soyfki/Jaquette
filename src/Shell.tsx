import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { FoundationsPage } from './App'

type Navigate = (path: string) => void

type RouteDefinition = {
  label: string
  path: string
  title: string
  marker: string
}

const routes: RouteDefinition[] = [
  { label: 'Connexion', path: '/connexion', title: 'Connexion', marker: 'CO' },
  { label: 'Accueil', path: '/accueil', title: 'Accueil', marker: 'AC' },
  { label: 'Projet', path: '/projet', title: 'Projet', marker: 'PR' },
  { label: 'Paramètres', path: '/parametres', title: 'Paramètres', marker: 'PA' },
]

const foundationsRoute: RouteDefinition = {
  label: 'Fondations 1.1',
  path: '/fondations',
  title: 'Fondations',
  marker: 'F1',
}

function normalizePath(pathname: string) {
  if (pathname === '/') return pathname
  return pathname.replace(/\/+$/, '') || '/'
}

function initialPath() {
  const path = normalizePath(window.location.pathname)
  if (path === '/') {
    window.history.replaceState(null, '', '/accueil')
    return '/accueil'
  }
  return path
}

function RouteLink({
  route,
  currentPath,
  navigate,
  className = '',
}: {
  route: RouteDefinition
  currentPath: string
  navigate: Navigate
  className?: string
}) {
  const isCurrent = currentPath === route.path

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    navigate(route.path)
  }

  return (
    <a
      className={`nav-link ${className}`.trim()}
      href={route.path}
      aria-current={isCurrent ? 'page' : undefined}
      onClick={handleClick}
    >
      <span className="nav-link__marker" aria-hidden="true">{route.marker}</span>
      <span>{route.label}</span>
      {isCurrent && <span className="nav-link__current">Écran actif</span>}
    </a>
  )
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="page-intro">
      <span className="page-intro__eyebrow">{eyebrow}</span>
      <h1 tabIndex={-1}>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

function ConnectionPage({ navigate }: { navigate: Navigate }) {
  return (
    <div className="prototype-page prototype-page--connection">
      <PageIntro
        eyebrow="Prototype local · données fictives"
        title="Entrez dans l’atelier Jaquette"
        description="Cette porte d’entrée présente uniquement la navigation du prototype. Aucun compte réel, identifiant ou secret n’est demandé ni conservé."
      />
      <section className="entry-card" aria-labelledby="entry-title">
        <div className="entry-card__mark" aria-hidden="true">J</div>
        <div>
          <span className="prototype-label">Accès de démonstration</span>
          <h2 id="entry-title">Atelier Minuit</h2>
          <p>Workspace fictif préparé pour parcourir les quatre écrans du shell.</p>
        </div>
        <button className="button button--primary" type="button" onClick={() => navigate('/accueil')}>
          Entrer dans le prototype <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  )
}

function HomePage({ navigate }: { navigate: Navigate }) {
  return (
    <div className="prototype-page">
      <PageIntro
        eyebrow="Atelier Minuit · workspace fictif"
        title="Bonjour, Noémie."
        description="Un aperçu volontairement léger du futur espace de travail. Les informations ci-dessous sont démonstratives et ne sont pas enregistrées."
      />
      <section className="workspace-strip" aria-label="Résumé du workspace fictif">
        <div><span>Équipe</span><strong>Studio narratif</strong></div>
        <div><span>Projet actif</span><strong>1 prototype</strong></div>
        <div><span>Dernière activité</span><strong>Aujourd’hui</strong></div>
      </section>
      <section className="home-grid" aria-labelledby="recent-title">
        <article className="project-preview">
          <div className="project-preview__cover" aria-hidden="true"><span>JM</span></div>
          <div className="project-preview__content">
            <span className="prototype-label">Projet fictif · exploration</span>
            <h2 id="recent-title">Le Jardin de Minuit</h2>
            <p>Une carte de repérage pour valider la hiérarchie du shell avant la construction du workspace métier.</p>
            <button className="text-action" type="button" onClick={() => navigate('/projet')}>
              Ouvrir l’état du projet <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
        <aside className="principle-card" aria-label="Principe central de Jaquette">
          <span className="principle-card__index">01</span>
          <p>Le texte est la timeline de Jaquette.</p>
          <span>Les outils audio arriveront dans les prochaines sous-étapes.</span>
        </aside>
      </section>
    </div>
  )
}

function ProjectPage() {
  return (
    <div className="prototype-page">
      <PageIntro
        eyebrow="Projet fictif · Le Jardin de Minuit"
        title="Le livre attend sa scène."
        description="Cet écran valide uniquement la place du projet dans le shell principal. Aucun livre ni média n’est importé."
      />
      <section className="empty-state" aria-labelledby="empty-state-title">
        <div className="empty-state__visual" aria-hidden="true">
          <span>Le texte</span>
          <i /><i /><i />
        </div>
        <div className="empty-state__copy">
          <span className="prototype-label">Prochaine sous-étape · 1.3</span>
          <h2 id="empty-state-title">Le workspace Sound Designer sera construit ici.</h2>
          <p>La bibliothèque, le livre, l’inspecteur et les contrôles de simulation ne font pas partie de cette livraison.</p>
        </div>
      </section>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="prototype-page">
      <PageIntro
        eyebrow="Prototype local · sans persistance"
        title="Paramètres du prototype"
        description="Ces repères décrivent l’environnement actuel sans créer de compte cloud, de permissions ou de préférences persistantes."
      />
      <section className="settings-list" aria-label="Configuration locale démonstrative">
        <article>
          <span className="settings-list__icon" aria-hidden="true">◐</span>
          <div><h2>Apparence</h2><p>Mode sombre Jaquette, page du livre claire.</p></div>
          <span className="status-chip">Actif</span>
        </article>
        <article>
          <span className="settings-list__icon settings-list__icon--letters" aria-hidden="true">Aa</span>
          <div><h2>Typographies</h2><p>Manrope pour l’interface, Literata pour le livre.</p></div>
          <span className="prototype-label">Local</span>
        </article>
        <article>
          <span className="settings-list__icon" aria-hidden="true">⌁</span>
          <div><h2>Données</h2><p>Aucune préférence ni information de connexion n’est stockée.</p></div>
          <span className="prototype-label">Prototype</span>
        </article>
      </section>
    </div>
  )
}

function NotFoundPage({ navigate }: { navigate: Navigate }) {
  return (
    <div className="prototype-page prototype-page--not-found">
      <PageIntro
        eyebrow="Erreur 404"
        title="Cet écran n’existe pas."
        description="L’adresse demandée ne correspond à aucune destination de ce prototype."
      />
      <button className="button button--primary" type="button" onClick={() => navigate('/accueil')}>
        Revenir à l’accueil
      </button>
    </div>
  )
}

function CurrentPage({ path, navigate }: { path: string; navigate: Navigate }) {
  switch (path) {
    case '/connexion': return <ConnectionPage navigate={navigate} />
    case '/accueil': return <HomePage navigate={navigate} />
    case '/projet': return <ProjectPage />
    case '/parametres': return <SettingsPage />
    case '/fondations': return <FoundationsPage />
    default: return <NotFoundPage navigate={navigate} />
  }
}

function InternalBrand({ navigate }: { navigate: Navigate }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault()
      navigate('/accueil')
    }
  }

  return (
    <a className="brand" href="/accueil" aria-label="Jaquette, aller à l’accueil" onClick={handleClick}>
      <span className="brand__mark" aria-hidden="true">J</span>
      <span>Jaquette</span>
    </a>
  )
}

export function AppShell() {
  const [path, setPath] = useState(initialPath)
  const mainRef = useRef<HTMLElement>(null)

  const navigate: Navigate = (nextPath) => {
    if (nextPath === path) return
    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const route = [...routes, foundationsRoute].find((candidate) => candidate.path === path)
    document.title = `Jaquette — ${route?.title ?? 'Écran introuvable'}`
    const frame = window.requestAnimationFrame(() => {
      mainRef.current?.querySelector<HTMLElement>('h1')?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [path])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <header className="app-header">
        <InternalBrand navigate={navigate} />
        <span className="prototype-badge"><span aria-hidden="true" />Prototype local</span>
      </header>
      <aside className="app-sidebar">
        <nav aria-label="Navigation principale">
          <span className="nav-heading">Écrans</span>
          <div className="nav-list">
            {routes.map((route) => (
              <RouteLink key={route.path} route={route} currentPath={path} navigate={navigate} />
            ))}
          </div>
        </nav>
        <nav className="secondary-nav" aria-label="Ressources du prototype">
          <span className="nav-heading">Ressources</span>
          <RouteLink
            route={foundationsRoute}
            currentPath={path}
            navigate={navigate}
            className="nav-link--secondary"
          />
        </nav>
        <p className="shell-version">Jaquette · 0.0.0</p>
      </aside>
      <main
        id="main-content"
        className={path === '/fondations' ? 'app-main app-main--foundations' : 'app-main'}
        tabIndex={-1}
        ref={mainRef}
      >
        <CurrentPage path={path} navigate={navigate} />
      </main>
    </div>
  )
}
