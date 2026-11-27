# Code et architecture

## Stack
Vite + React 19 (React Compiler) + TypeScript `strict` · React Router (TanStack Router installé, migration à décider) · **TanStack Query** (lectures de `src/data`) · **TanStack Table** (grands tableaux) · Tailwind CSS v4 · **shadcn/ui** (Radix, `components.json`, composants dans `src/shared/components/shadcn/`) · class-variance-authority + clsx + tailwind-merge (`cn`) · react-hook-form + zod · i18next + react-i18next · lucide-react · sonner · recharts · oxlint · **Orval** + axios pour l'API de yibolo-backend (plus tard).

## Organisation : par fonctionnalité (modèle Autopia)
```
src/
├── main.tsx            point d'entrée : traduction, SessionProvider, FavoritesProvider
├── app/                la coquille de l'application
│   ├── App.tsx           routeur, écran de secours, messages éphémères
│   ├── NotFound.tsx      404 · ErrorPage.tsx (erreur du routeur)
│   ├── routes/           table des routes (index.tsx), RouteOutlet (chargement + erreurs dans le cadre)
│   ├── layouts/          PublicLayout, ProLayout, AuthLayout, AccountMenu, navConfig.ts (menus)
│   └── styles/           globals.css (police, base), theme.css (jetons)
├── features/           une fonctionnalité = un dossier
│   ├── landing/          accueil, page « bientôt disponible »
│   ├── auth/             connexion, inscription, session (useSession, useMonEcole)
│   ├── schools/          IPES, CFP, Autres : annuaire, listes par type, fiche, formation, préinscription
│   ├── driving-schools/  auto-écoles : liste, fiche, permis, inscription
│   ├── reviews/          donner un avis, blocs d'avis
│   ├── favorites/        Mes favoris
│   └── pro/              espace professionnel École
├── shared/             ce qui sert à plusieurs fonctionnalités
│   ├── components/ui/    briques de base
│   ├── components/forms/ champs (Fields.tsx)
│   ├── components/errors/ ErrorBoundary, écrans d'erreur
│   ├── hooks/            useFavorites
│   ├── locales/          textes du namespace common (fr.json, en.json)
│   ├── utils/            routes, format, storage, cn
│   └── types.ts          types du domaine
├── i18n/               traduction : index.ts, i18next.d.ts (comme yibolo-client)
├── data/               données (voir donnees-et-backend.md) : index.ts, hooks.ts, sources/, fausses-donnees/
├── api/                client axios (client.ts) ; code généré par Orval (generated/, plus tard)
└── assets/             fonts/ (Plus Jakarta Sans), brand/ (logo)
```

Chaque fonctionnalité suit le même modèle :
```
features/schools/
├── pages/              les pages (une page = un fichier, export nommé)
├── components/         ses composants (sous-dossiers pour les grandes pages : listing/, profile/, training/)
├── hooks/              ses hooks, s'il y en a
├── locales/            ses textes : fr.json, en.json (namespace de la fonctionnalité)
└── schoolLinks.tsx, schoolDomains.ts   sa logique, à la racine, préfixée par son nom
```

## Règles de rangement
- Un fichier utilisé par **une seule** fonctionnalité vit dans cette fonctionnalité. Il va dans `shared/` seulement quand **plusieurs** s'en servent.
- **`shared/` n'importe jamais `app/` ni `features/`** (il peut importer `@/data`). **`src/data/` n'importe ni `app/` ni `features/`** ; ses fausses données sont dans `src/data/fausses-donnees/`. **Aucune donnée écrite dans le code** (voir [donnees-et-backend.md](donnees-et-backend.md)).
- **Sens des dépendances entre fonctionnalités** (constaté le 2026-11-21) :

  `auth` → `schools` → `driving-schools` → `reviews` → (`favorites`, `pro`, `landing`, `accueil`, `espace`)

  Une fonctionnalité n'importe que celles placées **avant** elle ; jamais l'inverse, et pas d'import entre celles du dernier groupe. Aujourd'hui : `reviews` utilise `driving-schools` (`AEHeader`), `favorites` utilise `schools`, `pro` utilise `auth` et `schools`, `espace` (Mon espace de la personne physique) utilise `auth` et `schools`. Si un besoin va dans l'autre sens, la chose est mal rangée : la mettre dans `shared/`.
- `app/` peut importer `features/auth` (session) ; les pages de connexion importent `app/layouts/AuthLayout`.
- Pas de sous-dossiers `services/` ou `utils/` dans une fonctionnalité : ses fichiers de logique sont à sa racine, préfixés par son nom (`autoEcoleRules.ts`, `schoolLinks.tsx`, `proStyles.ts`).
- Une page de plus d'environ 500 lignes se découpe dans `components/<sous-dossier>/` de sa fonctionnalité.
- **Noms de fichiers** : composants en `PascalCase.tsx`, logique en `camelCase.ts`. Les pages gardent leur nom français (`EcoleProfil.tsx`, `InscriptionAutoEcole.tsx`).
- **Pages** : export nommé, chargées avec `lazy(() => import(…).then((m) => ({ default: m.X })))` dans `app/routes/index.tsx`.
- **Imports** : `@/…` (= `src/…`) ; `./…` seulement pour un fichier du même dossier.
- **Un fichier de composant n'exporte que des composants** (sinon le rafraîchissement à chaud casse, et oxlint avertit). Constantes et fonctions dans un `.ts`, hooks dans `hooks/`.
- **Pas de gestion d'état globale** : deux contextes seulement, `SessionProvider` (`features/auth/hooks/useSession.tsx`) et `FavoritesProvider` (`shared/hooks/useFavorites.tsx`). L'état d'un écran reste dans le composant ou dans l'adresse (onglets).

## Règles de code
1. **TypeScript `strict`**, `noUnusedLocals`, `noUnusedParameters`, pas de `any`. Types du domaine dans `shared/types.ts` (`Etablissement`, `Formation`, `AutoEcole`, `Permis`, `InscriptionDraft`, `Favorite`, `Account`…).
2. **Adresses** : `ROUTES` / `ROUTE_PATTERNS`. **Couleurs** : jetons. **Textes** : traduction (voir [traduction.md](traduction.md)). **Nombres et dates** : `num()`, `fcfa()`, `shortDate()`.
3. Composants courts et lisibles. Les commentaires sont **en français** et expliquent le *pourquoi* ; une référence à la maquette s'écrit `imgN` (= `word/media/imageN` du fichier Word).
4. Pas de `dangerouslySetInnerHTML`. Aucune clé secrète (il n'y en a pas : `.env.example` le rappelle).
5. Stockage local : `load` / `save` de `shared/utils/storage.ts` (clés préfixées `yibolo:` : `yibolo:compte`, `yibolo:inscription-v2:<auto-école>:<permis>`), toujours sous try/catch. La langue est gardée sous `yibolo:langue` (`src/i18n/index.ts`).
6. Pas de code mort : supprimer ce qui n'est plus utilisé.
7. **Pas de nouvelle dépendance sans accord.** Jamais de client d'API.
8. `vite.config.ts` liste les bibliothèques à pré-compiler (`optimizeDeps.include`) : une nouvelle bibliothèque importée par une page chargée à la demande doit y être ajoutée (sinon « Invalid hook call »).

## React Compiler et react-hook-form
- **Toujours déstructurer** le résultat de `useForm` à l'appel (`const { register, formState, setError } = useForm(…)`), avec des alias s'il y a deux formulaires. Lire `form.formState.errors` sur l'objet entier laisse l'écran figé : le compilateur garde le rendu en cache (constaté le 2026-11-24 : les messages d'erreur ne s'affichaient pas).
