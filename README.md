# Jaquette

Jaquette est le logiciel de production et de doublage audio de livres. Il permet d’associer des pistes **SFX**, **Ambiance** et **Musique** au texte d’un livre afin de préparer une expérience de lecture enrichie.

Jaquette ne doit pas être confondu avec **Jacques** : Jaquette est l’outil de production, tandis que Jacques est l’application propriétaire de lecture et la boutique de distribution.

## Principe central

**Le texte est la timeline de Jaquette.** Les sons sont associés à des mots ou à des plages de mots, et non à une timeline temporelle classique.

## État du projet

Les acquis historiques sont l’ancienne phase 0, les anciennes sous-étapes 1.1 à 1.3 et le lot 1.4.1. Sur main à la base du lot 0.1, le prototype propose Sound Designer et Réviseur, avec simulation locale non persistée et Sound Designer initial.

Les quatre rôles simulés et les correctifs de l’ancien **1.4.2 — Chef d’équipe et Admin Maison** ont reçu leur revalidation complète le 18 septembre 2026. Le lot 1.4.2 est acquis ; sa branche historique est conservée. La [PR 9](https://github.com/Soyfki/Jaquette/pull/9) réunit cet héritage et les correctifs 0.3.

L’ancien 1.4.3 n’est plus une prochaine livraison autonome : aucun périmètre précis retrouvé dans l’ancien plan. Les reliquats réellement identifiables seront inventoriés en 0.3/0.5 et rattachés aux futures sous-étapes correspondantes. L’ancienne 1.4 et l’ancienne phase 1 restent non acquises ; aucune clôture rétroactive.

La nouvelle étape 0 de reprise est distincte de l’ancienne phase 0. 0.1 et 0.2 sont validées. **0.3 — Corriger les défauts du prototype** et la **revalidation historique 1.4.2** sont **VALIDÉES / GO**, décisions distinctes du 18 septembre 2026 après campagne technique et observations humaines complètes au SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`. L’intégration et les contrôles au dernier SHA sont tracés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9). Le [rapport](docs/validation/0.3-correctifs-prototype/VALIDATION_REPORT.md) distingue résultats techniques et humains et conserve les défauts corrigés. 0.4 n’est pas commencée.

Version : **0.0.0**, non publiée. Les [jalons actifs et leur correspondance historique](docs/VERSIONING.md) ne sont pas des versions applicatives ou de formats.

## Cible de lancement décidée en septembre 2026

Jaquette est un logiciel **gratuit sur invitation**, avec Web complet sur ordinateur dans Chrome, Firefox et Safari (Safari qualifié sur Mac), et Electron Windows/macOS au lancement. PC Windows 10 de génération 2018, MacBook Intel précédant le M1 et MacBook M1 sont les cibles matérielles ; leurs configurations et budgets restent à fixer en 0.4.

Après activation initiale en ligne et préparation de l’environnement, cinq jours de travail hors ligne sont prévus. À expiration, nouvelles modifications bloquées ; consultation, sauvegarde et archivage conservés. À reconnexion, les droits sont recontrôlés avant tout envoi. En cas de révocation : travail conservé, aucun envoi et archivage sur disque accompagné jusqu’à vérification, sans destruction si l’utilisateur annule.

Contenus, commentaires de contenu et banques restent sur stockage local ou infrastructure privée choisie. Les services Jaquette se limitent à l’identité, aux invitations et aux données administratives explicitement autorisées. Les bibliothèques locales et banques privées embarquent dans le projet les médias utilisés.

Le travail est local ; soumissions, transmission de commentaires/décisions et actualisation sont connectées, sans montage en direct. Une décision préparée hors ligne ne devient officielle qu’après acceptation autorisée. Le MCP fait partie du lancement avec agents externes, bibliothèques autorisées et brouillon protégeant le master, sans génération sonore. Hors ligne : agent et modèle locaux ; transfert distant : consentement et connexion. Desktop peut fournir la liaison MCP locale au navigateur, à qualifier.

Export et contrôle préparent Jacques ; publication effective, boutique et dépublication sont reportées à **F1**. La signature de publication et la tâche automatique associée restent des règles de F1 ; un export de contrôle ou une signature avec clés de test n’authentifient pas une publication réelle.

Le [plan complet](PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) distingue les décisions produit des propositions de stockage (section 4, décision en 1.2) et des cibles de performance (section 5, adoption en 0.4). OPFS, ZIP et distinction espace de travail/copie portable ne sont pas validés. Développement prévu par GPT.6, budget limité et sans échéance imposée ; la gratuité ne couvre pas les coûts du stockage choisi ni des agents/appels IA tiers.

## Lancer le prototype Web intermédiaire 1.4.1

Ce mode d’emploi décrit le prototype historique 1.4.1 sur main. Le [guide de reproductibilité](docs/REPRODUCIBILITY.md) fixe Node 24.19.0 et pnpm 11.19.0 pour la campagne 0.2, avec installation propre, diagnostic et CI Chrome. La référence anglaise utilise une archive explicite des octets canoniques : voir le [dossier 0.2](docs/validation/0.2-base-reproductible/README.md).

Pré-requis du prototype historique : Node.js 24 ou plus récent et Chrome. Le projet fixe pnpm 11.19.0 dans `package.json` et embarque les polices via des dépendances locales ; aucun service de polices distant n’est requis à l’exécution.

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm prepare:references
corepack pnpm dev
```

Ouvrir ensuite <http://127.0.0.1:5173> dans Chrome.

La route `/projet` démarre dans la vue Sound Designer héritée de la sous-étape 1.3. Un sélecteur permet de basculer localement vers la vue Réviseur, centrée sur le livre, la simulation, les commentaires, les candidates de chapitre et l’état de validation. Ce rôle simulé ne modifie ni l’URL ni l’historique du navigateur, n’est pas conservé après rechargement et n’implémente aucune authentification, permission, persistance ou action métier réelle.

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
3. reprendre le plan canonique actualisé sur main après chaque lot ; après les Go de 0.1, 0.2 et 0.3, la prochaine sous-étape est 0.4, non commencée ; respecter ses prérequis et le mandat du lot demandé ;
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
