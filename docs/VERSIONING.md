# Convention de version

> **Décision technique de dépôt — 2026-08-21**

Cette convention fournit un repère minimal pour versionner l’application Jaquette. Elle ne définit pas les règles métier et ne préjuge pas du futur schéma de version des formats `.jacq` et `.jacko`.

## État actuel

- Version de l’application : **0.0.0**, non publiée.
- Acquis historiques : ancienne phase 0, anciennes sous-étapes 1.1 à 1.3 et lot 1.4.1.
- Main à la base de 0.1 contient le prototype Sound Designer/Réviseur. Les quatre rôles et correctifs de l’ancien 1.4.2 sont sur la [PR 9](https://github.com/Soyfki/Jaquette/pull/9), SHA 5cabbb016d3ce5480b165512c1aa7814b8367802, tant qu’ils ne sont pas fusionnés.
- 1.4.2 reste non acquis avant sa revalidation humaine ; aucune clôture rétroactive de l’ancienne 1.4 ou de l’ancienne phase 1.
- Ancien 1.4.3 : plus de prochaine livraison autonome ; aucun périmètre précis retrouvé. Inventorier les reliquats réellement identifiables en 0.3/0.5 puis les rattacher aux sous-étapes futures correspondantes.
- Nouvelle étape 0 distincte de l’ancienne phase 0 acquise. 0.1 et 0.2 sont intégrées ; **0.3 est en validation dans PR 9 reprise**, depuis son SHA historique ci-dessus. La [campagne 0.3 et revalidation 1.4.2](validation/0.3-correctifs-prototype/CHECKLIST.md) attend les observations humaines ; aucune acquisition ni étape suivante à ce stade.
- Cadrage actif du 11 septembre : lancement gratuit sur invitation, Web complet Chrome/Firefox/Safari (Safari sur Mac), Electron Windows/macOS, collaboration et MCP inclus ; publication Jacques en F1.

La valeur 0.0.0 est conservée : le prototype et l’harmonisation documentaire ne constituent pas une version publiée, un format adopté ou un jalon fonctionnel démontré.

## Version de l’application

Jaquette utilisera [Semantic Versioning 2.0.0](https://semver.org/) sous la forme `MAJEURE.MINEURE.CORRECTIF` lorsque des versions de l’application seront publiées :

- `MAJEURE` pour un changement applicatif incompatible ;
- `MINEURE` pour une évolution compatible ;
- `CORRECTIF` pour une correction compatible.

Avant une première version stable, la série `0.y.z` signale un produit en développement. La première version applicative ne sera attribuée que lorsqu’un livrable exécutable correspondant aura été défini et publié ; cette décision n’a été prise ni dans l’ancienne sous-étape documentaire 0.1 ni dans la nouvelle 0.1 de septembre.

## Jalons produit actifs et correspondance historique

Le [plan du 11 septembre 2026](../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) porte seul le calendrier actif. Les anciens libellés V0.x/V1/V2 sont historiques ; aucune équivalence ci-dessous ne transfère automatiquement un acquis.

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
