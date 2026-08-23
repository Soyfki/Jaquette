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

Toute information qui n’appartient pas exclusivement à un seul chapitre est une information commune du `.jacq` et ne doit pas être placée dans un `.chpt`.

Cela comprend au minimum :

- l’EPUB source ;
- la structure textuelle globale et les identifiants nécessaires à sa cohérence ;
- les métadonnées du livre et du projet ;
- les paramètres généraux ;
- les affectations globales ;
- les versions nommées ;
- les consentements IA ;
- les commentaires et tâches ciblant le livre ;
- toute information partagée par plusieurs chapitres.

Cette liste est un minimum normatif, pas une liste exhaustive champ par champ. Une donnée clairement propre à un chapitre reste dans son `.chpt`.

Une divergence commune ne se résout jamais automatiquement. Le Chef d’équipe arbitre ; dans un workspace d’Auteur indépendant, l’Auteur indépendant arbitre. La décision est journalisée.

## Cycle d’une candidate

1. Un Sound Designer travaille localement sur un chapitre.
2. Il exporte un `.chpt` candidat.
3. Le fichier est importé pour révision sans écraser la version validée.
4. Tout Réviseur affecté peut proposer une candidate comme candidate active à examiner ; cette proposition ne vaut ni sélection définitive ni validation.
5. Après l’approbation de tous les Réviseurs affectés sur la même candidate, elle devient la version validée du chapitre dans le `.jacq`.

En cas de désaccord, le chapitre reste bloqué et aucune candidate n’est intégrée. Il n’existe ni vote majoritaire ni arbitrage du Chef d’équipe sur le choix éditorial de la candidate. Une autre candidate peut être proposée explicitement. Deux propositions concurrentes ne se remplacent jamais silencieusement et toutes les candidates et décisions précédentes restent dans l’historique.

Une modification d’un chapitre déjà validé annule ses validations actives et le replace à réviser. Les validations précédentes restent dans l’historique.

## Règles de fusion

| Situation | Résultat autorisé |
|---|---|
| Chapitres différents, identité et filiation compatibles | Intégration sans conflit et sans réécriture des autres `.chpt` |
| Même chapitre, deux versions concurrentes | Deux candidates distinctes ; proposition explicite d’une candidate active par tout Réviseur affecté, puis approbation unanime |
| Origine incompatible ou filiation inconnue | Intégration silencieuse refusée, conflit explicite |
| Informations communes divergentes | Arbitrage explicite du Chef d’équipe ou de l’Auteur indépendant |
| Média identique dans plusieurs chapitres | Déduplication par empreinte |

Aucun merge détaillé des annotations ou réglages de deux candidates concurrentes n’est effectué. Une proposition de candidate active ne vaut ni sélection définitive ni validation. Un désaccord bloque toute intégration, sans vote majoritaire ni arbitrage du Chef d’équipe sur ce choix éditorial. Une autre candidate peut être proposée explicitement. Deux propositions concurrentes ne se remplacent jamais silencieusement. Toutes les candidates et décisions précédentes restent consultables avec leur auteur, leur base et leur date. Aucun fichier n’est détruit silencieusement.

## Correspondance des assignés à l’import

La correspondance automatique d’un assigné d’un `.chpt` est autorisée uniquement si l’identifiant Jaquette global est strictement identique et que cette personne possède les droits nécessaires dans le projet cible.

Aucune correspondance silencieuse n’est effectuée par nom, adresse IP ou adresse électronique non vérifiée. Si l’identité d’origine n’est pas reconnue ou n’est pas autorisée, l’import ne finalise pas automatiquement l’affectation. Le Chef d’équipe choisit explicitement un assigné autorisé ; dans un workspace d’Auteur indépendant, cette décision revient à l’Auteur indépendant.

L’identité et l’assigné d’origine restent dans l’historique et l’audit. La réaffectation explicite ne réécrit pas l’auteur historique de la contribution.

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
- correspondance ou réaffectation explicite d’un assigné importé, avec conservation de l’identité et de l’assigné d’origine ;
- export et import d’un `.chpt` ;
- détection d’un conflit ;
- proposition d’une candidate active, approbations et décisions associées ;
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

### 2. Trois Réviseurs approuvent la même candidate

Préconditions : trois Réviseurs sont affectés et examinent la même candidate active.

Résultat attendu :

- tout Réviseur affecté peut proposer cette candidate comme candidate active ;
- cette proposition ne vaut ni sélection définitive ni validation ;
- les validations 1/3 puis 2/3 ne suffisent pas ;
- l’approbation 3/3 permet seule son intégration comme version validée.

Conclusion documentaire : **PASS**.

### 3. Un Réviseur sur trois refuse

Préconditions : deux Réviseurs approuvent la candidate active et le troisième la refuse.

Résultat attendu :

- le chapitre reste bloqué ;
- aucune candidate n’est intégrée ;
- ni vote majoritaire ni arbitrage du Chef d’équipe ne tranche le choix éditorial ;
- une autre candidate peut être proposée explicitement ;
- les décisions précédentes restent dans l’historique.

Conclusion documentaire : **PASS**.

### 4. Deux Réviseurs proposent des candidates différentes

Préconditions : deux candidates concurrentes existent et deux Réviseurs proposent chacun une candidate différente comme active.

Résultat attendu :

- les deux candidates et propositions restent distinctes ;
- aucune proposition ne remplace silencieusement l’autre ;
- aucune proposition ne vaut sélection définitive ou validation ;
- le chapitre reste bloqué jusqu’à l’approbation de tous les Réviseurs affectés sur la même candidate ;
- toutes les candidates et décisions précédentes restent dans l’historique.

Conclusion documentaire : **PASS**.

### 5. Assigné reconnu et autorisé

Préconditions : un `.chpt` est importé entre deux copies ou organisations ; l’assigné d’origine possède un identifiant Jaquette global strictement identique et les droits nécessaires dans le projet cible.

Résultat attendu :

- la correspondance automatique est autorisée ;
- l’identité et l’assigné d’origine restent dans l’historique et l’audit.

Conclusion documentaire : **PASS**.

### 6. Assigné inconnu ou non autorisé

Préconditions : l’assigné d’origine n’existe pas dans le projet cible ou n’y possède pas les droits nécessaires.

Résultat attendu :

- aucune correspondance silencieuse n’est faite par nom, adresse IP ou adresse électronique non vérifiée ;
- l’import suspend la finalisation de l’affectation ;
- le Chef d’équipe choisit explicitement un assigné autorisé, ou l’Auteur indépendant dans son workspace ;
- l’identité et l’assigné d’origine restent dans l’historique et l’audit ;
- la réaffectation ne réécrit pas l’auteur historique de la contribution.

Conclusion documentaire : **PASS**.

### 7. Invalidation et nouvelle tâche

Préconditions : une candidate est invalidée avec un commentaire explicatif.

Résultat attendu :

- une nouvelle tâche « corriger le chapitre » est créée avec `Pas commencé` ;
- l’ancienne tâche n’est ni rouverte ni supprimée ;
- le Sound Designer la passe manuellement à `En cours` ;
- l’action métier accomplie la passe automatiquement à `Terminée` ;
- commentaire, tâche, validations et historique voyagent avec le prochain `.chpt`.

Conclusion documentaire : **PASS**.

### 8. Donnée utilisée par plusieurs chapitres

Préconditions : une donnée est utilisée par les chapitres A et B.

Résultat attendu :

- elle est classée dans la section commune du `.jacq` ;
- elle n’est placée dans aucun `.chpt` ;
- la liste des informations communes reste comprise comme un minimum normatif ;
- une donnée clairement propre au chapitre A reste dans son `.chpt`.

Conclusion documentaire : **PASS**.

### 9. Conflit sur les informations communes

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
