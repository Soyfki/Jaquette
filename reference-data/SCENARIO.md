# Scénario de doublage de référence

## But

Ce scénario sert de référence fonctionnelle au socle de Jaquette : importer un EPUB reflowable, générer des ancres textuelles stables, associer un SFX, une Ambiance et une Musique à des mots, sauvegarder, fermer, rouvrir et retrouver exactement les mêmes associations.

EPUB principal : `reference-data/files/epubs/fr-une-etude-en-rouge.epub`, *Une étude en rouge* d’Arthur Conan Doyle, édition Ebooks libres et gratuits.

Les citations ci-dessous désignent les plages textuelles attendues. Elles ne constituent pas des coordonnées et ne préjugent pas de l’algorithme futur de tokenisation.

## Annotations attendues

### 1. SFX — heurtoir de porte

- Chapitre : **II — La science de la déduction** (`Ops/004.html`).
- Déclencheur recommandé : le mot **« frapper »** dans la phrase « Nous entendîmes frapper bruyamment à la porte d’entrée ».
- Média : `reference-data/files/audio/sfx-door-knocker.ogg`.
- Comportement : lecture unique dès l’activation du mot ; le SFX joue jusqu’à sa fin.
- Intention : vérifier l’ancrage précis à un mot et le déclenchement ponctuel.

### 2. Ambiance — pluie nocturne

- Chapitre : **XIII — Suite des Mémoires du docteur John Watson** (`Ops/015.html`).
- Début de plage : **« Un vent violent soufflait, la pluie tombait à torrents. »**
- Fin de plage : **« on n’entendait pas d’autre bruit que le clapotement de la pluie. »**
- Média : `reference-data/files/audio/ambience-rain.ogg`.
- Comportement : boucle activée sur toute la plage, volume réduit, fade-in sur les premiers mots et fade-out sur les derniers mots.
- Intention : vérifier une plage longue, une boucle et des fades liés au texte plutôt qu’à une durée fixe.

### 3. Musique — réflexion au violon

- Chapitre : **II — La science de la déduction** (`Ops/004.html`).
- Début de plage : **« Le soir, renversé dans son fauteuil, il fermait les yeux »**.
- Fin de plage : **« une légère compensation. »**
- Média : `reference-data/files/audio/music-fur-elise.ogg`.
- Comportement : lecture unique, sans boucle, fade-in et fade-out textuels ; aucune autre musique principale active sur la même plage.
- Intention : vérifier une plage musicale, la règle d’une seule musique principale et l’arrêt en fin de plage.

## Procédure de référence

1. importer l’EPUB français sans modifier son texte ;
2. ouvrir les chapitres II et XIII et retrouver les passages ci-dessus ;
3. créer les trois annotations avec les réglages indiqués ;
4. vérifier que le SFX, l’Ambiance et la Musique restent distinguables par leur type, pas uniquement par leur couleur ;
5. simuler la lecture des plages et confirmer les déclenchements ;
6. sauvegarder le projet `.jacq`, fermer Jaquette, puis le rouvrir ;
7. confirmer que chaque annotation retrouve le même chapitre, le même mot ou la même plage et le même média ;
8. vérifier que les trois médias utilisés ont été copiés dans le projet et ne dépendent plus du dossier de référence ;
9. contrôler qu’aucune annotation ne traverse une limite de chapitre.

## Résultat attendu

Après réouverture, les trois associations textuelles sont strictement identiques à celles créées avant fermeture. La simulation conserve les comportements de lecture, de boucle et de fade. Toute dérive d’ancrage, perte de média ou dépendance à des coordonnées d’affichage constitue un échec du scénario.
