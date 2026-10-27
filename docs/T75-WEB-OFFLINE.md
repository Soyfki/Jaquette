# T75 — volet Web de qualification hors ligne

Reprise du27octobre, depuis le commit local1362685 (diagnostic packaging) sur la branche T75.
La permission porte sur le Web avec le socle existant ; aucune dépendance, politique pnpm ou protection Windows
n'est modifiée. Le [blocage de packaging](T75-DEVELOPMENT-BLOCKER.md) reste applicable.

## Parcours livré

Construire avec `pnpm build`, puis servir `dist` sur une origine HTTPS ou loopback stable avec les routes SPA prévues.
`pnpm preview` fournit le serveur local de consultation du build. Le serveur Vite de développement n'est pas une
preuve de distribution : son absence de manifeste ne doit pas donner une préparation réussie.

Dans Paramètres, **Préparer la démonstration hors ligne** prépare les ressources publiques du build et une petite
fixture synthétique dans IndexedDB. Après fermeture complète du navigateur et arrêt du serveur, le même profil
retrouve la route/projet de qualification. Le bandeau compact précise cet état ; les rôles du prototype restent simulés.
Ce parcours ne lit pas de `.jacq`, n'importe pas d'EPUB/audio privé et ne qualifie pas un projet de production.

Le manifeste liste les ressources du build avec taille et SHA256. Le service worker vérifie chaque réponse et le
cache entier avant de publier son marqueur prêt. HTML/JS/CSS/polices/favicon restent publics ; la fixture privée est
séparée du cache d'assets. Les mises à jour échouées ne suppriment ni l'ancienne génération prête ni la fixture.
Un cache corrompu/incomplet n'est pas prêt ; une fixture illisible n'est jamais écrasée par une nouvelle préparation.
Les requêtes inconnues ne reçoivent pas arbitrairement index.html. Seules les routes de l'application sont repliées
vers son HTML ; aucun réseau extérieur n'est ajouté. L'installation/activation et la confirmation ont des délais bornés.
Après une issue incertaine, l'interface invite à vérifier l'état, sans rejouer automatiquement une écriture.

La préparation crée une nouvelle génération de cache. Les générations anciennes/partielles sont conservées,
sans nettoyage automatique des données ; l'espace peut donc croître et atteindre le quota navigateur. La préparation
refuse alors sans supprimer la dernière copie valide. Quota estimé et conservation par le navigateur ne sont pas des
garanties d'éviction impossible, de stockage durable, ni d'activation métier cinq jours.

## Commandes et preuves

```text
pnpm build
pnpm test:offline --help
pnpm test:offline --output test-results/tickets/T-75/NEW_RUN
pnpm validate:all
```

Le smoke exige Chrome installé et utilise uniquement ses propres profils/serveurs sur loopback, sandbox activée.
Il refuse une cible explicite existante ; sans argument il crée un répertoire unique sous test-results.
Il ferme ses propres ressources après succès ou erreur et conserve rapport/captures pour diagnostic.
`validate:all` inclut le smoke après la suite existante, sans ajout de dépendance ou tâche distante supplémentaire.

Oracles réels du build :

- Préparation, fermeture du navigateur/serveur, nouvelle instance du même profil, contexte offline et cache HTTP
  désactivé : mêmes IDs/marqueur, JS/CSS/polices servis par le service worker, navigation directe/reload/historique
  sur les routes prévues ; profil neuf offline indisponible honnêtement.
- Police manquante pendant préparation : aucun prêt publié ni projet créé.
- Nouvelle génération incomplète : ancienne génération prête et fixture conservées ; corruption ultérieure de
  police en cache détectée, sans effacement du projet.
- Fixture corrompue : diagnostic visible, aucune substitution silencieuse.
- QuotaExceededError injecté dans Cache.put du seul worker de test : ancienne copie prête et projet conservés.
- Fermeture du navigateur pendant une réponse retenue par le serveur de test : ancienne génération complète
  relue après réouverture. Ce n'est ni un arrêt brutal OS ni une preuve de durabilité physique.

Chaque run écrit report.json : SHA/arbre modifié, buildID, commande/dates/durée, Node/OS/user agent,
requêtes du serveur possédé, réponses cache et résultats détaillés. Les mesures avant commit sont intermédiaires ;
les preuves finales doivent viser le SHA effectivement construit. Les captures servent à la revue visuelle technique,
pas à une validation artistique/humaine. Les rapports d'échec sont conservés, notamment la première attente de titre
incorrecte corrigée pour respecter le titre original de Jaquette.

## Limites conservées

Le critère AT1 couvre aussi les builds Windows distribués : il reste décoché tant que ce volet manque.
Le critère AT2 porte sur le renderer/preload/IPC Electron réel : non implémenté, non prouvé.
Chrome Windows headless n'est ni Safari/macOS/M1, ni un atelier humain, ni un câble physiquement retiré.
Quota réel saturé, crash OS/coupure, garanties de stockage physique, format projet et intégration de PR17 restent
hors de ces preuves. Aucun script electron-winstaller n'est approuvé ou relancé ; aucun host Windows n'est annoncé.
Publication T75, revue indépendante et validation humaine restent des étapes distinctes.
