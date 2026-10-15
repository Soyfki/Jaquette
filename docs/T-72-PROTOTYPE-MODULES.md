# Prototype : modules internes et durée de vie

T-72 / JQ-03 extrait les contrôleurs du prototype sans ajouter de fonction produit.
Le plan canonique et les preuves sont conservés sur [le ticket AT](https://tickets.soyfki.com/tickets/T-72).

| Module | Responsabilité et propriétaire de l'état |
|---|---|
| `ProjectPage.tsx` | Façade des quatre rôles, composition des workspaces et panneaux existants. Un seul workspace monté. |
| `project/demoData.ts` | Rôles et chapitres fictifs ; aucun schéma de projet persistant. |
| `project/SimulationControls.tsx` | Vue des contrôles, identifiants et libellés existants. |
| `project/useDemoSimulation.ts` | Transport, vitesse et timeout appartenant au composant de simulation. |
| `project/useSoundDesignerPanels.ts` | Panneaux, tiroir exclusif, focus et listeners appartenant au workspace Sound Designer. |
| `project/useMediaQuery.ts` | Abonnement media-query, retiré au démontage. |
| `Shell.tsx` | DOM, pages, liens et gardes de clic du shell. |
| `shell/routes.ts`, `shell/useShellNavigation.ts` | Routes et contrôleur URL/rôle/menu/focus du shell. |

Fermer la simulation détruit transport/vitesse et efface mot/historique ; chapitre
et page du workspace restent conservés. Fermer la bibliothèque détruit ses états
locaux. Changer de rôle démonte l'ancien workspace ; aucune simulation ni sélection
de fichier ne survit au retour. Le rôle reste simulé et ne crée aucune permission.
Les effets possèdent leur cleanup, y compris sous StrictMode. Aucun store global,
routeur, moteur audio ou format de persistance n'est introduit.

Les tests `src/project/lifecycle.test.tsx` caractérisent aussi le comportement de
la base avant extraction. Les tests existants de rôles, navigation, breakpoint,
focus, cadence et fin de simulation restent applicables. Les ressources possédées
par l'application sont distinguées des temporisations internes de jsdom/React.

## Comparaison visuelle automatique

Préparer un checkout propre et indépendant au SHA de base, puis y installer ses
dépendances verrouillées. Depuis le checkout candidat :

```sh
node scripts/compare-prototype-roots.mjs --baseline-root <checkout-base> --output-dir test-results/tickets/T-72/visual
```

Le lanceur réserve strictement 127.0.0.1:4174 et :4175 ; une collision échoue sans
réutiliser ni fermer un serveur existant. Il ferme ses propres instances Vite après
la comparaison, même en cas d'échec. Les deux checkouts doivent disposer de leurs
dépendances ; aucun téléchargement, checkout ou installation n'est fait par ce script.

Le comparateur utilise le même Chrome, les polices locales chargées, deux viewports
(1440×1000 et 768×1024), dark/reduced-motion et un pointeur au même endroit. Il attend
deux captures consécutives identiques avant chaque comparaison. Les 14 états couvrent
les quatre rôles, menu, historique et tiroirs. Les sept variantes locales Manrope,
Literata et Noto Naskh Arabic sont explicitement chargées et contrôlées ; une police
manquante rend l'essai non qualifiant, même si le navigateur utilise un fallback.
Géométries, attributs (dont chemins SVG), texte et styles calculés
de tous les éléments du body et de leurs pseudo-éléments doivent être exactement
égaux, sans tolérance ni suppression de propriétés. Seule l'origine de chargement
est normalisée. Les profils complets compressés et leurs hashes sont conservés.
Un carré synthétique ajouté au rendu doit être rejeté ;
son image est identifiée comme fixture. Aucun attendu n'est généré depuis le candidat.

L'égalité des PNG reste un diagnostic distinct, pas le verdict : les premiers essais
Windows ont produit des écarts même en comparant deux fois la même base. Leur cause
exacte n'est pas établie. Le contrôle positif base/base doit réussir sur les profils
de rendu et le contrôle négatif doit détecter le carré synthétique. Aucun seuil de
performance produit n'est modifié ni aucune égalité de pixels revendiquée.

`context.json` identifie les SHA et la propreté des deux arbres ; `comparison.json`
conserve navigateur/environnement, états, hashes et verdicts. Une interruption ou une
capture instable est inconclusive. Les sources, dépendances, polices et paramètres
doivent être les mêmes entre les campagnes réutilisées. Les captures ne remplacent
ni les assertions de comportement ni l'observation humaine groupée à l'atelier.

Le comparateur peut aussi utiliser deux serveurs déjà préparés par l'opérateur :

```sh
node scripts/compare-prototype.mjs --baseline-url http://127.0.0.1:4174 --candidate-url http://127.0.0.1:4175 --output-dir test-results/tickets/T-72/visual
```

Ce mode ne gère pas leur durée de vie. Les scripts refusent une origine distante ou
la même origine pour les deux versions. Les quatre rôles et livres restent fictifs ;
aucune écoute physique ou capacité EPUB/audio n'est qualifiée par cette comparaison.
