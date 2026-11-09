# Checklist de validation — modèle

Copier ce document pour chaque livraison. Remplacer tous les champs entre chevrons et supprimer les lignes d'exemple inutiles avant de rendre le rapport.

## 1. Livraison testée

- Sous-étape : `<numéro et nom>`
- Périmètre annoncé : `<livrables inclus et exclusions>`
- Critères d'acceptation : `<références précises>`
- Branche : `<nom de branche>`
- Commit testé : `<SHA complet>`
- Pull request : `<URL ou numéro>`
- Développeur : `<agent, nom ou identifiant>`
- Validateur utilisateur : `<humain pour les observations obligatoires, ou aucun essai humain requis selon le périmètre>`
- Responsable de validation : `<agent développeur cumulant ce rôle selon le mandat de septembre>`
- Date et heure de début : `<date, heure et fuseau>`

## 2. Environnement testé

- Système et version : `<valeur>`
- Navigateur ou application et version : `<valeur ou non applicable>`
- Matériel pertinent : `<valeur ou non applicable>`
- Données de test et version/empreinte : `<valeur>`
- Configuration pertinente, sans secret : `<valeur>`
- Préconditions vérifiées : `<liste>`

## 3. Contrôles automatiques ou techniques — développeur

Attribuer `PASS`, `FAIL` ou `BLOCKED` selon le [protocole](README.md). Les commandes doivent être copiables ; leurs sorties peuvent être résumées si la preuve complète est liée.

| ID | Obligatoire | Commande ou procédure | Résultat attendu | Résultat observé | Statut | Preuve |
|---|---|---|---|---|---|---|
| TECH-01 | Oui | `<commande>` | `<résultat observable>` | `<observation>` | `<PASS/FAIL/BLOCKED>` | `<lien, sortie ou référence>` |

## 4. Contrôles manuels — utilisateur

Exécuter exactement les étapes annoncées. En cas de différence, ne pas corriger le résultat attendu après coup.

| ID | Obligatoire | Préconditions et étapes | Résultat attendu | Résultat observé | Statut | Bug/preuve |
|---|---|---|---|---|---|---|
| MAN-01 | Oui | `<étapes numérotées>` | `<résultat observable>` | `<observation>` | `<PASS/FAIL/BLOCKED>` | `<rapport ou preuve>` |

## 5. Tests de régression

Inclure les comportements antérieurement validés susceptibles d'être touchés par la livraison.

| ID | Obligatoire | Fonction ou invariant protégé | Procédure | Résultat attendu | Résultat observé | Statut | Preuve |
|---|---|---|---|---|---|---|---|
| REG-01 | Oui | `<comportement>` | `<procédure>` | `<résultat>` | `<observation>` | `<PASS/FAIL/BLOCKED>` | `<référence>` |

## 6. Problèmes connus et dettes proposées

Une dette proposée ne vaut pas acceptation. Le responsable de validation doit vérifier toutes les conditions du protocole.

| Référence | Description et impact | Contrôle obligatoire touché ? | Sécurité, données, régression bloquante ou invariant touché ? | Contournement | Propriétaire | Échéance/cible | Décision |
|---|---|---|---|---|---|---|---|
| `<bug/dette>` | `<description>` | `<Oui/Non>` | `<Oui/Non et détail>` | `<valeur>` | `<personne>` | `<date/sous-étape>` | `<refusée/acceptée>` |

## 7. Synthèse

- Contrôles obligatoires : `<nombre PASS>` `PASS`, `<nombre FAIL>` `FAIL`, `<nombre BLOCKED>` `BLOCKED`.
- Contrôles non obligatoires : `<nombre PASS>` `PASS`, `<nombre FAIL>` `FAIL`, `<nombre BLOCKED>` `BLOCKED`.
- Régressions bloquantes : `<aucune ou références>`
- Bugs ouverts : `<aucun ou références>`
- Dettes explicitement acceptées : `<aucune ou références>`
- Vérifications manuelles encore attendues : `<aucune ou liste>`
- Date et heure de fin : `<date, heure et fuseau>`
- Conclusion proposée : `<VALIDÉE/À CORRIGER/BLOQUÉE/VALIDÉE AVEC DETTE>`
- Décision : `<GO/NO-GO, appliqué par le responsable, pas choisi par l’utilisateur>`
- Justification : `<application concise de la matrice de décision>`
- Signature du responsable de validation : `<nom, date>`

La décision officielle doit être consignée dans le [rapport final](VALIDATION_REPORT.md).
