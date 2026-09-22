#!/bin/bash
set -eu
cd -- "$(dirname -- "$0")"
echo 'Tests finaux (phases 14 a 16) uniquement. Repere du poste : saisir M1.'
read -r machine
case "$machine" in M1) ;; *) echo 'Repere invalide : seul M1 est dans le perimetre Mac'; exit 1 ;; esac
result="resultat-${machine}-$(date -u +%Y%m%d-%H%M%S).json"
set -C
/usr/bin/osascript -l JavaScript collect-macos.js "$machine" > "$result"
echo "Releve termine : $result. Joindre le resultat et FORMULAIRE.md."
echo 'Ouvrir essai-materiel.html dans chaque navigateur disponible.'
read -r -p 'Entree pour fermer. ' unused
