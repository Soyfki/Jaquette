# Documentation de Jaquette

Ce dossier rassemble la documentation complémentaire et les décisions techniques du dépôt. Les règles produit restent définies par les trois sources de vérité conservées à la racine.

## Commencer ici

1. [Présentation et état du dépôt](../README.md)
2. [Invariants à respecter](../AGENTS.md)
3. [Cahier des charges détaillé](../CAHIER_DES_CHARGES_JAQUETTE.md)
4. [Plan détaillé de développement](../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md)

## Décisions techniques du dépôt

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
- Quatre rôles et correctifs 1.4.2 : présents dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9), SHA 5cabbb016d3ce5480b165512c1aa7814b8367802, tant qu’ils ne sont pas fusionnés sur main. Le lot 1.4.2 reste non acquis avant revalidation humaine.
- Ancien 1.4.3 : plus de livraison autonome ; périmètre précis non retrouvé. Inventaire des reliquats réellement identifiables en 0.3/0.5, puis rattachement aux futures sous-étapes correspondantes. Aucune clôture rétroactive de l’ancienne 1.4 ni de l’ancienne phase 1.
- Version de l’application : **0.0.0**, non publiée.
- Cadrage actif : gratuit sur invitation ; Web complet Chrome/Firefox/Safari sur ordinateur et Electron Windows/macOS au lancement ; Safari qualifié sur Mac.
- Activation initiale en ligne puis cinq jours offline ; expiration conserve lecture/sauvegarde/archivage, révocation vérifiée avant envoi conserve le travail sans soumission et accompagne l’archive sans destruction à l’annulation.
- Contenus et banques locaux/privés ; services Jaquette limités aux données administratives autorisées. Collaboration locale avec échanges/actualisation connectés ; décisions officielles seulement après acceptation autorisée.
- MCP au lancement, médias autorisés, aucune génération sonore, master protégé ; offline avec agent et modèle locaux, transfert distant avec consentement et connexion.
- Export/contrôle .jacko au lancement ; publication réelle, signature de publication, boutique, tâche de publication et dépublication en F1.
- Propositions de stockage en section 4 du plan à décider après preuves en nouvelle 1.2 ; configurations et performances de section 5 à fixer en 0.4, aucune mesure acquise. Budget limité et coûts tiers distingués de la gratuité de Jaquette.

## Reprise du 11 septembre 2026

La nouvelle étape 0 est distincte de l’ancienne phase 0 acquise. Le lot **0.1 — Harmoniser les sources** est documentaire ; son [dossier de preuve](validation/0.1-harmonisation/README.md) fixe les contrôles. Après son Go, prochaine action : **0.2 — Reproduire la base**, sans exécuter l’ancienne 2.1 ni la nouvelle étape 1.

Cet index n’ajoute aucune règle métier et ne remplace pas les documents de référence.
