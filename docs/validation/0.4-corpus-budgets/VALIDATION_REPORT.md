# Rapport de validation — 0.4 Fixer corpus et budgets

Adaptation du [modèle](../VALIDATION_REPORT.md). Branche `codex/etape-0-4-corpus-budgets`, base `f273b202d16476e075a827fb85d692b479ba8344`. Le dernier SHA réellement testé et ses preuves seront publiés dans la PR, sans commit circulaire pour inscrire son propre SHA.

[PR 12](https://github.com/Soyfki/Jaquette/pull/12), ouverte en brouillon et non fusionnée. **SHA de qualification initiale : `c3a7e7bd0dfb574aea13bbf97a5e296e3ea6c8b8`**. Les preuves du 18 septembre ci-dessous restent historiques. La reprise D04-04 modifie aussi le contrat exécutable, ses tests et le paquet de relevé ; les résultats rejoués et le dernier SHA testé sont consignés dans la PR.

## D04-04 du 22 septembre 2026 — état courant

Nouvelle décision explicite : **développement uniquement sur W18, Mac uniquement M1, essais M1 uniquement aux phases finales 14 à 16 après J3 ; Intel retiré**. Elle remplace D04-03, qui exigeait encore Mac dès 1.3. Les critères précoces du plan, le cahier des charges, AGENTS, le contrat exécutable, la matrice et le paquet de relevé sont harmonisés. L'absence de M1 ou d'Intel ne peut pas empêcher le PASS de 0.4 ou d'une étape de développement.

T05 est désormais le collecteur natif M1 réservé aux tests finaux ; H-M1 est reporté aux mêmes phases ; H-MI est hors périmètre. Aucun de ces contrôles n'est compté dans les dix obligatoires de 0.4, aucun PASS Mac n'est revendiqué. H-W18 reste le seul blocage matériel, indépendant de cette décision : observations physiques déclarées inconnues. Les derniers résultats techniques, SHA complet et nouvel artefact du paquet sont consignés dans la PR 12 après le rejeu.

Le générateur et les quatorze seuils restent inchangés. Le contrat de plateformes, les tests du contrat, la sélection de poste et le formulaire changent : leurs preuves antérieures ne suffisent pas et sont rejouées. Les empreintes de paquet ci-dessous décrivent l'historique du 18 septembre ; le nouveau paquet W18/M1 a sa propre empreinte publiée dans la PR. Conclusion actuelle : BLOQUÉE / NO-GO uniquement pour H-W18, sans aucun obstacle Mac. 0.5 non commencée. Responsable : agent Codex.

## Premier report du 22 septembre 2026 — historique D04-03

L'utilisateur ne possède aucun Mac et a explicitement choisi le report des relevés MI/M1 à la qualification macOS : [D04-03](../../measurement/DECISIONS.md). T05/H-MI/H-M1 sont désormais hors du Go 0.4 ; leurs résultats historiques BLOCKED ne deviennent pas PASS. Les deux cibles et les contrôles natifs demeurent obligatoires avant validation macOS.

Pour les conditions W18 demandées (écran/Hz, audio et son entendu, Bluetooth, alimentation/économie, activité), l'utilisateur répond « Inconnu pour tout ». Le retour est enregistré sans inventer une observation. L'identification W18 et l'inventaire technique sont acquis ; **H-W18 reste BLOCKED**.

Périmètre à cette date : **dix obligatoires, neuf contrôles techniques à requalifier au dernier SHA, un BLOCKED H-W18** ; trois contrôles Mac reportés. Les preuves du dernier SHA et de la CI sont actualisées dans la PR 12. Le corpus, les quatorze seuils, les collecteurs et le paquet restent inchangés par cette première reprise documentaire. La correction CI avec annulation des runs obsolètes est isolée dans la PR 13, puis intégrée sans modifier les exigences matérielles.

Décision à cette date : **BLOQUÉE / NO-GO** pour 0.4, aucune fusion de la PR 12 ni début de 0.5. Responsable : agent Codex, 22 septembre 2026. La campagne et la conclusion suivantes sont l'historique du 18 septembre et conservent leur périmètre initial.

## Livraison et participants

Contrat de mesure, générateur de charge, vérificateurs et collecteurs. Version 0.0.0 ; aucune dépendance métier ajoutée. Développeur et responsable de validation : agent Codex ; observations matérielles : utilisateur. Campagne du 18 septembre 2026. La [checklist](CHECKLIST.md) fixe les contrôles avant exécution.

## Résultats

Campagne locale au SHA de qualification : **18 septembre 2026, 12:39:22–12:44:58 UTC**, Windows 10.0.19045 x64, Node 24.19.0, pnpm 11.19.0, Chrome 152.0.7977.84. Installation initiale neuve : 241 paquets téléchargés, aucun node_modules transféré ; campagne finale frozen utilisant ce store inchangé. Arbre propre au départ et à la fin, lockfile/manifeste inchangés. Les résultats historiques ne remplacent pas ce rejeu.

| ID | Commande / observation | Statut | Preuve |
|---|---|---|---|
| T01 | `pnpm install --frozen-lockfile --offline --store-dir ../pnpm-store`, `prepare:references`, `validate:diagnostic`, `validate:all` : codes 0 ; 54 composants, 28 outillage historique, 13 dispositif, 28 E2E ; aucun ignoré | PASS | summary.json, logs et e2e.json de la campagne locale ; CI |
| T02 | `pnpm test:measurement` : identiques à seed égale, différente à autre seed ; manque/troncature/octet/extra/manifeste réécrit refusés ; espace/allocation/écrasement contrôlés, statistiques exactes | PASS | 13 tests, zéro échec/skip |
| T03 | génération et vérification nominal/strong logiques avec `node --max-old-space-size=128 scripts/measurement/corpus.mjs` : nombres exacts ; EPUB 16 046 / 50 953 octets ; aucun octet audio matérialisé dans ces deux séries | PASS | manifests et verify JSON ; modes used/banque réelle réduits exercés par tests |
| T04 | collecteur Windows PowerShell 5.1 puis copie empaquetée : code 0 ; RAM installée 16 Gio, CPU/OS/GPU/disques réels, aucune série/coordonnée réseau | PASS | [relevé daté W18](../../measurement/MACHINES.md), deux JSON natifs hors Git |
| T05 | MI et M1 inaccessibles ; syntaxe Bash et erreurs JXA simulées contrôlées, sans prétendre une exécution native | BLOCKED | B04-MAC ; résultats natifs attendus |
| T06 | `pnpm measure:prototype` : dix navigations, dix échauffements puis cent changements de rôle, DOM attendu, zéro warning/erreur console/page, capture et trace | PASS | report.json, prototype.png et prototype-trace.zip |
| T07 | quatorze contrats complets, protocole précis chacun, prérequis/phases, revue ciblée sans écriture et corrections consignées | PASS | contract.mjs, PROTOCOLS.md, BUG_REPORT.md |
| T08 | [CI au SHA qualifié](https://github.com/Soyfki/Jaquette/actions/runs/35345789367) : toutes étapes success ; Chrome 153.0.8010.52, Ubuntu 24.04, mêmes Node/pnpm ; deux campagnes complètes et smoke | PASS | [artefact](https://github.com/Soyfki/Jaquette/actions/runs/35345789367/artifacts/10546787002), 13 298 001 octets, expiration 2 octobre 2026 |
| R01 | dix empreintes utilisateur conservées, checkout historique intact ; aucun changement src/, version, lockfile ni manifeste canonique ; diff-check code 0 | PASS | preservation.json et diff |
| R02 | zip généré puis extrait, six SHA-256 conformes ; collecteur Windows empaqueté exécuté ; page HTML offline, téléchargement JSON, aucun appel distant ; syntaxe lanceur Mac vérifiée | PASS | package.log, collecte native, tests 12/13 ; T05 reste distinct |

Mesures **du dispositif réduit uniquement** : navigation locale médiane 406,85 ms, p95/max 602,4 ms (n=10) ; clic→deuxième rAF médiane 26,1 ms, p95 28,3 ms, max 35 ms (n=100). Cache OS chaud, headless, agent présent, build servi localement : ces chiffres **ne sont PAS B01/B04** et ne qualifient ni entrée OS ni écran physique. La capture a été relue : rôle Sound Designer actif, prototype fictif identifiable, aucun manuscrit personnel. Les tests E2E habituels servent Vite dev, build compilé séparément.

Paquet `jaquette-releve-0.4.zip` : **8 496 octets**, SHA-256 `30bdbe6659b9d0b49318210850ea94ac97dbab2201a26163aa22c633a16dcf7b`, identique local/CI. Les collecteurs n'envoient rien. Les validations historiques des six ressources sont réutilisées uniquement après vérification des mêmes octets ; aucun futur importeur Jaquette n'est validé.

Preuves locales : `.work-0-4/evidence/final-c3a7e7bd0dfb574aea13bbf97a5e296e3ea6c8b8-143922/`, manifestes nominal/strong et preservation.json dans `.work-0-4/evidence/`, rapport/capture dans `test-results/measurement-prototype/c3a7e7bd0dfb574aea13bbf97a5e296e3ea6c8b8-1789735474009/`. L'artefact CI contient les journaux, captures et paquet, sans références canoniques ni données personnelles. Empreinte artefact : `sha256:d56d99ac51bf9f08bba2ddb36a5fae275545cf921ddeaaae7824ab9a1916c2f5`.

La présence d'un protocole n'est pas une performance observée. Les budgets du futur produit sont planifiés avec prérequis, hors campagne 0.4. Aucun essai de huit heures, sortie audio réelle, import/sauvegarde ou E/S sur 1 To n'est revendiqué.

## Contrôles humains — historique du 18 septembre

H-W18 : identité du poste confirmée par l'utilisateur et relevé technique acquis ; observations de sortie audio, écran actif/Hz, secteur/économie, maintenance connue et activité restent BLOCKED. H-MI et H-M1 : BLOCKED jusqu'aux relevés et observations. T05 : BLOCKED sans exécution macOS native. Aucune dette acceptée. Les trois cibles sont conservées. Le [formulaire prêt](../../../scripts/measurement/FORMULAIRE.md) limite la reprise à ces observations et aux collecteurs des postes inaccessibles ; aucune installation ni manipulation Git demandée.

## Simulations de décision

Tous les obligatoires PASS → VALIDÉE ; un FAIL sans BLOCKED → À CORRIGER ; un BLOCKED → BLOQUÉE et jamais VALIDÉE.

## Conclusion historique du 18 septembre

**BLOQUÉE / NO-GO** : relevés et observations matériels obligatoires manquants. PR à conserver en brouillon et non fusionnée. 0.4 non acquise ; 0.5 non commencée. L'ancien 1.4.2 reste acquis depuis 0.3, sans clôture de l'ancienne phase 1.

Treize contrôles obligatoires de checklist : **9 PASS, 0 FAIL ouvert, 4 BLOCKED** (T05, H-W18, H-MI, H-M1). Les FAIL initiaux restent dans l'historique ; aucun seuil n'a été relevé pour les corriger. Décisions : D04-01 adopte les cibles, D04-02 précise le plateau mémoire avant implémentation. Aucune décision de format/stockage/backend prise, aucune dette admissible invoquée pour les postes manquants.

Signature : agent Codex, développeur et responsable de validation, 18 septembre 2026. Le Go reste conditionné aux résultats complets du dernier SHA ; l'utilisateur transmet les observations, il n'a pas à choisir la décision.
