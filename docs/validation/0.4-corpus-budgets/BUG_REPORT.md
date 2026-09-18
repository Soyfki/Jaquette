# Rapport de défauts et obstacles — 0.4

Adaptation du [modèle](../BUG_REPORT.md). Les résultats finaux associés à un SHA figurent dans la PR.

## B04-MAC — Relevés natifs inaccessibles

- Contrôles : T05, H-MI, H-M1 ; obligatoire, BLOCKED.
- Contexte : session sur Windows, aucun accès distant aux deux Mac fourni.
- Attendu : commandes exécutées sur les vrais postes Intel et M1, valeurs et conditions observées.
- Observation : aucune mesure Mac disponible ; aucun runner cloud ou WebKit ne peut la remplacer.
- Reprise : lancer le paquet livré, transmettre les résultats et le formulaire. Aucune installation ou manipulation Git requise.
- Impact : NO-GO de 0.4 ; les travaux indépendants continuent. Aucune valeur supposée, aucune dette admissible.

Les pièces à partager sont limitées aux inventaires à champs autorisés et aux données synthétiques. Aucun manuscrit, secret ou fichier personnel n'est inclus.

## B04-LINT — Point d'entrée JXA

SHA `944157fd83e0c886b5605c8ceff0b74bcc8f8808`, `pnpm lint` : FAIL, quatre erreurs de variables inutilisées dans le collecteur macOS. La règle TypeScript héritée vérifie également le JavaScript et n'utilisait pas l'exception de la règle ESLint standard. Correction : exception ciblée sur le seul point d'entrée JXA `run` et les paramètres de catch ; aucune désactivation globale. Rejouer lint au SHA corrigé.

## B04-CIM — Collecte Windows dans le sandbox

Même SHA : premier lancement du collecteur sous PowerShell 5.1, CIM/WMI empêché ; JSON partiel correctement marqué BLOCKED, champs null et liste d'obstacles, jamais valeurs inventées. Reprise autorisée en lecture seule hors sandbox sur le même poste, sans changement du collecteur. L'obstacle initial reste conservé dans les preuves locales.
