# Checklist de validation — 0.2

Copie adaptée du [modèle](../CHECKLIST.md), préparée avant tests. Les résultats finaux sont consignés dans la PR avec le SHA complet réellement testé, sans mise à jour autoréférentielle de ce document.

## 1. Livraison testée

- Sous-étape : 0.2 — Reproduire la base, exclusivement.
- Branche : codex/etape-0-2-base-reproductible.
- Base : d7ddeea09f3fc60146454b935192cb3d1c91ee54, main après PR 10.
- Commit final testé et PR : fournis dans le rapport final associé à la PR de cette branche.
- Développeur et responsable de validation : agent Codex.
- Validateur utilisateur : aucun essai humain obligatoire pour ce lot.
- Début de préparation : 11 septembre 2026, Europe/Paris.
- Critères : prompt 0.2, étape 0 du plan canonique et protocole de validation.

## 2. Environnement testé

Windows 10 build 19045 x64, Node 24.19.0, pnpm 11.19.0, Corepack absent, Chrome 152.0.7977.84. CI Ubuntu 24.04 x64, Node/pnpm identiques, Chrome préparé et version relevée. Corpus : six ressources canoniques, tailles et SHA-256 inchangés. Installation depuis zéro node_modules ; aucune dépendance applicative ajoutée.

## 3. Contrôles automatiques ou techniques — tous obligatoires

| ID | Commande ou procédure | Résultat attendu | Preuve attendue |
|---|---|---|---|
| ENV-01 | Installation pnpm 11.19.0 --frozen-lockfile depuis absence de node_modules | Code 0, versions fixées, lockfile inchangé | environnement, installation, empreintes avant/après, SHA |
| REF-01 | pnpm prepare:references depuis dossier vierge | Six téléchargements conformes | URL, tailles, empreintes et code ; blocage décrit si empêché |
| TECH-01 | pnpm typecheck | Code 0 | journal |
| TECH-02 | pnpm lint | Code 0 | journal |
| TECH-03 | pnpm test | Tous tests passent, compte réellement observé | journal Vitest |
| TECH-04 | pnpm build | Build réussi | journal Vite/TypeScript |
| DOC-01 | pnpm check:links | Aucun lien relatif absent | compte Markdown et journal |
| DOC-02 | pnpm check:secrets et lecture explicite du workflow | Aucun motif détecté, YAML/YML inclus | journal, tests synthétiques, revue |
| REF-02 | pnpm check:reference | Six ressources lisibles, tailles et SHA-256 conformes | journal strict |
| TOOL-01 | pnpm test:tooling | Jeu complet valide, défauts isolés rejetés ; corpus source intact | sorties et codes, zéro skip |
| RUN-01 | pnpm validate:diagnostic puis pnpm validate:all | Tous les contrôles exécutés indépendamment ; commande complète code 0 si préconditions satisfaites | summary.json, logs complets |
| E2E-01 | pnpm test:e2e | Tous E2E Chrome passent aux deux viewports ; zéro erreur console/page | rapports JSON/HTML, captures, traces si échec |
| CI-01 | CI PR au SHA courant | Installation propre, références, Chrome, campagne complète, artefacts lisibles | run/jobs/artefacts et résultats réels |
| GIT-01 | git diff --check ; revue diff ; empreintes préservation | Aucun fichier personnel/secret, manifeste et lockfile inchangés, aucune reprise src/ de PR 9 | état Git, diff, relevé local de préservation |

## 4. Contrôles manuels — utilisateur

Aucun essai humain obligatoire. La revue visuelle des captures techniques par l'agent ne remplace pas une recette humaine. La revalidation de 1.4.2 relève de 0.3.

## 5. Tests de régression

TOOL-01 inclut absence, octet altéré, fichier illisible, taille incorrecte, JSON et contenu de manifeste invalides ; tailles contrôlées indépendamment des SHA. Trois injections dans un package temporaire prouvent le code non nul de validate:all : typecheck, vraie référence absente, E2E. E2E-01 conserve les assertions existantes et ajoute la collecte d'erreurs au scénario clavier qui en était dépourvu. Aucun test ignoré ni seuil réduit.

## 6. Problèmes connus et dettes

REF-01 est empêché par le changement de fichier à l'URL anglaise. Voir [BUG_REPORT.md](BUG_REPORT.md). Une copie canonique archivale est utilisable localement, sans rendre la CI vierge reproductible. Dette refusée : contrôle obligatoire. Les trois défauts applicatifs prévus en 0.3 restent hors modifications de ce lot.

## 7. Synthèse

Les nombres PASS/FAIL/BLOCKED définitifs, observations et preuves figurent dans la PR et ses artefacts au SHA final. Tant que REF-01/CI-01 sont empêchés : **BLOQUÉE / NO-GO**, aucune fusion. Signature : agent Codex, responsable de validation, 11 septembre 2026. Voir le [rapport](VALIDATION_REPORT.md).
