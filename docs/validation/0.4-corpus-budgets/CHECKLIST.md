# Checklist de validation — 0.4 Fixer corpus et budgets

Adaptation du [modèle](../CHECKLIST.md), contrôles fixés avant exécution le 18 septembre 2026. Périmètre révisé le 22 septembre par [décision utilisateur D04-03](../../measurement/DECISIONS.md) : dix contrôles obligatoires pour 0.4 ; trois contrôles Mac reportés explicitement. Les résultats, commandes, horaires et SHA complets sont joints à la PR ; aucun contrôle non exécuté ne devient PASS.

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
| T06 | `pnpm measure:prototype` | parcours réduit build servi, 10 navigations et 100 interactions, statistiques, DOM, console et capture ; aucun PASS produit déduit | rapport, capture |
| T07 | contrat des 14 budgets et revue | valeurs figées, bornes précises, cache, stats, instrumentation, preuve, phase et prérequis | contrat et protocoles |
| T08 | CI au SHA final | socle 0.2 et tests du dispositif à success | run et artefact |

## 4. Contrôles matériels — utilisateur

| ID | Procédure | Attendu |
|---|---|---|
| H-W18 | lancer le paquet Windows, compléter le formulaire | identification du poste cible, relevé complet et conditions matérielles |

### Contrôles reportés à la qualification macOS — D04-03

T05 (exécution native des collecteurs), H-MI et H-M1 restent obligatoires avant validation macOS. Ils ne comptent plus dans le Go 0.4 ; aucun relevé réel ni PASS Mac n'est revendiqué. Leurs procédures, résultats attendus et formulaire sont conservés dans la [décision](../../measurement/DECISIONS.md) et la [matrice](../../measurement/MACHINES.md).

## 5. Régressions

| ID | Procédure | Attendu |
|---|---|---|
| R01 | diff, hashes avant/après, `git diff --check` | code applicatif, version, références, plan utilisateur, EPUB tests/ et branche historique préservés ; aucun gros binaire indexé |
| R02 | paquet extrait, intégrité, revue données, vérification des lanceurs sur OS accessible | sans installation ni Git ; aucune transmission automatique ; résultats incomplets signalés |

## 6. Problèmes et dettes

Une observation obligatoire manquante ne peut être acceptée comme dette. D04-03 est un report de jalon explicitement autorisé pour les seuls Mac ; H-W18 reste obligatoire. Aucune qualification de production des étapes 1 à 16 ne fait partie de cette campagne.

## 7. Synthèse

Voir [rapport](VALIDATION_REPORT.md). Règle : un obligatoire BLOCKED implique BLOQUÉE / NO-GO, sinon FAIL implique À CORRIGER / NO-GO, sinon tous PASS autorisent VALIDÉE / GO. Aucune fusion avant Go.

Historique du 18 septembre au SHA `c3a7e7bd0dfb574aea13bbf97a5e296e3ea6c8b8` : 9 PASS et 4 BLOCKED sur treize contrôles. Après D04-03 : dix obligatoires, **9 PASS techniques de référence, 0 FAIL ouvert, 1 BLOCKED (H-W18)** ; trois contrôles Mac reportés, sans PASS. Les contrôles affectés et la CI sont rejoués au dernier SHA et consignés dans la PR. Responsable : agent Codex ; décision BLOQUÉE / NO-GO tant que H-W18 manque.
