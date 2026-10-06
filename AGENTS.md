# AGENTS.md — Jaquette

## 1. Rôle de ce fichier

Ce fichier définit les règles métier, produit et logicielles déjà validées pour **Jaquette**.

Il sert de référence de reprise pour tout agent IA ou développeur intervenant sur le projet.

À ce stade du projet, **aucune règle technique non explicitement décidée dans le cahier des charges ne doit être inventée ou considérée comme acquise**.

Le cahier des charges complet reste la source de référence détaillée. `AGENTS.md` en extrait les invariants et règles à ne pas enfreindre.

## État courant — 6 octobre 2026

Décisions du **6 octobre 2026**, [epic T-69](https://tickets.soyfki.com/tickets/T-69) et [T-70/JQ-01](https://tickets.soyfki.com/tickets/T-70). Les jalons A–H remplacent le calendrier de septembre pour les travaux futurs ; les autres invariants restent actifs. La [matrice D70](docs/validation/T-70/README.md) relie décisions, exigences, lots et oracles. Rédiger une exigence ne livre pas sa capacité.

Base intégrée de reprise : [main 4b183900a4a677c51c1d8150f7459f150c1ad033](https://github.com/Soyfki/Jaquette/commit/4b183900a4a677c51c1d8150f7459f150c1ad033). [PR12](https://github.com/Soyfki/Jaquette/pull/12) reste draft/non fusionnée, tête auditée 0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb ; documents/outillage, aucun changement src. **H-W18 historique reste BLOCKED/inconnu et 0.4 BLOQUÉE/NO-GO**. La CI historique de PR12 n'établit ni écoute physique ni fonctionnalité métier. Les budgets adoptés ne sont pas des mesures obtenues ; leur reprise et la porte technique sont réservées à JQ-02/T-71. Aucun rapport historique rempli n'est réécrit.

Le prototype React/TS/Vite présente quatre rôles et des données simulées. Import EPUB, ancres persistantes, audio, stockage, identité/permissions et MCP restent à construire. Version **0.0.0**.

### Historique intégré — septembre 2026

Les points suivants gardent leur date et leur portée ; les prochaines étapes mentionnées sont celles du calendrier historique, remplacé par A–H.

- Le cadrage du **11 septembre 2026** dans le [plan](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) remplace l’ancien calendrier sur ses seuls sujets.
- Acquis historiques : ancienne phase 0, anciennes sous-étapes 1.1, 1.2, 1.3 et lot 1.4.1.
- Le prototype propose quatre rôles simulés : Sound Designer, Réviseur, Chef d’équipe et Admin Maison ; Sound Designer reste initial et la simulation n’est pas persistée.
- Les quatre rôles et les corrections du prototype sont qualifiés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9), branche historique codex/phase-1-4-2-team-lead-admin-variants conservée. Le SHA historique 5cabbb016d3ce5480b165512c1aa7814b8367802 a été repris après intégration de main 0.2 ; la PR consigne les SHA de recette, de clôture documentaire et de squash.
- L’ancien lot 1.4.2 est acquis après sa revalidation technique et humaine du 18 septembre 2026 ; cette acquisition ne clôture ni l’ancienne 1.4 ni l’ancienne phase 1.
- L’ancien 1.4.3 n’est plus une prochaine livraison autonome. Aucun périmètre précis n’a été retrouvé dans l’ancien plan ; les reliquats réellement identifiables sont à inventorier en 0.3/0.5 puis à rattacher aux futures sous-étapes correspondantes, sans exigences rétroactives.
- Aucune clôture rétroactive de l’ancienne 1.4 ou de l’ancienne phase 1 ; l’ancienne phase 2 n’est pas commencée.
- La nouvelle étape 0 est distincte de l’ancienne phase 0 acquise. 0.1 et 0.2 sont validées (PR 10 et 11). **0.3 — Corriger les défauts du prototype** et la **revalidation historique 1.4.2** sont **VALIDÉES / GO**, décisions distinctes du 18 septembre 2026 après campagne technique et observations humaines complètes au SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`. L’intégration et les contrôles au dernier SHA sont tracés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9). Le [rapport](docs/validation/0.3-correctifs-prototype/VALIDATION_REPORT.md) conserve les observations et les reprises. 0.4 est la prochaine sous-étape du plan, non commencée ici.
- Le socle de qualification 0.2 fixe Node 24.19.0, pnpm 11.19.0, installation frozen-lockfile, six références canoniques vérifiées et CI Chrome sur PR/main. Voir le [guide](docs/REPRODUCIBILITY.md). Ce socle ne qualifie pas les fonctions métier simulées ni toute la matrice produit.
- Le recadrage REC-01 est conservé et complété par les règles d’échanges connectés de septembre.
- La version de l’application reste **0.0.0**. Une simulation n’est ni une capacité réelle ni une permission.
- Les propositions de stockage (section 4 du plan) attendent les preuves et la décision en nouvelle 1.2 ; les performances (section 5) restent des cibles proposées à fixer en 0.4, pas des résultats acquis.

### Règle de travail pour les futurs contributeurs

Flux courant : whoami → protocole vivant atk://protocol complet → lecture du ticket précis → claim_ticket frais → heartbeat à l'intervalle fourni → travail de l'étape → preuves → une issue autorisée. Un claim visible dans whoami ne donne pas sa propriété ; ne jamais adopter ou renouveler le claim d'une autre conversation. Une conversation par ticket, une capacité/PR cohérente ; seuls les claims acquis ici sont mutés. Respecter dépôt, base et branche AT ; clone isolé si l'origine est modifiée, jamais checkout/reset/stash/clean destructif de l'origine.

Spécification : plan en commentaire AT ou docs/plans/T-<n>.md, puis rapport. Développement : suivre le plan, tests requis par l'étape, commit, branche publiée et **PR draft**, preuves et critères réellement vérifiés. Revue agent : contrôle distinct de l'auteur, sans push ; rapport et verdict. Validation humaine AT conservée ; la fusion éventuelle appartient à l'humain. **Aucun agent ne fusionne, ne pousse la base, ni ne déploie.** La CI est relue à la tête courante de la PR, sans succès hérité d'un ancien SHA. Préserver les autres tickets/claims, notamment T-2.

Un seul propriétaire à la fois pour scheduler/routage/ProjectPage ; traitements dans des modules dédiés sur les contrats JQ-22/T-92. Ne pas lancer deux lots qui modifient le même cœur simultanément.

- Respecter les règles listées ici.
- Ne pas modifier une règle métier implicitement pour simplifier une implémentation.
- Ne pas inventer de convention technique, d’architecture ou de dépendance non encore validée.
- Lorsqu’un choix nécessaire n’est pas défini, le signaler comme décision à prendre au lieu de l’ériger en règle.
- Toute nouvelle décision métier importante doit être répercutée dans le cahier des charges puis dans ce fichier.
- Ne jamais placer de secret, mot de passe ou identifiant sensible en clair dans le dépôt.

---

# 2. Produit et vocabulaire

Dans ce mandat, « doublage » signifie habillage par **SFX, Ambiance et Musique**. Aucune narration, voix de personnage, TTS, clonage vocal ou génération sonore. Des brouhahas/murmures indistincts issus de médias existants sont permis en SFX/Ambiance. Aucune extension de génération n'est automatiquement autorisée.

## Jaquette et Jacques

- **Jaquette** est le logiciel de production et de doublage audio des livres.
- **Jacques** est l’application propriétaire de lecture et la boutique de distribution.
- Ne jamais confondre les deux produits dans le vocabulaire, les écrans ou la documentation.

## Terminologie audio officielle

Les trois types de pistes sont :

1. **SFX**
2. **Ambiance**
3. **Musique**

Le terme métier **« son ponctuel » est abandonné**.

Dans l’interface, la documentation et les nouveaux concepts métier, employer **SFX**.

## Principe produit central

**Le texte est la timeline de Jaquette.**

Les sons sont associés à des mots ou à des plages de mots, et non à une timeline temporelle classique.

---

# 3. Formats de travail et de distribution

Premier atelier D/T-103 : .jacq autonome, .jacko non requis. Test suivant E : export/contrôle .jacko, obligatoire V1. Signature de test, intégrité et authenticité de publication F1 sont distinctes.

## `.jacq`

- `.jacq` est le fichier de travail éditable de Jaquette et représente le projet complet.
- Il contient une section physique `.chpt` par chapitre.
- Une modification de chapitre doit pouvoir réécrire physiquement son seul `.chpt` sans réécrire les autres chapitres du projet.
- Il rend le projet autonome en embarquant les sons réellement utilisés et conserve les informations nécessaires au travail, à la révision, aux versions et au projet.
- Toute information qui n’appartient pas exclusivement à un seul chapitre est une information commune du `.jacq` et reste séparée des `.chpt`.
- Cette règle couvre notamment l’EPUB source, la structure textuelle globale et les identifiants nécessaires à sa cohérence, les métadonnées du livre et du projet, les paramètres généraux, les affectations globales, les versions nommées, les consentements IA, les commentaires et tâches ciblant le livre, ainsi que toute information partagée par plusieurs chapitres. Cette liste est un minimum normatif, pas une liste exhaustive champ par champ.
- Une donnée clairement propre à un chapitre reste dans son `.chpt`.
- Les traitements audio de production sont non destructifs.
- Le choix du conteneur et les détails de sérialisation restent ouverts. `.jacq` ne doit pas être considéré comme un simple ZIP tant que la compatibilité de cette technologie avec la sauvegarde partielle n’est pas démontrée.

## `.chpt`

- `.chpt` est l’unité physique de sauvegarde, d’échange, d’import et de fusion d’un chapitre.
- Un `.chpt` exporté est une version candidate : son import pour révision ne remplace pas la version validée du chapitre.
- Il transporte au minimum l’identité du projet et du livre, l’identifiant stable du chapitre, sa base et sa filiation, les données de doublage, les annotations et réglages audio, les médias utilisés, les commentaires et tâches du chapitre, les validations et leur historique, ainsi que les informations d’auteur, de date et d’audit nécessaires.
- Les médias identiques sont dédupliqués par empreinte lors de l’intégration.
- Aucun schéma physique, technologie de stockage, numéro de version ou champ de version de `.jacq` ou `.chpt` n’est encore décidé.

## `.jacko`

- `.jacko` est le fichier final destiné à Jacques.
- Il n’est pas le fichier de production.
- Il contient le contenu du livre, les ressources nécessaires à la lecture, l’audio compressé, le manifeste de déclenchements et les métadonnées nécessaires.
- Le format `.jacko` est versionné.
- Un `.jacko` destiné à la publication doit être signé numériquement en F1.
- Au lancement, l’export de contrôle et les checksums d’intégrité sont distincts de l’authenticité. Les essais de signature avec clés de test ne valent pas signature de publication ; un export non signé n’est jamais présenté comme authentifié.
- L’autorité de confiance et la garde des clés de publication sont à définir en F1 ; aucun secret global de signature dans le navigateur.
- Une modification du contenu signé doit pouvoir être détectée.
- Jaquette doit pouvoir rouvrir un `.jacko` en **mode contrôle / lecture seule** afin de vérifier un export.
- Un `.jacko` ouvert pour contrôle ne devient pas une source de production.

---

# 4. Import et texte du livre

EPUB2/3 reflowable réel sans annotations sonores ; manuel complet sans API. Segmentation/identifiants persistés, aucune retokenisation silencieuse. Web et Desktop Windows dès l'atelier D ; noyau commun, sans monorepo imposé.

## Format source

- La première livraison importe des **EPUB reflowables**.
- Les PDF sont hors périmètre.
- Les EPUB fixed-layout sont reportés.
- Les EPUB protégés par DRM sont refusés explicitement.
- Le lancement Web complet cible Chrome, Firefox et Safari sur ordinateur ; Safari est qualifié sur macOS. Electron Windows/macOS est également requis au lancement.
- Le format source cible est d’environ 10 Mo maximum.
- Les langues à prendre en charge incluent le français, l’anglais et l’arabe.
- Le contenu multilingue et RTL doit être pris en charge.
- Les images, tableaux, notes, styles et éléments éditoriaux pertinents de l’EPUB doivent être conservés autant que possible.

## Texte non éditable

- Le texte du livre ne peut pas être corrigé ou réécrit dans Jaquette.
- Jaquette est un outil de doublage, pas un éditeur de texte.

## Ancrage textuel

- Chaque mot/token utile doit posséder un identifiant logique stable.
- Les annotations audio s’ancrent sur cette structure logique.
- Les coordonnées d’affichage ne sont jamais la source de vérité.
- Les coordonnées peuvent être utilisées comme information de rendu ou de lecture, mais une annotation ne doit pas dépendre uniquement d’elles.
- La stabilité des identifiants textuels après fermeture/réouverture est un invariant critique.

## Limites de sélection

- Une annotation ne traverse jamais plusieurs chapitres.
- Une même plage peut recevoir plusieurs annotations de types différents.

---

# 5. Sélection du texte

Les interactions métier prévues sont :

- clic simple : sélectionner un mot ;
- clic-glisser : sélectionner une plage de mots ;
- `Shift + clic` : étendre une sélection ;
- double clic : sélectionner une phrase ;
- triple clic : sélectionner un paragraphe ;
- sélection directe possible d’un paragraphe ou d’un chapitre via une commande adaptée.

---

# 6. Règles audio — SFX

- Un SFX peut être attaché à un seul mot ou à une plage de mots.
- L’usage recommandé est un déclenchement sur un mot précis.
- Une même plage peut déclencher plusieurs SFX.
- Un SFX lancé joue jusqu’à sa fin.
- Maximum : **3 SFX simultanés**.
- Si un quatrième SFX démarre alors que trois sont déjà en cours, **le plus ancien est interrompu**.

---

# 7. Règles audio — Ambiances

Une ambiance peut notamment avoir :

- début et fin textuels ;
- fichier audio ;
- volume ;
- point d’entrée ;
- trim ;
- boucle ;
- zone de boucle ;
- fade-in ;
- fade-out ;
- normalisation ;
- ducking ;
- spatialisation.

Règles :

- plusieurs ambiances peuvent être actives simultanément ;
- si la boucle est activée, l’ambiance se répète jusqu’à la fin de sa plage textuelle ;
- si la boucle est désactivée, elle joue une seule fois ;
- si le média dépasse la fin de la plage, il doit s’arrêter ou effectuer son fade de sortie à la fin de la plage.

---

# 8. Règles audio — Musiques

- Une musique suit les mêmes principes généraux de plage, volume, boucle, fade et spatialisation qu’une ambiance.
- **Une seule musique principale peut être active à la fois.**
- Deux musiques peuvent se chevaucher uniquement pendant un crossfade.
- Le remplacement d’une musique par une autre doit donc être progressif.

---

# 9. Mixage et édition audio

Chaque occurrence audio peut disposer de réglages propres, notamment :

- volume ;
- point d’entrée ;
- point de sortie / trim ;
- boucle ;
- zone de boucle ;
- fade-in ;
- fade-out ;
- normalisation ;
- ducking ;
- spatialisation ;
- mute ;
- solo.

Règles :

- les éditions sont non destructives ;
- la normalisation est disponible et désactivable ;
- le ducking est réglable par occurrence ;
- la spatialisation est une spatialisation 3D autour du lecteur ;
- l’intention spatiale doit être utilisable pour une restitution au casque comme sur haut-parleurs.

## Fades liés au texte

- Les fades peuvent être définis sur une plage de mots.
- Ils ne doivent pas être conçus uniquement comme une durée temporelle fixe.
- Le moteur de lecture peut interpréter cette plage en fonction de l’avancement réel de lecture.

---

# 10. Bibliothèque audio

La bibliothèque intégrée porte provenance et licences. L'utilisateur peut importer explicitement fichiers et dossiers personnels, privés par défaut. Indexer conserve la hiérarchie sans copier toute la banque ; un son utilisé est intégré au projet. Partager vers équipe ou bibliothèque commune est volontaire : périmètre, autorisation, droits d'usage et confirmation explicites. Importer ne publie ni ne mutualise. Recherche, cache, MCP et diagnostics respectent le cloisonnement ; retirer un partage ne détruit pas les médias déjà utilisés dans un projet autorisé.

## Organisation

- Jaquette peut indexer plusieurs dossiers de bibliothèque et utiliser des banques privées de maison/équipe sur l’infrastructure choisie.
- Les médias utilisés restent disponibles après retrait du son ou perte d’accès à la banque.
- La hiérarchie dossiers / sous-dossiers doit rester exploitable.
- Les fichiers ne sont pas dupliqués simplement parce qu’ils sont indexés.
- Lorsqu’un fichier est effectivement utilisé dans un projet, une copie est intégrée au `.jacq`.
- Un projet ne doit donc pas devenir inutilisable parce que sa bibliothèque source a été déplacée ou supprimée.

## Mise à jour

- Si un fichier source de bibliothèque change après son utilisation dans un projet, Jaquette peut signaler qu’une nouvelle version existe.
- La mise à jour depuis la bibliothèque doit être une action explicite.
- Une source utilisée dans un projet ne doit pas être remplacée silencieusement.

## Fonctions définies

La bibliothèque prévoit :

- recherche ;
- catégories structurées ;
- tags libres ;
- favoris ;
- collections ;
- métadonnées de fichier ;
- nombre d’utilisations ;
- préécoute ;
- drag-and-drop.

La waveform n’est pas requise au lancement.

## Catégorisation

La taxonomie peut notamment décrire :

- type ;
- environnement ;
- lieu ;
- météo ;
- émotion ;
- intensité ;
- temporalité.

Un même son peut appartenir à plusieurs catégories ou collections.

---

# 11. Déduplication et export audio

- Les médias identiques doivent pouvoir être détectés afin d’éviter des duplications inutiles dans le `.jacko`.
- Le `.jacq` conserve les sources de production.
- Le `.jacko` contient des versions optimisées pour la distribution.
- Les presets d’export définis sont :
  - Ultra léger ;
  - Équilibré ;
  - Haute qualité ;
  - Personnalisé.
- La priorité de l’export est de réduire fortement le poids sans imposer une limite arbitraire de 10 Mo.
- Jaquette doit pouvoir afficher une estimation du poids final et sa répartition.
- Opus est le codec privilégié actuellement prévu pour les ressources audio du format propriétaire.

---

# 12. Prévisualisation et simulation

Jaquette doit proposer :

## Simulation par pointeur

- La souris peut simuler le regard du lecteur.

## Lecture automatique

- vitesse exprimée en mots par minute ;
- contrôles x1, x2 et x4 ;
- mise en évidence du mot actif.

## Lecture ciblée

- lire une sélection ;
- lire depuis une sélection ;
- lire un chapitre.

Les familles SFX, Ambiance et Musique doivent pouvoir être mises en mute ou solo lors de la simulation.

---

# 13. Contrôle qualité

Jaquette doit pouvoir détecter au minimum les familles de problèmes déjà définies :

- média manquant ;
- média corrompu ;
- plage invalide ;
- annotation sans média ;
- incohérence de chevauchement musical ;
- boucle invalide ;
- clipping potentiel ;
- niveau excessif ;
- source de bibliothèque cassée ;
- élément EPUB non supporté ;
- erreur d’export ;
- métadonnée obligatoire manquante.

Règles :

- une **erreur bloquante** empêche l’export ;
- un **avertissement** peut être ignoré.

---

# 14. Sauvegarde et historique

- Autosave permanent.
- Undo/redo limité à **50 actions**.
- Les versions nommées sont distinctes de l’undo/redo.
- Les versions nommées doivent rester disponibles dans le temps.

---

# 15. Identité utilisateur

## Identité globale

- Une personne possède une identité Jaquette globale.
- Une identité peut avoir plusieurs adresses e-mail vérifiées.
- Une personne peut utiliser une adresse professionnelle et une adresse personnelle sans devoir rester définitivement séparée en deux identités.
- Plusieurs comptes existants doivent pouvoir être liés/fusionnés après vérification du contrôle des adresses concernées.
- La fusion doit conserver projets, appartenances, commentaires, tâches de workflow, historique et droits contextuels.
- Aucune fusion automatique ne doit être faite sur le nom ou l’adresse IP.
- L’adresse IP n’est pas un identifiant utilisateur.

## Contexte et permissions

Les permissions ne sont pas une propriété globale de la personne.

Elles dépendent du contexte :

**identité → workspace → équipe → projet**

Une même personne peut donc avoir plusieurs rôles selon la maison ou l’équipe.

---

# 16. Workspaces

Deux catégories de workspace sont définies :

1. **Maison d’édition**
2. **Auteur indépendant**

Un utilisateur peut accéder à plusieurs workspaces et changer rapidement de contexte.

Le changement de workspace doit donner une expérience de switch comparable aux outils multi-espaces modernes : chaque contexte conserve ses équipes, projets, tâches et permissions.

---

# 17. Rôles et permissions

Les droits de préparation de publication, publication et retrait de boutique ci-dessous sont conservés pour l’extension F1. Ils ne constituent pas des opérations réelles du lancement. Les interdictions de montage et les permissions contextuelles restent applicables.

## Super Admin Jaquette

- Administre la plateforme globale.
- Peut intervenir sur l’administration globale de Jacques.
- Peut retirer un contenu de la boutique.
- Ne reçoit pas automatiquement des droits de montage ou de validation éditoriale.

## Admin Maison d’édition

Droits d’administration et de management uniquement.

Peut notamment :

- gérer le workspace ;
- inviter ou suspendre des membres ;
- créer des équipes ;
- affecter les Chefs d’équipe ;
- gérer les projets ;
- consulter les tableaux de bord ;
- retirer un livre publié dans Jacques.

Ne peut pas automatiquement :

- modifier le doublage ;
- réviser ;
- valider éditorialement ;
- publier au titre d’un rôle métier.

Un rôle métier supplémentaire est nécessaire pour ces actions.

## Sound Designer

Peut notamment :

- éditer le `.jacq` ;
- créer, modifier et supprimer des événements audio ;
- gérer les sons utilisés ;
- exécuter les tâches générées par le workflow ;
- répondre aux commentaires ;
- créer une version ;
- exporter un chapitre candidat au format `.chpt` ;
- déclarer un chapitre terminé.

Ne peut pas :

- valider une révision ;
- publier ;
- administrer le workspace.

Un Sound Designer peut appartenir à plusieurs équipes et plusieurs maisons d’édition.

## Réviseur

Peut notamment :

- ouvrir le livre ;
- lancer des simulations ;
- consulter les annotations ;
- commenter ;
- proposer une candidate complète comme candidate active à examiner lorsque plusieurs candidates concurrentes existent pour un chapitre ;
- valider ou invalider un chapitre ;
- valider ou invalider une version ;
- soumettre le projet au Chef d’équipe une fois les validations requises obtenues.

Ne peut jamais modifier le doublage audio.

## Chef d’équipe

Peut notamment :

- gérer les membres et projets de ses équipes ;
- affecter collaborateurs et chapitres ;
- suivre les tableaux de bord ;
- lancer des simulations ;
- commenter ;
- rejeter vers un Réviseur ;
- rejeter vers un Sound Designer ;
- valider le livre final ;
- préparer la publication ;
- publier dans Jacques.

Le Chef d’équipe **ne modifie jamais directement le montage audio**.

## Auteur indépendant

- Possède un workspace personnel.
- Peut inviter des freelances.
- Peut attribuer les rôles nécessaires à son projet.
- Peut suivre la production et la révision.
- Est décideur final dans son espace.
- Peut publier dans Jacques.

---

# 18. Équipes et affectations

- Un utilisateur peut avoir un rôle différent selon l’équipe.
- Les membres d’une équipe peuvent voir les projets de l’équipe.
- Les droits de modification et de commentaire dépendent de l’affectation au projet et du rôle.
- Plusieurs Sound Designers peuvent travailler sur le même projet.
- Les Sound Designers peuvent être affectés par chapitre.
- Un Chef d’équipe peut gérer plusieurs équipes.
- Lors de l’import d’un `.chpt`, un assigné n’est mis en correspondance automatiquement que si son identifiant Jaquette global est strictement identique et si cette personne possède les droits nécessaires dans le projet cible.
- Aucune correspondance silencieuse n’est effectuée par nom, adresse IP ou adresse électronique non vérifiée.
- Si l’identité d’origine n’est pas reconnue ou n’est pas autorisée, l’import ne finalise pas automatiquement l’affectation : le Chef d’équipe choisit explicitement un assigné autorisé, ou l’Auteur indépendant dans son workspace.
- L’identité et l’assigné d’origine restent dans l’historique et l’audit. Une réaffectation explicite ne réécrit jamais l’auteur historique de la contribution.

---

# 19. Accueil et navigation projet

L’accueil doit être conçu comme un espace de gestion de travail comparable dans son principe à Figma.

L’accueil est un tableau de bord général distinct de l’écran projet. Il permet de consulter simultanément toutes les équipes et tous les projets du jeu disponible dans le workspace. Chaque projet expose nom, équipe, statut et progression ou activité ; chaque équipe expose nom, nombre de membres et projets associés ou leur nombre.

Il doit mettre en évidence :

- workspace courant ;
- équipes ;
- projets ;
- Drafts ;
- projets récents ;
- tâches personnelles ;
- collaborateurs ;
- progression ;
- statut ;
- dernière activité ;
- alertes.

---

# 20. Interface adaptée au rôle

L’interface ne doit pas simplement afficher tous les outils en désactivant ceux qui sont interdits.

Elle doit s’adapter au rôle.

## Sound Designer

Vue centrée sur :

- bibliothèque ;
- livre ;
- inspecteur audio.

## Réviseur

Vue centrée sur :

- livre plus large ;
- simulation ;
- commentaires ;
- candidates de chapitre ;
- validation.

Les outils de montage et la bibliothèque peuvent être masqués.

## Chef d’équipe

Vue centrée sur :

- dashboard ;
- progression ;
- lecture / simulation ;
- historique ;
- commentaires ;
- validation finale ;
- publication.

## Admin Maison

Vue centrée sur :

- membres ;
- équipes ;
- invitations ;
- projets ;
- permissions ;
- audit.

---

# 21. Drafts, versions, tâches et commentaires

## Drafts

Le mot **Drafts** désigne le pool de livres ou projets qui ne sont pas encore affectés à une équipe ou pas encore réellement démarrés.

## Versions

Le mot **Versions** désigne les états de travail successifs d’un projet actif.

Ne pas confondre les deux concepts.

## Tâches

- Le concept fonctionnel de ticket est abandonné : il ne doit exister ni comme objet, ni comme écran, ni comme workflow, ni comme entrée de tableau de bord.
- Les tâches sont générées automatiquement par les affectations et le workflow ; elles ne forment pas un gestionnaire de tâches libres.
- Une tâche cible un livre ou un chapitre, possède un assigné, peut avoir une échéance et ne possède aucune priorité.
- Ses seuls statuts sont `Pas commencé`, `En cours` et `Terminée`.
- Elle est créée avec `Pas commencé`, passe manuellement à `En cours`, puis automatiquement à `Terminée` lorsque l’action métier attendue est accomplie.
- Les cas obligatoires comprennent : doubler un chapitre, réviser un chapitre et corriger un chapitre invalidé ; publier un livre dans Jacques reste obligatoire en extension F1.
- En F1, le passage à l’état publiable génère la tâche automatique de publication, sans priorité ; elle se termine après confirmation de publication, sans doublon lors d’un réessai.
- Une invalidation crée une nouvelle occurrence de tâche de correction. Elle ne réutilise pas l’ancienne tâche et ne détruit pas l’historique des cycles précédents.
- Les tâches pertinentes voyagent dans le `.jacq` et dans le `.chpt` lorsqu’elles ciblent le chapitre exporté.

## Commentaires

- Un commentaire peut cibler le livre entier, un chapitre entier, un mot ou une plage de mots, ou une occurrence audio placée dans la timeline textuelle.
- Un commentaire sur une occurrence audio ne cible jamais le fichier de la bibliothèque.
- Sa présentation dépend de sa cible : vue globale du projet ou de la révision, espace du chapitre, passage textuel, annotation ou inspecteur de l’occurrence.
- Les réponses sont organisées en fil et les seuls états sont `Ouvert` et `Résolu`.
- L’historique des modifications, l’auteur et les dates sont conservés ; aucune suppression définitive n’est autorisée.
- Les identifiants sont stables afin d’éviter les duplications pendant l’import ou la fusion.
- Les commentaires du chapitre, de son texte ou de ses occurrences voyagent avec son `.chpt`. Les commentaires du livre restent dans la section commune du `.jacq`.

---

# 22. Progression du projet

Ne pas réduire l’avancement à un seul pourcentage.

Trois axes sont définis :

## Doublage

Pourcentage basé sur les chapitres déclarés terminés par les Sound Designers.

## Révision

Progression basée sur le nombre de validations attendues réellement obtenues.

Exemple :

- 10 chapitres ;
- 3 réviseurs ;
- 30 validations attendues ;
- 21 obtenues ;
- progression de révision : 70 %.

## Validation finale

Prêt à publier et Publié sont des états de l’extension F1 ; au lancement, la validation finale mène à l’export et au contrôle.

États prévus :

- Non soumis ;
- En attente Chef ;
- À corriger ;
- Validé ;
- Prêt à publier ;
- Publié.

---

# 23. Workflow éditorial

Le workflow complet conserve sa destination F1. Au lancement, validation finale puis export et contrôle ; les états Prêt à publier/Publié et la publication effective relèvent de F1.

Workflow principal :

```text
Draft
→ Affecté à une équipe
→ Doublage
→ Prêt à réviser
→ Révision
→ Soumis au Chef d’équipe
→ Validation finale
→ Prêt à publier
→ Publication Jacques
```

Retours autorisés :

- Réviseur → Sound Designer pour corrections ;
- Chef d’équipe → Réviseur ;
- Chef d’équipe → Sound Designer.

## Cycle offline d’un chapitre

1. Le Sound Designer travaille localement sur un chapitre et exporte un `.chpt` candidat.
2. La candidate est importée pour révision sans écraser la version validée.
3. Les Réviseurs la contrôlent.
4. Après toutes les approbations requises, elle devient la version validée du chapitre dans le `.jacq`.

Des contributions sur des chapitres différents s’intègrent sans conflit lorsque leur identité et leur filiation sont compatibles. Une origine incompatible, une filiation inconnue ou une modification concurrente des informations communes interdit toute intégration silencieuse.

---

# 24. Règles de révision

Chaque chapitre possède un état de révision par Réviseur :

- Non révisé ;
- À corriger ;
- Validé.

Règles :

- Tous les Réviseurs affectés doivent approuver le chapitre.
- S’il y a 1 Réviseur, 1 validation est nécessaire.
- S’il y en a 3, 3 validations sont nécessaires.
- Une invalidation doit être accompagnée d’un commentaire expliquant la correction attendue et génère une nouvelle tâche de correction.
- Si un Sound Designer modifie l’audio d’un chapitre déjà validé, les validations actives de ce chapitre sont annulées.
- Le chapitre repasse alors à l’état `À réviser`.
- Les validations précédentes restent conservées dans l’historique.
- Ces règles s’appliquent à chaque candidate `.chpt` et à chaque cycle de correction offline.
- Deux versions concurrentes du même chapitre restent des candidates distinctes. Aucun merge détaillé de leurs annotations ou réglages n’est effectué.
- Tout Réviseur affecté peut proposer une candidate complète comme candidate active à examiner. Cette proposition ne vaut ni sélection définitive ni validation.
- La candidate active ne peut rejoindre la version validée du chapitre qu’après l’approbation de tous les Réviseurs affectés.
- En cas de désaccord, le chapitre reste bloqué et aucune candidate n’est intégrée. Il n’existe ni vote majoritaire ni arbitrage du Chef d’équipe sur le choix éditorial de la candidate.
- Une autre candidate peut être proposée explicitement. Deux propositions concurrentes ne se remplacent jamais silencieusement.
- Toutes les candidates et décisions précédentes restent consultables avec leur auteur, leur base et leur date. Aucun fichier n’est détruit silencieusement.
- Le bouton de soumission au Chef d’équipe n’est disponible que lorsque toutes les conditions de révision sont satisfaites.

---

# 25. Publication vers Jacques

**Extension F1**, après disponibilité du lecteur et de la boutique Jacques. Les capacités, métadonnées et règles de retrait ci-dessous sont conservées, mais ne conditionnent pas le lancement.

## Validation ≠ publication

La validation finale et la mise en boutique sont deux actions distinctes.

Workflow :

```text
Validé
→ Prêt à publier
→ Publier dans Jacques
```

La préparation de publication n’est présentée qu’après validation finale. Avant Validé, notamment Non soumis, En attente Chef et À corriger, aucun panneau, bouton, contrôle ni métadonnée de préparation ne doit être monté ; un contrôle désactivé ne suffit pas. Après validation, la préparation réelle reste réservée à F1.

## Métadonnées de publication

Jaquette gère avant publication notamment :

- titre commercial ;
- sous-titre ;
- auteur(s) ;
- maison d’édition ;
- couverture ;
- résumé ;
- langue ;
- catégories ;
- tags ;
- ISBN éventuel ;
- prix ;
- devise ;
- territoires ;
- date de sortie ;
- visibilité ;
- public cible si nécessaire ;
- numéro de version.

## Version d’un livre publié

- `bookId` reste stable pour le même livre.
- Chaque publication dispose d’un `releaseId` propre.
- Une nouvelle version du doublage doit repasser par le workflow de révision et de validation avant publication.

## Dépublication

Peuvent dépublier :

- Admin Maison d’édition ;
- Super Admin Jaquette.

Le Chef d’équipe ne dépublie pas directement.

Toute dépublication doit être explicitement confirmée et journalisée.

---

# 26. Auteur et Maison d’édition

Le modèle doit permettre deux opérations distinctes :

## Partager un projet avec une Maison d’édition

L’Auteur conserve la propriété mais donne un accès à la Maison selon les droits prévus.

## Transférer un projet à une Maison d’édition

La propriété du projet change après acceptation.

L’historique doit être conservé.

---

# 27. Confidentialité, accès et données

Tests gratuits avec mocks et fixtures licenciées ; aucun secret réel, compte, service payant ou achat implicite. Chaque utilisateur apporte son accès API personnel et paie ses usages ; aucune clé Noémie collective. Le parcours manuel reste complet sans API. Les coûts communs d'identité, invitations, hébergement et exploitation sont chiffrés au minimum pour au moins dix utilisateurs, séparément de BYOK, sans plafond mensuel inventé. Toute adoption de service, évolution du contrat de confidentialité ou dépense demande une décision utilisateur distincte regroupée, avant engagement.

Cloud central administratif seulement ; aucun upload implicite de livre, son, commentaire de contenu ou clé. Tout transport privé respecte ce contrat ou nécessite décision utilisateur distincte avant adoption.

- Jaquette est gratuit sur invitation. Activation initiale, première authentification et préparation de l’environnement exigent une connexion.
- L’autonomie est de cinq jours sans reconnexion. À expiration, nouvelles modifications et application de propositions IA sont bloquées ; consultation, sauvegarde et archivage du travail existant restent possibles.
- Une simple disponibilité du réseau ne renouvelle pas les droits. À reconnexion, droits recontrôlés avant tout envoi de soumission, commentaire ou décision, y compris ceux préparés hors ligne.
- En cas de révocation, aucun envoi ; le travail du contexte reste conservé et son archivage sur disque est accompagné jusqu’à vérification. Dans le navigateur, copie préparée ne signifie pas copie indépendante enregistrée. Annulation, refus ou échec conservent l’original et l’archivage à terminer.
- EPUB, manuscrits, .jacq, .chpt, sons, banques et commentaires de contenu restent localement ou sur l’infrastructure privée choisie par la maison ou l’auteur indépendant.
- Les services Jaquette sont limités à l’identité, aux invitations et aux données administratives explicitement autorisées. Aucun hébergement de manuscrits ou de banques audio sur Jaquette Cloud.
- Le travail est local ; soumissions, transmission des commentaires/décisions et actualisation des tableaux de bord sont connectées. Aucun montage partagé en direct.
- Réviseurs et Chefs peuvent télécharger en ligne puis lire, simuler et préparer commentaires/décisions hors ligne. Une décision préparée localement ne devient officielle qu’après acceptation par le service autorisé avec contrôle des droits.

---

# 28. Collaboration offline et conflits

La V1 fonctionne à tour de rôle : prise en main et passage de relais explicites, version reçue et état local non transmis visibles. L'offline ne garantit pas une exclusion globale instantanée. Deux copies divergentes restent des candidates distinctes sans écrasement. Pas de coédition live, CRDT, présence/curseurs distants ni merge détaillé des annotations. L'unanimité des Réviseurs affectés reste requise ; Réviseur et Chef ne montent jamais l'audio, y compris par commandes directes ou MCP. Les informations communes divergentes sont arbitrées explicitement et journalisées.

- L’ancien modèle de collaboration temps réel est abandonné.
- Aucun utilisateur ne voit en direct le travail des autres : Jaquette n’affiche ni présence distante, ni curseur ou sélection distante, ni modification live.
- La collaboration repose sur l’échange de fichiers `.chpt` et la validation de versions candidates.
- Des chapitres différents peuvent être intégrés sans conflit lorsque l’identité du projet, du livre et la filiation sont compatibles, sans réécrire ou écraser les autres chapitres.
- Deux versions concurrentes du même chapitre restent séparées jusqu’à la proposition explicite d’une candidate complète comme candidate active, puis à sa validation normale.
- Tout Réviseur affecté peut proposer la candidate active à examiner, sans que cette proposition vaille sélection définitive ou validation. L’unanimité des Réviseurs affectés est nécessaire pour l’intégrer ; un désaccord bloque le chapitre, sans majorité ni arbitrage du Chef d’équipe sur ce choix éditorial.
- Une autre candidate peut être proposée explicitement. Deux propositions concurrentes ne se remplacent jamais silencieusement et toutes les candidates et décisions restent dans l’historique.
- Une origine incompatible ou une filiation inconnue produit un conflit explicite.
- Toute information qui n’appartient pas exclusivement à un seul chapitre est commune au `.jacq` et reste hors des `.chpt`. Si deux copies la modifient différemment, aucune valeur ne gagne automatiquement : le Chef d’équipe arbitre, ou l’Auteur indépendant dans son workspace, et la décision est journalisée.
- À l’import, la correspondance automatique d’un assigné exige un identifiant Jaquette global strictement identique et des droits valides dans le projet cible. Une identité inconnue ou non autorisée suspend la finalisation de l’affectation jusqu’au choix explicite d’un assigné autorisé par le Chef d’équipe, ou par l’Auteur indépendant dans son workspace.
- Le nom, l’adresse IP et une adresse électronique non vérifiée ne permettent aucune correspondance silencieuse. L’identité et l’assigné d’origine restent audités et la réaffectation ne réécrit pas l’auteur historique.
- Il n’existe aucune fusion métier silencieuse et aucun fichier n’est détruit silencieusement.

---

# 29. Audit

Les événements importants à journaliser incluent notamment :

- connexion ;
- import ;
- modifications de projet ;
- création/suppression d’événements audio ;
- changement de statut ;
- génération, assignation, changement de statut et achèvement d’une tâche ;
- correspondance ou réaffectation explicite d’un assigné importé, avec conservation de l’identité d’origine ;
- export et import d’un `.chpt` ;
- détection de conflit ;
- proposition d’une candidate active, approbations et décisions associées ;
- intégration d’un chapitre validé ;
- arbitrage des informations communes ;
- création, réponse, résolution et modification d’un commentaire ;
- validation ;
- export ;
- publication ;
- dépublication ;
- consentement IA ;
- utilisation IA ;
- acceptation ou rejet d’une proposition IA.

---

# 30. IA et MCP

JQ-68/T-118 qualifie les routes BYOK et leur modèle de menace. Le Web exige une route sûre réellement qualifiée ou une limitation explicitement acceptée par l'utilisateur. JQ-43/T-121 exige les routes retenues, pas JQ-61/T-135 ET JQ-62/T-136 ; les alternatives non retenues restent conditionnelles, sans faux DONE. JQ-49/T-119 réalise le BYOK direct Electron si cette route est retenue. Aucun proxy, hébergeur, fournisseur ou chiffrement navigateur n'est adopté par ce document. Un chiffrement local accessible au même code ne protège pas d'un script compromis.

Suggestions disponibles V1 mais facultatives ON/OFF ; manuel intégral sans API. OFF zéro appel/exposition. Rejet, timeout et résultat tardif préservent le master ; acceptation autorisée par commandes ordinaires avec undo/audit. BYOK individuel, jamais clé collective ni secret dans renderer, formats, bundles, logs, diagnostics, prompts, MCP ou échanges.

## Principe

Le MCP sert à permettre à des agents IA de lire les informations explicitement exposées par Jaquette et de proposer un premier doublage.

## Accès

- MCP requis dès le lancement, avec agents externes utilisant exclusivement les bibliothèques autorisées, sans génération sonore.
- Fonctionnement hors ligne uniquement avec agent et modèle locaux. Tout transfert distant exige consentement et connexion ; un agent local ne rend pas son modèle distant local.
- Desktop peut fournir la connexion MCP locale au navigateur, avec appairage et ressources autorisées à qualifier.
- Un agent ne reçoit jamais un accès arbitraire au système de fichiers.
- Il ne voit que les ressources exposées explicitement par Jaquette.
- Les opérations proposées à l’agent doivent rester limitées aux capacités que Jaquette choisit d’exposer.

## Brouillon IA

- L’IA ne modifie jamais directement le master humain.
- Elle produit un brouillon de propositions.
- Elle peut proposer des ajouts, modifications ou suppressions d’annotations.
- Un humain peut accepter ou rejeter :
  - une proposition ;
  - un chapitre ;
  - l’ensemble des propositions.
- Après acceptation, les changements rejoignent le projet normal et son historique.

## Exclusions sonores

Dans ce mandat, « doublage » signifie habillage par **SFX, Ambiance et Musique**. Aucune narration, voix de personnage, TTS, clonage vocal ou génération sonore. Des brouhahas/murmures indistincts issus de médias existants sont permis en SFX/Ambiance. Aucune extension de génération n'est automatiquement autorisée.

---

# 31. Consentement IA

ON ne vaut pas consentement distant. Fournisseur et périmètre affichés, certification explicite avant transmission ; révocation contrôlée sur propositions tardives. Cache, recherche et ressources respectent les imports privés et leur partage volontaire.

Chaque projet possède un état :

- `IA interdite`
- ou `IA autorisée avec consentement`.

Avant la première transmission d’un contenu à un fournisseur IA distant :

- Jaquette doit demander une certification explicite que l’auteur ou l’éditeur a autorisé cet usage.
- Le fournisseur qui recevra le contenu doit être affiché.
- Le consentement doit pouvoir être révoqué.

Le journal de consentement conserve :

- personne ayant certifié ;
- compte ;
- date et heure ;
- fournisseur ;
- version du projet.

Une Maison d’édition peut interdire certains fournisseurs IA.

---

# 32. Règles d’interface et design déjà figées

Conserver la DA jusque polices, couleurs et formes. Rendre sélection, placement, préécoute, undo et sauvegarde compréhensibles et satisfaisants : interactions courtes, bornées et annulables, clavier, reduced motion, absence de flash et accessibilité. L'animation ne modifie ni ancres ni horloge audio. Aucun succès de sauvegarde avant confirmation durable récupérable.

## Typographies

- Interface Jaquette : **Manrope**.
- Corps du livre : **Literata**.
- Pour l’arabe, utiliser un fallback serif compatible lorsque Literata ne couvre pas les glyphes nécessaires.
- Les polices décoratives de l’EPUB peuvent être conservées lorsque pertinent.

## Formes

L’interface doit rester épurée.

Les éléments suivants utilisent des extrémités très arrondies / une forme capsule lorsque cela correspond au composant :

- boutons ;
- tags ;
- champs ;
- filtres.

## Palette générale

- Fond / noir : `#1B1B3A`
- Texte / blanc : `#EFF2FF`
- Accent : `#FFDFB2`
- Secondaire : `#74A4BC`
- Secondaire clair / validation : `#CFF2EC`

## Couleurs métier des pistes

Ces couleurs sont fixes dans l’application :

- **SFX** : `#FFAF87`
- **Ambiance** : `#E56399`
- **Musique** : `#9358FF`

La couleur ne doit pas être le seul indicateur d’une piste : prévoir également une distinction par icône, libellé ou position.

## Couleurs sémantiques

Succès :

- sur fond sombre : `#83B692`
- sur fond clair : `#355A40`

Échec / erreur :

- `#A20021`

## Page du livre

Même en mode sombre :

- fond de page : `#EFF2FF`
- texte : `#1B1B3A`

La page du livre doit visuellement se distinguer de l’interface sombre de Jaquette.

## Thèmes

- Au lancement : mode sombre.
- Mode clair : prévu plus tard.

---

# 33. Périmètre et jalons courants

Gratuit sur invitation, sans inscription ouverte ni paywall. Premier atelier Noémie seule D/JQ-29/T-103 sur Web et Desktop Windows : vrai EPUB, bibliothèque intégrée/fichiers/dossiers privés, trois familles, réglages/écoute/undo, .jacq fermé et rouvert offline après retrait des sources. C/T-86 avec un son ne vaut pas atelier complet. .jacko au test suivant E et obligatoire V1.

V1 pour au moins dix novices de métiers variés : Web complet Chrome/Firefox/Safari réel sur Mac, Electron Windows x64 et macOS arm64 M1. W18 aux développements/validations intermédiaires, M1 aux qualifications finales H ; Mac Intel hors cible active D04-04, références historiques conservées. Production manuelle sans API ; invitations/rôles/cinq jours, collaboration à tour de rôle et révision unanime, suggestions facultatives disponibles selon routes qualifiées, récupération et distribution.

Le [plan](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) porte A–H/F1 ; [D70](docs/validation/T-70/README.md) relie exigences/lots/oracles. Stockage physique/conteneur, fournisseurs/transports/routes restent à éprouver ; aucune architecture nouvelle imposée. JQ-02 garde budgets/portes détaillés. H-W18 historique BLOCKED/inconnu ; preuve technique distincte de l'écoute physique obligatoire T-103. Campagnes D, E/G, H regroupées sans supprimer validation humaine AT. F1 publication/boutique/signature réelle hors V1.

# 34. Critère fondamental de stabilité

État durable confirmé = récupérable. Espace navigateur et copie portable indépendante distincts ; E/S physiques requises pour démontrer la non-réécriture des autres chapitres, pas seulement noms, seek ou empreintes. Undo/redo 50 commandes, versions nommées durables distinctes. Les contrats restent à implémenter/qualifier.

Avant de complexifier Jaquette avec l’IA ou la publication, le socle suivant doit fonctionner de manière robuste :

1. importer l’EPUB de référence ;
2. générer des ancres textuelles stables ;
3. sélectionner un mot ou une plage ;
4. lui associer un événement audio ;
5. sauvegarder ;
6. fermer Jaquette ;
7. rouvrir le projet ;
8. retrouver exactement la même association.

Ce comportement est un invariant fondamental du produit.

La sauvegarde par chapitre doit en outre permettre de modifier puis réécrire le `.chpt` concerné sans réécrire les autres chapitres du `.jacq`.

---

# 35. Ce qui n’est pas encore une règle

Le prototype étant déjà commencé, **ne pas transformer en règles de dépôt des choix techniques qui restent à implémenter ou à confirmer**.

En particulier, lorsqu’une décision technique n’est pas explicitement figée par le cahier des charges ou par une décision ultérieure du projet :

- ne pas la présenter comme imposée par `AGENTS.md` ;
- ne pas créer de règle permanente simplement parce qu’elle simplifie une première implémentation ;
- documenter la décision lorsqu’elle est réellement prise ;
- mettre ensuite à jour `AGENTS.md` si elle devient un invariant que les futurs agents doivent respecter.

---

# 36. Mise à jour de ce fichier

`AGENTS.md` est un document vivant.

Lorsqu’une règle change ou est ajoutée :

1. vérifier la décision produit/métier ;
2. mettre à jour le cahier des charges si nécessaire ;
3. mettre à jour `AGENTS.md` ;
4. supprimer les règles devenues obsolètes plutôt que de laisser des contradictions ;
5. conserver une formulation normative et concise.

Un futur agent doit pouvoir lire ce fichier avant de travailler et comprendre immédiatement les contraintes qu’il ne doit pas casser.
