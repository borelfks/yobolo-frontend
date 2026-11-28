# Données et API

## Fausses données aujourd'hui, yibolo-backend plus tard (décision du 2026-11-27)
- **SQLite est retiré.** Les écrans lisent de **fausses données** : `src/data/fausses-donnees/`, un fichier JSON par table (une liste d'éléments dans l'ordre d'affichage). **Aucune donnée écrite dans le code** (décision du 2026-11-24 : « rien en dur »).
- Ce que fait un testeur est gardé **dans son navigateur** (IndexedDB, base `yibolo`, clé `fausses-donnees`) ; si le navigateur refuse (navigation privée stricte), tout marche en mémoire le temps de la visite.
- Les lectures passent par **TanStack Query** (`queryClient` de `src/data/index.ts`, une requête par table, clé `['donnees', table]`).
- **Plus tard, l'API de yibolo-backend** : quand il publiera sa description OpenAPI (springdoc), `npm run api:generate` (Orval, `orval.config.ts`) fabriquera les hooks TanStack Query dans `src/api/generated/`, avec le client axios `src/api/client.ts` (`VITE_API_URL`). On ne la branche que sur demande du porteur du projet.
- Tout passe par **une seule couche de données** (`src/data/`) : changer de source ne touche pas aux écrans.

## La couche de données (`src/data/`)
| Fichier | Rôle |
|---|---|
| `fausses-donnees/<table>.json` | **les données de départ** : une liste d'éléments par table, dans l'ordre d'affichage. La copie de chaque testeur en est faite au premier lancement. C'est là qu'on modifie une donnée de départ |
| `collections.ts` | la liste des tables (`Collections`, `COLLECTIONS`) et le type de leurs éléments |
| `source.ts` | le **contrat** `DataSource` (init, list, put, remove, reset), asynchrone comme un appel réseau |
| `sources/fauxSource.ts` | la source utilisée : les fausses données, copiées dans l'IndexedDB du navigateur (`sources/indexedDb.ts`). `VERSION_DONNEES` : à augmenter quand les fichiers JSON changent (les copies des testeurs sont alors refaites) |
| `index.ts` | **point d'entrée** : `startData()` (dans `main.tsx`), `useCollection`, `useCollectionWhenReady`, `useDataReady`, `data.create / update / put / remove / reset`, `newId`, `queryClient`. Choix de la source : `VITE_DATA_SOURCE` (`faux`) |
| `hooks.ts` | **les lectures**, par sujet : établissements, formations, avis, auto-écoles, sessions, espace pro, comptes, et toutes les données de référence (`useTypeEcole`, `useRegions`, `useVilles`, `useQuartiers`, `useDomaines`, `useDiplomes`, `usePermisCatalogue`, `useIndicateurs`…) |

## Les tables
- **Modifiables par les testeurs** : `etablissements`, `formations`, `formationsPro`, `autoEcoles`, `sessions`, `avisEtablissements`, `avisAutoEcoles`, `actualites`, `documents`, `faq`, `utilisateurs`, `preinscriptions`, `inscriptionsAutoEcole`, `favoris`, `parametres`, `comptes`, et pour l'accueil connecté `publications` (publiées ou brouillons), `enregistrements` (« Mes enregistrés » d'un compte), `jaimes`, `signalements`, `commentaires` ; et `fichiers` (fichiers joints, data URL), `piecesEtablissement` (certificat du NIU), `nomenclatureFormations` (secteur › domaine › filière › spécialité › option, pour le nom des formations), `accordsEtablissement` (accords de création et d'ouverture, `nature`, plusieurs par établissement, chacun avec son document), `medias`, `notifications` / `notificationsCompte` (lu / non lu), `demandesAssistance`, `signalementsAvis`, `sessionsActives`, `activiteSecurite`.
- **De référence** (lues par les écrans, modifiables dans `fausses-donnees/`) : `typesEcole`, `tuilesAnnuaire`, `domaines`, `diplomes`, `regions`, `villes`, `quartiers`, `albums`, `programme`, `permis`, `criteresAvis`, `roles`, `notifications`, `visites`, `sourcesVisites`, `sessionsActives`, `activiteSecurite`, `indicateurs`, `formationsPopulaires`, `photosAutoEcole`, `videos` ; pour l'accueil connecté : `domainesExpertise`, `experts`, `bandeauxAccueil`, `sujetsPublication`.
- Types dans `src/shared/types.ts`.
- Les enregistrements de la maquette qui ne sont rattachés à aucun établissement précis portent `etablissementId: '*'` (`POUR_TOUS`) : ils s'affichent pour **tous** les établissements. Ce qu'un testeur crée porte le **vrai** identifiant.
- Un élément ajouté s'affiche **avant** ceux de départ.
- **Comptes** (`comptes`) : e-mail, téléphone, rôle, établissement géré, statut (`Validé` : actif dès l'inscription, pas de validation par YIBOLO), mot de passe **haché** (`sha256(sel + ':' + mot de passe)`, `src/shared/utils/motDePasse.ts`). Voir [comptes-et-acces.md](comptes-et-acces.md).

## Règles pour les écrans
1. **Toute donnée** affichée vient d'un hook de `@/data/hooks` (ou de `useCollection` de `@/data`). **Jamais de tableau de données, de chiffre ou d'image de contenu écrit dans un composant.** Ce qui reste dans le code, c'est la **configuration** : correspondance adresses ↔ types d'école (`modules/ecole/etablissements/schoolTypes.ts`), icônes et couleurs, images décoratives des bandeaux, valeurs par défaut d'un nouvel élément.
2. Pas de hook dans une boucle ni une condition (ni après un `return` anticipé) : lire la liste une fois, puis `find` / `filter`.
3. **Écrire** : `await data.create(...)`, `data.update(...)`, `data.remove(...)`, puis le `toast` et la navigation habituels. L'écran se met à jour seul.
4. Une page qui lit la base attend qu'elle soit prête (Suspense → `PageLoader`). Un cadre ou un fournisseur qui ne doit pas attendre utilise `useCollectionWhenReady` / `useDataReady`.
5. `shared/` peut importer `@/data`. `src/data/` n'importe ni `modules/` ni `app/`.
6. **La landing n'utilise pas la base et ne doit pas être modifiée.**

## Chiffres : calculés à partir de la base (décision du 2026-11-25 : « je veux les vraies données »)
- **Aucun chiffre de l'univers École n'est recopié de la maquette.** Tout est calculé dans `src/data/hooks.ts` à partir des lignes : note et nombre d'avis d'un établissement ou d'une auto-école (moyenne de ses avis), répartition des étoiles et notes par critère, nombre de formations publiées, nombre d'établissements par type (annuaire, onglets), par région et par ville (`useEtablissementsParLieu`), domaines et diplômes (formations publiées qui y mènent), nombre de photos.
- Les hooks rendent les objets avec leurs chiffres (`useEtablissements`, `useAutoEcoles`, `useTypesEcole`, `useTuilesAnnuaire`, `useDomaines`, `useDiplomes`, `useRepartitionEtablissement`, `useRepartitionAutoEcole`) : un écran n'écrit jamais un chiffre dans la base, il écrit la ligne (un avis, une formation) et le chiffre suit seul.
- Sans avis : « Pas encore d'avis » (`PasEncoreDAvis`), jamais « 0/5 ». Un domaine, un diplôme, une région ou une ville sans établissement ni formation ne s'affiche pas.
- Un chiffre que la base ne connaît pas ne s'affiche pas (ex. nombre de candidats « formés » d'une auto-école, masqué).
- **Espace pro** : vues des fiches et des formations, provenance et téléchargements sont **mesurés** (table `evenements`, `mesurer` / `useMesureALaVue`, `src/shared/utils/mesures.ts`) ; `useStatistiques` calcule tout sur la période. Une vue faite par l'établissement lui-même ne compte pas. Plus de `compteurs.ts`.
- Aucun contenu « pour tous » (`etablissementId: '*'`) dans la base de départ : chaque fiche ne montre que ce qui lui appartient.

## Changer une donnée de départ
1. Modifier `src/data/fausses-donnees/<table>.json` (une ligne = un élément).
2. Augmenter `VERSION_DONNEES` dans `sources/fauxSource.ts` : les copies des testeurs seront refaites à leur prochaine visite.

## Brancher l'API plus tard
1. yibolo-backend publie sa description OpenAPI ; `npm run api:generate` (Orval) écrit les hooks dans `src/api/generated/`.
2. Soit une source `src/data/sources/<api>.ts` qui respecte `DataSource` (ajoutée à `SOURCES`, choisie par `VITE_DATA_SOURCE`), soit les hooks générés appelés depuis `src/data/hooks.ts`. Les écrans ne changent pas.

## Plus de panneau « Données de test »
Le panneau est retiré de l'interface (décision du 2026-11-25). L'export et l'import d'un fichier `.sqlite` n'existent plus (SQLite retiré le 2026-11-27) ; `data.reset` reste.

## Ce qui reste dans le stockage local (`localStorage`)
| Clé | Contenu |
|---|---|
| `yibolo:compte` | identifiant du compte connecté avec « Se souvenir de moi » (sinon dans le stockage de la visite, `sessionStorage`) |
| `yibolo:avis-utiles` | avis marqués « Utile » par ce navigateur (le nombre est dans la base) |
| `yibolo:inscription-v2:<auto-école>:<permis>` | brouillon d'inscription en auto-école (avant l'envoi) |
| `yibolo:langue` | langue choisie |

La copie des fausses données est dans l'IndexedDB du navigateur (base `yibolo`, clé `fausses-donnees`). Vider les données du navigateur la remet à zéro.

## Données de la maquette
1. Les valeurs de départ (`fausses-donnees/`) sont celles de la maquette (noms, dates, textes, photos) ; elles ne contiennent **aucun chiffre calculable** (notes, nombres d'avis, de formations, d'établissements) : ces chiffres sont calculés.
2. Les données restent **en français** : on ne modifie pas les données pour traduire (voir [traduction.md](traduction.md)).

## Découpage territorial
- Tables de référence `departements` (`id`, `region`, `nom`, `chefLieu`) et `arrondissements` (`id`, `departement`, `nom`, `ville`), reprises du fichier `decoupage-cameroun.csv` de yibolo-backend (58 départements, 360 arrondissements). Lecture : `useDecoupage()` ; tri et ville : `src/shared/utils/geographie.ts`.
- Un lieu saisi garde `region`, `departement`, `arrondissement`, `quartier` et la `ville` déduite (pour l'affichage et les recherches existantes).
