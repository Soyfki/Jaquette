# Rapport de validation — 0.3 et historique 1.4.2

Adaptation du [modèle](../VALIDATION_REPORT.md). Livraison : corrections du scénario soumis, du focus Fondations et de la fin de simulation, avec tout le diff hérité de PR 9. Aucun changement de version (0.0.0), dépendance, stockage, permission réelle, import EPUB, audio ou action vers Jacques.

La [checklist](CHECKLIST.md) fixe les critères. Les résultats détaillés au SHA réellement testé sont publiés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9), pour éviter un commit uniquement destiné à inscrire son propre SHA. Les preuves locales sont dans `.work-0-3/evidence/`. Le [formulaire humain](HUMAN_REVIEW.md) couvre les trois correctifs et les dix contrôles historiques.

## Participants et preuves

Développeur et responsable de validation : agent Codex. Observations humaines : utilisateur. Windows/Chrome, 1440 × 1000 et 768 × 1024, Node 24.19.0/pnpm 11.19.0, corpus canonique 0.2 et données fictives. Les logs indiquent environnement exact, commande, horaire, résultat et SHA. Les captures sont relues techniquement avant partage ; cette lecture ne vaut pas observation humaine.

## Retour humain et reprise ciblée

L’utilisateur a répondu dans cette tâche à la recette présentée au SHA `a93e5464b427ee575db06bb41fa39f46db09502c`. Le SHA est celui de la page ouverte et du formulaire fourni ; le retour n’en mentionne pas un autre.

| Points | Observation humaine reçue | Résultat |
|---|---|---|
| H03-1 | Accueil/Chef cohérents, trois axes distincts, finale en attente | PASS |
| H03-2 | Focus Fondations lisible au clavier ; précédent/suivant | PASS |
| H03-3 | Simulation fluide jusqu’à la fin, puis relance | PASS |
| H14-1 | Quatre rôles lisibles ; Sound Designer initial après rechargement | PASS |
| H14-2 | Accueil : deux équipes, cinq projets, ouverture du projet | PASS |
| H14-3 | Chef : dashboard, progression, livre, simulation, historique, commentaires, validation finale | PASS |
| H14-4 | Préparation de publication absente avant validation, explication claire | PASS |
| H14-5 | Chef sans bibliothèque, montage, inspecteur ou dépublication | PASS |
| H14-6 | « Les alignements et espacements entre les tuiles sont hasardeux, il faut mieux organiser les tuiles et les aligner correctement. » | BLOCKED déclaré par l’utilisateur ; défaut B03-6 constaté, à corriger |
| H14-7 | Admin sans outils ni droits éditoriaux implicites | PASS |
| H14-8 | Deux cycles de bascule des rôles ; focus stable, lecture et panneaux réinitialisés | PASS |
| H14-9 | Lisibilité, défilement et navigation clavier aux deux formats | PASS |
| H14-10 | « Se référer à H14-6 Admin et rectifier les alignements et espacements des tuiles sur l’écran admin. » | BLOCKED déclaré par l’utilisateur ; B03-6, relecture Admin à reprendre |

Le responsable interprète les deux BLOCKED comme un défaut observé, donc FAIL de disposition sur ce SHA, et conserve le libellé du retour original. À ce stade intermédiaire, H14-6 et H14-10 sont restés BLOCKED jusqu’à leur nouvelle observation humaine, reçue ci-dessous. Les autres PASS fonctionnels sont réutilisables : le DOM, les données, les interactions de focus, la simulation et les rôles ne changent pas. H14-9 est rejoué techniquement pour les dimensions, le défilement et l’absence de contenu tronqué. La campagne complète et les six captures sont renouvelées au nouveau SHA consigné dans la PR.

Retour complémentaire : l’utilisateur demande que les pastilles de couleur du design system et le pseudo-logo J soient parfaitement ronds. B03-7 corrige leurs rayons CSS et protège leur forme carrée. Le J commun affecte visuellement les en-têtes Accueil/Chef/Admin/Fondations et Connexion, sans en modifier les parcours. H03-4 est ajouté pour cette nouvelle observation visuelle ; H14-10 reprend les captures pour la disposition Admin et le J commun, sans redemander les onze PASS fonctionnels. T12/T13 et la campagne complète sont relancés sur le SHA réunissant les deux corrections, après interruption documentée de la campagne intermédiaire Admin seule.

## Revalidation humaine finale — 18 septembre 2026

Le guide local et les captures présentés portent le SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`. L’utilisateur répond dans cette même tâche :

| Point | Observation humaine reçue | Résultat |
|---|---|---|
| H14-6 | Alignement et espacement des tuiles Admin aux deux formats | PASS |
| H14-10 | Nouvelles captures : grille Admin et « J » commun | PASS |
| H03-4 | Pastilles de Fondations et deux usages du « J » bien ronds | PASS |

Ces trois observations clôturent B03-6 et B03-7. Les onze PASS précédents restent applicables aux comportements inchangés, pour un total de quatorze points humains satisfaits. Aucun retour ne reste manquant et aucune dette n’est acceptée.

## Deux décisions distinctes après correction

| Campagne | Conclusion | Justification |
|---|---|---|
| 0.3 | **VALIDÉE / GO** | H03-1 à H03-4 PASS ; contrôles T01 à T13 PASS et diff hérité entièrement revalidé |
| Revalidation historique 1.4.2 | **VALIDÉE / GO** | H14-1 à H14-10 PASS ; quatre rôles, régions, restrictions DOM et six captures qualifiés aux deux formats |

Décisions signées par **l’agent Codex, développeur et responsable de validation**, le **18 septembre 2026**. Observations humaines : utilisateur. Le lot historique 1.4.2 est acquis ; aucune clôture de l’ancienne phase 1 ou de 1.4.3 n’en découle.

Preuves techniques au SHA de recette : deux campagnes locales complètes (validate:diagnostic puis validate:all), 54 tests composants, 28 tests d’outillage et 28 tests Chrome ; [CI 35333012707 réussie](https://github.com/Soyfki/Jaquette/actions/runs/35333012707), mesures CSS et dix captures relues. Les preuves détaillées et empreintes sont consignées dans la PR 9 et le dossier local final-28cb5d943e0617de0b6fec9e50e76ca3b54c9c51.

La clôture après ce retour modifie seulement la documentation. L’identité du code, des tests, de la configuration et du corpus avec le SHA de recette est contrôlée ; les observations humaines et mesures visuelles restent applicables. Les contrôles documentaires et la CI sont vérifiés sur la nouvelle tête avant squash. La PR consigne ces résultats au SHA exact, les éventuelles protections, puis merged=true, le SHA de squash sur origin/main, la CI/main et le smoke après fusion. Ces opérations d’intégration ne sont pas revendiquées avant leur exécution.

## Reliquats identifiés, hors 0.3

Les aperçus de montage, de révision, de management et de publication restent des maquettes. Leur implémentation suit les étapes du plan actif (production 2–6, workflow 7, organisations/échanges 8–10, publication F1). Aucun périmètre autonome retrouvé n’est attribué à l’ancien 1.4.3 ; le découpage détaillé reste en 0.5. Aucune clôture de l’ancienne phase 1 ni démarrage de l’étape suivante.
