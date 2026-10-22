# T-73 — contrat expérimental du noyau

Le [plan canonique T-73](https://tickets.soyfki.com/tickets/T-73) décrit cette tranche
R&D : une commande d'ajout d'occurrence reçoit des identifiants logiques, vérifie
les références et droits contextuels, puis demande un commit conditionnel.
Elle ne dépend ni du DOM ni de React et ne modifie jamais le texte ou les sources.

## Frontières

Le noyau est dans `src/core`. La structure textuelle globale et le catalogue de
médias restent dans la section commune ; le delta ajoute une occurrence à un seul
chapitre. Les identifiants sont opaques, conservés sans normalisation, et l'ordre
des mots vient de la projection logique. Ce code ne crée pas les ancres EPUB.

Le port d'accès reçoit un acteur fourni par l'hôte. La commande ne choisit ni son
acteur ni ses permissions. Chaque commit recontrôle le droit du chapitre, la
révision et l'annulation avant d'écrire. Une révision périmée est refusée ; aucun
rejeu automatique n'est fait après une écriture au résultat incertain.

Le port audio décrit une disponibilité de fixture. Il ne joue ni ne transforme de
son. Les SFX peuvent être placés plusieurs fois sur une plage ; la limite de trois
SFX simultanés relève du futur moteur de lecture. Une musique chevauchante et une
édition de chapitre avec validations actives sont explicitement hors de cette
tranche, sans adoption d'une nouvelle règle produit.

## Deux adaptateurs minimaux

| Adaptateur | Preuve possible | Limite |
|---|---|---|
| Web en mémoire | Commit, enveloppe de fixture, reconstruction et conservation des identifiants | Pas de stockage navigateur durable |
| Façade Desktop et host Node de test | Même oracle via un fichier temporaire réellement relu après fermeture du host | Pas Electron ni preload/IPC de production |

`jaquette-contract-fixture` est une enveloppe de test JSON, pas un format
`.jacq`, `.chpt` ou une décision de version/sérialisation de production.
Le host ne reçoit aucun chemin dans les commandes : seules les identités de sa
fixture sont admises, dans un répertoire temporaire fourni par le harness.
Ses appels sont sérialisés dans une instance de host. Il ne garantit pas un
verrou interprocessus, la résistance à un attaquant modifiant le répertoire,
l'atomicité sur crash, le quota ou la sauvegarde physique partielle.
Une erreur pendant l'écriture est `outcome-unknown`, jamais une annulation
prétendument sans effet. Il faut relire avant toute décision de reprise.

Les snapshots retournés sont détachés. Les données de fixture invalides ou de
références incohérentes sont refusées. Une importation Web refusée préserve l'état.
Le host de test refuse un fichier symbolique plutôt que de le suivre.

## Oracles et reproduction

| Oracle | Contrôle |
|---|---|
| O73-01 | Compilation core sans DOM/types ambiants, suite Node et inspection transitive des imports |
| O73-02 | Même corpus d'entrées invalides pour Web et Desktop, zéro commit/audio sur refus |
| O73-03 | Acteur/scopes invalides, droit révoqué avant commit, absence d'effet |
| O73-04 | Objets gelés, texte/commun/autre chapitre inchangés |
| O73-05 | Même oracle paramétré sur deux factories, seconde frontière de fichier réelle |
| O73-06 | Reconstruction des adaptateurs, IDs et liens exacts, fixture corrompue refusée |
| O73-07 | Révision périmée, annulation, indisponibilité et résultat de transport incertain |
| O73-08 | IDs de capacités inconnus, absence de chemin libre et graphe Web sans disque/IPC |

Le contrôle négatif d'adaptateur non conforme est vérifié par TypeScript avec
`@ts-expect-error`. Un mutant qui régénère l'identifiant d'occurrence est rejeté
par le même oracle de round-trip utilisé sur les deux adaptateurs.

```sh
pnpm typecheck
pnpm exec vitest run src/core src/adapters --maxWorkers=1
pnpm lint
pnpm test
pnpm test:tooling
pnpm test:e2e
pnpm validate:all
```

`typecheck` inclut désormais `tsconfig.core.json` sans DOM. Vitest conserve les
suites UI et leur setup existant ; le projet contracts utilise Node et un setup
de diagnostics sans testing-library. Aucune assertion ni timeout UI n'est retiré.

Le verdict et les résultats au SHA testé sont dans le rapport AT et les artefacts
`test-results/tickets/T-73/<SHA>-<UTC>/`. Un GO est limité aux contrats observés ;
un échec d'oracle implique NO-GO documenté, sans transformer un rapport en
fonctionnalité livrée. Les garanties physiques de T-74, l'hôte réel T-75 et les
schémas T-76 restent ouverts. La version applicative reste 0.0.0.
