# Cahier des charges V1 — Jacquette

Version courte issue des décisions du 4 novembre 2026. Elle remplace le [cahier des charges de septembre](archive/CAHIER_DES_CHARGES_JAQUETTE.md), archivé. Le calendrier est dans le [plan V1](PLAN_V1.md).

## 1. Produit

- **Jacquette** est l'outil Web de bruitage de livres : une équipe associe des sons au texte d'un EPUB et exporte un `.jacko`.
- **Jacques** est la future application de lecture et la boutique. Elle n'existe pas encore ; Jacquette prépare ses fichiers.
- **Le texte est la timeline.** Les sons s'ancrent sur des mots ou des plages de mots, jamais sur une timeline temporelle.
- Utilisateurs : d'abord l'équipe de Soyfki (2 à 10 personnes), puis quelques maisons invitées ; 5 à 20 livres par an, 2 à 5 personnes par livre.
- Prise en main en moins d'une heure, sans formation. Objectif : un premier livre bruité de bout en bout, vite.

## 2. Plateforme et hébergement

- Application Web sur ordinateur, thème sombre uniquement. La tablette pour réviser est un plus, pas une exigence.
- Travail en ligne ; une copie locale de secours couvre une coupure réseau courte.
- Hébergement sur le VPS Ionos de Soyfki, `jacquette.jacques.page`, coût cible 0 à 2 € par mois (plafond 10 €).
- Contenu stocké sur le serveur, cloisonné par équipe. Aucun secret dans le dépôt.

## 3. Rôles et droits

Un rôle s'attribue par projet ; une personne peut en cumuler plusieurs ; le serveur refuse toute action hors de ses droits.

| Action | Propriétaire | Sound Designer | Réviseur |
|---|---|---|---|
| Créer l'équipe, inviter, retirer des membres | Oui | Non | Non |
| Importer un EPUB, créer un projet, affecter | Oui | Non | Non |
| Ajouter des sons à la banque d'équipe | Oui | Oui | Non |
| Placer et régler des sons sur un chapitre affecté | Si aussi Sound Designer | Oui | **Jamais** |
| Déclarer un chapitre « prêt à réviser » | Non | Oui | Non |
| Écouter, simuler, commenter | Oui | Oui | Oui |
| Valider un chapitre ou demander une correction | Non | Non | Oui |
| Validation finale, instantané nommé, exports | Oui | Non | Non |

Plusieurs équipes par personne sont possibles ; la fusion de comptes vient plus tard.

## 4. Workflow par chapitre

Import → Affectation → Doublage → Révision → Validation finale → Export.

- États : À doubler, En cours, Prêt à réviser, À corriger, Validé. Transitions contrôlées par le serveur et journalisées.
- Un chapitre n'a qu'un Sound Designer à la fois (verrou d'édition).
- Une validation de Réviseur suffit par chapitre ; l'unanimité des Réviseurs affectés est une option du projet.
- Une demande de correction exige un commentaire et crée une tâche « Corriger ».
- Toute modification audio après validation remet le chapitre « À réviser » ; l'ancienne validation reste dans l'historique.
- La validation finale du livre exige que tous les chapitres soient validés ; elle crée un instantané nommé.
- Commentaires ancrés sur le livre, un chapitre, un mot, une plage ou un son placé ; réponses en fil ; Ouvert/Résolu ; jamais supprimés définitivement.
- Tâches dans l'application (« Mes tâches ») ; e-mails plus tard.

## 5. Texte

- Import d'EPUB reflowables ; EPUB DRM et fixed-layout refusés avec un message clair ; PDF hors périmètre.
- Français, anglais et arabe, avec RTL.
- Le texte n'est jamais modifié dans Jacquette ; l'EPUB original est conservé.
- Chaque mot a un identifiant logique stable (type `ch07:p12:w034`) ; réimporter le même EPUB redonne les mêmes identifiants.
- Sélection : clic = mot, glisser = plage, Maj+clic = étendre, double clic = phrase, triple clic = paragraphe.
- Une annotation ne traverse jamais deux chapitres.

## 6. Audio

- Trois familles : **SFX**, **Ambiance**, **Musique** (le terme « son ponctuel » est abandonné).
- SFX sur un mot ou une plage ; 3 SFX simultanés au plus, le plus ancien est interrompu au quatrième.
- Ambiances superposables ; une seule musique à la fois, chevauchement seulement pendant un fondu enchaîné.
- Réglages V1 : volume, fade in/out (en durée ou sur une plage de mots), boucle, point d'entrée, mute/solo par famille.
- Édition non destructive : l'original uploadé reste intact.
- Banque de sons commune par équipe : upload, empreinte anti-doublon, copie Opus, famille, tags, recherche, pré-écoute.
- Lecture automatique (mots/minute, x1, x2, x4) avec mot actif, et lecture depuis la sélection.

## 7. Formats

- **`.jacko`** (pour Jacques) : ZIP défini par Jacquette, avec manifest, chapitres, mots, sons Opus dédupliqués, déclenchements, réglages, `formatVersion` et checksums. Preset unique « Équilibré ». Pas de signature en V1.
- Un contrôle qualité bloque l'export en cas de défaut (son manquant, plage invalide, deux musiques hors fondu, boucle invalide, niveau excessif).
- Un lecteur de contrôle intégré ouvre un `.jacko` en lecture seule.
- **`.jacq`** : archive complète du projet (EPUB, placements, sons, commentaires, historique), exportable et réimportable.

## 8. Hors V1

Ducking, normalisation, spatialisation 3D, trim, presets d'export multiples, IA/MCP (en BYOK, après le premier livre livré), Electron, hors ligne prolongé, signature et publication dans Jacques.
