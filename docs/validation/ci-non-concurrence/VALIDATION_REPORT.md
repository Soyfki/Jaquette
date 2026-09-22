# Validation — dernière exécution CI par PR ou branche

Adaptation du [modèle](../VALIDATION_REPORT.md). Correctif autonome demandé le 22 septembre 2026 ; [PR 13](https://github.com/Soyfki/Jaquette/pull/13), branche `codex/ci-latest-run`, base `f273b202d16476e075a827fb85d692b479ba8344`. Développeur et responsable de validation : agent Codex. Aucun essai humain requis pour ce correctif. Version 0.0.0, aucune dépendance ni fonction applicative modifiée.

La [checklist](CHECKLIST.md) a été fixée avant lancement GitHub. CI01 à CI04 conditionnent le Go de fusion ; CI05 vérifie le résultat sur main. Les observations et conclusions signées, SHA complets, liens des runs et artefacts sont publiés dans la PR au moment de chaque résultat, sans créer de commit uniquement pour inscrire son propre SHA. Ce document décrit la campagne ; il ne présume aucun résultat non exécuté.

| Contrôle | Méthode et preuve |
|---|---|
| CI01 | Revue de la clé : numéro de PR stable malgré les SHA successifs ; ref complète hors PR ; nom de workflow pour isoler les groupes |
| CI02 | Run du premier commit encore actif, puis push de la documentation finale ; vérifier `cancelled` pour l'ancien et `success` pour le dernier dans GitHub |
| CI03 | CI vierge Node 24.19.0 / pnpm 11.19.0, références canoniques, Chrome réel, diagnostic et campagne complète au dernier SHA |
| CI04 | `check:links`, `check:secrets`, `git diff --check`, revue du diff ; absence de modification de src, lockfile, version ou fichiers personnels |
| CI05 | Squash avec SHA de tête attendu, vérification `merged=true`, présence sur origin/main, CI push main dont les E2E |

Les permissions restent `contents: read`. Les anciens résultats terminés restent consultables jusqu'à leur expiration normale ; l'annulation ne transforme pas un ancien run en PASS. Aucune qualification de W18/MI/M1 ni acquisition du lot 0.4 n'est déduite de ce correctif.

Règle de décision : tous les contrôles avant fusion PASS autorisent GO ; un FAIL donne À CORRIGER, un BLOCKED donne BLOQUÉE. CI05 reste obligatoire après la fusion. Les défauts et reprises sont conservés dans le [rapport de défaut](BUG_REPORT.md) et la PR.
