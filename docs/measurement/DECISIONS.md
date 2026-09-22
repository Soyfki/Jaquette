# Décisions de périmètre — mesures 0.4

## D04-03 — Reporter les relevés Mac à la qualification macOS

Le 22 septembre 2026, l'utilisateur indique ne posséder aucun des deux Mac et choisit explicitement : « Reporter les relevés Mac à la qualification macOS ». Cette décision remplace uniquement l'exigence de disposer des deux relevés Mac pour le Go de 0.4 dans le prompt initial. Elle ne modifie aucun seuil ni aucune cible produit.

- T05 (collecteurs natifs MI/M1), H-MI et H-M1 sortent des contrôles obligatoires de **0.4**. Leurs résultats historiques BLOCKED sont conservés ; aucun ne devient PASS.
- MI (MacBook Intel avant M1), M1 (MacBook M1), Chrome/Firefox/Safari réel et Desktop natif restent des cibles obligatoires. Les collecteurs, protocoles et formulaires restent livrés.
- Le responsable de la première qualification macOS reprend ces trois contrôles avant de déclarer cette plateforme validée, dès les essais concernés de 1.3, puis pour la distribution 14.2 et la matrice complète 15.1. Sans relevés et observations réels, la qualification macOS reste BLOCKED / NO-GO ; ni runner cloud, ni émulation, ni WebKit Playwright ne les remplacent.
- La campagne 0.4 compte désormais dix contrôles obligatoires : T01/T02/T03/T04/T06/T07/T08/R01/R02 et H-W18. La décision ne constitue ni une dette masquée ni une mesure acquise : c'est un changement explicite du jalon de réalisation autorisé par l'utilisateur.

## Retour W18 du 22 septembre 2026

À la demande des conditions écran/Hz, casque filaire/haut-parleurs et son entendu, Bluetooth, secteur/batterie/économie et activité en arrière-plan, l'utilisateur répond « Inconnu pour tout ». Ce retour est conservé comme tel. Il ne confirme pas de sortie sonore, d'écran à 60 Hz ou d'alimentation secteur. L'inventaire technique W18 déjà collecté reste une preuve datée distincte.

H-W18 reste **BLOCKED** pour les observations non établies. Aucune nouvelle demande des mêmes renseignements n'est faite à l'utilisateur après sa réponse ; le [formulaire](../../scripts/measurement/FORMULAIRE.md) et l'essai local restent disponibles pour une reprise ultérieure. D04-03 ne reporte pas H-W18 et ne permet pas de déclarer 0.4 acquise tant que ce contrôle obligatoire n'est pas satisfait.
