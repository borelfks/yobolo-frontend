# Données et stockage

## Pas de serveur à nous (décision du 2026-11-16, précisée le 2026-11-23)
- Pas de backend écrit par nous, pas d'Orval, pas de react-query. **Ne jamais proposer de brancher yibolo-backend.**
- Pour que l'équipe teste, les données modifiables sont enregistrées dans une **base SQLite dans le navigateur** (sql.js). Chaque testeur a **sa propre base** ; on la partage par **export / import** d'un fichier `.sqlite`.
- Tout passe par **une seule couche de données** (`src/data/`), pensée pour **changer de stockage plus tard** (fichiers Netlify, Firebase, vrai backend) **sans toucher aux écrans**.

## La couche de données (`src/data/`)
| Fichier | Rôle |
|---|---|
| `collections.ts` | la liste des collections (`Collections`) et le type de leurs éléments |
| `source.ts` | le **contrat** `DataSource` (init, list, put, remove, reset, exportFile, importFile), asynchrone comme un appel réseau |
| `sources/sqliteSource.ts` | la source utilisée : SQLite (sql.js), une table par collection (`id`, `ordre`, `donnees` JSON, `cree_le`, `modifie_le`) + `meta`, gardée dans l'IndexedDB du navigateur. `VERSION_DONNEES` : à augmenter quand les données de départ changent (les bases des testeurs sont alors refaites) |
| `sources/memorySource.ts` | secours en mémoire (si SQLite ne peut pas s'ouvrir) |
| `index.ts` | **point d'entrée** : `startData()` (dans `main.tsx`), `useCollection`, `useCollectionWhenReady`, `data.create / update / put / remove / reset / exportFile / importFile`, `newId`. Choix de la source : `VITE_DATA_SOURCE` (`sqlite` par défaut, `memoire`) |
| `hooks.ts` | lectures par sujet : `useEtablissement(id)`, `useEtablissements`, `useFormation(id)`, `useFormations`, `useFormationsOf(id)`, `useAvisEtablissement(id)`, `useAutoEcole(id)`, `useAutoEcoles`, `useSessions`, `useAvisAutoEcole(id)`, `useFormationsPro(id)`, `useActualites(id)`, `useActualite(id)`, `useDocuments(id)`, `useFaq(id)`, `useUtilisateurs(id)`, `useParametres(id)`, `usePreinscriptionsRecues(id)` |

Les données de départ sont construites par `src/mocks/seed.ts` à partir de `src/mocks/` (au premier lancement et à chaque « Réinitialiser »).

## Les collections (données modifiables)
`etablissements`, `formations`, `formationsPro`, `autoEcoles`, `sessions`, `avisEtablissements`, `avisAutoEcoles`, `actualites`, `documents`, `faq`, `utilisateurs`, `preinscriptions`, `inscriptionsAutoEcole`, `favoris`, `parametres`. Types dans `src/shared/types.ts`.

- Les listes de la maquette qui ne sont rattachées à aucun établissement précis (avis de l'IPC, actualités, documents, FAQ, utilisateurs, tableau des formations pro) portent `etablissementId: '*'` (`POUR_TOUS`) : elles s'affichent pour **tous** les établissements, comme avant. Ce qu'un testeur crée porte le **vrai** identifiant.
- Un élément ajouté s'affiche **avant** ceux de départ.

## Règles pour les écrans
1. **Lire** une donnée modifiable : un hook de `@/data/hooks` (ou `useCollection` de `@/data`), **jamais** `etablissementById`, `formations`, `avisIpc`… de `src/mocks/`. Pas de hook dans une boucle ni une condition : lire la liste une fois, puis `find` / `filter`.
2. **Écrire** : `await data.create(...)`, `data.update(...)`, `data.remove(...)`, puis le `toast` et la navigation habituels. L'écran se met à jour seul.
3. Les **données de référence** (non modifiables dans la démo) restent lues directement dans `src/mocks/` : `typeConfig`, `typesEcole`, régions, villes, quartiers, domaines, filières, diplômes, `permisCatalogue`, critères d'avis, catégories de galerie, rôles, notifications, statistiques, répartitions de notes, albums, programme, comptes de démo.
4. Une page qui lit la base attend qu'elle soit prête (Suspense → `PageLoader`) : rien à faire de plus. Un cadre ou un fournisseur qui ne doit pas attendre utilise `useCollectionWhenReady`.
5. `shared/` peut importer `@/data` mais jamais `mocks/` ; `src/data/` n'importe jamais `mocks/` (les données de départ lui sont passées par `startData(buildSeed)`).
6. **La landing n'utilise pas la base et ne doit pas être modifiée.**

## Changer de stockage plus tard
1. Écrire `src/data/sources/<nouvelleSource>.ts` qui respecte `DataSource` (par exemple des appels `fetch` vers une API, ou Firebase).
2. L'ajouter à `SOURCES` dans `src/data/index.ts`.
3. Choisir `VITE_DATA_SOURCE=<nom>` (`.env.local` et Netlify).
Aucun écran ne change.

## Panneau « Données de test »
Dans le menu du compte : **Exporter** (télécharge `yibolo-donnees-AAAA-MM-JJ.sqlite`, lisible avec DB Browser for SQLite), **Importer** (remplace la base par un fichier exporté), **Réinitialiser** (revient aux données de départ, après confirmation).

## Ce qui reste dans le stockage local (`localStorage`)
| Clé | Contenu |
|---|---|
| `yibolo:role` | compte de démonstration choisi (ou visiteur) |
| `yibolo:inscription-v2:<auto-école>:<permis>` | brouillon d'inscription en auto-école (avant l'envoi) |
| `yibolo:langue` | langue choisie |

La base SQLite est dans l'IndexedDB du navigateur (base `yibolo`, clé `base-sqlite`). Vider les données du navigateur ou la navigation privée la font perdre : exporter pour garder une copie.

## Données de la maquette
1. Les valeurs de départ viennent de la maquette (noms, chiffres, dates, textes). Les chiffres d'annuaire (532 IPES, 1 248 établissements…) sont **recopiés**, pas calculés.
2. Les données restent **en français** : on ne modifie pas `src/mocks/` pour traduire (voir [traduction.md](traduction.md)).
