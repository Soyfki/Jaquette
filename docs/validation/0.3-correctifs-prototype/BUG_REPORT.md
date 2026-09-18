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

## B03-4 — Course dans le test hérité des quatre rôles

La [CI de 6efc857c70d847e55ed3ff2f941ddf886ca4ff74](https://github.com/Soyfki/Jaquette/actions/runs/35327125335) échoue sur le test unitaire des bascules, alors que les 28 E2E et les nouveaux tests 0.3 passent. Le premier clic Sound Designer précède parfois le requestAnimationFrame de focus initial : le h1 récupère le focus attendu sur le bouton. La campagne locale de ce SHA passe, sans annuler cet échec CI. Correction du test : attendre explicitement le focus initial avant la première interaction, comme pour la recherche en 0.2 ; toutes les assertions de focus, isolation, URL et historique sont conservées. Nouveau SHA et campagne complète locale/CI exigés ; aucune modification applicative nécessaire.

Sur `f3f12b69a4d9b5261c8b0502dec556fb5e98aa35`, la CI et validate:all locale passent, mais le diagnostic local révèle la même course dans l’E2E du lien d’évitement : le focus du h1 interrompt le focus programmatique du lien, qui reste d’opacité 0. Les tests clavier hérités attendent désormais le focus initial avant de focaliser un autre contrôle ; aucune assertion ni seuil n’est assoupli. Cet échec reste conservé dans les preuves locales de ce SHA.

## B03-5 — Contour de focus trop proche de l’activité sur Accueil

Relecture des captures de `f3f12b69a4d9b5261c8b0502dec556fb5e98aa35` aux deux formats : le contour du bouton « Ouvrir l’état du projet » touche la ligne d’activité précédente. Une marge minimale utilisant le token existant space-2 sépare les deux, sans changer palette, typographies, ordre ou fonction. Les captures sont régénérées et relues sur le SHA final.

## B03-6 — Tuiles Admin mal alignées (retour humain H14-6/H14-10)

Recette présentée : `a93e5464b427ee575db06bb41fa39f46db09502c`. L’utilisateur rapporte « Les alignements et espacements entre les tuiles sont hasardeux » et demande leur réorganisation. Il renseigne H14-6 et H14-10 BLOCKED ; cette observation décrit un défaut visuel confirmé par la capture Admin bureau, donc un FAIL de disposition selon le protocole, puis une revalidation humaine attendue après correction. Les onze autres observations sont PASS et restent tracées dans le rapport.

Cause : les tuiles Membres, Projets et Audit occupent deux pistes de grille tout en gardant une hauteur de contenu et un alignement en haut. Les pistes réservées produisent des vides et décalent la deuxième rangée. Correction limitée au CSS Admin : retrait de ces spans, hauteur étirée par rangée, espacement unique space-3, notes de bas de tuile alignées. Le DOM conserve les six régions et leur ordre, les contenus et les permissions simulées. En format réduit, les tuiles restent sur une colonne et s’adaptent à leur contenu, sans hauteur fixe.

Contrôle T12 fixé avant reprise : mesurer alignements et espacements dans Chrome aux deux formats, relire les nouvelles captures et rejouer la campagne complète locale/CI. Seuls H14-6 et la partie Admin de H14-10 sont à réobserver ; H14-9 est couvert techniquement de nouveau pour le responsive affecté. Aucun PASS humain attribué à la correction avant retour.
