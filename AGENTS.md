# AGENTS.md — Jaquette

## 1. Rôle de ce fichier

Ce fichier définit les règles métier, produit et logicielles déjà validées pour **Jaquette**.

Il sert de référence de reprise pour tout agent IA ou développeur intervenant sur le projet.

À ce stade du projet, **aucune règle technique non explicitement décidée dans le cahier des charges ne doit être inventée ou considérée comme acquise**.

Le cahier des charges complet reste la source de référence détaillée. `AGENTS.md` en extrait les invariants et règles à ne pas enfreindre.

## État actuel du projet

- Le développement du code n’a pas encore commencé.
- Les choix d’implémentation qui ne sont pas explicitement validés restent ouverts.
- Les futurs agents doivent distinguer une règle produit déjà décidée d’une décision technique encore à prendre.

### Règle de travail pour les futurs contributeurs

- Respecter les règles listées ici.
- Ne pas modifier une règle métier implicitement pour simplifier une implémentation.
- Ne pas inventer de convention technique, d’architecture ou de dépendance non encore validée.
- Lorsqu’un choix nécessaire n’est pas défini, le signaler comme décision à prendre au lieu de l’ériger en règle.
- Toute nouvelle décision métier importante doit être répercutée dans le cahier des charges puis dans ce fichier.
- Ne jamais placer de secret, mot de passe ou identifiant sensible en clair dans le dépôt.

---

# 2. Produit et vocabulaire

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

## `.jacq`

- `.jacq` est le fichier de travail éditable de Jaquette.
- Il constitue le projet de production.
- Il doit rendre le projet autonome en embarquant les sons réellement utilisés.
- Il conserve les informations nécessaires au travail, à la révision, aux versions et au projet.
- Les traitements audio de production sont non destructifs.

## `.jacko`

- `.jacko` est le fichier final destiné à Jacques.
- Il n’est pas le fichier de production.
- Il contient le contenu du livre, les ressources nécessaires à la lecture, l’audio compressé, le manifeste de déclenchements et les métadonnées nécessaires.
- Le format `.jacko` est versionné.
- Un `.jacko` destiné à la publication doit être signé numériquement.
- Une modification du contenu signé doit pouvoir être détectée.
- Jaquette doit pouvoir rouvrir un `.jacko` en **mode contrôle / lecture seule** afin de vérifier un export.
- Un `.jacko` ouvert pour contrôle ne devient pas une source de production.

---

# 4. Import et texte du livre

## Format source

- La V1 importe des **EPUB reflowables**.
- Les PDF sont hors périmètre.
- Les EPUB fixed-layout sont reportés.
- Les EPUB protégés par DRM sont refusés explicitement.
- La V1 cible Chrome pour la phase Web.
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

## Organisation

- Jaquette peut indexer plusieurs dossiers de bibliothèque.
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

La waveform n’est pas requise en V1.

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
- La fusion doit conserver projets, appartenances, commentaires, tickets, historique et droits contextuels.
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
- traiter des tickets ;
- répondre aux commentaires ;
- créer une version ;
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
- créer des tickets ;
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

---

# 19. Accueil et navigation projet

L’accueil doit être conçu comme un espace de gestion de travail comparable dans son principe à Figma.

Il doit mettre en évidence :

- workspace courant ;
- équipes ;
- projets ;
- Drafts ;
- projets récents ;
- tâches personnelles ;
- tickets prioritaires ;
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
- tickets ;
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

# 21. Drafts, versions, commentaires et tickets

## Drafts

Le mot **Drafts** désigne le pool de livres ou projets qui ne sont pas encore affectés à une équipe ou pas encore réellement démarrés.

## Versions

Le mot **Versions** désigne les états de travail successifs d’un projet actif.

Ne pas confondre les deux concepts.

## Commentaires

Les commentaires servent à la discussion et à la révision.

## Tickets

Les tickets représentent du travail actionnable.

Un ticket peut contenir notamment :

- titre ;
- description ;
- projet ;
- chapitre ;
- plage textuelle ;
- annotation audio concernée ;
- auteur ;
- personne assignée ;
- priorité ;
- statut ;
- dates ;
- commentaires liés.

Statuts définis :

- À faire ;
- En cours ;
- À revoir ;
- Résolu ;
- Fermé.

Priorités définies :

- Faible ;
- Normale ;
- Haute ;
- Bloquante.

Lorsqu’un ticket cible une plage du livre, il doit permettre de revenir directement au passage concerné.

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

États prévus :

- Non soumis ;
- En attente Chef ;
- À corriger ;
- Validé ;
- Prêt à publier ;
- Publié.

---

# 23. Workflow éditorial

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
- Une invalidation doit être accompagnée d’un commentaire ou d’un ticket expliquant la correction attendue.
- Si un Sound Designer modifie l’audio d’un chapitre déjà validé, les validations actives de ce chapitre sont annulées.
- Le chapitre repasse alors à l’état `À réviser`.
- Les validations précédentes restent conservées dans l’historique.
- Le bouton de soumission au Chef d’équipe n’est disponible que lorsque toutes les conditions de révision sont satisfaites.

---

# 25. Publication vers Jacques

## Validation ≠ publication

La validation finale et la mise en boutique sont deux actions distinctes.

Workflow :

```text
Validé
→ Prêt à publier
→ Publier dans Jacques
```

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

# 27. Confidentialité et données

- Les manuscrits peuvent être confidentiels.
- Le fonctionnement doit rester local-first pour les livres et bibliothèques audio.
- En V2, le cloud Jaquette gère principalement les identités, droits, invitations et métadonnées non sensibles.
- Les EPUB, `.jacq`, manuscrits et sources audio restent sur le stockage local ou l’infrastructure de l’éditeur / auteur sauf choix explicite contraire.
- Un accès distant autorisé peut transmettre les données nécessaires sans pour autant les stocker dans le cloud Jaquette.

---

# 28. Collaboration V2

La collaboration temps réel est prévue en V2.

Elle doit permettre de voir notamment :

- utilisateurs présents ;
- chapitre consulté ;
- sélection ou curseur distant ;
- couleur utilisateur ;
- activité récente.

Règle de conflit :

- Si deux utilisateurs modifient la même zone de manière concurrente, Jaquette doit signaler explicitement le conflit.
- Ne pas effectuer de fusion métier silencieuse dans ce cas.

---

# 29. Audit

Les événements importants à journaliser incluent notamment :

- connexion ;
- import ;
- modifications de projet ;
- création/suppression d’événements audio ;
- changement de statut ;
- commentaire ;
- ticket ;
- validation ;
- export ;
- publication ;
- dépublication ;
- consentement IA ;
- utilisation IA ;
- acceptation ou rejet d’une proposition IA.

---

# 30. IA et MCP

## Principe

Le MCP sert à permettre à des agents IA de lire les informations explicitement exposées par Jaquette et de proposer un premier doublage.

## Accès

- Le serveur MCP est prévu localement dans la phase Electron initiale.
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

## Génération externe

La génération de nouveaux sons par des services externes est envisagée pour une version ultérieure et n’appartient pas au premier périmètre IA.

---

# 31. Consentement IA

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

- V1 : mode sombre.
- Mode clair : prévu plus tard.

---

# 33. Périmètre des versions

## V1 Web

Doit valider de bout en bout :

- workspace et projets ;
- import EPUB ;
- texte stable ;
- sélection ;
- annotations SFX / Ambiance / Musique ;
- bibliothèque locale ;
- édition audio légère ;
- simulation ;
- sauvegarde `.jacq` ;
- workflow de révision ;
- contrôle qualité ;
- métadonnées de publication ;
- export `.jacko` ;
- vérification du `.jacko`.

## Desktop

Après validation de la version Web, Jaquette doit être porté sur desktop via Electron.

## IA / MCP

Arrive après le socle de production et la version desktop initiale.

## Collaboration V2

Inclut notamment :

- comptes réels ;
- invitations ;
- organisations ;
- collaboration multi-utilisateur ;
- présence ;
- gestion des conflits ;
- accès distant.

---

# 34. Critère fondamental de stabilité

Avant de complexifier Jaquette avec la collaboration, l’IA ou la publication, le socle suivant doit fonctionner de manière robuste :

1. importer l’EPUB de référence ;
2. générer des ancres textuelles stables ;
3. sélectionner un mot ou une plage ;
4. lui associer un événement audio ;
5. sauvegarder ;
6. fermer Jaquette ;
7. rouvrir le projet ;
8. retrouver exactement la même association.

Ce comportement est un invariant fondamental du produit.

---

# 35. Ce qui n’est pas encore une règle

Le projet n’ayant pas encore commencé, **ne pas transformer en règles de dépôt des choix techniques qui restent à implémenter ou à confirmer**.

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
