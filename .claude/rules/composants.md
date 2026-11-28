# Composants : toujours, à 4 niveaux

| Niveau | Où | Rôle |
|---|---|---|
| **1. Briques** | `src/shared/shadcn/` | composants shadcn/ui (Radix) habillés comme le canevas. Aucune logique métier. |
| **2. Blocs** | `src/shared/blocs/` | assemblent des briques ; génériques (chargement, états, en-tête de page, tableau de données…). |
| **3. Métier** | `src/modules/<univers>/<partie>/components/` | connaissent les données d'une partie (carte d'établissement, ligne de signalement…). |
| **4. Pages** | `src/modules/<univers>/<partie>/pages/` | lisent les données et **assemblent** ; pas de mise en forme propre. |

## Briques (`src/shared/shadcn/`)
| Besoin | Composant |
|---|---|
| Bouton, lien en forme de bouton | `Button` (`default`, `secondary`, `outline`, `destructive`, `destructive-solid`, `ghost`, `link`, `link-muted` ; tailles `sm` 32, `md` 36, `default` 40, `lg` 44, `icon`, `icon-sm` ; `loading` ; `asChild` pour un lien) |
| Statut | `Badge` (`blue`, `green`, `gray`, `amber`, `red`, `violet`, `solid`, `solid-green`, `outline`) |
| Puces de filtre ou de choix | `ToggleGroup` + `ToggleGroupItem` (`variant="outline"`) |
| Champs | `Label`, `Input`, `Textarea`, `Select…` (`SelectTrigger size="lg"` : 48 px), `Checkbox`, `RadioGroup…`, `Switch` ; liste avec recherche : `Command` (+ `Popover`) |
| Choix en carte · choix court en case | `RadioGroupCard` (profil, type d'établissement) · `RadioGroupOption` (civilité) dans un `RadioGroup` |
| Onglets | `Tabs…` (état local) ; onglets dans l'adresse : classes `tabTriggerClasses` sur des liens |
| Fil d'Ariane · pagination | `Breadcrumb…` · `Pagination…` |
| Menus · fenêtres · tiroir | `DropdownMenu…` · `Dialog…`, `AlertDialog…` (confirmation) · `Sheet…` |
| Infobulle · bulle | `Tooltip…` · `Popover…` |
| Carte · tableau · séparateur | `Card…` · `Table…` · `Separator` |
| Avatar · progression · squelette | `Avatar…` · `Progress` · `Skeleton` |
| Graphiques | `ChartContainer`, `ChartTooltip`… (recharts) avec `ChartConfig` ; couleurs `var(--color-chart-1…5)` |
| Accordéon · défilement | `Accordion…` · `ScrollArea` |
| Messages éphémères | `toast` de **sonner** (`toast.success/error/warning/info/promise`) ; le `Toaster` est déjà posé |

## Blocs (`src/shared/blocs/`)
| Besoin | Composant |
|---|---|
| Indicateur de chargement | `Spinner` (sm, md, lg), `PageSpinner`, `SpinnerOverlay` (voile sur un bloc) |
| Squelettes | `SkeletonZone` (annonce le chargement), `SkeletonText`, `SkeletonPageHeader`, `SkeletonStats`, `SkeletonCard`, `SkeletonList`, `SkeletonTable` |
| Attendre des données et attraper leurs erreurs | `ChargementDonnees` (fallback = squelette) |
| Liste vide · bloc en erreur | `EmptyState` · `ErrorState` (« Réessayer ») |
| Page message (404, erreur, hors connexion, accès refusé) | `MessagePage` |
| Bandeau hors connexion | `BandeauHorsLigne` (déjà posé) |
| Logo | `MarqueYibolo` (symbole + « YIBOLO » ; `clair` + `devise` sur le pied de page), `SymboleYibolo` (`Marque.tsx`) |
| Langue | `ChoixLangue` (`auth` : écrans de connexion ; `compact` : globe seul) |
| Champ de formulaire | `Champ` (libellé, astérisque, « (facultatif) », aide ou erreur), `ChampTexte` (48 px), `ChampTelephone` (+237), `ChampMotDePasse` (Afficher / Masquer), `JaugeMotDePasse`, `CaseACocher`, `ListeDeroulante` (`Formulaire.tsx`) |
| Message dans un formulaire · étapes · pièce à joindre | `Encadre` (`info`, `succes`, `erreur`) · `BarreEtapes` · `PieceAJoindre` (`Formulaire.tsx`) |

## Champs métier partagés (`src/shared/forms/`, propres à ce dépôt)
| Besoin | Composant |
|---|---|
| Lieu (région → département → arrondissement → quartier), canevas | `ChampsLieu` (`ChampsLieu.tsx`) ; l'ancien `SelectionGeographique` sert encore aux écrans pas refaits |
| Accords de création et d'ouverture | `ListeAccords`, `ChampsAccord` (`Accords.tsx`) |

## Cadres (`src/app/layouts/`)
| Besoin | Composant |
|---|---|
| Barre du haut (ordinateur, téléphone + onglets des univers) | `Entete` (recherche : `RechercheEntete`, `RechercheEnteteMobile`) |
| Cloche · menu du compte | `ClocheNotifications`, `MenuCompte` (`AccountMenu.tsx`) |
| Pied de page | `PiedDePage` |
| Menu de l'espace pro (carte à gauche, tiroir sur téléphone) | `MenuPro` |
| Connexion · inscription et mot de passe oublié | `AuthShell` · `CadreAuth` + `CarteAuth` ; dans `modules/compte/auth/components/` : `TitreAuth`, `ChoixProfil`, `ChoixTypeEtablissement`, `NavigationEtapes`, `VerificationCode` |
| Aide et contact | `BandeauAide`, `ThemesAide`, `QuestionsAide`, `ContactAide`, `CartePage` (`modules/pages/components/Aide.tsx`) |

Anciens composants (`src/shared/ui/`, `src/shared/forms/`) : servent encore aux écrans pas refaits ; on ne s'en sert plus pour un écran neuf ; on les supprime quand plus rien ne les importe.

## Créer un composant
1. Chercher dans ce fichier et sur /design-system.
2. Une variante plutôt qu'une copie. **Dès qu'un élément revient une 2ᵉ fois**, il devient un composant (et la 1ʳᵉ copie est remplacée).
3. Petit, typé, une phrase de documentation, textes traduits, états prévus.
4. Brique ou bloc : l'ajouter au tableau ci-dessus **et** à /design-system ; le recopier à l'identique dans yibolo-admin.
5. Un fichier de composant n'exporte que des composants (variantes `cva` dans `shadcn/variants.ts`, hooks dans `hooks/`).
6. Nouveau composant shadcn : `npx shadcn add <nom>` écrit dans un dossier `@/` à la racine : déplacer le fichier dans `src/shared/shadcn/`, remplacer `from "cn"` par `@/shared/utils/cn`, retirer `next-themes` / `dark:` / le paquet `cn` ajouté, l'habiller comme le canevas.
