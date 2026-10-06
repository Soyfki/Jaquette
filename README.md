# Jaquette

Jaquette est le logiciel de production d’habillage sonore de livres. Il permet d’associer des pistes **SFX**, **Ambiance** et **Musique** au texte d’un livre afin de préparer une expérience de lecture enrichie.

Jaquette ne doit pas être confondu avec **Jacques** : Jaquette est l’outil de production, tandis que Jacques est l’application propriétaire de lecture et la boutique de distribution.

## Principe central

**Le texte est la timeline de Jaquette.** Les sons sont associés à des mots ou à des plages de mots, et non à une timeline temporelle classique.

## Reprise active — 6 octobre 2026

Gratuit sur invitation sans paywall, premier atelier Noémie seule sur Web et Desktop Windows, V1 pour au moins dix novices. Prototype à quatre rôles simulés ; import/audio/stockage/identité/MCP réels restent à construire, application **0.0.0**. [Plan A–H](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) et [matrice D70](docs/validation/T-70/README.md) sont la reprise courante.

Atelier D : vrai EPUB2/3, banque intégrée ou fichiers/dossiers privés, SFX/Ambiance/Musique, réglages/écoute/undo, .jacq autonome rouvert offline après retrait des sources. C est une preuve verticale courte ; .jacko est au test suivant E et obligatoire V1 ; publication/signature réelle/boutique Jacques en F1. Aucune narration/TTS/clonage/génération ni coédition live.

Manuel complet sans API, BYOK personnel facultatif, aucune clé Noémie collective. Imports privés, partage volontaire, collaboration à tour de rôle et révision unanime. Cloud central administratif seulement ; livres/sons/commentaires/clés locaux ou infrastructure privée autorisée. Tests gratuits ; coût commun minimal chiffré séparément sans plafond inventé, aucun service/dépense adopté ici. Cinq jours offline, droits recontrôlés avant envoi et travail préservé à expiration/révocation. DA conservée, interactions bornées/accessibles.

V1 : Web Chrome/Firefox/Safari réel sur Mac et Electron Windows x64/macOS M1 arm64. W18 aux étapes intermédiaires ; M1 final, Mac Intel hors cible active D04-04. Suggestions disponibles mais facultatives, routes qualifiées T-118 ; alternatives non retenues conditionnelles.

Base intégrée de reprise : [main 4b183900a4a677c51c1d8150f7459f150c1ad033](https://github.com/Soyfki/Jaquette/commit/4b183900a4a677c51c1d8150f7459f150c1ad033). [PR12](https://github.com/Soyfki/Jaquette/pull/12) reste draft/non fusionnée, tête auditée 0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb ; documents/outillage, aucun changement src. **H-W18 historique reste BLOCKED/inconnu et 0.4 BLOQUÉE/NO-GO**. La CI historique de PR12 n'établit ni écoute physique ni fonctionnalité métier. Les budgets adoptés ne sont pas des mesures obtenues ; leur reprise et la porte technique sont réservées à JQ-02/T-71. Aucun rapport historique rempli n'est réécrit.

Flux AT : claim frais propre, heartbeat, tests/preuves, PR draft, revue distincte et validation humaine AT ; aucune fusion/push base/déploiement agent. Trois campagnes humaines D, E/G, H ; écoute physique T-103 obligatoire, jamais remplacée par headless. JQ-02/T-71 garde budgets et porte technique.

## Acquis historiques conservés

Ancienne phase 0, sous-étapes 1.1 à 1.3 et lot 1.4.1 acquis ; quatre rôles simulés et corrections 0.3/1.4.2 revalidés le 18 septembre 2026 au SHA 28cb5d943e0617de0b6fec9e50e76ca3b54c9c51. La [PR9](https://github.com/Soyfki/Jaquette/pull/9) et le [rapport](docs/validation/0.3-correctifs-prototype/VALIDATION_REPORT.md) conservent les preuves de recette/intégration. 0.1/0.2 sont intégrées ; ancienne 1.4 et phase 1 ne sont pas clôturées rétroactivement. Ancien 1.4.3 sans périmètre précis retrouvé, reliquats à rattacher sans exigences rétroactives. Aucune qualification produit issue d'une simulation.

## Lancer le prototype Web intégré

Ce mode d’emploi décrit le prototype intégré sur la base main auditée ; ses quatre rôles restent simulés. Le [guide de reproductibilité](docs/REPRODUCIBILITY.md) fixe Node 24.19.0 et pnpm 11.19.0 pour la campagne 0.2, avec installation propre, diagnostic et CI Chrome. La référence anglaise utilise une archive explicite des octets canoniques : voir le [dossier 0.2](docs/validation/0.2-base-reproductible/README.md).

Pré-requis du prototype historique : Node.js 24 ou plus récent et Chrome. Le projet fixe pnpm 11.19.0 dans `package.json` et embarque les polices via des dépendances locales ; aucun service de polices distant n’est requis à l’exécution.

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm prepare:references
corepack pnpm dev
```

Ouvrir ensuite <http://127.0.0.1:5173> dans Chrome.

La route `/projet` démarre dans la vue Sound Designer héritée de la sous-étape 1.3. Un sélecteur permet de basculer localement vers Réviseur, Chef d’équipe et Admin Maison ; leurs vues adaptées restent simulées. Ce rôle simulé ne modifie ni l’URL ni l’historique du navigateur, n’est pas conservé après rechargement et n’implémente aucune authentification, permission, persistance ou action métier réelle.

Vérifications techniques :

```powershell
corepack pnpm validate:diagnostic
corepack pnpm validate:all
git diff --check
```

Si Corepack est absent, utiliser directement pnpm 11.19.0. Préparer Chrome avec `pnpm exec playwright install chrome` avant les E2E. `validate:all` inclut `validate`, les tests d'outillage et `test:e2e`, avec propagation des échecs. Les E2E utilisent Google Chrome 1440 × 1000 et 768 × 1024, Vite dev et `reuseExistingServer=false` ; cela ne qualifie ni le build distribué ni toute la matrice produit. Les contrôles historiques restent dans la [validation 1.4.1](docs/validation/1.4-role-variants.md) et la [validation 1.1](docs/validation/1.1-design-system.md).

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
3. suivre le ticket précis et ses dépendances AT vivantes, le plan A–H et le mandat courant ; préserver les copies modifiées et prendre un claim frais dans un clone isolé ;
4. distinguer les règles produit validées des décisions techniques encore ouvertes ;
5. documenter toute nouvelle décision technique sans en faire une règle métier implicite.

Ne versionnez jamais de secret, mot de passe, clé, jeton ou identifiant de connexion. Les futures valeurs sensibles devront être fournies par un mécanisme local approprié, hors du dépôt.

## Documentation

- [Index documentaire](docs/README.md)
- [Convention de version](docs/VERSIONING.md)
- [Collaboration offline et échanges `.chpt`](docs/COLLABORATION_OFFLINE.md)
- [Données de référence](reference-data/README.md)
- [Protocole et modèles de validation](docs/validation/README.md)
- [Preuves et correspondance des décisions de 0.1](docs/validation/0.1-harmonisation/README.md)
- [Campagne de revalidation de l’ancien 1.4.2, PR 9](docs/validation/1.4.2-team-lead-admin-variants.md)
- [Validation du design system 1.1](docs/validation/1.1-design-system.md)
- [Validation du socle de rôle simulé et de la variante Réviseur 1.4.1](docs/validation/1.4-role-variants.md)
- [Décision de socle Web](docs/decisions/0001-web-foundation.md)
- [Plan détaillé de développement](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md)
