# YIBOLO — application front-end

**YIBOLO** est la plateforme de formation, d'expertise et d'emploi en Afrique centrale.
Elle réunit quatre univers : **École** (trouver une école et une formation), **Consultation** (consulter un expert), **Métiers** et **Emploi** (offres d'emploi, de stage et d'apprentissage).

Ce dépôt est **le front public et l'espace des comptes** de YIBOLO. Sa référence visuelle est le **canevas YIBOLO** (planches à 1440 px et 390 px), complété par la maquette Word du client. En attendant l'API de yibolo-backend, il lit de **fausses données** ; aucun appel réseau vers une API pour l'instant. L'administration est un projet à part, **yibolo-admin**, avec le même design et les mêmes composants.

Interface en français et en anglais britannique, prix en FCFA, contenus centrés sur le Cameroun.

## Documents du projet

| Document | Contenu |
|---|---|
| [docs/SPECIFICATIONS.md](docs/SPECIFICATIONS.md) | Ce que fait l'application, **écran par écran** |
| [docs/DESIGN.md](docs/DESIGN.md) | Jetons, police, formes, composants, principe « identique au canevas » |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Historique des décisions, **à faire plus tard**, idées, points à confirmer |
| [.claude/rules/](.claude/rules/) | Règles détaillées à respecter en codant (21 fichiers) |
| [CLAUDE.md](CLAUDE.md) | Consignes pour les agents IA (Claude Code) qui travaillent sur le dépôt |

## État actuel

- **Pages publiques** : landing (gelée, copie de yibolo-client), connexion, inscription (personne physique, école), mot de passe oublié, aide et contact, conditions générales.
- **Univers École** : page École, listes IPES · CFP · Autres et auto-écoles (filtres, tri, pagination), fiche d'établissement (5 onglets), formation, fiche d'auto-école (6 onglets), page d'un permis (5 onglets), avis et favoris.
- **Compte de la personne** : accueil connecté (fil de publications, commentaires), favoris, profil, paramètres, notifications.
- **Espace professionnel École** (`/pro/ecole`), partagé par les IPES, CFP et Autres : tableau de bord, profil, formations, contenus, statistiques, paramètres.
- **Masqués** (décision du 2026-11-25, code gardé sans adresse) : préinscription, inscription en auto-école, Mon espace.
- **Consultation** et **Emploi** : dans la navigation (« Bientôt »), page « bientôt disponible ».
- Les données de départ sont fausses, dans `src/data/fausses-donnees/` (un fichier JSON par table ; aucune donnée n'est écrite dans le code). Ce que fait chaque testeur est gardé **dans son navigateur** (IndexedDB). Pour repartir des données de départ : vider les données du site dans le navigateur.

## Stack

| Rôle | Choix |
|---|---|
| Build | Vite + React 19 + TypeScript (`strict`), React Compiler |
| Routage | TanStack Router (une table de routes par cadre dans `src/app/routes/`, pages chargées à la demande) |
| Données | TanStack Query (lectures de `src/data`), TanStack Table ; API de yibolo-backend plus tard par Orval + axios |
| Composants | shadcn/ui (Radix, cmdk) dans `src/shared/shadcn/`, class-variance-authority, clsx, tailwind-merge (`cn`) |
| Styles | Tailwind CSS v4, jetons dans `src/app/styles/theme.css` |
| Formulaires | react-hook-form + zod |
| Traduction | i18next + react-i18next (français par défaut, choix gardé sous `yibolo:langue`) |
| Dates | date-fns (`src/shared/utils/dates.ts`) |
| Icônes / messages / graphiques | lucide-react / sonner / recharts |
| Police | Plus Jakarta Sans (interface) et Geist (logo, landing), hébergées dans `src/assets/fonts` |
| Lint | oxlint |

Pas de gestion d'état globale : deux contextes seulement (session et favoris).

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir **http://localhost:5199** (port fixé : 5173 et 5180 servent à d'autres projets). Design system (développement) : **http://localhost:5199/design-system**.

| Commande | Effet |
|---|---|
| `npm run dev` | serveur de développement sur le port 5199 |
| `npm run typecheck` | vérification des types (0 erreur) |
| `npm run lint` | oxlint (0 avertissement) |
| `npm run i18n:check` | vérifie que l'anglais a exactement les mêmes clés que le français |
| `npm run build` | build de production |
| `npm run preview` | sert le build de production |
| `npm run api:generate` | Orval, quand yibolo-backend publiera son OpenAPI |

## Comptes de démonstration

Les comptes sont dans la base (table `comptes`). Mot de passe des comptes de départ : **`yibolo2026`**. On peut aussi se connecter avec le téléphone du compte.

| Identifiant | Compte | Usage |
|---|---|---|
| `jean.dupont@exemple.cm` | Personne physique (Jean Dupont) | accueil connecté, favoris, avis, profil, paramètres |
| `contact@ipc.cm` | École – IPES (IPC Yaoundé) | espace professionnel complet |
| `contact@cfp-btp.cm` | École – CFP (CFP du BTP) | même espace, pour un CFP |
| `contact@langues.cm` | École – Autre (Centre Linguistique) | même espace, pour un « Autre » établissement |

- Tous les comptes arrivent sur l'accueil connecté (`/accueil`) ; une école ouvre son espace pro depuis le menu du compte ou « École ».
- À la première visite, on arrive **non connecté** ; après « Se déconnecter », on le reste.
- Un compte créé par « Créer un compte » est actif tout de suite (**pas de validation par YIBOLO**, décision du 2026-11-27) ; une école entre directement dans son espace pro.

## Organisation du code

Le code est rangé **par univers** (`src/modules/<univers>/<partie>/`), comme yibolo-admin.

```
src/
├── main.tsx             point d'entrée (traduction, données, session, favoris)
├── app/                 la coquille : App.tsx, NotFound.tsx, ErrorPage.tsx, erreursGlobales.ts
│   ├── routes/            un fichier par cadre, pages.ts (pages à la demande), gardes, RouteOutlet
│   ├── layouts/           cadres (public, espace pro, connexion, landing), barre du haut, pied de page, menus (navConfig.ts)
│   └── styles/            globals.css (polices, base), theme.css (jetons)
├── modules/
│   ├── ecole/             etablissements/ · auto-ecoles/ · avis/ · espace-pro/
│   ├── compte/            auth/ · mon-espace/ (profil, paramètres, notifications) · favoris/
│   ├── communaute/        accueil/ (fil de publications)
│   ├── pages/             aide et contact, conditions générales
│   ├── landing/           accueil des visiteurs (gelé), « bientôt disponible »
│   └── design-system/     /design-system (développement)
├── shared/
│   ├── shadcn/            briques (shadcn/ui)
│   ├── blocs/             blocs (chargement, squelettes, états, formulaire, logo, cadres, visionneuse)
│   ├── ui/                liens (Lien, LienActif) ; anciens composants des pages masquées
│   ├── forms/             ChampsLieu, accords
│   ├── errors/  hooks/  locales/
│   ├── utils/             routes, format (nombres), dates (date-fns), storage, cn…
│   └── types.ts           types du domaine
├── data/                couche de données unique (index.ts, hooks.ts), sources/, fausses-donnees/ (un JSON par table)
├── api/                 queryClient.ts, client.ts (axios) ; plus tard generated/ (Orval)
├── i18n/                index.ts, i18next.d.ts
└── assets/              polices, logo

public/                  images/maquette/ (photos découpées), videos/, icons/, favicon, site.webmanifest
scripts/check-i18n.mjs   vérification des clés de traduction
docs/                    cahier des charges, design, décisions
.claude/rules/           règles détaillées pour coder
```

Chaque partie suit le même modèle : `pages/` (une page = un fichier, export nommé), `components/` (sous-dossiers pour les grandes pages), `hooks/`, `locales/` (son namespace, fr et en), et sa logique à la racine, préfixée par son nom (`autoEcoleFiche.ts`, `schoolListing.ts`, `proData.ts`).

## Traduction

Français (langue de référence, par défaut) et anglais britannique. Textes **à côté de leur partie** (`locales/fr.json`, `en.json`) ; namespaces : `common`, `layout`, `landing`, `auth`, `schools`, `driving-schools`, `reviews`, `favorites`, `pro`, `accueil`, `espace`, `pages`. Clés typées à partir du français ; `npm run i18n:check` vérifie l'anglais. Les données de démonstration restent en français. Règles et glossaire : [.claude/rules/traduction.md](.claude/rules/traduction.md).

## Thème

Jetons dans [src/app/styles/theme.css](src/app/styles/theme.css), avec les noms shadcn (`primary`, `foreground`, `muted-foreground`, `border`…), les tailles du canevas (`text-meta`, `text-ui`, `text-titre`…), les ombres et les couleurs du logo (`marque`). Pas de mode sombre. La landing garde ses propres valeurs (`.theme-client`). Détails : [docs/DESIGN.md](docs/DESIGN.md).

## Avancement

- [x] Configuration : TanStack Router, Query, Table ; shadcn/ui ; Orval ; fausses données ; date-fns
- [x] Pages publiques d'après le canevas (connexion, inscription, mot de passe oublié, aide, conditions)
- [x] Accueil connecté et compte de la personne
- [x] Univers École : page École, listes, fiche d'établissement, formation, auto-écoles, permis, avis, favoris
- [x] Espace professionnel École
- [x] Logo de la landing partout, accessibilité (audit axe), jetons des tailles
- [ ] Univers **Consultation** (espace pro du consultant, 11 menus) — à confirmer
- [ ] Univers **Emploi** (et Métiers)
- [ ] Branchement de l'API de yibolo-backend (sur demande)
