import type { MaterialSymbolName } from '../MaterialSymbol'

export type Navigate = (path: string) => void

export type RouteDefinition = {
  label: string
  path: string
  title: string
  icon: MaterialSymbolName
}

export const routes: RouteDefinition[] = [
  { label: 'Connexion', path: '/connexion', title: 'Connexion', icon: 'login' },
  { label: 'Accueil', path: '/accueil', title: 'Accueil', icon: 'home' },
  { label: 'Projet', path: '/projet', title: 'Projet', icon: 'book_2' },
  { label: 'Paramètres', path: '/parametres', title: 'Paramètres', icon: 'settings' },
]

export const foundationsRoute: RouteDefinition = {
  label: 'Fondations 1.1',
  path: '/fondations',
  title: 'Fondations',
  icon: 'palette',
}
