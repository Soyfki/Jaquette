# Protocole de validation

Ce dossier définit la méthode commune pour valider chaque sous-étape de Jaquette. L’humain retrouve les scénarios et fournit ses observations ; l’agent développeur assume aussi la responsabilité de validation, applique la matrice Go/No-Go et signe la décision.

## Documents à utiliser

1. Copier la [`CHECKLIST.md`](CHECKLIST.md) pour préparer et exécuter les contrôles.
2. Copier le [`BUG_REPORT.md`](BUG_REPORT.md) pour chaque défaut reproductible.
3. Copier le [`VALIDATION_REPORT.md`](VALIDATION_REPORT.md) pour rendre la décision finale.


Les campagnes des anciennes sous-étapes conservent leur portée historique Chrome et leurs preuves datées ; elles ne qualifient pas Firefox, Safari ou Electron. La campagne propre à la page exécutable du design system est décrite dans [`1.1-design-system.md`](1.1-design-system.md). La campagne du lot 1.4.1 consacré au rôle simulé et à la variante Réviseur est décrite dans [`1.4-role-variants.md`](1.4-role-variants.md).

Les copies remplies peuvent être conservées dans la pull request ou dans l'outil de suivi retenu par l'équipe. Elles ne doivent contenir ni secret, ni donnée privée, ni manuscrit confidentiel.

## Responsabilités

- **Développeur** : identifie exactement la livraison, exécute les contrôles automatiques ou techniques, fournit leurs résultats et prépare les préconditions nécessaires.
- **Validateur utilisateur** : exécute les contrôles manuels sans modifier le résultat attendu, décrit ses observations et signale les défauts reproductibles.
- **Responsable de validation** : rôle cumulé par l’agent développeur dans le mandat de septembre. Il interprète les observations humaines, vérifie les preuves du SHA testé, applique la matrice Go/No-Go et signe. L’utilisateur ne choisit pas Go/No-Go.

L’agent crée les commits, pousse, prépare la PR en brouillon, puis après Go la passe prête et fusionne en squash vers main avec contrôle du SHA approuvé, sans contourner les protections GitHub ni inventer une revue indépendante. Il vérifie merged=true, le SHA de squash sur origin/main et les contrôles après fusion. L’ancienne PR 9 reste intacte dans le lot 0.1.

Un retour humain obligatoire absent ou incomplet vaut BLOCKED pour les points non couverts, donc BLOQUÉE et NO-GO. Une observation humaine ne peut pas être remplacée par une analyse automatique de capture. Le cumul de rôles ne dispense d’aucun test humain requis.

Le développeur ne remplace pas un contrôle utilisateur obligatoire par un contrôle technique. Le validateur ne transforme pas un résultat inattendu en résultat attendu après l'exécution.

## Périmètre de reprise du lot 0.1

La [campagne 0.1](0.1-harmonisation/README.md) est exclusivement documentaire et indépendante du Go humain de l’ancien 1.4.2. Aucun essai humain supplémentaire ni contrôle applicatif hors diff n’est obligatoire. Les décisions produit sont déjà fournies. Une contradiction non tranchée doit être isolée avec un texte proposé, sans nouvelle validation générale.

La CI n’est requise pour 0.1 que si une configuration ou protection applicable existe déjà ; sa création et la réparation de l’installation transférée relèvent de 0.2. Dès 0.2, CI minimale et vérification CI/main sont obligatoires. Les tests applicatifs requis par les campagnes historiques gardent leur portée pour ces campagnes.

L’ancien 1.4.2 est acquis après sa revalidation technique et humaine du 18 septembre 2026 : [rapport à deux conclusions 0.3/1.4.2](0.3-correctifs-prototype/VALIDATION_REPORT.md), suivant le [protocole PR 9](1.4.2-team-lead-admin-variants.md). L’ancien 1.4.3 n’est plus autonome ; aucun périmètre précis retrouvé, inventaire des reliquats en 0.3/0.5 puis rattachement aux étapes futures correspondantes. Aucune clôture rétroactive de l’ancienne phase 1. Après les Go de 0.1, 0.2 et 0.3, 0.4 en cours, BLOQUÉE / NO-GO jusqu’aux relevés et observations matériels complets.

## Préparer une validation

Pour **0.3 — Corriger les défauts du prototype**, la PR 9 historique est reprise après intégration de main 0.2 : [checklist](0.3-correctifs-prototype/CHECKLIST.md), [rapport](0.3-correctifs-prototype/VALIDATION_REPORT.md) et [formulaire humain exhaustif](0.3-correctifs-prototype/HUMAN_REVIEW.md). Les correctifs 0.3 et la revalidation historique 1.4.2 donnent deux conclusions distinctes sur le même SHA. Les observations H03 et les dix points historiques sont obligatoires avant tout Go et fusion.

Pour **0.2 — Reproduire la base**, utiliser la [campagne technique dédiée](0.2-base-reproductible/README.md) et le [guide d'installation](../REPRODUCIBILITY.md). Aucun essai humain supplémentaire n'est requis pour ce lot. La récupération et la CI obligatoires doivent réussir avant acquisition ; la revalidation humaine de 1.4.2 reste distincte.

Avant les tests :

1. lire le périmètre et les critères d'acceptation de la sous-étape dans le plan de développement ;
2. identifier les invariants concernés dans `AGENTS.md` et le cahier des charges ;
3. noter la branche, le SHA complet du commit et la pull request testés ;
4. décrire l'environnement, les données de test et les préconditions sans recopier de secret ;
5. distinguer les contrôles techniques, les contrôles manuels et les régressions ;
6. marquer chaque contrôle comme obligatoire ou non obligatoire avant son exécution ;
7. définir pour chaque contrôle des étapes reproductibles, un résultat attendu observable et la preuve à conserver.

Si le SHA complet n'est pas identifiable, la validation ne commence pas. Une nouvelle modification du contenu testé rend les résultats précédents obsolètes pour le nouveau commit : les contrôles concernés doivent être rejoués et le rapport doit citer le nouveau SHA. Les preuves finales liées au SHA sont publiées dans la PR ou un artefact associé pour éviter un nouveau commit consacré à son propre SHA. Toute réutilisation d’une preuve inchangée est explicitement justifiée.

## Exécuter et consigner un contrôle

Exécuter les étapes dans l'ordre indiqué, sur l'environnement déclaré. Noter le résultat observé avant d'attribuer un statut. Les seuls statuts de test sont :

| Statut | Règle d'attribution |
|---|---|
| `PASS` | Le résultat attendu a été observé. La preuve ou l'observation permet de le confirmer. |
| `FAIL` | Le résultat observé diffère du résultat attendu. Créer un rapport de bug lorsque le défaut est reproductible, puis le référencer. |
| `BLOCKED` | Le contrôle n'a pas pu être exécuté à cause d'un obstacle identifié. Décrire l'obstacle, les tentatives raisonnables et la condition nécessaire pour reprendre. |

Un contrôle partiellement exécuté n'est `PASS` que si toutes ses étapes et tous ses résultats obligatoires ont été vérifiés. Sinon, il est `FAIL` si une différence est déjà observée, ou `BLOCKED` si l'obstacle empêche toute conclusion. Un contrôle `BLOCKED` n'est jamais assimilé à un succès.

Un contrôle devenu hors périmètre doit être retiré de la campagne avant l'exécution avec une justification approuvée. « Hors périmètre » n'est pas un quatrième statut et ne permet pas d'écarter après coup un résultat défavorable.

## Signaler un défaut

Pour tout `FAIL`, utiliser le modèle de rapport de bug et relier le défaut au contrôle concerné. Un rapport exploitable permet à une autre personne de reproduire le problème sur le même commit et dans un environnement équivalent.

Les captures, journaux et fichiers joints doivent être relus avant partage. Masquer ou retirer les secrets, identifiants, données privées, manuscrits et contenus confidentiels. Si une preuve ne peut pas être partagée, décrire son emplacement contrôlé et la personne autorisée à la consulter sans la copier dans le dépôt.

## Règles de conclusion

Appliquer les règles dans cet ordre :

1. **`BLOQUÉE`** : au moins un contrôle obligatoire est `BLOCKED` après des tentatives raisonnables. Les éventuels `FAIL` déjà observés restent consignés et devront être corrigés ; la priorité `BLOQUÉE` indique qu'il est encore impossible d'évaluer complètement la livraison.
2. **`À CORRIGER`** : aucun contrôle obligatoire n'est `BLOCKED`, mais au moins un contrôle obligatoire est `FAIL`. Cette conclusion s'applique aussi à une dette non obligatoire qui n'est pas acceptée selon les règles ci-dessous.
3. **`VALIDÉE AVEC DETTE`** : tous les contrôles obligatoires sont `PASS`, aucune régression bloquante n'est présente et chaque anomalie non obligatoire restante remplit toutes les conditions de dette ci-dessous.
4. **`VALIDÉE`** : tous les contrôles obligatoires sont `PASS`, aucun contrôle obligatoire n'est `BLOCKED`, aucune régression bloquante n'est présente, aucune dette n'est acceptée et le SHA complet réellement testé est consigné.

### Dette admissible exceptionnelle

`VALIDÉE AVEC DETTE` est autorisée seulement si chaque dette :

- est non bloquante et ne fait échouer aucun contrôle obligatoire ;
- ne concerne ni la sécurité, ni une perte ou corruption de données, ni une régression bloquante ;
- ne touche aucun invariant métier fondamental défini dans `AGENTS.md`, notamment la stabilité de l'association textuelle après sauvegarde et réouverture ;
- décrit l'impact, le contournement éventuel, le propriétaire du suivi et l'échéance ou la sous-étape cible ;
- est explicitement acceptée et signée par le responsable de validation.

Une anomalie qui ne remplit pas toutes ces conditions conduit à `À CORRIGER` ou, si elle empêche un contrôle obligatoire, à `BLOQUÉE`.

## Matrice de décision

| Contrôles obligatoires | Régression bloquante | Dette admissible acceptée | Conclusion |
|---|---|---|---|
| Au moins un `BLOCKED` | Indifférent | Indifférent | `BLOQUÉE` |
| Aucun `BLOCKED`, au moins un `FAIL` | Indifférent | Indifférent | `À CORRIGER` |
| Tous `PASS` | Oui | Indifférent | `À CORRIGER` |
| Tous `PASS` | Non | Oui | `VALIDÉE AVEC DETTE` |
| Tous `PASS` | Non | Non | `VALIDÉE` |

BLOQUÉE et À CORRIGER impliquent NO-GO et aucune fusion. VALIDÉE implique GO ; VALIDÉE AVEC DETTE permet GO seulement pour les dettes strictement admissibles, motivées et signées par le responsable. La revue indépendante éventuellement exigée par GitHub reste une condition distincte.

Dans tous les cas, l'absence du SHA complet réellement testé interdit `VALIDÉE` et `VALIDÉE AVEC DETTE`. La campagne doit être complétée avant décision.

## Simulations de la règle

### Tous les contrôles obligatoires réussissent

Les contrôles techniques, manuels et de régression obligatoires sont `PASS`, aucune régression bloquante ni dette n'est présente et le commit est identifié. Conclusion : **`VALIDÉE`**.

### Un contrôle obligatoire échoue

Un contrôle manuel obligatoire est `FAIL`, les autres contrôles sont `PASS` et aucun contrôle n'est bloqué. Conclusion : **`À CORRIGER`**.

### Un contrôle obligatoire est bloqué

Un contrôle de régression obligatoire est `BLOCKED` parce que l'environnement requis est indisponible après des tentatives raisonnables. Conclusion : **`BLOQUÉE`**. La livraison ne peut pas être déclarée `VALIDÉE`.

## Lot 0.4 en cours

[Contrat, corpus et commandes](../measurement/README.md), [matrice matérielle](../measurement/MACHINES.md), [protocoles](../measurement/PROTOCOLS.md). Livraison préparée mais BLOQUÉE / NO-GO tant que les relevés obligatoires manquent ; aucune performance produit future acquise.
