# Documentation de Jaquette

Ce dossier rassemble la documentation complémentaire et les décisions techniques du dépôt. Les règles produit restent définies par les trois sources de vérité conservées à la racine.

## Commencer ici

1. [Présentation et état du dépôt](../README.md)
2. [Invariants à respecter](../AGENTS.md)
3. [Cahier des charges détaillé](../CAHIER_DES_CHARGES_JAQUETTE.md)
4. [Plan détaillé de développement](../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md)

## Décisions techniques du dépôt

- [Installation et diagnostic reproductibles](REPRODUCIBILITY.md) — runtime fixé, commande complète, références canoniques et CI minimale Chrome ; [campagne 0.2](validation/0.2-base-reproductible/README.md).

- [Convention de version](VERSIONING.md) — convention minimale, état de version actuel et séparation entre application, jalons produit et formats de fichiers.
- [Collaboration offline et échanges `.chpt`](COLLABORATION_OFFLINE.md) — synthèse secondaire des règles d’échange, de fusion, de conflit et des simulations REC-01.
- [Socle Web de la démonstration 1.1](decisions/0001-web-foundation.md) — choix révisable de React, TypeScript, Vite et pnpm pour le premier exécutable.
- [Navigation du shell Web 1.2](decisions/0002-history-api-navigation.md) — choix révisable de l’API History et d’un routeur local minimal.
- [Données de référence](../reference-data/README.md) — acquisition reproductible, inventaire validé et scénario de doublage de l’ancien jalon historique 0.2, distinct de la nouvelle reprise 0.2.
- [Protocole de validation](validation/README.md) — méthode commune, checklist et modèles de rapports pour valider chaque livraison.
- [Validation du design system 1.1](validation/1.1-design-system.md) — contrôles automatisés et revue humaine de la page de démonstration.
- [Validation du socle de rôle simulé et de la variante Réviseur 1.4.1](validation/1.4-role-variants.md) — bascule locale, séparation des interfaces, responsive et non-régression du workspace Sound Designer.

## État documentaire

- Acquis historiques : ancienne phase 0, anciennes sous-étapes 1.1 à 1.3 et lot 1.4.1.
- Code sur main à la base de 0.1 : prototype Sound Designer et Réviseur, local et simulé.
- Quatre rôles simulés et correctifs 1.4.2 : revalidation complète acquise le 18 septembre 2026, intégration suivie dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9).
- Ancien 1.4.3 : plus de livraison autonome ; périmètre précis non retrouvé. Inventaire des reliquats réellement identifiables en 0.3/0.5, puis rattachement aux futures sous-étapes correspondantes. Aucune clôture rétroactive de l’ancienne 1.4 ni de l’ancienne phase 1.
- Version de l’application : **0.0.0**, non publiée.
- Cadrage actif : gratuit sur invitation ; Web complet Chrome/Firefox/Safari sur ordinateur et Electron Windows/macOS au lancement ; Safari qualifié sur Mac.
- Activation initiale en ligne puis cinq jours offline ; expiration conserve lecture/sauvegarde/archivage, révocation vérifiée avant envoi conserve le travail sans soumission et accompagne l’archive sans destruction à l’annulation.
- Contenus et banques locaux/privés ; services Jaquette limités aux données administratives autorisées. Collaboration locale avec échanges/actualisation connectés ; décisions officielles seulement après acceptation autorisée.
- MCP au lancement, médias autorisés, aucune génération sonore, master protégé ; offline avec agent et modèle locaux, transfert distant avec consentement et connexion.
- Export/contrôle .jacko au lancement ; publication réelle, signature de publication, boutique, tâche de publication et dépublication en F1.
- Propositions de stockage en section 4 du plan à décider après preuves en nouvelle 1.2 ; configurations et performances de section 5 à fixer en 0.4, aucune mesure acquise. Budget limité et coûts tiers distingués de la gratuité de Jaquette.

## Reprise du 11 septembre 2026

La nouvelle étape 0 est distincte de l’ancienne phase 0 acquise. 0.1 et 0.2 sont validées : [preuves 0.1](validation/0.1-harmonisation/README.md), [preuves 0.2](validation/0.2-base-reproductible/README.md). **0.3 — Corriger les défauts du prototype** et la **revalidation historique 1.4.2** sont **VALIDÉES / GO**, décisions distinctes du 18 septembre 2026 après campagne technique et observations humaines complètes au SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`. L’intégration et les contrôles au dernier SHA sont tracés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9). Voir la [checklist](validation/0.3-correctifs-prototype/CHECKLIST.md), les [défauts corrigés](validation/0.3-correctifs-prototype/BUG_REPORT.md), le [rapport à deux conclusions](validation/0.3-correctifs-prototype/VALIDATION_REPORT.md) et les [observations humaines](validation/0.3-correctifs-prototype/HUMAN_REVIEW.md). 0.4 n’est pas commencée.

Cet index n’ajoute aucune règle métier et ne remplace pas les documents de référence.
