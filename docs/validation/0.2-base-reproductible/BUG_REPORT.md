# Rapport de bug — récupération de la référence anglaise empêchée

## Identification

- Titre : l'URL Gutenberg anglaise retourne des octets différents du manifeste canonique.
- Contrôles : REF-01, CI-01 ; impact indirect sur REF-02/TOOL-01 dans une machine vierge.
- Sous-étape : 0.2 — Reproduire la base.
- Branche : codex/etape-0-2-base-reproductible.
- Base de développement : d7ddeea09f3fc60146454b935192cb3d1c91ee54 ; constat initial pendant modifications 0.2 non commitées, distinct de la campagne finale.
- SHA final, exécution de reproduction et PR : consignés dans le rapport associé à la PR.
- Auteur : agent Codex, 11 septembre 2026.

## Contexte et environnement

Windows 10 build 19045 x64, Node 24.19.0, pnpm 11.19.0. Clone neuf depuis main, corpus décrit par le manifeste canonique inchangé. Aucun fichier de EPUB tests/ utilisé. Le téléchargement est une acquisition de fixture publique, pas un import applicatif.

## Reproduction historique, avant correction

1. Dans une copie isolée du checkout, conserver le manifeste et les scripts mais partir sans reference-data/files.
2. Exécuter pnpm prepare:references, ou node scripts/prepare-references.mjs --root suivi du chemin absolu de cette copie.
3. Lire le code de sortie et le diagnostic de epubs/en-the-adventures-of-sherlock-holmes.epub.
4. Vérifier que le manifeste est intact et qu'aucun fichier anglais divergent n'a été installé.

## Résultats

- Attendu : six acquisitions identiques au manifeste, code 0.
- URL : https://www.gutenberg.org/ebooks/1661.epub3.images.
- Attendu pour l'anglais : **379445 octets**, SHA-256 **e837276635b63b808453ed833f0e34a0ffca95bc67603f43eb8ae3302713dd9a**.
- Observé localement : **379177 octets**, SHA-256 **a5ec3affcc10d1b610545f7dbd650258989db4b892f9205b8787b802376a73a5**.
- Cinq autres téléchargements conformes. Code de préparation **1**, fichier divergent refusé.
- Fréquence finale et résultats CI : rapport de PR et journaux associés.
- Gravité : bloquante pour la qualification reproductible ; **BLOCKED / NO-GO**. Ce refus est le comportement correct du garde-fou, pas une panne applicative.

## Éléments associés et reprise

La copie anglaise du **reference-data/files** du checkout initial a la taille et l'empreinte canoniques. Elle a été vérifiée puis copiée vers le clone pour exécuter les contrôles locaux. Elle n'est ni un EPUB personnel ni une preuve de téléchargement reproductible.

Reprise nécessaire : rendre les **mêmes octets canoniques** accessibles de façon reproductible à un runner neuf, avec provenance et licences conservées, puis rejouer acquisition vierge et campagne locale/CI au SHA courant. Toute nouvelle source archive ou infrastructure de distribution doit être documentée explicitement ; aucune substitution ni réécriture des empreintes pour passer la gate. Les binaires restent hors Git. Une simple réexécution avec le cache local ne lève pas l'obstacle.

Preuves historiques : prepare-initial.log, canonical-en-recovery.json et reproduction au SHA **ae7b9b05b4a9252c598cea2e3e3b1d3a6565cd94** ; [CI initiale en échec](https://github.com/Soyfki/Jaquette/actions/runs/34614174815). Les mêmes 379177 octets divergents y ont été refusés. Cet échec n'est pas requalifié en succès rétroactivement.

## Correction de l'acquisition

Le 11 septembre 2026, à la demande de correction de la CI, la seule copie anglaise canonique a été publiée à l'identique dans une [Release dédiée aux fixtures](../../../reference-data/ARCHIVE.md). Le contrôle préalable porte sur les 379445 octets et SHA e8372766… attendus, les crédits, l'en-tête, la licence complète embarquée et les conditions de redistribution. Les binaires restent hors de l'historique Git ; cette Release n'est pas une version de l'application.

Le mapping d'acquisition choisit explicitement cette archive pour l'anglais et conserve les cinq autres URL. La source d'origine reste dans le manifeste inchangé et dans les logs. Tout échec de l'archive reste non nul, sans fallback à Gutenberg ; aucun fichier local invalide n'est remplacé. Les tests de régression couvrent ces comportements dans des processus isolés. Le téléchargement anonyme réel des six fichiers a réussi pendant le développement ; seul le rapport final de PR au SHA courant atteste la qualification locale/CI et la clôture de l'incident.

## Incident initial distinct — dépendances transférées

Au SHA **5cabbb016d3ce5480b165512c1aa7814b8367802**, dans le checkout initial, pnpm typecheck retourne **1** : MODULE_NOT_FOUND sur node_modules/typescript/bin/tsc. Le lanceur transféré contient des chemins C:/Users/cleme. Le fichier .modules.yaml porte l'ancien environnement. Un clone neuf et pnpm 11.19.0 install --frozen-lockfile rétablissent TypeScript 5.9.3 sans upgrade ; le dossier initial est conservé.

## Confidentialité des pièces jointes

- [x] Les diagnostics partagés sont relus ; ils exposent seulement métadonnées techniques et ressources publiques du manifeste.
- [x] Aucun secret, jeton ou mot de passe dans les pièces partagées.
- [x] Aucun EPUB personnel, manuscrit privé ou contenu binaire de référence joint au dépôt ou aux artefacts CI.
- [x] Les empreintes de préservation des fichiers utilisateur restent dans le dossier local de preuve.
