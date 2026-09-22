# Matrice matérielle et navigateurs — gel du 18 septembre 2026

Les configurations 8 Go/SSD du plan sont des propositions initiales. Seul le relevé réel fait foi. [D04-04](DECISIONS.md) fixe W18 comme seul poste de développement (étapes 0 à 13), M1 uniquement aux tests finaux 14 à 16, et retire Mac Intel du périmètre. L'absence de Mac ne bloque aucun PASS/Go de 0.4.

| Poste | Affectation | Configuration réelle | État du relevé |
|---|---|---|---|
| W18 | PC courant confirmé par l'utilisateur le 18 septembre 2026 | i5-4690K, 4 cœurs/4 threads, x64 ; 16 Gio installés ; MSI MS-7917 ; GTX 1060 6GB ; Windows 10 Famille 22H2 19045.6466 | Collecté réellement ; conditions audio/écran/alimentation à compléter |
| M1 | MacBook M1, seul Mac cible | CPU, cœurs, RAM, stockage, GPU, OS et navigateurs inconnus | Relevé et essais uniquement aux phases finales 14 à 16 (D04-04) ; aucun PASS anticipé, non bloquant pour 0.4 |

Le 22 septembre 2026, l'utilisateur remplace le premier report D04-03 par D04-04 : W18 uniquement pendant le développement, retrait d'Intel, M1 en fin de parcours. Aucun relevé Intel n'est attendu. Pour W18, sa réponse aux conditions écran/Hz, audio, Bluetooth, alimentation/économie et activité reste « Inconnu pour tout ». H-W18 reste BLOCKED indépendamment des Mac ; les valeurs détectées ci-dessous ne sont pas transformées en observations physiques confirmées.

Relevé W18 **18 septembre 2026 à 12:34:30 UTC**, collecteur du SHA `d039e96211aca079dad25d4d9756822641a0a0c3`, PowerShell Windows 5.1 hors sandbox après obstacle CIM explicite. RAM : quatre modules de 4 294 967 296 octets, total installé 17 179 869 184 octets (16 Gio) ; mémoire physique exposée à l'OS 17 125 875 712 octets. CPU annoncé 3,50 GHz, quatre cœurs/logiques. Cette machine identifiée W18 par l'utilisateur n'est donc pas remplacée par l'hypothèse 8 Go/graphique intégré du plan.

| Stockage réel W18 | Capacité utile volume | Libre au relevé | Support |
|---|---:|---:|---|
| C: NTFS, dossier de test | 499 431 501 824 octets | 336 269 361 152 octets | NVMe CT500P1SSD8, SSD physique 500 107 862 016 octets |
| D: NTFS | 499 612 905 472 octets | 418 477 158 400 octets | ST9500325AS, HDD SATA physique 500 107 862 016 octets |

Pilote graphique 32.0.15.6094 ; WMI rapporte 1920 × 1200 et 59 Hz, à confirmer dans les réglages (ne pas assimiler automatiquement à 60 Hz). Le nom GPU contient 6GB mais AdapterRAM WMI retourne 4 293 918 720 octets : limitation connue du compteur, aucune mémoire GPU déduite de cette valeur tronquée. Sorties détectées : NVIDIA/Realtek High Definition Audio et deux périphériques Steam Streaming ; la sortie réellement utilisée et son branchement restent une observation humaine. Aucun statut batterie détecté n'est une preuve d'alimentation secteur. Chrome 152.0.7977.84 détecté, Firefox non trouvé aux emplacements standards et aucun processus Firefox. ESU inconnu. 507 processus et CPU ponctuel 23 % pendant collecte : aucune mesure B11, ni état de repos revendiqué.

Le JSON original sans numéro de série, réseau ni compte est conservé hors Git dans les preuves locales de la campagne. Les valeurs de capacité libre et d'activité sont datées et ne décrivent pas un état permanent.

## Versions retenues à qualifier

« Précédente supportée » désigne le périmètre de compatibilité Jaquette retenu pour cette campagne, sans prétendre que l'éditeur maintient éternellement cette version. Les anciennes versions seront testées par le responsable en environnement isolé et profil de test, sans rétrograder l'installation personnelle. L'utilisateur n'a pas à installer de navigateur pour le relevé 0.4.

| Cellule Web | Stable retenue | Précédente retenue | Mesure produit actuelle |
|---|---|---|---|
| W18 Chrome | 153.0.8010.52 | 152.0.7977.120 (Extended Stable) | PLANNED |
| W18 Firefox | 156.0 | 155.0 | PLANNED |
| M1 Chrome | 153.0.8010.52 | 152.0.7977.120 (Extended Stable) | PLANNED uniquement phases finales 14 à 16 |
| M1 Firefox | 156.0 | 155.0 | PLANNED uniquement phases finales 14 à 16 |
| M1 Safari réel | 27.0 | 26.6.1 | PLANNED uniquement phases finales 14 à 16 ; disponibilité selon macOS à relever |

Les builds exacts effectivement exécutés figurent dans chaque résultat, y compris build Safari couplé à l'OS. Un déploiement Chrome proposant .53 à la place de .52 exige une ligne d'environnement distincte ; ce n'est pas une permission de mélanger les échantillons. Chrome local 152.0.7977.84 utilisé historiquement n'est pas silencieusement assimilé au patch précédent .120 retenu. La sélection M1 sera actualisée et historisée avant les tests finaux, pas pendant 0.4. Une paire M1 alors indisponible bloque sa qualification finale uniquement ; aucun WebKit Playwright, runner cloud ni émulateur ne vaut Safari réel ou relevé de machine.

Sources consultées le 18 septembre 2026 : [Chrome stable 153.0.8010.52/.53](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop_0194356994.html), [Chrome Extended Stable 152.0.7977.120](https://chromereleases.googleblog.com/2026/09/extended-stable-update-for-desktop.html), [Firefox 156.0](https://www.firefox.com/en-US/firefox/156.0/releasenotes/), [Firefox 155.0](https://www.firefox.com/en-US/firefox/155.0/releasenotes/), [Safari 27 et 26.6.1](https://support.apple.com/en-us/100100). Ces pages justifient la sélection, pas une exécution de ces versions sur les postes.

## Compatibilité, maintenance, disponibilité : trois colonnes distinctes

- Compatibilité technique : Chrome annonce Windows 10+ et macOS 13+ dans sa [configuration requise](https://support.google.com/chrome/a/answer/7100626?hl=fr). Vérifier chaque version retenue et le macOS réel avant sa campagne ; l'exécution réussie d'un collecteur ne prouve pas l'application entière.
- Maintenance OS : [Windows 10 standard a atteint sa fin de support le 14 octobre 2025](https://learn.microsoft.com/en-us/windows/release-health/release-information). Relever édition/build et couverture ESU connue ou inconnue, sans déduire l'inscription ESU d'un numéro de build. Le poste W18 reste une cible. Pour M1 aux phases finales, confronter modèle et OS réellement relevés aux [mises à jour Apple](https://support.apple.com/en-us/100100), sans supposer une version installée.
- Disponibilité navigateur : consigner version installée et version réellement lançable. Safari 27 est annoncé pour Sequoia/Tahoe, mais cela ne permet pas de supposer l'OS d'un Mac absent. Une version retenue non disponible demeure une cellule bloquée, pas supprimée. Les patches et minima devront être revérifiés au lancement d'une future campagne datée ; toute révision de la matrice conserve l'historique.

## Desktop futur

Windows x64 natif sur W18 pendant le développement ; macOS arm64 natif sur M1 uniquement aux phases finales 14 à 16. Aucun build/test macOS x64 Intel requis. Version Electron et installateurs non choisis en 0.4 : Windows en 1.3, M1 en 14.2. Chaque rapport inclura Electron/Chromium/Node embarqués et hash d'installateur. Rosetta n'est pas une mesure native M1 ; Windows ARM/émulation ou navigateur de développement ne remplace aucune cellule.

## Conditions et observations manquantes

Le [formulaire](../../scripts/measurement/FORMULAIRE.md) demande seulement ce qui ne peut être inféré : identité du poste, écran actif et Hz, sortie casque/haut-parleurs, Bluetooth séparé, secteur/économie, activité parasite, réseau utilisé et obstacles. Les collecteurs autorisent seulement les champs utiles, sans nom de machine/utilisateur, numéro de série, UUID ou adresse réseau. Le résultat d'une requête impossible est null avec obstacle, jamais 0 inventé. Les navigateurs non trouvés dans les emplacements usuels sont signalés ; la page HTML enregistre la version effectivement ouverte.

Les profils réseau nominal/dégradé/offline sont définis dans P14 des [protocoles](PROTOCOLS.md) ; le relevé domestique n'affirme aucun shaping réalisé. L'audio HTML est un essai de sortie à faible niveau, pas une mesure de latence ni une qualification du futur moteur.
