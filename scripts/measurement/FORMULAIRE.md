# Relevé matériel — 0.4

Décompresser le paquet dans un dossier personnel. Aucune installation, Git ou compte nécessaire. Rien n'est envoyé automatiquement. Conserver les résultats originaux.

Windows : double-cliquer RELEVER-WINDOWS.cmd. Le collecteur utilise le PowerShell fourni avec Windows ; la politique Bypass concerne seulement ce processus, sans changement permanent.

Mac : double-cliquer RELEVER-MAC.command, saisir MI ou M1. Si macOS refuse l'exécution, ouvrir Terminal, saisir `bash ` puis glisser RELEVER-MAC.command dans la fenêtre et appuyer sur Entrée. Cela utilise les outils macOS déjà présents ; ne pas installer Python/Node/Xcode et ne pas modifier les protections globales. Si un refus persiste, noter le message et transmettre le résultat partiel.

Dans chaque navigateur déjà disponible (Chrome/Firefox, et Safari sur Mac), ouvrir essai-materiel.html, choisir le poste et lancer le relevé. Laisser la page visible cinq secondes. Essayer le son avec le casque filaire puis les haut-parleurs, à volume confortable ; Bluetooth, s'il existe, est un essai séparé. Enregistrer un résultat par navigateur/sortie. Ne pas installer ni rétrograder un navigateur pour ce relevé. Un navigateur absent est un obstacle à signaler ; l'agent prépare la suite technique.

À transmettre dans la tâche avec les fichiers resultat-*.json et essai-*.json :

| Observation | W18 | MI | M1 |
|---|---|---|---|
| Le poste correspond-il bien à PC génération 2018 / MacBook Intel / MacBook M1 ? Modèle ou année si connue | | | |
| Collecteur : réussi ou message d'obstacle | | | |
| Écran utilisé, résolution, Hz affichés dans les réglages (ou inconnu) | | | |
| Casque filaire : modèle, prise/interface, son entendu oui/non | | | |
| Haut-parleurs : modèle ou intégrés, son entendu oui/non | | | |
| Bluetooth : absent, non testé ou modèle + son entendu (séparément) | | | |
| Secteur ou batterie, mode économie d'énergie | | | |
| Applications actives ou activité notable (sauvegarde, antivirus, mise à jour) | | | |
| Réseau pendant l'essai : connecté / déconnecté ; aucun débit supposé | | | |
| Windows 10 : édition et maintenance ESU connue / inconnue ; Mac : mises à jour disponibles connues / inconnues | | | |
| Navigateurs absents, autres observations ou difficultés | | | |

Le relevé ne démontre pas les performances du futur produit. L'agent détermine PASS/FAIL/BLOCKED et Go/No-Go ; aucune décision Go/No-Go n'est demandée à l'utilisateur.
