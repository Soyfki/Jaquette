# AGENTS.md — Jacquette

Règles courtes pour tout agent ou développeur. Le produit s'appelle **Jacquette** (le dépôt garde le nom `Jaquette`).

## Documents actifs

1. [`README.md`](README.md) — présentation et démarrage ;
2. [`docs/CAHIER_DES_CHARGES_V1.md`](docs/CAHIER_DES_CHARGES_V1.md) — ce que fait la V1 ;
3. [`docs/PLAN_V1.md`](docs/PLAN_V1.md) — architecture, phases et 32 lots ;
4. ce fichier — invariants et méthode.

Tout ce qui est dans [`docs/archive/`](docs/archive/README.md) est historique : ne pas s'en servir comme règle. En cas de doute entre ces documents, demander à Soyfki plutôt que trancher seul.

## Invariants produit

- Jacquette (outil de bruitage) et Jacques (lecteur et boutique) ne sont jamais confondus.
- Le texte est la timeline : les sons s'ancrent sur des identifiants de mots stables, jamais sur des coordonnées d'affichage.
- Le texte source n'est jamais modifié ; l'EPUB original est conservé.
- L'audio est non destructif ; les originaux uploadés restent intacts.
- Familles de sons : **SFX**, **Ambiance**, **Musique**. Pas de « son ponctuel ».
- 3 SFX simultanés au plus ; une seule musique à la fois hors fondu enchaîné.
- Le Réviseur ne touche jamais au son.
- Les droits sont appliqués par le serveur, pas seulement masqués dans l'interface.

## Direction artistique (non négociable)

- Palette : fond `#1B1B3A`, accent `#FFDFB2`, secondaire `#74A4BC`, validation `#CFF2EC`, texte `#EFF2FF`.
- Pistes : SFX `#FFAF87`, Ambiance `#E56399`, Musique `#9358FF`.
- Polices : Manrope (interface), Literata (livre), Noto Naskh Arabic (fallback arabe), embarquées localement.
- Boutons et tags en capsules, champs très arrondis, thème sombre uniquement.
- Page de lecture claire (`#EFF2FF`) dans l'interface sombre.
- Le type d'un son n'est jamais indiqué par la seule couleur : icône et libellé sur chaque rail.
- Interface en français clair, sans jargon ; cinq écrans (voir le plan).

## Méthode

- Un lot = un ticket AgentTickets = une PR. Ne travailler que dans le périmètre du ticket.
- Jamais de push sur `main`, jamais de merge par un agent : Soyfki relit et merge.
- Tests automatiques sur ce qui change ; CI verte avant de demander une revue.
- Chaque phase se termine par une démo déployée sur `jacquette.jacques.page`, validée par Soyfki.
- Pas de dossier de preuve par lot : la PR décrit ce qui a été testé et comment.
- Ne rien inventer qui contredise le cahier des charges V1 ; signaler une décision manquante au lieu de l'ériger en règle.
- Ne jamais versionner de secret, mot de passe, clé ou jeton.
- Ne rien supprimer de l'historique Git ; archiver dans `docs/archive/` plutôt que détruire.

## Stack

React, TypeScript, Vite, pnpm (voir `package.json`) ; Vitest, Testing Library, Playwright. Serveur : Caddy + PocketBase sur le VPS Ionos, déploiement par GitHub Actions. Décisions techniques datées dans [`docs/decisions/`](docs/decisions/).
