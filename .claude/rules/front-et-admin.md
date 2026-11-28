# Front et admin : un seul système

yibolo-frontend (ce dépôt) et **yibolo-admin** (`C:\Users\USER\Documents\yibolo-admin`) ont le même design, les mêmes composants et les mêmes règles.

## Fichiers identiques dans les deux projets
| Dossier | Contenu |
|---|---|
| `src/shared/shadcn/` | toutes les briques |
| `src/shared/blocs/` | blocs communs : Chargement, Squelettes, Etats, ChargementDonnees, BandeauHorsLigne, Formulaire, Marque, ChoixLangue, CadreConnexion |
| `src/shared/utils/` | `cn.ts`, `dates.ts` |
| `src/app/styles/theme.css` | les jetons (le front ajoute ceux de la landing et quelques couleurs propres) |

Blocs propres à un seul projet (pas recopiés) : front : `CadreCompte`, `Visionneuse` ; admin : `EntetePage`, `Cartes`, `Barres`, `ChoixPeriode`, `GraphiqueBarres`, `Rangees`, `TableauDonnees`, `liensPage.ts`.

## Modifier un fichier commun
1. Le modifier **d'abord dans le front**.
2. Le recopier **à l'identique** dans l'admin (jetons et textes de traduction qu'il utilise compris).
3. Vérifier les deux projets (types, lint, traduction, build, navigateur).
4. Contrôle : `diff` des dossiers communs ; aucune différence attendue.

## Ce qui diffère volontairement
- Routeur : front en routes déclarées dans le code (`src/app/routes/`), admin en routes par fichiers (`routeTree.gen.ts`).
- Liens : front `Lien` / `LienActif` (`src/shared/ui/`) ; admin liens typés du routeur et `createLink` (`ElementFil`, `OngletLien`, `TuileLien`).
- Stockage local : clés `yibolo:…` (front) et `yibolo-admin:…` (admin).
- Ports : front 5199, admin 5200.
