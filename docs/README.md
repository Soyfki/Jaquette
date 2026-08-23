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
- [Données de référence](../reference-data/README.md) — acquisition reproductible, inventaire validé et scénario de doublage du jalon 0.2.
- [Protocole de validation](validation/README.md) — méthode commune, checklist et modèles de rapports pour valider chaque livraison.
- [Validation du design system 1.1](validation/1.1-design-system.md) — contrôles automatisés et revue humaine de la page de démonstration.

## État documentaire

- Phase acquise : **phase 0 — Préparation du projet**.
- Sous-étape acquise : **1.1 — Construire le design system de base**.
- Prochaine sous-étape applicative : **1.2 — Créer la structure d’écran principale**, non commencée.
- Recadrage produit : **REC-01 — Collaboration offline**, intégré à la documentation.
- Code applicatif : **démonstration Web du design system uniquement**.
- Version actuelle de l’application : **`0.0.0` (pré-développement, non publiée)**.

Cet index n’ajoute aucune règle métier et ne remplace pas les documents de référence.
