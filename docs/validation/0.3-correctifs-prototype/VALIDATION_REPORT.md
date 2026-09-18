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

Le responsable interprète les deux BLOCKED comme un défaut observé, donc FAIL de disposition sur ce SHA, et conserve le libellé du retour original. Après correction, H14-6 et la partie Admin de H14-10 restent BLOCKED jusqu’à leur nouvelle observation humaine. Les autres PASS sont réutilisables pour une modification limitée aux règles CSS Admin ; les écrans Accueil/Chef/Fondations, le DOM, les données, la simulation et les rôles ne changent pas. H14-9 est rejoué techniquement pour les dimensions, le défilement et l’absence de contenu tronqué. La campagne complète et les six captures sont renouvelées au nouveau SHA consigné dans la PR.

## Deux décisions distinctes après correction

| Campagne | État en attente de la revalidation ciblée | Justification |
|---|---|---|
| 0.3 | BLOQUÉE / NO-GO pour l’intégration de PR 9 | H03-1/H03-2/H03-3 PASS ; aucun Go final avant correction et revalidation complète du diff hérité |
| Revalidation historique 1.4.2 | BLOQUÉE / NO-GO | H14-6 et H14-10 Admin à réobserver après B03-6 ; huit autres points historiques PASS conservés |

La PR reste ouverte, en brouillon et non fusionnée. Aucun lot n’est acquis par ces seuls documents. Aucun Go si un critère obligatoire manque ou échoue. L’agent interprète les observations et signe la décision ; il ne demande pas à l’humain de choisir Go/No-Go. Aucune dette acceptée à ce stade.

Application de la matrice : obligatoire BLOCKED → BLOQUÉE ; sinon obligatoire FAIL → À CORRIGER ; sinon tous PASS et preuves complètes → VALIDÉE. La revue indépendante éventuellement exigée par GitHub reste distincte. Après Go : dernier SHA vérifié, CI, squash lié à la tête approuvée, merged=true, squash sur origin/main, CI/main et smoke. Rien de cela n’est revendiqué avant exécution.

## Reliquats identifiés, hors 0.3

Les aperçus de montage, de révision, de management et de publication restent des maquettes. Leur implémentation suit les étapes du plan actif (production 2–6, workflow 7, organisations/échanges 8–10, publication F1). Aucun périmètre autonome retrouvé n’est attribué à l’ancien 1.4.3 ; le découpage détaillé reste en 0.5. Aucune clôture de l’ancienne phase 1 ni démarrage de l’étape suivante.
