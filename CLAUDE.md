# CLAUDE.md — YIBOLO (front-end)

Consignes pour Claude Code sur ce dépôt. À lire en entier avant toute action.

## Le projet en bref
YIBOLO est une plateforme de **formation, d'expertise et d'emploi en Afrique centrale** (Cameroun d'abord). Quatre univers : **École**, **Consultation**, **Métiers**, **Emploi**.

Ce dépôt est **le front public et l'espace des comptes**. Sa référence visuelle est le **canevas YIBOLO** (https://claude.ai/artifact/NjiiJZFXZ9LH5jKMFLJU7a, sources dans le dossier temporaire `canvas/`), complété par la maquette Word du client (`C:\Users\USER\Documents\yibolo\NOUVEAU DESIGN YIBOLO.docx`). L'administration est un projet à part : **yibolo-admin** (même design, mêmes composants, mêmes règles).

En attendant l'API de **yibolo-backend**, les écrans lisent de **fausses données** (`src/data/fausses-donnees/`, un JSON par table), gardées pour chaque testeur dans son navigateur. **Rien n'est écrit en dur dans le code.**

- Branche de travail : `implementation-maquettes` (implémentation de toutes les maquettes du canevas).
- Ce que fait l'app, écran par écran : [docs/SPECIFICATIONS.md](docs/SPECIFICATIONS.md) · apparence : [docs/DESIGN.md](docs/DESIGN.md) · historique et à faire : [docs/DECISIONS.md](docs/DECISIONS.md) · démarrer : [README.md](README.md).

## Les 12 règles qui priment sur tout
1. **Le canevas fait foi.** Chaque écran reproduit sa planche (1440 px et 390 px) : mise en page, textes, couleurs, espacements, icônes. **Une incohérence entre deux planches se corrige** (on garde la version cohérente, la plus fréquente ou celle du composant partagé) et on la signale dans la réponse (décision du 2026-11-27).
2. **Toujours en composants** (4 niveaux, voir [composants.md](.claude/rules/composants.md)) : briques shadcn (`src/shared/shadcn/`) → blocs (`src/shared/blocs/`) → composants métier (`modules/…/components/`) → pages qui **assemblent** seulement. Pas de style dans une page, pas de `<button>`/`<input>`/`<table>` faits à la main.
3. **Aucune couleur, taille ou ombre en dur** : jetons de `src/app/styles/theme.css` (relevés dans le canevas, noms shadcn). Les « anciens jetons » (`brand`, `navy`, `sun`, `page`, `ink`, `line`) ne servent plus qu'aux pages masquées. Les tailles du canevas sont des jetons (`text-titre`, `text-meta`…), jamais `text-[…px]`.
4. **Données** : toutes par la couche `src/data/` (lectures TanStack Query) ; fausses données aujourd'hui, API de yibolo-backend plus tard par **Orval** (`npm run api:generate`). Détail : [donnees-et-backend.md](.claude/rules/donnees-et-backend.md).
5. **États et erreurs toujours prévus** : chargement (squelette de la même forme), vide, erreur avec « Réessayer », accès refusé ; erreurs d'enregistrement en message éphémère. Détail : [erreurs-et-etats.md](.claude/rules/erreurs-et-etats.md).
6. **Traduction** : tout texte visible passe par i18next (français = référence, anglais britannique). Les données ne se traduisent pas. Détail : [traduction.md](.claude/rules/traduction.md).
7. **Adresses** : toutes de `ROUTES` (`src/shared/utils/routes.ts`) ; **types** du domaine : `src/shared/types.ts`.
8. **TypeScript `strict`**, pas de `any`, **pas de nouvelle dépendance** sans accord (installées : TanStack Query, Router, Table ; Orval, axios ; shadcn/ui + Radix, cmdk ; recharts ; sonner ; **date-fns** pour toutes les dates, voir [dates-et-nombres.md](.claude/rules/dates-et-nombres.md)).
9. **Vérifier avant de dire « fait »** : `npm run typecheck`, `npm run lint`, `npm run i18n:check`, `npm run build`, puis le navigateur (`http://localhost:5199`, 1440 et 390 px, français et anglais) à côté de la planche du canevas.
10. **Commiter seul après chaque étape importante** (lot d'écrans, migration, nouvelle brique), message en français ; **pousser seulement sur demande**.
11. **La landing (`/`) est gelée** : copie de yibolo-client, ses couleurs restent les siennes (`.theme-client`).
12. Répondre **en français**, avec « vous », **court**, simplement : ce qui a été fait, vérifié, **pas** fait.

## Commandes
```bash
npm run dev          # http://localhost:5199 (5173 et 5180 sont pris par d'autres projets)
npm run typecheck    # 0 erreur
npm run lint         # oxlint, 0 avertissement
npm run i18n:check   # mêmes clés en français et en anglais
npm run build
npm run api:generate # Orval (quand yibolo-backend publiera son OpenAPI)
```
Design system (développement seulement) : http://localhost:5199/design-system — tous les composants, variantes et états.

Comptes de démo : `jean.dupont@exemple.cm` (Personne physique), `contact@ipc.cm` (École – IPES), `contact@cfp-btp.cm` (École – CFP), `contact@langues.cm` (École – Autre), mot de passe `yibolo2026`.

## Repères dans le code
- `src/app/` : la coquille (routes, cadres `layouts/`, styles, `erreursGlobales.ts`).
- `src/modules/<univers>/<partie>/` : `pages/`, `components/`, `hooks/`, `locales/` et la logique de la partie. `ecole/` (etablissements, auto-ecoles, avis, espace-pro), `compte/` (auth, mon-espace, favoris), `communaute/` (accueil), `pages/` (aide, conditions), `landing/`, `design-system/` (développement).
- Pages **masquées** (2026-11-25, code gardé sans adresse) : préinscription, inscription en auto-école, Mon espace.
- `src/shared/` : `shadcn/` (briques), `blocs/` (chargement, squelettes, états, formulaire, logo, cadres), `ui/` (liens `Lien`, `LienActif` ; le reste sert aux pages masquées), `forms/` (`ChampsLieu`, accords), `errors/`, `hooks/`, `locales/`, `utils/` (dont `dates.ts`, date-fns), `types.ts`. **`shared/` n'importe jamais `app/` ni `modules/`.**
- `src/api/` : `queryClient.ts` (erreurs globales), `client.ts` (axios), `generated/` (Orval, plus tard).
- `src/data/` : couche de données (`index.ts`, `hooks.ts`, `sources/fauxSource.ts`, `fausses-donnees/`).

## Façon de travailler
- Lire la planche du canevas et le code concerné avant d'écrire. Réutiliser ce qui existe.
- Fichiers temporaires (captures, scripts, extraits du canevas) : **dans le dossier temporaire**, jamais dans le projet.
- Une décision du porteur du projet se note dans [docs/DECISIONS.md](docs/DECISIONS.md).

## Règles détaillées (chargées automatiquement)
Dans `.claude/rules/` ; sommaire : [.claude/rules/README.md](.claude/rules/README.md).
