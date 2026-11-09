# Rapport de validation — 0.2

## Livraison

Base reproductible de Jaquette : installation propre sans upgrade, runtime précis, intégrité stricte, acquisition vérifiée, commande complète et CI minimale Chrome.

Branche : codex/etape-0-2-base-reproductible. Base main **d7ddeea09f3fc60146454b935192cb3d1c91ee54**. Le **SHA final réellement testé**, les commandes, résultats et liens CI sont consignés dans la PR de cette branche et ses artefacts, afin de ne pas créer un commit pour inscrire son propre SHA. Les essais de développement avec modifications non commitées sont séparés des preuves de qualification.

Aucune dépendance ajoutée, aucun lockfile ou manifeste réécrit, version 0.0.0. Aucun code applicatif ni variante de PR 9 repris. Le seul changement sous src/ synchronise le test de recherche avec le focus initial existant et vérifie les valeurs saisies, sans retirer ses assertions. Les nouveaux tests concernent l'outillage de qualification ; le scénario E2E clavier reçoit les mêmes assertions console/page que les autres scénarios.

## Environnement et participants

Windows 10 build 19045 x64, Node 24.19.0, pnpm 11.19.0, Chrome 152.0.7977.84. CI Ubuntu 24.04 x64 avec Node/pnpm fixés, Chrome préparé et version effective relevée. Développeur et responsable de validation : agent Codex. Aucun essai humain requis. Campagne du 11 septembre 2026 ; horodatages exacts dans les artefacts.

## Contrôles effectués

La [checklist](CHECKLIST.md) fixe 14 contrôles obligatoires avant exécution. Chaque résultat final de PR cite le SHA complet, la commande/scénario, le résultat observé, le statut PASS/FAIL/BLOCKED et sa preuve. Le diagnostic conserve chaque contrôle même si un précédent échoue. Aucune assertion supprimée ni test ignoré.

Le [blocage initial de récupération](BUG_REPORT.md) est conservé : cinq ressources conformes, anglais différent à son URL. La correction utilise une archive explicite des mêmes octets canoniques, hors Git ; sa provenance et ses conditions sont documentées. La nouvelle qualification doit télécharger les six ressources depuis zéro et vérifier la CI au SHA courant.

### Contrôles manuels

Aucun essai humain requis pour 0.2, aucune observation simulée. Le lot 1.4.2 reste non acquis et sa revalidation humaine appartient à la future campagne 0.3.

### Régressions

La couverture réellement exécutée de main est comptée dans la PR ; les nombres historiques de PR 9 ne servent pas de critère. Les défauts annoncés pour 0.3 restent dans ce lot futur, notamment l'avertissement React de fin de simulation reproduit par un contrôle diagnostique détaillé dans le [rapport de bug](BUG_REPORT.md). Les E2E contrôlent le prototype Vite dev, pas un build distribué ni la matrice Firefox/Safari/Electron.

## Simulations de décision

- Tous obligatoires PASS avec preuves : VALIDÉE / GO.
- Au moins un obligatoire FAIL et aucun BLOCKED : À CORRIGER / NO-GO.
- Au moins un obligatoire BLOCKED : BLOQUÉE / NO-GO, même si les autres contrôles passent.

## Résolution et preuves

La récupération des six octets canoniques est rétablie par l'archive anglaise explicite et vérifiée. Le test de recherche attend la fin du focus initial avant la saisie. La campagne complète comporte 43 unitaires/composants, 28 tests d'outillage et 18 E2E Chrome, sans skip ni retry. Les codes séparés, acquisitions vierges, installations et preuves de CI figurent dans la PR au SHA concerné. Les échecs ae7b9b0 et 0b0cca1 restent historiques ; ils ne sont pas effacés par les nouveaux succès.

## Conclusion

**VALIDÉE — GO**, sans dette ajoutée à ce lot technique. Les 14 contrôles obligatoires et leurs preuves sont consignés dans la [PR 11](https://github.com/Soyfki/Jaquette/pull/11). Aucun essai humain requis pour 0.2. Les défauts explicitement prévus en 0.3 restent dans ce lot futur ; 1.4.2 demeure non acquis. Après cette mise à jour documentaire, la qualification est vérifiée au dernier SHA avant fusion ; ce document ne remplace pas les preuves de commit.

Le statut GitHub, le SHA de squash et les vérifications CI/main et smoke après fusion sont consignés dans la PR, après observation effective. La prochaine sous-étape est 0.3, non commencée ici. Signature : **agent Codex, développeur et responsable de validation**, 11 septembre 2026.
