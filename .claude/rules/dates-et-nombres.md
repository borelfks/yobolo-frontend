# Dates et nombres

## Dates : toujours date-fns (décision du 2026-11-28)
Tout passe par **date-fns**. Le module commun est `src/shared/utils/dates.ts`, **identique dans yibolo-admin**.
Interdit : `toLocaleDateString`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, calculs en millisecondes (`86_400_000`), tableaux de mois écrits à la main, `toISOString().slice(0, 10)` pour un jour.

| Besoin | Fonction |
|---|---|
| Afficher une date dans la langue choisie | `formaterDate(d, forme)` |
| L'âge d'un élément (« à l'instant », « il y a 3 h », « hier ») | `dateRelative(d, { unite?, style?, semaine? })` (date-fns `intlFormatDistance`) ; au-delà de 7 jours du calendrier, la date |
| Écrire une date **dans les données** (toujours en français) | `dateDesDonnees()` → « 27 nov. 2026 » ; `horodatage()` → « 27 nov. 2026, 14:48 » |
| Le jour d'une date (« 2026-11-27 ») | `jourISO(d)` |
| Lire une date française des données (« 15 novembre 2026 ») | `lireDateFrancaise(texte)` ; l'afficher dans la langue choisie : `demoDate(texte)` |
| Calculer (ajouter, retirer, comparer, début du jour…) | les fonctions de date-fns directement : `addDays`, `subDays`, `startOfDay`, `isSameDay`, `differenceInCalendarDays`, `format(d, 'HH:mm')`… |
| Horodatage technique enregistré (`le`, `envoyeeLe`…) | `new Date().toISOString()` (format d'échange avec le serveur) |

**Formes de `formaterDate`** (exemples en français ; l'anglais britannique suit la même forme) :

| Forme | Exemple |
|---|---|
| `chiffres` (par défaut) | 15/11/2026 |
| `abregee` | 15 nov. 2026 |
| `moyenne` | 5 nov. 2026 |
| `longue` | 15 novembre 2026 |
| `longueSimple` | 5 novembre 2026 |
| `jourMois` | 15 nov. |
| `jourSemaine` | lundi |
| `heure` | 09:30 |
| `dateHeure` | 15 nov. 2026, 09:30 |
| `moyenneHeure` | 5 nov. 2026, 09:30 |

Une nouvelle forme s'ajoute dans `FORMES` (`dates.ts`), **dans les deux projets**. La langue de date-fns (`fr`, `enGB`) suit `currentLocale()`.

## Nombres et montants
- `num(n)` : « 450 000 » / « 4,7 » (fr), « 450,000 » / « 4.7 » (en).
- `fcfa(n)` : « 450 000 FCFA ».
- `pct(part)` (admin) : « 38 % ».
- Jamais `toLocaleString('fr-FR')` : il ignore la langue choisie.

## Données de démonstration
Les dates des fausses données sont du texte français recopié de la maquette (« 06 oct. 2026 », « Il y a 3 jours ») : on les **affiche** traduites (`demoDate`, `reviewDate` des auto-écoles) et on ne les modifie pas pour traduire.
