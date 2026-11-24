# YIBOLO — Design

> Comment l'application doit **avoir l'air**, et avec quelles briques la construire.
> Règles détaillées pour coder : [.claude/rules/design.md](../.claude/rules/design.md) et [.claude/rules/composants.md](../.claude/rules/composants.md). Ce que fait l'app : [SPECIFICATIONS.md](SPECIFICATIONS.md).

---

## 1. Principes

- **Identique à la maquette.** Le modèle unique est la maquette Word du client (`C:\Users\USER\Documents\yibolo\NOUVEAU DESIGN YIBOLO.docx`, environ 150 captures). Chaque écran reproduit **sa** capture : mise en page, photos, textes, chiffres, couleurs, icônes.
  - **Photos** : découpées dans les captures de la maquette, rangées dans `public/images/maquette/`.
  - **Textes et chiffres** : recopiés mot pour mot de la capture (« 1 248 établissements », « 4,7 (286 avis) »…).
  - **Contradictions de la maquette gardées** : si deux captures se contredisent (prix d'un permis dans la liste et sur sa page, mode de cours d'une formation), chaque écran garde **le chiffre de sa propre capture**.
  - On ne « modernise » pas, on n'harmonise pas, on ne corrige pas la maquette sans l'accord du porteur du projet.
- **Ordinateur d'abord, comme la maquette** (captures en largeur d'ordinateur, environ 1440 px). Chaque écran reste **utilisable sur téléphone** (390 px), sans défilement horizontal.
- **Univers bleu YIBOLO** : bleu vif pour les actions, bleu nuit pour les bandeaux et la barre latérale, jaune pour « Rechercher » et « Préinscrire ».
- **Une chose = un composant.** Avant de dessiner un élément, on cherche s'il existe déjà (§ 6).

---

## 2. Couleurs (jetons)

Les jetons sont dans [src/app/styles/theme.css](../src/app/styles/theme.css) (bloc `@theme` de Tailwind v4), repris de la maquette, et utilisables en classes (`bg-brand-600`, `text-navy-900`, `border-line`…).

| Jeton | Valeur | Usage |
|---|---|---|
| `brand-50` / `brand-100` / `brand-200` | `#eef4ff` / `#dbe7ff` / `#bfd3ff` | fonds et contours bleus clairs, survols |
| `brand-500` | `#2f6bff` | contour du focus, accents |
| `brand-600` | `#1f55e6` | **bouton principal**, onglet actif, liens, icônes |
| `brand-700` | `#1a45c2` | survol du bouton principal, prix |
| `navy-700` / `navy-800` | `#163a9c` / `#0f2c7a` | menu actif des pages publiques, bandeau de recherche, logo |
| `navy-900` / `navy-950` | `#0a1f5c` / `#071645` | titres, texte fort, fonds très sombres |
| `sun-300` / `sun-400` / `sun-500` | `#fde68a` / `#fcd34d` / `#f5c400` | bouton jaune **« Rechercher »**, « Préinscrire », soulignement du titre de l'accueil |
| `page` | `#f4f7fc` | fond des pages |
| `ink` | `#0f1d3d` | texte principal |
| `muted` | `#5b6885` | texte secondaire |
| `line` | `#e3e9f4` | bordure des cartes |

**Dégradés** (dans `src/app/styles/globals.css`) : `.bg-navy-gradient` (carte bleu nuit des Paramètres), `.bg-ai-gradient` (carte `AiCard`, violet clair), `.bg-hero-gradient` (défini, pas utilisé aujourd'hui). La barre latérale de l'espace pro, le bandeau de l'accueil et le cadre de connexion ont leur propre dégradé écrit dans le composant.

**Couleurs de sens** (palette Tailwind, comme sur la maquette) :
- vert `emerald` : « Établissement vérifié », « Agréée », réussite, « Publiée » ;
- orange / `amber` : « En attente », attention ; **étoiles** en `amber-400` ;
- rouge `rose` : erreurs, suppression, compteur de la cloche ;
- violet, ciel, rose, sarcelle : pastilles de filières et tuiles d'icônes (`Badge`, `IconTile`, `tilePalette`).

**Valeurs écrites à la main.** Pour coller à la maquette, le code contient encore environ 240 couleurs écrites à la main (`[#c9d4ea]` pour la bordure des champs, `[#eef3fc]` pour les fonds bleu très clair…) et environ 600 tailles de texte en pixels. On **ne les ajoute plus** : une nouvelle couleur devient un jeton de `theme.css`. Les remplacer par des jetons est noté dans [DECISIONS.md › À faire plus tard](DECISIONS.md#2-à-faire-plus-tard), à faire **écran par écran** avec une capture avant/après.

**Pas de mode sombre** : la maquette n'en a pas (`color-scheme: light`).

---

## 3. Typographie

- Police **Plus Jakarta Sans** (variable, graisses 200 à 800), **hébergée dans le projet** : `src/assets/fonts/` (sous-ensembles latin et latin étendu, `woff2`), déclarée dans `globals.css` et posée par le jeton `--font-sans`. Licence SIL Open Font License 1.1 (usage commercial autorisé). Aucun appel à Google Fonts.
- Titres (`h1` à `h4`) : gras, interlettrage serré. Les tailles suivent la capture (ex. titre de l'accueil 33 px sur ordinateur, titres de section 21 à 26 px).
- Nombres et prix : `num()` et `fcfa()` (`src/shared/utils/format.ts`) : « 450 000 FCFA » en français, « 450,000 FCFA » en anglais. Notes : « 4,7 » / « 4.7 ».
- Guillemets français « … » et apostrophe typographique ’ dans les textes français, comme la maquette.

---

## 4. Formes, espaces, ombres

- **Cartes** : `Card` = arrondi 16 px (`rounded-2xl`), bordure `border-line`, fond blanc, ombre très légère. Les cartes de l'espace pro utilisent `proCard` (`features/pro/proStyles.ts`).
- **Grands blocs** : bandeau de l'accueil 22 px, cadre de connexion 28 px, carte d'inscription 26 px (valeurs de la maquette).
- **Boutons** : `Button` arrondi 12 px (`rounded-xl`) ; beaucoup de boutons de la maquette sont **en pilule** (`rounded-full`), principal bleu plein, secondaire contour bleu.
- **Champs** : hauteur 40 à 48 px selon l'écran, arrondi 8 à 12 px, bordure `#c9d4ea`, focus bleu (`focus:border-brand-500`, anneau `brand-100`).
- **Pastilles, badges, avatars** : ronds.
- **Largeurs** : pages publiques jusqu'à **1320 px** (`max-w-[1320px]`), marges de 20 px ; espace pro : barre latérale de **250 px** + contenu.

---

## 5. Mise en page

### Pages publiques (`PublicLayout`)
- **Barre du haut** (68 px, blanche, collée en haut) : logo YIBOLO, menu **Accueil · École · Consultation · Emploi** (pilule bleu nuit sur la rubrique active), puis « Se connecter » / « Créer un compte » ou la cloche et le menu du compte. Sur téléphone, le menu s'ouvre avec ☰.
- **Bandeaux** (`Hero`) : fond bleu, icône, titre, sous-titre, photo à droite avec un arc jaune, atouts en blanc.
- **Fil d'Ariane** (`Breadcrumb`) en haut des pages de l'univers École : « École › IPES › Institut Professionnel du Centre (IPC) › Aperçu ».
- **Onglets en blocs** (`LinkTabs`) sous le bandeau : chaque onglet a son adresse.
- **Pied de page** : la partie basse de celui de l'accueil (logo et devise, Aide · Conditions, copyright), fond `navy-900`, texte blanc ; sans la vague ni la phrase « Yibolo, plus qu’une plateforme… ».

### Espace professionnel (`ProLayout`)
- **Barre du haut** (56 px) : logo, pastille « Espace professionnel – IPES » (ou CFP, Autre), cloche, aide « ? », menu du compte.
- **Barre latérale bleu nuit** (250 px, fixe) : l'établissement (photo, nom, « Établissement vérifié »), les 6 menus (le menu actif en bleu plein), les **sous-menus** de Formations et de Contenus (pastille claire sur le sous-menu actif), bouton « Assistance YIBOLO » en bas. Sur téléphone, elle s'ouvre en tiroir avec ☰.
- **En-tête de page** (`ProHeader`) : fil d'Ariane, icône, titre, sous-titre, actions (ex. voir la page publique).

### Connexion et inscription (`AuthLayout`)
- **Connexion** (`AuthShell`) : mise en page de la connexion de yibolo-client, **aux couleurs de l'application** (bleu `brand-600`, titres `navy-900`, Plus Jakarta Sans, photo voilée de bleu nuit) : formulaire à gauche sur le fond des pages `page` (logo, « Retour à l'accueil », langue ; champs avec libellés), grande photo à droite (`/images/accueil/ecoles.jpg`) avec la phrase de la marque et les 4 atouts. Sur téléphone et tablette, le formulaire seul (décision du 2026-11-24).
- **Inscription** (`AuthCard`) : carte blanche centrée sur fond bleu très clair, logo et « Créer un compte », étapes numérotées.

---

## 6. Composants (les seuls à utiliser)

| Besoin | Composant | Où |
|---|---|---|
| Bouton (ou lien en forme de bouton avec `to`) | `Button` (`primary`, `navy`, `sun`, `success`, `violet`, `outline`, `neutral`, `soft`, `ghost`, `danger`, `danger-outline`, `white` ; tailles `xs`, `sm`, `md`, `lg`, `icon`) | `shared/components/ui/Button.tsx` |
| Badge, statut | `Badge` (tons `blue`, `navy`, `green`, `orange`, `amber`, `violet`, `red`, `gray`, `sky`, `pink`, `teal`, `white`, `solidGreen`, `solidSun`), `StatusBadge` | `shared/components/ui/Badge.tsx` |
| Établissement vérifié · type d'école | `VerifiedBadge`, `TypeBadge` | `features/schools/components/EcoleBlocks.tsx` |
| Auto-école agréée · permis | `AgreeeBadge`, `PermisPill` | `features/driving-schools/components/AutoEcoleBlocks.tsx` |
| Carte | `Card`, `CardHeader`, `Section`, `NumberedBlock` | `shared/components/ui/Card.tsx` |
| Bandeau de page publique | `Hero`, `HeroFeatures` | `shared/components/ui/Hero.tsx` |
| Fil d'Ariane | `Breadcrumb` | `shared/components/ui/Breadcrumb.tsx` |
| Onglets | `LinkTabs` (dans l'adresse), `Tabs` (état local), `FilterPills` | `shared/components/ui/Tabs.tsx` |
| Étapes | `Stepper`, `ArrowSteps` | `shared/components/ui/Stepper.tsx` |
| Étoiles, note | `Stars`, `Rating`, `StarInput` | `shared/components/ui/StarRating.tsx` |
| Note moyenne + répartition · un avis | `RatingSummary`, `ReviewItem`, `MoreButton` | `features/reviews/components/ReviewBlocks.tsx` |
| Favori | `FavoriteButton` (cœur) ; `FavoriteModal` (choix du dossier, auto-écoles) | `shared/components/ui/FavoriteButton.tsx`, `AutoEcoleBlocks.tsx` |
| Chiffres, blocs divers | `Kpi`, `KpiGrid`, `PageTitle`, `BackLink`, `AiCard`, `Tip`, `Checklist`, `InfoRow`, `FileRow`, `IconBtn`, `QuickAction`, `FormFooter`, `IconTile`, `EmptyNote` | `shared/components/ui/Blocks.tsx` |
| Graphiques | `AreaTrend`, `MultiLine`, `Bars`, `Donut` (recharts) | `shared/components/ui/Charts.tsx` |
| Progression | `Progress`, `Ring` | `shared/components/ui/Progress.tsx` |
| Recherche | `SearchField` (double libellé), `SearchPanel`, `InlineSearch` | `shared/components/ui/SearchField.tsx`, `features/schools/components/` |
| Listes de l'univers École | `EcoleCard`, `FormationRow`, `ResultsHeader`, `FilterPanel`, `CountList`, `MapBox`, `SidePanel`, `IconCountList`, `ArrowDot` | `features/schools/components/` |
| En-tête d'une auto-école | `AEHeader` | `features/driving-schools/components/AutoEcoleBlocks.tsx` |
| Espace pro | `ProHeader`, `ProCard`, `ProFooter`, `ProLabel` ; classes `proCard`, `proInput` | `features/pro/components/ProBlocks.tsx`, `features/pro/proStyles.ts` |
| Fenêtre | `Modal` | `shared/components/ui/Modal.tsx` |
| Pagination | `Pagination` | `shared/components/ui/Pagination.tsx` |
| Avatar · image | `Avatar` · `Img` | `shared/components/ui/` |
| Champs | `Label`, `Field`, `Input`, `Select`, `Textarea`, `RichText`, `Checkbox`, `Radio`, `Switch`, `Segmented`, `ChoiceCard`, `Dropzone`, `ChipsInput`, `PhoneInput` | `shared/components/forms/Fields.tsx` |
| Logo YIBOLO | `Logo`, `LogoMark` | `shared/components/ui/Logo.tsx` |
| Choix de la langue | `LanguageSwitcher` | `shared/components/ui/LanguageSwitcher.tsx` |
| Chargement · erreurs | `PageLoader` ; `ErrorBoundary`, `ErrorScreen`, `OfflineScreen` | `shared/components/` |
| Message éphémère | `toast` (sonner) | `Toaster` dans `app/App.tsx` |

Les morceaux des grandes pages sont dans des sous-dossiers : `features/schools/components/listing/` (onglets de l'annuaire par type), `profile/` (onglets de la fiche établissement), `training/` (détail d'une formation), `features/driving-schools/components/profile/` (onglets de la fiche auto-école). Ce découpage est récent (2026-11-21) : compléter ce tableau si un de ces morceaux devient réutilisable.

**Messages (toasts)** : en haut à droite, couleurs de leur sens (`richColors`), avec une croix pour fermer. Une action de démonstration non réalisée affiche un message qui finit par « (démo) ».

**Icônes** : lucide-react uniquement. Une icône décorative a `aria-hidden` ; un bouton qui n'a qu'une icône a un `aria-label`.

---

## 7. Images

- **Photos de la maquette** : `public/images/maquette/` (environ 120 fichiers : accueil, établissements, formations, régions, auto-écoles, véhicules, avatars, actualités…). Nom en minuscules avec tirets, préfixé par l'écran (`ae-…` auto-école, `aeav-…` avis d'auto-école, `region-…`, `actu-…`).
- Les **photos de personnes** de la maquette (avatars, témoignages, photo de la connexion) sont **gardées** : elles font partie de la maquette du client.
- Quelques images de démonstration viennent encore d'internet (`photo()` → picsum.photos, `portrait()` → randomuser.me) pour les comptes CFP et Autre et les utilisateurs de l'espace pro.
- **Logo YIBOLO** : celui de l'accueil (repris de yibolo-client) : carré bleu avec le « Y » en coche, « Yibolo », devise « Apprendre · Évoluer · Réussir » (décision du 2026-11-24). Fichiers : `src/assets/brand/` (voir son `README.md`). Dans l'interface, il est dessiné par `Logo` (`light` sur fond sombre). Favicon : `public/favicon.svg` ; icônes d'application : `public/icons/` ; manifeste : `public/site.webmanifest`.
- Chaque image a un `alt` qui la décrit ; une image décorative a `alt=""`.

---

## 8. Mouvement

- Peu d'animations : survols (ombre, léger déplacement des tuiles, flèche qui avance), ouverture des menus.
- À respecter : « réduire les animations » (`motion-reduce`) pour toute nouvelle animation.

---

## 9. Accessibilité

- Une étiquette pour chaque champ (visible, ou `aria-label` quand la maquette n'en montre pas). L'erreur est sous le champ.
- Focus visible : contour bleu `brand-500` (`:focus-visible` dans `globals.css`).
- `lang` de la page suit la langue choisie (`fr` / `en`).
- Le statut est écrit en toutes lettres, pas seulement par la couleur (« Publiée », « En attente », « Établissement vérifié »).
