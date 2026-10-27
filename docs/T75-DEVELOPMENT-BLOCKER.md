# T-75 — tentative de préparation, développement bloqué

Historique du23octobre. La [reprise Web du27octobre](T75-WEB-OFFLINE.md) est indépendante ; elle ne lève pas
le refus de scripts ni ne fournit un host ou installateur Windows.

Base : `main` `4b183900a4a677c51c1d8150f7459f150c1ad033`. Branche isolée T75, sans PR17 implicite.
Le plan AT reste le commentaire `01a169b3-5649-70f7-a881-d4ff0627e3c4`.
Ce document ne vaut ni implémentation du host/cache, ni qualification offline ou renderer.
Les deux critères AT restent faux. T73 reste en validation humaine.

## Action et résultat observés le 23 octobre 2026

Métadonnées lues sur le registre npm officiel : Electron **45.0.0**, MIT, Node >=22.12.0 ;
electron-builder **26.15.3**, MIT, Node >=14.0.0. Node local24.19.0/pnpm11.19.0 satisfont ces minimums.
La version app reste0.0.0. Il s'agit d'une sélection expérimentale interne, pas d'un choix permanent du dépôt.

```text
pnpm add --save-dev --save-exact electron@45.0.0 electron-builder@26.15.3 --store-dir <store local existant>
```

Le gestionnaire a ajouté481 paquets et résolu507 entrées, puis terminé avec **exit1** :
`ERR_PNPM_IGNORED_BUILDS`, script `install` de `electron-winstaller@5.4.0` non approuvé.
Chaîne observée dans le lock : electron-builder → app-builder-lib / electron-builder-squirrel-windows
→ electron-winstaller. Son script `node ./script/select-7z-arch.js` copie des exécutables/DLL7-Zip embarqués.
Lecture statique seulement ; ce script n'a pas été exécuté. Le texte de pnpm demande `approve-builds`.
**Aucun approve-builds, choix allowBuilds, réglage de sécurité ou rejeu du script refusé n'a été effectué.**

L'essai a créé automatiquement un `pnpm-workspace.yaml` avec un choix d'approbation non renseigné.
Ses octets et le diff package/lock ont été copiés dans les preuves ignorées avant restauration des seuls changements
de cette tentative, sur une branche initialement propre. Aucune politique de build n'est laissée dans le dépôt.
Les versions/dépendances antérieures n'ont pas été mises à jour opportunément.

Un contrôle de chemin par `require('electron')` a déclenché de façon inattendue le téléchargement différé du binaire
dans Electron45, puis `fetch failed`. Il ne s'agissait donc pas d'une lecture pure. Aucun `path.txt` ou binaire n'a
été observé ensuite. Pas de suppression/réinstallation ni de relance de ce chargement. L'absence du binaire ne
prouve pas une impossibilité d'Electron ; elle bloque ici les essais d'hôte natif/packaging.

## Diagnostic indépendant livré

`scripts/desktop/inspect.mjs` lit uniquement les métadonnées et la présence des fichiers.
Il **n'importe aucun package**, ne télécharge rien, n'approuve rien et ne lance aucun binaire.
Il reconnaît une politique non renseignée, un package installé mais non déclaré, un binaire absent et une référence
de chemin hostile. Même un fichier exécutable présent ne donne jamais `productReady:true` : ce n'est pas une preuve
d'installation, de fermeture/redémarrage offline ou d'isolation du renderer.

```text
node scripts/desktop/inspect.mjs --help
node scripts/desktop/inspect.mjs --root .
node --test scripts/desktop/inspect.test.mjs
```

Le diagnostic retourne2 lorsque des prérequis sont manquants ; cela représente un blocage attendu, pas un test produit
réussi. Les tests indépendants ne chargent jamais les packages synthétiques (leur point d'entrée lève délibérément).
Ils vérifient notamment que le contrôle n'exécute pas le mécanisme de téléchargement rencontré pendant la tentative.

## Preuves et décision encore nécessaire

`test-results/tickets/T-75/dependency-attempt-20261023/` conserve `dependency-attempt.patch`,
`pnpm-workspace.pending.txt`, `select-7z-arch.source.txt`, `observation.json`.
L'observation est la transcription structurée de la sortie de l'outil, explicitement différente d'un log brut ou
d'un rejeu d'installation. Les résultats des tests/contrôles portent leur SHA réel et leur provenance séparément.

L'approbation de scripts de dépendances est hors du mandat « ne pas modifier les réglages de sécurité ».
Décision humaine requise sur cette chaîne d'outillage : fournir un environnement préapprouvé, ou faire examiner
et autoriser une autre solution de packaging. Aucun changement de politique, credential ou budget pour débloquer.
La publication de ce nouveau lot nécessite aussi une autorisation applicable, distincte de T73.
Ni le Web préparé, ni un binaire Windows distribué/installé, ni la frontière IPC ne sont encore implémentés ou prouvés.

Références primaires consultées : [sécurité Electron](https://www.electronjs.org/docs/latest/tutorial/security),
[protocole local](https://www.electronjs.org/docs/latest/api/protocol),
[automation Electron Playwright](https://playwright.dev/docs/api/class-electron),
[registre Electron](https://registry.npmjs.org/electron/latest),
[registre electron-builder](https://registry.npmjs.org/electron-builder/latest).
Les versions notées ci-dessus sont celles effectivement lues ce jour, pas une promesse de version future.
