# Rapport de validation — 0.4 Fixer corpus et budgets

Adaptation du [modèle](../VALIDATION_REPORT.md). Branche `codex/etape-0-4-corpus-budgets`, base `f273b202d16476e075a827fb85d692b479ba8344`. Le dernier SHA réellement testé et ses preuves seront publiés dans la PR, sans commit circulaire pour inscrire son propre SHA.

## Livraison et participants

Contrat de mesure, générateur de charge, vérificateurs et collecteurs. Version 0.0.0 ; aucune dépendance métier ajoutée. Développeur et responsable de validation : agent Codex ; observations matérielles : utilisateur. Campagne du 18 septembre 2026. La [checklist](CHECKLIST.md) fixe les contrôles avant exécution.

## Résultats

Les résultats techniques doivent être reliés au SHA et à leur commande dans la PR. La présence d'un protocole n'est pas une performance observée. Les budgets du futur produit sont planifiés avec prérequis, hors campagne 0.4.

## Contrôles humains et état restant

H-W18, H-MI et H-M1 : BLOCKED jusqu'au relevé complet et aux observations requises. T05 : BLOCKED sans exécution macOS native. Aucune dette acceptée. Les trois cibles sont conservées.

## Simulations de décision

Tous les obligatoires PASS → VALIDÉE ; un FAIL sans BLOCKED → À CORRIGER ; un BLOCKED → BLOQUÉE et jamais VALIDÉE.

## Conclusion

**BLOQUÉE / NO-GO** : relevés et observations matériels obligatoires manquants. PR à conserver en brouillon et non fusionnée. 0.4 non acquise ; 0.5 non commencée. L'ancien 1.4.2 reste acquis depuis 0.3, sans clôture de l'ancienne phase 1.

Signature : agent Codex, développeur et responsable de validation, 18 septembre 2026. Le Go reste conditionné aux résultats complets du dernier SHA ; l'utilisateur transmet les observations, il n'a pas à choisir la décision.
