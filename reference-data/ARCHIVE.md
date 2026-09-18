# Référence de test canonique — EPUB anglais, corpus du 21 août 2026

Archive technique pour reproduire les tests de Jaquette. Ce n'est pas une version de l'application (qui reste 0.0.0), ni un livre publié dans Jacques. Distribution gratuite, sans modification du fichier et hors de l'historique Git.

Archive publiée : [Release de fixtures](https://github.com/Soyfki/Jaquette/releases/tag/fixtures-reference-2026-08-21), asset 557500668. La sélection explicite de cette source pour `epub-en` est versionnée dans [reference-source.mjs](../scripts/reference-source.mjs). Les cinq autres références utilisent leur URL d'origine. Aucun fallback automatique n'est prévu : erreur HTTP, réseau, taille ou SHA incorrects font échouer la préparation. Un fichier local invalide reste intact. Ni cette Release ni son nom ne constituent une garantie d'immuabilité ; les attentes canoniques restent obligatoires à chaque lecture.

**The Adventures of Sherlock Holmes**, Arthur Conan Doyle, Project Gutenberg eBook #1661. Crédits de l'édition numérique : an anonymous Project Gutenberg volunteer and Jose Menendez.

> This eBook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it away or re-use it under the terms of the [Project Gutenberg™ License](https://www.gutenberg.org/policy/license.html) included with this eBook or online at www.gutenberg.org. If you are not located in the United States, you will have to check the laws of the country where you are located before using this eBook.

## Provenance et intégrité

- Source : [fiche Gutenberg #1661](https://www.gutenberg.org/ebooks/1661), variante EPUB 3 avec images de l'URL https://www.gutenberg.org/ebooks/1661.epub3.images.
- Octets repris de la copie canonique conservée dans `reference-data/files` lors de la validation historique d'août 2026. Taille et empreinte revérifiées avant cet archivage le 11 septembre 2026. Aucun EPUB personnel utilisé.
- Taille : **379445 octets**.
- SHA-256 : **e837276635b63b808453ed833f0e34a0ffca95bc67603f43eb8ae3302713dd9a**.
- Fichier : `epub-en-e837276635b63b808453ed833f0e34a0ffca95bc67603f43eb8ae3302713dd9a.epub`.
- Manifeste de référence : [manifest.json au commit d7ddeea09f3fc60146454b935192cb3d1c91ee54](https://github.com/Soyfki/Jaquette/blob/d7ddeea09f3fc60146454b935192cb3d1c91ee54/reference-data/manifest.json). Les attentes ne sont pas modifiées.

L'URL Gutenberg peut régénérer son EPUB : le 11 septembre, elle fournit 379177 octets, SHA-256 a5ec3affcc10d1b610545f7dbd650258989db4b892f9205b8787b802376a73a5, refusés par la qualification. Cette archive conserve les octets déjà attendus, sans recompression. Les vérifications de taille et SHA restent obligatoires ; le nom d'un asset ne garantit pas son immutabilité.

## Conditions de redistribution vérifiées le 11 septembre 2026

Le fichier conserve ses crédits, en-tête et licence Project Gutenberg complète (sections XHTML pg-header et pg-footer), ainsi que son format EPUB officiel. Il est fourni gratuitement et sans adaptation. Les conditions de redistribution à l'identique et de marque de la [licence](https://www.gutenberg.org/policy/license.html) et de la [politique d'autorisation](https://www.gutenberg.org/policy/permission.html) sont conservées ; aucune autorisation ou affiliation de Gutenberg n'est revendiquée.

La source déclare le texte dans le domaine public aux États-Unis. Pour la France, le texte anglais original n'implique aucun traducteur ; Conan Doyle est mort le 7 juillet 1930 selon la [BnF](https://catalogue.bnf.fr/ark:/12148/cb119005545). La durée générale de soixante-dix ans après l'année du décès prévue par [L123-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278937/2026-05-06) est expirée ; même en ajoutant par prudence les prorogations de guerre de L123-8 et L123-9, l'échéance précède 2026. Le [droit moral](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278891) demeure : attribution et intégrité sont préservées. Le package ne contient qu'une couverture générée, sans traduction ni illustrations du recueil illustré distinct #48320. La vérification France/États-Unis ne constitue pas une garantie mondiale : les destinataires d'autres territoires doivent vérifier leur droit applicable conformément à la notice ci-dessus.
