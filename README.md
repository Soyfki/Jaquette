# Jaquette

Jaquette est le logiciel de production et de doublage audio de livres. Il permet d’associer des pistes **SFX**, **Ambiance** et **Musique** au texte d’un livre afin de préparer une expérience de lecture enrichie.

Jaquette ne doit pas être confondu avec **Jacques** : Jaquette est l’outil de production, tandis que Jacques est l’application propriétaire de lecture et la boutique de distribution.

## Principe central

**Le texte est la timeline de Jaquette.** Les sons sont associés à des mots ou à des plages de mots, et non à une timeline temporelle classique.

## État du projet

La **phase 0 — Préparation du projet** et la sous-étape **1.1 — Construire le design system de base** sont acquises. La prochaine sous-étape applicative est **1.2 — Créer la structure d’écran principale** ; elle n’a pas commencé. Le recadrage produit **REC-01 — Collaboration offline** est intégré à la documentation : la collaboration repose sur des chapitres `.chpt` échangés et révisés comme candidates, sans fonctions live.

La version actuelle de l’application est **`0.0.0` (pré-développement, non publiée)**. La [convention de version](docs/VERSIONING.md) explique la différence entre cette version, les jalons produit tels que V0.1 et les futures versions des formats `.jacq` et `.jacko`.


## Lancer la démonstration 1.1

Pré-requis : Node.js 24 ou plus récent et Chrome. Le projet fixe pnpm 11.19.0 dans `package.json` et embarque les polices via des dépendances locales ; aucun service de polices distant n’est requis à l’exécution.

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Ouvrir ensuite <http://127.0.0.1:5173> dans Chrome.

Vérifications techniques :

```powershell
corepack pnpm validate
corepack pnpm test:e2e
git diff --check
```

`test:e2e` lance la page dans Google Chrome aux largeurs définies dans la configuration Playwright. Les instructions complètes se trouvent dans la [validation de la sous-étape 1.1](docs/validation/1.1-design-system.md).

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
- [Collaboration offline et échanges `.chpt`](docs/COLLABORATION_OFFLINE.md)
- [Données de référence](reference-data/README.md)
- [Protocole et modèles de validation](docs/validation/README.md)
- [Validation du design system 1.1](docs/validation/1.1-design-system.md)
- [Décision de socle Web](docs/decisions/0001-web-foundation.md)
- [Plan détaillé de développement](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md)
