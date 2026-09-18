# Jaquette — Plan de développement jusqu’à la mise en production

Date de cadrage : **11 septembre 2026**.

Destination : **logiciel gratuit sur invitation**, pour maisons d’édition et auteurs indépendants.

Livrable de cet audit : ce plan unique. Les correctifs applicatifs identifiés sont planifiés ; leur présence dans le document ne signifie pas qu’ils sont réalisés.

## 1. Décisions produit retenues

Les réponses de cadrage de septembre 2026 remplacent l’ancien calendrier « Web, puis Electron, puis IA, puis collaboration ». Les autres invariants du [cahier des charges](CAHIER_DES_CHARGES_JAQUETTE.md) et d’[AGENTS.md](AGENTS.md) sont conservés. Leur harmonisation est la première sous-étape de reprise.

| Sujet | Cible à livrer |
|---|---|
| Plateformes | Application Electron Windows/macOS et application Web complète sur ordinateur dans Chrome, Firefox et Safari. Safari est qualifié sur macOS. |
| Matériel | PC Windows 10 de génération 2018, MacBook Intel précédant le M1 et MacBook M1. Les configurations exactes sont fixées en 0.4. |
| Première utilisation | Invitation, première authentification en ligne, paramétrage de l’espace et récupération de l’environnement nécessaires avant travail hors ligne. |
| Autonomie | Cinq jours sans reconnexion. À expiration : nouvelles modifications bloquées ; consultation, sauvegarde et archivage du travail existant possibles. Une simple présence de réseau ne renouvelle pas les droits. |
| Révocation | À la prochaine connexion, droits revérifiés avant tout envoi. Travail du contexte révoqué conservé et préparé pour archivage sur disque, sans possibilité de soumission. Dans le navigateur, l’enregistrement explicite de la copie est accompagné jusqu’à vérification ; aucun original n’est supprimé si l’utilisateur annule. |
| Contenus | EPUB, manuscrits, projets, chapitres, sons et commentaires de contenu restent localement ou sur l’infrastructure de la maison. L’auteur indépendant choisit son stockage ou son hébergeur. |
| Services Jaquette | Identité, invitations et données administratives explicitement autorisées. Aucun hébergement des manuscrits ou banques audio sur Jaquette Cloud. |
| Collaboration | Travail local ; soumissions, transmission des commentaires/décisions et actualisation des tableaux de bord avec connexion. Aucun montage partagé en direct. |
| Révision | Réviseurs et Chefs peuvent télécharger, lire, simuler et préparer leurs commentaires/décisions hors ligne. Une décision préparée localement devient officielle après acceptation par le service autorisé. |
| Bibliothèques | Dossiers locaux et banques privées de maison/équipe. Les sons utilisés sont copiés dans le projet et restent disponibles après retrait du son ou perte de l’accès à la banque. |
| IA au lancement | MCP, selon la dernière précision de cadrage. Agents externes ; propositions utilisant exclusivement les sons des bibliothèques autorisées ; aucune génération sonore. |
| IA locale et distante | Fonctionnement hors ligne possible avec un agent et un modèle locaux. Tout transfert à un fournisseur distant exige consentement et connexion. Desktop peut fournir la connexion MCP locale au navigateur. |
| Jacques | Lecteur et boutique inexistants à ce jour. Préparer export et contrat d’interopérabilité ; reporter publication effective, boutique et dépublication à une extension distincte. |
| Moyens | Développement prévu par GPT.6, budget limité, pas d’échéance imposée. Lots courts, réutilisation du socle existant et décisions techniques fondées sur des preuves. |

La gratuité de Jaquette n’implique pas la gratuité du stockage choisi par l’éditeur, d’un agent tiers ou de ses appels IA. Le plan doit rendre ces dépendances visibles sans créer de paiement ou d’abonnement Jaquette.

## 2. Point de reprise et conservation des acquis

Référence locale auditée : **5cabbb016d3ce5480b165512c1aa7814b8367802**, branche **codex/phase-1-4-2-team-lead-admin-variants**. La [PR 9](https://github.com/Soyfki/Jaquette/pull/9) est ouverte, en brouillon et non fusionnée au moment de l’audit.

- Acquis historiques : phase 0, sous-étapes 1.1 à 1.3 et lot 1.4.1.
- Lot 1.4.2 : initialement en attente au SHA historique indiqué ; désormais acquis après revalidation technique et humaine complète du 18 septembre 2026 au SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`, consignée dans le [rapport 0.3/1.4.2](docs/validation/0.3-correctifs-prototype/VALIDATION_REPORT.md) et la PR 9.
- Ancien lot 1.4.3 : non commencé et plus de prochaine livraison autonome. Aucun périmètre précis retrouvé dans l’ancien plan ; inventaire en 0.3/0.5 des reliquats réellement identifiables, puis rattachement aux futures sous-étapes correspondantes, sans exigences inventées rétrospectivement. Aucune clôture rétroactive de l’ancienne 1.4 ni de l’ancienne phase 1 ; anciennes phases suivantes non commencées.
- Version applicative conservée : **0.0.0**. Les numéros des étapes ci-dessous ne sont pas des versions de l’application ou des formats.
- À réutiliser : React/TypeScript, design system, polices embarquées, navigation, panneaux et variantes Sound Designer/Réviseur sur main à 8a9e9a7ed692f26e3969641a4584669bfa1d93a9. Les variantes Chef/Admin et leurs tests restent sur la PR 9 tant qu’elle n’est pas fusionnée ; 0.1 n’importe aucun de ses changements applicatifs.
- À construire : import EPUB, ancres persistantes, audio réel, sauvegarde, comptes et permissions, échanges, banques privées, MCP, export et distribution.
- Les résultats historiques de la PR — 48 tests unitaires/composants et 22 tests navigateur — ne constituent pas une qualification actuelle du produit. Lors de cet audit, la suite applicative n’a pas démarré : résolution de dépendances locale cassée, notamment TypeScript. L’installation hors ligne n’a pas réparé cet état.
- Contrôles historiques de l’audit préalable, distincts des preuves du lot 0.1 et sans qualification d’un nouveau SHA : 19 documents sans lien relatif manquant, aucun motif courant de secret détecté par le script existant, six ressources de référence conformes, contrôle des espaces du diff réussi. Le script de secrets reste un contrôle limité, pas un audit de sécurité complet.
- Les fichiers locaux non suivis dans **EPUB tests/** restent hors des modifications et hors des commits.

La nouvelle numérotation s’applique aux travaux à venir. Elle n’efface pas l’historique et ne demande pas de reconstruire les éléments déjà validés. L’ancienne phase 0 acquise et la nouvelle étape 0 sont distinctes.

La version locale complète de ce plan reçue pour 0.1 le 11 septembre a été copiée depuis le checkout PR 9 avant harmonisation : SHA-256 ECBAAA8B5EA7A3130B4880FAB8D3A01AA022848DF7E5A38CC0D1F99B4AE65C09. La provenance et les modifications documentaires sont tracées dans le [dossier 0.1](docs/validation/0.1-harmonisation/README.md). Dès 0.2, utiliser ce plan canonique actualisé sur main ; ne pas restaurer le snapshot initial par-dessus les harmonisations ou budgets adoptés.

**Suivi de la reprise :** 0.1 validée et intégrée par la PR 10 ; 0.2 validée avec preuves dans la PR 11. **0.3 — Corriger les défauts du prototype** et la **revalidation historique 1.4.2** sont **VALIDÉES / GO**, décisions distinctes du 18 septembre 2026 après campagne technique et observations humaines complètes au SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`. L’intégration et les contrôles au dernier SHA sont tracés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9). La [campagne commune](docs/validation/0.3-correctifs-prototype/CHECKLIST.md) est complète ; l’ancienne 1.4 et la phase 1 ne sont pas clôturées. 0.4 est en cours : contrat et corpus préparés, BLOQUÉE / NO-GO en attente des relevés matériels obligatoires.

## 3. Règles d’exécution et de validation

Chaque sous-étape ci-dessous constitue un lot démontrable. Son dossier de preuve contient : identifiant, commit exact, environnement, jeux de données, commande ou scénario, résultat observé et preuve adaptée.

Conserver le [protocole de validation](docs/validation/README.md) : PASS, FAIL ou BLOCKED ; un test empêché n’est jamais réussi. L’humain fournit les observations des essais humains requis ; l’agent développeur assume aussi le rôle de responsable de validation, applique la matrice Go/No-Go et fusionne après Go conforme aux protections GitHub. Ce cumul ne dispense d’aucun essai humain obligatoire. Pour le lot documentaire 0.1, aucun essai humain supplémentaire n’est obligatoire.

Une étape dépendante commence seulement lorsque ses prérequis nommés passent. Les travaux indépendants peuvent avancer en parallèle. Toute extension du modèle ajoute immédiatement son test de sauvegarde/réouverture ; la recette complète n’est pas repoussée à la fin.

Pour maîtriser le budget :

1. Une correction ou capacité cohérente par livraison ; éviter les grands remaniements sans bénéfice démontré.
2. Conserver les dépendances actuelles lorsqu’elles conviennent ; ajouter une dépendance seulement après comparaison, contrôle de licence et justification.
3. Réutiliser la logique métier entre Web et Electron ; conserver des adaptateurs de plateforme testés séparément.
4. Ne pas transformer automatiquement le dépôt en monorepo ni multiplier les services.
5. Choisir un premier raccordement à une infrastructure privée réellement utilisé par les pilotes ; les autres connecteurs deviennent des extensions.
6. Tester les changements concernés et leurs invariants ; réserver la matrice complète aux jalons et releases.
7. Faire relire les interfaces et écouter les résultats audio par des utilisateurs métier. Un agent de développement ne remplace pas ces validations.
8. Ne pas réduire une exigence ou relever un seuil après un échec sans décision explicite et traçable.

## 4. Parcours de sauvegarde proposé, à prouver avant adoption

### Navigateur

Parcours candidat commun aux trois navigateurs :

1. L’utilisateur crée un projet ou importe une copie .jacq depuis son disque.
2. Jaquette prépare un espace de travail local au navigateur, avec données communes, chapitres et médias.
3. Les modifications sont enregistrées automatiquement par chapitre. L’écran distingue **travail enregistré localement** et **dernière copie portable créée**.
4. Fermer puis rouvrir le même navigateur retrouve le travail dans la limite des droits hors ligne.
5. Une commande explicite produit une copie .jacq portable cohérente, contenant les sons utilisés. L’utilisateur peut la conserver sur disque et l’ouvrir dans Electron ou un autre navigateur.
6. L’export .chpt et la soumission utilisent un état figé du chapitre ; continuer le montage ne modifie pas l’envoi déjà préparé.
7. Une alerte utile rappelle l’absence ou l’ancienneté de copie indépendante. Effacer les données du site ne doit jamais être présenté comme une opération dont Jaquette pourrait récupérer magiquement les modifications non exportées.

OPFS est une **option à évaluer**, pas une technologie acquise. L’accès direct aux fichiers proposé dans Chrome ne doit pas être une dépendance obligatoire du Web complet : les sélecteurs correspondants ne sont pas uniformément disponibles. Les quotas et l’éviction du stockage navigateur font partie de la qualification. [Mozilla : accès fichier](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker), [WebKit : stockage](https://webkit.org/blog/14403/updates-to-storage-policy/).

### Electron

Parcours candidat : choisir un emplacement de projet, travailler et autosauvegarder sur disque, créer des copies portables et exporter des chapitres. Les banques locales restent indexées sans duplication de leurs fichiers inutilisés.

### Porte de décision impérative

La distinction entre espace de travail et copie portable doit être **explicitement formalisée et validée en 1.2**, après les essais. Elle ne redéfinit pas silencieusement .jacq.

Le projet de travail doit respecter la séparation physique par chapitre. Une archive intégralement régénérée lors d’un export explicite n’est pas une preuve d’autosauvegarde partielle. Des noms .chpt, des empreintes identiques ou un appel seek ne prouvent pas l’absence de réécriture physique.

L’API standard d’écriture peut passer par un fichier temporaire ; le stockage OPFS ne garantit pas une correspondance simple entre fichier logique et fichier physique. Mesurer les écritures et la récupération sur chaque plateforme. Si le format proposé ne respecte pas l’invariant, arrêter ce choix et présenter le compromis produit avant de poursuivre ; ne pas supposer un ZIP. [Standard File System](https://fs.spec.whatwg.org/#api-filesystemfilehandle-createwritable), [représentation OPFS WebKit](https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/).

## 5. Matrice de qualification et budgets adoptés en 0.4

Les quatorze seuils sont **adoptés sans relèvement le 18 septembre 2026** (D04-01), avant les implémentations concernées. Le [contrat 0.4](docs/measurement/README.md), ses [protocoles](docs/measurement/PROTOCOLS.md) et sa [matrice](docs/measurement/MACHINES.md) fixent unités, charges, bornes, cache, statistiques et preuves. D04-02 précise le plateau mémoire : médiane finale après 20 cycles <115 % de la référence ; médiane dernière heure <=105 % de l’avant-dernière. Les configurations proposées ci-dessous ne remplacent jamais les relevés réels. 0.4 reste BLOQUÉE / NO-GO en attente des relevés et observations complets. Aucune performance du futur produit n’est acquise ; toute modification de seuil exige justification et historique avant implémentation.

### Postes et environnements

| Repère | Configuration de référence proposée |
|---|---|
| W18 | PC 2018, Windows 10 64 bits, processeur quatre cœurs de génération comparable, 8 Go RAM, SSD, circuit graphique intégré. Relever les références exactes. |
| MI | MacBook Intel 2019 ou début 2020 compatible avec le macOS retenu, 8 Go RAM, SSD. Relever modèle exact et macOS. |
| M1 | MacBook M1, 8 Go RAM, SSD, macOS compatible avec les versions retenues. |
| Web | Chrome et Firefox sur W18, MI, M1 ; Safari sur MI et M1. Qualifier les versions stables retenues et la version précédente supportée, avec numéros inscrits au rapport. |
| Desktop | Installateurs réels Windows x64, macOS Intel et Apple Silicon ; exécution native, pas uniquement navigateur de développement ou émulation. |
| Audio | Casque filaire et haut-parleurs pour mesures ; Bluetooth évalué séparément, sa latence matérielle n’étant pas celle du moteur. |
| Réseau | Hors ligne ; réseau nominal 20 Mbit/s, latence 100 ms ; réseau dégradé 1 Mbit/s, latence 500 ms, pertes/coupures injectées. |

Le support technique d’un OS et son cycle de sécurité sont distingués. Electron annonce Windows 10+ et Mac Intel/Apple Silicon, mais la version exacte d’Electron doit rester maintenue et compatible avec le macOS choisi. Windows 10 standard a quitté le support Microsoft le 14 octobre 2025 ; consigner l’édition et sa couverture de maintenance sans supprimer la cible demandée. [Plateformes Electron](https://github.com/electron/electron#platform-support), [maintenance Electron](https://www.electronjs.org/docs/latest/tutorial/electron-timelines), [cycle Windows](https://learn.microsoft.com/en-us/windows/release-health/release-information).

### Jeux de charge

| Jeu | Volume adopté |
|---|---|
| Référence | Les EPUB FR, EN et arabe validés, les trois médias de référence et des cas synthétiques dont les résultats sont connus. |
| Nominal | EPUB jusqu’à 10 Mo, 150 000 mots, 30 chapitres, 3 000 annotations, 1 Go de médias utilisés ; banque de 10 000 fichiers ; workspace de 20 projets et 30 membres. |
| Charge forte | EPUB jusqu’à 10 Mo, 500 000 mots, 100 chapitres, 20 000 annotations, 5 Go de médias utilisés ; banque de 100 000 fichiers représentant jusqu’à 1 To de sources indexées ; 200 projets et 100 membres par workspace. |
| Audio dense | Trois SFX, huit ambiances et deux musiques uniquement pendant crossfade ; médias longs et multiples fréquences/canaux. Huit ambiances est une charge d’essai, pas une limite métier. |
| Endurance | Session de huit heures, changements répétés de chapitre/projet, indexation et export en arrière-plan, au moins 100 cycles ouvrir/fermer et 100 interruptions de sauvegarde réparties sur les points critiques. |

Le téraoctet de banque n’est pas copié dans le navigateur. Le nombre de références indexées, les fichiers effectivement sélectionnés/copiés et le quota disponible sont mesurés séparément. Un volume supérieur au support qualifié est signalé avant l’import ; il n’autorise jamais corruption ou perte silencieuse.

### Budgets à contrôler

| Mesure | Cible nominale adoptée | Charge forte et preuve |
|---|---|---|
| Démarrage à froid après activation | Interface utilisable en 5 s maximum | Mesurer avant ouverture du projet, réseau coupé. |
| Ouverture d’un projet déjà importé | Premier chapitre utilisable en 5 s maximum | 15 s maximum ; ne pas attendre le décodage de tous les médias. |
| Premier import EPUB | 15 s maximum | 45 s maximum ; progression et annulation disponibles. Mesurer séparément la copie des médias. |
| Clic/sélection/commande | Réponse visuelle p95 ≤ 100 ms | p95 ≤ 150 ms ; traces de tâches longues. |
| Défilement du livre | Au moins 55 images/s sur scénario à écran 60 Hz | Au moins 45 images/s ; aucune pause d’interface supérieure à 500 ms. |
| Recherche locale après indexation | p95 ≤ 200 ms | p95 ≤ 500 ms sur 100 000 entrées. |
| Audio prêt en cache | Commande → planification p95 ≤ 30 ms ; commande → son filaire p95 ≤ 100 ms | Aucune coupure de tampon observée sur scénario de 30 minutes ; mesurer la sortie réelle en plus des horodatages. |
| Sauvegarde d’une commande sans nouveau média | Confirmation durable ≤ 2 s | ≤ 5 s pour un chapitre chargé ; durée liée au chapitre modifié, pas à tous les médias du livre. |
| Protection contre perte | Zéro perte d’un état annoncé enregistré | Après crash, seules les commandes encore signalées en cours peuvent manquer ; précédent état cohérent récupérable. |
| Mémoire totale attribuable à Jaquette | Pic ≤ 1,5 Go hors agent IA | ≤ 2,5 Go ; plateau stable sur session longue, retour à moins de 15 % au-dessus du niveau initial après 20 cycles. |
| CPU | Au repos ≤ 2 % de la capacité totale du poste en moyenne sur 60 s ; lecture nominale ≤ 25 % hors agent IA | Mesurer tous les processus concernés et la consommation pendant indexation/export ; réduire leur concurrence si les budgets audio/interface sont dépassés. |
| Indexation | Métadonnées de 10 000 fichiers en 2 minutes maximum | 100 000 en 15 minutes maximum sur SSD ; hors copie, téléchargement et analyse audio profonde. |
| Export audio Équilibré | Débit au moins égal au temps réel cumulé des sources uniques à encoder | RAM bornée, annulation en moins de 2 s ; publier aussi durée, taille et qualité, pas seulement le débit. |
| Tableau de bord | Changement confirmé visible en 10 s maximum sur réseau nominal | Dernière actualisation toujours visible ; reprise complète en 30 s hors temps de transfert du contenu. |

Pour les durées d’opérations longues : dix exécutions, médiane, p95 et maximum. Pour interactions : au moins 100 événements. Distinguer cache vide/chaud, application distribuée/de développement, copie disque/transcodage et fonctionnement avec/sans agent IA. L’agent local a ses propres prérequis : il n’est pas inclus implicitement dans le budget des 8 Go.

En 0.4, choisir une métrique mémoire reproductible par OS et expliciter son périmètre : processus principal, renderer, workers, encodeurs et pont Desktop lorsqu’il participe au parcours. Pour le Web, utiliser un profil dédié et un niveau de référence du navigateur sans projet ; documenter le traitement des processus partagés. Un déplacement du travail dans un sous-processus ne retire pas son coût de la mesure.

---

# Étape 0 — Reprise propre et contrat de livraison

**Prérequis :** audit présent et décisions de cadrage reçues.

**Sortie :** dépôt reproductible, correctifs de prototype délimités, exigences et mesures rattachées à des tests.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 0.1 Harmoniser les sources | Reporter les décisions de ce plan dans le cahier des charges, puis AGENTS.md, README et index. Remplacer les anciens jalons contradictoires, préserver l’historique 1.4.2 et définir le devenir du lot 1.4.3. | Aucun document actif n’exige Chrome seul, une V1 sans IA/collaboration ou la publication Jacques avant lancement. La version reste 0.0.0 et 1.4.2 n’est pas déclaré acquis. |
| 0.2 Reproduire la base | Réinstaller depuis le lockfile dans un environnement propre ; remplacer les dépendances transférées cassées sans changer arbitrairement leurs versions. Préparer une commande de validation et une CI minimale. | Typecheck, lint, unitaires, build, contrôles documentaires et E2E exécutés sur le SHA consigné ; résultats actuels joints. Une fixture obligatoire absente fait échouer sa campagne au lieu de produire un faux succès. |
| 0.3 Corriger les défauts du prototype | Rendre cohérents « En attente Chef » et les validations affichées ; corriger le focus de Fondations ; reproduire puis corriger si nécessaire la mise à jour d’état de fin de simulation. Références : ProjectPage.tsx, Shell.tsx, App.tsx. | Un projet soumis affiche toutes les validations attendues ; navigation clavier focalise son titre ; fin de simulation répétée sans avertissement React ni minuterie restante. Les variantes interdites restent absentes du DOM. |
| 0.4 Fixer corpus et budgets | Relever les trois machines, OS/navigateurs, tailles et données ; adopter ou ajuster avant implémentation les cibles de la section 5. Séparer corpus de référence et fichiers personnels. | Rapport de référence reproductible, chaque budget associé à un script ou protocole ; les données de charge sont générables et ne contiennent aucun manuscrit confidentiel. |
| 0.5 Organiser les lots de développement | Créer une matrice exigence → sous-étape → test ; conserver la DA ; découper progressivement la grande page projet et ses contrôleurs sans nouvelle bibliothèque imposée. | Un contributeur peut identifier prochaine étape, prérequis et preuve requise ; les acquis de navigation/rôles passent après le découpage. La revalidation humaine de 1.4.2 est consignée séparément des preuves techniques. |

**Porte de sortie :** aucune confusion entre démonstration et fonction métier réelle. Les maquettes restantes ne bloquent pas les expériences techniques indépendantes.

# Étape 1 — Prouver les choix les plus risqués

**Prérequis :** 0.1, 0.2 et 0.4. Les expériences 1.2 à 1.5 peuvent être menées indépendamment avec données synthétiques.

**Sortie :** décisions techniques écrites, justifiées par des prototypes jetables ou réutilisables et des mesures.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 1.1 Séparer métier et plateformes | Définir les interfaces minimales de stockage, audio, identité, transport et UI. Réutiliser TypeScript/React ; ne créer des packages que si nécessaires. | Une même commande d’annotation et ses validations s’exécutent sans DOM ; deux adaptateurs de stockage passent le même test de contrat. |
| 1.2 Choisir le stockage et la représentation .jacq | Comparer les formes compatibles avec la sauvegarde physique par chapitre et le parcours proposé section 4 ; mesurer écritures, croissance, interruption, portabilité et coût. Formaliser la distinction éventuelle espace de travail/copie portable avant adoption. | Modifier le chapitre 2, agrandir ses données et ajouter un média sans réécrire les autres chapitres ; preuve d’E/S, pas seulement hashes. Sur chaque navigateur et Electron, exporter puis réimporter une fixture de 5 Go ; mesurer RAM et espace temporaire, tester annulation/quota insuffisant sans écraser une copie valide. Toute impossibilité est BLOCKED avec décision produit nécessaire, jamais une dérogation implicite. |
| 1.3 Démarrer Web et Electron hors ligne | Prototype installé Electron et application Web préparée pour offline ; ressources, polices, routes, codecs requis et workers locaux. Définir navigation desktop et repli des routes Web. | Après préparation, fermer l’application/le navigateur, couper le réseau, redémarrer l’OS, ouvrir une route directe et utiliser le prototype sur chaque cible sans serveur de développement. |
| 1.4 Raccorder une infrastructure privée pilote | Comparer un petit nombre de solutions adaptées au stockage d’un éditeur/auteur : authentification, coûts, exploitation, transferts reprenables et accès navigateur. Choisir un premier connecteur, sans imposer tous les fournisseurs. | Écrire/lire un fichier synthétique depuis Chrome, Safari, Firefox et Electron ; tester CORS, HTTPS, expiration d’accès et coupure ; tracer le chemin réseau et démontrer qu’aucun contenu ne passe par Jaquette Cloud. |
| 1.5 Prouver le chemin MCP | Démonstration sur données synthétiques : agent local vers Desktop, navigateur appairé à Desktop, agent distant vers endpoint contrôlé par la maison/l’auteur. | Un client découvre les capacités et lit uniquement une ressource autorisée ; autre origine/workspace refusé ; aucun master modifié. Un agent réellement local fonctionne réseau coupé. |
| 1.6 Mesurer le moteur minimal | Charger un long chapitre et un média long, déclencher quelques sons, sauvegarder pendant lecture. Évaluer décodage, cache, workers et traitements natifs sans choisir sur intuition. | Mesures CPU/RAM/E/S et réactivité sur W18, MI et M1. Les décisions de stockage et d’audio mentionnent alternatives, résultat et seuils, avant extension du produit. |

Electron recommande de profiler, d’éviter les traitements bloquants et de limiter les dépendances réseau au démarrage. Ces principes motivent les mesures, sans imposer un découpage arbitraire en services. [Performance Electron](https://www.electronjs.org/docs/latest/tutorial/performance).

# Étape 2 — Projets locaux durables et formats de travail

**Prérequis :** choix 1.1 et 1.2 validés ; builds 1.3 disponibles.

**Sortie :** stockage de production récupérable, utilisable par les fonctionnalités suivantes.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 2.1 Définir les contrats de données | Identités projet/livre/chapitre, ancres référencées, commun/chapitre, médias, base et filiation. Décider schémas et compatibilité .jacq/.chpt ici, distinctement de la version applicative. | Validation de fichiers minimaux ; références incohérentes refusées ; donnée partagée par deux chapitres stockée au commun, donnée propre à un chapitre dans son .chpt. |
| 2.2 Implémenter l’autosauvegarde | Transactions récupérables selon 1.2, état enregistré/en cours/échec, sérialisation hors interface et prévention de deux écrivains. | Modifier un chapitre, fermer et retrouver le dernier état confirmé. Deux fenêtres/onglets sur le même projet ne produisent jamais deux écritures concurrentes silencieuses. Budgets de sauvegarde respectés. |
| 2.3 Récupérer après incident | Gestion de crash, disque plein, retrait de permission, interruption de processus, stockage débranché ; copies de récupération et contrôle d’intégrité. | Injections avant/pendant/après confirmation : ancien ou nouvel état cohérent disponible, aucun état partiel validé. Une récupération conserve les fichiers originaux et explique l’action nécessaire. |
| 2.4 Gérer les médias utilisés | Copie vérifiée à la première utilisation, empreinte, références par occurrence et déduplication ; aucune modification destructive des sources. | Deux occurrences du même son partagent la ressource ; retirer les bibliothèques n’affecte pas la lecture du projet. Un média incomplet n’est pas marqué intégré. |
| 2.5 Produire des copies autonomes | Import/export .jacq et export de .chpt candidat ; état figé pendant export, progression/annulation. Utiliser ici des fixtures synthétiques minimales d’ancres, annotations et états de chapitre ; enrichir le round-trip à chaque étape future. | Ouvrir la copie synthétique sur autre OS/navigateur sans sources ; données et ressources identiques. Export annulé sans écrasement d’une copie valide ; candidate stockée séparément de la fixture validée. La preuve EPUB/son réels est exigée en 3.5, la preuve du workflow en 8–10. |
| 2.6 Historique local | Undo/redo 50 commandes, groupement cohérent des opérations et versions nommées durables. Le format conserve les relations nécessaires aux snapshots. | 51 commandes : seules 50 annulables ; une nouvelle commande après undo coupe correctement redo ; deux versions nommées restent consultables après dépassement et réouverture. Les événements audités ne sont pas effacés. |
| 2.7 Protéger les évolutions | Migration testée, sauvegarde avant conversion, refus d’un format trop récent et traitement des chemins Unicode/longs/casse différente. | Migration d’un ancien fichier sans perdre liens et médias ; échec de migration restaure la copie précédente ; version inconnue laissée intacte. Parcours Windows → Mac → navigateur réussi. |

# Étape 3 — EPUB, ancres stables et premier doublage réel

**Prérequis :** 2.1 à 2.5.

**Sortie :** première preuve complète du principe « le texte est la timeline », sur toutes les plateformes.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 3.1 Importer et contrôler l’EPUB | Lire package, spine, navigation, chapitres et ressources ; accepter reflowable sans DRM ; limites de décompression et diagnostics. | Les trois EPUB de référence s’ouvrent dans le bon ordre. Non-EPUB, DRM détectable, fixed-layout, structure corrompue et archive excessive sont refusés proprement. Ne pas confondre obfuscation de police et DRM du livre. |
| 3.2 Isoler le contenu éditorial | Rendu sans confiance dans HTML/CSS/scripts ; préserver images, tableaux, notes, liens internes, styles et polices pertinents. | Corpus hostile incapable d’exécuter du code applicatif, d’appeler IPC ou de lire le disque ; aucune ressource distante chargée implicitement. Notes, tableaux et destinations internes testés, éléments non supportés signalés. |
| 3.3 Créer les ancres | Segmentation chapitres/paragraphes/phrases/tokens ; IDs logiques persistants, indépendants des coordonnées et de la taille de page. Définir la compatibilité du segmentateur et conserver les ancres sans retokenisation implicite à la réouverture. | Deux imports identiques sur moteurs différents et un cycle sauvegarde/réouverture conservent 100 % des IDs attendus. Zoom, police, mise à jour du navigateur et redimensionnement ne changent aucune ancre existante. |
| 3.4 Couvrir FR/EN/arabe | Accents, apostrophes, tirets, nombres, ponctuation, ligatures, diacritiques et texte bidirectionnel ; Literata et fallback arabe. | Résultats attendus sur corpus annoté ; sélection logique correcte dans un paragraphe multilingue ; aucune inversion d’ancre due au RTL ; texte source non éditable. |
| 3.5 Faire le parcours vertical | Sélectionner un mot, associer un vrai son local, écouter, autosauvegarder, fermer, relancer hors ligne et retrouver exactement l’association. | Même scénario sur Chrome, Safari, Firefox, Electron Windows, Intel et M1 ; média source rendu indisponible ; ancre et lecture intactes. Ce test est bloquant. |
| 3.6 Compléter la sélection | Clic, glisser, Shift+clic, double clic phrase, triple clic paragraphe ; commandes paragraphe/chapitre et équivalents clavier. | Chaque interaction produit les bornes attendues en FR/EN/arabe, y compris glisser inverse ; aucune plage inter-chapitres. Plusieurs types d’annotations peuvent partager une plage. |
| 3.7 Qualifier le rendu volumineux | Préparer les tokens une fois, borner le rendu et dissocier mot actif/rendu général. Définir le traitement d’une nouvelle édition EPUB sans réécriture du texte dans Jaquette. | Budgets sélection/défilement tenus sur 500 000 mots ; aucun recalcul complet à chaque mot actif ; remplacer la source par un EPUB différent ne réancre rien silencieusement. |

**Jalon J1 :** projet autonome démontré ; aucune fonctionnalité collaborative ou IA ne compense un échec de sauvegarde ou d’ancrage.

# Étape 4 — Invitations, contextes et cinq jours hors ligne

**Prérequis :** 1.4, 2 et J1.

**Sortie :** droits réels, explicables et appliqués aux opérations, y compris après reconnexion.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 4.1 Accès sur invitation | Service d’identité minimal, invitations expirables à usage contrôlé, adresses vérifiées et récupération de compte. Définir qui émet les invitations initiales et les invitations de workspace. | Aucun accès public auto-inscrit ; invitation valide ouvre le bon contexte ; invitation expirée, réutilisée ou attribuée à un autre destinataire refusée. Aucun secret dans bundle ou dépôt. |
| 4.2 Identité globale | Plusieurs emails vérifiés ; liaison/fusion après preuve de contrôle ; conservation des auteurs historiques et appartenances. | Deux adresses accèdent à la même identité ; fusion conserve projets, tâches, commentaires et historique. Nom/IP/email non vérifié ne fusionnent jamais automatiquement. |
| 4.3 Contextes et rôles | Workspaces Maison/Auteur, équipes, projets, affectations par chapitre ; contrôle partagé UI/commandes/services. | Même identité avec rôles distincts dans deux maisons ; Admin sans droit éditorial implicite ; Réviseur/Chef incapables de modifier audio par UI, commande directe ou service. Cette matrice sera rejouée par MCP en 12.8. |
| 4.4 Première préparation offline | Authentification, récupération des droits, environnement et ressources requises ; liste des projets réellement disponibles sur le poste. | Première ouverture sans réseau explique la connexion requise. Préparation interrompue n’annonce pas « prêt hors ligne ». Après succès, démarrage à froid et projet disponible fonctionnent sans connexion. |
| 4.5 Fenêtre de cinq jours | Proposition technique : autorisation bornée à 120 heures après le dernier contrôle serveur réussi, échéance persistée et vérifiée dans les opérations. Protéger contre redémarrage et recul simple de l’horloge. | Tester juste avant/à/après échéance, redémarrage et horloge modifiée. À expiration : aucune édition ni application de proposition ; lecture, sauvegarde et archivage restent possibles. Réseau disponible mais authentification échouée ne prolonge pas l’échéance. |
| 4.6 Révocation et archive | Revérifier avant envoi ; bloquer le contexte révoqué ; préserver et figer le travail avec ses médias. Sur Desktop, enregistrer l’archive ; sur Web, préparer la copie puis demander l’enregistrement/téléchargement explicite. Interrompre les envois préparés sans destruction. | À reconnexion, zéro soumission acceptée, y compris file ancienne. Copie indépendante vérifiée par réouverture avant de déclarer l’archivage terminé ; autres workspaces autorisés préservés. Tester refus, annulation, fermeture du navigateur et disque plein : original conservé, état « copie indépendante à terminer », envoi toujours bloqué. |
| 4.7 Gestion de maison/auteur | Invitations/suspensions, équipes, Chefs, affectations et projets ; partage et transfert Auteur → Maison distincts avec acceptation. | Actions réservées au rôle autorisé ; partage conserve propriétaire ; transfert accepté le change en conservant historique ; refus d’acceptation ne transfère rien. Retrait d’affectation pendant workflow traité explicitement. |

La protection locale n’est pas une révocation distante instantanée. La garantie partagée est le refus des opérations non autorisées par les services à chaque réception et finalisation.

# Étape 5 — Bibliothèque locale et atelier Sound Designer

**Prérequis :** 2, 3 et 4.3.

**Sortie :** recherche et placement de médias réels avec autonomie du projet.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 5.1 Dossiers et accès navigateur | Indexer plusieurs dossiers/sous-dossiers ; définir sélection/import explicite et nouvelle autorisation sur les navigateurs sans accès persistant. | Hiérarchie fidèle ; un fichier indexé n’est pas copié par défaut. Sur chaque navigateur, retrouver un son disponible et expliquer clairement une source à resélectionner. |
| 5.2 Métadonnées et formats | Matrice d’import à qualifier : WAV PCM, MP3, FLAC, Ogg/Vorbis, Opus, AAC/M4A et AIFF selon décodeurs réellement distribués. Afficher durée, format, taille, fréquence et canaux. | Chaque format annoncé possède fichiers valides/corrompus et résultats mesurés sur chaque plateforme. Format non pris en charge refusé avec raison, jamais silencieusement ignoré. |
| 5.3 Recherche et classement | Nom, filtres, taxonomie, tags libres, favoris et collections ; multi-appartenance d’un son ; index construit progressivement. | Recherche combinée retourne le jeu attendu ; un son reste dans son dossier après ajout à deux collections ; retrait d’un favori ne supprime aucun média. Budgets sur 10 000/100 000 références. |
| 5.4 Préécoute et placement | Lecture/pause/stop indépendants du projet ; glisser-déposer sur sélection ; choix SFX/Ambiance/Musique et compteur d’utilisations. | Préécouter ne crée aucune annotation ; placement copie le média et crée une occurrence sur bonnes ancres ; trois occurrences donnent trois utilisations ; undo rétablit le compteur. |
| 5.5 Vie des sources | Détecter déplacement, déconnexion de disque et nouvelle empreinte de source ; mise à jour explicite des occurrences choisies. | Source remplacée : copie embarquée inchangée jusqu’à action explicite. Relier un dossier déplacé restaure son index ; aucune source nouvelle ne remplace silencieusement le son utilisé. |
| 5.6 Interface de production | Bibliothèque/livre/inspecteur, panneaux rétractables, raccourcis et accès aux annotations superposées ; pas de waveform imposée. | Créer, sélectionner, dupliquer, copier/coller sur une autre plage, modifier et supprimer une occurrence ; réglages conservés et nouvelles bornes correctes après collage ; texte toujours non éditable. |

# Étape 6 — Moteur audio et simulation fiables

**Prérequis :** J1, 5.2 et 5.4.

**Sortie :** comportement texte/audio déterminé et reproductible, indépendant du rafraîchissement visuel.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 6.1 Horloge et positions de lecture | Séparer horloge audio, progression textuelle et rendu. Définir réentrée dans une plage, saut avant/arrière, pause, arrêt et changement de chapitre. | Une trace de positions connue produit la même suite d’événements sur toutes les plateformes ; aucun double déclenchement dû à un re-render. Les comportements artistiques sont validés avant implémentation avancée. |
| 6.2 SFX | Déclenchement mot/plage, lecture jusqu’au terme après lancement, trois simultanés maximum. | Quatre déclenchements successifs : le plus ancien actif est interrompu ; les trois autres restent conformes. SFX sur même mot distingués, ordre d’égalité déterministe et documenté. |
| 6.3 Ambiances | Superposition, boucle activée/désactivée, entrée/sortie de plage et fin de média. | Boucle ON répète jusqu’à borne textuelle ; OFF lit une fois ; média trop long s’arrête ou applique sa sortie à la fin de plage ; deux ambiances restent audibles. |
| 6.4 Musique et transitions | Une musique principale ; coexistence uniquement pendant crossfade ; politique explicite pour arrivée d’une troisième musique pendant transition. | Hors crossfade une seule musique ; courbes de gain attendues pendant A → B ; enchaînement rapide ne laisse aucune musique orpheline ni coexistence durable. |
| 6.5 Simulations et navigation | Pointeur comme regard ; vitesse en mots/minute ; x1/x2/x4 ; sélection, depuis ici et chapitre ; mot actif visible. | À 200 mots/minute, ordre et durée attendus ; saut reconstruit les ambiances/musique actives ; pause/reprise et fin de sélection suivent le contrat 6.1, sans modifier les annotations. |
| 6.6 Sorties et ressources | Cache borné, décodage/lecture de médias longs, suspension/reprise OS, périphérique débranché, autoplay navigateur. | Lecture sous indexation et sauvegarde sans coupures de tampon sur scénario de charge ; erreur périphérique compréhensible ; fermeture projet libère sources et timers. Un clic utilisateur débloque proprement l’audio si le navigateur l’exige. |

# Étape 7 — Réglages audio non destructifs et qualité d’écoute

**Prérequis :** moteur 6 et historique 2.6.

**Sortie :** chaque réglage est écoutable, mesurable, réversible et persisté.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 7.1 Volume, entrée et trim | Paramètres propres à chaque occurrence, unités et bornes explicites. | Deux occurrences de la même source ont volumes/trims différents ; signal synthétique démarre aux échantillons attendus selon tolérance définie ; empreinte source inchangée après sauvegarde. |
| 7.2 Boucles | Boucle entière ou zone, bornes validées, choix du raccord et préécoute. | Cent répétitions sans trou ou clic au-delà du seuil défini sur fixture raccordable ; zone invalide refusée ; boucle désactivée ne rejoue pas. |
| 7.3 Fades textuels | Plages de mots et courbes de progression ; affichage des bornes et transitions. | Même plage à x1/x4 respecte la progression textuelle ; départ au milieu reconstruit le bon gain ; passage arrière suit 6.1 ; pas de conversion implicite en durée fixe seule. |
| 7.4 Normalisation | Choisir cible, mesure et protection des crêtes ; activable/désactivable par occurrence, traitement hors interface. | Fixtures de niveau connu atteignent cible et tolérance choisies ; désactivation retrouve le gain attendu ; aucune source réécrite. Documenter la différence entre mesure de fichier et résultat de mixage. |
| 7.5 Ducking | Définir sources déclenchantes, familles/occurrences affectées, atténuation et temps de retour ; cumul déterministe. | Deux occurrences avec atténuations différentes donnent les gains attendus ; fin de déclenchement restitue le niveau ; déclenchements superposés ne cumulent pas accidentellement une atténuation sans borne. |
| 7.6 Spatialisation | Position 3D autour du lecteur, distance/azimut/élévation ; stratégie casque et haut-parleurs. | Positions gauche/droite/centre conformes aux mesures ; écoute humaine des transitions ; downmix compatible ; paramètres identiques après réouverture et contrôle d’export. |
| 7.7 Mute, solo et ergonomie | Commandes par occurrence et famille, priorité des solos et préécoute distincte ; annulation cohérente. | Matrice de combinaisons prévue ; aucune occurrence muette audible ; solo de famille/occurrence fonctionne sans altérer ses réglages de production. Raccourcis utilisables sans souris. |

Les tolérances audio sont fixées sur fixtures avant validation ; « on entend une différence » ne suffit pas. L’écoute métier juge aussi l’utilité et la cohérence artistique.

# Étape 8 — Tâches, commentaires et workflow local

**Prérequis :** 4, 6 et 7 pour révision audible.

**Sortie :** règles métier exécutables et testables sans dépendre du réseau ; les décisions officielles seront raccordées en 9–10.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 8.1 États et commandes métier | Automate de production et permissions pour Draft, affectation, doublage, révision, soumission Chef et validation finale. Différencier état préparé et état partagé. | Chaque transition autorisée/interdite a son test ; aucun bouton ou appel direct ne saute les conditions de validation. |
| 8.2 Tâches automatiques | Affectations et workflow génèrent doublage, révision et correction ; cible livre/chapitre, assigné, échéance facultative, aucune priorité. | Création Pas commencé ; passage manuel En cours ; Terminée après action métier ; aucune tâche libre ni objet ticket. Deux invalidations créent deux corrections distinctes avec historique conservé. |
| 8.3 Commentaires contextualisés | Livre, chapitre, mot/plage, occurrence ; fils, modification historisée, Ouvert/Résolu. | Accès au passage/occurrence exact ; aucun commentaire d’occurrence ne vise la bibliothèque ; pas de suppression définitive ; auteur et dates restent accessibles. |
| 8.4 Transport des objets métier | Enrichir .jacq/.chpt avec tâches, commentaires, validations et audit ; conserver les identifiants. | Livre au commun ; chapitre/texte/occurrence dans .chpt ; réimport répété sans duplications ; données d’origine et filiations intactes. |
| 8.5 Progression et accueil | Accueil général distinct, équipes, projets, Drafts, tâches, activité, alertes ; trois axes de progression. | Chaque équipe expose membres et projets ; chaque projet nom/équipe/statut/activité ; 21 validations sur 30 donnent 70 % de révision sans pourcentage global trompeur. Tous les projets restent consultables depuis l’accueil, rendu virtualisé si nécessaire. |
| 8.6 Vues par rôle | Sound Designer, Réviseur, Chef, Admin et contexte Auteur à partir des droits réels. | Montage absent pour Réviseur/Chef ; Admin centré gestion ; publication non montée avant validation et non proposée comme opération réelle avant extension Jacques. Simulation autorisée indépendante du droit de montage. |

# Étape 9 — Échanges connectés sur stockage privé

**Prérequis :** 1.4, 2.5, 4 et 8.

**Sortie :** envoi/réception fiable sans hébergement du contenu chez Jaquette et sans synchronisation du montage en direct.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 9.1 Définir les frontières et autorités | Liste explicite des données administratives autorisées dans les services Jaquette ; contenu, commentaires, audit sensible et états détaillés sur infrastructure privée. Définir l’autorité de chaque état et les règles d’exposition des dashboards. | Requêtes, journaux, erreurs et notifications inspectés : aucun manuscrit, prompt, son, .chpt/.jacq ou extrait de commentaire envoyé à Jaquette Cloud. Une seule autorité désignée par décision partagée ; aucune divergence silencieuse entre services. |
| 9.2 Distribuer la base du livre | Acquisition initiale de la bonne base .jacq/EPUB et ressources autorisées depuis stockage privé, avant ouverture de candidate. | Nouveau Réviseur sans copie locale télécharge le contexte, retrouve les bonnes ancres et simule ; base absente/incompatible bloque la consultation ou intégration avec message utile. Ne pas supposer que .chpt contient le livre entier. |
| 9.3 Préparer et envoyer | Snapshot immuable du chapitre, hash, taille, filiation et auteur ; contrôle de droits à l’envoi ; reprise et annulation. | Continuer le montage pendant envoi n’altère pas le snapshot. Couper à 10 %, 50 % et après réception avant réponse : reprise correcte, aucun fichier tronqué reconnu et une seule soumission logique. |
| 9.4 Accuser réception | Confirmation durable et idempotence ; états préparé/envoi/échec/reçu, sans confondre fin du transfert et acceptation métier. | Double clic, réessai et redémarrage ne dupliquent ni candidate ni tâche. La réponse perdue est réconciliée. « Reçu » n’apparaît qu’après vérification de l’intégrité et confirmation du service. |
| 9.5 Reconnecter et contrôler les droits | Vérifier identité/affectation avant transmission de toute action préparée offline ; finalisation également protégée. | Révocation avant ou pendant transfert : aucune soumission finalisée après retrait des droits ; archive locale préservée ; fichiers partiels nettoyés selon procédure sans toucher aux contributions validées. |
| 9.6 Actualiser les tableaux de bord | Rafraîchissement connecté, dernière actualisation, état périmé et reprise progressive. Notifications minimales sans contenu sensible. | Deux postes observent le même état confirmé dans le budget prévu ; hors ligne l’écran indique sa date ; travail local non envoyé n’apparaît pas comme reçu par l’équipe. Une panne d’infrastructure privée ne corrompt pas le cache. |
| 9.7 Exploiter le connecteur pilote | Configuration guidée, droits limités, secrets hors frontend, diagnostic, sauvegarde/restauration côté éditeur et test Auteur. | Un administrateur pilote raccorde son stockage avec la documentation ; mauvaise configuration produit un diagnostic exploitable ; restauration testée sur une autre instance sans mélanger les workspaces. |

# Étape 10 — Révision partagée, candidates et validation finale

**Prérequis :** 8 et 9.

**Sortie :** cycle Sound Designer → Réviseurs → Chef utilisable avec phases hors ligne.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 10.1 Réviser hors ligne | Télécharger la candidate, simuler/commenter, préparer validation ou invalidation ciblant son identité et son contenu exacts. | Fermer/rouvrir offline conserve brouillon de décision ; aucune décision officielle affichée avant réception ; invalider sans commentaire explicatif refusé. |
| 10.2 Obtenir l’unanimité | État par chapitre et Réviseur, calcul des validations attendues et intégration du même snapshot approuvé. | Avec trois Réviseurs, 1/3 et 2/3 n’intègrent rien ; 3/3 intègrent la même candidate ; un refus bloque. Aucun vote majoritaire ni arbitrage éditorial du Chef. |
| 10.3 Gérer les candidates concurrentes | Conserver contributions complètes, proposition explicite d’une candidate active et décisions ; aucun merge détaillé du montage. | Deux propositions concurrentes restent visibles sans remplacement silencieux ; proposer n’est pas valider ; changement de candidate rend nécessaire l’examen de celle-ci et ne récupère pas indûment les votes d’une autre. |
| 10.4 Corriger et invalider | Nouvel audio après validation annule validations actives et replace le chapitre À réviser ; audit des versions précédentes. | Modifier, soumettre, invalider et corriger deux cycles : mêmes anciennes décisions consultables, nouvelles tâches distinctes. Une décision offline devenue obsolète est refusée ou soumise à réexamen explicite. |
| 10.5 Intégrer les chapitres compatibles | Vérifier projet/livre/base/filiation, dédupliquer médias et préserver les autres sections. Réaffectation d’identité importée si nécessaire. | Chapitres 1 et 2 compatibles intégrés sans réécriture mutuelle ; origine inconnue bloque ; correspondance assigné uniquement par ID global identique et droits valides, sinon choix Chef/Auteur sans réécrire l’auteur historique. |
| 10.6 Arbitrer le commun | Détecter paramètres/métadonnées communs modifiés dans deux copies ; décision Chef ou Auteur journalisée. | Aucune valeur ne gagne selon l’heure ou le dernier import ; arbitrage visible et ancien état conservé ; données communes jamais glissées dans un .chpt pour contourner le conflit. |
| 10.7 Décision du Chef | Soumission seulement après validations requises ; simulation, retour vers Réviseur ou Sound Designer, validation finale distincte de publication. | Projet incomplet non soumettable ; retours créent les tâches appropriées ; Chef ne monte jamais l’audio ; validation finale ne publie rien. |
| 10.8 Changement d’affectation | Définir remplacement/ajout/retrait de Réviseur pendant cycle et mise à jour des validations attendues. | Aucun retrait ne fabrique implicitement une unanimité ; changement audité et conditions recalculées selon règle validée ; approbations conservées dans l’historique sans droits hérités automatiquement. |

**Jalon J2 :** deux contributeurs et trois Réviseurs sur postes distincts accomplissent deux cycles complets avec coupures réseau et une révocation, sans perte ni duplication.

# Étape 11 — Banques Cloud privées

**Prérequis :** 5, 9 et droits 4.

**Sortie :** banques maison/équipe accessibles avec réseau, projets autonomes sans réseau.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 11.1 Administrer la banque | Rôles autorisés pour déposer, classifier, retirer et versionner des sons sur infrastructure privée ; provenance et droits d’usage documentés. | Membre hors banque refusé ; isolation entre deux maisons ; retrait d’un son ne détruit aucun média utilisé dans un projet. |
| 11.2 Rechercher et préécouter | Catalogue privé, filtres et recherche cohérents avec local ; distinguer disponible localement et nécessite téléchargement. | Résultats autorisés uniquement ; hors ligne catalogue mis en cache daté, préécoute possible uniquement pour médias disponibles ; aucune attente réseau ne bloque le montage local. |
| 11.3 Télécharger et intégrer | Cache contrôlé, téléchargement reprenable, vérification d’empreinte, copie dans projet à l’utilisation. | Coupure puis reprise ; fichier incomplet jamais utilisable ; son placé, banque coupée et projet rouvert sur autre poste : lecture intacte. |
| 11.4 Mettre à jour et nettoyer | Nouvelle version signalée, adoption explicite ; nettoyage du cache distinct des médias du projet. | Nettoyer cache et retirer accès banque ne changent ni les sons déjà intégrés ni les anciens snapshots ; remplacement explicite met à jour seulement les occurrences choisies et invalide les validations si audio modifié. |
| 11.5 Qualifier coûts et charge | Pagination/recherche côté infrastructure privée, limites de concurrence et diagnostic ; inventaire des coûts réels du pilote. | Banques de charge consultables sans charger tous les médias ; pas d’accès croisé ; panne serveur n’empêche pas production locale. Coûts stockage/transfert documentés avant ouverture aux pilotes. |

# Étape 12 — IA via MCP, intégrée au cycle de production

**Prérequis :** J1, 4, 7, 8 et 1.5 ; 11 pour banques distantes.

**Sortie :** agent connecté capable de proposer un doublage utile sans toucher directement au master.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 12.1 Contrat MCP | Ressources explicitement exposées : projet, chapitre/sélection, bibliothèques autorisées, taxonomie, annotations. Outils limités à lecture/recherche et propositions d’ajout/modification/suppression. | Client de conformité découvre outils et schémas ; accès fichier arbitraire et génération sonore impossibles ; nom métier SFX utilisé ; aucun outil n’écrit directement le master. |
| 12.2 Serveur local Desktop | Démarrage local contrôlé, dépendances embarquées, transports réellement nécessaires, limites de ressources et journal sans contenu sensible par défaut. | Démarrer hors ligne sans téléchargement ; agent et modèle locaux recherchent un son et proposent une occurrence ; arrêt libère port/processus ; session non autorisée refusée. |
| 12.3 Connexion du navigateur | Appairage explicite à Desktop, origine et workspace limités ; exposition des seules ressources autorisées de la session Web. Gérer fermeture/gel de l’onglet. | Chrome, Safari et Firefox échangent une proposition ; autre site, autre workspace, appairage expiré et onglet indisponible refusés ; Desktop ne lit pas arbitrairement le stockage d’un navigateur. |
| 12.4 Agents distants | Endpoint MCP sur infrastructure contrôlée Maison/Auteur, accès aux seuls snapshots choisis ; compatibilité qualifiée par client/version/transport et conditions de compte. | Connexion réellement testée pour chaque client annoncé ; interruption, droits retirés, timeout et réessai gérés ; aucun tunnel public ni transfert de contenu activé implicitement. |
| 12.5 Consentement | IA interdite/autorisée, fournisseur et périmètre affichés ; certification de l’autorisation de l’auteur/éditeur ; interdictions maison, révocation et audit. | IA interdite bloque exposition ; fournisseur distant sans consentement reçoit zéro contenu ; révocation bloque nouveaux appels et résultats tardifs ; date, compte, fournisseur et version journalisés. |
| 12.6 Brouillon et acceptation | Diff lisible, acceptation unitaire/chapitre/globale et rejet ; vérification de base, droits, média et bornes avant application. | Acceptation applique uniquement les propositions choisies ; rejet laisse master identique ; modification humaine concurrente provoque conflit explicite ; retries sans doublons ; undo et invalidation de révision fonctionnent. |
| 12.7 Évaluer l’utilité et les coûts | Scénario FR/EN/arabe sur banques existantes ; qualité des ancrages, pertinence des sons, opérations correctes et coût/latence de l’agent. | Au moins un SFX, une Ambiance et une Musique proposés correctement ; zéro son inventé/hors droits, zéro modification du master sans acceptation ; écoute et correction humaine consignées. Aucun abonnement IA supposé inclus. |
| 12.8 Tester les accès après expiration | Relier MCP aux droits, délai offline et révocation du contexte ; rejouer la matrice de rôles de 4.3. | Réviseur/Chef ne modifient jamais le montage par MCP. À expiration, aucune proposition appliquée ; après révocation, aucune ressource du contexte exposée à l’agent et travail local conservé. Un message du modèle ne peut pas élargir les capacités autorisées. |

**Compatibilité à qualifier, pas promesse fondée sur une marque :**

- Les agents locaux tels que Codex, Gemini CLI et Claude Code peuvent servir de clients de test selon les transports documentés. Leur connexion locale ne rend pas automatiquement leur modèle local. [OpenAI MCP](https://learn.chatgpt.com/fr-FR/docs/extend/mcp), [Gemini CLI](https://geminicli.com/docs/tools/mcp-server/), [Claude Code](https://code.claude.com/docs/en/mcp).
- Un chat hébergé demande une liaison réseau et un endpoint qu’il peut atteindre ; il n’a pas automatiquement accès au localhost de l’utilisateur. La compatibilité ChatGPT se teste avec le compte et le mécanisme d’accès disponibles. [Connexion ChatGPT](https://developers.openai.com/plugins/deploy/connect-chatgpt).
- La sécurité des transports inclut notamment origine, authentification et écoute locale limitée. La version du protocole est choisie au moment de l’implémentation, pas déduite d’un exemple de documentation. [Transports MCP](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports).

# Étape 13 — Contrôle qualité, export et préparation de Jacques

**Prérequis :** 2, 7 et 10 pour développer l’export ; étape 12 obligatoire pour valider le jalon J3 avec les propositions acceptées dans les recettes.
**Sortie :** fichier de contrôle fiable et contrat préparé pour le futur lecteur. La boutique n’est pas requise.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 13.1 Matrice de diagnostics | Couvrir média absent/corrompu, annotation sans média, plage invalide, conflit musical, boucle invalide, clipping/niveau, source cassée, EPUB non supporté, erreur d’export et métadonnée requise. Fixer gravité et justification. | Une fixture par famille ; erreurs bloquantes empêchent export ; avertissements peuvent être ignorés explicitement. Source externe absente avec copie projet intacte ne devient pas arbitrairement une erreur fatale. |
| 13.2 Pré-export | Résumé, navigation vers défauts et estimation audio/images/polices/autres ; choix Ultra léger, Équilibré, Haute qualité et Personnalisé. | Chaque diagnostic pointe sa cible ; projet invalide bloqué ; valeurs de preset réellement utilisées et réglages personnalisés contrôlés. |
| 13.3 Encoder et dédupliquer | Sources de production intactes, médias utilisés uniquement, encodage Opus privilégié et comparaison qualité/taille/coût ; traitements en arrière-plan. | Deux occurrences partagent le même média exporté sans perdre réglages ; fichier inutilisé absent ; annulation ne laisse aucun export présenté valide ; tests d’écoute sur tous les presets. |
| 13.4 Contrat .jacko | Définir version, contenu, ressources, déclenchements, identité livre, intégrité et extension de signature ; documenter contrat pour Jacques sans inventer son API. | Fichier exporté réimportable dans lecteur de contrôle ; version inconnue refusée sans altération ; données nécessaires au texte, médias et réglages présentes ; formats de travail et distribution distincts. |
| 13.5 Intégrité et signature | Checksums pour détection de corruption ; preuve distincte d’authenticité avec clés de signature de test. Définir les décisions restantes de confiance et garde des clés de publication pour l’extension Jacques. | Contenu modifié sans mise à jour des checksums détecté ; fixture signée altérée rejetée même avec checksums recalculés. Export de contrôle non signé jamais présenté comme authentifié ; clé de test jamais présentée comme signature de publication ; aucun secret global de signature dans le navigateur. |
| 13.6 Contrôle lecture seule | Rouvrir .jacko, reconstituer le livre et simuler ; aucune conversion implicite en projet de montage. | Parité des événements et paramètres avec .jacq sur corpus ; rendu FR/EN/arabe, notes/images et audio vérifiés ; outils d’édition absents ; comparaison d’écoute à tolérance définie. |
| 13.7 Mesurer l’export | Temps, mémoire, taille, estimation, qualité et parité de lecture ; limites explicites selon plateforme. | Écart estimation/taille ≤ 15 % après définition de la méthode ; débit cible section 5 ; compression apporte réduction mesurée sans seuil arbitraire de 10 Mo pour .jacko. Un moteur futur Jacques n’est pas déclaré compatible tant qu’il n’a pas été testé. |

**Jalon J3 :** logiciel de production complet avec collaboration et MCP ; export de contrôle disponible, publication Jacques différée.

# Étape 14 — Installation, sécurité et exploitation

**Prérequis :** socles 1 et 4 ; finalisation après J3.

**Sortie :** produit distribuable, maintenable et récupérable sur les machines cibles.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 14.1 Durcir Electron | Renderer isolé, sandbox, preload limité, validation IPC/origines, chemins et navigation ; traitement EPUB non fiable. | EPUB hostile ne lit aucun fichier arbitraire ; messages IPC forgés et chemins sortant du périmètre refusés ; aucune clé ou capacité système générale exposée à React. |
| 14.2 Distribuer Desktop | Builds Windows x64 et Mac Intel/Apple Silicon, installateurs signés, notarisation et ticket attaché macOS ; associations de fichiers. | Installation sur machines propres ; signature vérifiée ; ouverture .jacq ; premier lancement sur un autre Mac hors ligne ouvre l’application et explique l’activation requise ; après activation, parcours local complet. |
| 14.3 Distribuer le Web | HTTPS, cache versionné, mise à jour du service worker, migration coordonnée application/données ; disponibilité par navigateur. | Mise à jour interrompue laisse ancienne version cohérente ou nouvelle complète ; jamais mélange d’assets incompatibles ; démarrage offline sur route directe après préparation. |
| 14.4 Mettre à jour sans perte | Mises à jour vérifiées, notes de version, installation manuelle possible, sauvegarde avant migration ; stratégie de retour documentée. | Paquet modifié refusé ; panne pendant mise à jour n’endommage aucun projet ; retour vers version compatible ou restauration explicite ; désinstallation ne supprime pas les projets sans action distincte. |
| 14.5 Exploiter les services nécessaires | Services d’identité/invitations et composant privé ; journalisation minimale, supervision, sauvegardes et restauration. Proposer perte maximale de sauvegarde 24 h et remise en service en 4 h pour métadonnées ordinaires, à valider avant pilotes. Définir une protection plus stricte des révocations et accusés de réception. | Restaurer sur environnement neuf avec opérations partagées bloquées ; revalider les droits auprès de leur autorité et réconcilier identifiants, accusés et candidates selon 9.4–9.5 avant reprise. Aucun droit retiré ressuscité ni soumission dupliquée ; si la preuve manque, maintenir le blocage et conserver le travail local. Mesurer perte/durée réellement obtenues. |
| 14.6 Confidentialité et licences | Inventaire des dépendances, binaires, polices, sons et droits d’utilisation ; politique de conservation et diagnostics expurgés ; procédure de vulnérabilité. | Paquet livré associé à son inventaire et ses mentions ; aucun manuscrit dans télémétrie/logs/support sans action explicite ; distribution audio et FFmpeg vérifiée selon assemblage réellement livré. |
| 14.7 Aide et administration | Guide de démarrage, formation de production/révision, banques privées, récupération, cinq jours offline, archives et MCP ; diagnostic exportable par choix utilisateur. | Un utilisateur invité installe, importe, sonorise et soumet avec le guide ; un responsable restaure une copie et révoque un accès sans intervention sur fichiers internes. |

La signature d’application est distincte de la signature .jacko. Apple documente l’intérêt du ticket de notarisation attaché pour la distribution hors ligne. [Signature Electron](https://www.electronjs.org/docs/latest/tutorial/code-signing), [distribution Apple](https://developer.apple.com/documentation/xcode/packaging-mac-software-for-distribution). Pour FFmpeg, vérifier licences et options compilées du binaire effectivement distribué. [Conditions FFmpeg](https://ffmpeg.org/legal.html).

# Étape 15 — Performance, endurance et récupération à l’échelle réelle

**Prérequis :** mesures commencées dès 1.6 ; campagne complète sur J3 et builds 14.

**Sortie :** budgets démontrés et limites publiées avant ouverture générale.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 15.1 Mesurer toute la matrice | Rejouer la section 5 sur builds distribués et moteurs réels. Playwright Chromium/Firefox/WebKit complète mais ne remplace pas Safari réel. | Résultats par poste/navigateur et cache ; aucune cellule obligatoire omise ; les cibles adoptées en 0.4 sont tenues ou la release reste non qualifiée. |
| 15.2 Éprouver la charge combinée | Lecture, navigation, indexation, sauvegarde et export ; priorités et concurrence bornées. | Interface/audio restent dans budgets ; une opération longue est annulable ; aucun décodage de toute la banque ou de tout le projet en RAM. |
| 15.3 Démontrer la durabilité | Cent interruptions, disque plein, quota navigateur, permissions retirées, plusieurs onglets, projets sur stockage externe qualifié. | Zéro corruption silencieuse ; zéro perte d’état annoncé sauvegardé ; restauration éprouvée ; manipulations du cache ou des sources ne suppriment pas une copie indépendante. |
| 15.4 Tester les cinq jours | Horloges contrôlées pour limites, complétées par un essai réel de cinq jours sur les cibles ; reconnexion autorisée puis révoquée. | Fermetures/redémarrages ne prolongent pas le délai ; expiration conserve lecture/sauvegarde ; reconnexion révoquée archive et empêche tous les envois en attente. |
| 15.5 Vérifier endurance et accessibilité | Huit heures, 100 changements de projet ; clavier, zoom 200 %, lecteurs d’écran, RTL, petits écrans d’ordinateur et contraste. | Pas de croissance mémoire continue, erreur console, contrôle inaccessible ou texte masqué ; les types audio restent reconnaissables sans couleur ; simulation et sauvegarde stables. |
| 15.6 Optimiser sur mesures | Corriger les causes dominantes, indexer/cacher seulement si bénéfice prouvé ; fixer tailles supportées et messages hors limites. | Comparaison avant/après sur même corpus ; aucune optimisation ne modifie les ancres, la qualité audio ou la cohérence d’écriture ; hors budget déclaré explicitement, jamais dissimulé par un test réduit. |

# Étape 16 — Pilotes métier et première version de production

**Prérequis :** J3, 14 et 15 validés ; coûts d’exploitation connus.

**Sortie :** Jaquette prêt à être distribué gratuitement sur invitation dans son périmètre initial.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| 16.1 Pilote Maison | Une maison, deux Sound Designers, trois Réviseurs, un Chef et un Admin ; livre et banques dont l’usage est autorisé. | Production de chapitres distincts, conflit sur un même chapitre, deux cycles de correction, validation finale et export ; aucune manipulation technique des fichiers internes nécessaire. |
| 16.2 Pilote Auteur | Auteur indépendant, freelance invité, stockage choisi, multi-workspace et changement d’ordinateur. | Projet autonome, workflow adapté aux rôles attribués, partage/transfert testés ; aucun backend de contenu Jaquette nécessaire ; travail récupéré depuis une copie portable. |
| 16.3 Pilote MCP | Agent local et connexion distante autorisée ; navigateur appairé à Desktop ; rejet et acceptation de propositions. | Utilité confirmée par les utilisateurs ; aucune génération sonore, aucune modification directe du master, coût externe visible et fonctionnement local offline démontré. |
| 16.4 Fermer les anomalies | Corriger défauts, rejouer contrôles touchés, faire approuver les dettes admissibles. | Zéro défaut bloquant connu ; aucune dette sur sécurité, perte de données, ancres, permissions ou sauvegarde partielle ; contrôles obligatoires PASS. |
| 16.5 Qualifier la release candidate | Identifier commit, versions de formats, builds, matrice de compatibilité, preuves et procédure de retour ; vérifier capacité de support. | Installation et scénario complet depuis une machine propre, puis mise à jour depuis version pilote ; mêmes données retrouvées ; décisions humaines d’ergonomie/écoute consignées. |
| 16.6 Ouvrir la production sur invitation | Publier Web et installateurs selon canal retenu, activer invitations et supervision ; documentation de reprise à jour. | Un nouvel invité accomplit le parcours complet ; services restaurables et support joignable ; aucune UI ne prétend publier dans Jacques. Version applicative attribuée selon la convention du dépôt. |

## Critère final de la première livraison

Sur les cibles qualifiées, un utilisateur invité peut importer un EPUB FR/EN/arabe, placer et régler les trois types de sons, simuler, enregistrer, fermer et retrouver son travail, travailler cinq jours hors ligne, utiliser les médias embarqués sans banque accessible, obtenir un brouillon MCP, échanger des candidates sur son infrastructure, réviser et faire valider le livre, puis exporter et contrôler son résultat.

Un membre révoqué ne peut plus soumettre à la reconnexion ; son travail est conservé et son archivage sur disque accompagné jusqu’à vérification. Un refus d’enregistrement dans le navigateur laisse explicitement la copie indépendante à terminer, sans supprimer l’original. Les utilisateurs disposent de copies restaurables et les services nécessaires disposent d’une restauration éprouvée.

**La publication dans Jacques, les paiements et la génération sonore ne conditionnent pas cette livraison.**

---

# Extension F1 — Publication dans Jacques, après disponibilité du lecteur et de la boutique

**Prérequis :** première livraison stabilisée et projet Jacques disposant d’un contrat testable. Cette extension est planifiée mais ne bloque pas Jaquette.

| Sous-étape | Travail et livrable | Test d’acceptation |
|---|---|---|
| F1.1 Valider le contrat commun | Aligner texte, tokens, audio, spatialisation, limites, formats et versions avec le lecteur réel. | Le même fichier de référence est lu par Jacques et le contrôle Jaquette avec comportements conformes ; refus explicite des fonctions non supportées. |
| F1.2 Préparer les métadonnées | Titre commercial, sous-titre, auteurs, éditeur, couverture, résumé, langue, catégories, tags, ISBN éventuel, prix/devise, territoires, date, visibilité, public cible et numéro de version. | Champs requis validés ; avant validation finale, aucune préparation de publication montée ; après validation, préparation possible selon droits. |
| F1.3 Signer pour publication | Définir autorité de confiance, garde/rotation/révocation des clés et signature du contenu publié. | .jacko valide vérifié par Jacques ; altération et mauvaise clé rejetées ; aucune clé de production exposée dans le frontend ; rotation et restauration de clés éprouvées. |
| F1.4 Publier explicitement | Connexion API, envoi reprenable, validation distante, suivi ; bookId stable et releaseId propre à chaque publication. Passage à l’état publiable : génération automatique d’une tâche de publication, sans priorité. | Valider ne publie pas ; tâche créée Pas commencé, passage manuel En cours et achèvement automatique Terminée après publication confirmée ; double clic/retry ne crée ni deux tâches ni deux releases ; nouvelle publication produit nouveau releaseId sur même bookId. |
| F1.5 Mettre à jour un livre | Modification → annulation des validations concernées → nouveau cycle → nouvelle release. | Aucun nouveau doublage publié sans révision et validation requises ; précédente release et historique conservés. |
| F1.6 Dépublier | Actions Admin Maison et Super Admin, confirmation explicite et audit ; Chef sans ce droit direct. | Refus pour Chef ; confirmation obligatoire pour rôle autorisé ; état boutique et journal concordent après échec/retry. |
| F1.7 Qualifier l’intégration complète | Pilote réel Jaquette → Jacques, installation lecteur, lecture et cycle de retrait ; documentation utilisateurs. | Publication, achat/accès lecteur selon le produit Jacques, lecture, mise à jour et dépublication testés sur environnement intégré ; aucun succès simulé présenté comme preuve réelle. |

---

## Ordre de livraison et correspondance avec l’ancien plan

| Nouveau jalon | Étapes | Résultat démontré | Anciennes parties reprises |
|---|---|---|---|
| J0 — Choix éprouvés | 0–1 | Reprise reproductible, plateformes et risques principaux testés | Fin du prototype, décisions stockage, début Electron, frontières d’hébergement |
| J1 — Production locale minimale | 2–3 | Même mot et même son après fermeture/réouverture, sauvegarde partielle | Anciennes phases 3–6, partie 7, stockage phase 10 et Electron phase 19 avancés |
| Atelier complet | 4–7 | Invitation/offline, bibliothèque et moteur audio de production | Phases 2, 7–9, 21 et éléments de 19 |
| J2 — Collaboration opérationnelle | 8–10 | Soumissions privées, révision offline et décisions cohérentes | Phases 11–13 et 21–23 |
| Banques et IA | 11–12 | Banques privées et MCP utilisables au lancement | Bibliothèque Cloud ajoutée ; ancienne phase 20 replacée avant release |
| J3 — Produit complet de production | 13 | Contrôle qualité, export autonome et contrat lecteur | Phases 14–18, préparation de signature 17 |
| Première version distribuée | 14–16 | Installateurs/Web, performances, exploitation et pilotes validés | Stabilisation 25 enrichie, qualification desktop 19 |
| Extension Jacques | F1 | Publication réelle après création de Jacques | Ancienne phase 24 et signature de publication |

Les lots de reprise **0.1**, **0.2** et **0.3** sont validés ; leurs décisions et preuves sont consignées dans les PR 10, 11 et 9. La revalidation historique 1.4.2 est également VALIDÉE / GO, sans clôture de l’ancienne phase 1. **0.4 en cours, BLOQUÉE / NO-GO en attente des relevés matériels complets ; 0.5 non commencée.** L’ancienne 2.1 et la nouvelle étape 1 ne démarrent pas ici. Aucun numéro de cette feuille de route ne vaut validation automatique d’une livraison.
