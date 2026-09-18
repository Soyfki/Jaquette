# Checklist de validation — 0.4 Fixer corpus et budgets

Adaptation du [modèle](../CHECKLIST.md), contrôles fixés avant exécution le 18 septembre 2026. Tous sont obligatoires. Les résultats, commandes, horaires et SHA complets seront joints à la PR ; un état non exécuté reste BLOCKED.

## 1. Livraison testée

Branche `codex/etape-0-4-corpus-budgets`, départ main `f273b202d16476e075a827fb85d692b479ba8344`. Développeur et responsable de validation : agent Codex. Validateur matériel : utilisateur. Version applicative 0.0.0. Aucun importeur, moteur, stockage, Electron ou MCP livré.

## 2. Environnement et corpus

Clone neuf `.work-0-4/repo`, installation frozen Node 24.19.0 / pnpm 11.19.0 ; Chrome local et CI documentés séparément. Références : six ressources du manifeste inchangé ; charges synthétiques seed 20260918 ; fichiers personnels exclus. L'état du checkout initial et ses empreintes sont conservés hors Git dans `.work-0-4/evidence`.

## 3. Contrôles techniques

| ID | Commande / procédure | Attendu | Preuve attendue |
|---|---|---|---|
| T01 | installation frozen ; `pnpm validate:diagnostic` et `pnpm validate:all` | codes 0, lockfile et six références inchangés | logs, SHA, environnement |
| T02 | `pnpm test:measurement` | régénération identique ; corpus absent/altéré/incomplet et paramètres invalides refusés ; statistiques vérifiées | TAP |
| T03 | génération CI, nominale et forte logique ; vérification | comptages exacts, EPUB <=10 Mo, inventaire exhaustif, allocation logique distincte | manifests, logs |
| T04 | collecteur Windows sur poste accessible | inventaire réel autorisé, aucun numéro de série/adresse réseau/nom utilisateur | JSON et revue |
| T05 | collecteur macOS sur MI et M1 | commandes exécutables, inventaires réels, aucune donnée identifiante superflue | deux résultats natifs ; BLOCKED si postes absents |
| T06 | `pnpm measure:prototype` | parcours réduit build servi, 10 navigations et 100 interactions, statistiques, DOM, console et capture ; aucun PASS produit déduit | rapport, capture |
| T07 | contrat des 14 budgets et revue | valeurs figées, bornes précises, cache, stats, instrumentation, preuve, phase et prérequis | contrat et protocoles |
| T08 | CI au SHA final | socle 0.2 et tests du dispositif à success | run et artefact |

## 4. Contrôles matériels — utilisateur

| ID | Procédure | Attendu |
|---|---|---|
| H-W18 | lancer le paquet Windows, compléter le formulaire | identification du poste cible, relevé complet et conditions matérielles |
| H-MI | lancer le paquet macOS sur Intel, compléter le formulaire | relevé complet Intel natif et conditions |
| H-M1 | lancer le paquet macOS sur M1, compléter le formulaire | relevé complet Apple Silicon natif et conditions |

## 5. Régressions

| ID | Procédure | Attendu |
|---|---|---|
| R01 | diff, hashes avant/après, `git diff --check` | code applicatif, version, références, plan utilisateur, EPUB tests/ et branche historique préservés ; aucun gros binaire indexé |
| R02 | paquet extrait, intégrité, revue données, vérification des lanceurs sur OS accessible | sans installation ni Git ; aucune transmission automatique ; résultats incomplets signalés |

## 6. Problèmes et dettes

Un poste inaccessible ou une observation matérielle manquante ne peut être accepté comme dette. Aucune qualification de production des étapes 1 à 16 ne fait partie de cette campagne.

## 7. Synthèse

Voir [rapport](VALIDATION_REPORT.md). Règle : un obligatoire BLOCKED implique BLOQUÉE / NO-GO, sinon FAIL implique À CORRIGER / NO-GO, sinon tous PASS autorisent VALIDÉE / GO. Aucune fusion avant Go.

Campagne technique du 18 septembre au SHA `c3a7e7bd0dfb574aea13bbf97a5e296e3ea6c8b8` : T01/T02/T03/T04/T06/T07/T08/R01/R02 PASS ; T05/H-W18/H-MI/H-M1 BLOCKED. **9 PASS, 0 FAIL restant, 4 BLOCKED**. Commandes, résultats, reprises, preuves et limites dans le rapport. Responsable : agent Codex ; décision BLOQUÉE / NO-GO, sans dette acceptée.
