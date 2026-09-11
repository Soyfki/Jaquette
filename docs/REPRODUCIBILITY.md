# Installer et qualifier la base

Le lot 0.2 utilise **Node 24.19.0** (fichier [.node-version](../.node-version)) et **pnpm 11.19.0** (packageManager dans [package.json](../package.json)). Le moteur du dépôt reste Node >=24 ; ce choix précis sert à reproduire la campagne, sans upgrade des dépendances. Corepack est facultatif : lorsqu'il est présent, préfixer les commandes pnpm par `corepack`. Sinon installer pnpm 11.19.0, par exemple `npm install --global pnpm@11.19.0`, et vérifier les versions effectives.

## Installation propre

Partir d'un clone neuf de main ou du SHA à qualifier, avec Git et Chrome disponibles. Ne pas recopier node_modules depuis une autre machine.

```sh
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm prepare:references
pnpm exec playwright install chrome
pnpm validate:diagnostic
pnpm validate:all
git diff --check
```

Sous Linux CI, utiliser `pnpm exec playwright install --with-deps chrome` pour installer aussi les bibliothèques système. La préparation du canal Chrome est explicite ; Chromium seul ne suffit pas. Voir les [instructions officielles Playwright](https://playwright.dev/docs/browsers#install-google-chrome--microsoft-edge).

L'installation ne régénère pas le lockfile. Comparer son SHA-256 avant/après (`Get-FileHash pnpm-lock.yaml -Algorithm SHA256` sous PowerShell ou `sha256sum pnpm-lock.yaml` sous Linux). Aucun cache de dépendances ni de références n'est restauré par la CI minimale ; elle exige l'absence de node_modules avant l'installation.

Pour un checkout existant transféré, préférer un nouveau clone. Si un dossier doit être remplacé, relever et vérifier son chemin absolu à l'intérieur du checkout, puis préserver le dossier existant à un emplacement explicite. Ne jamais lancer de nettoyage récursif global ni supprimer les fichiers personnels.

## Références obligatoires

`pnpm prepare:references` lit exclusivement le [manifeste canonique](../reference-data/manifest.json), récupère ses six URL et vérifie taille et SHA-256 avant toute création. Les fichiers présents sont revérifiés ; un fichier invalide est conservé et signalé, jamais écrasé. La préparation poursuit les autres acquisitions pour donner un diagnostic complet, puis termine avec un code non nul si une ressource manque ou diffère. Les licences, attributions et sources restent dans le manifeste et l'[inventaire](../reference-data/INVENTORY.md). Les binaires restent ignorés sous reference-data/files.

**Blocage observé le 11 septembre 2026 :** l'URL anglaise Gutenberg fournit 379177 octets, SHA-256 a5ec3affcc10d1b610545f7dbd650258989db4b892f9205b8787b802376a73a5. Le manifeste exige 379445 octets, SHA-256 e837276635b63b808453ed833f0e34a0ffca95bc67603f43eb8ae3302713dd9a. Aucun remplacement n'est accepté. Voir le [diagnostic et la reprise](validation/0.2-base-reproductible/BUG_REPORT.md).

Une copie canonique archivée peut servir aux contrôles locaux si son empreinte et sa provenance sont vérifiées, mais elle ne prouve pas la récupération sur une machine vierge. Le lot reste bloqué jusqu'à disponibilité reproductible des octets canoniques pour la CI. Ne pas substituer un fichier de EPUB tests/, ne pas réécrire les attentes et ne pas déclarer le lot acquis sur un simple succès local.

## Campagne et diagnostics

- `pnpm validate:diagnostic` exécute séparément typecheck, lint, unitaires/composants, build, liens, motifs de secrets, intégrité stricte, tests d'outillage et E2E, même après un échec. Il retourne un code non nul si un contrôle échoue.
- `pnpm validate:all` est le point d'entrée complet : `pnpm validate && pnpm test:tooling && pnpm test:e2e`. Il s'arrête au premier échec en propageant le code non nul ; le diagnostic précédent permet de connaître les autres résultats.
- `pnpm test:tooling` utilise le corpus canonique dans des copies temporaires : jeu complet, absence, illisibilité, octet altéré, taille, manifestes invalides. Il vérifie aussi YAML/YML et la propagation d'échec de la vraie chaîne de commandes, avec commandes terminales simulées dans un package temporaire ; le cas référence manquante exécute le vrai vérificateur.
- `pnpm dev` ouvre le serveur local habituel sur http://127.0.0.1:5173 ; routes /accueil, /projet et /fondations. Aucun essai humain n'est requis pour ce lot technique.

Le diagnostic enregistre les **codes de processus** et leurs journaux. Son FAIL d'exécution ne tranche pas à lui seul une cause d'environnement : ressource absente, navigateur indisponible ou réseau empêché doivent être classés **BLOCKED** dans le rapport de campagne, conformément au protocole. Un défaut applicatif réellement observé reste **FAIL** et doit être reproduit, sans skip ni assouplissement du test.

## Preuves et CI

Le [workflow](../.github/workflows/validate.yml) s'exécute sur PR vers main et push main. Il checkout le SHA de tête de PR (pas le merge virtuel) ou le SHA du push ; il fixe Node/pnpm, installe frozen, prépare les références et Chrome, puis exécute diagnostic et campagne complète. Bash avec `pipefail` conserve les échecs des commandes journalisées par tee. Les étapes de diagnostic et d'artefacts restent exécutables après un échec de préparation ; aucun continue-on-error ne transforme la gate en succès.

L'artefact `qualification-<SHA>`, conservé 14 jours, contient test-results et playwright-report : SHA, environnement, versions, installation, empreinte lockfile, téléchargements, résultats par contrôle, rapport E2E JSON/HTML, captures et traces sur échec. Après téléchargement/extraction : `pnpm exec playwright show-report <dossier-playwright-report>`. Voir aussi les [instructions officielles des rapports CI](https://playwright.dev/docs/ci-intro#viewing-the-html-report). Lire les logs avant partage ; aucun contenu personnel ou secret ne doit être ajouté aux fixtures ou artefacts.

Le scanner de secrets couvre désormais .yaml/.yml, donc le workflow. Il recherche seulement des motifs courants ; cela ne constitue pas un audit de sécurité complet.

## Limites de qualification

Google Chrome, viewports **1440 × 1000** et **768 × 1024**, `reuseExistingServer=false` et **serveur Vite de développement** sont conservés. Le build est compilé séparément ; il n'est pas le serveur des E2E. Firefox, Safari réel sur Mac, Electron, les performances produit et les machines W18/MI/M1 seront qualifiés aux jalons du [plan](../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md), sans prétendre que cette CI Chrome démontre toute la matrice.

La [campagne 0.2](validation/0.2-base-reproductible/README.md) reste distincte de la future qualification des quatre rôles en 0.3. La PR 9 et les corrections applicatives prévues restent indépendantes.
