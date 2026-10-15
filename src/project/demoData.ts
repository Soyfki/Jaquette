export type SimulatedProjectRole = 'sound-designer' | 'reviewer' | 'team-lead' | 'publishing-house-admin'

export const simulatedRoleOptions: ReadonlyArray<{ value: SimulatedProjectRole; label: string }> = [
  { value: 'sound-designer', label: 'Sound Designer' },
  { value: 'reviewer', label: 'Réviseur' },
  { value: 'team-lead', label: 'Chef d’équipe' },
  { value: 'publishing-house-admin', label: 'Admin Maison' },
]

export const simulatedRolePresentation: Record<SimulatedProjectRole, { label: string; title: string }> = {
  'sound-designer': { label: 'Sound Designer', title: 'Le livre attend sa scène.' },
  reviewer: { label: 'Réviseur', title: 'Le livre passe en révision.' },
  'team-lead': { label: 'Chef d’équipe', title: 'Le projet garde son cap.' },
  'publishing-house-admin': { label: 'Admin Maison', title: 'La maison organise ses équipes.' },
}

export const chapters = [
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
