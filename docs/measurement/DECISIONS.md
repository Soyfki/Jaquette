# Décisions de périmètre — mesures 0.4

## D04-04 — Développement W18 ; M1 uniquement aux tests finaux

Décision explicite de l'utilisateur du 22 septembre 2026, postérieure à D04-03 : développement uniquement sur W18 ; tests Mac uniquement sur M1, pas sur Intel, et seulement lors des dernières phases de tests. **D04-04 remplace D04-03 sur les cibles et leur calendrier.**

- Étapes 0 à 13 : W18 est le seul poste matériel de développement et d'acceptation. Les critères des étapes 1.3, 1.6 et 3.5, comme ceux des autres étapes intermédiaires, s'évaluent sur W18. La CI technique peut conserver ses runners sans les assimiler à une cible matérielle qualifiée.
- Phases finales 14 à 16, après J3 : début du relevé et des essais M1 en 14.2, matrice Web/Desktop et budgets en 15, pilotes et release candidate en 16. Les scénarios construits sur W18 sont rejoués sur M1, dont Safari réel et Electron macOS arm64 natif. Aucun essai Mac obligatoire plus tôt.
- Mac Intel (ancien repère MI), ses navigateurs et l'installateur macOS x64 sont retirés du périmètre actif ; leurs mentions dans les rapports datés restent de l'historique, pas des exigences courantes.
- Pour 0.4 : T05 est réservé au seul M1 en phases finales ; H-M1 est reporté à ces phases ; H-MI est retiré. L'absence de M1 ou d'Intel n'est ni un FAIL ni un BLOCKED du lot et n'empêche aucun PASS/Go de l'étape actuelle. Aucune mesure Mac non exécutée n'est déclarée PASS.
- L'absence de M1 lors des phases finales bloque alors sa qualification et la release qui l'exige, sans annuler rétroactivement les validations de développement W18.
- Les quatorze seuils, le corpus, la version applicative 0.0.0 et les dix contrôles obligatoires de 0.4 côté W18/dispositif restent inchangés. Cette décision ne résout pas les observations physiques H-W18 déclarées inconnues.

## D04-03 — Historique, remplacé par D04-04

La décision ci-dessous conserve la chronologie du premier report. Ses anciennes exigences Intel et Mac dès 1.3 ne s'appliquent plus.

Le 22 septembre 2026, l'utilisateur indique ne posséder aucun des deux Mac et choisit explicitement : « Reporter les relevés Mac à la qualification macOS ». Cette décision remplace uniquement l'exigence de disposer des deux relevés Mac pour le Go de 0.4 dans le prompt initial. Elle ne modifie aucun seuil ni aucune cible produit.

- T05 (collecteurs natifs MI/M1), H-MI et H-M1 sortent des contrôles obligatoires de **0.4**. Leurs résultats historiques BLOCKED sont conservés ; aucun ne devient PASS.
- MI (MacBook Intel avant M1), M1 (MacBook M1), Chrome/Firefox/Safari réel et Desktop natif restent des cibles obligatoires. Les collecteurs, protocoles et formulaires restent livrés.
- Le responsable de la première qualification macOS reprend ces trois contrôles avant de déclarer cette plateforme validée, dès les essais concernés de 1.3, puis pour la distribution 14.2 et la matrice complète 15.1. Sans relevés et observations réels, la qualification macOS reste BLOCKED / NO-GO ; ni runner cloud, ni émulation, ni WebKit Playwright ne les remplacent.
- La campagne 0.4 compte désormais dix contrôles obligatoires : T01/T02/T03/T04/T06/T07/T08/R01/R02 et H-W18. La décision ne constitue ni une dette masquée ni une mesure acquise : c'est un changement explicite du jalon de réalisation autorisé par l'utilisateur.

## Retour W18 du 22 septembre 2026

À la demande des conditions écran/Hz, casque filaire/haut-parleurs et son entendu, Bluetooth, secteur/batterie/économie et activité en arrière-plan, l'utilisateur répond « Inconnu pour tout ». Ce retour est conservé comme tel. Il ne confirme pas de sortie sonore, d'écran à 60 Hz ou d'alimentation secteur. L'inventaire technique W18 déjà collecté reste une preuve datée distincte.

H-W18 reste **BLOCKED** pour les observations non établies. Aucune nouvelle demande des mêmes renseignements n'est faite à l'utilisateur après sa réponse ; le [formulaire](../../scripts/measurement/FORMULAIRE.md) et l'essai local restent disponibles pour une reprise ultérieure. Les décisions D04-03 et D04-04 ne reportent pas H-W18 et ne permettent pas de déclarer 0.4 acquise tant que ce contrôle obligatoire n'est pas satisfait.
