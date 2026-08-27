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
- [Données de référence](../reference-data/README.md) — acquisition reproductible, inventaire validé et scénario de doublage du jalon 0.2.
- [Protocole de validation](validation/README.md) — méthode commune, checklist et modèles de rapports pour valider chaque livraison.
- [Validation du design system 1.1](validation/1.1-design-system.md) — contrôles automatisés et revue humaine de la page de démonstration.
- [Validation du socle de rôle simulé et de la variante Réviseur 1.4.1](validation/1.4-role-variants.md) — bascule locale, séparation des interfaces, responsive et non-régression du workspace Sound Designer.
- [Validation des variantes simulées Chef d’équipe et Admin Maison 1.4.2](validation/1.4.2-team-lead-admin-variants.md) — pilotage projet, administration de maison, isolation des capacités et quatre rôles simulés.

## État documentaire

- Phase acquise : **phase 0 — Préparation du projet**.
- Sous-étapes acquises : **1.1 à 1.3**.
- Sous-étape en cours : **1.4 — Adapter l’interface selon le rôle** ; le lot **1.4.1 — Socle de rôle simulé et variante Réviseur** est acquis et le lot **1.4.2 — Variantes simulées Chef d’équipe et Admin Maison** est livré techniquement mais reste en attente de validation humaine.
- Le lot 1.4.3 et la clôture de la phase 1 n’ont pas commencé ; la sous-étape 1.4 et la phase 1 ne sont pas acquises, et 2.1 n’est pas encore la prochaine étape exécutable.
- Recadrage produit : **REC-01 — Collaboration offline**, intégré à la documentation.
- Code applicatif : **prototype Web intermédiaire avec quatre variantes de rôle simulées localement, sans permission ni action métier réelle**.
- Version actuelle de l’application : **`0.0.0` (pré-développement, non publiée)**.

Cet index n’ajoute aucune règle métier et ne remplace pas les documents de référence.
