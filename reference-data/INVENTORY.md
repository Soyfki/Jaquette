# Inventaire des données de référence

Validation effectuée le **21 août 2026**. Les tailles et empreintes portent sur les fichiers téléchargés depuis les URL directes indiquées. Les binaires restent locaux sous `reference-data/files/` et ne sont pas versionnés.

## EPUB

| Langue | Fichier local | Œuvre et source | Droits et conditions | Taille (octets) | SHA-256 |
|---|---|---|---|---:|---|
| Français, référence principale | `fr-le-tour-du-monde-en-quatre-vingts-jours.epub` | *Le Tour du monde en quatre-vingts jours*, Jules Verne — édition source J. Hetzel, 1873 ; illustrateurs de l’édition source Alphonse de Neuville et Léon Benett ; édition numérique produite par Claudine Corbasson, Hans Pieterse et l’Online Distributed Proofreading Team à partir d’images Internet Archive/Canadian Libraries — [fiche Project Gutenberg nº 46541](https://www.gutenberg.org/ebooks/46541), [téléchargement EPUB sans images](https://www.gutenberg.org/ebooks/46541.epub.noimages) | Texte original en français, sans traducteur. Domaine public en France selon la vérification territoriale ci-dessous. La [licence Project Gutenberg](https://www.gutenberg.org/policy/license) et ses conditions de marque restent applicables à l’eBook ; elles ne limitent pas l’usage à des fins privées, non commerciales ou non professionnelles. | 272410 | `d95001b2c83001fa0ab67b0d111194976890410307c6897b3d7c7450d4c1eed0` |
| Anglais | `en-the-adventures-of-sherlock-holmes.epub` | *The Adventures of Sherlock Holmes*, Arthur Conan Doyle — [fiche Project Gutenberg](https://www.gutenberg.org/ebooks/1661), [téléchargement EPUB 3 avec images](https://www.gutenberg.org/ebooks/1661.epub3.images) | Domaine public aux États-Unis selon la source. La redistribution doit respecter la [licence et les marques Project Gutenberg](https://www.gutenberg.org/policy/license.html) ainsi que le droit applicable localement. | 379445 | `e837276635b63b808453ed833f0e34a0ffca95bc67603f43eb8ae3302713dd9a` |
| Arabe RTL | `ar-regime-anticancer-arabic.epub` | *Le Vrai Régime anti-cancer*, David Khayat et Nathalie Hutter-Lardeau, traduction Marina Khalil Fayad — [échantillons EPUB 3 IDPF/W3C](https://idpf.github.io/epub3-samples/30/samples.html), [release 20230704](https://github.com/IDPF/epub3-samples/releases/tag/20230704) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) ; attribution et partage dans les mêmes conditions requis en cas de redistribution. | 110694 | `5d10bf6a73f461b7b23294b6e34b72f2a1184c9543a424b4a0f737ed33967e96` |

### Validation EPUB

| Fichier | Format et structure | Navigation | Contenu notable | EPUBCheck 5.3.0 | Lecteur indépendant |
|---|---|---|---|---|---|
| Français | EPUB 2.0 reflowable ; 11 éléments de spine ; 2 feuilles de style ; 1 couverture générée ; aucune ressource chiffrée | NCX présent ; 42 destinations, toutes résolues | 37 chapitres ; `dc:language=fr` ; crédits auteur et illustrateurs dans le package ; variante sans les illustrations de l’édition source | 0 fatal, 0 erreur, 0 avertissement | SumatraPDF 3.6.1 : archive ouverte et rendu des pages 1 à 20, code de sortie 0 ; navigation humaine à confirmer |
| Anglais | EPUB 3.0 reflowable ; 15 éléments de spine ; 3 feuilles de style ; 1 image valide ; aucune ressource chiffrée | Navigation EPUB 3 et NCX ; 36 destinations cumulées, toutes résolues | Recueil structuré en nouvelles | 0 fatal, 0 erreur, 0 avertissement | SumatraPDF 3.6.1, rendu des pages 1 à 20, code de sortie 0 |
| Arabe | EPUB 3.0 reflowable ; 3 éléments de spine ; 1 feuille de style ; 2 images valides ; aucune ressource chiffrée | Navigation EPUB 3 et NCX ; 8 destinations cumulées, toutes résolues | `dc:language=ar`, progression du spine `rtl`, balisage RTL et plus de 23 000 caractères arabes | 0 fatal, 0 erreur, 0 avertissement | SumatraPDF 3.6.1, rendu des pages 1 à 20, code de sortie 0 |

Contrôles communs réussis : archive ZIP lisible, entrée `mimetype` en première position et non compressée, valeur `application/epub+zip`, `container.xml` et package lisibles, spine non vide, aucune déclaration fixed-layout et aucune ressource `encryption.xml`.

### Droits et vérification territoriale de la référence française

- Le texte est l’œuvre française originale de Jules Verne : aucun traducteur n’intervient. La [notice d’autorité BnF de Jules Verne](https://catalogue.bnf.fr/ark:/12148/cb11928016k) indique son décès le 24 mars 1905.
- En France, l’article [L123-1 du Code de la propriété intellectuelle](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278945) fixe à soixante-dix ans après la mort de l’auteur la durée générale des droits patrimoniaux. Même en ajoutant par prudence les prorogations de guerre prévues aux articles [L123-8](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278950/) et [L123-9](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278951/), cette durée est expirée avant 2026.
- L’édition source de 1873 crédite Alphonse de Neuville et Léon Benett. Leurs notices BnF indiquent des décès en [1885](https://catalogue.bnf.fr/ark:/12148/cb119175840.public) et [1916](https://catalogue.bnf.fr/ark:/12148/cb118911916). La variante `epub.noimages` retenue ne contient pas leurs illustrations ; leurs crédits restent documentés sans ambiguïté.
- Project Gutenberg autorise la lecture, la copie, l’adaptation et les usages commerciaux sous les conditions de sa [licence](https://www.gutenberg.org/policy/license) et de sa [politique d’autorisation](https://www.gutenberg.org/policy/permission). Il n’existe donc pas de restriction aux usages privés, non commerciaux ou non professionnels pour ce fichier.
- Cette conclusion ne repose pas sur la seule mention « domaine public aux États-Unis ». Elle vise l’usage de test professionnel en France. Le [droit moral](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278891) demeure, les règles de marque Project Gutenberg doivent être respectées, et une vérification distincte reste nécessaire avant redistribution, adaptation substantielle ou utilisation dans un autre territoire.

## Audio

| Famille | Fichier local | Source et auteur | Droits | Taille (octets) | Durée | Canaux | SHA-256 |
|---|---|---|---|---:|---:|---:|---|
| SFX | `sfx-door-knocker.ogg` | [Door knocker audio](https://commons.wikimedia.org/wiki/File:Door_knocker_audio.ogg), Mx. Granger | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 30423 | 1,473923 s | 1 | `3362b0bd105382bd8f5e0d268b8e7318233abd966c43449241bfee1f35b47c35` |
| Ambiance | `ambience-rain.ogg` | [Rain (1)](https://commons.wikimedia.org/wiki/File:Rain_(1).ogg), ezwa | Domaine public selon Wikimedia Commons | 585522 | 44,956735 s | 1 | `31efcbe952a3989a9276774e2d7be61a2dc98fdd785a94d1435fc19cda9a84d1` |
| Musique | `music-fur-elise.ogg` | [Für Elise](https://commons.wikimedia.org/wiki/File:FurElise.ogg), composition Ludwig van Beethoven, interprétation V. Gao (Gaodifan) | Composition dans le domaine public ; enregistrement placé sous [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 2144088 | 176,586757 s | 2 | `8deefb57df989a2b53a6bdd3e59813b6c34d61dca666caa39e53fa9597b378e3` |

Les trois fichiers sont des flux Vorbis à 44,1 kHz dans un conteneur Ogg. Toutes les pages Ogg ont une somme de contrôle valide, les séquences sont complètes, les en-têtes d’identification, de commentaires et de configuration sont présents. Le flux d’ambiance contient en plus un flux Ogg Skeleton valide.

Le décodage intégral avec Chrome/Web Audio a réussi pour les trois fichiers. Un test de lecture d’environ une seconde par fichier a atteint l’état prêt, sans erreur, avec progression effective du curseur : 1,055 s pour l’ambiance, 1,203 s pour la musique et 1,254 s pour le SFX.

## Limites connues et vérifications humaines

- L’EPUB français est volontairement un EPUB 2 avec navigation NCX : il complète les deux références EPUB 3 et permet de tester une structure reflowable ancienne mais valide. La variante sans images ne représente pas les illustrations de l’édition source.
- Les droits de domaine public dépendent du territoire. Les fichiers ne doivent pas être redistribués sans une nouvelle vérification juridique adaptée au contexte ; le dépôt ne les embarque pas.
- L’échantillon arabe est court et soumis à CC BY-SA 3.0. Il valide le contenu arabe et le balisage RTL, mais ne représente pas à lui seul toute la diversité éditoriale arabe.
- Les contrôles audio automatisés prouvent l’intégrité et le décodage, pas la pertinence perceptive. Une personne doit encore écouter les trois médias et confirmer que leur contenu correspond respectivement aux catégories SFX, Ambiance et Musique.
- Les passages du scénario sont identifiés par leur chapitre et leur texte exact. Les futurs identifiants de tokens stables devront être générés par l’import Jaquette ; aucune coordonnée d’affichage n’est utilisée comme ancre.
- **Validation humaine requise — arabe :** une personne doit confirmer visuellement que le texte arabe apparaît réellement en RTL dans un lecteur indépendant.
- **Validation humaine requise — audio :** une personne doit écouter le SFX, l’Ambiance et la Musique et confirmer que leur contenu correspond à leur catégorie.
- **Validation humaine requise — scénario français :** une personne doit ouvrir l’EPUB dans un lecteur indépendant, naviguer vers les chapitres I, IV et IX et retrouver les trois passages exacts consignés dans `SCENARIO.md`.
