# Données de référence

Ce dossier définit le jeu de données de référence de l’ancien jalon historique **0.2 — Définir les données de référence**, distinct de la nouvelle **0.2 — Reproduire la base**. Il couvre les trois langues minimales, les trois familles audio et un scénario de doublage reproductible, sans ajouter de code applicatif ni de dépendance au projet.

## Contenu versionné

- [`INVENTORY.md`](INVENTORY.md) : sources, droits, empreintes, tailles et résultats de validation ;
- [`SCENARIO.md`](SCENARIO.md) : scénario de doublage de référence sur l’EPUB français ;
- [`manifest.json`](manifest.json) : inventaire machine-readable des fichiers attendus ;
- [`.gitignore`](.gitignore) : exclusion explicite des binaires acquis.

Les EPUB et les sons sont placés localement sous `reference-data/files/`. Ce répertoire est ignoré par Git : aucun binaire tiers n'entre dans l'historique Git. La seule référence anglaise est aussi distribuée gratuitement comme [asset de Release de fixtures](ARCHIVE.md), avec licence et provenance conservées. La commande explicite `pnpm prepare:references` et la CI de qualification utilisent cette archive pour l'anglais et les cinq autres URL du manifeste ; l'application ne les télécharge pas.

## Arborescence locale attendue

```text
reference-data/
└── files/
    ├── epubs/
    │   ├── ar-regime-anticancer-arabic.epub
    │   ├── en-the-adventures-of-sherlock-holmes.epub
    │   └── fr-le-tour-du-monde-en-quatre-vingts-jours.epub
    └── audio/
        ├── ambience-rain.ogg
        ├── music-fur-elise.ogg
        └── sfx-door-knocker.ogg
```

## Acquisition reproductible

Depuis la racine du dépôt, avec Node 24.19.0 et pnpm 11.19.0 :

```powershell
pnpm prepare:references
pnpm check:reference
```

Les deux commandes comparent les tailles et SHA-256 attendus, sans modifier le manifeste. Le vérificateur rejette un manifeste invalide ou différent du contenu canonique ainsi que toute ressource obligatoire absente, illisible ou altérée. La préparation conserve un fichier existant invalide et refuse une réponse HTTP non conforme. Pour une inspection supplémentaire sous PowerShell :

```powershell
Get-ChildItem reference-data/files -Recurse -File | Get-FileHash -Algorithm SHA256
```

Une empreinte différente bloque la campagne : source modifiée ou téléchargement incomplet. Ne pas recalculer les empreintes, remplacer la référence ni employer un EPUB personnel pour obtenir un succès. Une évolution intentionnelle du corpus exige une décision distincte et documentée.

**Incident du 11 septembre 2026 :** l'EPUB anglais à l'URL Gutenberg diffère du manifeste et est correctement refusé. Les mêmes octets canoniques ont été archivés, sans recompression, dans la [Release de fixtures](ARCHIVE.md). Cette source est sélectionnée explicitement avant téléchargement et journalisée ; un échec ne déclenche aucun recours silencieux à Gutenberg. Les valeurs et l'historique de qualification figurent dans le [rapport 0.2](../docs/validation/0.2-base-reproductible/BUG_REPORT.md).

La référence française est la variante officielle **EPUB sans images pour anciens lecteurs** de l’eBook Project Gutenberg nº 46541. La [fiche de l’eBook](https://www.gutenberg.org/ebooks/46541), les crédits de production, les conditions Project Gutenberg et la vérification territoriale française sont détaillés dans [`INVENTORY.md`](INVENTORY.md). L’usage professionnel de test ne dispense pas de respecter le droit moral français, les conditions liées à la marque Project Gutenberg ni de refaire l’analyse pour un autre territoire ou une redistribution.

## Contrôles à reproduire

1. comparer taille et SHA-256 au manifeste ;
2. exécuter EPUBCheck sur chaque EPUB ;
3. ouvrir chaque livre dans un lecteur indépendant et parcourir plusieurs pages ou chapitres ;
4. confirmer la langue, la structure reflowable, la navigation, les images et l’absence de DRM ;
5. pour l’arabe, confirmer le contenu arabe réel et la progression RTL ;
6. lire brièvement chaque son et relever durée, canaux, fréquence et erreurs de décodage ;
7. relire les conditions de la source avant toute redistribution ou utilisation hors du développement local de Jaquette.

Les résultats de référence datés sont consignés dans [`INVENTORY.md`](INVENTORY.md).
