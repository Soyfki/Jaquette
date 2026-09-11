# Jaquette — Cahier des charges complet

Version de cadrage : **11 septembre 2026 — lancement Web complet et Electron, collaboration et MCP inclus ; publication Jacques en extension F1**.

Le [plan du 11 septembre 2026](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) remplace l’ancien calendrier sur ses seuls sujets. Les règles métier ci-dessous restent normatives ; les propositions techniques ne deviennent des décisions qu’après les preuves prévues.

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
8. Export `.jacko` optimisé pour contrôle.
9. Réouverture en lecture seule et vérification du résultat.

L’extension **F1**, après disponibilité du lecteur et de la boutique Jacques, ajoute préparation de publication, signature de publication et publication explicite. Elle ne conditionne pas le lancement de Jaquette.

## 3. Principes structurants

- Le texte est la timeline principale.
- Une annotation audio s’ancre sur des identifiants textuels stables, jamais sur des coordonnées seules.
- Le texte source ne peut pas être édité dans Jaquette.
- Jaquette est local-first pour les manuscrits et les sources audio.
- `.jacq` est le fichier de travail de production.
- `.jacko` est le format de distribution optimisé destiné à Jacques, exportable pour contrôle dès le lancement ; sa publication signée relève de F1.
- Les sources audio restent non destructives.
- L’IA travaille dans un brouillon séparé avant validation humaine.
- La collaboration de contenu est locale et asynchrone, par échange de chapitres candidats.
- Les droits dépendent du contexte de travail : workspace, équipe, projet.

## 4. Périmètre de la première livraison

Jaquette est gratuit et accessible sur invitation. Le lancement comprend le Web complet sur ordinateur sous Chrome, Firefox et Safari (Safari qualifié sur macOS), ainsi qu’Electron Windows/macOS, Mac Intel et Apple Silicon. Les postes cibles sont un PC Windows 10 de génération 2018, un MacBook Intel précédant le M1 et un MacBook M1 ; configurations exactes et budgets seront fixés en nouvelle 0.4.

La première livraison doit permettre :

- invitation et activation initiale en ligne, avec authentification réelle et récupération de l’environnement avant travail hors ligne ;
- création et navigation entre espaces de travail locaux ;
- écran d’accueil de type Figma avec équipes, projets, drafts et tâches ;
- import d’un EPUB reflowable sans DRM ;
- affichage du livre ;
- tokenisation stable du texte ;
- sélection mot, plage, phrase et paragraphe ;
- association des trois types d’événements audio ;
- bibliothèque audio locale avancée et banques privées de maison/équipe ;
- préécoute ;
- édition audio non destructive légère ;
- simulation de lecture ;
- sauvegarde automatique ;
- undo/redo limité à 50 actions ;
- versions nommées ;
- workflow de validation ;
- tâches de workflow et commentaires contextualisés ;
- contrôle qualité ;
- export/import `.jacq` et échange de chapitres `.chpt` ;
- export `.jacko` ;
- réouverture d’un `.jacko` en lecture seule pour contrôle ;
- collaboration avec échanges connectés sur infrastructure privée, révision et validation finale ;
- brouillon IA via MCP et agents externes utilisant les seuls sons autorisés, sans génération sonore ;
- autonomie de cinq jours hors ligne après préparation initiale.

Hors première livraison :

- PDF ;
- EPUB fixed-layout ;
- Linux ;
- service de synchronisation directe du contenu ;
- publication effective, boutique, métadonnées de préparation de publication et dépublication Jacques (extension F1) ;
- génération audio externe par IA ;
- mode clair.

### Accès, expiration et reconnexion

À expiration des cinq jours, les nouvelles modifications sont bloquées, y compris l’application de propositions IA ; consultation, sauvegarde et archivage du travail existant restent possibles. Une simple présence de réseau ne renouvelle pas les droits.

À reconnexion, les droits sont recontrôlés avant tout envoi de soumission, commentaire ou décision préparés. En cas de révocation, aucun envoi n’est autorisé : le travail du contexte est conservé et son archivage sur disque est accompagné jusqu’à vérification. Dans le navigateur, préparer la copie ne vaut pas enregistrement indépendant réussi. Annulation, refus, fermeture ou disque plein ne détruisent jamais l’original ; l’archivage reste à terminer.

Le travail est local. Soumissions, transmission de commentaires/décisions et actualisation des tableaux de bord exigent une connexion. Réviseurs et Chefs peuvent télécharger en ligne puis lire, simuler et préparer leurs commentaires/décisions hors ligne ; une décision locale n’est officielle qu’après acceptation par le service autorisé, avec contrôle des droits. Aucun montage en direct n’est prévu.

### Hébergement, IA et moyens

Les EPUB, manuscrits, projets, chapitres, sons et commentaires de contenu restent sur stockage local ou infrastructure privée choisie par la maison ou l’auteur indépendant. Les services Jaquette se limitent à l’identité, aux invitations et aux données administratives explicitement autorisées ; aucun manuscrit ni banque audio n’est hébergé sur Jaquette Cloud.

Le MCP fait partie du lancement. Un fonctionnement hors ligne exige un agent **et** un modèle locaux ; un client installé localement utilisant un modèle distant reste dépendant du réseau. Tout transfert à un fournisseur distant exige connexion et consentement explicite. Desktop peut fournir la connexion MCP locale au navigateur, avec appairage et périmètre autorisés à qualifier.

Le développement est prévu par GPT.6, avec budget limité et sans échéance imposée : lots courts, réutilisation du socle et décisions techniques fondées sur preuves. La gratuité de Jaquette ne couvre pas les coûts éventuels du stockage privé, des agents tiers ou des appels IA ; aucun paiement ni abonnement Jaquette n’est ajouté.

## 5. Formats de fichiers

### 5.1 `.jacq`

Le `.jacq` est le projet de production complet et éditable.

Il contient une section physique `.chpt` par chapitre. Une modification de chapitre doit pouvoir réécrire physiquement le seul `.chpt` concerné, sans réécrire les autres chapitres.

Toute information qui n’appartient pas exclusivement à un seul chapitre est une information commune du `.jacq` et ne doit pas être placée dans un `.chpt`.

Les informations communes comprennent au minimum :

- EPUB source original ;
- structure textuelle globale, structure textuelle normalisée et identifiants nécessaires à sa cohérence ;
- métadonnées du livre et du projet ;
- paramètres généraux ;
- affectations globales ;
- versions nommées ;
- consentements IA ;
- commentaires ciblant le livre ;
- tâches ciblant le livre ;
- historique utile à la production ;
- toute information partagée par plusieurs chapitres.

Cette liste est un minimum normatif, pas une liste exhaustive champ par champ. Une donnée clairement propre à un chapitre reste dans son `.chpt`.

Le projet reste autonome : les médias réellement utilisés sont embarqués et les opérations audio restent non destructives.

Le choix technique du conteneur et les détails de sérialisation restent ouverts. Considérer automatiquement `.jacq` comme un simple ZIP n’est pas autorisé tant que la compatibilité avec la sauvegarde partielle par chapitre n’est pas démontrée. Aucun schéma physique, numéro de version ou champ de version n’est défini ici.

### 5.2 `.chpt`

`.chpt` est l’unité physique de sauvegarde, d’échange, d’import et de fusion d’un chapitre.

Un fichier exporté transporte au minimum :

- identité du projet et du livre ;
- identifiant stable du chapitre ;
- version de base et filiation nécessaires à la détection des conflits ;
- données de doublage du chapitre ;
- annotations et réglages audio ;
- médias réellement utilisés par ce chapitre ;
- commentaires ciblant le chapitre, son texte ou ses occurrences audio ;
- tâches liées au chapitre ;
- validations et leur historique ;
- informations d’auteur, de date et d’audit nécessaires.

Une donnée clairement propre à ce chapitre reste dans son `.chpt` ; toute information qui n’appartient pas exclusivement à ce seul chapitre relève de la section commune du `.jacq`.

Les détails de sérialisation, le conteneur, le schéma et la stratégie de version restent des décisions techniques ultérieures.

### 5.3 `.jacko`

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
- extension de signature numérique, obligatoire pour une publication F1 ; un export de contrôle peut rester non signé ;
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
- `releaseId` pour une publication F1 ;
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
- informations d’intégrité et extension de signature.

Le format doit être versionné dès la première version. Cette structure est conceptuelle, pas un choix de conteneur. Les données de publication et `releaseId` décrivent l’extension F1 ; un export de contrôle ne fabrique pas une publication réelle.

Trois niveaux restent distincts : checksums d’intégrité pour détecter une corruption, signature avec clés de test pour éprouver le contrôle d’authenticité en étape 13, et signature de publication réelle en F1 après définition de l’autorité de confiance et de la garde des clés. Un export de contrôle non signé n’est jamais présenté comme authentifié ; une clé de test ne vaut jamais signature de publication. Aucun secret global de signature n’est exposé dans le navigateur. Le contrôle d’un `.jacko` reste en lecture seule et n’en fait jamais une source de production.

## 6. Import EPUB

La première livraison accepte :

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

La première livraison doit pouvoir stocker et prévisualiser une position 3D autour du lecteur, par exemple :

- azimuth ;
- elevation ;
- distance.

Le rendu final peut être adapté par Jacques pour casque et haut-parleurs.

## 12. Bibliothèque audio

Jaquette peut indexer plusieurs dossiers locaux et utiliser des banques privées de maison/équipe sur l’infrastructure choisie. La connexion est requise pour acquérir les sons distants ; le projet conserve les médias utilisés après retrait du son ou perte d’accès à la banque.

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

La waveform n’est pas requise pour la première livraison.

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
- tâches de workflow ;
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
- publication en extension F1.

L’utilisateur peut changer d’espace rapidement via un switch de contexte façon Slack/Figma.

## 20. Rôles et permissions

Les permissions appartiennent à une relation utilisateur ↔ workspace ↔ équipe ↔ projet.

Les capacités de publication, préparation de publication et retrait de boutique décrites pour les rôles sont conservées comme règles de l’extension F1. Elles ne sont pas des opérations réelles du lancement ; les autres droits et interdictions s’appliquent dès celui-ci.

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
- exécuter les tâches générées par le workflow ;
- répondre aux commentaires ;
- exporter un chapitre candidat `.chpt` ;
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
- proposer une candidate complète comme candidate active à examiner en cas de concurrence sur un chapitre ;
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

L’accueil est un tableau de bord général distinct de l’écran d’un projet. Dans le workspace courant, il affiche simultanément toutes les équipes et tous les projets du jeu de données disponible, sans exiger l’ouverture préalable d’un projet. Chaque équipe expose son nom, son nombre de membres et ses projets associés ou leur nombre ; chaque projet expose son nom, son équipe, son statut et un repère de progression ou d’activité.

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
- alertes.

## 23. Interface adaptative selon le rôle

### Sound Designer

Bibliothèque à gauche, livre au centre, inspecteur audio à droite.

### Réviseur

Livre plus large, bibliothèque et outils de montage masqués, simulation/commentaires/candidates/validation mis en avant.

### Chef d’équipe

Dashboard, lecture/simulation, commentaires, historique, validation finale ; publication en extension F1.

### Admin Maison

Membres, équipes, invitations, projets, permissions, audit.

## 24. Drafts et versions

Deux concepts distincts :

### Drafts d’espace

Pool de livres/projets non encore affectés à une équipe ou non encore démarrés.

### Versions de projet

Historique de travail à l’intérieur d’un projet actif.

Le terme `Drafts` est réservé au pool d’attente ; `Versions` désigne les versions internes du projet.

## 25. Tâches et commentaires

L’ancien concept fonctionnel de ticket est abandonné et ne doit plus exister comme objet, écran, workflow ou entrée de tableau de bord.

### Tâches de workflow

Les tâches sont générées automatiquement par les affectations et les transitions du workflow. Elles ne constituent pas un gestionnaire générique de tâches libres.

Une tâche :

- cible un livre ou un chapitre ;
- possède un assigné ;
- peut avoir une échéance ;
- ne possède aucune priorité ;
- possède uniquement les statuts `Pas commencé`, `En cours` et `Terminée`.

Elle est créée avec `Pas commencé`, passe manuellement à `En cours` lorsque l’utilisateur débute, puis automatiquement à `Terminée` lorsque l’action métier attendue est accomplie.

Les cas obligatoires sont :

- doubler un chapitre ;
- réviser un chapitre ;
- publier un livre dans Jacques, en extension F1 ;
- corriger un chapitre invalidé.

Chaque invalidation crée une nouvelle occurrence de tâche de correction. Une tâche antérieure n’est ni réutilisée ni supprimée, afin de conserver l’historique de chaque cycle.

En F1, le passage à l’état publiable génère automatiquement la tâche de publication, sans priorité. Elle suit les mêmes trois statuts et se termine après confirmation de la publication ; un réessai ne crée ni seconde tâche ni seconde release.

Les tâches pertinentes restent dans le `.jacq` et voyagent dans le `.chpt` lorsqu’elles ciblent le chapitre exporté.

### Commentaires contextualisés

Un commentaire peut cibler :

- le livre entier ;
- un chapitre entier ;
- un mot ou une plage de mots ;
- une occurrence audio placée dans la timeline textuelle.

Un commentaire sur une occurrence audio cible l’annotation ou son inspecteur, jamais le fichier de la bibliothèque audio.

La présentation dépend de la cible : vue globale du projet ou de la révision pour le livre, espace du chapitre, passage textuel, ou annotation/inspecteur de l’occurrence.

Les commentaires prennent en charge :

- réponses en fil ;
- états `Ouvert` et `Résolu` ;
- historique des modifications ;
- absence de suppression définitive ;
- identifiants stables pour l’import et la fusion sans duplication ;
- conservation de l’auteur et des dates.

Les commentaires du chapitre, de son texte ou de ses occurrences voyagent avec son `.chpt`. Les commentaires du livre restent dans la section commune du `.jacq`.

## 26. Tableau de bord par rôle

### Sound Designer

Chapitres affectés, tâches de doublage ou de correction, projets récents et échéances.

### Réviseur

Chapitres et candidates à réviser, validations annulées après modification et tâches de révision.

### Chef d’équipe

Projets bloqués, progression des équipes, livres prêts pour validation, conflits à arbitrer et charge des membres.

### Admin Maison

Équipes, membres, invitations, projets, activité et droits.

## 27. Progression

Trois métriques distinctes :

### Doublage

Pourcentage de chapitres déclarés terminés par les Sound Designers.

### Révision

Calcul basé sur toutes les validations attendues.

Exemple : 10 chapitres × 3 réviseurs = 30 validations nécessaires. Si 21 sont acquises, progression révision = 70 %.

### Validation finale

Les états Prêt à publier et Publié sont conservés pour F1 ; le lancement qualifie la validation finale puis l’export et le contrôle.

États :

- Non soumis ;
- En attente Chef ;
- À corriger ;
- Validé ;
- Prêt à publier ;
- Publié.

## 28. Workflow éditorial

Le cycle complet ci-dessous conserve sa destination F1. Au lancement, la validation finale conduit à l’export et au contrôle ; `Prêt à publier`, `Publié` et la publication effective appartiennent à F1.

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

La validation globale du chapitre exige l’approbation de tous les Réviseurs affectés au projet.

Une invalidation impose un commentaire expliquant la correction demandée et génère une nouvelle tâche de correction.

Toute modification audio effectuée après validation annule les validations actives du chapitre concerné et le replace en `À réviser`. Les validations précédentes restent archivées dans l’historique.

Ces règles s’appliquent aux candidates `.chpt` et aux cycles de correction offline. Deux versions concurrentes du même chapitre restent deux candidates distinctes : aucun merge détaillé d’annotations ou de réglages n’est effectué.

Tout Réviseur affecté peut proposer une candidate complète comme candidate active à examiner. Cette proposition ne vaut ni sélection définitive ni validation. La candidate ne rejoint la version validée du chapitre qu’après l’approbation de tous les Réviseurs affectés.

En cas de désaccord, le chapitre reste bloqué et aucune candidate n’est intégrée. Il n’existe ni vote majoritaire ni arbitrage du Chef d’équipe sur le choix éditorial de la candidate. Une autre candidate peut être proposée explicitement ; deux propositions concurrentes ne se remplacent jamais silencieusement.

Toutes les candidates et décisions précédentes restent consultables dans l’historique avec leur auteur, leur base et leur date.

## 30. Publication vers Jacques

**Extension F1 uniquement**, après disponibilité de Jacques et d’un contrat testable. Les sections 30 à 33 ne sont pas des prérequis du lancement.

Validation finale et publication sont deux actions distinctes.

Après validation : `VALIDÉ → PRÊT À PUBLIER`.

Puis l’utilisateur autorisé lance explicitement : `Publier dans Jacques`.

Avant l’état `Validé`, aucune préparation de publication ne doit être présentée. Pour `Non soumis`, `En attente Chef` ou `À corriger`, le panneau, les boutons, les contrôles et les métadonnées de destination sont absents du DOM ; les laisser montés mais désactivés n’est pas conforme. Après validation, ces capacités restent réservées à F1 ; aucun succès fictif ne vaut publication réelle.

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

Tout `.jacko` publié doit être signé numériquement en F1. Au lancement, l’export de contrôle et les essais avec clés de test restent distincts de cette authentification de publication (section 5.3).

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

## 36. Invitation, activation et droits hors ligne

Le lancement exige de vrais accès sur invitation, une première authentification en ligne et la préparation de l’environnement. Les règles des cinq jours, d’expiration, de reconnexion et d’archivage sont définies en section 4 ; aucune simulation de rôle ne constitue une authentification ou une permission réelle.

L’ancien scénario de deux comptes administrateur de prototype n’est plus une exigence active. Aucun identifiant, secret ou jeton ne doit être placé en clair dans le frontend ou dans Git. Les mécanismes techniques d’identité restent à choisir et éprouver dans les nouvelles étapes 1 et 4.

## 37. Architecture hybride et collaboration offline

L’architecture reste local-first.

### Services administratifs Jaquette

- identités ;
- authentification ;
- organisations ;
- permissions ;
- invitations ;
- données administratives explicitement autorisées, sans contenu sensible ;
- audit administratif.

### Stockage local ou infrastructure privée Maison/Auteur

- EPUB ;
- `.jacq` ;
- `.chpt` ;
- sources audio ;
- manuscrits ;
- banques audio et commentaires de contenu ;
- audit sensible et états détaillés des contributions ;
- ressources sensibles.

Jaquette Cloud n’héberge pas ces contenus. La maison ou l’auteur choisit son stockage privé. La collaboration repose sur l’échange connecté et contrôlé de fichiers `.chpt`, commentaires et décisions, sans synchronisation du montage en direct. Les données administratives autorisées seront énumérées et les autorités des états définies en 9.1 ; aucun backend ni connecteur n’est choisi ici.

## 38. Collaboration offline, import et fusion

L’ancien modèle de collaboration temps réel, avec présence, curseurs ou sélections distants et modifications live, est abandonné. Aucun utilisateur ne voit en direct le travail des autres.

Flux normal :

1. un Sound Designer travaille localement sur un chapitre ;
2. il exporte un `.chpt` candidat ;
3. le fichier est importé pour révision sans écraser la version validée ;
4. les Réviseurs contrôlent la candidate ;
5. une fois toutes les validations requises obtenues, la candidate devient la version validée du chapitre dans le `.jacq`.

Les opérations préparées hors ligne restent locales jusqu’à transmission connectée et acceptation autorisée. Avant tout envoi à reconnexion, les droits sont revérifiés ; une révocation bloque les envois en attente et conserve le travail pour archivage. Le tableau de bord distingue sa dernière actualisation des modifications locales non transmises.

Des contributions portant sur des chapitres différents s’intègrent sans conflit lorsque leur identité et leur filiation sont compatibles. Leur intégration ne réécrit ni n’écrase les autres chapitres. Les médias identiques restent dédupliqués par empreinte.

Une origine incompatible, une filiation inconnue ou une modification concurrente d’informations communes interdit toute intégration silencieuse.

Pour deux versions concurrentes du même chapitre, les candidates restent distinctes. Tout Réviseur affecté peut proposer une candidate complète comme candidate active à examiner ; cette proposition ne vaut ni sélection définitive ni validation. La candidate n’est intégrée qu’après l’approbation de tous les Réviseurs affectés. Un désaccord bloque le chapitre : il n’existe ni vote majoritaire ni arbitrage du Chef d’équipe sur le choix éditorial. Une autre candidate peut être proposée explicitement, sans remplacement silencieux d’une proposition concurrente. Toutes les candidates et décisions précédentes restent dans l’historique. Aucun fichier n’est détruit silencieusement.

Lors de l’import d’un `.chpt`, la correspondance automatique d’un assigné n’est autorisée que si son identifiant Jaquette global est strictement identique et si la personne possède les droits nécessaires dans le projet cible. Aucune correspondance silencieuse n’est effectuée par nom, adresse IP ou adresse électronique non vérifiée. Si l’identité n’est pas reconnue ou n’est pas autorisée, l’import ne finalise pas automatiquement l’affectation : le Chef d’équipe choisit explicitement un assigné autorisé, ou l’Auteur indépendant dans son workspace. L’identité et l’assigné d’origine restent dans l’historique et l’audit ; cette réaffectation explicite ne réécrit pas l’auteur historique de la contribution.

Toute information qui n’appartient pas exclusivement à un seul chapitre est une information commune du `.jacq` et ne doit pas être placée dans un `.chpt`. La liste de la section 5.1 est un minimum normatif, non une liste exhaustive champ par champ. Une donnée clairement propre à un chapitre reste dans son `.chpt`. Si deux copies modifient différemment une information commune, le conflit est explicite, aucune valeur ne gagne automatiquement et la décision est journalisée. Le Chef d’équipe arbitre ; dans un workspace d’Auteur indépendant, l’Auteur indépendant arbitre.

## 39. Audit

Journaliser notamment :

- connexion ;
- import ;
- modification projet ;
- ajout/suppression d’événement ;
- changement de statut ;
- génération, changement de statut, assignation et achèvement d’une tâche ;
- correspondance ou réaffectation explicite d’un assigné importé, avec conservation de l’identité et de l’assigné d’origine ;
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
- appel IA ;
- acceptation/rejet de proposition IA.

## 40. MCP / IA

Le MCP est requis dès le lancement sur les parcours Web et Electron. Les agents externes proposent un doublage avec les seuls médias des bibliothèques autorisées ; aucune génération sonore n’est incluse. Un agent et un modèle locaux peuvent fonctionner hors ligne ; tout fournisseur distant exige consentement et connexion. Desktop peut fournir une connexion locale au navigateur, à qualifier selon le plan.

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

### Exemples de capacités, sans contrat figé

Ces noms illustrent lecture/recherche et propositions dans un brouillon séparé. Aucun outil ne modifie directement le master ; paramètres, schémas, transports et noms définitifs restent à définir en 12.1.

```text
search_sounds
get_sound_metadata
preview_sound
propose_sfx
propose_ambience
propose_music
propose_volume
propose_loop
propose_fade
propose_ducking
propose_spatial_position
propose_annotation_update
propose_annotation_deletion
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

Le socle React/TypeScript/Vite et la DA existants sont réutilisés. L’arborescence suivante est une proposition historique de monorepo, non adoptée : ne pas restructurer automatiquement le dépôt. Comparer les options dans la nouvelle 1.1 et créer des packages seulement si nécessaires.

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

Une abstraction de stockage est à définir dans la nouvelle 1.1 ; `ProjectStorage` et les méthodes ci-dessous ne sont qu’une proposition. Elle devra permettre la sauvegarde atomique ou équivalente d’un chapitre sans réécrire les autres `.chpt` ; la forme exacte reste à décider.

```text
open()
save()
readAsset()
writeAsset()
deleteAsset()
exportProject()
```

Options Web à comparer : accès fichier et OPFS, sans dépendance obligatoire à une API propre à Chrome. Option Electron : système de fichiers natif. Aucun choix de stockage, de ZIP ou de conteneur `.jacq`/`.chpt` n’est adopté ici.

Le parcours de sauvegarde de la section 4 du plan et la distinction éventuelle espace de travail/copie portable restent des propositions. Leur décision exige les preuves de la **nouvelle 1.2** : écritures physiques par chapitre, croissance, interruption, récupération et portabilité sur toutes les cibles. Une archive régénérée à l’export ou des empreintes identiques ne prouvent pas une autosauvegarde physique partielle.

## 45. Audio Web et Electron

Pistes techniques à éprouver, sans nouvelle dépendance adoptée en 0.1 :

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
- mode sombre au lancement ;
- mode clair plus tard.

## 48. Plan de développement actif et conservation de l’historique

Le [plan du 11 septembre 2026](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) est l’unique calendrier actif : étape 0 de reprise, étapes 1 à 16 jusqu’au lancement, puis extension F1. Ses prérequis et critères d’acceptation font autorité ; aucun numéro ne vaut validation.

L’ancienne phase 0, les anciennes sous-étapes 1.1 à 1.3 et le lot 1.4.1 sont acquis. Sur main à la base de 0.1, le prototype propose Sound Designer et Réviseur. Les quatre rôles et les correctifs de l’ancien 1.4.2 sont présents uniquement dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9), branche codex/phase-1-4-2-team-lead-admin-variants, SHA 5cabbb016d3ce5480b165512c1aa7814b8367802, tant qu’ils ne sont pas fusionnés. Le lot 1.4.2 reste non acquis avant sa revalidation humaine.

L’ancien 1.4.3 n’est plus une prochaine livraison autonome. Aucun périmètre précis n’a été retrouvé dans l’ancien plan : ses reliquats réellement identifiables seront inventoriés en 0.3/0.5, puis rattachés aux futures sous-étapes correspondantes. Aucun besoin ne lui est attribué rétroactivement ; l’ancienne sous-étape 1.4 et la phase 1 ne sont pas clôturées.

La nouvelle étape 0 est distincte de l’ancienne phase 0 acquise. Après Go de 0.1, la prochaine action est **0.2 — Reproduire la base**, sans démarrer l’ancienne 2.1 ni la nouvelle étape 1. La version reste **0.0.0**.

Les listes d’étapes historiques sont conservées dans le [cahier antérieur](https://github.com/Soyfki/Jaquette/blob/8a9e9a7ed692f26e3969641a4584669bfa1d93a9/CAHIER_DES_CHARGES_JAQUETTE.md) et le [plan antérieur](https://github.com/Soyfki/Jaquette/blob/8a9e9a7ed692f26e3969641a4584669bfa1d93a9/PLAN_DE_DEVELOPPEMENT_JAQUETTE.md). Elles n’imposent plus leur ordre de livraison.

## 49. Jalons actifs et correspondance historique

| Jalon actif | Périmètre et preuve attendue | Correspondance historique, sans équivalence d’acquis |
|---|---|---|
| J0 — Choix éprouvés | Étapes 0–1 : reprise et expériences des risques | Fin du prototype, stockage et premiers essais Electron avancés |
| J1 — Production locale minimale | Étapes 2–3 : ancres, vrai son, réouverture et sauvegarde partielle | Ancien V0.1 textuel et partie stockage de V0.3 |
| Atelier complet | Étapes 4–7 : invitation, cinq jours offline, bibliothèque, moteur et réglages | Ancien V0.2 audio et fonctions locales |
| J2 — Collaboration opérationnelle | Étapes 8–10 : tâches, échanges privés, unanimité et validation finale | Ancien V2 Collaboration avancé avant lancement |
| Banques et IA | Étapes 11–12 : banques privées et MCP | Ancien V1.5 IA avancé avant lancement |
| J3 — Produit complet de production | Étape 13 : qualité, export et contrôle ; MCP requis | Ancien V0.3 Production Web, signature réelle séparée en F1 |
| Première version distribuée | Étapes 14–16 : Web complet et Electron qualifiés, pilotes | Ancien V1 Desktop rejoint le lancement Web |
| Extension Jacques | F1 : contrat réel, métadonnées boutique, signature de publication, publication et retrait | Anciennes fonctions de publication Jacques différées |

Les configurations, volumes et performances de la section 5 du plan sont des **cibles proposées**, à adopter ou ajuster en 0.4 et à mesurer ensuite. Ce ne sont ni des résultats acquis ni des promesses de performance déjà qualifiées. Les choix de la section 4 restent à prouver en 1.2. Les versions nommées « V1 — Premier doublage », « V2 — Retours éditoriaux » et « V3 — Mix final » de la section 17 gardent leur sens : ce sont des états d’un projet, pas des jalons.

## 50. Risques techniques prioritaires

1. Stabilité de la tokenisation EPUB.
2. Conservation du rendu des EPUB complexes.
3. Synchronisation fiable texte ↔ audio.
4. Performances d’encodage dans Chrome, Firefox, Safari et Electron.
5. Poids des `.jacko` réels.
6. Sécurité de l’import HTML/CSS EPUB.
7. Cohérence des validations entre candidates et cycles offline.
8. Détection fiable des filiations, conflits de chapitre et conflits d’informations communes.
9. Signature et compatibilité de version du format `.jacko`.
10. Sécurité du serveur MCP et cloisonnement des ressources.

## 51. Critère global de la première livraison

Sur les plateformes qualifiées, un utilisateur invité doit pouvoir activer son accès en ligne, préparer son environnement, importer les EPUB FR/EN/arabe, sonoriser avec SFX/Ambiance/Musique, régler et simuler, sauvegarder puis retrouver exactement ses ancres et ses sons après réouverture. Une modification de chapitre ne réécrit aucun autre .chpt ; les médias embarqués restent lisibles sans accès à la bibliothèque source.

Le parcours comprend cinq jours hors ligne, puis consultation/sauvegarde/archivage conservés après expiration ; à reconnexion, contrôle des droits avant tout envoi et archivage accompagné sans destruction en cas de révocation. Les échanges privés de candidates, les commentaires, les tâches automatiques, l’unanimité de révision et la validation finale sont éprouvés. Les décisions préparées offline ne deviennent officielles qu’après acceptation autorisée.

Un agent externe peut produire un brouillon MCP sur les sons autorisés, sans génération sonore ni modification directe du master ; l’acceptation humaine est contrôlée. Le fonctionnement sans réseau exige agent et modèle locaux ; un fournisseur distant exige consentement et connexion.

L’utilisateur exporte un .jacko optimisé puis le rouvre en contrôle/lecture seule avec parité vérifiée. La signature avec clés de test démontre le mécanisme sans authentifier une publication réelle. Publication, boutique et dépublication Jacques ne conditionnent pas cette livraison : leurs capacités, tâche automatique, métadonnées et signature restent obligatoires en F1.

Le premier jalon technique critique demeure l’association exacte entre ancre et son après fermeture/réouverture. La conservation de la DA, la confidentialité, les permissions contextuelles, les interdictions de montage Réviseur/Chef et la protection du master restent des invariants.
