# CLAUDE.md — YIBOLO (front-end)

Consignes pour Claude Code sur ce dépôt. À lire en entier avant toute action.

## Le projet en bref
YIBOLO est une plateforme de **formation, d'expertise et d'emploi en Afrique centrale** (Cameroun d'abord). Elle réunit quatre univers : **École**, **Consultation**, **Métiers** et **Emploi**.

Ce dépôt est **un front seul** : il transforme la **maquette Word du client** (`C:\Users\USER\Documents\yibolo\NOUVEAU DESIGN YIBOLO.docx`, environ 150 captures) en interface qui fonctionne, avec des **données de démonstration** enregistrées pour chaque testeur dans une **base SQLite dans le navigateur** (`src/data/`, données de départ dans `src/data/depart/yibolo.sql`). **Rien n'est écrit en dur dans le code.**

- **Réalisé :** l'univers **École** : IPES, CFP et Autres (même gabarit), auto-écoles, l'**espace professionnel** partagé par les IPES, CFP et Autres, l'accueil connecté et **Mon espace** de la personne physique (`/mon-espace`, onglets, sans barre latérale).
- **Pas encore réalisé :** Consultation et Emploi (page « bientôt disponible »). Prochaine étape envisagée : l'univers **Consultation**.

- Ce que fait l'app, écran par écran : [docs/SPECIFICATIONS.md](docs/SPECIFICATIONS.md)
- Apparence et composants : [docs/DESIGN.md](docs/DESIGN.md)
- Historique des choix, **à faire plus tard**, idées : [docs/DECISIONS.md](docs/DECISIONS.md)
- Démarrer, comptes de démo, organisation du code : [README.md](README.md)

## Les 10 règles qui priment sur tout
1. **Pas de serveur à nous.** Aucun backend, pas d'Orval, pas de react-query. **Toutes** les données passent par la couche `src/data/` (SQLite dans le navigateur aujourd'hui, remplaçable plus tard sans toucher aux écrans) ; les données de départ sont dans `src/data/depart/yibolo.sql`, rien n'est écrit en dur. **Ne jamais proposer de brancher yibolo-backend.** Détail : [.claude/rules/donnees-et-backend.md](.claude/rules/donnees-et-backend.md).
2. **Identique à la maquette.** Photos découpées de la maquette (`public/images/maquette/`), textes et chiffres recopiés de chaque capture. Les contradictions de la maquette (prix des permis entre liste et détail, modes de formation) sont **gardées telles quelles**, écran par écran. On ne « corrige » pas la maquette sans accord.
3. **Périmètre : univers École seulement.** Consultation et Emploi restent une page « bientôt disponible » tant que le porteur du projet n'a pas dit de les commencer.
4. **Proposer d'abord, attendre « vas-y ».** Un accord vaut pour ce changement-là seulement. « **Dis-moi juste** » / « **réponds juste** » = répondre seulement, ne rien modifier.
5. Répondre **en français**, avec « vous », **court** et simplement. Dire ce qui a été fait, vérifié et **pas** fait. Les plans sont détaillés, concrets, en français simple.
6. **Traduction :** tout texte visible passe par i18next (français = référence, anglais britannique). Le français reste **mot pour mot** celui de la maquette. Les données de démo ne se traduisent pas. Détail : [.claude/rules/traduction.md](.claude/rules/traduction.md).
7. **Toujours les composants existants** ([composants.md](.claude/rules/composants.md)), **aucune nouvelle couleur en dur** (jetons de `src/app/styles/theme.css`), toutes les adresses de `ROUTES` (`src/shared/utils/routes.ts`), tous les types du domaine dans `src/shared/types.ts`.
8. **TypeScript `strict`**, pas de `any`, **pas de nouvelle dépendance** sans accord.
9. **Vérifier avant de dire « fait »** : `npm run typecheck`, `npm run lint`, `npm run i18n:check`, `npm run build`, puis le navigateur (`http://localhost:5199`, 1440 et 390 px, en français et en anglais), comparé à la capture de la maquette.
10. **Commiter et pousser seulement sur demande.**

## Commandes
```bash
npm run dev          # serveur de développement : http://localhost:5199 (5173 et 5180 sont pris par d'autres projets)
npm run typecheck    # vérification des types (doit donner 0 erreur)
npm run lint         # oxlint (ne pas ajouter d'avertissement)
npm run i18n:check   # mêmes clés en français et en anglais
npm run build        # vérification des types puis build de production
npm run preview      # sert le build
```
Comptes de démo (table `comptes` de la base) : `jean.dupont@exemple.cm` (Personne physique), `contact@ipc.cm` (École – IPES), `contact@cfp-btp.cm` (École – CFP), `contact@langues.cm` (École – Autre), tous avec le mot de passe `yibolo2026`. Un compte créé par « Créer un compte » s'enregistre aussi dans la base.

## Repères dans le code
Code rangé **par fonctionnalité**, sur le modèle d'Autopia (détail : README › Organisation du code, et `.claude/rules/code-et-architecture.md`).
- `src/app/` : la coquille. `routes/` (table des routes `index.tsx`, `RouteOutlet`), `layouts/` (`PublicLayout`, `ProLayout`, `AuthLayout`, `AccountMenu`, menus dans `navConfig.ts`), `styles/` (`globals.css`, `theme.css`), `NotFound.tsx`, `ErrorPage.tsx`.
- `src/features/<sujet>/` : `pages/`, `components/`, `hooks/` et les fichiers de logique du sujet à sa racine. Sujets : `landing`, `auth`, `schools` (IPES, CFP, Autres), `driving-schools` (auto-écoles), `reviews`, `favorites`, `pro` (espace professionnel).
- `src/shared/` : ce qui sert à plusieurs sujets. `components/ui/` (briques), `components/forms/` (`Fields.tsx`), `components/errors/`, `hooks/` (`useFavorites`), `i18n/` (traduction), `utils/` (`routes`, `format`, `storage`, `cn`), `types.ts`. **`shared/` n'importe jamais `app/` ni `features/`.**
- Logique propre à un sujet : `features/schools/schoolLinks.tsx`, `schoolDomains.ts` ; `features/driving-schools/autoEcoleRules.ts` ; `features/pro/proStyles.ts`.
- Données : `src/data/` (point d'entrée `index.ts` : `useCollection`, `data.create/update/remove` ; lectures dans `hooks.ts` ; source SQLite dans `sources/` ; données de départ `depart/yibolo.sql`). Plus de `src/mocks/`. Panneau « Données de test » (exporter, importer, réinitialiser) dans le menu du compte.
- Session : `features/auth/hooks/useSession.tsx` (`useSession`, `useMonEcole`). Favoris : `shared/hooks/useFavorites.tsx`.
- Traduction : `src/i18n/` (initialisation, types) et un dossier `locales/` (fr.json, en.json) dans chaque fonctionnalité, `src/shared/locales/` et `src/app/layouts/locales/` ; même organisation que yibolo-client (voir `.claude/rules/traduction.md`). Thème : `src/app/styles/theme.css`.
- Les commentaires `imgN` dans le code renvoient à l'image `word/media/imageN` de la maquette Word.

## Façon de travailler
- Lire le code concerné **et la capture de la maquette** avant de proposer. Réutiliser ce qui existe (voir `.claude/rules/composants.md`).
- Pour un changement visible : proposer avec ce que ça implique, attendre l'accord, faire, montrer une capture avant/après à côté de la capture de la maquette, puis un commit par point **si on le demande**.
- Fichiers temporaires (captures, scripts, extraction de la maquette) : **hors du projet**, dans le dossier temporaire.
- Ne pas installer de dépendance, ne pas télécharger d'images, ne pas pousser sans accord.
- Une nouvelle décision du porteur du projet se note dans [docs/DECISIONS.md](docs/DECISIONS.md) (et dans [docs/SPECIFICATIONS.md](docs/SPECIFICATIONS.md) si elle change un écran).

## Règles détaillées (chargées automatiquement)
Les règles sont dans `.claude/rules/` : Claude Code charge automatiquement tous les fichiers de ce dossier. Sommaire : [.claude/rules/README.md](.claude/rules/README.md). La traduction a son propre fichier : [.claude/rules/traduction.md](.claude/rules/traduction.md).
