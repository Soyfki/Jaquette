# Convention de version

> **Décision technique de dépôt — 2026-08-21**

Cette convention fournit un repère minimal pour versionner l’application Jaquette. Elle ne définit pas les règles métier et ne préjuge pas du futur schéma de version des formats `.jacq` et `.jacko`.

## État actuel

- Version de l’application : **`0.0.0`**.
- État : **pré-développement, non publié**.
- Jalon produit visé par la roadmap : **V0.1 — Preuve du modèle textuel**.
- Phase de travail actuelle : **phase 0, sous-étape 0.1 — Initialiser le dépôt**.

La valeur `0.0.0` indique qu’aucune version exécutable de l’application n’existe encore. Elle ne signifie pas que le jalon produit V0.1 est atteint.

## Version de l’application

Jaquette utilisera [Semantic Versioning 2.0.0](https://semver.org/) sous la forme `MAJEURE.MINEURE.CORRECTIF` lorsque des versions de l’application seront publiées :

- `MAJEURE` pour un changement applicatif incompatible ;
- `MINEURE` pour une évolution compatible ;
- `CORRECTIF` pour une correction compatible.

Avant une première version stable, la série `0.y.z` signale un produit en développement. La première version applicative ne sera attribuée que lorsqu’un livrable exécutable correspondant aura été défini et publié ; cette décision n’est pas prise dans la sous-étape 0.1.

## Jalon produit

Les libellés **V0.1**, **V0.2**, **V1** ou **V2** présents dans le cahier des charges et le plan sont des **jalons produit**. Ils regroupent des objectifs et des étapes de la roadmap. Ils ne constituent pas automatiquement une version publiée de l’application et ne commandent pas mécaniquement son numéro SemVer.

## Versions des formats `.jacq` et `.jacko`

Les formats de travail `.jacq` et de distribution `.jacko` devront disposer de leur propre information de version, distincte de la version de l’application et des jalons produit. Le plan prévoit notamment un futur champ `formatVersion` pour `.jacko`.

Le schéma, la valeur initiale et les règles de compatibilité de ces versions de format restent **à définir dans les sous-étapes qui leur sont consacrées**. La présente décision n’invente aucune valeur de `formatVersion` et ne lie pas ces formats au numéro de version de l’application.

## Mise à jour de la version

Toute modification future du numéro de version devra :

1. correspondre à un livrable applicatif clairement identifié ;
2. être enregistrée dans l’emplacement technique faisant autorité une fois celui-ci créé ;
3. mettre à jour cette page si l’état affiché y devient obsolète ;
4. préserver la distinction entre version applicative, jalon produit et version de format.
