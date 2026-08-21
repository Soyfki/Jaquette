# Jaquette

Jaquette est le logiciel de production et de doublage audio de livres. Il permet d’associer des pistes **SFX**, **Ambiance** et **Musique** au texte d’un livre afin de préparer une expérience de lecture enrichie.

Jaquette ne doit pas être confondu avec **Jacques** : Jaquette est l’outil de production, tandis que Jacques est l’application propriétaire de lecture et la boutique de distribution.

## Principe central

**Le texte est la timeline de Jaquette.** Les sons sont associés à des mots ou à des plages de mots, et non à une timeline temporelle classique.

## État du projet

Le développement du code n’a pas encore commencé. Le dépôt se trouve dans la **phase 0 — Préparation du projet**, sous-étape **0.2 — Définir les données de référence**. La sous-étape **0.1 — Initialiser le dépôt** est acquise. Le dépôt ne contient actuellement ni application, ni dépendance, ni test, ni workflow d’intégration continue.

La version actuelle de l’application est **`0.0.0` (pré-développement, non publiée)**. La [convention de version](docs/VERSIONING.md) explique la différence entre cette version, les jalons produit tels que V0.1 et les futures versions des formats `.jacq` et `.jacko`.

## Sources de vérité

Trois documents à la racine font autorité, chacun dans son rôle :

1. [`AGENTS.md`](AGENTS.md) — invariants métier, produit et logiciels à ne pas enfreindre ;
2. [`CAHIER_DES_CHARGES_JAQUETTE.md`](CAHIER_DES_CHARGES_JAQUETTE.md) — définition détaillée du produit et des besoins ;
3. [`PLAN_DE_DEVELOPPEMENT_JAQUETTE.md`](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) — plan détaillé, phases, sous-étapes et critères d’acceptation.

Le dossier [`docs/`](docs/README.md) sert d’index et accueille les décisions techniques de dépôt. Il facilite la navigation, mais ne remplace pas ces trois sources de vérité.

## Reprendre le projet

Avant toute contribution :

1. vérifier la branche par défaut, le dernier commit et les changements déjà présents ;
2. lire intégralement [`AGENTS.md`](AGENTS.md), puis le [cahier des charges](CAHIER_DES_CHARGES_JAQUETTE.md) et le [plan détaillé](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) ;
3. identifier la sous-étape en cours et respecter son périmètre ;
4. distinguer les règles produit validées des décisions techniques encore ouvertes ;
5. documenter toute nouvelle décision technique sans en faire une règle métier implicite.

Ne versionnez jamais de secret, mot de passe, clé, jeton ou identifiant de connexion. Les futures valeurs sensibles devront être fournies par un mécanisme local approprié, hors du dépôt.

## Documentation

- [Index documentaire](docs/README.md)
- [Convention de version](docs/VERSIONING.md)
- [Données de référence](reference-data/README.md)
- [Plan détaillé de développement](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md)
