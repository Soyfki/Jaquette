# Rapport final de validation — modèle

## Livraison

- Ticket et étape AT : `<T-n, colonne courante et mandat>`
- Sous-étape/jalon : `<JQ-n / A–H>`
- Résumé du travail : `<livrables effectivement testés>`
- Branche : `<nom>`
- Commit réellement testé : `<SHA complet>`
- Build testé : `<identifiant/empreinte ou non applicable justifié>`
- Provenance : `<exécution locale/CI ; preuve reprise avec justification et SHA d’origine>`
- Pull request : `<URL ou numéro>`
- État de la pull request : `<ouverte/fermée, brouillon/prête, fusionnée/non fusionnée>`
- Fichiers ajoutés ou modifiés : `<liste>`
- Dépendances ajoutées : `<aucune ou liste et justification>`
- Tests automatiques ajoutés : `<aucun ou liste>`

## Environnement et participants

- Environnement testé : `<système, navigateur/application, matériel et données de test>`
- Développeur : `<agent, nom ou identifiant>`
- Validateur utilisateur : `<humain pour les observations obligatoires, ou aucun essai humain requis selon le périmètre>`
- Revue distincte : `<agent/personne, distinct de l’auteur, décision et référence AT>`
- Validation humaine AT : `<requise, décision ou attente et référence>`
- Responsable de conclusion technique : `<nom, sans autorisation de fusion agent>`
- Période de validation : `<dates, heures et fuseau>`

## Contrôles effectués

### Contrôles techniques

| ID | Commande exacte, exit code, début/fin et durée | Résultat | Statut | Preuve |
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
- Conclusion technique : `<GO/NO-GO selon preuves ; distincte de validation humaine AT>`
- Décision humaine AT : `<attendue/validée/refusée, référence datée>`
- Confirmation Git : `<la pull request reste ouverte/fermée, en brouillon/prête et non fusionnée/fusionnée>`
- Signature du responsable de validation : `<nom, date>`

## Traçabilité et limites

Chaque contrôle fournit commande exacte, exit code, début/fin/durée, OS/runtime/pnpm/navigateur, données/empreintes, SHA/build et provenance. Une preuve reprise est explicitement justifiée, jamais présentée comme rejouée. Indiquer checks CI à la tête courante PR et lien des artefacts expurgés. Observation physique requise absente = BLOCKED ; headless ne remplace pas écoute/usage. Campagne produit none conserve validation humaine AT. Aucun agent ne fusionne, ne pousse main ou ne déploie.
