# Rapport de validation — 0.2

## Livraison

Base reproductible de Jaquette : installation propre sans upgrade, runtime précis, intégrité stricte, acquisition vérifiée, commande complète et CI minimale Chrome.

Branche : codex/etape-0-2-base-reproductible. Base main **d7ddeea09f3fc60146454b935192cb3d1c91ee54**. Le **SHA final réellement testé**, les commandes, résultats et liens CI sont consignés dans la PR de cette branche et ses artefacts, afin de ne pas créer un commit pour inscrire son propre SHA. Les essais de développement avec modifications non commitées sont séparés des preuves de qualification.

Aucune dépendance ajoutée, aucun lockfile ou manifeste réécrit, version 0.0.0. Aucun changement de src/ ni reprise des variantes de PR 9. Les nouveaux tests concernent l'outillage de qualification ; le scénario E2E clavier reçoit les mêmes assertions console/page que les autres scénarios.

## Environnement et participants

Windows 10 build 19045 x64, Node 24.19.0, pnpm 11.19.0, Chrome 152.0.7977.84. CI Ubuntu 24.04 x64 avec Node/pnpm fixés, Chrome préparé et version effective relevée. Développeur et responsable de validation : agent Codex. Aucun essai humain requis. Campagne du 11 septembre 2026 ; horodatages exacts dans les artefacts.

## Contrôles effectués

La [checklist](CHECKLIST.md) fixe 14 contrôles obligatoires avant exécution. Chaque résultat final de PR cite le SHA complet, la commande/scénario, le résultat observé, le statut PASS/FAIL/BLOCKED et sa preuve. Le diagnostic conserve chaque contrôle même si un précédent échoue. Aucune assertion supprimée ni test ignoré.

Le [blocage de récupération](BUG_REPORT.md) est avéré : cinq ressources conformes, anglais différent à son URL. Les contrôles locaux peuvent utiliser la copie canonique anglaise déjà archivée et vérifiée ; la reproductibilité sur runner vierge reste à démontrer.

### Contrôles manuels

Aucun essai humain requis pour 0.2, aucune observation simulée. Le lot 1.4.2 reste non acquis et sa revalidation humaine appartient à la future campagne 0.3.

### Régressions

La couverture réellement exécutée de main est comptée dans la PR ; les nombres historiques de PR 9 ne servent pas de critère. Les défauts annoncés pour 0.3 restent dans ce lot futur. Les E2E contrôlent le prototype Vite dev, pas un build distribué ni la matrice Firefox/Safari/Electron.

## Simulations de décision

- Tous obligatoires PASS avec preuves : VALIDÉE / GO.
- Au moins un obligatoire FAIL et aucun BLOCKED : À CORRIGER / NO-GO.
- Au moins un obligatoire BLOCKED : BLOQUÉE / NO-GO, même si les autres contrôles passent.

## État restant

Référence anglaise à rendre accessible avec les octets canoniques depuis une machine vierge. CI PR obligatoire à exécuter et relire au SHA courant ; toute gate empêchée reste bloquante. Aucune dette acceptée. Les copies locales conformes ne masquent pas l'échec du téléchargement direct.

## Conclusion

**BLOQUÉE — NO-GO**, tant que récupération canonique vierge et CI obligatoire ne passent pas. Le refus de la référence divergente est attendu. Le bilan chiffré, le SHA testé et la lecture effective de GitHub sont publiés dans la PR ; ce document ne prétend pas qu'un commit futur a été testé.

La PR reste en brouillon et non fusionnée ; aucune opération de fusion ou CI/main après fusion n'est revendiquée. Signature : **agent Codex, développeur et responsable de validation**, 11 septembre 2026.
