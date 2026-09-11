# Campagne 0.2 — Reproduire la base

Dossier préparé avant tests le 11 septembre 2026 à partir des modèles [checklist](../CHECKLIST.md), [bug](../BUG_REPORT.md) et [rapport](../VALIDATION_REPORT.md). Base main : **d7ddeea09f3fc60146454b935192cb3d1c91ee54**, après fusion vérifiée de [0.1 / PR 10](https://github.com/Soyfki/Jaquette/pull/10). Branche : **codex/etape-0-2-base-reproductible**. La PR du lot contient les résultats finaux avec SHA complet et les liens vers les exécutions CI et artefacts ; aucun commit n'est créé seulement pour inscrire son propre SHA.

**Correction en qualification.** L'incident initial de l'URL anglaise divergente est conservé dans le [rapport de bug](BUG_REPORT.md). Les octets canoniques sont désormais accessibles par une archive explicite hors Git. Le GO exige les 14 contrôles obligatoires locaux et CI au SHA final ; aucun changement de corpus ni de lockfile n'est admis pour contourner un échec.

## Environnement et périmètre

Windows 10 build 19045 x64, Node **24.19.0**, pnpm **11.19.0**, Corepack absent ; Chrome **152.0.7977.84**. Clone isolé neuf, sans node_modules ni store préalable. Installation frozen des 241 packages observés, aucun package remplacé ou mis à niveau. React 19.2.8, TypeScript 5.9.3, version applicative 0.0.0 conservés. Runtime de campagne fixé dans [.node-version](../../../.node-version) ; CI Ubuntu 24.04 x64 avec les mêmes Node/pnpm et préparation explicite de Google Chrome. Sa version effective figure dans l'artefact.

Le checkout initial reste sur **5cabbb016d3ce5480b165512c1aa7814b8367802**. Son plan modifié, docs/prompts/ et EPUB tests/ sont préservés par empreinte ; aucun node_modules transféré n'a été copié. Le dossier isolé .work-0-2 est le seul ajout local hors index. La PR 9 reste indépendante, en brouillon et non fusionnée ; le lot 1.4.2 reste non acquis, avec nouvelle campagne prévue en 0.3.

## Corpus et attentes fixées avant tests

Les six fichiers obligatoires sont ceux de [manifest.json](../../../reference-data/manifest.json). Leur contenu, noms, tailles, empreintes, sources et licences sont conservés intégralement. L'empreinte du JSON canonique sérialisé sans espaces est **183af98c06d5478330c2a99396a6cc8a6243589a3d5e6a3743aaf02329224b75**, issue de main à la base exacte ci-dessus. Le garde-fou rejette aussi un manifeste vidé, réduit, dupliqué ou dont les attentes auraient été réécrites. Il n'est pas une signature cryptographique de publication.

Le téléchargement Gutenberg initial donnait cinq fichiers conformes ; l'anglais était refusé. La copie anglaise conservée dans **reference-data/files** du checkout initial (379445 octets, empreinte canonique, aucun EPUB personnel) a d'abord permis les tests locaux, sans valoir une CI vierge verte. Elle a ensuite été archivée sans modification dans la [Release de fixtures](../../../reference-data/ARCHIVE.md). La nouvelle campagne doit acquérir les six références depuis zéro par le réseau ; l'historique de l'échec initial est conservé.

Tous les contrôles de la [checklist](CHECKLIST.md) sont obligatoires. Un jeu complet valide doit réussir ; une absence, illisibilité, altération ou attente de manifeste incorrecte doit produire un code non nul. Les tests négatifs se déroulent exclusivement dans des dossiers temporaires créés à cet effet ; le corpus canonique n'est pas modifié.

## Commandes et preuves

Voir le [guide d'installation et diagnostic](../../REPRODUCIBILITY.md). La commande complète est `pnpm validate:all`, qui réutilise `validate`, ajoute les tests d'outillage et les E2E. `pnpm validate:diagnostic` lance chaque contrôle indépendamment et sauvegarde les codes, journaux, SHA, état de l'arbre et environnement dans `test-results/qualification/`. Un état dirty indique un essai de développement, pas une qualification du commit seul.

Les preuves finales du SHA commité sont attachées à la PR et aux artefacts CI nommés `qualification-<SHA>`. Rapports Playwright HTML/JSON, captures et traces d'échec sont conservés ; ni corpus binaire, ni EPUB personnel, ni node_modules ne sont téléversés. Les logs locaux additionnels sont dans le dossier evidence adjacent au clone isolé.

## Portée et décision

Les E2E démarrent **Vite dev**, avec `reuseExistingServer=false`, Google Chrome, 1440 × 1000 et 768 × 1024. Ils contrôlent le DOM et les erreurs console/page de chaque scénario. Cela ne qualifie pas un build distribué, Firefox, Safari réel, Electron, l'import EPUB ou l'audio réel. Les jalons et la matrice produit du plan restent applicables.

Aucun essai humain obligatoire pour 0.2 ; aucun résultat humain inventé. Les résultats PR 9 restent historiques et ne sont ni un quota ni une preuve pour cette branche. Les trois corrections applicatives annoncées pour 0.3 restent dans ce lot futur.

Selon le [protocole](../README.md), un contrôle obligatoire empêché donne **BLOQUÉE / NO-GO** ; un contrôle exécuté en défaut donne **À CORRIGER / NO-GO** ; seuls tous les obligatoires PASS avec preuves et CI permettent GO. Aucune dette ne couvre la récupération canonique empêchée. Signature : agent Codex, développeur et responsable de validation, 11 septembre 2026.
