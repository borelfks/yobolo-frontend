# Navigation

## Menus (`src/app/layouts/navConfig.ts`)
Les listes de liens des cadres sont dans `navConfig.ts`. Elles gardent des **clés de traduction** (`labelKey`, namespace `common`) et des adresses de `ROUTES` ; le texte est résolu par `t` dans le cadre.
- **Pages publiques** (`publicNav`) : Accueil · École · Consultation · Emploi. La rubrique active est une pilule bleu nuit. Pour un compte connecté, « Accueil » et le logo mènent à sa page d'arrivée (`account.home`).
- **Pied de page** (pages publiques) : la partie basse de celui de l'accueil (logo et devise, Aide · Conditions, copyright), en bleu nuit, sans la vague ni la phrase de la marque (décision du 2026-11-24).
- **Espace pro** (`proNav`) : Tableau de bord · Profil de l'établissement · Formations · Contenus et informations · Statistiques · Paramètres.
  - **Sous-menus** (comme sur la maquette) : Formations › Gérer les formations, Créer une formation ; Contenus et informations › Contenus & actualités, Documents à télécharger, FAQ (Questions fréquentes).
  - « Tableau de bord » est `end` : il n'est pas actif sur les autres pages.
- **Menu du compte** (avatar, `AccountMenu.tsx`) : Mon espace professionnel (compte école), Mes favoris, Donner un avis (utilisateur : sur le dernier établissement ou la dernière auto-école de ses préinscriptions / inscriptions ; absent sinon), Changer de compte, Données de test, Se déconnecter. **Cloche** : les notifications du compte dans la base (`notificationsCompte` ; espace pro : `notifications`), nombre de non lues, « Tout marquer comme lu ».
- Ajouter un menu ou une rubrique **seulement si la maquette le montre**.

## Cadres
- **Pages publiques** (`PublicLayout`) : barre du haut de 68 px ; sur téléphone, le menu s'ouvre avec ☰ sous la barre.
- **Espace pro** (`ProLayout`) : barre du haut de 56 px + barre latérale bleu nuit de 250 px ; sur téléphone, la barre latérale s'ouvre en tiroir (☰), et se ferme après un choix.
- **Connexion et inscription** (`AuthLayout`) : sans barre ni menu.

## Adresses (`src/shared/utils/routes.ts`)
- **Toutes** les adresses viennent de `ROUTES` (liens) et `ROUTE_PATTERNS` (table des routes `src/app/routes/index.tsx`). Jamais d'adresse écrite à la main, jamais de `#`, jamais de lien mort. (Il en reste à remplacer : voir [DECISIONS.md › À faire plus tard](../../docs/DECISIONS.md#2-à-faire-plus-tard).)
- Les adresses sont **en français** et **ne se traduisent pas** (elles font partie de la maquette) :
  - univers École : `/ecoles`, `/ecoles/:type` (`ipes`, `cfp`, `autres`), `/ecoles/:type/etablissement/:id`, `/ecoles/formations/:id`, `/ecoles/formations/:id/preinscription` ;
  - auto-écoles : `/ecoles/auto-ecoles`, `/ecoles/auto-ecoles/:id`, `…/permis/:code`, `…/permis/:code/inscription`, `…/inscription/modifier/:section` ;
  - avis : `…/avis/nouveau` ; favoris : `/favoris` ;
  - espace pro : `/pro/ecole`, `/pro/ecole/profil`, `/pro/ecole/formations`, `/pro/ecole/contenus`, `/pro/ecole/statistiques`, `/pro/ecole/parametres` ;
  - `/connexion` (`?espace=ecole` présélectionne l'IPES), `/inscription`, `/consultation`, `/emploi` ;
  - accueil de l'utilisateur connecté : `/accueil` (`ROUTES.accueil`, filtres du fil dans l'adresse : `?genre=`, `?tri=`, `?vue=enregistres`, `?domaine=`, `?sujet=`, `?q=`, `?publication=`).
- **`/` (la landing) est réservée aux visiteurs** : un compte connecté qui l'ouvre est mené à `account.home` (`/accueil` pour l'utilisateur, `/pro/ecole` pour une école) par `GardeAccueil` (`src/app/routes/GardeAccueil.tsx`), qui attend la base si un compte est gardé dans le navigateur. Un visiteur qui ouvre `/accueil` est mené à `/connexion`.
- Une nouvelle page : ajouter son adresse à `ROUTES` **et** à `ROUTE_PATTERNS`, puis la route (chargée avec `lazy`) dans `index.tsx`, dans le bon cadre.

## Onglets
- Un onglet est **un segment de l'adresse**, pas un paramètre : `/ecoles/ipes/filieres`, `/ecoles/formations/f-cg-ipc/programme`, `/pro/ecole/profil/coordonnees`, `/pro/ecole/parametres/securite`. Le premier onglet n'a pas de segment.
- Composant : `LinkTabs` (onglets dans l'adresse). `Tabs` (état local) seulement pour un choix qui n'a pas besoin d'être retrouvé (ex. « Nos recommandations » de l'accueil).
- Les segments d'onglets sont ceux de [SPECIFICATIONS.md](../../docs/SPECIFICATIONS.md) ; ne pas les renommer.
- Les **étapes** (préinscription, inscription en auto-école, création de compte) restent dans l'état de la page ; le brouillon d'inscription en auto-école est gardé dans le navigateur.

## Fil d'Ariane et retour
- Les pages de l'univers École et de l'espace pro ont un **fil d'Ariane** (`Breadcrumb`, ou celui de `ProHeader` / `AEHeader`), comme sur la maquette : « École › IPES › Institut Professionnel du Centre (IPC) › Aperçu ».
- Chaque élément du fil (sauf le dernier) est un lien de `ROUTES`.
- Les boutons « Retour » / « Précédent » des étapes reviennent à l'étape d'avant ; à la première étape, à la page précédente.
- Le défilement revient en haut à chaque page (`ScrollRestoration` dans les cadres).
