import { useEffect, useRef, useState } from 'react'
import type { SimulatedProjectRole } from '../project/demoData'
import { routes, foundationsRoute, type Navigate } from './routes'

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

export function useShellNavigation() {
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

  return { path, projectRole, setProjectRole, projectMenuOpen, setProjectMenuOpen, mainRef, projectMenuButtonRef, projectMenuRef, navigate }
}
