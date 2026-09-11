# Checklist de validation — 0.1 Harmoniser les sources

Adaptée du [modèle](../CHECKLIST.md), préparée avant les tests le 11 septembre 2026.

## 1. Livraison testée

- Périmètre : documents Markdown uniquement ; plan complet reçu, cahier, AGENTS, index et protocoles.
- Branche : codex/etape-0-1-harmonisation ; base : 8a9e9a7ed692f26e3969641a4584669bfa1d93a9.
- Commit testé et résultats : rapport final de la [PR 10](https://github.com/Soyfki/Jaquette/pull/10), avec SHA complet sur chaque résultat.
- Développeur et responsable : agent Codex, cumul explicitement autorisé.
- Validateur utilisateur : aucun essai humain supplémentaire obligatoire pour 0.1 ; décisions produit déjà données.

## 2. Environnement et corpus

Windows du poste hôte, PowerShell, Node v24.19.0 ; clone isolé neuf sans node_modules transféré. Relever la version OS dans la preuve d’exécution. Corpus : tous les Markdown suivis et ajoutés du lot, ancien plan à la base, snapshot complet du nouveau plan et manifestes locaux de préservation. Aucun contenu EPUB n’est importé ni transmis.

## 3. Contrôles techniques obligatoires

Les résultats PASS/FAIL/BLOCKED, observations, dates et SHA sont consignés dans la PR ; les attentes sont fixées ci-dessous avant exécution.

| ID | Commande / procédure | Attendu |
|---|---|---|
| DOC-01 | Lecture entière du plan, croisée avec Cahier, AGENTS, README, docs/README, Versions, Offline et protocoles ; table de correspondance du dossier | Toutes décisions §1 répercutées, aucune contradiction active, invariants/DA conservés |
| DOC-02 | Recherche rg --no-ignore sur Markdown, motifs V0.x/V1/V2, Chrome, ancien 1.4.3/2.1, prochain, stockage/publication ; lecture de chaque occurrence | Contexte historique/proposition/extension explicite, pas de remplacement aveugle ; versions nommées conservées |
| DOC-03 | node scripts/check-markdown-links.mjs | Aucun lien relatif manquant |
| DOC-04 | node scripts/check-secrets.mjs | Aucun motif courant détecté ; contrôle limité, pas certification de sécurité |
| DOC-05 | git diff --check 8a9e9a7ed692f26e3969641a4584669bfa1d93a9 HEAD | Diff entier du lot sans erreur d’espace |
| DOC-06 | git diff --name-only depuis la base, git status, lecture package.json, comparaison des manifestes/empreintes du checkout initial | Markdown seuls, version 0.0.0, aucun fichier applicatif/dépendance changé ; EPUB tests/ inchangé et hors index, plan/prompts utilisateur préservés |
| DOC-07 | Comparer snapshot du plan, ancien plan et protocole PR 9 ; lire état PR 9 et main | Plan intégral transmis, modifications justifiées ; 1.4.2 non acquis, PR 9 inchangée, aucun périmètre 1.4.3 inventé |
| DOC-08 | Lire configuration CI suivie, branche main/rulesets et contrôles GitHub du SHA ; vérifier base actuelle avant fusion | Protections respectées ; CI seulement si applicable pour 0.1 ; aucun changement de base non examiné |

## 4. Contrôles humains

Aucun essai humain supplémentaire requis par le mandat de 0.1. Ne pas enregistrer un faux PASS humain. La revalidation humaine de l’ancien 1.4.2 reste distincte et non acquise.

## 5. Régressions

DOC-01 et DOC-06 protègent invariants et périmètre. Pas d’installation, de réparation des dépendances, d’essai navigateur ou de test applicatif hors diff : ces travaux relèvent de 0.2. Aucune capacité Web/Electron/IA réelle n’est qualifiée par cette campagne documentaire.

## 6. Problèmes et dettes

[Incident d’environnement](BUG_REPORT.md) contourné par clone neuf ; pas de dette applicative créée ou acceptée en 0.1. Toute anomalie documentaire détectée doit être corrigée puis contrôlée à nouveau sur le dernier SHA.

## 7. Synthèse et après fusion

Le [rapport](VALIDATION_REPORT.md) renvoie à la décision finale de la PR : huit contrôles obligatoires, aucun test humain additionnel. BLOCKED → BLOQUÉE/NO-GO ; sinon FAIL → À CORRIGER/NO-GO ; sinon preuves complètes et aucun défaut bloquant → VALIDÉE/GO.

Après squash : lire merged=true et SHA GitHub, vérifier sa présence sur origin/main, comparer l’arbre au SHA approuvé, refaire liens/secrets/diff et vérifier les contrôles disponibles sur main. Consigner le résultat avec le SHA de squash, sans nouveau commit pour inscrire son propre SHA.
