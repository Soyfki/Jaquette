# Checklist de validation — 0.4 Fixer corpus et budgets

Adaptation du [modèle](../CHECKLIST.md), contrôles fixés avant exécution le 18 septembre 2026. Périmètre courant fixé avant rejeu par [D04-04 du 22 septembre](../../measurement/DECISIONS.md), remplaçant D04-03 : dix contrôles obligatoires W18/dispositif pour 0.4. T05 et H-M1 sont réservés aux phases finales 14 à 16 ; H-MI est retiré. L'absence de M1 ou d'Intel ne peut pas donner FAIL/BLOCKED pour ce lot. Les résultats, commandes, horaires et SHA complets sont joints à la PR ; aucun test Mac non exécuté ne devient PASS.

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

### M1 réservé aux phases finales ; Intel hors périmètre — D04-04

T05 concerne désormais uniquement l'exécution native du collecteur sur M1 ; H-M1 concerne son relevé et ses conditions physiques. Ils ne sont exigibles qu'en 14 à 16, après J3. H-MI est retiré du périmètre actif. Aucun Mac, Safari réel ou installateur Mac n'est requis pour le PASS de 0.4. Procédures finales dans la [décision](../../measurement/DECISIONS.md), la [matrice](../../measurement/MACHINES.md) et le formulaire ; historique conservé sans PASS anticipé.

## 5. Régressions

| ID | Procédure | Attendu |
|---|---|---|
| R01 | diff, hashes avant/après, `git diff --check` | code applicatif, version, références, plan utilisateur, EPUB tests/ et branche historique préservés ; aucun gros binaire indexé |
| R02 | paquet extrait, intégrité, revue données, vérification des lanceurs sur OS accessible | sans installation ni Git ; aucune transmission automatique ; résultats incomplets signalés |

## 6. Problèmes et dettes

Une observation obligatoire manquante ne peut être acceptée comme dette. D04-04 change explicitement les cibles et le calendrier Mac ; H-W18 reste obligatoire. Aucune qualification de production des étapes 1 à 16 ne fait partie de cette campagne.

## 7. Synthèse

Voir [rapport](VALIDATION_REPORT.md). Règle : un obligatoire BLOCKED implique BLOQUÉE / NO-GO, sinon FAIL implique À CORRIGER / NO-GO, sinon tous PASS autorisent VALIDÉE / GO. Aucune fusion avant Go.

Historique du 18 septembre au SHA `c3a7e7bd0dfb574aea13bbf97a5e296e3ea6c8b8` : 9 PASS et 4 BLOCKED sur treize contrôles. Périmètre D04-04 : dix obligatoires, **9 PASS techniques de référence, 0 FAIL ouvert, 1 BLOCKED (H-W18)** ; T05/H-M1 réservés aux phases finales, H-MI retiré. Les contrôles affectés (contrat, page/formulaire/paquet, liens et cohérence du plan) et la CI sont rejoués au dernier SHA et consignés dans la PR. Responsable : agent Codex ; aucun blocage Mac du Go 0.4.
