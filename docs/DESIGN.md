# DESIGN — YIBOLO (front et admin)

La référence est le **canevas YIBOLO** : chaque écran a sa planche à **1440 px** (ordinateur) et à **390 px** (téléphone). Ce document décrit le système qui permet de le reproduire à l'identique ; la page **/design-system** (développement) montre tous les composants, avec leurs variantes et leurs états. yibolo-admin utilise le même système.

## 1. Principes
1. **Identique au canevas** : mise en page, textes, couleurs, espacements, icônes. Ce que le canevas ne montre pas (états, erreurs) suit les blocs existants.
2. **Incohérence entre deux planches** : on garde la version cohérente (la plus fréquente, ou celle du composant partagé) et on le signale (décision du 2026-11-27).
3. **Jetons seulement** (`src/app/styles/theme.css`, noms shadcn) : jamais `[#…]`, `text-[…px]` ni `style={{ color }}`. Une valeur du canevas qui manque devient un jeton.
4. **Toujours en composants**, à 4 niveaux : briques shadcn → blocs → composants métier → pages qui assemblent (voir `.claude/rules/composants.md`).
5. **Pas de mode sombre.** Animations rares et courtes, toujours avec `motion-reduce:`.
6. La **landing** (`/`) est une copie gelée de yibolo-client : elle garde ses valeurs (`.theme-client`, police Geist).

## 2. Couleurs (jetons)
| Rôle | Jeton | Valeur |
|---|---|---|
| Fond des pages | `background` | #F4F6FA |
| Cartes, menus | `card`, `popover` | #FFFFFF |
| Texte principal | `foreground` | #0B1B3F |
| Texte secondaire | `foreground-soft` | #3C4660 |
| Texte d'appoint | `muted-foreground` | #4A5670 |
| Texte en retrait | `subtle-foreground` | #66718A |
| Bordures · bordures fortes | `border` · `border-strong` | #E0E4EC · #C9D0DD |
| Bordure des champs | `input` | #9AA5BA |
| Bleu YIBOLO · survol | `primary` · `primary-hover` | #1F55E6 · #1843B8 |
| Bleus pâles | `primary-strong`, `primary-soft`, `primary-tint`, `primary-wash`, `primary-line` | #1843B8, #EEF3FD, #E8EFFD, #F3F7FF, #DCE6FC |
| Vert (publié, vérifié, puce active) | `success` (+ `-bright`, `-soft`, `-wash`, `-line`) | #0F7A55 |
| Rouge (erreur, suppression) | `destructive` (+ `-hover`, `-soft`, `-wash`, `-line`) | #D92D4B |
| Ambre (attention, étoiles) | `warning` (+ `-bright`, `-strong`, `-deep`, `-soft`) | #E0A500 |
| Tons (badges, pastilles) | `tone-violet`, `tone-teal`, `tone-pink`, `tone-orange` (+ `-soft`) | |
| Graphiques | `chart-1` … `chart-5`, `chart-grid` | bleu, vert, ambre, violet, bleu canard |
| Barre du haut, pied de page | `surface-search`, `footer-foreground` | #EDF2FA, #C9D3E6 |
| Logo (celui de la landing) | `marque`, `marque-texte`, `marque-devise` | #1D4ED8, #18181B, #5F5F66 |

## 3. Texte
- Police **Plus Jakarta Sans** (hébergée) ; le logo et la landing utilisent **Geist**.
- Tailles : courant 14 px (`text-sm`), appoint 13 px (`text-meta`), boutons et onglets 15 px / 700 (`text-ui`), en-têtes de tableau 12 px capitales.
- Tailles du canevas en jetons : `text-micro` 10 · `text-legende` 11 · `text-intro` 17 · `text-titre-sm` 22 · `text-titre-md` 26 · `text-titre` 28 (titre de page, 800) · `text-titre-lg` 30 · `text-titre-xl` 32 · `text-titre-2xl` 34 · `text-chiffre` 44 · `text-chiffre-xl` 56. Une taille ajoutée se déclare aussi dans `src/shared/utils/cn.ts`.

## 4. Formes, ombres, largeurs
- **Boutons en pilule** : 40 px (32, 36, 44 selon l'usage). **Champs** 44 à 48 px, arrondis à 6 px. **Cartes** arrondies à 10 px, bordure, sans ombre. **Badges** 24 px. **Puces** 32 px (actives en vert ou en bleu nuit selon l'usage). **Onglets** 48 px, soulignés de 3 px.
- **Ombres** : `shadow-raised`, `shadow-thumb` (bouton sur photo), `shadow-card-hover` (vignette survolée), `shadow-floating` (menus), `shadow-dialog` (fenêtres), `shadow-bar` (barre du haut), `shadow-account`, `shadow-drawer`, `shadow-panel`, `shadow-search`.
- **Largeurs** : pages publiques `max-w-page` (1128 px), barre du haut et pied de page `max-w-bar` (1240 px), espace pro `max-w-pro` (1280 px).
- **Téléphone (390 px)** : cartes sur toute la largeur avec un filet en haut et en bas ; rangées de puces qui défilent de côté ; jamais de défilement horizontal de la page.

## 5. Cadres
| Cadre | Description |
|---|---|
| Barre du haut (`Entete`) | 68 px : logo, recherche, univers en onglets (Accueil · École · Consultation · Emploi), langue, cloche, menu du compte ; sur téléphone, barre puis rangée des univers |
| Pied de page (`PiedDePage`) | bleu nuit : logo et devise, Aide et contact · Conditions générales, copyright |
| Espace pro (`ProLayout`) | menu de l'établissement dans une carte de 240 px (tiroir sur téléphone), page à droite |
| Connexion (`CadreConnexion`) | formulaire de 400 px à gauche, photo et points de la marque à droite (ordinateur) |
| Pages de compte (`CadreCompte`) | menu de 240 px (puces sur téléphone), page à droite |

## 6. Composants
- **Briques** (`src/shared/shadcn/`) : Button, Badge, ToggleGroup, champs (Input, Textarea, Select, Checkbox, RadioGroup, Switch, Command), Tabs, Breadcrumb, Pagination, DropdownMenu, Dialog, AlertDialog, Sheet, Tooltip, Popover, Card, Table, Separator, Avatar, Progress, Skeleton, Chart, Accordion, ScrollArea, Toggle, sonner.
- **Blocs** (`src/shared/blocs/`) : chargement (Spinner, PageSpinner, SpinnerOverlay), squelettes, états (MessagePage, EmptyState, ErrorState), ChargementDonnees, BandeauHorsLigne, formulaire (Champ, ChampTexte, ChampTelephone, ChampMotDePasse, JaugeMotDePasse, CaseACocher, ListeDeroulante, Encadre, BarreEtapes, PieceAJoindre), logo (MarqueYibolo, SymboleYibolo), ChoixLangue, CadreConnexion, CadreCompte, VisionneuseMedias.
- **Métier de l'univers École** : Ariane, Carte, NoteCourte, CoeurFavori, BoutonFavori, RangeePuces, EnteteFiche, GrilleFiche, TuilePhoto, TuileVideo, listes (EnteteListe, FiltreListe, BarreResultats, PaginationListe, VignetteEcole), avis (ResumeAvis, ArticleAvis, ModaleAvis).
- Tableau complet « quel composant pour quoi » : `.claude/rules/composants.md`.

## 7. États
Chaque écran prévoit : chargement (squelette de la même forme), vide (`EmptyState` avec une action), erreur (`ErrorState` avec « Réessayer »), accès refusé et 404 (`MessagePage`), hors connexion (`BandeauHorsLigne`), messages éphémères (sonner). Voir `.claude/rules/erreurs-et-etats.md`.

## 8. Images et logo
- Photos découpées du canevas et de la maquette dans `public/images/maquette/` ; vidéos légères dans `public/videos/`.
- Logo : **celui de la landing**, partout (barre du haut, pied de page, connexion ; front et admin) : carré bleu de 24 px, « Yibolo » en Geist, devise « Apprendre · Évoluer · Réussir » dessous à partir de `sm`.
- Icônes : lucide-react uniquement.
