# Navigation

## Menus (`src/app/layouts/navConfig.ts`)
Les listes de liens des cadres sont dans `navConfig.ts`, avec des **clés de traduction** (`labelKey`, namespace `common`) et des adresses de `ROUTES` ; le texte est résolu par `t` dans le cadre.
- **Barre du haut** (`Entete`, pages publiques et espace pro) : logo, recherche (`RechercheEntete`), univers en onglets : Accueil · École · Consultation · Emploi. L'univers actif est bleu, souligné de 3 px. Consultation et Emploi sont grisés « Bientôt » et ne s'affichent qu'aux comptes connectés. Pour un compte connecté, « Accueil » et le logo mènent à sa première page (`account.home`).
- **Pied de page** (`PiedDePage`) : logo de la landing et sa devise, Aide et contact · Conditions générales, copyright, sur fond bleu nuit.
- **Compte école** : « École » mène à son espace pro ; les listes d'écoles et d'auto-écoles le renvoient vers son espace (`GardeListing`). Les fiches restent ouvertes.
- **Espace pro** (`proNav`, `MenuPro`) : Tableau de bord · Profil de l'établissement · Formations (Gérer les formations, Créer une formation) · Contenus et informations (Contenus & actualités, Documents à télécharger, FAQ (Questions fréquentes)) · Statistiques · Paramètres. « Tableau de bord » est `end`.
- **Menu du compte** (`MenuCompte`, `AccountMenu.tsx`) : des **lieux** seulement (profil, favoris ou espace pro, paramètres, aide, se déconnecter). **Cloche** (`ClocheNotifications`) : un lien vers les notifications, avec le nombre de non lues (`notificationsCompte` ; espace pro : `notifications`).
- Ajouter un menu ou une rubrique **seulement si le canevas le montre**.

## Cadres (`src/app/layouts/`)
| Cadre | Ce qu'il pose |
|---|---|
| `PublicLayout` | `Entete` (68 px ; sur téléphone, barre puis rangée des univers), page, `PiedDePage` |
| `ProLayout` | `Entete`, menu de l'établissement dans une carte de 240 px à gauche (`MenuPro`, reste visible au défilement) ; sur téléphone, bouton « Menu de l'espace pro » et tiroir (`Sheet`) qui se ferme après un choix |
| `AuthLayout` (`AuthShell`, `CadreAuth`, `CarteAuth`) | connexion, inscription, mot de passe oublié, sur le bloc partagé `CadreConnexion` ; ni barre ni menu |
| `LandingLayout` | la landing (gelée, `.theme-client`) |

## Adresses (`src/shared/utils/routes.ts`)
- **Toutes** les adresses viennent de `ROUTES` (liens) et `ROUTE_PATTERNS` (table des routes). Jamais d'adresse écrite à la main, jamais de `#` seul, jamais de lien mort.
- Les adresses sont **en français** et **ne se traduisent pas** :
  - univers École : `/ecoles`, `/ecoles/:type` (`ipes`, `cfp`, `autres`), `/ecoles/:type/etablissement/:id/:onglet?`, `/ecoles/formations/:id/:onglet?` ;
  - auto-écoles : `/ecoles/auto-ecoles`, `/ecoles/auto-ecoles/:id/:onglet?` (`formations`, `tarifs`, `planning`, `galerie`, `avis`), `/ecoles/auto-ecoles/:id/permis/:code/:onglet?` (`programme`, `conditions`, `tarifs`, `planning`) ;
  - compte de la personne : `/accueil` (fil : `?vue=enregistres`, `?domaine=`, `?sujet=`, `?q=`), `/accueil/publications/:id`, `/favoris`, `/notifications`, `/profil`, `/parametres` ;
  - espace pro : `/pro/ecole`, `/pro/ecole/profil/:onglet?`, `/pro/ecole/formations`, `/pro/ecole/formations/nouvelle`, `/pro/ecole/contenus/:onglet?`, `/pro/ecole/statistiques`, `/pro/ecole/parametres/:onglet?` ;
  - `/connexion` (`?espace=ecole`), `/mot-de-passe-oublie`, `/inscription`, `/aide`, `/conditions`, `/consultation`, `/emploi`.
- Pages **masquées** (décision du 2026-11-25), sans adresse : préinscription, inscription en auto-école et sa modification, Mon espace et ses dossiers.
- **`/` (la landing) est réservée aux visiteurs** : un compte connecté qui l'ouvre va à `account.home` (`GardeAccueil`). Un visiteur qui ouvre `/accueil` va à `/connexion`.
- Une nouvelle page : son adresse dans `ROUTES` **et** `ROUTE_PATTERNS`, sa page dans `pages.ts` (`lazy`), sa route dans le fichier du bon cadre.

## Onglets
- Un onglet est **un segment de l'adresse**, pas un paramètre : `/ecoles/ipes/etablissement/ipc/avis`, `/pro/ecole/parametres/securite`. Le premier onglet n'a pas de segment ; un segment inconnu ramène au premier onglet.
- Fiches (établissement, auto-école, permis) : les onglets de `EnteteFiche` ; espace pro : ceux de `EntetePro`. Les deux utilisent `LienActif` avec `tabTriggerClasses` (soulignés de 3 px, `aria-current="page"`).
- `Tabs` (état local) ou `RangeePuces` seulement pour un choix qui n'a pas besoin d'être retrouvé (filtres d'un onglet, « Catégorie de permis »).
- Les **étapes** (inscription) restent dans l'état de la page.

## Fil d'Ariane et retour
- Les pages de l'univers École ont un **fil d'Ariane** (`Ariane`) : « École › Auto-Écoles › Auto-École Conduite Plus › Permis B ». L'espace pro a ses miettes dans `EntetePro`.
- Chaque élément du fil (sauf le dernier) est un lien de `ROUTES`.
- Les boutons « Retour » / « Précédent » des étapes reviennent à l'étape d'avant ; à la première étape, à la page précédente.
- Le défilement revient en haut à chaque page et retrouve sa place au retour arrière (`scrollRestoration` du routeur).

## Routeur (TanStack Router)
- Table des routes dans `src/app/routes/`, un fichier par cadre : `racine.tsx`, `auth.tsx`, `landing.tsx`, `public.tsx`, `pro.tsx`, `developpement.tsx` ; `pages.ts` (pages chargées à la demande) ; `index.tsx` assemble l'arbre et crée le routeur. Motifs : `ROUTE_PATTERNS` (`$id`, segment facultatif `{-$tab}`).
- **Liens** : `Lien` (`src/shared/ui/Lien.tsx`) à la place du `Link` du routeur ; menus et onglets : `LienActif`. Ils acceptent les adresses de `ROUTES`, recherche et ancre comprises.
- **Navigation** : `navigate({ href: ROUTES.… })` ; retour : `useRouter().history.back()`.
- **Recherche dans l'adresse** : `useParametresRecherche()` (comme `URLSearchParams`) ; le routeur garde la recherche en texte simple. Filtres, tri et page des listes y sont gardés.
- **Paramètres** : `useParams({ strict: false })`. État transmis : déclaré dans `HistoryState` (`src/app/routes/index.tsx`).
- Un identifiant inconnu (établissement, formation, auto-école, permis) affiche `MessagePage type="404"`, jamais un autre élément.
