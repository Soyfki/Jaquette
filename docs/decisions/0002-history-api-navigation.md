# Décision d’implémentation 0002 — Navigation du shell Web

- Statut : retenue pour la sous-étape 1.2, révisable
- Date : 2026-08-23
- Version de l’application : 0.0.0

## Contexte

La sous-étape 1.2 doit fournir cinq URL directement accessibles, une navigation sans rechargement complet, un historique Précédent/Suivant fiable et une mise à jour accessible du titre et du focus. Aucune bibliothèque de navigation n’était validée et le prototype ne comporte ni route imbriquée, ni chargement de données par route, ni garde d’authentification.

Cette décision est un choix d’implémentation. Elle ne crée aucune règle produit.

## Choix

Le shell utilise l’API History du navigateur avec un routeur local minimal :

- `history.pushState` pour les navigations internes ;
- un écouteur `popstate` pour restaurer l’écran lors de Précédent et Suivant ;
- `history.replaceState` pour rendre `/accueil` canonique lors d’une entrée sur `/` ;
- une table locale des chemins `/connexion`, `/accueil`, `/projet`, `/parametres` et `/fondations` ;
- un écran introuvable explicite pour toute autre URL ;
- une mise à jour du titre et un déplacement du focus vers le titre principal après chaque changement d’écran.

Le serveur Vite fournit le repli HTML nécessaire aux entrées directes pendant cette phase Web.

## Justification

Les besoins de 1.2 sont suffisamment limités pour être couverts de façon lisible et testable avec les API natives. Ajouter une dépendance de routage n’apporterait pas de bénéfice nécessaire à cette livraison et augmenterait le socle à maintenir.

Le routeur local conserve les liens HTML réels : les URL restent copiables et une interaction modifiée peut suivre le comportement natif du navigateur.

## Alternatives évaluées

### Bibliothèque de routage légère

Écartée pour 1.2 car le prototype n’a pas encore besoin de routes imbriquées, de paramètres, de chargement de données, de garde ou de gestion d’erreurs par branche. Cette option devra être réévaluée si ces besoins apparaissent.

### Navigation par fragments

Écartée car des chemins lisibles et directement accessibles sont attendus. Les fragments restent réservés aux ancres internes, notamment au lien d’évitement.

### État React sans URL

Écarté car il ne permettrait ni entrée directe, ni partage d’adresse, ni restauration fiable par Précédent et Suivant.

## Conséquences

- aucune dépendance ni modification du lockfile ;
- le shell et l’historique restent couverts par des tests de composants et Chrome ;
- le déploiement futur devra conserver un repli vers `index.html` pour les chemins applicatifs ;
- les besoins avancés de navigation restent ouverts et pourront conduire à remplacer ce routeur sans modifier les règles métier ;
- l’authentification réelle, les permissions et la persistance restent hors périmètre.
