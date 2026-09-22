@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0collect-windows.ps1" -Machine W18
echo.
echo Joindre le fichier resultat-W18 et remplir FORMULAIRE.md.
echo Ouvrir essai-materiel.html dans chaque navigateur disponible.
pause
