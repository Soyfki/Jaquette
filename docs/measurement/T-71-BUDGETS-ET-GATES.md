# JQ-02 / T-71 — budgets et portes de qualification

## D71-01 — séparation approuvée, 6 octobre 2026

Cette décision de T-69/T-71 formalise les portes futures. Elle ne transforme aucun budget en mesure obtenue et ne valide pas rétrospectivement 0.4. Le [plan AT](https://tickets.soyfki.com/tickets/T-71) est la spécification canonique.

Le [contrat autonome](../../scripts/measurement/contract.mjs) est repris **seul** de [PR12](https://github.com/Soyfki/Jaquette/pull/12), SHA `0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb`, blob `357ea192fc03175da801eaa68cef573e423fbcf6`. Le [snapshot indépendant](../../scripts/measurement/fixtures/T-71/adopted-pr12.json) conserve sa source et les quatorze cibles/paramètres. Version du catalogue courant : T-71.1 ; version applicative : 0.0.0 inchangée. D04-01/D04-02 restent des décisions d'adoption de seuils, pas des résultats.

Lecture live du 6 octobre : main `4b183900a4a677c51c1d8150f7459f150c1ad033` ne contient pas le dispositif PR12. [PR14 T-70](https://github.com/Soyfki/Jaquette/pull/14), tête `cb24e2caf8f90207edea4f0b63e93afa5b955a80`, et PR12 sont open/draft/non fusionnées. T-70 Terminé satisfait la dépendance AT ; ce statut ne constitue ni fusion ni intégration. Ce lot ne reprend ni leur historique rempli ni le générateur/collecteurs/paquet PR12. `test:measurement` n'existe pas ici ; ne pas lui attribuer une exécution.

### Porte A — preuve technique avant fonctionnalités

Les tests de contrat et de gates sont intégrés à `test:tooling` et donc à `validate:all`. La suite requise AT et la revue distincte portent sur le SHA courant et la portée du dispositif. Elles ne qualifient ni indexeur, ni encodeur, ni capacité audio inexistants. Les futurs lots exécutent leurs propres tests automatiques avant leur recette, sur les capacités réelles et avec leurs prérequis.

### Porte D — premier atelier utile JQ-29 / T-103

Après ses tests techniques, Noémie accomplit le vrai parcours Web et Desktop Windows : EPUB reflowable, banque intégrée/fichiers/dossiers privés, SFX/Ambiance/Musique, placement/réglages/undo, `.jacq` autonome fermé puis rouvert offline après retrait des sources. `.jacko` vient au test suivant E et reste requis V1.

**Sortie sonore et écoute physique obligatoires** : transitions, boucles, niveaux, spatialisation et décrochages sur le matériel réellement disponible. DOM/headless, une trace de planification ou une fixture ne remplacent pas cette observation. Contexte inconnu explicitement inconnu. Le responsable prépare les builds, preuves et gestes ; les conditions de sortie/écran/alimentation réellement utiles sont observées avec l'atelier. Aucun questionnaire H-W18 déjà répondu « Inconnu pour tout » n'est reposé par routine. T-71 n'a aucune campagne humaine : aucun relevé/écoute demandé maintenant.

### Portes E/G et H

Écoutes/presets/suggestions regroupés aux tests utiles E/G ; pilotes V1/collaboration et qualification M1 réelle à H. Selon D04-04 : W18 pour les étapes intermédiaires, M1/Chrome/Firefox/Safari réel et macOS arm64 natif à H (ancien repère 14–16), Intel hors cible active. Une cellule M1 non encore due reste PLANNED, pas PASS. Une cellule requise à H manquante bloque la qualification finale. Ni WebKit Playwright, runner cloud ni émulation ne vaut Safari/M1 réel. Campagnes groupées ne suppriment aucune validation humaine AT.

## Historique immuable

[H-W18 et rapport 0.4 datés](https://github.com/Soyfki/Jaquette/blob/0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb/docs/validation/0.4-corpus-budgets/VALIDATION_REPORT.md) : **BLOCKED**, inconnues conservées, conclusion **BLOQUÉE / NO_GO**. [Retour du 22 septembre](https://github.com/Soyfki/Jaquette/blob/0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb/docs/measurement/DECISIONS.md) : « Inconnu pour tout ». Écran/Hz, sortie/audibilité, Bluetooth, alimentation/économie et activité ne sont pas confirmés par WMI/périphériques détectés. Une preuve technique courante ou une future écoute réussie crée une campagne séparée datée ; elle ne réécrit ni H-W18 ni 0.4.

## Correspondances corrigées

Les lots/tickets/jalons sont le rattachement actif. `phase` est un repère numérique du plan septembre. Le lot corrige seulement les trois erreurs identifiées ; les autres numéros restent historiques, sans nouvelle validation sémantique revendiquée.

| Budget | Fonction | Ancien renvoi erroné | Repère corrigé | Lot/ticket actif | Jalons |
|---|---|---|---|---|---|
| B06 / P06 | Recherche après indexation | 4.1–4.2, identité | 5.3, recherche ; 15–16, reprise | JQ-50 / T-90 | D, puis H |
| B12 / P12 | Indexation métadonnées | 4.1, identité | 5.1–5.2, dossiers/métadonnées ; 15–16, reprise | JQ-19 / T-88 et JQ-20 / T-89 | D, puis H |
| B13 / P13 | Export Équilibré | 11, banques/preset | 13.2–13.3, presets/encodage ; 15–16, reprise | JQ-31 / T-105 | E, puis H |

### P06 : recherche

Index réel prêt, 100 requêtes par charge/cache après dix échauffements, debounce inclus. Dernière frappe → liste complète correcte présentée, IDs/nombres comparés à l'oracle. Requêtes uniques et répétées séparées. p95 <=200 ms nominal / <=500 ms à 100000 entrées. Un catalogue logique peut isoler le moteur de recherche ; il ne mesure pas les E/S de B12.

### P12 : indexation

Index initial vide, scan demandé → toutes métadonnées durablement indexées avec compte et requêtes témoins exacts. Maximum <=120000 ms pour 10000 fichiers / <=900000 ms pour 100000 sur SSD, dix runs par compte/cache. Fichiers réguliers réels, octets/allocation/SSD et caches froid/chaud documentés ; pas de téléchargement/copie/analyse profonde incluse. Un catalogue logique ou des fichiers creux ne prouvent pas l'indexation physique. Disque insuffisant : BLOCKED pour ce volume ; série réduite distincte. Aucune matérialisation automatique de 1 To.

### P13 : export

Sources réelles uniques par SHA-256 ; somme de leurs durées / temps écoulé >=1. Dix exports et dix annulations entre 10 et 90 % ; chaque annulation <2000 ms ; mémoire <=B10 selon charge. Commande acceptée → sortie flushée/décodée/contrôlée ; annulation → workers arrêtés et sortie partielle fermée. Sources intactes, aucune sortie partielle présentée valide. Paramètres Équilibré/qualité définis et éprouvés par T-105, pas adoptés ici. Écoute comparative séparée de débit/RAM/annulation.

## Cibles adoptées, observation produit PLANNED

| Budget | Cible inchangée |
|---|---|
| B01 | max <=5000 ms |
| B02 | max <=5000 ms nominal ; <=15000 ms fort |
| B03 | max <=15000 ms nominal ; <=45000 ms fort |
| B04 | p95 <=100 ms nominal ; <=150 ms fort |
| B05 | >=55 fps nominal ; >=45 fps fort ; pause max <=500 ms |
| B06 | p95 <=200 ms nominal ; <=500 ms /100000 entrées |
| B07 | planification p95 <=30 ms ; son filaire p95 <=100 ms ; 0 décrochage observé /1800 s |
| B08 | max <=2000 ms nominal ; <=5000 ms chapitre chargé |
| B09 | 0 état confirmé perdu ; état cohérent précédent récupérable |
| B10 | pic <=1500000000 octets nominal /2500000000 fort ; après20 <1.15*baseline ; plateau stable |
| B11 | repos moyenne <=2 % /60 s ; lecture nominale <=25 % capacité totale sans IA |
| B12 | max <=120000 ms /10000 fichiers ; <=900000 ms /100000 fichiers sur SSD |
| B13 | débit >=1 seconde-source/seconde ; annulation <2000 ms ; mémoire <=B10 |
| B14 | max <=10000 ms réseau nominal ; reprise <=30000 ms hors contenu ; date de fraîcheur visible |

Les bornes/cache/instruments/preuves exhaustifs restent dans le [contrat](../../scripts/measurement/contract.mjs) et les [protocoles source au SHA PR12](https://github.com/Soyfki/Jaquette/blob/0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb/docs/measurement/PROTOCOLS.md). Les anciens renvois P06/P12/P13/preset de cette source sont remplacés par la table active ci-dessus ; aucun contenu historique source n'est corrigé à distance.

Dix runs longs par cellule, cent interactions/requêtes par type après dix échauffements. p95 au rang ceil(0.95*n), sans interpolation ; p95=max à n=10. Aucun pooling entre postes/versions/caches ni élimination d'outliers. Mo/Go/To décimaux, MiB binaires convertis en octets. D04-02 : médiane 60 s après vingt cycles <115 % baseline ; dernière heure <=105 % précédente, pic toujours sous plafond ; croissance persistante investiguée. Échecs/timeouts/abandon conservés. Aucun seuil relevé pour passer.

B07 exige moteur réel et dispositif calibré pour les chiffres de latence/décrochages ; écoute réussie ≠ p95/30 minutes démontrés. Absence de rig : cellule budgétaire BLOCKED au jalon où exigée, aucune acquisition implicite. Le matériel d'écoute de l'atelier ne doit pas être assimilé au dispositif de métrologie.

## États et preuves courantes

Le [validateur pur](../../scripts/measurement/qualification-gates.mjs) ne lance rien et n'a aucun accès réseau/fichier. Il vérifie la structure d'un rapport ; une structure valide ne prouve pas que ses faits ont eu lieu. Le responsable et la revue inspectent les octets et leur provenance.

- PLANNED : contrôle futur non exécuté/non encore dû, raison et inconnues explicites.
- BLOCKED : contrôle requis sans prérequis, capacité, accès ou preuve compatible ; raison explicite.
- PASS : exécution réelle au SHA/build/cellule courant, oracle satisfait, preuves compatibles.
- FAIL : exécution défavorable, conservée avec ses valeurs/logs ; jamais masquée en BLOCKED.

Une porte reçoit sa liste explicite non vide de contrôles requis, son campaignId/gateId/scope/SHA/build. Liste vide, doublon, statut/contrôle inconnu, mauvaise campagne : erreur de contrat. Contrôle absent : BLOCKED. Agrégation : FAIL prioritaire, puis BLOCKED, puis PLANNED ; PASS seulement si tous les contrôles obligatoires PASS. Les autres campagnes/jalons demeurent séparés et visibles, aucun retrait automatique pour faire passer.

Résultat : campaignId, gateId, controlId, oracleId, scope (device/product-budget/physical-listening), state ; exécution SHA complet, buildHash si build concerné, OS/architecture/runtime effectifs, navigateur pour produit/écoute, UTC début/fin, commande/exitCode ou observation, evidenceRefs (chemin relatif/hash SHA256). Contrat device sans build : buildHash=null et buildNotApplicable=true explicitement. SHA/build ancien, preuve absente/invalide, exit non nul : PASS refusé avec raison. Un FAIL authentique reste FAIL même si sa collecte est imparfaite.

L'écoute exige environment.headless=false, sortie identifiée, audibilité et notes sur les cinq aspects obligatoires. Cela n'empêche pas de fabriquer un objet : sa signature/veracité n'est pas garantie par ce module. Les fixtures sont identifiées comme synthétiques et ne figurent pas au dossier de résultats produit.

## Validation et historique des preuves

Voir [matrice T-71](../validation/T-71/README.md). Les suites au SHA final : typecheck/lint/test/test:tooling/test:e2e/validate:all, plus ciblés Node et contrôles liens/diff. validate:all rejoue plusieurs commandes : duplication explicite, aucune preuve héritée. Chaque rapport conserve commande exacte, exit code/signaux, OS/runtime/navigateur, horaires/durée, SHA, hash build si concerné, provenance et hashes des logs sous test-results/tickets/T-71. Un nouveau résultat ne masque pas un échec antérieur.

PR draft et revue indépendante sans push requis par l'étape AT avant clôture du développement ; validation humaine conservée. L'autorisation actuelle est locale : aucune publication/PR/fichier GitHub tant qu'elle est suspendue. Aucun merge/deploy par agent, ni accès à des profils personnels, comptes réels ou secrets.
