# Convention de version

> **Décision technique de dépôt — 2026-08-21**

Cette convention fournit un repère minimal pour versionner l’application Jaquette. Elle ne définit pas les règles métier et ne préjuge pas du futur schéma de version des formats `.jacq` et `.jacko`.

## État courant

Cadrage du 6 octobre : premier atelier D .jacq, .jacko au test suivant E/requis V1 ; au moins dix novices. Application **0.0.0** inchangée. Base intégrée de reprise : [main 4b183900a4a677c51c1d8150f7459f150c1ad033](https://github.com/Soyfki/Jaquette/commit/4b183900a4a677c51c1d8150f7459f150c1ad033). [PR12](https://github.com/Soyfki/Jaquette/pull/12) reste draft/non fusionnée, tête auditée 0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb ; documents/outillage, aucun changement src. **H-W18 historique reste BLOCKED/inconnu et 0.4 BLOQUÉE/NO-GO**. La CI historique de PR12 n'établit ni écoute physique ni fonctionnalité métier. Les budgets adoptés ne sont pas des mesures obtenues ; leur reprise et la porte technique sont réservées à JQ-02/T-71. Aucun rapport historique rempli n'est réécrit.

### État historique de septembre

- Version de l’application : **0.0.0**, non publiée.
- Acquis historiques : ancienne phase 0, anciennes sous-étapes 1.1 à 1.3 et lot 1.4.1.
- Le prototype à quatre rôles est qualifié dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9), qui reprend l’ancien 1.4.2 et les corrections 0.3 ; les SHA de recette et d’intégration y sont consignés.
- 1.4.2 est acquis après revalidation technique et humaine du 18 septembre 2026 ; aucune clôture rétroactive de l’ancienne 1.4 ou de l’ancienne phase 1.
- Ancien 1.4.3 : plus de prochaine livraison autonome ; aucun périmètre précis retrouvé. Inventorier les reliquats réellement identifiables en 0.3/0.5 puis les rattacher aux sous-étapes futures correspondantes.
- Nouvelle étape 0 distincte de l’ancienne phase 0 acquise. 0.1 et 0.2 sont intégrées ; **0.3 — Corriger les défauts du prototype** et la **revalidation historique 1.4.2** sont **VALIDÉES / GO**, décisions distinctes du 18 septembre 2026 après campagne technique et observations humaines complètes au SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`. L’intégration et les contrôles au dernier SHA sont tracés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9). La [campagne](validation/0.3-correctifs-prototype/CHECKLIST.md) est complète. 0.4 n’est pas commencée.
- Cadrage actif du 11 septembre : lancement gratuit sur invitation, Web complet Chrome/Firefox/Safari (Safari sur Mac), Electron Windows/macOS, collaboration et MCP inclus ; publication Jacques en F1.

La valeur 0.0.0 est conservée : le prototype et l’harmonisation documentaire ne constituent pas une version publiée, un format adopté ou un jalon fonctionnel démontré.

## Version de l’application

Jaquette utilisera [Semantic Versioning 2.0.0](https://semver.org/) sous la forme `MAJEURE.MINEURE.CORRECTIF` lorsque des versions de l’application seront publiées :

- `MAJEURE` pour un changement applicatif incompatible ;
- `MINEURE` pour une évolution compatible ;
- `CORRECTIF` pour une correction compatible.

Avant une première version stable, la série `0.y.z` signale un produit en développement. La première version applicative ne sera attribuée que lorsqu’un livrable exécutable correspondant aura été défini et publié ; cette décision n’a été prise ni dans l’ancienne sous-étape documentaire 0.1 ni dans la nouvelle 0.1 de septembre.

## Jalons courants A–H

| Jalon | Résultat et preuve attendue | Lots responsables |
|---|---|---|
| A — Reprise | Sources concordantes, flux AT ; budgets/portes réconciliés séparément | JQ-01/T-70 ; JQ-02/T-71 |
| B — Fondations | Contrats du noyau, expériences de stockage physique, Web/Electron Windows offline | T-72 à T-76 |
| C — Preuve verticale courte | EPUB réel, ancres, sélection, un son, sauvegarde et réouverture exacte ; ne vaut pas atelier complet | T-77 à T-86, JQ-17/T-86 |
| D — Premier atelier Noémie | Web et Desktop Windows ; bibliothèque intégrée/personnelle, trois familles, réglages, écoute, undo ; .jacq autonome rouvert offline après retrait des sources | T-87 à T-103 ; JQ-29/T-103 |
| E — Test suivant .jacko | Qualité, presets, export et contrôle en lecture seule, intégrité et signature de test | T-104 à T-106 ; T-122/T-123 |
| F — Invitations/collaboration | Comptes réels, rôles, cinq jours, échanges privés, tour de rôle, candidates et révision unanime | T-107 à T-117 ; T-124/T-125 |
| G — Suggestions facultatives | Routes BYOK qualifiées, MCP cloisonné, OFF/ON, consentement et brouillon avec undo | T-118 à T-121 ; T-135/T-136 seulement si retenus |
| H — V1 distribuée | Windows et M1, Web complet Chrome/Firefox/Safari réel sur Mac, licences, récupération, qualification et au moins dix novices | T-126 à T-134 |
| F1 — Jacques | Lecteur/boutique, publication/retrait et authenticité de publication réelle ; hors V1 | Annexe JQ-48, sans carte AT créée ici |

Application/SemVer, formats, versions nommées durables et jalons sont distincts. Aucun acquis par correspondance. JQ-05/T-74 éprouve le stockage ; JQ-02/T-71 traite budgets/portes, sans reprise implicite PR12.

## Correspondance historique de septembre

Les prochaines étapes mentionnées dans cette section sont celles du calendrier conservé et ne lancent aucun nouveau lot.

Le plan du 11 septembre ci-dessous est un calendrier historique conservé ; A–H porte le calendrier courant. Les anciens libellés V0.x/V1/V2 sont historiques ; aucune équivalence ci-dessous ne transfère automatiquement un acquis.

| Actuel | Étapes | Ancien périmètre repris |
|---|---|---|
| J0 — Choix éprouvés | 0–1 | Reprise prototype, stockage et premiers essais Electron |
| J1 — Production locale minimale | 2–3 | V0.1 textuel et sauvegarde de V0.3 |
| Atelier complet | 4–7 | V0.2 audio, bibliothèque et accès réels |
| J2 — Collaboration opérationnelle | 8–10 | V2 Collaboration avancé avant lancement |
| Banques et IA | 11–12 | V1.5 IA avancé avant lancement, banques privées |
| J3 — Produit complet de production | 13 | V0.3 Production Web, export de contrôle |
| Première version distribuée | 14–16 | V1 Desktop rejoint le Web complet |
| Extension Jacques | F1 | Publication effective, boutique et retrait, signature réelle |

Les étapes détaillées des deux anciens documents avaient des numérotations différentes ; leur historique au SHA 8a9e9a7ed692f26e3969641a4584669bfa1d93a9 reste consultable dans le [cahier](https://github.com/Soyfki/Jaquette/blob/8a9e9a7ed692f26e3969641a4584669bfa1d93a9/CAHIER_DES_CHARGES_JAQUETTE.md) et le [plan](https://github.com/Soyfki/Jaquette/blob/8a9e9a7ed692f26e3969641a4584669bfa1d93a9/PLAN_DE_DEVELOPPEMENT_JAQUETTE.md). Le tableau final du plan actuel conserve la correspondance avec ses anciennes phases.

Les exemples de versions nommées « V1 — Premier doublage », « V2 — Retours éditoriaux » et « V3 — Mix final » restent des états de travail d’un projet. Ils ne désignent ni roadmap ni SemVer.

Les propositions de sauvegarde de la section 4 du plan (dont OPFS, ZIP éventuel et distinction espace de travail/copie portable) attendent les preuves et la décision de 1.2. Les cibles de section 5 attendent 0.4 et leur qualification : aucun choix ni résultat acquis par un changement de numéro.

L’export .jacko de contrôle, les checksums et la signature avec clés de test en étape 13 se distinguent de la signature authentifiant une publication en F1. Les droits de publication, la tâche automatique associée et la dépublication restent documentés pour F1.

## Versions des formats `.jacq`, `.chpt` et `.jacko`

Les formats de travail `.jacq`, d’échange de chapitre `.chpt` et de distribution `.jacko` devront disposer des informations de compatibilité nécessaires, distinctes de la version de l’application et des jalons produit. Le [cahier des charges, section 5.3](../CAHIER_DES_CHARGES_JAQUETTE.md) prévoit un futur champ `formatVersion` pour `.jacko`.

Pour `.jacq` et `.chpt`, aucun nom de champ, numéro de format, schéma physique, valeur initiale ni règle de compatibilité n’est décidé. Ces choix restent **à définir dans les sous-étapes qui leur sont consacrées**, après validation de la sauvegarde physique partielle par chapitre.

La présente décision n’invente aucune valeur de version et ne lie aucun format au numéro de version de l’application.

## Mise à jour de la version

Toute modification future du numéro de version devra :

1. correspondre à un livrable applicatif clairement identifié ;
2. être enregistrée dans l’emplacement technique faisant autorité une fois celui-ci créé ;
3. mettre à jour cette page si l’état affiché y devient obsolète ;
4. préserver la distinction entre version applicative, jalon produit et version de format.
