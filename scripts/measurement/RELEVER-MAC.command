#!/bin/bash
set -eu
cd -- "$(dirname -- "$0")"
echo 'Repere du poste : MI (Mac Intel) ou M1 ?'
read -r machine
case "$machine" in MI|M1) ;; *) echo 'Repere invalide'; exit 1 ;; esac
result="resultat-${machine}-$(date -u +%Y%m%d-%H%M%S).json"
set -C
/usr/bin/osascript -l JavaScript collect-macos.js "$machine" > "$result"
echo "Releve termine : $result. Joindre le resultat et FORMULAIRE.md."
echo 'Ouvrir essai-materiel.html dans chaque navigateur disponible.'
read -r -p 'Entree pour fermer. ' unused
