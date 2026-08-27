import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { FoundationsPage } from './App'
import { MaterialSymbol, type MaterialSymbolName } from './MaterialSymbol'
import { ProjectPage, type SimulatedProjectRole } from './ProjectPage'

type Navigate = (path: string) => void

type RouteDefinition = {
  label: string
  path: string
  title: string
  icon: MaterialSymbolName
}

const routes: RouteDefinition[] = [
  { label: 'Connexion', path: '/connexion', title: 'Connexion', icon: 'login' },
  { label: 'Accueil', path: '/accueil', title: 'Accueil', icon: 'home' },
  { label: 'Projet', path: '/projet', title: 'Projet', icon: 'book_2' },
  { label: 'Paramètres', path: '/parametres', title: 'Paramètres', icon: 'settings' },
]

const foundationsRoute: RouteDefinition = {
  label: 'Fondations 1.1',
  path: '/fondations',
  title: 'Fondations',
  icon: 'palette',
}

const projectRoleLabels: Record<SimulatedProjectRole, string> = {
  'sound-designer': 'Sound Designer',
  reviewer: 'Réviseur',
  'team-lead': 'Chef d’équipe',
  'publishing-house-admin': 'Admin Maison',
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
      <span className="nav-link__marker" aria-hidden="true">
        <MaterialSymbol name={route.icon} />
      </span>
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

function CurrentPage({
  path,
  navigate,
  projectRole,
  setProjectRole,
}: {
  path: string
  navigate: Navigate
  projectRole: SimulatedProjectRole
  setProjectRole: (role: SimulatedProjectRole) => void
}) {
  switch (path) {
    case '/connexion': return <ConnectionPage navigate={navigate} />
    case '/accueil': return <HomePage navigate={navigate} />
    case '/projet': return <ProjectPage role={projectRole} onRoleChange={setProjectRole} />
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
  const [projectRole, setProjectRole] = useState<SimulatedProjectRole>('sound-designer')
  const [projectMenuOpen, setProjectMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const projectMenuButtonRef = useRef<HTMLButtonElement>(null)
  const projectMenuRef = useRef<HTMLElement>(null)

  const navigate: Navigate = (nextPath) => {
    setProjectMenuOpen(false)
    if (nextPath === path) return
    if (nextPath === '/projet') setProjectRole('sound-designer')
    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizePath(window.location.pathname)
      if (nextPath === '/projet') setProjectRole('sound-designer')
      setPath(nextPath)
    }
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

  useEffect(() => {
    if (!projectMenuOpen) return
    projectMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setProjectMenuOpen(false)
      projectMenuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [projectMenuOpen])

  return (
    <div className={path === '/projet' ? 'app-shell app-shell--project' : 'app-shell'}>
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <header className="app-header">
        <div className="app-header__start">
          {path === '/projet' && (
            <button
              ref={projectMenuButtonRef}
              className="project-menu-button"
              type="button"
              aria-expanded={projectMenuOpen}
              aria-controls="project-navigation"
              aria-label={projectMenuOpen ? 'Fermer la navigation générale' : 'Ouvrir la navigation générale'}
              onClick={() => setProjectMenuOpen((open) => !open)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          )}
          <InternalBrand navigate={navigate} />
          {path === '/projet' && (
            <span className="project-header-context">
              Atelier {projectRoleLabels[projectRole]} · rôle simulé
            </span>
          )}
        </div>
        <span className="prototype-badge"><span aria-hidden="true" />Prototype local</span>
      </header>
      {path === '/projet' ? (
        projectMenuOpen && (
          <aside id="project-navigation" className="project-navigation-popover" ref={projectMenuRef}>
            <nav aria-label="Navigation principale">
              <span className="nav-heading">Écrans</span>
              <div className="nav-list">
                {routes.map((route) => <RouteLink key={route.path} route={route} currentPath={path} navigate={navigate} />)}
              </div>
            </nav>
            <nav className="secondary-nav" aria-label="Ressources du prototype">
              <span className="nav-heading">Ressources</span>
              <RouteLink route={foundationsRoute} currentPath={path} navigate={navigate} className="nav-link--secondary" />
            </nav>
            <p className="shell-version">Jaquette · 0.0.0</p>
          </aside>
        )
      ) : (
        <aside className="app-sidebar">
          <nav aria-label="Navigation principale">
            <span className="nav-heading">Écrans</span>
            <div className="nav-list">
              {routes.map((route) => <RouteLink key={route.path} route={route} currentPath={path} navigate={navigate} />)}
            </div>
          </nav>
          <nav className="secondary-nav" aria-label="Ressources du prototype">
            <span className="nav-heading">Ressources</span>
            <RouteLink route={foundationsRoute} currentPath={path} navigate={navigate} className="nav-link--secondary" />
          </nav>
          <p className="shell-version">Jaquette · 0.0.0</p>
        </aside>
      )}
      <main
        id="main-content"
        className={
          path === '/fondations'
            ? 'app-main app-main--foundations'
            : path === '/projet'
              ? 'app-main app-main--project'
              : 'app-main'
        }
        tabIndex={-1}
        ref={mainRef}
      >
        <CurrentPage
          path={path}
          navigate={navigate}
          projectRole={projectRole}
          setProjectRole={setProjectRole}
        />
      </main>
    </div>
  )
}
