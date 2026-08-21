# Jaquette — Cahier des charges complet

Version de cadrage : V1 Web → Electron → IA/MCP → Collaboration V2

## 1. Objet du document

Ce document définit le périmètre fonctionnel, métier, UX, technique et évolutif de Jaquette, logiciel de production de doublage audio immersif pour livres numériques.

Jaquette est le logiciel de création et de production. Jacques est l’application propriétaire de lecture et de distribution des livres finalisés.

Le principe central de Jaquette est que le texte remplace la timeline d’un DAW classique : les événements audio sont associés à des mots ou plages de mots stables, puis interprétés par Jacques pendant la lecture.

## 2. Vision produit

Jaquette doit permettre à des sound designers professionnels et à des éditeurs peu expérimentés en audio de produire facilement un livre enrichi avec SFX, ambiances et musiques.

Le produit peut être avancé et nécessiter une formation d’une à deux journées. L’objectif n’est donc pas de masquer toute complexité métier, mais de proposer une interface professionnelle, cohérente et spécialisée dans le livre.

Workflow principal :

1. Import EPUB.
2. Affectation du projet à une équipe.
3. Doublage audio par Sound Designer.
4. Révision chapitre par chapitre.
5. Validation par l’ensemble des réviseurs affectés.
6. Soumission au Chef d’équipe.
7. Validation finale.
8. Préparation de publication.
9. Export `.jacko` signé.
10. Publication vers Jacques.

## 3. Principes structurants

- Le texte est la timeline principale.
- Une annotation audio s’ancre sur des identifiants textuels stables, jamais sur des coordonnées seules.
- Le texte source ne peut pas être édité dans Jaquette.
- Jaquette est local-first pour les manuscrits et les sources audio.
- `.jacq` est le fichier de travail de production.
- `.jacko` est le fichier final de distribution, optimisé, signé et destiné à Jacques.
- Les sources audio restent non destructives.
- L’IA travaille dans un brouillon séparé avant validation humaine.
- La collaboration temps réel arrive en V2.
- Les droits dépendent du contexte de travail : workspace, équipe, projet.

## 4. Périmètre V1

La V1 Web doit fonctionner sous Chrome et permettre :

- authentification prototype ;
- création et navigation entre espaces de travail locaux ;
- écran d’accueil de type Figma avec équipes, projets, drafts et tâches ;
- import d’un EPUB reflowable sans DRM ;
- affichage du livre ;
- tokenisation stable du texte ;
- sélection mot, plage, phrase et paragraphe ;
- association des trois types d’événements audio ;
- bibliothèque audio locale avancée ;
- préécoute ;
- édition audio non destructive légère ;
- simulation de lecture ;
- sauvegarde automatique ;
- undo/redo limité à 50 actions ;
- versions nommées ;
- workflow de validation ;
- commentaires et tickets ;
- contrôle qualité ;
- export/import `.jacq` ;
- export `.jacko` ;
- réouverture d’un `.jacko` en lecture seule pour contrôle ;
- métadonnées de publication Jacques.

Hors V1 :

- PDF ;
- EPUB fixed-layout ;
- Linux ;
- collaboration temps réel ;
- comptes invités cloud réels ;
- génération audio externe par IA ;
- mode clair.

## 5. Formats de fichiers

### 5.1 `.jacq`

Le `.jacq` est le projet de production éditable.

Il contient notamment :

- EPUB source original ;
- structure textuelle normalisée ;
- identifiants de tokens ;
- annotations audio ;
- sources audio réellement utilisées ;
- réglages audio ;
- commentaires ;
- tickets ;
- affectations ;
- états de validation ;
- versions nommées ;
- métadonnées projet ;
- consentements IA ;
- historique utile à la production.

Le `.jacq` peut techniquement être un conteneur ZIP versionné.

### 5.2 `.jacko`

Le `.jacko` est le fichier final destiné à Jacques.

Il contient :

- texte ;
- HTML/CSS ;
- images ;
- polices nécessaires ;
- audio compressé ;
- manifeste de déclenchements ;
- métadonnées de publication ;
- checksums ;
- signature numérique ;
- version du format.

Structure conceptuelle :

```text
book.jacko
├── manifest.json
├── content/
│   ├── chapters/
│   ├── styles/
│   └── navigation/
├── assets/
│   ├── images/
│   └── fonts/
├── audio/
│   ├── sfx/
│   ├── ambience/
│   └── music/
└── metadata/
    ├── publication.json
    └── checksums.json
```

Le manifeste contient au minimum :

- `formatVersion` ;
- `bookId` ;
- `releaseId` ;
- titre ;
- langues ;
- chapitres ;
- tokens ;
- ressources audio ;
- événements audio ;
- fades ;
- ducking ;
- règles musicales ;
- spatialisation ;
- preset d’export ;
- signature et informations d’intégrité.

Le format doit être versionné dès la première version.

## 6. Import EPUB

La V1 accepte :

- EPUB reflowable ;
- EPUB sans DRM ;
- EPUB jusqu’à environ 10 Mo en entrée ;
- français ;
- anglais ;
- arabe ;
- documents multilingues ;
- RTL ;
- images ;
- tableaux ;
- notes ;
- styles ;
- polices décoratives ;
- navigation.

Les EPUB DRM sont refusés avec un message explicite.

Le corps du texte utilise Literata lorsque disponible. Pour l’arabe et les glyphes non couverts, une police serif de fallback compatible doit être utilisée. Les polices décoratives de l’éditeur sont conservées lorsque possible.

La page de lecture reste claire même en thème sombre :

- fond page : `#EFF2FF` ;
- texte : `#1B1B3A`.

Le reste de l’interface peut rester sombre.

## 7. Modèle textuel

Chaque chapitre est transformé en structure logique stable :

```text
chapter
  section
    paragraph
      sentence
        token
```

Chaque mot/token reçoit un identifiant stable indépendant de sa position visuelle.

Exemple :

```text
ch07:p12:w034
```

Le modèle peut conserver également :

- index global ;
- offset caractère ;
- langue ;
- direction d’écriture ;
- hash de bloc ;
- coordonnées calculées à l’affichage.

Les coordonnées restent secondaires. La source de vérité est l’ancrage logique dans le texte.

## 8. Sélection du texte

Interactions :

- clic simple : mot ;
- clic-glisser : plage ;
- Shift + clic : étendre une sélection ;
- double clic : phrase ;
- triple clic : paragraphe ;
- commandes dédiées : paragraphe, section, chapitre.

Une annotation ne peut pas traverser plusieurs chapitres.

Une même plage peut recevoir plusieurs annotations de types différents.

## 9. Types d’événements audio

### 9.1 SFX

- Peut être attaché à un mot ou une plage.
- Recommandation UX : un mot précis.
- Une même plage peut déclencher plusieurs SFX.
- Le son joue jusqu’à sa fin une fois déclenché.
- Maximum de 3 SFX simultanés.
- Lorsqu’un quatrième démarre, le plus ancien est coupé.

### 9.2 Ambiance

Une ambiance possède :

- début et fin textuels ;
- fichier ;
- volume ;
- point d’entrée ;
- trim ;
- boucle optionnelle ;
- zone de boucle ;
- fade-in/out ;
- normalisation ;
- ducking ;
- spatialisation.

Règles :

- si boucle activée, le son répète jusqu’à la fin de la plage ;
- si boucle désactivée, il joue une fois ;
- si le fichier dépasse la plage, il s’arrête ou fade à la sortie ;
- plusieurs ambiances peuvent se superposer.

### 9.3 Musique

La musique possède les mêmes propriétés de base qu’une ambiance, mais :

- une seule musique principale est active à la fois ;
- deux musiques peuvent coexister uniquement pendant un crossfade ;
- le passage A → B doit être progressif et paramétrable.

## 10. Visualisation des annotations

Trois rails ou chevrons colorés doivent apparaître sous le texte.

Palette métier proposée :

- SFX : `#FFAF87` ;
- ambiance : `#E56399` ;
- musique : `#9358FF` ;
- états secondaires / validation : `#CFF2EC`.

La couleur ne doit jamais être le seul identifiant : icône, libellé ou position de rail doivent également distinguer les types.

## 11. Mixage et édition audio

Chaque occurrence peut définir :

- volume ;
- trim ;
- point d’entrée ;
- point de sortie ;
- boucle ;
- zone de boucle ;
- fade-in ;
- fade-out ;
- normalisation ;
- ducking ;
- spatialisation ;
- mute ;
- solo.

Les opérations sont non destructives.

### Fades textuels

Les fades peuvent être associés à une plage de mots plutôt qu’à une durée fixe. Le lecteur final calcule leur progression à partir de l’avancement de lecture.

### Ducking

Le ducking est configurable par occurrence, avec atténuation réglable en dB.

### Spatialisation

La V1 doit pouvoir stocker et prévisualiser une position 3D autour du lecteur, par exemple :

- azimuth ;
- elevation ;
- distance.

Le rendu final peut être adapté par Jacques pour casque et haut-parleurs.

## 12. Bibliothèque audio

Jaquette peut indexer plusieurs dossiers locaux.

La bibliothèque doit proposer :

- dossiers/sous-dossiers ;
- recherche instantanée ;
- catégories structurées ;
- tags libres ;
- favoris ;
- collections ;
- durée ;
- format ;
- taille ;
- fréquence ;
- canaux ;
- volume par défaut ;
- nombre d’utilisations ;
- préécoute ;
- drag-and-drop.

Pas de waveform en V1.

Les fichiers de bibliothèque ne sont pas dupliqués lors de l’indexation. En revanche, dès qu’un son est utilisé dans un projet, une copie est intégrée au `.jacq` afin de rendre le projet autonome.

Si la source de bibliothèque change ensuite, Jaquette propose explicitement `Mettre à jour depuis la bibliothèque`. La mise à jour n’est jamais silencieuse.

## 13. Taxonomie

Les catégories structurées doivent faciliter le travail humain et l’IA.

Exemples :

- Type : SFX / Ambiance / Musique ;
- Environnement : intérieur / extérieur / véhicule ;
- Lieu : forêt / ville / mer / maison ;
- Météo : pluie / vent / orage ;
- Émotion : tension / joie / mélancolie / mystère ;
- Intensité : faible / moyenne / forte ;
- Temporalité : historique / moderne / futuriste.

Les utilisateurs peuvent ajouter des tags libres et créer des collections transversales.

## 14. Déduplication et optimisation

Jaquette doit calculer un hash des sources audio et éviter d’embarquer plusieurs fois un fichier identique dans le `.jacko`.

Le `.jacq` conserve les sources de production de qualité élevée.

Le `.jacko` contient des versions compressées et optimisées.

Presets :

- Ultra léger ;
- Équilibré ;
- Haute qualité ;
- Personnalisé.

Opus est un codec privilégié pour le format propriétaire.

L’interface affiche une estimation du poids final ventilée par audio, images, polices et autres ressources.

## 15. Prévisualisation

Trois modes :

### Souris comme regard simulé

Le pointeur déclenche les événements comme un eye-tracker simulé.

### Lecture automatique

- vitesse en mots/minute ;
- vitesse x1, x2, x4 ;
- mot actif mis en évidence.

### Lecture ciblée

- lire la sélection ;
- lire depuis cette sélection ;
- lire un chapitre.

Mute et Solo sont disponibles par famille de piste.

## 16. Contrôle qualité

Jaquette doit détecter notamment :

- fichier audio manquant ;
- fichier corrompu ;
- plage invalide ;
- annotation sans média ;
- chevauchement musical incohérent ;
- boucle invalide ;
- clipping potentiel ;
- niveau excessif ;
- source de bibliothèque cassée ;
- élément EPUB non supporté ;
- erreur d’export ;
- métadonnée obligatoire manquante.

Les erreurs bloquantes interdisent l’export. Les avertissements peuvent être ignorés.

## 17. Sauvegarde et versions

- Autosave permanent.
- Undo/redo : 50 actions maximum.
- Versions nommées durables.

Exemples :

- V1 — Premier doublage ;
- V2 — Retours éditoriaux ;
- V3 — Mix final ;
- Master.

## 18. Identité utilisateur

Une personne possède une identité Jaquette globale avec plusieurs méthodes de connexion et plusieurs adresses e-mail vérifiées.

Une même identité peut donc être reliée à :

- une adresse professionnelle ;
- une adresse personnelle ;
- plusieurs profils dans différentes maisons d’édition ;
- un espace Auteur indépendant.

L’utilisateur peut se connecter avec n’importe quelle adresse vérifiée rattachée à son identité.

### Fusion de comptes

Jaquette doit permettre de lier/fusionner des comptes créés avec différentes adresses e-mail.

La fusion exige une preuve de contrôle de chaque identité concernée.

La fusion conserve :

- projets ;
- appartenances ;
- commentaires ;
- tickets ;
- historique ;
- droits contextuels.

Aucune fusion automatique sur nom ou IP.

L’adresse IP n’est pas un identifiant utilisateur.

## 19. Workspaces

Deux types principaux :

- Maison d’édition ;
- Auteur indépendant.

Le contexte de travail contient :

- membres ;
- équipes ;
- projets ;
- drafts ;
- permissions ;
- activité ;
- publication.

L’utilisateur peut changer d’espace rapidement via un switch de contexte façon Slack/Figma.

## 20. Rôles et permissions

Les permissions appartiennent à une relation utilisateur ↔ workspace ↔ équipe ↔ projet.

### Super Admin Jaquette

Administration globale de la plateforme et de Jacques, sans droit métier automatique sur les doublages.

### Admin Maison d’édition

Droits d’administration et management uniquement :

- gérer le workspace ;
- inviter/suspendre des membres ;
- créer des équipes ;
- nommer des Chefs d’équipe ;
- gérer les projets ;
- consulter les dashboards ;
- retirer un livre de Jacques.

Il ne peut pas automatiquement monter, réviser ou publier un livre sans rôle métier complémentaire.

### Sound Designer

Peut :

- modifier le `.jacq` ;
- ajouter/modifier/supprimer des événements audio ;
- gérer les sons utilisés ;
- traiter les tickets ;
- répondre aux commentaires ;
- créer une nouvelle version ;
- déclarer un chapitre terminé.

Ne peut pas :

- valider une révision ;
- publier ;
- administrer le workspace.

### Réviseur

Peut :

- simuler la lecture ;
- consulter toutes les annotations ;
- commenter ;
- créer des tickets ;
- valider/invalider un chapitre ;
- valider/invalider une version ;
- soumettre au Chef d’équipe lorsque toutes les validations requises sont obtenues.

Ne peut pas modifier le doublage audio.

### Chef d’équipe

Peut :

- gérer les membres et projets de ses équipes ;
- affecter des collaborateurs et chapitres ;
- consulter le dashboard ;
- suivre la progression ;
- simuler ;
- commenter ;
- rejeter vers Réviseur ou Sound Designer ;
- valider le livre final ;
- préparer et déclencher la publication dans Jacques.

Il ne peut jamais modifier directement le montage audio.

### Auteur indépendant

Dispose d’un workspace personnel dont il est propriétaire. Il peut inviter des freelances, attribuer des rôles, suivre la production, décider de la validation finale et publier dans Jacques.

## 21. Équipes et affectations

Un utilisateur peut avoir un rôle différent selon l’équipe.

Les membres d’une équipe voient les projets de l’équipe, mais seuls les membres explicitement affectés peuvent modifier/commenter selon leurs droits.

Plusieurs Sound Designers peuvent travailler sur un même projet avec affectation par chapitre.

Un Chef d’équipe peut gérer plusieurs équipes et disposer d’un tableau de bord séparé ou consolidé.

## 22. Accueil façon Figma

Navigation gauche :

- switch de workspace ;
- Accueil ;
- Mes tâches ;
- Drafts ;
- équipes ;
- accès rapides ;
- création équipe/projet selon permissions.

Zone centrale :

- projets récents ;
- cartes de projets avec couverture ;
- titre ;
- équipe ;
- collaborateurs ;
- progression ;
- statut ;
- dernière activité ;
- alertes ;
- tickets prioritaires.

## 23. Interface adaptative selon le rôle

### Sound Designer

Bibliothèque à gauche, livre au centre, inspecteur audio à droite.

### Réviseur

Livre plus large, bibliothèque et outils de montage masqués, simulation/commentaires/tickets/validation mis en avant.

### Chef d’équipe

Dashboard, lecture/simulation, commentaires, historique, validation finale, publication.

### Admin Maison

Membres, équipes, invitations, projets, permissions, audit.

## 24. Drafts et versions

Deux concepts distincts :

### Drafts d’espace

Pool de livres/projets non encore affectés à une équipe ou non encore démarrés.

### Versions de projet

Historique de travail à l’intérieur d’un projet actif.

Le terme `Drafts` est réservé au pool d’attente ; `Versions` désigne les versions internes du projet.

## 25. Tickets

Un ticket est distinct d’un commentaire.

Il contient :

- identifiant ;
- titre ;
- description ;
- projet ;
- chapitre ;
- plage textuelle éventuelle ;
- annotation audio éventuelle ;
- créateur ;
- assigné ;
- priorité ;
- statut ;
- dates ;
- commentaires.

Statuts :

- À faire ;
- En cours ;
- À revoir ;
- Résolu ;
- Fermé.

Priorités :

- Faible ;
- Normale ;
- Haute ;
- Bloquante.

Cliquer sur un ticket doit ouvrir directement le passage concerné.

## 26. Tableau de bord par rôle

### Sound Designer

Tickets à traiter, chapitres affectés, demandes de correction, projets récents, échéances.

### Réviseur

Chapitres à réviser, versions modifiées après révision, tickets à revérifier.

### Chef d’équipe

Projets bloqués, progression des équipes, livres prêts pour validation, tickets critiques, charge des membres.

### Admin Maison

Équipes, membres, invitations, projets, activité, droits.

## 27. Progression

Trois métriques distinctes :

### Doublage

Pourcentage de chapitres déclarés terminés par les Sound Designers.

### Révision

Calcul basé sur toutes les validations attendues.

Exemple : 10 chapitres × 3 réviseurs = 30 validations nécessaires. Si 21 sont acquises, progression révision = 70 %.

### Validation finale

États :

- Non soumis ;
- En attente Chef ;
- À corriger ;
- Validé ;
- Prêt à publier ;
- Publié.

## 28. Workflow éditorial

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

Branches de retour :

- Réviseur → corrections Sound Designer ;
- Chef → retour Réviseur ;
- Chef → retour Sound Designer.

## 29. Règles de révision

Chaque chapitre possède pour chaque Réviseur :

- Non révisé ;
- À corriger ;
- Validé.

La validation globale du chapitre exige l’approbation de tous les réviseurs affectés au projet.

Une invalidation impose la création d’un commentaire ou ticket expliquant la correction demandée.

Toute modification audio effectuée après validation annule les validations du chapitre concerné et le replace en `À réviser`.

Les validations précédentes restent archivées dans l’historique.

## 30. Publication vers Jacques

Validation finale et publication sont deux actions distinctes.

Après validation : `VALIDÉ → PRÊT À PUBLIER`.

Puis l’utilisateur autorisé lance explicitement : `Publier dans Jacques`.

## 31. Métadonnées boutique

Jaquette gère avant publication :

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
- public cible/âge si nécessaire ;
- numéro de version.

## 32. Versions publiées

Une modification d’un livre publié repasse par le workflow complet de validation.

Le modèle conserve :

- `bookId` stable ;
- `releaseId` différent pour chaque publication ;
- numéro de version incrémenté.

## 33. Dépublication

Peuvent retirer un livre de Jacques :

- Admin Maison d’édition ;
- Super Admin Jaquette.

Le Chef d’équipe ne dépublie pas directement.

Toute dépublication doit être confirmée explicitement et journalisée.

## 34. Signature `.jacko`

Tout `.jacko` publié doit être signé numériquement.

Processus :

1. Génération du contenu.
2. Calcul du hash.
3. Signature du hash.
4. Intégration des informations de signature.
5. Vérification par Jacques lors du chargement.

Une modification manuelle du conteneur invalide la signature.

## 35. Auteur → Maison d’édition

Le modèle doit prévoir :

- partage d’un projet avec une maison ;
- transfert de propriété à une maison ;
- acceptation par un Admin Maison ;
- conservation de l’historique.

Partage et transfert restent deux actions distinctes.

## 36. Authentification prototype V1

La V1 fournit une porte d’entrée avec deux comptes administrateur de test définis hors dépôt.

Les identifiants de prototype ne doivent jamais être placés en clair dans le frontend ou versionnés dans Git.

Ils doivent être injectés via configuration locale, variables d’environnement ou mécanisme équivalent.

## 37. Collaboration V2

Architecture hybride.

### Control plane Jaquette Cloud

- identités ;
- authentification ;
- organisations ;
- permissions ;
- invitations ;
- métadonnées non sensibles ;
- audit administratif.

### Data plane Maison/Auteur

- EPUB ;
- `.jacq` ;
- sources audio ;
- manuscrits ;
- ressources sensibles.

Les contenus ne sont pas stockés dans le cloud Jaquette sans décision explicite.

## 38. Collaboration temps réel

La V2 affiche :

- utilisateurs présents ;
- chapitre consulté ;
- curseurs/sélections distants ;
- couleur utilisateur ;
- modifications récentes.

Si deux utilisateurs modifient la même zone, Jaquette signale un conflit explicite. Pas de fusion métier silencieuse.

## 39. Audit

Journaliser notamment :

- connexion ;
- import ;
- modification projet ;
- ajout/suppression d’événement ;
- changement de statut ;
- commentaire ;
- ticket ;
- validation ;
- export ;
- publication ;
- dépublication ;
- consentement IA ;
- appel IA ;
- acceptation/rejet de proposition IA.

## 40. MCP / IA

Le serveur MCP Jaquette est local en première version Electron.

L’agent ne doit jamais recevoir un accès arbitraire au filesystem.

### Ressources possibles

```text
jaquette://book
jaquette://chapters/{id}
jaquette://selection
jaquette://library
jaquette://annotations
jaquette://taxonomy
jaquette://project
```

### Outils possibles

```text
search_sounds
get_sound_metadata
preview_sound
create_punctual
create_ambience
create_music
set_volume
set_loop
set_fade
set_ducking
set_spatial_position
update_annotation
delete_annotation
```

## 41. Brouillon IA

L’IA ne modifie jamais directement le master humain.

Elle produit un brouillon de propositions pouvant ajouter, modifier ou supprimer des annotations proposées.

L’utilisateur peut accepter/rejeter :

- une proposition ;
- un chapitre ;
- toutes les propositions.

Après acceptation, les changements deviennent des modifications humaines classiques et entrent dans l’historique.

## 42. Consentement IA

Chaque projet possède un état :

- IA interdite ;
- IA autorisée avec consentement.

Avant la première transmission à un fournisseur distant, Jaquette demande une certification explicite d’autorisation de l’auteur ou de l’éditeur.

Le consentement journalise :

- personne ;
- compte ;
- date/heure ;
- fournisseur IA ;
- version du projet.

Le fournisseur doit être affiché avant l’envoi.

L’autorisation peut être révoquée.

Chaque maison d’édition peut interdire certains fournisseurs.

## 43. Architecture logicielle recommandée

Monorepo TypeScript partagé entre Web et Electron :

```text
Jaquette/
├── apps/
│   ├── web/
│   ├── desktop/
│   └── mcp-server/
├── packages/
│   ├── domain/
│   ├── audio-engine/
│   ├── epub/
│   ├── jacq-format/
│   ├── jacko-format/
│   ├── library/
│   ├── project/
│   ├── permissions/
│   ├── collaboration/
│   └── ui/
```

Recommandations :

- React ;
- TypeScript ;
- Vite ;
- design tokens ;
- composants UI réutilisables ;
- Workers pour traitements lourds ;
- logique métier découplée de React.

## 44. Stockage abstrait

Créer une abstraction `ProjectStorage` dès le départ.

```text
open()
save()
readAsset()
writeAsset()
deleteAsset()
exportProject()
```

Implémentation Web : File System Access API / OPFS.

Implémentation Electron : filesystem natif.

## 45. Audio Web et Electron

Web :

- Web Audio API ;
- Workers ;
- traitement/encodage via WebAssembly lorsque nécessaire.

Electron :

- même API métier ;
- FFmpeg natif privilégié pour les conversions lourdes ;
- filesystem natif.

## 46. Sécurité Electron

Architecture :

```text
Renderer
→ contextBridge
→ Preload
→ IPC validé
→ Main process
→ filesystem / FFmpeg / MCP
```

Principes :

- pas de Node.js brut dans le renderer ;
- isolation de contexte ;
- sandbox lorsque possible ;
- validation stricte des IPC ;
- aucune confiance implicite dans le HTML/CSS importé depuis un EPUB.

## 47. Design system

Palette :

- fond/noir : `#1B1B3A` ;
- accent : `#FFDFB2` ;
- secondaire : `#74A4BC` ;
- secondaire clair : `#CFF2EC` ;
- texte/blanc : `#EFF2FF`.

Couleurs métier des pistes :

- SFX : `#FFAF87` ;
- ambiance : `#E56399` ;
- musique : `#9358FF`.

Couleurs d’état :

- validation / état secondaire : `#CFF2EC` ;
- succès sur fond sombre : `#83B692` ;
- succès sur fond clair : `#355A40` ;
- échec / erreur : `#A20021`.

Typographies :

- interface : Manrope ;
- livre : Literata ;
- fallback arabe serif compatible.

Composants :

- boutons capsules ;
- tags capsules ;
- champs fortement arrondis ;
- interface épurée ;
- contraste accessible ;
- mode sombre en V1 ;
- mode clair plus tard.

## 48. Plan de développement incrémental

### Étape 0 — Fondation technique
Monorepo, TypeScript, React, design tokens, tests, CI.
**Acceptation :** Jaquette démarre avec shell fonctionnel.

### Étape 1 — Design system et layout
Palette, Manrope, page de livre claire, composants capsules, layout desktop.
**Acceptation :** écran vide conforme à la DA.

### Étape 2 — Domaine Identity / Workspace / Team / Project
Modèles métier sans backend cloud.
**Acceptation :** créer plusieurs espaces, équipes, rôles et projets en local.

### Étape 3 — Auth prototype et switch de contexte
Connexion locale, sessions, switch workspace, logout.
**Acceptation :** les comptes de test configurés localement accèdent aux bons espaces sans exposer de secret dans le bundle.

### Étape 4 — Accueil / Drafts / équipes / projets
Dashboard Figma-like, cartes de projet, Mes tâches, équipes, Drafts.
**Acceptation :** créer un draft, l’affecter à une équipe et voir son statut évoluer.

### Étape 5 — Import EPUB
Extraction, package, spine, chapitres, styles, images.
**Acceptation :** importer le livre de référence et naviguer dans tous les chapitres.

### Étape 6 — Tokenisation stable
Tokens, phrases, paragraphes, RTL, IDs stables.
**Acceptation critique :** deux imports identiques génèrent les mêmes IDs de tokens.

### Étape 7 — Sélection du texte
Clic, drag, Shift+clic, double/triple clic.
**Acceptation :** tester français, anglais et arabe.

### Étape 8 — Modèle d’annotations
SFX, Ambiance, Musique et rails colorés.
**Acceptation :** superposer trois types sur une même phrase sans ambiguïté visuelle.

### Étape 9 — Bibliothèque locale
Dossiers, indexation, recherche, tags, catégories, collections, favoris, préécoute.
**Acceptation :** indexer la bibliothèque de test et préécouter des médias.

### Étape 10 — Association audio
Drag-and-drop, inspecteur, copie/duplication.
**Acceptation :** associer un son à un mot et le retrouver après navigation.

### Étape 11 — Édition audio non destructive
Trim, loop, volume, fades, normalisation, ducking, spatialisation.
**Acceptation :** modifier tous les paramètres sans modifier la source originale.

### Étape 12 — Moteur de simulation
Web Audio, 3 SFX max, ambiances superposables, musique exclusive + crossfade, ducking, spatialisation.
**Acceptation :** scénario automatique couvrant tous ces cas.

### Étape 13 — Lecture simulée
Souris-regard, mots/minute, x1/x2/x4, lire sélection, lire depuis ici.
**Acceptation :** événements déclenchés aux bonnes plages.

### Étape 14 — Sauvegarde `.jacq`
Autosave, undo 50, sources embarquées, versions, import/export `.jacq`.
**Acceptation :** supprimer la bibliothèque d’origine puis rouvrir le `.jacq` sans perte.

### Étape 15 — Tickets / commentaires / workflow
Tickets, commentaires, affectations, états et tableaux de bord métier.
**Acceptation :** un Réviseur invalide un chapitre avec ticket obligatoire et le Sound Designer reçoit la tâche.

### Étape 16 — Révision multi-réviseurs
Validations individuelles et agrégées.
**Acceptation :** un chapitre à 3 réviseurs ne devient validé qu’après 3 validations.

### Étape 17 — Validation Chef d’équipe
Dashboard, soumission, rejet vers Réviseur ou Sound Designer, validation finale.
**Acceptation :** le Chef ne peut jamais modifier l’audio mais peut faire progresser/reculer le workflow.

### Étape 18 — QA et pré-export
Diagnostics, erreurs bloquantes, warnings, clipping estimé.
**Acceptation :** un projet invalide ne peut pas être exporté.

### Étape 19 — Export `.jacko`
Compression, Opus, presets, déduplication, manifeste, checksums, version format.
**Acceptation :** exporter, fermer Jaquette, rouvrir le `.jacko` en lecture seule et simuler correctement le doublage.

### Étape 20 — Métadonnées Jacques et signature
Formulaire boutique, signature numérique, état Prêt à publier.
**Acceptation :** `.jacko` signé, signature vérifiable, métadonnées complètes.

### Étape 21 — Publication Jacques
Intégration API entre Jaquette et Jacques lorsque l’API de Jacques est disponible.
**Acceptation :** publication distincte de la validation et création d’un `releaseId` versionné.

### Étape 22 — Migration Electron
Shell Electron, storage natif, FFmpeg natif, sécurité IPC, builds Windows/macOS.
**Acceptation :** même `.jacq`, même comportement métier entre Web et Electron.

### Étape 23 — MCP / IA
Serveur MCP local, ressources, outils, consentement, brouillon IA, diff, accept/reject.
**Acceptation :** un agent peut analyser un chapitre et proposer un doublage sans modifier le master ni lire hors projet.

### Étape 24 — Collaboration V2
Comptes réels, organisations, invitations, Jaquette Cloud, Jaquette Node, présence, conflits.
**Acceptation :** deux machines collaborent sur un même projet ; une modification concurrente sur une même zone produit un conflit explicite.

## 49. Jalons produit

### V0.1 — Preuve du modèle textuel
Étapes 0 à 8.
Objectif : prouver qu’un EPUB peut devenir une timeline textuelle stable et annotable.

### V0.2 — Preuve du moteur audio
Étapes 9 à 13.
Objectif : produire et simuler un doublage complet.

### V0.3 — Production Web
Étapes 14 à 20.
Objectif : produire un `.jacko` fiable, révisé et signé.

### V1 Desktop
Étape 22.
Objectif : application Electron Windows/macOS.

### V1.5 IA
Étape 23.
Objectif : premier doublage assisté par agent.

### V2 Collaborative
Étape 24.
Objectif : collaboration multi-utilisateur et maisons d’édition.

## 50. Risques techniques prioritaires

1. Stabilité de la tokenisation EPUB.
2. Conservation du rendu des EPUB complexes.
3. Synchronisation fiable texte ↔ audio.
4. Performances d’encodage dans Chrome.
5. Poids des `.jacko` réels.
6. Sécurité de l’import HTML/CSS EPUB.
7. Cohérence des validations en environnement collaboratif.
8. Gestion des conflits V2.
9. Signature et compatibilité de version du format `.jacko`.
10. Sécurité du serveur MCP et cloisonnement des ressources.

## 51. Critère global de validation V1

La V1 est considérée comme validée si l’on peut réaliser de bout en bout, sans outil externe :

1. Se connecter.
2. Ouvrir un workspace.
3. Créer/affecter un projet.
4. Importer l’EPUB de référence.
5. Indexer une bibliothèque audio réelle.
6. Sonoriser un chapitre avec les trois types de pistes.
7. Ajouter fades, ducking et spatialisation.
8. Simuler la lecture.
9. Sauvegarder et fermer Jaquette.
10. Rouvrir le `.jacq` sans perte.
11. Faire réviser le chapitre.
12. Obtenir toutes les validations requises.
13. Faire valider le livre par le Chef d’équipe.
14. Renseigner les métadonnées Jacques.
15. Exporter un `.jacko` optimisé et signé.
16. Fermer Jaquette.
17. Rouvrir le `.jacko` en mode contrôle.
18. Vérifier que le doublage et les métadonnées sont corrects.

Le premier jalon technique critique reste : importer l’EPUB de référence, produire des ancres textuelles stables, associer un son à une ancre et retrouver cette association après fermeture/réouverture.
