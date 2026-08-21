# Scénario de doublage de référence

## But

Ce scénario sert de référence fonctionnelle au socle de Jaquette : importer un EPUB reflowable, générer des ancres textuelles stables, associer un SFX, une Ambiance et une Musique à des mots, sauvegarder, fermer, rouvrir et retrouver exactement les mêmes associations.

EPUB principal : `reference-data/files/epubs/fr-le-tour-du-monde-en-quatre-vingts-jours.epub`, *Le Tour du monde en quatre-vingts jours* de Jules Verne, édition numérique Project Gutenberg nº 46541 sans images.

Les citations ci-dessous désignent les plages textuelles attendues. Elles ne constituent pas des coordonnées et ne préjugent pas de l’algorithme futur de tokenisation.

## Annotations attendues

### 1. SFX — heurtoir de porte

- Chapitre : **I** (`OEBPS/5818779115302616095_46541-h-0.htm.html#ch-1`).
- Déclencheur recommandé : le mot **« frappa »** dans la phrase **« En ce moment, on frappa à la porte du petit salon dans lequel se tenait Phileas Fogg. »**
- Média : `reference-data/files/audio/sfx-door-knocker.ogg`.
- Comportement : lecture unique dès l’activation du mot ; le SFX joue jusqu’à sa fin.
- Intention : vérifier l’ancrage précis à un mot et le déclenchement ponctuel.

### 2. Ambiance — pluie nocturne

- Chapitre : **IV** (`OEBPS/5818779115302616095_46541-h-0.htm.html#ch-4`).
- Début de plage : **« La nuit était noire. »**
- Fin de plage : **« Passepartout, encore abasourdi, pressait machinalement contre lui le sac aux bank-notes. »**
- Passage inclus : **« Il tombait une pluie fine. »**
- Média : `reference-data/files/audio/ambience-rain.ogg`.
- Comportement : boucle activée sur toute la plage, volume réduit, fade-in sur les premiers mots et fade-out sur les derniers mots.
- Intention : vérifier une plage longue, une boucle et des fades liés au texte plutôt qu’à une durée fixe.

### 3. Musique — traversée en musique

- Chapitre : **IX** (`OEBPS/5818779115302616095_46541-h-1.htm.html#ch-9`).
- Début de plage : **« On faisait de la musique, on dansait même, quand la mer le permettait. »**
- Fin de plage : **« chants et danses cessaient à la fois. »**
- Média : `reference-data/files/audio/music-fur-elise.ogg`.
- Comportement : lecture unique, sans boucle, fade-in et fade-out textuels ; aucune autre musique principale active sur la même plage.
- Intention : vérifier une plage musicale, la règle d’une seule musique principale et l’arrêt en fin de plage.

## Procédure de référence

1. importer l’EPUB français sans modifier son texte ;
2. ouvrir les chapitres I, IV et IX et retrouver les passages ci-dessus ;
3. créer les trois annotations avec les réglages indiqués ;
4. vérifier que le SFX, l’Ambiance et la Musique restent distinguables par leur type, pas uniquement par leur couleur ;
5. simuler la lecture des plages et confirmer les déclenchements ;
6. sauvegarder le projet `.jacq`, fermer Jaquette, puis le rouvrir ;
7. confirmer que chaque annotation retrouve le même chapitre, le même mot ou la même plage et le même média ;
8. vérifier que les trois médias utilisés ont été copiés dans le projet et ne dépendent plus du dossier de référence ;
9. contrôler qu’aucune annotation ne traverse une limite de chapitre.

## Résultat attendu

Après réouverture, les trois associations textuelles sont strictement identiques à celles créées avant fermeture. La simulation conserve les comportements de lecture, de boucle et de fade. Toute dérive d’ancrage, perte de média ou dépendance à des coordonnées d’affichage constitue un échec du scénario.
