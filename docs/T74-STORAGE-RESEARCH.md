# T-74 — laboratoire de stockage, aucune adoption

Ce lot R&D compare des mécanismes isolés depuis `main` `4b183900a4a677c51c1d8150f7459f150c1ad033`.
Il ne choisit aucun format `.jacq` ou `.chpt`, ne sérialise pas un projet réel et ne modifie pas l'application.
La PR17/T73 n'est pas intégrée implicitement. Les fixtures sont entièrement synthétiques et sans audio réel.
Le plan canonique reste le commentaire AT du 23 octobre 2026, `01a169ae-71eb-7282-b950-c45e3fd434c8`.

## Décision expérimentale

**NO-GO pour l'adoption en production des trois prototypes.** Les deux premiers restent **NON PROUVÉS**
pour les garanties physiques ; le contrôle négatif viole délibérément la sauvegarde partielle.
Les critères AT restent décochés. Ni les tests verts ni les hashes ne remplacent la preuve manquante.

| Option | Expérience livrée | Limite déterminante |
| --- | --- | --- |
| Fichiers par chapitre | Générations immuables, médias par hash, index commun publié après flush des fichiers | Pas de preuve de durabilité du renommage/répertoire Windows ni de trace physique indépendante ; reprise en lecture seulement après arrêt du writer |
| Sections append | Références offset/longueur/hash dans un fichier, index de génération séparé | Médias identiques re-streamés puis laissés orphelins ; amplification et croissance sans compaction ; mêmes limites de durabilité |
| Contrôle de réécriture | Réécrit les deux chapitres inchangés avec les mêmes octets | L'oracle API doit détecter deux écritures malgré les hashes inchangés |
| OPFS Chrome | Worker dédié avec accès synchrone, 64 Mio streamés, fermeture/réouverture du profil de test | Trace logique seulement ; quota réel, export/import autonome, intégrité complète du média et crash navigateur non qualifiés |

Alternative à examiner avant toute décision : prototype natif avec protocole de durabilité documenté pour le FS cible,
observateur OS indépendant limité aux processus de test, contrôle négatif et positif rejoués sous ce même observateur.
Puis reprendre les tests quota réel et export/import navigateur et les plateformes absentes. Ne pas remplacer ces
preuves par des tests de configuration. L'existence de WPR sur le poste n'est pas une capture ; aucune session
globale, installation, modification de sécurité ou de quota n'est déclenchée par ce lot.

## Modèle limité et protocole

`scripts/storage-research/store.mjs` ne manipule que des racines neuves marquées T74. Les références sont internes,
les chemins importés sont refusés et les liens symboliques/jonctions aux entrées/racine sont refusés.
Ce laboratoire n'est pas une frontière de sécurité face à une modification concurrente hostile du système de fichiers.
Un fichier exclusif interdit deux writers. Après arrêt brutal, la lecture reste possible ; un writer refuse la reprise
avec `WRITER_OR_RECOVERY_REQUIRED`. Aucun verrou n'est volé et aucun fichier n'est effacé silencieusement.

Les données communes portent les IDs du projet/livre et les tokens. Chaque chapitre contient ses occurrences,
ancrées sur un token du même chapitre. Chaque média est streamé par blocs de 65 536 octets et hashé à la lecture.
Les métadonnées sont bornées à 1 Mio ; la fixture et le laboratoire ne prétendent donc pas couvrir un vrai gros EPUB.
L'index conserve la chaîne de hashes des générations ; un index engagé corrompu provoque un refus explicite,
pas un retour silencieux à une vieille génération. L'historique n'est pas une API de consultation de versions produit.

Les barrières `data-chunk`, `before-publish`, `index-flushed`, `published` injectent annulation et ENOSPC.
Avant publication, une réouverture retrouve l'ancienne génération ; après publication elle retrouve la nouvelle
génération complète, même si l'appel a levé avant son accusé expérimental. On n'annonce pas « annulé sans effet ».
Huit tests tuent uniquement leur propre processus enfant, puis ouvrent un autre processus pour relire.
Cela ne simule ni coupure électrique, ni crash OS, ni manque d'espace réel.

L'export prend le verrou et copie progressivement vers une cible inexistante, avec vérification finale.
L'import expérimental est une deuxième copie autonome. Les deux sources sont renommées avant lecture de cette
dernière copie. Une destination existante est toujours refusée. Une copie partielle échouée est conservée pour
diagnostic ; elle n'est pas annoncée comme portable ou sauvegardée. L'export explicite copie l'ensemble :
il ne constitue pas la sauvegarde partielle du travail. Les références des anciennes générations ne sont pas
réexportées en mode fichiers ; seule la génération courante est autonome. Ce n'est pas l'historique produit requis.

## Commandes réelles

Utiliser Node 24.19.0 et pnpm 11.19.0 verrouillés. Les cibles de campagne doivent être nouvelles et leur parent exister.
Les scripts ne nettoient pas les résultats ; les tests unitaires ne nettoient que leur propre `mkdtemp`.

```text
pnpm test:storage
node scripts/storage-research/run.mjs --help
node scripts/storage-research/run.mjs --adapter directory --fixture small --bytes 67108864 --output test-results/tickets/T-74/directory-64MiB
node scripts/storage-research/run.mjs --adapter append --fixture large --bytes 268435456 --output test-results/tickets/T-74/append-256MiB
node scripts/storage-research/run.mjs --adapter monolith --fixture small --output test-results/tickets/T-74/negative-control
node scripts/storage-research/run.mjs --adapter directory --fixture large --output test-results/tickets/T-74/directory-5GB
node scripts/storage-research/run.mjs --adapter append --fixture large --output test-results/tickets/T-74/append-5GB
node scripts/storage-research/recover.mjs --run test-results/tickets/T-74/directory-5GB/imported --adapter directory
node scripts/storage-research/opfs.mjs --output test-results/tickets/T-74/opfs-64MiB
pnpm validate:all
```

`large` sans override écrit **5 000 000 000 octets réels**, pas 5 Gio, sans trou sparse ni compression.
Le précontrôle exige quatre fois le média plus 1 Gio libre (source, deux copies, staging et marge).
Les campagnes lourdes ne sont pas automatiques en CI ; `test:tooling` inclut les tests de contrat peu coûteux.
Le script OPFS distinct exige Chrome et Playwright déjà installés, sert seulement sa page/worker sur loopback,
utilise son seul profil neuf et ferme ses ressources. Aucun fallback OPFS vers Node ne masque une absence d'API.
Il n'est pas une fonctionnalité de démarrage offline (T75).

## Provenance et lecture des résultats

Chaque campagne Node écrit `report.json` et `api-events.json` dans sa cible ignorée Git : commande, SHA,
arbre sale ou propre, Node/Windows, timestamps, durée, espace préalable, pic RSS, mémoire finale, volumes logiques,
octets écrits par l'API, sections, offsets, flush et renommages. Les lectures de vérification sont comptées.
Le volume logique n'est pas l'allocation physique et le pic RSS n'est pas une mesure du seul moteur.
Les ressources OS, antivirus et caches ne sont pas contrôlés : aucun seuil ou gain de performance produit n'est conclu.
Le rapport OPFS contient appels, quota estimé/persisted, user agent et réouverture ; ce n'est pas une trace OS.

Les premiers probes du 23 octobre, **base 4b18390 avec arbre modifié**, ont donné :

| Option / média | Durée totale | Pic RSS Kio | Écritures API autres chapitres | Taille logique des 3 copies |
| --- | ---: | ---: | ---: | ---: |
| Fichiers / 64 Mio | 3,75 s | 90 544 | 0 | 201 378 829 octets |
| Append / 64 Mio | 14,32 s | 77 428 | 0 | 402 723 198 octets |
| Fichiers / 256 Mio / 100 chapitres | 25,45 s | 138 880 | 0 | 805 552 015 octets |
| Append / 256 Mio / 100 chapitres | 26,28 s | 139 800 | 0 | 1 610 820 363 octets |
| Contrôle négatif / 1 Mio | 0,54 s | 54 928 | 2 détectées | 3 197 956 octets |

Ces mesures intermédiaires n'attestent pas un futur SHA. Les logs de validation et les campagnes finales portent
leur propre provenance au SHA réellement exécuté ; leurs résultats doivent être lus, jamais supposés depuis ce tableau.
Le premier essai sandbox a échoué sur EPERM/rename ; le rejeu natif autorisé des 35 premiers tests a passé en 6,00 s,
sans modifier de réglage de sécurité. Les logs initiaux ne sont pas des preuves de validation finale.

## Matrice restante

- Trace physique OS indépendante avec ses contrôles : non exécutée. Critère 1 non prouvé.
- Coupure électrique/crash OS, saturation d'un quota réel sûr, permission retirée/handle expiré : non exécutés.
- Espace insuffisant et annulation : injection déterministe seulement ; arrêt de nos enfants : réel.
- Durabilité du répertoire et reprise automatique d'un verrou après crash : non implémentées. Critère 2 non acquis.
- Navigateur : réouverture gracieuse seulement ; pas de validation Safari/macOS, Firefox, Electron ou matériel cible.
- Coût financier : aucune dépense nouvelle ; aucune preuve d'un coût nul d'exploitation futur. Append sans compaction
  augmente l'espace nécessaire ; aucune modification de budget ou nettoyage d'artefact distant.
- Production, adoption de format, validation humaine, publication et fusion : décisions distinctes, non simulées ici.
