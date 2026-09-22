# Checklist — CI non concurrente

Correctif demandé le 22 septembre 2026, indépendant des relevés matériels du lot 0.4. Adaptation du [modèle](../CHECKLIST.md), fixée avant la campagne GitHub. Base main : `f273b202d16476e075a827fb85d692b479ba8344`. Branche : `codex/ci-latest-run`. Version : 0.0.0. Aucun essai humain requis pour ce correctif de CI.

| ID | Scénario | Résultat attendu |
|---|---|---|
| CI01 | Revue du groupe workflow + numéro de PR, ou ref de branche hors PR | Groupe stable entre commits d'une PR/branche ; groupes distincts pour autres PR, branches et workflows |
| CI02 | Deux pushes successifs sur la PR, premier run encore actif | Premier run annulé automatiquement, dernier exécuté ; aucune file de versions obsolètes |
| CI03 | Campagne complète sur le dernier SHA de PR | Tous les contrôles du socle réussis, artefact associé au SHA |
| CI04 | Diff, liens, secrets, dépendances et version | Aucun changement applicatif ou de dépendance, aucun fichier personnel, checks code 0 |
| CI05 | Après squash, origine main et CI du SHA fusionné | Merge vérifié, commit présent sur origin/main, CI main et E2E réussis |

Les exécutions terminées restent dans l'historique avec leurs preuves. La non-concurrence concerne les runs actifs/en attente du même groupe. Aucun ajout de permission d'écriture Actions, aucune suppression d'artefact historique. Le contrat suit la [documentation GitHub](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).

Les résultats et SHA réellement testés seront consignés dans la PR pour éviter un commit circulaire. Un résultat absent reste BLOCKED ; FAIL ou BLOCKED interdit le Go du correctif. CI05 est le contrôle obligatoire après fusion. Les critères matériels 0.4 restent distincts.

Extension avant le rejeu du 22 septembre : après l'échec d'acquisition constaté, CI03 exige également les sept scénarios de téléchargement français et l'acquisition réelle de l'archive canonique française. Les six attentes de manifeste et la vérification des fichiers présents restent strictes.
