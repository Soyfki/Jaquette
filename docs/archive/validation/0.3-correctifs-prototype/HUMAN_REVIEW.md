# Recette humaine — 0.3 et historique 1.4.2

## Reprise ciblée après le retour sur a93e5464b427ee575db06bb41fa39f46db09502c

**Recette complète le 18 septembre 2026.** Les onze PASS fonctionnels initiaux sont conservés dans le [rapport](VALIDATION_REPORT.md). Après correction et campagne technique complète au SHA `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`, l’utilisateur a transmis les trois PASS ci-dessous. Aucune nouvelle observation n’est attendue.

| ID | Parcours et résultat à observer | Observation / PASS, FAIL ou BLOCKED |
|---|---|---|
| H14-6 | Ouvrir Projet → Admin Maison. À 1440 × 1000 : première rangée Membres / Équipes / Invitations ; deuxième rangée Projets / Permissions / Audit. Les trois tuiles de chaque rangée ont leurs bords haut et bas alignés, les colonnes et espacements sont réguliers. À 768 × 1024 : faire défiler les six tuiles dans cet ordre ; largeur et espacement cohérents, aucun contenu coupé. Les six régions restent lisibles et fictives. | PASS — observation reçue le 18 septembre 2026 |
| H14-10 | Relire les captures régénérées au SHA affiché : disposition des tuiles sur les deux vues Admin, puis forme ronde du J commun sur Accueil/Chef/Admin aux deux formats. Les autres éléments Accueil/Chef ne changent pas. Confirmer les alignements, espacements et notes de bas de tuile Admin. | PASS — observation reçue le 18 septembre 2026 |
| H03-4 | Ouvrir Fondations 1.1 → Palette générale aux deux formats : les cinq pastilles ont un contour parfaitement rond. Vérifier aussi le J dans l’en-tête de l’application et le grand J de la carte Connexion ; aucun côté plat ni forme écrasée. Les nouvelles captures Fondations/Connexion sont fournies. | PASS — pastilles et deux J bien ronds, reçu le 18 septembre 2026 |

Les réponses exactes et leur interprétation sont conservées dans le rapport. SHA de recette : `28cb5d943e0617de0b6fec9e50e76ca3b54c9c51`.

## Recette initiale conservée pour référence

Les parcours ci-dessous décrivent la première campagne. Ils ne constituent pas une demande de refaire les onze observations PASS déjà reçues.

L’agent fournit dans la PR et dans la tâche le SHA complet, l’URL locale, les fenêtres Chrome déjà réglées à 1440 × 1000 et 768 × 1024 et les six captures. Les vérifications techniques sont préremplies dans la preuve au même SHA. Vous observez l’interface ; aucun DOM, timer ou journal à inspecter.

## Correctifs 0.3

| ID | Parcours et résultat à observer | Observation / PASS, FAIL ou BLOCKED |
|---|---|---|
| H03-1 | Accueil : Le Jardin de Minuit est En attente Chef, 10/10 chapitres et 30/30 validations. Ouvrir le projet, choisir Chef d’équipe : Doublage, Révision et Validation finale restent trois axes distincts, finale encore en attente. La préparation de publication n’est pas proposée. Le dénominateur 10 chapitres × 3 Réviseurs se comprend. | À renseigner |
| H03-2 | Dans Projet, ouvrir la navigation générale au clavier, atteindre Fondations 1.1 avec Tab puis Entrée. Le titre reçoit un focus visible et reste confortable à lire. Précédent ramène au projet ; suivant retrouve Fondations et son titre. | À renseigner |
| H03-3 | Dans Projet, choisir Chef d’équipe ou Réviseur. Lancer la simulation (x4 pour raccourcir), laisser finir au dernier mot, puis relancer. Le surlignage repart au début, le statut reste compréhensible et la lecture semble fluide. | À renseigner |

## Revalidation historique complète 1.4.2

Effectuer ces observations aux deux formats fournis. Les boutons de décision/gestion sont des aperçus fictifs ; ils n’enregistrent ni validation ni publication réelle.

| ID | Parcours et résultat à observer | Observation / PASS, FAIL ou BLOCKED |
|---|---|---|
| H14-1 | Ouvrir /projet : Sound Designer actif, quatre choix lisibles. Choisir un autre rôle, recharger : Sound Designer revient. Quitter puis revenir au projet : même état initial. | À renseigner |
| H14-2 | Accueil : Toutes les équipes (Studio narratif, 7 membres/3 projets ; Révision Minuit, 5 membres/2 projets), puis Tous les projets (Le Jardin de Minuit, L’Atlas des brumes, Les Voix du large, La Ville Haute, Les Heures claires). Chacun montre équipe, statut et activité/progression. Ouvrir le projet de démonstration : transition fluide, Sound Designer initial. | À renseigner |
| H14-3 | Chef : Tableau de bord, Progression, Livre, Simulation/Navigation, Historique, Commentaires et Validation finale sont atteignables au défilement. Les trois axes restent séparés ; les décisions sont fictives. | À renseigner |
| H14-4 | Chef En attente Chef : aucune préparation de publication ni métadonnée boutique ; Validation finale explique sa disponibilité après validation. | À renseigner |
| H14-5 | Chef : aucun accès bibliothèque, ouverture de fichier, inspecteur, montage ou dépublication. Le livre et la simulation restent consultables. | À renseigner |
| H14-6 | Admin Maison : Membres, Équipes, Invitations, Projets, Permissions, Audit sont présents et manifestement fictifs. | À renseigner |
| H14-7 | Admin : aucun accès montage, bibliothèque, ouverture de fichier, révision, validation finale ou préparation de publication ; aucun droit éditorial implicite. | À renseigner |
| H14-8 | Lancer une simulation, ouvrir Historique, puis parcourir Sound Designer → Réviseur → Chef → Admin deux fois. Les vues sont distinctes ; l’URL reste /projet, le focus reste visible, l’historique ouvert/la lecture ne ressurgissent pas. Sur petit format, ouvrir puis fermer les tiroirs Sound Designer. | À renseigner |
| H14-9 | Aux deux formats, faire défiler toutes les régions. Aucun texte coupé, chevauchement ou débordement ; quatre rôles lisibles. Parcourir le sélecteur par Tab et activer par Espace. Lecture et navigation confortables. | À renseigner |
| H14-10 | Relire les six captures fournies : Accueil, Chef et Admin, chacun en 1440 × 1000 et 768 × 1024. Observer hiérarchie, espacement, contraste, alignements et absence de contenu coupé. | À renseigner |

## Retour à copier dans la tâche

SHA présenté :

- H03-1 — observation — PASS/FAIL/BLOCKED :
- H03-2 — observation — PASS/FAIL/BLOCKED :
- H03-3 — observation — PASS/FAIL/BLOCKED :
- H14-1 — observation — PASS/FAIL/BLOCKED :
- H14-2 — observation — PASS/FAIL/BLOCKED :
- H14-3 — observation — PASS/FAIL/BLOCKED :
- H14-4 — observation — PASS/FAIL/BLOCKED :
- H14-5 — observation — PASS/FAIL/BLOCKED :
- H14-6 — observation — PASS/FAIL/BLOCKED :
- H14-7 — observation — PASS/FAIL/BLOCKED :
- H14-8 — observation — PASS/FAIL/BLOCKED :
- H14-9 — observation pour les deux formats — PASS/FAIL/BLOCKED :
- H14-10 — observation des six captures — PASS/FAIL/BLOCKED :
- Défauts éventuels :

Un retour manquant reste BLOCKED ; il ne vaut pas échec observé. L’agent complète les deux décisions et ne fusionne qu’après satisfaction de tous les critères obligatoires.
