# T74 — décision du 28 octobre 2026 : adoption refusée

**Statut : NO-GO pour l'adoption des prototypes ; stockage de production non qualifié.**
La recherche fournit une conclusion exploitable. Elle ne démontre pas qu'aucune solution future n'existe,
ne livre pas un format `.jacq`/`.chpt` et ne satisfait pas les deux critères physiques de T74.
Ils restent décochés. Le retour humain en Spécification et le choix de cette direction ne valent ni
validation du stockage, ni clôture du ticket, ni fusion de la PR.

Le [rapport expérimental](T74-STORAGE-RESEARCH.md) conserve le protocole, les commandes et les limites.
Le plan révisé est publié dans [T74](https://tickets.soyfki.com/tickets/T-74), en cinq commentaires du
28 octobre à 10:07:44–10:08:27 UTC, du commentaire `01a181fa-e100-71c5-9d8a-af63eacfdf1b`
au commentaire `01a181fb-86b5-7593-ad89-eab6c547b8f2`.

## Ce qui fonde la décision

Les résultats ci-dessous proviennent du commit de recherche
`c3d0cc36482f3f9ef0c76c69a74779302f4c1f21`, base
`4b183900a4a677c51c1d8150f7459f150c1ad033`, dans la [PR18 brouillon](https://github.com/Soyfki/Jaquette/pull/18).
Ils ne sont pas de nouvelles mesures exécutées pour cette décision documentaire.

- Validation locale du 23 octobre : `pnpm validate:all`, Node 24.19.0/pnpm 11.19.0 Windows,
  54 tests applicatifs, 71 tests d'outillage et stockage, 28 E2E Chrome passants.
- [CI40536968726](https://github.com/Soyfki/Jaquette/actions/runs/40536968726), job `122304715440` :
  succès au même SHA, Ubuntu 24.04/Node 24.19.0/pnpm 11.19.0/Chrome 156.0.8078.47.
- Revue indépendante du 27 octobre : 36 contrats et six sondes supplémentaires passants,
  aucun nouveau défaut d'intégrité reproduit ; rejet pour garanties physiques non démontrées.
  Ses sondes utilisaient Node 24.22.1, distinct du runtime de la CI.
- Deux campagnes avec 5 000 000 000 octets réellement écrits, export/reimport autonome et sources rendues
  inaccessibles : fichiers 791,704 s/RSS maximal 237 440 Kio ; append 843,231 s/246 192 Kio.
  Elles se chevauchaient : métriques descriptives, aucune qualification de performance.
- Les cinq tailles et SHA256 de `test-results/tickets/T-74/evidence-c3d0cc3.json` ont été revérifiés
  le 28 octobre : tous concordants. Les rapports locaux ignorés Git gardent leur provenance historique.

| Option | Observé sur les fixtures | Garantie absente | Décision d'adoption |
| --- | --- | --- | --- |
| Fichiers par chapitre | Générations, streaming, export/reimport, zéro écriture API sur les autres chapitres | Trace physique indépendante, durabilité de publication du répertoire, récupération complète du writer après panne | Refusée, NON PROUVÉ |
| Sections append | Références de sections, streaming, export/reimport, zéro écriture API sur les autres chapitres | Mêmes garanties physiques ; croissance, médias orphelins et compaction non qualifiées | Refusée, NON PROUVÉ |
| Monolithe de contrôle | Deux chapitres inchangés réécrits, détectés malgré leurs hashes identiques | Contrat de sauvegarde partielle délibérément violé au niveau API | NO-GO |
| OPFS Chrome | 64 Mio, fermeture/réouverture gracieuse du profil dédié | Mapping physique, crash, quota réel, export/import et intégrité complète du média | Refusée, NON PROUVÉ |

## Conditions de réexamen, toujours ouvertes

Pour le premier critère, une observation OS indépendante doit attribuer les écritures aux fichiers/plages
des chapitres, aux données communes et aux temporaires des seuls processus de test. Sous le même observateur,
un no-op et le monolithe négatif doivent valider l'oracle avant modification, croissance et ajout/réutilisation
de média. Les hashes, événements API, notifications de fichiers ou compteurs agrégés ne remplacent pas cette preuve.
Si les plages OPFS restent opaques, cette plateforme reste non prouvée.

Pour le second, il faut définir le modèle d'accusé de sauvegarde et de durabilité du FS cible, puis vérifier
staging, flush, publication, accusé, export/import et reprise dans un processus distinct. Les huit kills réels
d'enfants et erreurs ENOSPC injectées existants ne prouvent ni crash OS, ni coupure, ni quota réellement contraint.
Permissions/handles retirés, copies valides préexistantes, conflits de writers et résultats incertains restent
à couvrir ; une issue incertaine impose lecture de contrôle avant tout nouvel essai.

Ces expériences demandent un environnement dédié et un protocole explicitement autorisé. Aucun crash, coupure,
saturation du disque actif, changement de quota/sécurité ou collecte système n'est lancé par cette décision.
La présence de WPR n'est pas une trace. Aucune répétition de mocks ne transforme ces garanties en résultats acquis.

## Conséquences sur la suite

| Ticket | Travail proposé au bon stade | Préalable conservé |
| --- | --- | --- |
| [T76](https://tickets.soyfki.com/tickets/T-76) | Distinguer contrat logique (identités/filiation, commun/chapitre, médias, validateurs et fixtures de round-trip/refus) et sérialisation physique | Son mandat actuel exige un stockage retenu et dépend de T74 ; aucun format, version physique ou migration de production adopté |
| [T77](https://tickets.soyfki.com/tickets/T-77) | Parser un corpus EPUB licencié/synthétique vers le futur modèle logique, avec refus de corruption, chemins hors périmètre et formats interdits | Dépendance T76 inchangée ; aucune persistance `.jacq` présumée |
| [T78](https://tickets.soyfki.com/tickets/T-78) | Préserver le rendu éditorial dans un contexte sans code, réseau ou IPC implicite | Dépendances T75 et T77 inchangées ; le Web partiel de PR19 ne livre pas l'hôte Windows |

Le traitement du découpage dans AT doit précéder son exécution. Aucun ticket de remplacement ni suppression
de dépendance n'est créé pour contourner une gate. Une acceptation de l'étude ne qualifie jamais le stockage.
Le contrat de revue actuel exige les critères fonctionnels : tant qu'ils restent non prouvés, il ne permet
pas d'approuver le ticket entier sur la seule qualité du rapport NO-GO. Cette décision garde ce point visible,
sans demander de fausses cases cochées ni renvoyer les mêmes preuves à la revue en boucle.

Les invariants du cahier des charges et d'AGENTS restent inchangés : sauvegarde physique par chapitre,
données communes séparées, médias autonomes, ancres stables, production non destructive. Aucun changement
d'architecture, dépendance, version d'application, sécurité ou facturation ne découle de ce document.
