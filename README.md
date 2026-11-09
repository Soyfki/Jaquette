# Jacquette

Jacquette est l'outil Web de bruitage de livres : une équipe importe un EPUB, associe des sons **SFX**, **Ambiance** et **Musique** aux mots du texte, révise chapitre par chapitre et exporte un fichier `.jacko` pour **Jacques**, la future application de lecture.

**Le texte est la timeline** : les sons s'ancrent sur des mots ou des plages de mots, pas sur une timeline temporelle.

## État

- Plan V1 validé le 4 novembre 2026 : 6 phases, 32 lots, démo en ligne à chaque fin de phase. Voir le [plan V1](docs/PLAN_V1.md).
- Phase en cours : **Phase 0 — Remise à plat et serveur**.
- Le code actuel est le prototype React (design system, atelier Sound Designer et vue Réviseur simulés, sans serveur). Il sera adapté au fil des lots.
- Cible : `jacquette.jacques.page`, hébergé sur le VPS Ionos (Caddy + PocketBase).

## Documents

| Document | Rôle |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Invariants, direction artistique, méthode de travail |
| [Cahier des charges V1](docs/CAHIER_DES_CHARGES_V1.md) | Ce que fait la V1 |
| [Plan V1](docs/PLAN_V1.md) | Architecture, écrans, phases et lots |
| [Décisions techniques](docs/decisions/) | Choix techniques datés |
| [Données de référence](reference-data/README.md) | EPUB et sons de référence |
| [Archive](docs/archive/README.md) | Ancien cadrage de septembre 2026, à titre historique |

## Lancer le prototype

Pré-requis : Node.js 24 ou plus récent, pnpm 11.19.0 (fixé dans `package.json`), Chrome pour les tests E2E.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm prepare:references
corepack pnpm dev
```

Puis ouvrir <http://127.0.0.1:5173>.

## Vérifier

```sh
corepack pnpm validate
corepack pnpm test:e2e
```

Les commandes disponibles sont listées dans `package.json`.

## Travailler sur le projet

Chaque lot du plan est un ticket AgentTickets et une PR. Lire [`AGENTS.md`](AGENTS.md) avant de contribuer. Aucun secret ne doit être versionné.
