# Plan de développement V1 — Jacquette

Plan validé par Soyfki le 4 novembre 2026 ([document de référence](https://claude.ai/artifact/8Uw3wVukEhwJwEA7tTHKGk)). Il remplace le cadrage du 11 septembre 2026, conservé dans [`archive/`](archive/README.md).

Jacquette V1 est une application Web hébergée sur le VPS Ionos de Soyfki : une équipe y importe un EPUB, le bruite chapitre par chapitre, le révise et exporte un `.jacko`, pour un coût supplémentaire de 0 à 2 € par mois.

## 1. Décisions qui changent par rapport à septembre

| Sujet | Cadrage du 11 septembre (archivé) | Plan V1 |
|---|---|---|
| Plateformes | Web Chrome/Firefox/Safari + Electron | Web seul, sur ordinateur |
| Contenu | Aucun contenu sur un serveur Jacquette | Contenu sur le VPS, cloisonné par équipe |
| Hors ligne | 5 jours d'autonomie, expiration, révocation | En ligne ; brouillon local de secours si la connexion coupe |
| Sauvegarde | `.jacq` local, écriture physique par chapitre | Un enregistrement par chapitre en base ; `.jacq` = export de sauvegarde |
| Rôles | 5 rôles globaux | 3 rôles par projet : Propriétaire, Sound Designer, Réviseur |
| Révision | Unanimité, candidates concurrentes `.chpt` | 1 validation par chapitre (unanimité en option), 1 chapitre = 1 personne à la fois |
| IA | MCP au lancement | Après la V1, en BYOK |
| Audio | Ducking, 3D, normalisation, trim… | Volume, fades, boucle, point d'entrée, mute/solo |
| `.jacko` | Contrat complet, signature, 4 presets | v1 simple : ZIP + manifest + Opus « Équilibré » + checksums |
| Preuves | Dossier de validation par lot | Tests automatiques + démo déployée validée par Soyfki |

Ce qui ne change pas : voir les invariants d'[`AGENTS.md`](../AGENTS.md).

## 2. Architecture

- **Application** : le prototype React/TypeScript/Vite, servi en fichiers statiques par Caddy sur `jacquette.jacques.page`.
- **PocketBase** : comptes, invitations, équipes, projets, chapitres, sons, commentaires, tâches, journal. Règles d'accès par rôle appliquées côté serveur. Base SQLite.
- **EPUB** : découpé dans le navigateur en chapitres, phrases et mots ; HTML nettoyé avant affichage ; original conservé.
- **Sons** : empreinte à l'upload (pas de doublon) et copie Opus préparée par ffmpeg ; original intact ; lecture Web Audio.
- **Sauvegarde** : chaque modification enregistre le seul chapitre concerné ; copie locale de secours en cas de coupure courte.
- **Exports** : `.jacko` pour Jacques et `.jacq` (archive complète), assemblés dans le navigateur.
- **Déploiement** : GitHub Actions construit puis déploie par SSH (Docker Compose) ; sauvegarde nocturne de PocketBase vers un stockage S3 externe.

| Poste | Solution | Coût / mois |
|---|---|---|
| Serveur et domaine | VPS Ionos et `jacques.page` existants | 0 € |
| Logiciels | Caddy, PocketBase, ffmpeg | 0 € |
| E-mails | SMTP Ionos ou Brevo gratuit | 0 € |
| Sauvegarde externe | S3 Ionos ou Backblaze B2 | 0 à 1 € |
| CI/CD | GitHub Actions | 0 € |

## 3. Rôles et écrans

Les droits par rôle sont détaillés dans le [cahier des charges V1](CAHIER_DES_CHARGES_V1.md#3-rôles-et-droits). L'interface tient en cinq écrans, le même atelier pour tous, seuls les outils autorisés apparaissant :

| Écran | Contenu | Remplace |
|---|---|---|
| Accueil | « Mes tâches », puis projets de l'équipe en cartes | Tableaux de bord par rôle |
| Projet | Chapitres, statut, personne affectée, dernier commentaire, Exporter | Panneaux Chef et Admin |
| Atelier, mode Montage | Livre au centre, banque à gauche, réglages à droite, lecteur en bas | Vue Sound Designer (jargon réduit) |
| Atelier, mode Révision | Livre, rails, commentaires, Valider / Demander une correction | Vue Réviseur |
| Équipe | Membres, rôles, invitations, banque de sons | Vue Admin |

## 4. Feuille de route : 6 phases, 32 lots

Un lot = un ticket AgentTickets = une PR. Chaque phase se termine par une démo déployée validée par Soyfki.

| Lot | Contenu | Terminé quand |
|---|---|---|
| **Phase 0** | **Remise à plat et serveur** | **Soyfki se connecte en ligne avec un vrai compte** |
| 0.1 | Archiver l'ancien cadrage, poser les documents V1 | Documents actifs cohérents, moins de 400 lignes |
| 0.2 | Alléger la CI | CI verte en moins de 5 minutes |
| 0.3 | Caddy + PocketBase sur le VPS, déploiement auto, sauvegarde nocturne | Merge en ligne en moins de 10 min ; restauration testée |
| 0.4 | Modèle de données et droits par rôle | Un test prouve qu'un Réviseur ne peut pas modifier un placement |
| 0.5 | Connexion réelle, mot de passe oublié, invitation par lien | Connexion en ligne avec un vrai compte |
| **Phase 1** | **Atelier solo** | |
| 1.1 | Importer un EPUB (refus DRM et fixed-layout) | Les 3 EPUB de référence s'importent ; un EPUB DRM est refusé clairement |
| 1.2 | Découper en mots stables (`ch07:p12:w034`), RTL | Réimporter redonne exactement les mêmes identifiants |
| 1.3 | Afficher le livre | Un chapitre de 20 000 mots défile sans saccade |
| 1.4 | Sélectionner le texte (clic, glisser, Maj+clic, double, triple) | Chaque geste est couvert par un test |
| 1.5 | Banque de sons d'équipe | 50 sons retrouvés en moins d'une seconde |
| 1.6 | Placer un son, rails colorés, inspecteur | Un son reste sur ses mots après rechargement |
| 1.7 | Sauvegarde auto par chapitre, annuler/rétablir | Couper le réseau, modifier, reconnecter : rien n'est perdu |
| 1.8 | Moteur de lecture (mots/min, x1/x2/x4, sélection) | Scénario de référence joué et testé |
| 1.9 | Réglages : volume, fades, boucle, point d'entrée, mute/solo | Chaque réglage s'entend et survit au rechargement |
| **Phase 2** | **Équipe et rôles** | |
| 2.1 | Équipes et invitations | Une personne invitée rejoint l'équipe seule |
| 2.2 | Affectations et verrou d'édition | Deux personnes ne modifient pas le même chapitre |
| 2.3 | Workflow des chapitres | Une transition interdite est refusée par le serveur |
| 2.4 | Tâches et accueil en temps réel | Une tâche apparaît en moins de 5 secondes |
| 2.5 | Écran Projet | La progression correspond aux états réels |
| **Phase 3** | **Révision et validation** | |
| 3.1 | Commentaires ancrés | Un commentaire sur un mot reste sur ce mot |
| 3.2 | Mode Révision | Cycle Sound Designer → Réviseur → correction → validation complet |
| 3.3 | Validation finale et instantané nommé | L'instantané reste consultable après modification |
| **Phase 4** | **Export `.jacko`** | |
| 4.1 | Contrôle qualité avant export | Un défaut bloquant empêche l'export et mène au bon endroit |
| 4.2 | Spécifier `.jacko` v1 (document + JSON Schema) | Spécification validée par Soyfki |
| 4.3 | Exporter le `.jacko` | Le fichier passe la validation du schéma |
| 4.4 | Lecteur de contrôle | Lecture identique à l'atelier sur le scénario de référence |
| 4.5 | Archive `.jacq` | Un projet réimporté dans une autre équipe est identique |
| **Phase 5** | **Mise en service V1** | |
| 5.1 | Finitions, visite guidée, messages clairs | Premier son placé en moins de 10 minutes |
| 5.2 | Accessibilité et performance (150 000 mots) | Chapitre ouvert en moins de 3 secondes |
| 5.3 | Exploitation : surveillance, mise à jour, restauration | Restauration complète en moins de 30 minutes |
| 5.4 | Pilote sur un vrai livre | Livre validé et exporté |
| 5.5 | Version 1.0 | Premières équipes externes invitées |

## 5. Après la V1

Audio avancé (ducking, normalisation, 3D, trim, presets), IA via MCP en BYOK, notifications e-mail, tablette, versions multiples, signature et publication dans Jacques, Electron et hors ligne prolongé si un besoin réel apparaît.
