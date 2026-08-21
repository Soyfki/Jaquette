# Jaquette — Plan de développement détaillé

## 1. Objectif du plan

Ce document transforme le cahier des charges de Jaquette en une séquence de développement incrémentale.

Chaque grande étape est découpée en sous-étapes testables.

Règles de conduite :

- Ne jamais commencer une étape dépendante si les critères d’acceptation de l’étape précédente ne sont pas validés.
- Chaque sous-étape doit produire un résultat démontrable.
- Les tests doivent utiliser progressivement un véritable EPUB de référence et une véritable bibliothèque audio de test.
- Les fonctionnalités de collaboration, IA et publication ne doivent pas masquer une faiblesse du socle texte/audio.
- Les décisions techniques qui ne sont pas encore figées doivent rester des décisions d’implémentation et non devenir des règles métier implicites.

---

# PHASE 0 — Préparation du projet

## 0.1 Initialiser le dépôt

Objectif :
Créer le socle minimal du repository Jaquette.

Livrables :
- dépôt initialisé ;
- README ;
- cahier des charges ;
- AGENTS.md ;
- dossier de documentation ;
- première convention de version du projet.

Test d’acceptation :
- le dépôt peut être cloné ;
- les documents de référence sont accessibles ;
- un nouveau contributeur peut identifier immédiatement le cahier des charges et AGENTS.md.

## 0.2 Définir le jeu de données de référence

Objectif :
Choisir les éléments réels utilisés pendant tout le développement.

Livrables :
- un EPUB de référence ;
- au moins un EPUB anglais ;
- au moins un EPUB contenant de l’arabe/RTL ;
- une bibliothèque audio de test ;
- un scénario de doublage de référence.

Test d’acceptation :
- l’équipe peut ouvrir les trois EPUB avec un lecteur existant ;
- la bibliothèque contient des SFX, ambiances et musiques ;
- le scénario de référence indique au moins une annotation de chaque type.

## 0.3 Définir le protocole de validation

Objectif :
Créer une méthode commune pour valider chaque livraison.

Livrables :
- checklist de validation ;
- convention de rapport de bug ;
- règle de validation “pass/fail”.

Test d’acceptation :
- un membre non développeur peut exécuter une checklist simple et conclure “validé” ou “non validé”.

---

# PHASE 1 — Prototype visuel et navigation principale

## 1.1 Construire le design system de base

Objectif :
Implémenter les règles visuelles déjà décidées.

Inclure :
- fond `#1B1B3A` ;
- texte `#EFF2FF` ;
- accent `#FFDFB2` ;
- secondaire `#74A4BC` ;
- validation `#CFF2EC` ;
- SFX `#FFAF87` ;
- ambiance `#E56399` ;
- musique `#9358FF` ;
- succès sombre `#83B692` ;
- succès clair `#355A40` ;
- erreur `#A20021` ;
- Manrope ;
- Literata ;
- composants à bords très arrondis.

Test d’acceptation :
- chaque couleur est visible dans une page de démonstration ;
- les composants utilisent les bonnes typographies ;
- aucun ancien code couleur métier n’apparaît.

## 1.2 Créer la structure d’écran principale

Objectif :
Mettre en place le shell de Jaquette.

Écrans minimum :
- connexion ;
- accueil ;
- projet ;
- paramètres.

Test d’acceptation :
- navigation entre les écrans sans rechargement complet ;
- état actif clair ;
- shell stable quelle que soit la page.

## 1.3 Créer l’écran de projet Sound Designer vide

Objectif :
Valider le layout principal avant le moteur EPUB.

Disposition :
- bibliothèque à gauche ;
- livre au centre ;
- inspecteur à droite ;
- zone de contrôle/simulation.

Test d’acceptation :
- chaque panneau peut afficher du contenu fictif ;
- le livre reste la zone dominante ;
- la page centrale est claire sur interface sombre.

## 1.4 Créer les variantes d’interface par rôle

Objectif :
Valider le principe d’interface adaptative.

Variantes :
- Sound Designer ;
- Réviseur ;
- Chef d’équipe ;
- Admin Maison.

Test d’acceptation :
- changer le rôle simulé modifie réellement la disposition ;
- les outils de montage sont absents du mode Réviseur/Chef ;
- l’Admin voit une interface orientée gestion.

---

# PHASE 2 — Identité locale, workspaces, équipes et projets

## 2.1 Modéliser l’identité locale

Objectif :
Créer le concept d’identité Jaquette sans backend collaboratif.

Doit représenter :
- identité globale ;
- plusieurs emails ;
- workspaces ;
- appartenances ;
- rôles contextuels.

Test d’acceptation :
- une identité fictive peut avoir deux emails ;
- elle peut appartenir à deux workspaces ;
- son rôle diffère entre les workspaces.

## 2.2 Implémenter l’authentification prototype

Objectif :
Créer la porte d’entrée V1.

Règles :
- secrets hors frontend versionné ;
- deux comptes de prototype configurables.

Test d’acceptation :
- un compte autorisé se connecte ;
- un mauvais mot de passe échoue ;
- aucun secret en clair n’est présent dans les fichiers versionnés ou le bundle livré.

## 2.3 Construire le switch de workspace

Objectif :
Permettre le changement de contexte.

Test d’acceptation :
- un utilisateur présent dans plusieurs workspaces peut basculer entre eux ;
- les projets et équipes affichés changent avec le workspace ;
- le rôle actif est recalculé selon le contexte.

## 2.4 Construire les équipes

Objectif :
Créer et afficher les équipes locales.

Test d’acceptation :
- créer une équipe ;
- affecter des utilisateurs fictifs ;
- affecter un rôle différent par équipe ;
- un Chef peut être associé à plusieurs équipes.

## 2.5 Construire les projets et Drafts

Objectif :
Créer le pool Drafts et les projets actifs.

Test d’acceptation :
- créer un Draft ;
- l’affecter à une équipe ;
- il disparaît du pool Drafts et apparaît dans les projets de l’équipe.

## 2.6 Construire l’accueil façon Figma

Objectif :
Créer l’accueil réel du produit.

Inclure :
- projets récents ;
- Drafts ;
- équipes ;
- tâches ;
- tickets fictifs ;
- statut ;
- progression.

Test d’acceptation :
- le même utilisateur voit un accueil différent selon son rôle/contexte ;
- les cartes de projet permettent d’ouvrir le bon projet.

---

# PHASE 3 — Import EPUB et rendu du livre

## 3.1 Importer un EPUB

Objectif :
Permettre la sélection et l’ouverture du fichier.

Test d’acceptation :
- un EPUB valide est accepté ;
- un fichier non EPUB est refusé proprement.

## 3.2 Lire la structure EPUB

Objectif :
Identifier :
- package ;
- spine ;
- chapitres ;
- navigation ;
- ressources.

Test d’acceptation :
- la liste des chapitres du livre de référence correspond au livre original.

## 3.3 Afficher le contenu d’un chapitre

Objectif :
Rendre le HTML du livre.

Test d’acceptation :
- texte lisible ;
- paragraphes présents ;
- images principales visibles ;
- navigation chapitre précédent/suivant fonctionnelle.

## 3.4 Appliquer le rendu typographique Jaquette

Objectif :
Appliquer Literata au corps et le fallback adapté.

Test d’acceptation :
- français et anglais en Literata ;
- arabe lisible ;
- direction RTL correcte ;
- page `#EFF2FF`, texte `#1B1B3A`.

## 3.5 Refuser les EPUB non supportés

Objectif :
Créer des erreurs explicites.

Cas minimum :
- DRM détectable ;
- fichier corrompu ;
- structure EPUB illisible.

Test d’acceptation :
- chaque cas produit un message compréhensible et ne casse pas la session.

---

# PHASE 4 — Tokenisation et ancrage stable

## 4.1 Segmenter le texte en chapitres / paragraphes / phrases / tokens

Objectif :
Créer la structure logique.

Test d’acceptation :
- afficher le nombre de tokens d’un chapitre ;
- le nombre reste identique entre deux imports identiques.

## 4.2 Créer des identifiants stables

Objectif :
Attribuer une ancre logique à chaque token.

Test d’acceptation critique :
- importer deux fois le même EPUB ;
- comparer automatiquement les IDs ;
- 100 % des tokens inchangés doivent conserver le même ID.

## 4.3 Gérer ponctuation et caractères spéciaux

Objectif :
Éviter des sélections incohérentes.

Test d’acceptation :
- apostrophes ;
- tirets ;
- guillemets ;
- ponctuation française ;
- caractères arabes ;
- nombres.

Les tokens doivent correspondre à une expérience de sélection cohérente.

## 4.4 Gérer le contenu multilingue et RTL

Test d’acceptation :
- un même chapitre peut contenir français et arabe ;
- les IDs restent stables ;
- le sens visuel ne modifie pas la logique de sélection.

## 4.5 Conserver les ancres après sauvegarde/réouverture

Test d’acceptation critique :
- créer un projet ;
- importer l’EPUB ;
- sauvegarder ;
- fermer ;
- rouvrir ;
- vérifier les mêmes IDs.

Cette sous-étape est un jalon bloquant.

---

# PHASE 5 — Sélection textuelle

## 5.1 Sélection par clic

Test :
- cliquer sur un mot ;
- seul ce mot est sélectionné.

## 5.2 Sélection par glisser

Test :
- glisser sur plusieurs mots ;
- la plage logique correspond exactement au texte visuel.

## 5.3 Sélection Shift + clic

Test :
- sélectionner le premier mot ;
- Shift + clic sur le dernier ;
- toute la plage est sélectionnée.

## 5.4 Double clic phrase

Test :
- double cliquer au milieu d’une phrase ;
- la phrase complète est sélectionnée.

## 5.5 Triple clic paragraphe

Test :
- triple cliquer ;
- le paragraphe complet est sélectionné.

## 5.6 Sélection de chapitre/paragraphe via commande

Test :
- sélectionner tout un paragraphe ;
- sélectionner tout un chapitre.

## 5.7 Bloquer la traversée inter-chapitres

Test :
- tenter de prolonger une sélection dans le chapitre suivant ;
- l’opération doit être refusée ou limitée au chapitre courant.

---

# PHASE 6 — Premier moteur d’annotations

## 6.1 Créer un SFX

Objectif :
Associer une ressource fictive à un mot/plage.

Test :
- sélectionner un mot ;
- créer un SFX ;
- le rail `#FFAF87` apparaît sous la sélection.

## 6.2 Créer une Ambiance

Test :
- sélectionner une plage ;
- créer une Ambiance ;
- rail `#E56399`.

## 6.3 Créer une Musique

Test :
- créer une Musique ;
- rail `#9358FF`.

## 6.4 Superposer les trois types

Test :
- même phrase avec SFX + Ambiance + Musique ;
- les trois annotations restent distinguables.

## 6.5 Plusieurs SFX sur une même plage

Test :
- deux SFX sur le même token ;
- les deux existent indépendamment.

## 6.6 Copier/coller une annotation

Test :
- copier une annotation ;
- sélectionner une autre plage ;
- coller ;
- l’annotation copiée garde ses réglages mais pointe vers la nouvelle plage.

## 6.7 Supprimer/modifier une annotation

Test :
- modifier la plage ou le type autorisé ;
- supprimer ;
- l’état visuel et le modèle restent cohérents.

---

# PHASE 7 — Bibliothèque audio locale

## 7.1 Ajouter un dossier de bibliothèque

Test :
- choisir un dossier ;
- afficher les fichiers audio trouvés.

## 7.2 Afficher dossiers et sous-dossiers

Test :
- structure imbriquée fidèle au disque.

## 7.3 Lire les métadonnées

Test :
- afficher au minimum nom, durée, format, taille, fréquence, canaux pour plusieurs fichiers.

## 7.4 Préécouter un son

Test :
- clic Play ;
- lecture ;
- Stop/Pause cohérents ;
- la préécoute ne modifie pas le projet.

## 7.5 Recherche instantanée

Test :
- taper un fragment de nom ;
- seuls les résultats correspondants restent affichés.

## 7.6 Tags et catégories

Test :
- ajouter catégories structurées et tags libres ;
- rechercher/filtrer avec ces informations.

## 7.7 Favoris

Test :
- marquer ;
- afficher une vue Favoris ;
- retirer.

## 7.8 Collections

Test :
- créer une collection ;
- ajouter un son déjà présent dans un dossier ;
- le son reste dans son dossier et apparaît dans la collection.

## 7.9 Nombre d’utilisations

Test :
- utiliser un son dans trois annotations ;
- bibliothèque affiche `3`.

## 7.10 Drag-and-drop vers le texte

Test :
- sélectionner une plage ;
- glisser un son ;
- créer l’annotation correspondante.

## 7.11 Copie du média utilisé dans le projet

Test critique :
- utiliser un son ;
- sauvegarder le `.jacq` ;
- retirer/déplacer le dossier source ;
- le projet conserve le média.

## 7.12 Mise à jour depuis la bibliothèque

Test :
- modifier/remplacer la source de bibliothèque ;
- Jaquette signale une différence ;
- aucune mise à jour automatique ;
- bouton explicite effectue la mise à jour.

---

# PHASE 8 — Édition audio non destructive

## 8.1 Volume par occurrence

Test :
- deux occurrences du même fichier avec volumes différents ;
- aucune modification du média source.

## 8.2 Point d’entrée / trim

Test :
- définir un début différent ;
- prévisualisation démarre au bon point.

## 8.3 Boucle

Test :
- activer/désactiver ;
- comportement conforme selon la plage.

## 8.4 Zone de boucle

Test :
- définir une sous-zone ;
- seule cette zone est répétée.

## 8.5 Fade-in / fade-out

Test :
- définir des plages textuelles ;
- visualiser les bornes ;
- simulation applique une évolution progressive.

## 8.6 Normalisation

Test :
- activer/désactiver par occurrence ;
- résultat différent ;
- source intacte.

## 8.7 Ducking

Test :
- SFX déclenche une baisse de musique/ambiance ;
- valeur d’atténuation différente sur deux occurrences.

## 8.8 Spatialisation 3D

Test :
- modifier position autour du lecteur ;
- la préécoute reproduit une différence perceptible.

## 8.9 Mute / Solo

Test :
- mute d’une famille ;
- solo d’une famille ;
- résultats conformes sans modifier les annotations.

---

# PHASE 9 — Moteur de simulation

## 9.1 Déclenchement SFX

Test :
- entrer dans la plage ;
- SFX joué une fois selon la simulation.

## 9.2 Limite des 3 SFX

Test :
- déclencher 4 SFX rapidement ;
- le plus ancien des trois en cours est coupé.

## 9.3 Ambiances superposables

Test :
- deux ambiances actives simultanément ;
- les deux sont audibles.

## 9.4 Règle boucle Ambiance

Test :
- boucle ON : répétition jusqu’à fin de plage ;
- boucle OFF : une lecture puis silence.

## 9.5 Musique exclusive

Test :
- musique A active ;
- démarrage de B ;
- pas de coexistence durable hors crossfade.

## 9.6 Crossfade musique

Test :
- A baisse pendant que B monte ;
- transition sans coupure sèche.

## 9.7 Fades textuels

Test :
- progression simulée dans la plage ;
- volume suit l’avancement.

## 9.8 Souris comme eye-tracker simulé

Test :
- déplacer la souris sur les tokens ;
- événements correspondant au token actif se déclenchent.

## 9.9 Lecture automatique en mots/minute

Test :
- 200 mots/minute ;
- progression visuelle et logique reproductible.

## 9.10 Vitesses x1 / x2 / x4

Test :
- la vitesse change sans modifier le projet.

## 9.11 Lire la sélection

Test :
- lecture commence au premier token sélectionné et s’arrête selon le périmètre prévu.

## 9.12 Lire depuis ici

Test :
- démarrage à une ancre choisie ;
- l’état audio est correctement reconstruit pour la position.

---

# PHASE 10 — Sauvegarde `.jacq`

## 10.1 Autosave

Test :
- effectuer une modification ;
- fermer/recharger ;
- modification conservée sans sauvegarde manuelle explicite.

## 10.2 Undo/Redo

Test :
- réaliser plus de 50 actions ;
- seules les 50 dernières sont disponibles dans l’historique d’annulation.

## 10.3 Versions nommées

Test :
- créer V1 ;
- modifier ;
- créer V2 ;
- les deux restent identifiables.

## 10.4 Export `.jacq`

Test :
- exporter le projet ;
- vérifier qu’il inclut les médias réellement utilisés.

## 10.5 Import `.jacq`

Test :
- fermer Jaquette ;
- rouvrir le fichier ;
- retrouver texte, annotations, réglages, médias et métadonnées.

## 10.6 Projet autonome

Test critique :
- exporter `.jacq` ;
- supprimer toutes les bibliothèques originales ;
- réimporter ;
- toutes les annotations audio fonctionnent.

---

# PHASE 11 — Tickets, commentaires et workflow de production

## 11.1 Commentaires sur une plage

Test :
- sélectionner du texte ;
- créer commentaire ;
- rouvrir le passage via le commentaire.

## 11.2 Créer un ticket

Test :
- ticket avec titre, priorité, assigné, statut ;
- visible dans Mes tâches.

## 11.3 Ticket lié au texte

Test :
- clic ticket ;
- navigation directe au passage.

## 11.4 Statuts de ticket

Test :
- À faire → En cours → À revoir → Résolu → Fermé.

## 11.5 Priorités

Test :
- tri ou indication correcte Faible / Normale / Haute / Bloquante.

## 11.6 Affectation des chapitres

Test :
- chapitre 1 assigné à A ;
- chapitre 2 assigné à B ;
- chacun voit sa charge correcte.

## 11.7 Déclaration chapitre terminé

Test :
- Sound Designer termine un chapitre ;
- progression Doublage mise à jour.

---

# PHASE 12 — Révision

## 12.1 Interface Réviseur

Test :
- aucun outil de montage ;
- simulation, commentaires, tickets et validation disponibles.

## 12.2 Statut par chapitre et par Réviseur

Test :
- Non révisé → À corriger / Validé.

## 12.3 Invalidation obligatoire avec motif

Test :
- tenter “À corriger” sans commentaire/ticket ;
- action refusée.

## 12.4 Validation multi-réviseurs

Test :
- projet avec 3 Réviseurs ;
- validation 1/3 et 2/3 ne suffit pas ;
- 3/3 valide le chapitre.

## 12.5 Calcul de progression Révision

Test :
- valeur calculée sur validations attendues/obtenues.

## 12.6 Modification après validation

Test critique :
- valider un chapitre ;
- Sound Designer modifie une annotation ;
- validation active annulée ;
- chapitre repasse À réviser ;
- ancienne validation reste historique.

## 12.7 Soumission au Chef

Test :
- bouton bloqué tant qu’un chapitre n’est pas validé par tous ;
- disponible lorsque tout est validé.

---

# PHASE 13 — Chef d’équipe et validation finale

## 13.1 Dashboard Chef

Test :
- affiche projets, doublage %, révision %, statut final.

## 13.2 Vue par équipe

Test :
- Chef de deux équipes peut passer de l’une à l’autre.

## 13.3 Vue consolidée

Test :
- “Toutes mes équipes” affiche l’ensemble des projets gérés.

## 13.4 Simulation par le Chef

Test :
- simulation autorisée ;
- aucun outil de montage accessible.

## 13.5 Rejet vers Sound Designer

Test :
- changement de statut ;
- ticket/commentaire associé ;
- projet revient au workflow approprié.

## 13.6 Rejet vers Réviseur

Test :
- retour en révision sans modification audio directe par le Chef.

## 13.7 Validation finale

Test :
- après validation, état `Validé` puis `Prêt à publier` accessible.

---

# PHASE 14 — Contrôle qualité et pré-export

## 14.1 Détecter média manquant

Test :
- créer une référence invalide ;
- erreur bloquante.

## 14.2 Détecter annotation invalide

Test :
- plage incohérente ;
- erreur.

## 14.3 Détecter conflit musical

Test :
- configuration créant deux musiques actives durablement ;
- erreur ou correction imposée avant export.

## 14.4 Détecter boucle invalide

Test :
- zone de boucle impossible ;
- export bloqué.

## 14.5 Estimer clipping / niveaux problématiques

Test :
- scénario volontairement excessif ;
- avertissement ou erreur selon règle retenue.

## 14.6 Vérifier métadonnées nécessaires

Test :
- champ obligatoire absent ;
- signalement explicite.

## 14.7 Écran pré-export

Test :
- résumé SFX/Ambiances/Musiques ;
- erreurs ;
- avertissements ;
- poids estimé.

---

# PHASE 15 — Export `.jacko`

## 15.1 Construire le conteneur `.jacko`

Test :
- export crée un seul fichier ;
- contenu logique inspectable en développement.

## 15.2 Générer le manifeste

Test :
- contient version, livre, chapitres, tokens et événements.

## 15.3 Exporter les médias réellement utilisés

Test :
- ressource inutilisée dans la bibliothèque absente du `.jacko`.

## 15.4 Déduplication

Test :
- deux occurrences du même média ;
- une seule ressource audio embarquée.

## 15.5 Compression selon preset

Test :
- même projet exporté en Ultra léger et Haute qualité ;
- poids et paramètres diffèrent.

## 15.6 Estimation avant export vs poids réel

Test :
- comparer estimation et résultat ;
- écart mesuré et jugé acceptable par l’équipe.

## 15.7 Checksums

Test :
- modifier une ressource après export en environnement de test ;
- incohérence détectable.

## 15.8 Version du format

Test :
- `formatVersion` présent ;
- lecteur de contrôle sait refuser une version inconnue.

---

# PHASE 16 — Contrôle d’un `.jacko`

## 16.1 Ouvrir `.jacko` en lecture seule

Test :
- fichier s’ouvre ;
- aucun outil d’édition disponible.

## 16.2 Reconstituer le livre

Test :
- chapitres, images, styles utiles, polices et texte présents.

## 16.3 Rejouer le doublage

Test :
- simulation reproduit SFX, Ambiances et Musiques du projet source.

## 16.4 Vérifier la parité `.jacq` / `.jacko`

Test :
- scénario de référence joué dans les deux ;
- comportements équivalents pour les fonctionnalités supportées.

---

# PHASE 17 — Métadonnées Jacques et signature

## 17.1 Formulaire de métadonnées

Test :
- titre, auteur, couverture, résumé, langue, catégories, prix, devise, territoires, date, visibilité, version.

## 17.2 Validation des champs

Test :
- champ requis manquant ;
- passage à `Prêt à publier` bloqué.

## 17.3 Gestion `bookId`

Test :
- export V1 puis V2 du même livre ;
- `bookId` identique.

## 17.4 Gestion `releaseId`

Test :
- chaque publication produit un `releaseId` différent.

## 17.5 Signature numérique

Test :
- `.jacko` normal vérifié comme valide ;
- modification manuelle invalide la vérification.

## 17.6 État Prêt à publier

Test :
- validation éditoriale ne publie pas automatiquement ;
- action séparée requise.

---

# PHASE 18 — Prototype Web complet V1

## 18.1 Test bout-en-bout officiel

Scénario :

1. connexion ;
2. workspace ;
3. création/affectation projet ;
4. import EPUB ;
5. indexation bibliothèque ;
6. doublage SFX/Ambiance/Musique ;
7. édition ;
8. simulation ;
9. sauvegarde ;
10. fermeture ;
11. réouverture `.jacq` ;
12. ticket/révision ;
13. validations ;
14. Chef ;
15. métadonnées ;
16. export `.jacko` ;
17. fermeture ;
18. ouverture `.jacko` ;
19. simulation ;
20. contrôle intégrité.

Test d’acceptation :
- scénario exécuté sans intervention manuelle sur les fichiers internes ;
- aucun blocage critique.

## 18.2 Test français

Test :
- workflow complet sur EPUB français.

## 18.3 Test anglais

Test :
- workflow essentiel sur EPUB anglais.

## 18.4 Test arabe / RTL

Test :
- import, sélection, annotation, sauvegarde et simulation sur contenu arabe.

## 18.5 Test de projet volumineux

Test :
- projet proche du cas d’usage réel ;
- mesurer temps d’ouverture, sauvegarde, simulation et export.

## 18.6 Validation officielle V1 Web

Critère :
- aucun bug bloquant sur le scénario officiel ;
- risques connus documentés ;
- décision explicite de passage à Electron.

---

# PHASE 19 — Migration Electron

## 19.1 Créer le shell desktop

Test :
- application installable/lancée sur macOS et Windows.

## 19.2 Ouvrir un `.jacq` local

Test :
- double parcours ouvrir/fermer/sauvegarder.

## 19.3 Accès bibliothèques locales

Test :
- indexation d’un dossier audio volumineux sans dépendre du navigateur.

## 19.4 Traitements audio desktop

Test :
- même opération audio que Web ;
- résultat métier identique.

## 19.5 Sécuriser les échanges entre interface et fonctions système

Test :
- l’interface n’obtient que les capacités nécessaires ;
- un contenu EPUB ne peut pas invoquer directement des capacités système.

## 19.6 Parité fonctionnelle Web/Desktop

Test :
- même `.jacq` ouvert dans les deux ;
- annotations, médias et workflow cohérents.

## 19.7 Builds Windows/macOS

Test :
- installation propre ;
- démarrage ;
- import ;
- sauvegarde ;
- export ;
- désinstallation sans corruption des projets.

---

# PHASE 20 — MCP et brouillon IA

## 20.1 Activer l’état IA par projet

Test :
- IA interdite bloque toute exposition ;
- IA autorisée nécessite consentement.

## 20.2 Consentement explicite

Test :
- fournisseur affiché ;
- utilisateur certifie l’autorisation ;
- date, compte, fournisseur et version enregistrés.

## 20.3 Révocation

Test :
- après révocation, nouvel appel IA bloqué.

## 20.4 Exposer le livre comme ressource contrôlée

Test :
- agent autorisé peut lire un chapitre ;
- ne peut pas lire un fichier arbitraire du disque.

## 20.5 Exposer la bibliothèque

Test :
- agent peut chercher des sons par métadonnées/tags.

## 20.6 Exposer les annotations

Test :
- agent peut comprendre les événements existants du chapitre.

## 20.7 Créer un brouillon IA

Test :
- agent propose au moins un SFX, une Ambiance et une Musique ;
- master inchangé.

## 20.8 Proposition de modification

Test :
- agent propose de modifier une annotation humaine ;
- changement visible comme proposition, pas appliqué.

## 20.9 Acceptation unitaire

Test :
- accepter une proposition ;
- seule cette proposition rejoint le master.

## 20.10 Acceptation par chapitre

Test :
- toutes les propositions du chapitre sont appliquées.

## 20.11 Acceptation globale

Test :
- tout le brouillon est appliqué en une action contrôlée.

## 20.12 Rejet

Test :
- rejet ne modifie jamais le master.

## 20.13 Audit IA

Test :
- chaque consentement, appel, acceptation et rejet apparaît dans l’historique prévu.

---

# PHASE 21 — Comptes réels et organisations V2

## 21.1 Inscription / identité réelle

Test :
- utilisateur avec email vérifié.

## 21.2 Plusieurs emails par identité

Test :
- ajouter une seconde adresse ;
- connexion via les deux vers la même identité.

## 21.3 Fusion de comptes

Test :
- deux identités contrôlées fusionnées ;
- projets et appartenances conservés.

## 21.4 Invitation Maison

Test :
- Admin Maison invite ;
- membre rejoint le bon workspace.

## 21.5 Restrictions Admin Maison

Test :
- peut administrer ;
- ne peut pas monter/reviser automatiquement sans rôle métier.

## 21.6 Invitations Auteur

Test :
- Auteur invite un freelance ;
- lui attribue un rôle projet.

## 21.7 Switch multi-maison

Test :
- même identité présente dans plusieurs maisons ;
- changement de contexte sans nouvelle connexion.

---

# PHASE 22 — Collaboration temps réel V2

## 22.1 Présence

Test :
- deux utilisateurs ouvrent le même projet ;
- chacun voit l’autre.

## 22.2 Position dans le livre

Test :
- chapitre consulté et sélection visibles selon les règles prévues.

## 22.3 Synchronisation d’une modification distincte

Test :
- utilisateur A modifie chapitre 1 ;
- B modifie chapitre 2 ;
- les deux changements apparaissent sans conflit.

## 22.4 Détection de conflit

Test :
- A et B modifient la même annotation simultanément ;
- conflit explicite.

## 22.5 Résolution de conflit

Test :
- utilisateur choisit la version à conserver ou traite le conflit via le mécanisme prévu ;
- aucune fusion silencieuse.

## 22.6 Commentaires temps réel

Test :
- nouveau commentaire visible chez l’autre utilisateur.

## 22.7 Tickets temps réel

Test :
- changement de statut/assignation synchronisé.

---

# PHASE 23 — Architecture hybride Cloud / Data Plane

## 23.1 Séparer métadonnées et contenu sensible

Test :
- cloud peut lister projet et permissions ;
- contenu du manuscrit reste hors stockage cloud Jaquette.

## 23.2 Accès distant autorisé

Test :
- utilisateur distant autorisé ouvre un projet via l’infrastructure de l’organisation.

## 23.3 Refus d’accès

Test :
- utilisateur non affecté ne peut pas lire/modifier les données protégées.

## 23.4 Audit central

Test :
- connexions, invitations, permissions et actions importantes consultables selon droits.

## 23.5 Gestion de la déconnexion du data plane

Test :
- interface indique clairement qu’un projet local/organisation est indisponible ;
- aucune corruption de métadonnées.

---

# PHASE 24 — Publication Jacques

## 24.1 Connexion Jaquette → Jacques

Test :
- action Publier transmet un `.jacko` valide et ses métadonnées.

## 24.2 Publication distincte de validation

Test :
- un projet `Validé` n’apparaît pas dans Jacques avant action Publier.

## 24.3 Nouvelle release

Test :
- V2 d’un livre existant met à jour le même `bookId` avec nouveau `releaseId`.

## 24.4 Dépublication Admin Maison

Test :
- Admin autorisé peut retirer ;
- action confirmée et auditée.

## 24.5 Dépublication Super Admin

Test :
- même résultat avec droits globaux.

## 24.6 Chef non autorisé à dépublier

Test :
- action absente ou refusée.

---

# PHASE 25 — Stabilisation et version finale

## 25.1 Campagne de régression

Tester intégralement :
- import ;
- tokenisation ;
- sélection ;
- trois pistes ;
- édition ;
- bibliothèque ;
- sauvegarde ;
- révision ;
- export ;
- signature ;
- collaboration ;
- IA ;
- publication.

Critère :
- zéro bug bloquant connu.

## 25.2 Test de récupération de projet

Test :
- fermeture forcée pendant une session ;
- réouverture sans perte au-delà de la politique d’autosave prévue.

## 25.3 Test changement de bibliothèque

Test :
- chemins déplacés ;
- projet autonome toujours exploitable.

## 25.4 Test multi-workspace

Test :
- utilisateur avec plusieurs maisons + espace Auteur ;
- permissions correctes dans chaque contexte.

## 25.5 Test publication de mise à jour

Test :
- livre publié → modification → invalidation → nouvelle révision → nouvelle release.

## 25.6 Test de sécurité IA

Test :
- agent tente d’accéder à une ressource hors projet ;
- refus.

## 25.7 Test de signature

Test :
- `.jacko` altéré rejeté par le mécanisme de contrôle.

## 25.8 Test de charge réel

Mesurer :
- taille de bibliothèque ;
- gros projet ;
- export ;
- ouverture ;
- simulation ;
- collaboration.

Critère :
- seuils d’acceptabilité définis à partir des mesures réelles avant release finale.

## 25.9 Documentation de reprise

Mettre à jour :
- README ;
- cahier des charges ;
- AGENTS.md ;
- documentation `.jacq` ;
- documentation `.jacko` ;
- règles de permissions ;
- procédures de release.

Test :
- un développeur/agent externe peut lancer le projet et comprendre ses invariants sans explication orale.

## 25.10 Release candidate

Critère :
- toutes les checklists produit passent ;
- aucun bug bloquant ;
- aucune dette connue empêchant l’usage métier réel.

## 25.11 Version finale

La version finale est considérée prête lorsque :

- Jaquette Desktop est stable sur Windows et macOS ;
- le workflow complet Sound Designer → Réviseur → Chef → Jacques fonctionne ;
- `.jacq` est fiable et autonome ;
- `.jacko` est optimisé, versionné et signé ;
- les permissions multi-workspace sont cohérentes ;
- la collaboration est utilisable ;
- le MCP est cloisonné ;
- le brouillon IA ne modifie jamais le master sans acceptation ;
- la publication et la dépublication respectent les droits ;
- les tests de régression passent.

---

# Jalons synthétiques

## Prototype P0 — UI et projet local
Phases 0 à 2.

Objectif :
Valider navigation, workspaces et expérience générale.

## Prototype P1 — Texte
Phases 3 à 5.

Objectif :
Valider EPUB, rendu, tokenisation et sélection.

## Prototype P2 — Audio
Phases 6 à 9.

Objectif :
Valider le concept “texte = timeline” avec les trois pistes.

## Alpha — Projet autonome
Phases 10 à 13.

Objectif :
Travailler réellement sur un `.jacq` avec workflow humain.

## Beta Web — Export
Phases 14 à 18.

Objectif :
Produire un `.jacko` réel depuis Chrome.

## V1 Desktop
Phase 19.

Objectif :
Passer en Electron sans changer les règles métier.

## V1.5 IA
Phase 20.

Objectif :
Premier doublage assisté et contrôlé par MCP.

## V2 Comptes & Collaboration
Phases 21 à 23.

Objectif :
Usage professionnel multi-utilisateur et multi-organisation.

## V2.x Jacques
Phase 24.

Objectif :
Publication et cycle de vie boutique.

## Release finale
Phase 25.

Objectif :
Stabilisation, documentation et validation métier complète.
