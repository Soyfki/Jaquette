# Défaut — exécutions CI obsolètes en parallèle

Adaptation du [modèle](../BUG_REPORT.md). Signalé par l'utilisateur le 22 septembre 2026. Le workflow de la base `f273b202d16476e075a827fb85d692b479ba8344` ne définissait aucun groupe de concurrence : plusieurs pushes sur la même PR ou main pouvaient consommer des runners simultanément.

Correction : groupe stable workflow + PR/ref et annulation des runs obsolètes. Pas de suppression des résultats historiques ni de nouvelle permission. La [checklist](CHECKLIST.md) exige une annulation réellement observée puis une campagne complète du dernier commit. Preuves horodatées et SHA dans la [PR 13](https://github.com/Soyfki/Jaquette/pull/13).

Les relevés matériels MI/M1 et les observations W18 de 0.4 sont un sujet distinct, traité dans la PR 12. Une CI réussie ne remplace pas une mesure matérielle absente.

## Régression d'acquisition révélée par la campagne

Le run [35707050967](https://github.com/Soyfki/Jaquette/actions/runs/35707050967), SHA `a75fdf82dc9624132d5f45f0e9bec074d982babf`, a correctement refusé l'EPUB français régénéré par Gutenberg : au moins 276 028 octets au lieu des 272 410 attendus. Cette source mouvante empêchait une installation vierge ; l'annulation concurrente était déjà observée sur le run précédent.

Correction dans ce même périmètre de réparation CI : archiver les octets canoniques français à l'identique, déjà conservés et revérifiés, puis sélectionner explicitement cette archive comme pour l'anglais. Manifeste, hash, taille et tests d'intégrité inchangés ; sept scénarios d'acquisition rejoués également pour le français (conforme, HTTP 404, altération, troncature, dépassement, réseau, fichier existant invalide). Voir [provenance et redistribution](../../../reference-data/ARCHIVE-FR.md). Aucun FAIL masqué par une nouvelle attente, aucun EPUB personnel.
