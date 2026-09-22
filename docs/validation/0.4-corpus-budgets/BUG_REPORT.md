# Rapport de défauts et obstacles — 0.4

Adaptation du [modèle](../BUG_REPORT.md). Les résultats finaux associés à un SHA figurent dans la PR.

## B04-MAC — Relevés natifs inaccessibles

- Contrôles : T05, H-MI, H-M1 ; historiquement BLOCKED le 18 septembre, reportés hors Go 0.4 par [D04-03](../../measurement/DECISIONS.md) le 22 septembre, sans PASS.
- Contexte : session sur Windows ; l'utilisateur confirme le 22 septembre ne pas posséder de Mac et autorise le report à la qualification macOS.
- Attendu : commandes exécutées sur les vrais postes Intel et M1, valeurs et conditions observées.
- Observation : aucune mesure Mac disponible ; aucun runner cloud ou WebKit ne peut la remplacer.
- Reprise : lancer le paquet livré, transmettre les résultats et le formulaire. Aucune installation ou manipulation Git requise.
- Impact actuel : ne bloque plus 0.4 ; reste un prérequis obligatoire de la qualification macOS. Aucune valeur supposée ni cible supprimée. H-W18 reste le blocage matériel de 0.4, l'utilisateur ayant déclaré les conditions inconnues.

Les pièces à partager sont limitées aux inventaires à champs autorisés et aux données synthétiques. Aucun manuscrit, secret ou fichier personnel n'est inclus.

## B04-LINT — Point d'entrée JXA

SHA `944157fd83e0c886b5605c8ceff0b74bcc8f8808`, `pnpm lint` : FAIL, quatre erreurs de variables inutilisées dans le collecteur macOS. La règle TypeScript héritée vérifie également le JavaScript et n'utilisait pas l'exception de la règle ESLint standard. Correction : exception ciblée sur le seul point d'entrée JXA `run` et les paramètres de catch ; aucune désactivation globale. Rejouer lint au SHA corrigé.

## B04-CIM — Collecte Windows dans le sandbox

Même SHA : premier lancement du collecteur sous PowerShell 5.1, CIM/WMI empêché ; JSON partiel correctement marqué BLOCKED, champs null et liste d'obstacles, jamais valeurs inventées. Reprise autorisée en lecture seule hors sandbox sur le même poste, sans changement du collecteur. L'obstacle initial reste conservé dans les preuves locales.

## B04-SMOKE — Assertion et répétition du dispositif

SHA `e944ec2726cd37b5a340fa6856407c6bd2dcc292`, `pnpm measure:prototype` : FAIL après dix navigations, l'assertion comparait textContent à un rôle alors que le bouton actif contient aussi le texte « Actif » masqué à l'accessibilité. Correction : locator par nom accessible et assertion aria-pressed, sans changer le prototype. La revue ciblée a aussi identifié le dossier de sortie fixe, empêchant une seconde invocation : chaque campagne dispose désormais d'un sous-dossier SHA/horodatage distinct, sans écrasement.

## Revue ciblée des collecteurs

Revue en lecture seule par un sous-agent : ajout des détails de version Chromium lorsque disponibles (UA réduite insuffisante), refus des sorties macOS vides/malformées, harmonisation de la conclusion du plan. Ce contrôle statique ne remplace pas l'exécution sur les deux Mac, toujours BLOCKED.
