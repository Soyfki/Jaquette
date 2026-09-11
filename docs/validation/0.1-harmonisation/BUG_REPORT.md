# Rapport d’incident d’environnement — 0.1

Adapté du [modèle de bug](../BUG_REPORT.md). Cet incident concerne la préparation du checkout, pas un défaut applicatif introduit par le lot.

## Identification et contexte

- Auteur : agent Codex ; date : 11 septembre 2026.
- Checkout initial : codex/phase-1-4-2-team-lead-admin-variants.
- HEAD observé : 5cabbb016d3ce5480b165512c1aa7814b8367802, PR 9.
- Opération : actualiser origin avant branche documentaire.
- Environnement : Windows, Git HTTPS, exception safe.directory limitée à la commande.

## Reproduction et observation

git fetch origin dans le checkout initial a d’abord rencontré l’interdiction d’écrire FETCH_HEAD du sandbox. Après autorisation de l’exécution Git, il a échoué sur une référence locale refs/codex/turn-diffs/checkpoints pointant un objet absent : « bad object » puis « did not send all necessary objects ».

Attendu : actualisation des références. Observé : fetch empêché par la base Git locale. Aucun reset, suppression de référence ou réparation de l’historique utilisateur n’a été effectué.

## Résolution et portée

Clone neuf depuis origin, checkout de main à 8a9e9a7ed692f26e3969641a4584669bfa1d93a9, branche codex/etape-0-1-harmonisation. Le clone a réussi et le plan complet a été transféré avec empreinte identique. Le réseau du sandbox a également nécessité l’exécution autorisée du clone.

Ce contournement permet les contrôles documentaires ; il ne prétend pas réparer le checkout initial ni son installation applicative. La reproduction de la base est la sous-étape 0.2. L’état utilisateur reste conservé.

## Preuves et confidentialité

Journaux de préparation et manifestes de préservation dans l’artefact local associé au lot ; résumé dans la PR. Aucune pièce ne contient de jeton, secret ou manuscrit. Aucune dette sur données ou sécurité n’est acceptée pour faire passer un critère obligatoire.
