# Protocole de validation

Ce dossier définit la méthode commune pour valider chaque sous-étape de Jaquette. Il est conçu pour qu'une personne non développeuse puisse retrouver les instructions, exécuter les contrôles manuels, consigner ce qu'elle observe et rendre une décision sans ambiguïté.

## Documents à utiliser

1. Copier la [`CHECKLIST.md`](CHECKLIST.md) pour préparer et exécuter les contrôles.
2. Copier le [`BUG_REPORT.md`](BUG_REPORT.md) pour chaque défaut reproductible.
3. Copier le [`VALIDATION_REPORT.md`](VALIDATION_REPORT.md) pour rendre la décision finale.


La campagne propre à la page exécutable du design system est décrite dans [`1.1-design-system.md`](1.1-design-system.md).

Les copies remplies peuvent être conservées dans la pull request ou dans l'outil de suivi retenu par l'équipe. Elles ne doivent contenir ni secret, ni donnée privée, ni manuscrit confidentiel.

## Responsabilités

- **Développeur** : identifie exactement la livraison, exécute les contrôles automatiques ou techniques, fournit leurs résultats et prépare les préconditions nécessaires.
- **Validateur utilisateur** : exécute les contrôles manuels sans modifier le résultat attendu, décrit ses observations et signale les défauts reproductibles.
- **Responsable de validation** : vérifie que les preuves correspondent au commit testé, applique les règles de décision et signe la conclusion. Une même personne peut cumuler ces rôles si cela est annoncé dans le rapport.

Le développeur ne remplace pas un contrôle utilisateur obligatoire par un contrôle technique. Le validateur ne transforme pas un résultat inattendu en résultat attendu après l'exécution.

## Préparer une validation

Avant les tests :

1. lire le périmètre et les critères d'acceptation de la sous-étape dans le plan de développement ;
2. identifier les invariants concernés dans `AGENTS.md` et le cahier des charges ;
3. noter la branche, le SHA complet du commit et la pull request testés ;
4. décrire l'environnement, les données de test et les préconditions sans recopier de secret ;
5. distinguer les contrôles techniques, les contrôles manuels et les régressions ;
6. marquer chaque contrôle comme obligatoire ou non obligatoire avant son exécution ;
7. définir pour chaque contrôle des étapes reproductibles, un résultat attendu observable et la preuve à conserver.

Si le SHA complet n'est pas identifiable, la validation ne commence pas. Une nouvelle modification du contenu testé rend les résultats précédents obsolètes pour le nouveau commit : les contrôles concernés doivent être rejoués et le rapport doit citer le nouveau SHA.

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

Dans tous les cas, l'absence du SHA complet réellement testé interdit `VALIDÉE` et `VALIDÉE AVEC DETTE`. La campagne doit être complétée avant décision.

## Simulations de la règle

### Tous les contrôles obligatoires réussissent

Les contrôles techniques, manuels et de régression obligatoires sont `PASS`, aucune régression bloquante ni dette n'est présente et le commit est identifié. Conclusion : **`VALIDÉE`**.

### Un contrôle obligatoire échoue

Un contrôle manuel obligatoire est `FAIL`, les autres contrôles sont `PASS` et aucun contrôle n'est bloqué. Conclusion : **`À CORRIGER`**.

### Un contrôle obligatoire est bloqué

Un contrôle de régression obligatoire est `BLOCKED` parce que l'environnement requis est indisponible après des tentatives raisonnables. Conclusion : **`BLOQUÉE`**. La livraison ne peut pas être déclarée `VALIDÉE`.
