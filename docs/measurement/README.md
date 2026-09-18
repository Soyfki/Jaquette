# Contrat de mesure 0.4

Décision **D04-01 du 18 septembre 2026**, prise avant implémentation des capacités concernées : les quatorze seuils de la section 5 du [plan](../../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) sont **adoptés sans relèvement**. Le [contrat exécutable](../../scripts/measurement/contract.mjs) fixe valeurs, unités, charge, plateformes, bornes, cache, instrumentation, statistiques, preuves, phases et prérequis. Les [protocoles](PROTOCOLS.md) définissent comment les exécuter. **Cible adoptée ≠ mesure observée** : chaque budget produit reste PLANNED, hors campagne 0.4. Un prérequis absent dans sa future campagne donnera BLOCKED, jamais PASS.

Le [rapport 0.4](../validation/0.4-corpus-budgets/VALIDATION_REPORT.md) reste **BLOQUÉ / NO-GO** tant que les trois relevés et observations matériels ne sont pas complets. Aucune étape suivante n'est commencée, aucun conteneur .jacq/.chpt, stockage ou backend n'est adopté. Les données de scénario ne définissent pas un schéma métier.

## Unités et statistiques figées

Mo = 1 000 000 octets ; Go = 1 000 000 000 ; To = 1 000 000 000 000. MiB = 1 048 576 octets, GiB = 1 073 741 824 ; toute sortie d'outil binaire est convertie en octets avant comparaison. ms et s sont mesurées avec une horloge monotone ; timestamps UTC servent à relier les preuves, pas à soustraire deux horloges non synchronisées.

Dix exécutions pour chaque opération longue et chaque cellule charge/cache/plateforme/version. Conserver tous les résultats, y compris échecs, abandons et timeouts ; un timeout échoue au budget, il ne disparaît pas des statistiques. Trier les valeurs : p95 = valeur de rang `ceil(0,95*n)`, sans interpolation ; avec n=10, p95=max. Médiane paire = moyenne des deux valeurs centrales. Les seuils « maximum » portent sur le maximum, pas seulement la médiane. Les interactions/recherches/déclenchements ont au moins 100 événements **par type et par cellule**, après dix échauffements déclarés et conservés séparément. Aucun rejet d'outlier ni ajout de répétitions après échec pour faire passer un résultat.

Cache vide signifie nouvelle donnée/index/profil applicatif pour import/recherche ; cache OS froid exige un redémarrage par répétition. Pour le démarrage offline, conserver les ressources d'activation et fermer tous les processus après redémarrage : effacer ces ressources détruirait la précondition. Un contexte navigateur neuf sur un OS chaud n'est pas une mesure à froid. Séparer builds dev, build servi localement et application installée/distribuée ; agent IA absent, présent inactif et actif dans des séries distinctes. Les objectifs hors IA ne sont pas prouvés pendant la session de développement avec Codex actif.

**D04-02 — précision du plateau mémoire, pas changement de seuil :** après 20 cycles, médiane des 60 secondes au repos strictement inférieure à 115 % de la médiane initiale. Sur huit heures, médiane de la dernière heure <=105 % de celle de l'avant-dernière, avec graphe complet et plafond de pic toujours respecté. Une croissance monotone persistante doit être investiguée même si la règle numérique passe. Ces précisions sont fixées maintenant, avant le moteur, et non après un résultat défavorable.

Tout changement futur indique date, ancien/nouveau critère, motivation et preuve antérieure dans ce document et le plan, avant l'implémentation concernée. Une impossibilité mesurée n'autorise aucun ajustement implicite. La qualité artistique et les paramètres du preset Équilibré restent à définir en étape 11 ; B13 fixe dès maintenant débit, RAM, annulation et preuves de qualité à fournir.

## Corpus séparés

1. **Canonique :** six ressources du [manifeste inchangé](../../reference-data/manifest.json), avec tailles, SHA-256, sources, licences et attributions dans l'[inventaire](../../reference-data/INVENTORY.md) et l'[archive anglaise](../../reference-data/ARCHIVE.md). `pnpm prepare:references` puis `pnpm check:reference` vérifient les octets exacts. Les validations structurelles du 21 août et les observations humaines du 23 août 2026 sont réutilisées uniquement pour ces ressources inchangées. Elles ne qualifient aucun importeur, rendu ni moteur audio de Jaquette.
2. **Synthétique :** textes originaux minimaux FR, EN, arabe et mélange RTL, déclarés CC0 ; seed et version figées. Le jeu `reference` contient 48 mots, quatre chapitres, douze annotations dont les indices et extrémités sont connus. Le découpage par espaces est l'oracle du générateur, pas le choix du futur segmentateur produit.
3. **Personnel :** EPUB tests/ est hors fixtures, captures et Git. Aucun fichier de ce dossier n'est lu par les générateurs ni copié dans le clone. Seules ses empreintes de préservation restent dans les preuves locales.

| Préréglage | Mots / chapitres / annotations | Médias utilisés logiques | Banque logique | Projets / membres |
|---|---|---:|---:|---:|
| reference | 48 / 4 / 12 | 1 Mo réduit | 13 entrées, 13 Mo | 2 / 3 |
| ci | 1 200 / 4 / 40 | 1 Mo réduit | 100 entrées, 10 Mo | 4 / 6 |
| nominal | 150 000 / 30 / 3 000 | 1 Go | 10 000 entrées, 100 Go | 20 / 30 |
| strong | 500 000 / 100 / 20 000 | 5 Go | 100 000 entrées, 1 To | 200 / 100 |

L'EPUB généré doit rester <=10 Mo. Ses entrées ZIP ont ordre et date fixes ; OPF, spine, navigation, langues et directions sont contrôlés séparément dans les tests. Aucun manuscrit réel n'est répliqué. Les phrases répétitives permettent des comptages exacts, mais ne représentent pas la diversité éditoriale des références canoniques. L'EPUB, les JSONL et le PCM sont des fichiers de test séparés, jamais des faux .jacq/.chpt.

## Génération et vérification

Depuis le clone installé avec Node/pnpm fixés :

```sh
mkdir generated
pnpm corpus generate --output generated/reference --preset reference --mode used --seed 20260918
pnpm corpus verify --output generated/reference
pnpm corpus generate --output generated/nominal --preset nominal --mode logical --seed 20260918
pnpm corpus generate --output generated/strong --preset strong --mode logical --seed 20260918
pnpm corpus verify --output generated/strong
pnpm test:measurement
```

`logical` écrit l'EPUB et les inventaires, **zéro fichier audio**. `used` écrit les treize sources utilisées ; `bank` écrit aussi tous les vrais fichiers de banque. `estimate` n'alloue rien :

```sh
pnpm corpus estimate --preset nominal --mode used
pnpm corpus generate --output generated/nominal-used --preset nominal --mode used --confirm-bytes 1000000000
pnpm corpus estimate --preset strong --mode used
pnpm corpus generate --output generated/strong-used --preset strong --mode used --confirm-bytes 5000000000
pnpm corpus estimate --preset strong --mode bank
```

Le dernier devis correspond à **1 005 000 000 000 octets d'audio**, plus métadonnées, marge par fichier et réserve libre de 1 Go. Sa matérialisation exige de passer explicitement ce nombre à `--confirm-bytes` ; ne pas l'exécuter automatiquement. Pour exercer réellement les E/S de banque en CI : `pnpm corpus generate --output generated/ci-bank --preset ci --mode bank --confirm-bytes 11000000`, puis vérification. Les tailles comprennent les en-têtes WAV, sans promesse sur l'espace physique alloué.

Le générateur refuse un dossier existant, une seed hors uint32, un mode inconnu et un espace insuffisant. Écriture PCM par blocs de 64 Kio, JSONL ligne par ligne ; l'EPUB synthétique seul est assemblé en mémoire (maximum 500 000 tokens). La vérification recalcule la recette, vérifie inventaire, tailles et empreintes, puis relit les gros fichiers par blocs. Elle coûte volontairement du CPU proportionnel au PCM et des E/S proportionnelles aux fichiers : ce coût n'est pas celui de Jaquette. Les sorties partielles n'ont pas de manifeste final et sont refusées. Aucune suppression automatique.

Le manifeste inclut version et hash LF du générateur, paramètres, seed, provenance/licence, chaque taille/SHA-256 et volumes logiques/réels. La reproductibilité binaire est garantie pour le runtime Node fixé et ce code ; un autre zlib/Node nécessite une nouvelle preuve. `generated/`, `test-results/` et les gros binaires restent hors Git.

L'espace **physiquement alloué** dépend du système de fichiers et de sa compression : il n'est pas déduit de la longueur des fichiers. Le responsable collecte sur macOS `du -sk generated/strong-used` (Kio, APFS clones à signaler) ; sur Windows propriétés « Taille sur le disque » du dossier de test, complétées par la trace d'E/S. Conserver aussi capacité/libre avant/après, sans assimiler leur delta à une allocation exclusive. Pour B12, une ligne logique représentant 1 To ne vaut aucune preuve d'E/S sur 1 To.

## Audio dense et endurance

`audio.json` décrit trois SFX de 2, 3 et 4 s dans les modes nominal/fort, huit ambiances longues et deux musiques ; chaque longueur exacte provient de `(octets-44)/(fréquence*canaux*2)`. PCM 16 bits, 44 100/48 000/96 000 Hz, mono/stéréo. Les blocs pseudo-aléatoires déterministes à faible amplitude évitent des fichiers silencieux creux ; ce matériau technique ne remplace pas l'écoute des trois sons canoniques. Les modes réduits raccourcissent les sources, sans être la charge dense réelle.

Scénario de lecture futur : trois SFX au mot 1 ; un quatrième au mot 2 doit interrompre le plus ancien ; huit ambiances actives ; musique A seule avant mot 4, crossfade A→B du mot 4 au mot 8, B seule ensuite. Huit ambiances est une charge d'essai, **jamais une limite métier**. Boucler le scénario durant trente minutes, avec sorties réelles capturées, sans garder deux musiques principales hors crossfade.

`endurance.json` planifie huit heures et 100 cycles espacés de 288 s, interruption à 144 + 288*i secondes (i=0..99), vingt occurrences par point critique. Les interruptions réellement exécutées doivent être enregistrées ; le fichier de planning n'est pas une exécution. Voir P09/P10/P11. Aucun moteur inexistant n'est simulé pour produire un PASS.

## Paquet et campagne

`pnpm package:measurement` produit `test-results/jaquette-releve-0.4.zip` et le dossier décompressé, avec collecteurs natifs, page locale et [formulaire](../../scripts/measurement/FORMULAIRE.md). Aucune installation pour l'utilisateur. La [matrice](MACHINES.md) sépare configuration observée, compatibilité, maintenance et versions disponibles. Les erreurs de collecte restent visibles.

`pnpm measure:prototype` build puis exécute le parcours réduit avec Chrome réel headless sur le build servi localement : corpus CI vérifié, dix navigations, dix échauffements puis cent changements de rôle, DOM/console, statistiques, capture et trace. L'arbre doit être propre et le SHA identifié. La mesure click→deuxième rAF exclut entrée OS et affichage physique : elle valide la chaîne de collecte/statistiques, **pas B04**. La navigation n'est ni B01 à froid/offline, ni l'ouverture d'un vrai projet. La CI Linux prouve la reproductibilité de cet outillage, pas la qualification W18/MI/M1 ni Safari.
