# Rapport final de validation — modèle

## Livraison

- Sous-étape : `<numéro et nom>`
- Résumé du travail : `<livrables effectivement testés>`
- Branche : `<nom>`
- Commit réellement testé : `<SHA complet>`
- Pull request : `<URL ou numéro>`
- État de la pull request : `<ouverte/fermée, brouillon/prête, fusionnée/non fusionnée>`
- Fichiers ajoutés ou modifiés : `<liste>`
- Dépendances ajoutées : `<aucune ou liste et justification>`
- Tests automatiques ajoutés : `<aucun ou liste>`

## Environnement et participants

- Environnement testé : `<système, navigateur/application, matériel et données de test>`
- Développeur : `<agent, nom ou identifiant>`
- Validateur utilisateur : `<humain pour les observations obligatoires, ou aucun essai humain requis selon le périmètre>`
- Responsable de validation : `<agent développeur cumulant ce rôle selon le mandat de septembre>`
- Période de validation : `<dates, heures et fuseau>`

## Contrôles effectués

### Contrôles techniques

| ID | Commande ou procédure | Résultat | Statut | Preuve |
|---|---|---|---|---|
| `<ID>` | `<commande>` | `<résultat observé>` | `<PASS/FAIL/BLOCKED>` | `<référence>` |

### Contrôles manuels

| ID | Procédure | Résultat | Statut | Preuve |
|---|---|---|---|---|
| `<ID>` | `<procédure>` | `<résultat observé>` | `<PASS/FAIL/BLOCKED>` | `<référence>` |

### Régressions

| ID | Comportement vérifié | Résultat | Statut | Preuve |
|---|---|---|---|---|
| `<ID>` | `<comportement>` | `<résultat observé>` | `<PASS/FAIL/BLOCKED>` | `<référence>` |

## Simulations de décision

- Tous les contrôles obligatoires `PASS` : `<résultat, attendu VALIDÉE>`
- Un contrôle obligatoire `FAIL` : `<résultat, attendu À CORRIGER>`
- Un contrôle obligatoire `BLOCKED` : `<résultat, attendu BLOQUÉE et jamais VALIDÉE>`

## État restant

- Problèmes connus : `<aucun ou références avec impact>`
- Régressions éventuelles : `<aucune ou références>`
- Dettes proposées ou acceptées : `<aucune ou détails, propriétaire, cible et approbation>`
- Décisions prises : `<liste et justification>`
- Vérifications manuelles encore attendues : `<aucune ou liste>`

## Conclusion

- Contrôles obligatoires : `<nombre PASS>` `PASS`, `<nombre FAIL>` `FAIL`, `<nombre BLOCKED>` `BLOCKED`.
- Régression bloquante : `<oui/non et référence>`
- SHA complet identifié : `<oui/non>`
- Conclusion : `<VALIDÉE/À CORRIGER/BLOQUÉE/VALIDÉE AVEC DETTE>`
- Justification selon le protocole : `<règle appliquée>`
- Décision : `<GO/NO-GO appliqué par le responsable selon les preuves ; revue GitHub distincte>`
- Confirmation Git : `<la pull request reste ouverte/fermée, en brouillon/prête et non fusionnée/fusionnée>`
- Signature du responsable de validation : `<nom, date>`
