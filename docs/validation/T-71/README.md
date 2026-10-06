# T-71 / JQ-02 — matrice de preuves

[Décision, budgets et gates](../../measurement/T-71-BUDGETS-ET-GATES.md) ; [spécification AT](https://tickets.soyfki.com/tickets/T-71).

| Critère | Étapes réalisées dans le code/document | Oracle automatique | Preuve requise au SHA final |
|---|---|---|---|
| 1 : B06/B12/B13 exacts, seuils inchangés | Contrat repris de PR12 seul, lots/tickets/jalons explicites, renvois corrigés | S71-01 table indépendante/titres ; mutants identité/banques/croisement refusés ; S71-02 snapshot des 14 cibles/paramètres | sorties contract.test.mjs, test:tooling et suite complète ; diff/provenance source |
| 2 : H-W18 BLOCKED, preuve courante indépendante | D71-01 ; campagnes séparées SHA/build/scope ; historique source lié sans réécriture | S71-03 états/agrégation et preuves incompatibles ; S71-04 historique immuable | qualification-gates.test.mjs ; logs propres au SHA courant, jamais preuve PR12 reprise |
| 3 : écoute JQ-29 et inconnues conservées | Checklist D, aucune question routinière ; gate physique refuse headless | S71-05 sortie/audibilité/5 aspects, M1 final ; S71-06 docs/liens/commandes | tests de contrat de gate et relecture de la checklist ; aucune observation produit revendiquée T-71 |

Commande ciblée créée par ce lot :

    node --test scripts/measurement/contract.test.mjs scripts/measurement/qualification-gates.test.mjs

Les mêmes tests sont inclus dans test:tooling puis validate:all. Ce sont des tests de dispositif, pas une mesure des performances ni une écoute matérielle. test:measurement de PR12 n'est pas repris. Aucun collecteur/générateur/encodeur/script matériel lancé ici.

## Checklist préparatoire JQ-29 (non exécutée)

1. Build Web/Desktop Windows identifié, tests techniques applicables au SHA/build passés et preuves conservées.
2. Vrai EPUB, médias privés/autonomes, placement des trois familles, réglages/undo et réouverture .jacq offline après retrait des sources. .jacko non requis à cet atelier.
3. Observation physique de sortie/audibilité, transitions, boucles, niveaux, spatialisation et décrochages ; matériel réellement disponible, notes/obstacles datés et liés au build.
4. Conditions utiles inconnues recueillies pendant ce premier atelier utile ; ancien questionnaire H-W18 non reposé par routine. Ce qui reste inconnu est explicitement inconnu.
5. H-W18 historique BLOCKED et 0.4 NO_GO restent inchangés ; nouvelle campagne distincte. Aucun PASS matériel à partir d'un test DOM/headless. Métrologie B07 distincte de l'écoute utile.

## Provenance et clôture

Snapshot source contract.mjs PR12 au SHA 0c99b21f2d29d7152f6ad71adcfd6f040e96e5bb ; oracle sémantique depuis plan main 4b183900a4a677c51c1d8150f7459f150c1ad033 et manifeste approuvé task-3 (actions JQ-19/20/31/50). Aucun rapport rempli historique local ajouté ou modifié. Les fichiers de tests utilisent des valeurs artificielles explicitement fixtures.

Rapport final au SHA testé dans test-results/tickets/T-71 : commandes/codes/durées/versions/provenance/build/log hashes, diff et préservation. Rapport/PR draft à publier seulement après autorisation explicite ; revue distincte puis validation humaine AT. Ne pas déclarer développement clôturé avant les obligations de publication de cette étape. Aucun merge agent.
