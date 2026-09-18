# Rapports de défauts — 0.3

Adaptation du [modèle](../BUG_REPORT.md). Agent Codex, 18 septembre 2026, PR 9. Données fictives du prototype ; Windows, Node 24.19.0, React StrictMode, Vitest/jsdom puis Chrome aux deux viewports.

La reproduction précède les corrections applicatives. Son SHA et les journaux exacts sont publiés dans la PR ; les tests de régression ajoutés énoncent le comportement attendu et sont exécutés d’abord contre le code hérité.

## B03-1 — Scénario soumis incomplet (T03)

Ouvrir Accueil puis Chef et Admin pour Le Jardin de Minuit. Attendu : 10 chapitres terminés sur 10, 30 approbations sur 30 (3 Réviseurs par chapitre), finale En attente Chef, Admin cohérent. Code hérité : 7/10 et 21/30, Admin Révision. Gravité haute : contradiction des prérequis éditoriaux. La candidate Réviseur 2/3 nécessite un contexte antérieur distinct ; l’ancienne 21e approbation doit précéder une complétude explicite avant soumission.

## B03-2 — Focus Fondations absent (T04)

Accéder à /fondations via la navigation, directement, puis par précédent/suivant. Attendu : son unique h1 reçoit le focus. Code hérité : le h1 n’est pas focalisable malgré l’appel focus() du shell. Gravité normale : repère clavier perdu.

## B03-3 — Mise à jour React pendant un updater (T05/T06)

Sous StrictMode et horloge contrôlée, jouer le chapitre jusqu’au dernier mot, puis relancer trois fois. Attendu : fin inactive, dernier mot correct, zéro avertissement et zéro minuterie restante. Code hérité : setSimulationState appelé dans l’updater setActiveWordIndex, donc effet de bord lors du calcul d’état du parent. Gravité haute : comportement non pur, warning React et risque lors des rendus répétés.

Les sorties complètes avant/après sont conservées hors dépôt et liées au SHA dans la PR. Aucun filtrage de warning ni retrait de StrictMode n’est autorisé. Les pièces publiées ne contiennent que les données de démonstration et les journaux relus.
