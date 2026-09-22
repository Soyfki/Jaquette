# Défaut — exécutions CI obsolètes en parallèle

Adaptation du [modèle](../BUG_REPORT.md). Signalé par l'utilisateur le 22 septembre 2026. Le workflow de la base `f273b202d16476e075a827fb85d692b479ba8344` ne définissait aucun groupe de concurrence : plusieurs pushes sur la même PR ou main pouvaient consommer des runners simultanément.

Correction : groupe stable workflow + PR/ref et annulation des runs obsolètes. Pas de suppression des résultats historiques ni de nouvelle permission. La [checklist](CHECKLIST.md) exige une annulation réellement observée puis une campagne complète du dernier commit. Preuves horodatées et SHA dans la [PR 13](https://github.com/Soyfki/Jaquette/pull/13).

Les relevés matériels MI/M1 et les observations W18 de 0.4 sont un sujet distinct, traité dans la PR 12. Une CI réussie ne remplace pas une mesure matérielle absente.
