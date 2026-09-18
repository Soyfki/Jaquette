# Matrice matérielle et navigateurs — gel du 18 septembre 2026

Les configurations 8 Go/SSD du plan sont des propositions initiales. Seul le relevé réel fait foi ; aucune machine demandée n'est retirée si une version ne s'y installe pas.

| Poste | Affectation | Configuration réelle | État du relevé |
|---|---|---|---|
| W18 | PC courant confirmé par l'utilisateur le 18 septembre 2026 | Collecteur Windows exécuté dans la campagne, résultat original et résumé liés dans la PR | Conditions audio/écran/alimentation à compléter par observation |
| MI | MacBook Intel avant M1 | CPU, cœurs, RAM, stockage, GPU, OS et navigateurs inconnus | BLOCKED : poste inaccessible |
| M1 | MacBook M1 | CPU, cœurs, RAM, stockage, GPU, OS et navigateurs inconnus | BLOCKED : poste inaccessible |

## Versions retenues à qualifier

« Précédente supportée » désigne le périmètre de compatibilité Jaquette retenu pour cette campagne, sans prétendre que l'éditeur maintient éternellement cette version. Les anciennes versions seront testées par le responsable en environnement isolé et profil de test, sans rétrograder l'installation personnelle. L'utilisateur n'a pas à installer de navigateur pour le relevé 0.4.

| Cellule Web | Stable retenue | Précédente retenue | Mesure produit actuelle |
|---|---|---|---|
| W18 Chrome | 153.0.8010.52 | 152.0.7977.120 (Extended Stable) | PLANNED |
| W18 Firefox | 156.0 | 155.0 | PLANNED |
| MI Chrome | 153.0.8010.52 | 152.0.7977.120 (Extended Stable) | PLANNED |
| MI Firefox | 156.0 | 155.0 | PLANNED |
| MI Safari réel | 27.0 | 26.6.1 | PLANNED ; disponibilité selon macOS à relever |
| M1 Chrome | 153.0.8010.52 | 152.0.7977.120 (Extended Stable) | PLANNED |
| M1 Firefox | 156.0 | 155.0 | PLANNED |
| M1 Safari réel | 27.0 | 26.6.1 | PLANNED ; disponibilité selon macOS à relever |

Les builds exacts effectivement exécutés figurent dans chaque résultat, y compris build Safari couplé à l'OS. Un déploiement Chrome proposant .53 à la place de .52 exige une ligne d'environnement distincte ; ce n'est pas une permission de mélanger les échantillons. Chrome local 152.0.7977.84 utilisé historiquement n'est pas silencieusement assimilé au patch précédent .120 retenu. Une paire indisponible sur MI/M1 reste BLOCKED avec décision de compatibilité à instruire ; aucun WebKit Playwright, runner cloud ni émulateur ne vaut Safari réel ou relevé de machine.

Sources consultées le 18 septembre 2026 : [Chrome stable 153.0.8010.52/.53](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop_0194356994.html), [Chrome Extended Stable 152.0.7977.120](https://chromereleases.googleblog.com/2026/09/extended-stable-update-for-desktop.html), [Firefox 156.0](https://www.firefox.com/en-US/firefox/156.0/releasenotes/), [Firefox 155.0](https://www.firefox.com/en-US/firefox/155.0/releasenotes/), [Safari 27 et 26.6.1](https://support.apple.com/en-us/100100). Ces pages justifient la sélection, pas une exécution de ces versions sur les postes.

## Compatibilité, maintenance, disponibilité : trois colonnes distinctes

- Compatibilité technique : Chrome annonce Windows 10+ et macOS 13+ dans sa [configuration requise](https://support.google.com/chrome/a/answer/7100626?hl=fr). Vérifier chaque version retenue et le macOS réel avant sa campagne ; l'exécution réussie d'un collecteur ne prouve pas l'application entière.
- Maintenance OS : [Windows 10 standard a atteint sa fin de support le 14 octobre 2025](https://learn.microsoft.com/en-us/windows/release-health/release-information). Relever édition/build et couverture ESU connue ou inconnue, sans déduire l'inscription ESU d'un numéro de build. Le poste W18 reste une cible. Pour Mac, confronter modèle et OS aux [mises à jour Apple](https://support.apple.com/en-us/100100), sans supposer que tout Intel reçoit macOS 27.
- Disponibilité navigateur : consigner version installée et version réellement lançable. Safari 27 est annoncé pour Sequoia/Tahoe, mais cela ne permet pas de supposer l'OS d'un Mac absent. Une version retenue non disponible demeure une cellule bloquée, pas supprimée. Les patches et minima devront être revérifiés au lancement d'une future campagne datée ; toute révision de la matrice conserve l'historique.

## Desktop futur

Windows x64 natif sur W18 ; macOS x64 natif sur MI ; macOS arm64 natif sur M1. Version Electron et installateurs non choisis en 0.4 : prérequis de 1.3/14. Chaque rapport inclura Electron/Chromium/Node embarqués et hash d'installateur. Rosetta n'est pas une mesure native M1 ; Windows ARM/émulation ou navigateur de développement ne remplace aucune cellule.

## Conditions et observations manquantes

Le [formulaire](../../scripts/measurement/FORMULAIRE.md) demande seulement ce qui ne peut être inféré : identité du poste, écran actif et Hz, sortie casque/haut-parleurs, Bluetooth séparé, secteur/économie, activité parasite, réseau utilisé et obstacles. Les collecteurs autorisent seulement les champs utiles, sans nom de machine/utilisateur, numéro de série, UUID ou adresse réseau. Le résultat d'une requête impossible est null avec obstacle, jamais 0 inventé. Les navigateurs non trouvés dans les emplacements usuels sont signalés ; la page HTML enregistre la version effectivement ouverte.

Les profils réseau nominal/dégradé/offline sont définis dans P14 des [protocoles](PROTOCOLS.md) ; le relevé domestique n'affirme aucun shaping réalisé. L'audio HTML est un essai de sortie à faible niveau, pas une mesure de latence ni une qualification du futur moteur.
