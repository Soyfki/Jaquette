# 0.1 — Harmoniser les sources

Date : 11 septembre 2026. Périmètre exclusivement documentaire selon le mandat reçu. Dossier préparé avant la campagne, à partir des modèles [checklist](../CHECKLIST.md), [bug](../BUG_REPORT.md) et [rapport](../VALIDATION_REPORT.md). Les résultats finaux et le SHA complet testé sont publiés dans la [PR 10](https://github.com/Soyfki/Jaquette/pull/10) pour éviter un commit consacré à son propre SHA.

## Provenance et périmètre

- Dépôt : Soyfki/Jaquette ; origin : https://github.com/Soyfki/Jaquette.git.
- Checkout utilisateur initial : branche codex/phase-1-4-2-team-lead-admin-variants, HEAD 5cabbb016d3ce5480b165512c1aa7814b8367802 ; plan suivi modifié, EPUB tests/ et docs/prompts/ non suivis.
- PR 9 observée ouverte, en brouillon, non fusionnée ; son SHA est le même. Aucune mutation de cette PR ni de sa branche dans 0.1.
- Main actualisée pour le clone de travail : 8a9e9a7ed692f26e3969641a4584669bfa1d93a9. Branche isolée : codex/etape-0-1-harmonisation.
- Plan local complet transmis avant harmonisation : SHA-256 **ECBAAA8B5EA7A3130B4880FAB8D3A01AA022848DF7E5A38CC0D1F99B4AE65C09**, contrôlé identique après copie. Le diff ultérieur depuis ce snapshot reste dans l’artefact local associé.
- Seuls éléments documentaires de PR 9 repris : exigences validées d’accueil général et d’absence de préparation de publication avant validation, état et protocole correctif 1.4.2. Aucun fichier applicatif, dépendance ou test applicatif repris.
- Le checkout initial, son plan, docs/prompts/ et EPUB tests/ sont conservés ; pas de node_modules copié. Les empreintes locales avant/après sont conservées dans l’artefact de campagne, sans contenu privé.
- Un clone neuf a contourné les références locales Codex cassées sans les réparer : voir [incident d’environnement](BUG_REPORT.md).
- Les contrôles de l’audit préalable (19 liens documentaires, six ressources, secrets limités et espaces) et ceux de la PR 9 (48 tests unitaires/composants et 22 E2E Chrome) restent historiques. Ils ne prouvent pas cette nouvelle campagne.

## Contradictions identifiées

1. Ancien lancement Chrome seul puis Electron, IA et collaboration reportés ; remplacé par le lancement commun.
2. Invitation réelle et cinq jours offline absents, ancien scénario de comptes administrateur de test actif.
3. Frontière administrative/contenu trop permissive et caractère officiel d’une décision offline non précisé.
4. Publication/signature réelle imposées avant lancement ; séparation contrôle, clés de test et F1 nécessaire.
5. OPFS/monorepo et ancien parcours de stockage présentés trop fermement ; retour au statut de propositions à éprouver.
6. Calendriers V0.x/V1/V2, collision de numéros et reprise 1.4.3 non définie ; jalons actifs et correspondance historique requis.
7. Consignes de validation attribuant la décision à l’humain ; organisation du mandat et observations humaines à distinguer.

## Décision → documents corrigés → preuve de cohérence

Abréviations : [Cahier](../../../CAHIER_DES_CHARGES_JAQUETTE.md), [AGENTS](../../../AGENTS.md), [Plan](../../../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md), [Accueil](../../../README.md), [Index](../../README.md), [Versions](../../VERSIONING.md), [Offline](../../COLLABORATION_OFFLINE.md), [Protocole](../README.md).

| Décision du plan | Documents corrigés | Preuve de cohérence à vérifier sur le SHA de campagne |
|---|---|---|
| Gratuit, invitation, coûts tiers distincts | Cahier §4/36, AGENTS §27/33, Accueil, Index, Versions | Accès réel au lancement ; aucun compte prototype ou abonnement Jaquette requis |
| Web complet Chrome/Firefox/Safari et Electron Windows/macOS ; Safari sur Mac | Cahier §4, AGENTS §4/33, Accueil, Index, Offline, Versions | Même cible partout ; Chrome seul réservé aux campagnes historiques |
| PC Windows 10 2018, Mac Intel avant M1, M1 ; configurations futures | Cahier §4/49, AGENTS §33, Accueil, Plan §1/5 | Cibles matérielles reprises, détails non inventés, fixation en 0.4 |
| Activation initiale en ligne et environnement prêt | Cahier §4/36, AGENTS §27, Accueil, Index, Offline | Aucun premier démarrage offline autonome annoncé |
| Cinq jours ; expiration sans perte de lecture/sauvegarde/archivage | Cahier §4/36/51, AGENTS §27, Accueil, Index, Offline | Seules les nouvelles modifications bloquées ; présence réseau insuffisante |
| Recontrôle avant envoi ; révocation et archivage sans destruction à l’annulation | Cahier §4/38/51, AGENTS §27, Accueil, Index, Offline | Envois préparés inclus ; copie navigateur vérifiée, original conservé |
| Contenus/banques privés, services Jaquette administratifs autorisés | Cahier §4/37, AGENTS §27, Accueil, Index, Offline | Aucun manuscrit, son ou commentaire de contenu hébergé sur Jaquette Cloud |
| Travail local ; échanges et actualisation connectés, aucun montage live | Cahier §4/38, AGENTS §27/28, Accueil, Index, Offline | Dernier état confirmé distingué des modifications locales |
| Révision offline préparée, décision officielle après acceptation autorisée | Cahier §4/38/51, AGENTS §27, Accueil, Index, Offline | Pas de vote officiel fabriqué offline ; unanimité maintenue |
| Banques locales/privées ; médias utilisés autonomes | Cahier §4/12, AGENTS §10/33, Accueil, Index, Offline | Retrait du son ou perte d’accès n’enlève pas les médias embarqués |
| MCP au lancement, agents externes, sons autorisés, aucune génération | Cahier §4/40/41/51, AGENTS §30/33, Accueil, Index, Offline | Exemple SFX et outils de proposition ; aucun accès direct au master |
| Agent ET modèle locaux hors ligne ; distant avec consentement/connexion | Cahier §4/40/42, AGENTS §30/31, Accueil, Index, Offline | Liaison Desktop/navigateur à qualifier, client local ≠ modèle local |
| Export et contrôle ; Jacques effectif en F1 | Cahier §5.3/20/25/28–34/51, AGENTS §3/17/21/23/25/33, Accueil, Index, Versions, Offline | Droits, métadonnées, tâche automatique, release et dépublication conservés pour F1 |
| Intégrité, signature de test, authenticité réelle distinctes | Cahier §5.3/34, AGENTS §3/25, Accueil, Index, Versions, Offline | Export non signé non authentifié ; clé de test jamais clé de publication |
| Budget limité, GPT.6, pas d’échéance, socle réutilisé | Cahier §4/43, AGENTS §33, Accueil, Index, Plan §1/3 | Aucun monorepo, backend ou bibliothèque imposé ; coûts tiers explicites |
| Stockage et parcours proposés ; performances proposées | Cahier §44/49, AGENTS §33/35, Accueil, Index, Versions, Offline, Plan §4/5 | Décision physique en nouvelle 1.2 ; adoption des cibles en 0.4, aucun résultat acquis |
| Acquis réels, PR 9 distincte de main, 1.4.2 non acquis | Cahier §48, AGENTS état, Accueil, Index, Versions, Plan §2, protocole 1.4.2 | Main de base à deux rôles ; quatre rôles/correctifs sur PR 9 uniquement |
| Ancien 1.4.3 sans périmètre retrouvé ; prochaine action 0.2 | Cahier §48/49, AGENTS état, Accueil, Index, Versions, Plan §2/fin, Protocole | Ancien plan §1.4 sans lot 1.4.3 ; inventaire 0.3/0.5, pas de clôture rétroactive |
| Humain observateur ; agent développeur/responsable puis fusion | Plan §3, Protocole, modèles Checklist/Rapport et campagne 1.4.2 | Test humain requis manquant → BLOCKED/NO-GO ; aucun nouveau test humain pour 0.1 |

## Invariants et traces historiques

La lecture croisée couvre texte non éditable, ancres logiques stables, séparation physique commun/chapitre, projet autonome, trois familles et limites audio, unanimité et absence d’arbitrage éditorial du Chef, permissions contextuelles, interdictions de montage Réviseur/Chef, tâches automatiques, master protégé, consentement et DA. Les changements de calendrier n’en retirent aucun.

Les anciennes roadmaps sont conservées dans Git au SHA 8a9e9a7ed692f26e3969641a4584669bfa1d93a9 ; voir les liens de Versions. Dans cet ancien plan, la section 1.4 liste les quatre rôles et leurs attentes générales puis passe directement à la phase 2 : aucune occurrence ni définition précise de 1.4.3. Les défauts actuels nommés en 0.3 ne lui sont pas attribués rétroactivement.

L’ancien jalon 0.2 de reference-data/README est marqué historique. Les exemples « V1 — Premier doublage », « V2 — Retours éditoriaux », « V3 — Mix final » restent des versions nommées. Les campagnes Chrome et les observations/empreintes de reference-data/INVENTORY sont conservées avec leurs dates et limites.

## Exécution et décision

Utiliser la [checklist du lot](CHECKLIST.md) et le [rapport du lot](VALIDATION_REPORT.md). La PR conserve les sorties/synthèses liées au SHA complet réellement testé, le Go motivé signé par l’agent responsable, puis l’état de fusion et le SHA de squash vérifiés. Aucun résultat historique n’est réutilisé comme preuve actuelle.

Après Go de 0.1 : **0.2 — Reproduire la base**, pas l’ancienne 2.1 ni la nouvelle étape 1. Le présent lot ne les exécute pas.
