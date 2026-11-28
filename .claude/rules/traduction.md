# Traduction (français / anglais)

**Règle : toute chaîne de texte visible par l'utilisateur passe par `t()` (`react-i18next`), jamais écrite en dur dans le JSX ou dans un schéma zod.** Même organisation et même comportement que **yibolo-client**.

Ça inclut les libellés, titres, `placeholder`, messages d'erreur, messages `toast`, aides, `aria-label`, `title`, `alt` (sauf photos décoratives `alt=""`). Ça exclut les **données de démonstration** (`src/data/fausses-donnees/`) (elles jouent le rôle du serveur) et tout texte qui sert aussi de valeur technique (identifiant stocké, valeur de filtre).

## Comportement
- **Français par défaut** et langue de référence ; anglais britannique (comme au Cameroun).
- Pas de détection de la langue du navigateur : à la première visite, c'est le français.
- Le choix est gardé dans le navigateur sous la clé **`yibolo:langue`** ; l'attribut `lang` de la page suit la langue.
- Sélecteur : `LanguageSwitcher` (`src/shared/ui/LanguageSwitcher.tsx`) : un globe et le code de la langue active (« FR »), qui ouvre un menu Français / English avec une coche. Il est dans l'en-tête public, la barre du haut de l'espace pro et les écrans de connexion ; Paramètres › Préférences propose aussi le choix.

## Où sont les textes : à côté de leur domaine, jamais centralisés
| Namespace | Fichiers de textes | Code concerné |
|---|---|---|
| `common` | `src/shared/locales/{fr,en}.json` | `src/shared/**` |
| `layout` | `src/app/layouts/locales/{fr,en}.json` | `src/app/**` (cadres, menus, 404) |
| `landing` | `src/modules/landing/locales/` | accueil, « bientôt disponible » |
| `auth` | `src/modules/compte/auth/locales/` | connexion, inscription |
| `schools` | `src/modules/ecole/etablissements/locales/` | annuaires, fiche établissement, formation, préinscription |
| `driving-schools` | `src/modules/ecole/auto-ecoles/locales/` | auto-écoles, permis ; l'inscription est sous la clé `enrollment` |
| `reviews` | `src/modules/ecole/avis/locales/` | donner un avis |
| `favorites` | `src/modules/compte/favoris/locales/` | mes favoris |
| `espace` | `src/modules/compte/mon-espace/locales/` | Mon espace (personne physique) |
| `pages` | `src/modules/pages/locales/` | Aide et contact, Conditions générales |
| `pro` | `src/modules/ecole/espace-pro/locales/` | espace pro ; contenus, publication, paramètres, invitation sous la clé `content` |

- Initialisation : `src/i18n/index.ts` (`CLE_STOCKAGE_LANGUE`, `Langue`, `LANGUES`, `langueActive()`, `currentLocale()`).
- Typage : `src/i18n/i18next.d.ts`, à partir des fichiers **français** : une clé absente du français est une erreur TypeScript.
- Une nouvelle partie de module = un dossier `locales/` avec `fr.json` et `en.json`, déclaré dans les deux fichiers de `src/i18n/`.

## Écrire une clé
1. Avant d'écrire une chaîne visible, vérifier si une clé existe déjà dans le namespace concerné.
2. Sinon, l'ajouter **aux deux fichiers** (`fr.json` et `en.json`) dans le même changement : un oubli côté anglais compile quand même et retombe silencieusement sur le français.
3. Consommer via `useTranslation('<namespace>')` puis `t('cle.imbriquee')`. Pour une partie rangée sous une clé (`enrollment`, `content`) : `useTranslation('driving-schools', { keyPrefix: 'enrollment' })`.
4. **Nommage** : camelCase, imbriqué par section logique de l'écran (`ecoleProfil.tabs.apercu`, pas une clé plate).
5. **Le français ne change pas** : le texte français du JSON est la copie exacte du texte de la maquette (accents, apostrophe ’, guillemets « », espaces).
6. Variables : `{{name}}`. Pluriels : suffixes `_one` / `_other` avec `count`.
7. Texte avec balisage (`<b>`, lien) : `<Trans t={t} i18nKey="…" components={{ b: <b /> }} />`, jamais de HTML dans le JSON.
8. `t` s'appelle pendant l'affichage : une liste définie hors du composant garde des **clés** ou des identifiants, résolus dans le composant.
9. Clés dynamiques construites à partir d'un type littéral (`'A' | 'B'`), pas d'une `string` quelconque.
10. Valeurs fixes des données affichées comme libellés (mode « Jour/Soir », statut « Publiée », nom d'un permis, rôle…) : traduites à l'affichage par une clé construite à partir de la valeur ; on ne modifie pas les fausses données (`src/data/fausses-donnees/`) pour traduire.
11. Nombres et dates : `num()`, `fcfa()`, `shortDate()` de `src/shared/utils/format.ts`, jamais `toLocaleString('fr-FR')`.
12. Les adresses ne se traduisent pas et viennent de `ROUTES`.
13. Vérifier : `npm run i18n:check` (mêmes clés en fr et en dans chaque `locales/`), `npx tsc -b`, `npm run lint`, puis l'écran dans les deux langues.

## Glossaire anglais
| Français | Anglais |
|---|---|
| École / Écoles | School / Schools |
| Établissement · Établissement vérifié | Institution · Verified institution |
| IPES (Instituts Privés d’Enseignement Supérieur) | IPES (Private Higher Education Institutes) |
| CFP (Centres de Formation Professionnelle) | CFP (Vocational Training Centres) |
| Autres | Others |
| Formation · Filière · Diplôme | Programme · Field of study · Diploma |
| Frais (auto-écoles) · mois | Fees · months |
| Cours du jour / du soir | Day classes / Evening classes |
| Rentrée · Débouchés · Conditions d’admission | Intake · Career prospects · Admission requirements |
| Préinscription / Préinscrire | Pre-registration / Pre-register |
| Auto-école · Permis · Inscription (auto-école) | Driving school · Licence · Enrolment |
| Pièces à fournir · Agréée | Required documents · Approved |
| Avis · Favoris | Reviews · Favourites |
| Aperçu · Galerie · Tarifs · Planning | Overview · Gallery · Prices · Schedule |
| Région · Ville · Quartier | Region · City · Neighbourhood |
| Espace professionnel · Tableau de bord · Paramètres | Professional space · Dashboard · Settings |
| Se connecter · Créer un compte | Sign in · Create an account |
| FCFA, YIBOLO, sigles d'écoles | inchangés |

L'anglais garde une longueur proche du français pour ne pas casser la mise en page.
