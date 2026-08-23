# Collaboration offline et échanges `.chpt`

> **Document secondaire REC-01 — 2026-08-23**
>
> Cette synthèse facilite la lecture et les tests. Elle ne remplace pas les trois sources de vérité : [`AGENTS.md`](../AGENTS.md), le [cahier des charges](../CAHIER_DES_CHARGES_JAQUETTE.md) et le [plan de développement](../PLAN_DE_DEVELOPPEMENT_JAQUETTE.md).

## Décision produit

La collaboration sur le contenu est locale et asynchrone. L’ancien modèle de collaboration temps réel est abandonné : aucun utilisateur ne voit la présence, le curseur, la sélection ou les modifications live d’un autre utilisateur.

L’ancien objet fonctionnel de ticket est également abandonné. Le travail actionnable provient uniquement de tâches générées par les affectations et le workflow ; les échanges éditoriaux utilisent des commentaires contextualisés.

L’expression « accueil façon Figma » décrit seulement l’organisation visuelle de l’accueil.

## Unités de travail

### Projet `.jacq`

Le `.jacq` reste le fichier de travail éditable représentant le projet complet. Il contient une section physique `.chpt` par chapitre et une section commune séparée.

Une modification de chapitre doit pouvoir réécrire physiquement son seul `.chpt`, sans réécrire les autres chapitres. Le projet reste autonome et embarque les médias réellement utilisés.

Le conteneur, la sérialisation, le schéma et la stratégie de version ne sont pas décidés. En particulier, cette documentation n’impose pas ZIP.

### Chapitre `.chpt`

`.chpt` est l’unité physique de sauvegarde, d’échange, d’import et de fusion d’un chapitre.

Un export transporte au minimum :

- identité du projet et du livre ;
- identifiant stable du chapitre ;
- base et filiation utiles à la détection des conflits ;
- données de doublage ;
- annotations et réglages audio ;
- médias réellement utilisés par le chapitre ;
- commentaires du chapitre, de son texte et de ses occurrences audio ;
- tâches liées au chapitre ;
- validations et historique ;
- auteur, dates et informations d’audit nécessaires.

Les médias identiques sont dédupliqués par empreinte.

### Informations communes

Les métadonnées du livre, paramètres généraux, commentaires ciblant le livre et autres informations communes restent hors des `.chpt`.

Une divergence commune ne se résout jamais automatiquement. Le Chef d’équipe arbitre ; dans un workspace d’Auteur indépendant, l’Auteur indépendant arbitre. La décision est journalisée.

## Cycle d’une candidate

1. Un Sound Designer travaille localement sur un chapitre.
2. Il exporte un `.chpt` candidat.
3. Le fichier est importé pour révision sans écraser la version validée.
4. Les Réviseurs contrôlent la candidate.
5. Après l’approbation de tous les Réviseurs affectés, la candidate devient la version validée du chapitre dans le `.jacq`.

Une modification d’un chapitre déjà validé annule ses validations actives et le replace à réviser. Les validations précédentes restent dans l’historique.

## Règles de fusion

| Situation | Résultat autorisé |
|---|---|
| Chapitres différents, identité et filiation compatibles | Intégration sans conflit et sans réécriture des autres `.chpt` |
| Même chapitre, deux versions concurrentes | Deux candidates distinctes ; choix d’une version complète par un Réviseur, puis validations normales |
| Origine incompatible ou filiation inconnue | Intégration silencieuse refusée, conflit explicite |
| Informations communes divergentes | Arbitrage explicite du Chef d’équipe ou de l’Auteur indépendant |
| Média identique dans plusieurs chapitres | Déduplication par empreinte |

Aucun merge détaillé des annotations ou réglages de deux candidates concurrentes n’est effectué. Le choix d’une candidate ne vaut pas validation. Une candidate écartée reste consultable avec son auteur, sa base, sa date et la décision. Aucun fichier n’est détruit silencieusement.

## Tâches de workflow

Une tâche est générée automatiquement, cible un livre ou un chapitre, possède un assigné et peut avoir une échéance. Elle ne possède aucune priorité et ne peut pas être créée librement comme dans un gestionnaire générique.

Ses seuls statuts sont :

- `Pas commencé` à la création ;
- `En cours`, activé manuellement lorsque l’utilisateur commence ;
- `Terminée`, appliqué automatiquement lorsque l’action métier attendue est accomplie.

Cas obligatoires :

- doubler un chapitre ;
- réviser un chapitre ;
- publier un livre dans Jacques ;
- corriger un chapitre invalidé.

Chaque invalidation génère une nouvelle occurrence de tâche de correction. Les cycles précédents restent intacts. Les tâches d’un chapitre voyagent avec son `.chpt` ; celles du livre restent dans la section commune du `.jacq`.

## Commentaires contextualisés

Les quatre cibles officielles sont :

1. livre entier ;
2. chapitre entier ;
3. mot ou plage de mots ;
4. occurrence audio dans la timeline textuelle.

Un commentaire sur une occurrence audio ne cible jamais le fichier de bibliothèque. L’interface le présente dans la vue globale, l’espace du chapitre, le passage textuel ou l’annotation/inspecteur selon sa cible.

Les réponses forment un fil. Les seuls états sont `Ouvert` et `Résolu`. L’auteur, les dates et l’historique des modifications sont conservés ; aucune suppression définitive n’est autorisée. Des identifiants stables empêchent la duplication lors d’imports répétés.

Une invalidation exige un commentaire expliquant la correction et déclenche la nouvelle tâche de correction.

## Audit minimal

Le journal comprend au minimum :

- génération, changement de statut, assignation et achèvement d’une tâche ;
- export et import d’un `.chpt` ;
- détection d’un conflit ;
- sélection d’une candidate ;
- intégration d’un chapitre validé ;
- arbitrage des informations communes ;
- création, réponse, résolution et modification d’un commentaire.

## Simulations documentaires REC-01

### 1. Deux chapitres différents

Préconditions : Alice et Bilal partent du même `.jacq`. Alice modifie le chapitre A, Bilal le chapitre B.

Résultat attendu :

- les deux `.chpt` portent une identité et une filiation compatibles ;
- l’import crée deux candidates indépendantes ;
- chaque candidate suit sa révision ;
- leur intégration ne réécrit ni n’écrase l’autre chapitre ;
- un média commun est dédupliqué par empreinte.

Conclusion documentaire : **PASS**.

### 2. Deux versions du même chapitre

Préconditions : Alice et Bilal exportent chacun le chapitre A depuis la même base.

Résultat attendu :

- deux candidates distinctes restent consultables ;
- aucun merge détaillé n’est effectué ;
- un Réviseur choisit une version complète ;
- ce choix ne la valide pas ;
- la candidate écartée reste dans l’historique avec auteur, base, date et décision.

Conclusion documentaire : **PASS**.

### 3. Plusieurs Réviseurs

Préconditions : trois Réviseurs sont affectés à la candidate choisie.

Résultat attendu :

- les validations 1/3 puis 2/3 ne suffisent pas ;
- la candidate devient validée à 3/3 ;
- elle seule peut alors être intégrée comme version validée du chapitre.

Conclusion documentaire : **PASS**.

### 4. Invalidation et nouvelle tâche

Préconditions : une candidate est invalidée avec un commentaire explicatif.

Résultat attendu :

- une nouvelle tâche « corriger le chapitre » est créée avec `Pas commencé` ;
- l’ancienne tâche n’est ni rouverte ni supprimée ;
- le Sound Designer la passe manuellement à `En cours` ;
- l’action métier accomplie la passe automatiquement à `Terminée` ;
- commentaire, tâche, validations et historique voyagent avec le prochain `.chpt`.

Conclusion documentaire : **PASS**.

### 5. Conflit sur les informations communes

Préconditions : deux copies modifient différemment une métadonnée du livre.

Résultat attendu :

- aucun `.chpt` ne décide de la valeur ;
- aucune valeur ne gagne automatiquement ;
- le Chef d’équipe arbitre dans une Maison d’édition ;
- l’Auteur indépendant arbitre dans son workspace ;
- la décision est journalisée.

Conclusion documentaire : **PASS**.

## Décisions techniques laissées ouvertes

- technologie du conteneur `.jacq` ;
- sérialisation et schéma de `.jacq` et `.chpt` ;
- stratégie et champs de version de `.jacq` et `.chpt` ;
- mécanisme d’écriture partielle et atomique ;
- canal de transport des `.chpt` ;
- empreinte et stratégie physique de déduplication ;
- interface exacte de comparaison et de sélection des candidates ;
- politique de récupération après interruption d’un import ou d’une intégration.
