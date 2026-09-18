# Rapports de défauts — 0.3

Adaptation du [modèle](../BUG_REPORT.md). Agent Codex, 18 septembre 2026, PR 9. Données fictives du prototype ; Windows, Node 24.19.0, React StrictMode, Vitest/jsdom puis Chrome aux deux viewports.

La reproduction précède les corrections applicatives : SHA `d729cf8a3d0631ef6706021265f09dc4e6cc52d0`, commande `pnpm exec vitest run src/PrototypeCorrections.test.tsx --reporter=verbose`, 18 septembre 2026 à 10:46 Europe/Paris. Résultat : cinq tests FAIL attendus (scénario, focus et fin de simulation dans les trois rôles lecteurs), un test PASS de cadence/nettoyage. Le journal `reproduction.log` est conservé dans les preuves locales et résumé dans la PR. Les tests ajoutés énoncent le comportement attendu et sont exécutés d’abord contre le code hérité.

## B03-1 — Scénario soumis incomplet (T03)

Ouvrir Accueil puis Chef et Admin pour Le Jardin de Minuit. Attendu : 10 chapitres terminés sur 10, 30 approbations sur 30 (3 Réviseurs par chapitre), finale En attente Chef, Admin cohérent. Code hérité : 7/10 et 21/30, Admin Révision. Gravité haute : contradiction des prérequis éditoriaux. La candidate Réviseur 2/3 nécessite un contexte antérieur distinct ; l’ancienne 21e approbation doit précéder une complétude explicite avant soumission.

## B03-2 — Focus Fondations absent (T04)

Accéder à /fondations via la navigation, directement, puis par précédent/suivant. Attendu : son unique h1 reçoit le focus. Code hérité : le h1 n’est pas focalisable malgré l’appel focus() du shell. Gravité normale : repère clavier perdu.

## B03-3 — Mise à jour React pendant un updater (T05/T06)

Sous StrictMode et horloge contrôlée, jouer le chapitre jusqu’au dernier mot, puis relancer trois fois. Attendu : fin inactive, dernier mot correct, zéro avertissement et zéro minuterie restante. Code hérité : setSimulationState appelé dans l’updater setActiveWordIndex, donc effet de bord lors du calcul d’état du parent. Gravité haute : comportement non pur, warning React et risque lors des rendus répétés.

Les sorties complètes avant/après sont conservées hors dépôt et liées au SHA dans la PR. Aucun filtrage de warning ni retrait de StrictMode n’est autorisé. Les pièces publiées ne contiennent que les données de démonstration et les journaux relus.

## Corrections et vérification

B03-1 : fixture soumise partagée Accueil/Chef/Admin, 10/10 et 30/30 ; jalon 30e approbation à 09:30 avant soumission à 09:42, 21e historique conservée. Le contexte Réviseur antérieur est visible dans Validation, y compris au petit format (l’intro de projet y est masquée).

B03-2 : h1 focalisable par tabIndex=-1 ; contour accent rétabli. Navigation SPA, titre et URL conservés. Le menu Projet donne accès clavier à Fondations dans les deux formats.

B03-3 : une échéance par mot, annulée au changement d’état ou démontage ; les deux mises à jour sont effectuées dans le callback, aucune dans un updater. Horloge E2E explicitement figée et avancée mot par mot. Console error/warn et erreurs de page font échouer les tests sans exception ; interceptions restaurées.

Les premiers essais de développement ont aussi révélé des sélecteurs E2E ambigus (Accueil et fermeture du tiroir) et le contexte Réviseur masqué au petit format ; ils ont été corrigés avant la campagne finale. Ces essais sur arbre en cours ne remplacent pas les preuves finales au SHA publié.
