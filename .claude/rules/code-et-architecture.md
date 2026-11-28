# Code et architecture

## Stack
Vite + React 19 (React Compiler) + TypeScript `strict` · **TanStack Router** (`src/app/routes/`) · **TanStack Query** (lectures de `src/data`) · **TanStack Table** (grands tableaux) · Tailwind CSS v4 · **shadcn/ui** (Radix, `components.json`, composants dans `src/shared/shadcn/`) · class-variance-authority + clsx + tailwind-merge (`cn`) · react-hook-form + zod · i18next + react-i18next · **date-fns** (dates, voir [dates-et-nombres.md](dates-et-nombres.md)) · lucide-react · sonner · recharts · oxlint · **Orval** + axios pour l'API de yibolo-backend (plus tard).

## Organisation : par univers (même modèle que yibolo-admin et yibolo-client)
```
src/
├── main.tsx            point d'entrée : traduction, QueryClientProvider, SessionProvider, FavoritesProvider
├── app/                la coquille de l'application
│   ├── App.tsx           routeur, écran de secours, messages éphémères
│   ├── NotFound.tsx      404 · ErrorPage.tsx (erreur du routeur)
│   ├── erreursGlobales.ts  erreurs que personne n'a attrapées (message éphémère)
│   ├── routes/           un fichier par cadre (racine, auth, landing, public, pro, developpement), pages.ts (lazy), index.tsx, RouteOutlet, gardes (GardeAccueil, GardeListing)
│   ├── layouts/          PublicLayout, ProLayout, AuthLayout, LandingLayout, Entete, PiedDePage, MenuPro, AccountMenu, navConfig.ts (menus)
│   └── styles/           globals.css (police, base), theme.css (jetons)
├── modules/            un dossier par univers, découpé en parties
│   ├── ecole/            etablissements/ (page École, listes IPES · CFP · Autres, fiche, formation ; préinscription masquée)
│   │                     auto-ecoles/ (liste, fiche en 6 onglets, permis ; inscription masquée) · avis/ (blocs d'avis, « Donner mon avis ») · espace-pro/
│   ├── compte/           auth/ (connexion, inscription, mot de passe oublié, session) · mon-espace/ (profil, paramètres, notifications ; Mon espace masqué) · favoris/
│   ├── communaute/       accueil/ (accueil connecté, publications)
│   ├── landing/          accueil des visiteurs, page « bientôt disponible »
│   ├── pages/            Aide et contact, Conditions générales
│   └── design-system/    /design-system (développement seulement)
│                         plus tard : consultation/, emploi/
├── shared/             ce qui sert à plusieurs parties
│   ├── shadcn/           briques shadcn/ui (voir composants.md)
│   ├── blocs/            blocs (chargement, états, formulaire, marque, cadres…)
│   ├── ui/               liens (Lien, LienActif), Vague de la landing ; le reste ne sert qu'aux pages masquées
│   ├── forms/            ChampsLieu, accords (Accords.tsx) ; Fields.tsx et SelectionGeographique ne servent qu'aux pages masquées
│   ├── errors/           ErrorBoundary
│   ├── hooks/            useFavorites, useParametresRecherche, useMesureALaVue, useEnLigne
│   ├── locales/          textes du namespace common (fr.json, en.json)
│   ├── utils/            routes, cible, format (nombres), dates (date-fns), storage, cn, accords, fichiers, liens, mesures, motDePasse, geographie…
│   └── types.ts          types du domaine
├── api/                queryClient.ts, client.ts (axios) ; generated/ (Orval, plus tard)
├── data/               fausses données (voir donnees-et-backend.md) : index.ts, hooks.ts, sources/, fausses-donnees/
├── i18n/               traduction : index.ts, i18next.d.ts
└── assets/             fonts/ (Plus Jakarta Sans), brand/ (logo)
```

Chaque partie d'un module suit le même modèle :
```
modules/ecole/etablissements/
├── pages/              les pages (une page = un fichier, export nommé)
├── components/         ses composants (sous-dossiers pour les grandes pages : liste/, fiche/, formation/)
├── hooks/              ses hooks, s'il y en a
├── locales/            ses textes : fr.json, en.json (son namespace)
└── schoolLinks.tsx, schoolListing.ts   sa logique, à la racine, préfixée par son nom
```
- Noms des dossiers **en français**, en minuscules avec tirets (`auto-ecoles`, `espace-pro`). Les namespaces de traduction gardent leur nom (`schools`, `driving-schools`, `pro`…) : ce sont des clés techniques.
- Un nouvel univers (Consultation, Emploi) = un nouveau dossier de `modules/`, découpé en parties dès le départ.

## Règles de rangement
- Un fichier utilisé par **une seule** partie vit dans cette partie. Il va dans `shared/` seulement quand **plusieurs** s'en servent.
- **`shared/` n'importe jamais `app/` ni `modules/`** (il peut importer `@/data`). **`src/data/` n'importe ni `app/` ni `modules/`** ; ses fausses données sont dans `src/data/fausses-donnees/`. **Aucune donnée écrite dans le code** (voir [donnees-et-backend.md](donnees-et-backend.md)).
- **Sens des dépendances entre parties** (constaté le 2026-11-21, chemins du 2026-11-27) :

  `compte/auth` → `ecole/avis` → `ecole/etablissements` → `ecole/auto-ecoles` → (`compte/favoris`, `ecole/espace-pro`, `landing`, `communaute/accueil`, `compte/mon-espace`)

  (2026-11-28 : `ecole/avis` passe avant les établissements : ses blocs et la fenêtre « Donner mon avis » ne dépendent que de la session ; l'ancienne page `DonnerAvis`, masquée, est supprimée.)

  Une partie n'importe que celles placées **avant** elle ; jamais l'inverse, et pas d'import entre celles du dernier groupe. Aujourd'hui : `ecole/etablissements` et `ecole/auto-ecoles` utilisent `ecole/avis` (blocs d'avis, `ModaleAvis`), `compte/favoris` utilise `ecole/etablissements`, `ecole/espace-pro` utilise `compte/auth` et `ecole/etablissements`, `compte/mon-espace` utilise `compte/auth` et `ecole/etablissements`. Si un besoin va dans l'autre sens, la chose est mal rangée : la mettre dans `shared/`.
- `app/` peut importer `modules/compte/auth` (session) ; les pages de connexion importent `app/layouts/AuthLayout`.
- Pas de sous-dossiers `services/` ou `utils/` dans une partie : ses fichiers de logique sont à sa racine, préfixés par son nom (`autoEcoleFiche.ts`, `schoolListing.ts`, `proData.ts`).
- Une page de plus d'environ 500 lignes se découpe dans `components/<sous-dossier>/` de sa partie.
- **Noms de fichiers** : composants en `PascalCase.tsx`, logique en `camelCase.ts`. Les pages gardent leur nom français (`EcoleProfil.tsx`, `InscriptionAutoEcole.tsx`).
- **Pages** : export nommé, chargées à la demande dans `app/routes/pages.ts` (`page(() => import(…), 'Nom')`).
- **Imports** : `@/…` (= `src/…`) ; `./…` seulement pour un fichier du même dossier.
- **Un fichier de composant n'exporte que des composants** (sinon le rafraîchissement à chaud casse, et oxlint avertit). Constantes et fonctions dans un `.ts`, hooks dans `hooks/`.
- **Pas de gestion d'état globale** : deux contextes seulement, `SessionProvider` (`modules/compte/auth/hooks/useSession.tsx`) et `FavoritesProvider` (`shared/hooks/useFavorites.tsx`). L'état d'un écran reste dans le composant ou dans l'adresse (onglets).

## Règles de code
1. **TypeScript `strict`**, `noUnusedLocals`, `noUnusedParameters`, pas de `any`. Types du domaine dans `shared/types.ts` (`Etablissement`, `Formation`, `AutoEcole`, `Permis`, `InscriptionDraft`, `Favorite`, `Account`…).
2. **Adresses** : `ROUTES` / `ROUTE_PATTERNS`. **Couleurs** : jetons. **Textes** : traduction (voir [traduction.md](traduction.md)). **Nombres et dates** : `num()`, `fcfa()`, `formaterDate()`, `dateRelative()` (date-fns, voir [dates-et-nombres.md](dates-et-nombres.md)).
3. Composants courts et lisibles. Les commentaires sont **en français** et expliquent le *pourquoi* ; une référence à la maquette s'écrit `imgN` (= `word/media/imageN` du fichier Word).
4. Pas de `dangerouslySetInnerHTML`. Aucune clé secrète (il n'y en a pas : `.env.example` le rappelle).
5. Stockage local : `load` / `save` de `shared/utils/storage.ts` (clés préfixées `yibolo:` : `yibolo:compte`, `yibolo:avis-utiles`), toujours sous try/catch. La langue est gardée sous `yibolo:langue` (`src/i18n/index.ts`).
6. Pas de code mort : supprimer ce qui n'est plus utilisé.
7. **Pas de nouvelle dépendance sans accord.** Jamais de client d'API.
8. `vite.config.ts` liste les bibliothèques à pré-compiler (`optimizeDeps.include`) : une nouvelle bibliothèque importée par une page chargée à la demande doit y être ajoutée (sinon « Invalid hook call »). Voir aussi [performances.md](performances.md).
9. Les fichiers communs avec l'admin (briques, blocs communs, `cn.ts`, `dates.ts`) se modifient d'abord ici puis se recopient (voir [front-et-admin.md](front-et-admin.md)).

## React Compiler et react-hook-form
- **Toujours déstructurer** le résultat de `useForm` à l'appel (`const { register, formState, setError } = useForm(…)`), avec des alias s'il y a deux formulaires. Lire `form.formState.errors` sur l'objet entier laisse l'écran figé : le compilateur garde le rendu en cache (constaté le 2026-11-24 : les messages d'erreur ne s'affichaient pas).
