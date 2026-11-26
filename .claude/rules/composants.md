# Quel composant utiliser

**Toujours** utiliser ces composants. Il ne faut ni en recréer un à la main, ni en ajouter une variante sans accord. S'il en manque un, on le propose d'abord.

| Besoin | Utiliser | Ne pas faire |
|---|---|---|
| Bouton, ou lien en forme de bouton | `Button` (variantes `primary`, `navy`, `sun`, `success`, `violet`, `outline`, `neutral`, `soft`, `ghost`, `danger`, `danger-outline`, `white` ; tailles `xs`, `sm`, `md`, `lg`, `icon` ; `to` pour un lien) | nouveau `<button>` stylé à la main |
| Badge, statut | `Badge` (tons `blue`, `navy`, `green`, `orange`, `amber`, `violet`, `red`, `gray`, `sky`, `pink`, `teal`, `white`, `solidGreen`, `solidSun`), `StatusBadge` | pastille faite à la main |
| Établissement vérifié · type d'école | `VerifiedBadge`, `TypeBadge` (`features/schools/components/EcoleBlocks.tsx`) | |
| Auto-école agréée · permis | `AgreeeBadge`, `PermisPill` (`features/driving-schools/components/AutoEcoleBlocks.tsx`) | |
| Carte | `Card`, `CardHeader`, `Section`, `NumberedBlock` ; espace pro : `ProCard` | `<div>` encadré recopié |
| Bandeau public | `Hero`, `HeroFeatures` | |
| Fil d'Ariane | `Breadcrumb` ; `ProHeader` (pro) ; `AEHeader` (auto-école) | |
| Onglets | `LinkTabs` (dans l'adresse), `Tabs` (état local), `FilterPills` | onglets faits à la main |
| Étapes | `Stepper`, `ArrowSteps` | |
| Note | `Stars`, `Rating` (« ★ 4,7 (3 avis) »), `PasEncoreDAvis` (sans avis), `StarInput` (saisie) | étoiles recopiées, « 0/5 » |
| Note moyenne + répartition · un avis | `RatingSummary`, `ReviewItem`, `MoreButton` (`features/reviews/components/ReviewBlocks.tsx`) | |
| Favori | `FavoriteButton` ; `FavoriteModal` (choix du dossier) | cœur fait à la main |
| Chiffres et petits blocs | `Kpi`, `KpiGrid`, `PageTitle`, `BackLink`, `AiCard`, `Tip`, `Checklist`, `InfoRow`, `FileRow`, `IconBtn`, `QuickAction`, `FormFooter`, `IconTile`, `EmptyNote` (`shared/components/ui/Blocks.tsx`) | |
| Graphiques | `AreaTrend`, `MultiLine`, `Bars`, `Donut` (`Charts.tsx`) | recharts appelé directement dans une page |
| Progression | `Progress`, `Ring` | |
| Recherche | `SearchField`, `SearchPanel`, `InlineSearch` | `<input type="search">` à la main |
| Listes École | `EcoleCard`, `FormationRow`, `ResultsHeader`, `FilterPanel`, `CountList`, `MapBox`, `SidePanel`, `IconCountList`, `ArrowDot` | carte d'établissement recopiée |
| Dossier (préinscription, inscription) | `BadgeDossier` (statut), `FilDossier` (suivi), `ChampsDossier`, `PiecesDossier` (`shared/components/ui/`) ; espace pro : `ListeDossiers`, `DecisionDossier`, `ContactCandidat`, `DossierEnTete` (`features/pro/components/`) | statut ou liste refaits à la main |
| Fenêtre | `Modal` | `window.confirm`, `alert()` |
| Pagination | `Pagination` | |
| Personne · image | `Avatar` · `Img` | `<img>` sans `alt` |
| Lieu (région → département → arrondissement → quartier) | `SelectionGeographique` (`shared/components/forms/`) | région / ville / quartier en listes séparées |
| Mot de passe (œil afficher / masquer) · solidité | `ChampMotDePasse`, `JaugeMotDePasse` (`shared/components/forms/MotDePasse.tsx`) | `<Input type="password">` sans bascule |
| Code reçu par SMS (OTP) | `VerificationCode` (`features/auth/components/`) | champ de code fait à la main |
| Champs | `Label`, `Field`, `Input`, `Select`, `Textarea`, `RichText`, `Checkbox`, `Radio`, `Switch`, `Segmented`, `ChoiceCard`, `Dropzone`, `ChipsInput`, `PhoneInput` (`shared/components/forms/Fields.tsx`) ; pro : `ProLabel`, `proInput` | `<input>` brut |
| Logo | `Logo`, `LogoMark` | image du logo copiée |
| Langue | `LanguageSwitcher` | |
| Chargement · erreur | `PageLoader` ; `ErrorBoundary`, `ErrorScreen`, `OfflineScreen` | page blanche |
| Message éphémère | `toast` (sonner) | `alert()` |

Les composants de `shared/components/ui/` sont la base, ceux de `shared/components/forms/` les champs. Ceux qui portent le métier d'un sujet sont dans `features/<sujet>/components/`. Les morceaux des grandes pages sont dans des sous-dossiers : `features/schools/components/listing/` (onglets de l'annuaire par type), `profile/` (onglets de la fiche établissement), `training/` (détail d'une formation), `features/driving-schools/components/profile/` (onglets de la fiche auto-école).

## Quand créer un composant
1. **Dès qu'un même élément apparaît une 2ᵉ fois**, même dans un autre univers : on en fait un composant, et on remplace aussi la 1ʳᵉ copie (vérifier que le rendu ne change pas).
2. Quand un morceau de page dépasse environ **80 lignes** ou porte un **sens métier** (une carte de formation, un bloc de note…).
3. Quand une page dépasse environ **500 lignes** : on la découpe dans un sous-dossier de `components/` de sa fonctionnalité (comme `components/profile/`).

## Avant de créer
- Vérifier dans le tableau ci-dessus qu'il n'existe pas déjà.
- Sinon, **ajouter une option** au composant existant (taille, variante, contenu) plutôt que d'en faire un deuxième.
- **Proposer d'abord** le nom, l'emplacement et les écrans concernés, puis attendre l'accord (voir [collaboration.md](collaboration.md)).

## Où le ranger
| Dossier | Pour |
|---|---|
| `shared/components/ui/` | brique générique, utilisée par plusieurs fonctionnalités |
| `shared/components/forms/` | champ de formulaire |
| `shared/components/errors/` | écran ou garde d'erreur |
| `features/<sujet>/components/` | élément métier d'un sujet |
| `features/<sujet>/components/<sous-dossier>/` | morceaux d'une grande page de ce sujet |
| `app/layouts/` | morceau d'un cadre (barre, menu du compte) |

## Après
- L'ajouter au tableau de ce fichier et à [DESIGN.md](../../docs/DESIGN.md) (§ 6).
- **Un fichier de composant n'exporte que des composants** : constantes et fonctions dans un `.ts`, hooks dans `hooks/` (voir [code-et-architecture.md](code-et-architecture.md)).
- Ses textes passent par la traduction (voir [traduction.md](traduction.md)).
