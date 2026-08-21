# Données de référence

Ce dossier définit le jeu de données de référence du jalon **0.2 — Définir les données de référence**. Il couvre les trois langues minimales, les trois familles audio et un scénario de doublage reproductible, sans ajouter de code applicatif ni de dépendance au projet.

## Contenu versionné

- [`INVENTORY.md`](INVENTORY.md) : sources, droits, empreintes, tailles et résultats de validation ;
- [`SCENARIO.md`](SCENARIO.md) : scénario de doublage de référence sur l’EPUB français ;
- [`manifest.json`](manifest.json) : inventaire machine-readable des fichiers attendus ;
- [`.gitignore`](.gitignore) : exclusion explicite des binaires acquis.

Les EPUB et les sons sont placés localement sous `reference-data/files/`. Ce répertoire est ignoré par Git : le dépôt ne redistribue donc aucun binaire tiers et ne déclenche aucun téléchargement automatique.

## Arborescence locale attendue

```text
reference-data/
└── files/
    ├── epubs/
    │   ├── ar-regime-anticancer-arabic.epub
    │   ├── en-the-adventures-of-sherlock-holmes.epub
    │   └── fr-une-etude-en-rouge.epub
    └── audio/
        ├── ambience-rain.ogg
        ├── music-fur-elise.ogg
        └── sfx-door-knocker.ogg
```

## Acquisition reproductible

Depuis la racine du dépôt, sous PowerShell :

```powershell
New-Item -ItemType Directory -Force reference-data/files/epubs, reference-data/files/audio

Invoke-WebRequest 'https://www.ebooksgratuits.com/newsendbook.php?format=epub&id=190' -OutFile 'reference-data/files/epubs/fr-une-etude-en-rouge.epub'
Invoke-WebRequest 'https://www.gutenberg.org/ebooks/1661.epub3.images' -OutFile 'reference-data/files/epubs/en-the-adventures-of-sherlock-holmes.epub'
Invoke-WebRequest 'https://github.com/IDPF/epub3-samples/releases/download/20230704/regime-anticancer-arabic.epub' -OutFile 'reference-data/files/epubs/ar-regime-anticancer-arabic.epub'

Invoke-WebRequest 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Door_knocker_audio.ogg' -OutFile 'reference-data/files/audio/sfx-door-knocker.ogg'
Invoke-WebRequest 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Rain_%281%29.ogg' -OutFile 'reference-data/files/audio/ambience-rain.ogg'
Invoke-WebRequest 'https://upload.wikimedia.org/wikipedia/commons/7/7b/FurElise.ogg' -OutFile 'reference-data/files/audio/music-fur-elise.ogg'
```

Vérifier ensuite les empreintes attendues dans `manifest.json` :

```powershell
Get-ChildItem reference-data/files -Recurse -File | Get-FileHash -Algorithm SHA256
```

Une empreinte différente signifie que la source a changé ou que le téléchargement est incomplet. Il ne faut pas accepter cette différence silencieusement : contrôler le fichier, sa source et ses droits, puis mettre à jour ensemble `manifest.json` et `INVENTORY.md` si le changement est intentionnel.

## Contrôles à reproduire

1. comparer taille et SHA-256 au manifeste ;
2. exécuter EPUBCheck sur chaque EPUB ;
3. ouvrir chaque livre dans un lecteur indépendant et parcourir plusieurs pages ou chapitres ;
4. confirmer la langue, la structure reflowable, la navigation, les images et l’absence de DRM ;
5. pour l’arabe, confirmer le contenu arabe réel et la progression RTL ;
6. lire brièvement chaque son et relever durée, canaux, fréquence et erreurs de décodage ;
7. relire les conditions de la source avant toute redistribution ou utilisation hors du développement local de Jaquette.

Les résultats de référence datés sont consignés dans [`INVENTORY.md`](INVENTORY.md).
