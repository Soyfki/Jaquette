# Checklist de validation — 0.3 et revalidation historique 1.4.2

Adaptation du [modèle](../CHECKLIST.md), critères fixés avant les tests le 18 septembre 2026.

## Livraison et environnement

Branche `codex/phase-1-4-2-team-lead-admin-variants`, [PR 9](https://github.com/Soyfki/Jaquette/pull/9). Développeur et responsable : agent Codex. Validateur humain : utilisateur de cette tâche. Deux conclusions distinctes sur le même SHA de recette ; aucun Go sans tous les retours humains.

Base main intégrée : `67179306435a5772007732b4441350f70adcc97d`. Les SHA réellement exécutés et leurs journaux sont consignés dans la PR et dans les preuves locales `.work-0-3/evidence/`, hors dépôt de travail. Le checkout initial, son plan modifié et `EPUB tests/` restent intacts et hors index.

Windows, Node 24.19.0, pnpm 11.19.0, Chrome installé (version relevée dans le rapport d’exécution), viewports 1440 × 1000 et 768 × 1024. Installation depuis le lockfile ; six fichiers canoniques du manifeste 0.2. Aucun import réel de ces fichiers dans le prototype : les tests d’interface utilisent ses données fictives. Version 0.0.0, aucun ajout de dépendance ni de capacité métier réelle.

## Contrôles techniques obligatoires

| ID | Commande / procédure | Résultat attendu | Preuve |
|---|---|---|---|
| T01 | Installation frozen-lockfile | Dépendances verrouillées, lockfile intact | install.log |
| T02 | Reproduction avant correction | Incohérence soumis, focus absent et warning React reproduits | tests de régression rouges, BUG_REPORT.md |
| T03 | Tests de cohérence | Accueil/Chef/Admin : 10/10, 30/30 = 10 × 3, finale En attente Chef ; Réviseur distinct 2/3 bloqué ; historique lisible | Vitest + E2E |
| T04 | Focus Fondations | Clavier, accès direct, précédent/suivant : titre focalisé, un h1, URL/titre corrects, SPA conservée | Vitest + Chrome |
| T05 | Simulation StrictMode, horloge contrôlée | Trois fins et relances, dernier mot, inactivité, aucune minuterie restante ; pause/reprise, vitesses, chapitre, fermeture, rôle et démontage nettoyés | Vitest + Chrome |
| T06 | Surveillance console/page | Toute erreur ou warning échoue ; interceptions restaurées | Hooks des tests + journaux |
| T07 | Isolation des quatre rôles | Arbres exclusifs, outils interdits absents du DOM, préparation absente avant Validé | Tests composants et Chrome hérités + régression |
| T08 | pnpm validate:diagnostic puis pnpm validate:all | Typecheck, lint, unitaires, build, liens, secrets, références, outillage, E2E : code 0 | summary.json + logs |
| T09 | Chrome aux deux formats | Campagne complète, six captures historiques relues, focus visible et aucun débordement | rapport E2E + captures |
| T10 | git diff --check ; empreintes | Aucun espace erroné ; corpus, EPUB tests et fichiers utilisateur préservés | diff et preservation.json |
| T11 | CI PR au dernier SHA | Tous contrôles obligatoires à success, artefact consultable | GitHub Actions |
| T12 | Reprise Admin après retour humain sur a93e5464b427ee575db06bb41fa39f46db09502c | Bureau : deux rangées de trois tuiles, bords alignés et espacements uniformes ; réduit : une colonne dans l’ordre Membres, Équipes, Invitations, Projets, Permissions, Audit ; aucun contenu perdu | Mesures Chrome et captures au nouveau SHA ; H14-6/H14-10 à reprendre |
| T13 | Reprise des pastilles et du pseudo-logo J | Cinq pastilles de la palette et les deux usages du J (en-tête et Connexion) : largeur égale à la hauteur, quatre rayons à 50 %, aucun écrasement aux deux formats | Mesures Chrome et relecture des captures ; observation complémentaire H03-4 |

## Essais humains obligatoires

H03-1 : comprendre les prérequis complets et les trois axes, depuis Accueil puis Chef.
H03-2 : titre Fondations lisible et focus visible au clavier, précédent/suivant.
H03-3 : simulation qui finit puis repart, lecture fluide et compréhensible.
H03-4 (retour complémentaire) : pastilles de la palette et pseudo-logo J parfaitement ronds.
H14-1 à H14-10 : les dix points de la checklist manuelle du [protocole 1.4.2](../1.4.2-team-lead-admin-variants.md), repris dans le [formulaire](HUMAN_REVIEW.md). Les inspections DOM/timers sont réalisées par l’agent ; l’humain observe le résultat.

## Régressions et conclusion

Les tests hérités de 1.4.1/1.4.2, le correctif de focus de recherche 0.2, les scripts et la CI 0.2 restent applicables. Aucun résultat historique ne prouve le nouveau SHA. Toute modification de code/configuration/corpus entraîne une nouvelle exécution des contrôles concernés.

Les résultats PASS/FAIL/BLOCKED, observations et preuves sont publiés à SHA fixe dans la PR. Après le premier retour humain, onze PASS fonctionnels sont conservés ; H14-6 et H14-10 sont à réobserver après le correctif B03-6, avec H03-4 pour les cercles signalés ensuite (B03-7). **0.3 reste BLOQUÉE / NO-GO ; 1.4.2 BLOQUÉE / NO-GO** jusqu’à ces retours. Aucune dette admissible ne dispense d’un critère obligatoire. Aucune acquisition de l’ancienne 1.4/phase 1/1.4.3 ni démarrage de 0.4.
