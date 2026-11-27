# YIBOLO — application front-end

**YIBOLO** est la plateforme de formation, d'expertise et d'emploi en Afrique centrale : **Apprendre · Former · Consulter · Travailler**.
Elle réunit quatre univers : **École** (trouver une école et une formation), **Consultation** (consulter un expert), **Métiers** et **Emploi** (offres d'emploi, de stage et d'apprentissage).

Ce dépôt est **le front** de YIBOLO : il reproduit la **maquette Word du client** (« NOUVEAU DESIGN YIBOLO », environ 150 captures) et le canevas. En attendant l'API de yibolo-backend, il lit de **fausses données** ; aucun appel réseau vers une API pour l'instant.

Interface en français (et en anglais), prix en FCFA, contenus centrés sur le Cameroun.

## Documents du projet

| Document | Contenu |
|---|---|
| [docs/SPECIFICATIONS.md](docs/SPECIFICATIONS.md) | Ce que fait l'application, **écran par écran** |
| [docs/DESIGN.md](docs/DESIGN.md) | Couleurs, police, formes, mise en page, composants, principe « identique à la maquette » |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Historique des décisions, **à faire plus tard**, idées, points à confirmer |
| [.claude/rules/](.claude/rules/) | Règles détaillées à respecter en codant (produit, design, code, traduction, vérification…) |
| [CLAUDE.md](CLAUDE.md) | Consignes pour les agents IA (Claude Code) qui travaillent sur le dépôt |

## État actuel

- **Univers École réalisé** : IPES, CFP et Autres (même gabarit), auto-écoles, préinscription, inscription en auto-école, avis, favoris, et l'**espace professionnel** partagé par les IPES, CFP et Autres.
- **Consultation** et **Emploi** : présents dans la navigation, avec une page « bientôt disponible ». Prochaine étape envisagée : l'univers **Consultation** (espace pro du consultant, 11 menus).
- Les données de départ sont fausses, dans `src/data/fausses-donnees/` (un fichier JSON par table ; aucune donnée n'est écrite dans le code). Ce que fait chaque testeur (formations, avis, préinscriptions, inscriptions, profil, contenus, favoris…) est gardé **dans son navigateur** (IndexedDB). Pour repartir des données de départ : vider les données du site dans le navigateur.

## Stack

| Rôle | Choix |
|---|---|
| Build | Vite + React 19 + TypeScript (`strict`), React Compiler |
| Routage | React Router (pages chargées à la demande) |
| Styles | Tailwind CSS v4, jetons dans `src/app/styles/theme.css` |
| Variantes de composants | class-variance-authority, clsx, tailwind-merge (`cn`) |
| Formulaires | react-hook-form + zod (connexion, inscription) |
| Traduction | i18next + react-i18next (français par défaut, choix gardé sous `yibolo:langue`) |
| Icônes / messages / graphiques | lucide-react / sonner / recharts |
| Nombres et dates | `Intl`, via `num()`, `fcfa()`, `shortDate()` (`src/shared/utils/format.ts`) ; date-fns est installé mais pas utilisé |
| Police | Plus Jakarta Sans, hébergée dans `src/assets/fonts` |
| Lint | oxlint |

Lectures par TanStack Query ; API de yibolo-backend plus tard par Orval (`npm run api:generate`). Pas de gestion d'état globale : deux contextes seulement (session et favoris).

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir **http://localhost:5199** (le port 5199 est fixé dans `package.json` : 5173 et 5180 servent à d'autres projets).

| Commande | Effet |
|---|---|
| `npm run dev` | serveur de développement sur le port 5199 |
| `npm run build` | vérification des types puis build de production |
| `npm run typecheck` | vérification des types seule |
| `npm run lint` | oxlint |
| `npm run i18n:check` | vérifie que l'anglais a exactement les mêmes clés que le français |
| `npm run preview` | sert le build de production |

## Comptes de démonstration

Les comptes sont dans la base (table `comptes`). Mot de passe des comptes de départ : **`yibolo2026`**.

| Identifiant | Compte |
|---|---|
| `jean.dupont@exemple.cm` | Personne physique |
| `contact@ipc.cm` | École – IPES |
| `contact@cfp-btp.cm` | École – CFP |
| `contact@langues.cm` | École – Autre |

On peut aussi se connecter avec le téléphone du compte. Un compte École créé par « Créer un compte » est enregistré « en vérification » ; il est validé par YIBOLO quand il revient se connecter (écran « Compte validé ! »).

Les comptes :

| Compte | Nom affiché | Arrive sur | Usage |
|---|---|---|---|
| Personne physique (Utilisateur) | Jean Dupont | `/accueil` | chercher une école, se préinscrire, s'inscrire en auto-école, gérer ses favoris, donner un avis |
| École – IPES | IPC Yaoundé (Institut Professionnel du Centre) | `/pro/ecole` | espace professionnel complet |
| École – CFP | CFP du BTP (Douala) | `/pro/ecole` | même espace, pour un CFP |
| École – Autre | Centre Linguistique | `/pro/ecole` | même espace, pour un « Autre » établissement |

- À la première visite, on arrive **non connecté** : « Se connecter » sur la landing.
- L'espace professionnel (`/pro/ecole`) n'est ouvert qu'aux comptes école ; les autres sont renvoyés à la connexion.
- L'inscription (`/inscription`) se parcourt jusqu'au bout ; une école se reconnecte pour voir « Compte validé ! ».

## Organisation du code

Le code est rangé **par univers** (`src/modules/<univers>/<partie>/`), comme yibolo-admin : tout ce qui concerne les auto-écoles est dans `modules/ecole/auto-ecoles/`, tout ce qui concerne l'espace professionnel dans `modules/ecole/espace-pro/`, etc.

```
src/
├── main.tsx             point d'entrée (traduction, session, favoris)
├── app/                 la coquille de l'application
│   ├── App.tsx            écran de secours, messages éphémères
│   ├── routes/            table des routes (index.tsx) et RouteOutlet (chargement, erreurs)
│   ├── layouts/           cadres : pages publiques, espace pro, connexion, menu du compte ; menus (navConfig.ts)
│   ├── styles/            CSS global (police) et thème (couleurs)
│   └── NotFound.tsx       page 404 · ErrorPage.tsx (page d'erreur)
│
├── modules/             un dossier par univers, découpé en parties
│   ├── ecole/
│   │   ├── etablissements/  IPES, CFP, Autres : annuaire École, listes par type, fiche, formation, préinscription
│   │   ├── auto-ecoles/     auto-écoles : liste, fiche, permis, inscription et sa modification
│   │   ├── avis/            avis (donner un avis, blocs d'avis)
│   │   └── espace-pro/      espace professionnel École (tableau de bord, profil, formations, contenus, statistiques, paramètres)
│   ├── compte/
│   │   ├── auth/            connexion, inscription, mot de passe oublié + session (useSession)
│   │   ├── mon-espace/      Mon espace de la personne physique, profil, paramètres, notifications
│   │   └── favoris/         page « Mes favoris »
│   ├── communaute/
│   │   └── accueil/         accueil connecté : fil de publications, publication
│   └── landing/           accueil des visiteurs, page « bientôt disponible » (Consultation, Emploi)
│
├── shared/              ce qui sert à plusieurs parties
│   ├── ui/                briques de base (bouton, badge, carte, onglets, étoiles, logo, graphiques…)
│   ├── forms/             champs de formulaire (Fields.tsx)
│   ├── errors/            ErrorBoundary, écrans d'erreur et hors connexion
│   ├── shadcn/            composants shadcn/ui (ajoutés à la demande)
│   ├── hooks/             useFavorites
│   ├── locales/           textes partagés (namespace common) : fr.json, en.json
│   ├── utils/             routes, format (nombres, FCFA, dates), storage, cn
│   └── types.ts           types du domaine
│
├── i18n/                traduction : index.ts (initialisation, langue gardée), i18next.d.ts (clés typées)
├── data/                toutes les données : couche unique (index.ts, hooks.ts), sources/ (fausses données), fausses-donnees/ (un JSON par table)
├── api/                 queryClient.ts, client axios (client.ts) et, plus tard, le code généré par Orval (generated/)
└── assets/              police Plus Jakarta Sans et logo YIBOLO

public/
├── images/maquette/     photos découpées de la maquette du client
├── icons/               icônes d'application (192, 512, Apple)
├── favicon.svg, favicon.ico
├── og-image.png         image de partage (réseaux sociaux), comme yibolo-client
└── site.webmanifest

scripts/check-i18n.mjs   vérification des clés de traduction
docs/                    cahier des charges, design, décisions
.claude/rules/           règles détaillées pour coder
```

Chaque partie d'un module suit le même modèle :

```
modules/ecole/auto-ecoles/
├── pages/               les pages (une page = un fichier, export nommé)
├── components/          les composants propres à cette partie (profile/ : onglets de la fiche)
├── hooks/               ses hooks (useInscriptionDraft)
├── locales/             ses textes : fr.json, en.json
└── autoEcoleRules.ts    sa logique (icônes des permis, pièces à fournir)
```

## Traduction

L'interface existe en **français** (langue de référence, par défaut) et en **anglais britannique**. Le choix se fait avec le sélecteur de langue des en-têtes et reste gardé dans le navigateur (`yibolo:langue`), français par défaut, comme dans yibolo-client.

- Textes **à côté de leur partie** : `src/modules/<univers>/<partie>/locales/fr.json` et `en.json`, `src/shared/locales/` (`common`), `src/app/layouts/locales/` (`layout`). Namespaces : `common`, `layout`, `landing`, `auth`, `schools`, `driving-schools`, `reviews`, `favorites`, `pro`.
- Initialisation et types : `src/i18n/index.ts`, `src/i18n/i18next.d.ts`.
- Les clés sont **typées** à partir du français : une clé absente est une erreur TypeScript.
- `npm run i18n:check` vérifie que l'anglais a les mêmes clés que le français.
- Les données de démonstration (`src/data/fausses-donnees/`) restent en français : elles jouent le rôle du serveur.

Règles complètes et glossaire : [.claude/rules/traduction.md](.claude/rules/traduction.md).

## Thème

Les jetons de couleur et la police sont dans [src/app/styles/theme.css](src/app/styles/theme.css) : bleu YIBOLO (`brand-…`), bleu nuit (`navy-…`), jaune (`sun-…`), fond, texte et bordures. Il n'y a **pas de mode sombre** (la maquette n'en a pas). Détails : [docs/DESIGN.md](docs/DESIGN.md).

## Avancement

- [x] Projet, thème, police hébergée, logo, icônes d'application
- [x] Connexion et inscription (4 profils, vérification, compte validé)
- [x] Accueil
- [x] Univers École : IPES, CFP, Autres (7 onglets), fiche établissement, formation, préinscription en 4 étapes
- [x] Auto-écoles : liste, fiche (6 onglets), permis A à D, inscription en 3 étapes et sa modification
- [x] Avis et favoris
- [x] Espace professionnel École (6 menus)
- [x] Code rangé par univers (`src/modules/`), TypeScript `strict`
- [ ] **Traduction français / anglais** (en cours)
- [ ] Univers **Consultation** (espace pro du consultant, 11 menus)
- [ ] Univers **Emploi** (et Métiers)
