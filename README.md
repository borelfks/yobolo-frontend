# YIBOLO — application front-end

**YIBOLO** est la plateforme de formation, d'expertise et d'emploi en Afrique centrale : **Apprendre · Former · Consulter · Travailler**.
Elle réunit quatre univers : **École** (trouver une école et une formation), **Consultation** (consulter un expert), **Métiers** et **Emploi** (offres d'emploi, de stage et d'apprentissage).

Ce dépôt est **un front seul** : il reproduit la **maquette Word du client** (« NOUVEAU DESIGN YIBOLO », environ 150 captures) avec des **données de démonstration**. Il n'y a **aucun backend** et aucun appel réseau vers une API.

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
- Les données de départ sont fictives (`src/mocks/`). Ce que fait chaque testeur (formations, avis, préinscriptions, inscriptions, profil, contenus, favoris…) est enregistré dans **sa base SQLite, dans son navigateur** (`src/data/`). Menu du compte › **Données de test** : exporter un fichier `.sqlite` pour le partager, l'importer chez un collègue, ou tout réinitialiser.

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

Pas de backend, pas de client d'API, pas de gestion d'état globale : deux contextes seulement (session et favoris).

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

Sur la page **Connexion** (`/connexion`), le bloc **« Compte de démonstration »** permet de choisir le compte. N'importe quel identifiant et n'importe quel mot de passe d'au moins 6 caractères sont acceptés.

| Compte | Nom affiché | Arrive sur | Usage |
|---|---|---|---|
| Personne physique (Utilisateur) | Jean Dupont | `/ecoles` | chercher une école, se préinscrire, s'inscrire en auto-école, gérer ses favoris, donner un avis |
| École – IPES | IPC Yaoundé (Institut Professionnel du Centre) | `/pro/ecole` | espace professionnel complet |
| École – CFP | CFP du BTP (Douala) | `/pro/ecole` | même espace, pour un CFP |
| École – Autre | Centre Linguistique | `/pro/ecole` | même espace, pour un « Autre » établissement |

- À la première visite, la démo s'ouvre avec le compte **Utilisateur**.
- `/connexion?espace=ecole` présélectionne le compte IPES.
- L'espace professionnel (`/pro/ecole`) n'est ouvert qu'aux comptes école ; les autres sont renvoyés à la connexion.
- L'inscription (`/inscription`) se parcourt jusqu'au bout ; « Simuler la validation par YIBOLO » montre l'écran « Compte validé ! ».

## Organisation du code

Le code est rangé **par fonctionnalité**, sur le modèle d'Autopia : tout ce qui concerne les auto-écoles est dans `features/driving-schools/`, tout ce qui concerne l'espace professionnel dans `features/pro/`, etc.

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
├── features/            une fonctionnalité = un dossier
│   ├── landing/           accueil, page « bientôt disponible » (Consultation, Emploi)
│   ├── auth/              connexion, inscription + session (useSession)
│   ├── schools/           IPES, CFP, Autres : annuaire École, listes par type, fiche, formation, préinscription
│   ├── driving-schools/   auto-écoles : liste, fiche, permis, inscription et sa modification
│   ├── reviews/           avis (donner un avis, blocs d'avis)
│   ├── favorites/         page « Mes favoris »
│   └── pro/               espace professionnel École (tableau de bord, profil, formations, contenus, statistiques, paramètres)
│
├── shared/              ce qui sert à plusieurs fonctionnalités
│   ├── components/ui/     briques de base (bouton, badge, carte, onglets, étoiles, logo, graphiques…)
│   ├── components/forms/  champs de formulaire (Fields.tsx)
│   ├── components/errors/ ErrorBoundary, écrans d'erreur et hors connexion
│   ├── hooks/             useFavorites
│   ├── locales/           textes partagés (namespace common) : fr.json, en.json
│   ├── utils/             routes, format (nombres, FCFA, dates), storage, cn
│   └── types.ts           types du domaine
│
├── i18n/                traduction : index.ts (initialisation, langue gardée), i18next.d.ts (clés typées)
├── data/                données enregistrées : couche unique (index.ts, hooks.ts), sources/ (SQLite navigateur, mémoire), remplaçable plus tard
├── mocks/               données de départ et de référence (seed.ts construit la base de départ)
└── assets/              police Plus Jakarta Sans et logo YIBOLO

public/
├── images/maquette/     photos découpées de la maquette du client
├── icons/               icônes d'application (192, 512, Apple)
├── favicon.svg
└── site.webmanifest

scripts/check-i18n.mjs   vérification des clés de traduction
docs/                    cahier des charges, design, décisions
.claude/rules/           règles détaillées pour coder
```

Chaque dossier de `features/` suit le même modèle :

```
features/driving-schools/
├── pages/               les pages (une page = un fichier, export nommé)
├── components/          les composants propres à cette fonctionnalité (profile/ : onglets de la fiche)
├── hooks/               ses hooks (useInscriptionDraft)
├── locales/             ses textes : fr.json, en.json
└── autoEcoleRules.ts    sa logique (icônes des permis, pièces à fournir)
```

## Traduction

L'interface existe en **français** (langue de référence, par défaut) et en **anglais britannique**. Le choix se fait avec le sélecteur de langue des en-têtes et reste gardé dans le navigateur (`yibolo:langue`), français par défaut, comme dans yibolo-client.

- Textes **à côté de leur fonctionnalité** : `src/features/<sujet>/locales/fr.json` et `en.json`, `src/shared/locales/` (`common`), `src/app/layouts/locales/` (`layout`). Namespaces : `common`, `layout`, `landing`, `auth`, `schools`, `driving-schools`, `reviews`, `favorites`, `pro`.
- Initialisation et types : `src/i18n/index.ts`, `src/i18n/i18next.d.ts`.
- Les clés sont **typées** à partir du français : une clé absente est une erreur TypeScript.
- `npm run i18n:check` vérifie que l'anglais a les mêmes clés que le français.
- Les données de démonstration (`src/mocks/`) restent en français : elles jouent le rôle du serveur.

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
- [x] Code rangé par fonctionnalité (modèle Autopia), TypeScript `strict`
- [ ] **Traduction français / anglais** (en cours)
- [ ] Univers **Consultation** (espace pro du consultant, 11 menus)
- [ ] Univers **Emploi** (et Métiers)
