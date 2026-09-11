# Décision d’implémentation 0001 — Socle Web de la démonstration 1.1

- Statut : retenue pour l’ancienne sous-étape 1.1, révisable
- Portée historique : les numéros de cette décision visent l’ancien plan. Chrome décrit la campagne du prototype ; Electron hors de ce lot ne signifie pas après lancement. Voir le [plan actif](../../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md).
- Date : 2026-08-23
- Version de l’application : `0.0.0`

## Contexte

La sous-étape 1.1 doit produire une page de design system réellement exécutable dans Chrome. Le dépôt ne possédait auparavant ni application, ni dépendance, ni gestionnaire de paquets imposé. Cette décision ne crée aucune règle métier et pourra être réévaluée lorsque les besoins des phases suivantes seront mieux connus.

## Choix

- React 19.2.8 pour composer une démonstration en composants et préparer les interactions testables sans introduire de framework applicatif plus large.
- TypeScript 5.9.3 en mode strict pour vérifier le socle statiquement.
- Vite 8.2.2 pour le serveur de développement et le build Web ciblant les navigateurs modernes.
- pnpm 11.19.0, fixé par le champ `packageManager`, avec `pnpm-lock.yaml` pour une installation reproductible.
- CSS natif et propriétés personnalisées pour centraliser couleurs, familles typographiques, rayons, espacements et transitions sans bibliothèque UI.
- Fontsource pour embarquer Manrope, Literata et Noto Naskh Arabic dans le build sans requête vers un service de polices à l’exécution.
- Vitest et Testing Library pour les tests unitaires/de composants, ESLint pour le lint, et Playwright pilotant le canal `chrome` pour les contrôles de chargement, console, responsive et clavier.

## Justification

Ce socle est suffisamment petit pour 1.1, tout en restant compatible avec une application amenée à gagner en complexité, des tests automatisés et un futur renderer Electron. Aucun monorepo, backend, stockage, shell définitif ou infrastructure distante n’est introduit.

La recommandation d’architecture plus large présente dans le cahier des charges n’est pas activée à ce stade : son utilité devra être démontrée avant d’ajouter une structure de monorepo ou des packages métier.

## Commandes principales

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
corepack pnpm validate
corepack pnpm test:e2e
corepack pnpm build
```

Le serveur de développement écoute uniquement sur `127.0.0.1`. La cible de test end-to-end est Google Chrome installé localement.

## Conséquences et décisions ouvertes

- Le choix d’une bibliothèque de composants définitive reste ouvert ; la sous-étape 1.1 utilise des composants locaux simples.
- La stratégie de structure applicative au-delà de cette page était laissée ouverte jusqu’à l’ancienne 1.2 (navigation, décision 0002), distincte de la nouvelle 1.2 consacrée au stockage.
- La stratégie Electron reste hors périmètre et ne découle pas automatiquement du présent choix.
- Les seuils détaillés de contraste et la matrice complète d’accessibilité devront être formalisés au fur et à mesure que les écrans métier apparaîtront.
