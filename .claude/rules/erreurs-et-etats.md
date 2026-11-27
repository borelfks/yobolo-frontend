# Erreurs, états et chargement

Chaque écran prévoit **tous** ses états. Les blocs sont dans `src/shared/blocs/` (voir [composants.md](composants.md)).

## Chargement
1. **Squelette de la même forme** que le contenu (`SkeletonZone` + `SkeletonCard`, `SkeletonList`, `SkeletonTable`, `SkeletonStats`…) : la page ne saute pas à l'arrivée des données.
2. Indicateur (`Spinner`, `PageSpinner`) seulement quand la forme est inconnue (téléchargement d'une page).
3. Action en cours : `Button loading` ; bloc en cours d'enregistrement : `SpinnerOverlay`.

## Erreurs
| Cas | Ce qui s'affiche | Où c'est branché |
|---|---|---|
| Une page plante | `MessagePage type="erreur"` dans le cadre (menu conservé) | `ErrorBoundary` (`RouteOutlet`) |
| Une page ne se télécharge pas | `MessagePage type="horsligne"` | `ErrorBoundary` |
| Adresse inconnue | `MessagePage type="404"` | `NotFound` |
| Accès interdit à ce compte | `MessagePage type="acces"` | gardes de routes |
| Un bloc de données ne se charge pas | `ErrorState` avec « Réessayer » à la place du bloc | `ChargementDonnees` |
| Mise à jour ou enregistrement qui échoue | message éphémère rouge | `queryClient` (QueryCache, MutationCache) |
| Erreur que personne n'a attrapée | message éphémère « Une erreur inattendue… » | `app/erreursGlobales.ts` |
| Connexion coupée | bandeau en bas de l'écran | `BandeauHorsLigne` |
| Champ invalide | message rouge sous le champ, `aria-invalid` | formulaire (react-hook-form + zod) |

## Vide
- Liste vide ou recherche sans résultat : `EmptyState` (titre clair, texte qui dit quoi faire, action : « Réinitialiser les filtres », « Créer… »).

## Messages éphémères
- `toast.success` (vert), `toast.error` (rouge), `toast.warning` (ambre), `toast.info` / `toast` (bleu), `toast.promise` (chargement puis résultat). En haut à droite, avec une croix, textes traduits.

## Règles
- **Toute action est réelle** : pas de bouton qui ne fait rien, pas de message « (démo) ».
- Stockage local toujours sous try/catch (`load` / `save` de `shared/utils/storage.ts`).
- Le détail technique d'une erreur va dans la console, jamais à l'écran.
