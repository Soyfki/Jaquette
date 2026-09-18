# Rapport de validation — 0.3 et historique 1.4.2

Adaptation du [modèle](../VALIDATION_REPORT.md). Livraison : corrections du scénario soumis, du focus Fondations et de la fin de simulation, avec tout le diff hérité de PR 9. Aucun changement de version (0.0.0), dépendance, stockage, permission réelle, import EPUB, audio ou action vers Jacques.

La [checklist](CHECKLIST.md) fixe les critères. Les résultats détaillés au SHA réellement testé sont publiés dans la [PR 9](https://github.com/Soyfki/Jaquette/pull/9), pour éviter un commit uniquement destiné à inscrire son propre SHA. Les preuves locales sont dans `.work-0-3/evidence/`. Le [formulaire humain](HUMAN_REVIEW.md) couvre les trois correctifs et les dix contrôles historiques.

## Participants et preuves

Développeur et responsable de validation : agent Codex. Observations humaines : utilisateur. Windows/Chrome, 1440 × 1000 et 768 × 1024, Node 24.19.0/pnpm 11.19.0, corpus canonique 0.2 et données fictives. Les logs indiquent environnement exact, commande, horaire, résultat et SHA. Les captures sont relues techniquement avant partage ; cette lecture ne vaut pas observation humaine.

## Deux décisions distinctes

| Campagne | État avant observations humaines | Justification |
|---|---|---|
| 0.3 | BLOQUÉE / NO-GO | H03-1, H03-2 et H03-3 attendus |
| Revalidation historique 1.4.2 | BLOQUÉE / NO-GO | H14-1 à H14-10 attendus pour tout le diff hérité |

La PR reste ouverte, en brouillon et non fusionnée. Aucun lot n’est acquis par ces seuls documents. Aucun Go si un critère obligatoire manque ou échoue. L’agent interprète les observations et signe la décision ; il ne demande pas à l’humain de choisir Go/No-Go. Aucune dette acceptée à ce stade.

Application de la matrice : obligatoire BLOCKED → BLOQUÉE ; sinon obligatoire FAIL → À CORRIGER ; sinon tous PASS et preuves complètes → VALIDÉE. La revue indépendante éventuellement exigée par GitHub reste distincte. Après Go : dernier SHA vérifié, CI, squash lié à la tête approuvée, merged=true, squash sur origin/main, CI/main et smoke. Rien de cela n’est revendiqué avant exécution.

## Reliquats identifiés, hors 0.3

Les aperçus de montage, de révision, de management et de publication restent des maquettes. Leur implémentation suit les étapes du plan actif (production 2–6, workflow 7, organisations/échanges 8–10, publication F1). Aucun périmètre autonome retrouvé n’est attribué à l’ancien 1.4.3 ; le découpage détaillé reste en 0.5. Aucune clôture de l’ancienne phase 1 ni démarrage de l’étape suivante.
