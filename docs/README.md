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

## Reprise active — 6 octobre 2026

Gratuit sur invitation sans paywall, premier atelier Noémie seule sur Web et Desktop Windows, V1 pour au moins dix novices. Prototype à quatre rôles simulés ; import/audio/stockage/identité/MCP réels restent à construire, application **0.0.0**. [Plan A–H](../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md) et [matrice D70](validation/T-70/README.md) sont la reprise courante.

Atelier D : vrai EPUB2/3, banque intégrée ou fichiers/dossiers privés, SFX/Ambiance/Musique, réglages/écoute/undo, .jacq autonome rouvert offline après retrait des sources. C est une preuve verticale courte ; .jacko est au test suivant E et obligatoire V1 ; publication/signature réelle/boutique Jacques en F1. Aucune narration/TTS/clonage/génération ni coédition live.

Manuel complet sans API, BYOK personnel facultatif, aucune clé Noémie collective. Imports privés, partage volontaire, collaboration à tour de rôle et révision unanime. Cloud central administratif seulement ; livres/sons/commentaires/clés locaux ou infrastructure privée autorisée. Tests gratuits ; coût commun minimal chiffré séparément sans plafond inventé, aucun service/dépense adopté ici. Cinq jours offline, droits recontrôlés avant envoi et travail préservé à expiration/révocation. DA conservée, interactions bornées/accessibles.

V1 : Web Chrome/Firefox/Safari réel sur Mac et Electron Windows x64/macOS M1 arm64. W18 aux étapes intermédiaires ; M1 final, Mac Intel hors cible active D04-04. Suggestions disponibles mais facultatives, routes qualifiées T-118 ; alternatives non retenues conditionnelles.

Base intégrée de reprise : [main 4b183900a4a677c51c1d8150f7459f150c1ad033](https://github.com/Soyfki/Jaquette/commit/4b183900a4a677c51c1d8150f7459f150c1ad033). [PR12](https://github.com/Soyfki/Jaquette/pull/12) reste draft/non fusionnée, tête auditée 0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb ; documents/outillage, aucun changement src. **H-W18 historique reste BLOCKED/inconnu et 0.4 BLOQUÉE/NO-GO**. La CI historique de PR12 n'établit ni écoute physique ni fonctionnalité métier. Les budgets adoptés ne sont pas des mesures obtenues ; leur reprise et la porte technique sont réservées à JQ-02/T-71. Aucun rapport historique rempli n'est réécrit.

Flux AT : claim frais propre, heartbeat, tests/preuves, PR draft, revue distincte et validation humaine AT ; aucune fusion/push base/déploiement agent. Trois campagnes humaines D, E/G, H ; écoute physique T-103 obligatoire, jamais remplacée par headless. JQ-02/T-71 garde budgets et porte technique.

## Acquis et preuves historiques

Ancienne phase 0, sous-étapes 1.1 à 1.3 et lot 1.4.1 acquis. 0.1/0.2 intégrées : [preuves 0.1](validation/0.1-harmonisation/README.md), [preuves 0.2](validation/0.2-base-reproductible/README.md). Quatre rôles simulés et correctifs 0.3/1.4.2 acquis après revalidation technique/humaine du 18 septembre 2026, SHA 28cb5d943e0617de0b6fec9e50e76ca3b54c9c51 et intégration [PR9](https://github.com/Soyfki/Jaquette/pull/9). [Checklist](validation/0.3-correctifs-prototype/CHECKLIST.md), [défauts](validation/0.3-correctifs-prototype/BUG_REPORT.md), [rapport à deux conclusions](validation/0.3-correctifs-prototype/VALIDATION_REPORT.md), [observations](validation/0.3-correctifs-prototype/HUMAN_REVIEW.md) restent intacts. Aucune clôture rétroactive ancienne 1.4/phase 1 ; ancien 1.4.3 sans périmètre précis retrouvé. L'ancien calendrier de septembre est conservé dans le plan, sans mandat de lancement.

Cet index n’ajoute aucune règle métier et ne remplace pas les documents de référence.
