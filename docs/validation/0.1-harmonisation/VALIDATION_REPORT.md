# Rapport de validation — 0.1 Harmoniser les sources

Adapté du [modèle de rapport](../VALIDATION_REPORT.md). Le rapport final lié au SHA complet réellement testé est publié dans la PR de la branche codex/etape-0-1-harmonisation. Ce fichier fixe son périmètre et ses références sans provoquer un commit pour inscrire son propre SHA.

## Livraison

Documents de cadrage harmonisés avec le plan complet du 11 septembre 2026. Aucune dépendance, aucun fichier applicatif ni test applicatif ajouté ou modifié. La [table de correspondance](README.md) relie chaque décision aux textes corrigés. La version reste 0.0.0.

## Environnement et participants

Windows/PowerShell, Node v24.19.0, clone isolé depuis main ; détails OS et date dans les preuves d’exécution. Agent Codex : développeur et responsable de validation. Utilisateur : décisions produit déjà fournies, aucun essai humain supplémentaire requis pour ce lot.

## Contrôles effectués et preuve canonique

Les huit contrôles DOC-01 à DOC-08 de la [checklist](CHECKLIST.md) sont renseignés dans la PR avec commande/scénario, observation, PASS/FAIL/BLOCKED, date et SHA complet. Les sorties, inventaire des occurrences anciennes et manifestes restent dans l’artefact local associé ; leur synthèse partageable accompagne le rapport de PR.

Aucune preuve historique n’est comptée comme résultat actuel. Les campagnes Chrome historiques restent intactes et ne qualifient pas le lancement multi-plateforme.

## Contrôles humains et régressions

Aucun test humain nouveau pour 0.1 ; ne pas confondre décisions de cadrage fournies et nouvelle recette utilisateur. L’ancien 1.4.2 reste non acquis avant sa revalidation humaine. Les invariants et le périmètre sont revus par DOC-01/DOC-06 ; aucun test applicatif hors diff requis ici.

## Simulations de décision

- Obligatoires PASS, preuves complètes, aucune régression/dette : VALIDÉE et GO.
- Obligatoire FAIL sans BLOCKED : À CORRIGER et NO-GO.
- Obligatoire BLOCKED ou observation humaine requise manquante : BLOQUÉE et NO-GO.
- Dette : uniquement si strictement admissible selon le protocole, motivée et signée ; jamais pour contourner un obligatoire.

## État restant et conclusion

La décision signée par l’agent responsable, le nombre de PASS/FAIL/BLOCKED, le SHA approuvé, l’état GitHub de la PR et le SHA de squash sont consignés dans la PR après exécution, puis complétés par les vérifications après fusion. Une réponse GitHub incertaine impose une lecture d’état avant toute nouvelle tentative.

L’[incident de checkout](BUG_REPORT.md) est contourné par clone neuf ; aucune réparation applicative ne relève de 0.1. La CI est requise seulement si une configuration/protection existe déjà ; 0.2 créera la CI minimale selon le plan.

Après Go de 0.1, prochaine action : **0.2**, sans exécuter cette étape ici. Aucun acquis fictif de 1.4.2 ni clôture rétroactive de l’ancienne phase 1.
