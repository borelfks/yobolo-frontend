# Données et stockage

## Pas de serveur à nous (décisions du 2026-11-16, 2026-11-23 et 2026-11-24)
- Pas de backend écrit par nous, pas d'Orval, pas de react-query. **Ne jamais proposer de brancher yibolo-backend.**
- **Toutes les données sont dans la base** : une **base SQLite dans le navigateur** (sql.js). Il n'y a plus de `src/mocks/` et **aucune donnée écrite dans le code** (décision du 2026-11-24 : « rien en dur, tout en base »).
- Chaque testeur a **sa propre base** ; on la partage par **export / import** d'un fichier `.sqlite`.
- Tout passe par **une seule couche de données** (`src/data/`), pensée pour **changer de stockage plus tard** (fichiers Netlify, Firebase, vrai backend) **sans toucher aux écrans**.

## La couche de données (`src/data/`)
| Fichier | Rôle |
|---|---|
| `depart/yibolo.sql` | **les données de départ** : un `CREATE TABLE` et des `INSERT` par table. La base de chaque testeur en est créée au premier lancement et à chaque « Réinitialiser ». C'est ce fichier qu'on modifie pour changer une donnée de départ |
| `collections.ts` | la liste des tables (`Collections`, `COLLECTIONS`) et le type de leurs éléments |
| `source.ts` | le **contrat** `DataSource` (init, list, put, remove, reset, exportFile, importFile), asynchrone comme un appel réseau |
| `sources/sqliteSource.ts` | la source utilisée : SQLite (sql.js), une table par collection (`id`, `ordre`, `donnees` JSON, `cree_le`, `modifie_le`) + `meta`, gardée dans l'IndexedDB du navigateur. Si le navigateur refuse d'enregistrer (navigation privée stricte), la base marche en mémoire le temps de la visite. `VERSION_DONNEES` : à augmenter quand `yibolo.sql` change (les bases des testeurs sont alors refaites) |
| `index.ts` | **point d'entrée** : `startData()` (dans `main.tsx`), `useCollection`, `useCollectionWhenReady`, `useDataReady`, `data.create / update / put / remove / reset / exportFile / importFile`, `newId`. Choix de la source : `VITE_DATA_SOURCE` (`sqlite`) |
| `hooks.ts` | **les lectures**, par sujet : établissements, formations, avis, auto-écoles, sessions, espace pro, comptes, et toutes les données de référence (`useTypeEcole`, `useRegions`, `useVilles`, `useQuartiers`, `useDomaines`, `useDiplomes`, `usePermisCatalogue`, `useIndicateurs`…) |

## Les tables
- **Modifiables par les testeurs** : `etablissements`, `formations`, `formationsPro`, `autoEcoles`, `sessions`, `avisEtablissements`, `avisAutoEcoles`, `actualites`, `documents`, `faq`, `utilisateurs`, `preinscriptions`, `inscriptionsAutoEcole`, `favoris`, `parametres`, `comptes`, et pour l'accueil connecté `publications` (publiées ou brouillons), `enregistrements` (« Mes enregistrés » d'un compte), `jaimes`, `signalements`, `commentaires` ; et `fichiers` (fichiers joints, data URL), `piecesEtablissement` (pièces d'agrément), `medias`, `notifications` / `notificationsCompte` (lu / non lu), `demandesAssistance`, `signalementsAvis`, `sessionsActives`, `activiteSecurite`.
- **De référence** (lues par les écrans, modifiables dans `yibolo.sql`) : `typesEcole`, `tuilesAnnuaire`, `domaines`, `filieresCartes`, `diplomes`, `regions`, `villesRegion`, `villes`, `quartiers`, `repartitionNotes`, `albums`, `programme`, `permis`, `criteresAvis`, `roles`, `notifications`, `visites`, `sourcesVisites`, `sessionsActives`, `activiteSecurite`, `indicateurs`, `formationsPopulaires`, `tranchesFrais`, `categoriesGalerie`, `photosAutoEcole`, `videos` ; pour l'accueil connecté : `domainesExpertise`, `experts`, `bandeauxAccueil`, `sujetsPublication`.
- Types dans `src/shared/types.ts`.
- Les enregistrements de la maquette qui ne sont rattachés à aucun établissement précis portent `etablissementId: '*'` (`POUR_TOUS`) : ils s'affichent pour **tous** les établissements. Ce qu'un testeur crée porte le **vrai** identifiant.
- Un élément ajouté s'affiche **avant** ceux de départ.
- **Comptes** (`comptes`) : e-mail, téléphone, rôle, établissement géré, statut (`Validé` / `En vérification`), mot de passe **haché** (`sha256(sel + ':' + mot de passe)`, `src/shared/utils/motDePasse.ts`). Voir [comptes-et-acces.md](comptes-et-acces.md).

## Règles pour les écrans
1. **Toute donnée** affichée vient d'un hook de `@/data/hooks` (ou de `useCollection` de `@/data`). **Jamais de tableau de données, de chiffre ou d'image de contenu écrit dans un composant.** Ce qui reste dans le code, c'est la **configuration** : correspondance adresses ↔ types d'école (`features/schools/schoolTypes.ts`), icônes et couleurs, images décoratives des bandeaux, valeurs par défaut d'un nouvel élément.
2. Pas de hook dans une boucle ni une condition (ni après un `return` anticipé) : lire la liste une fois, puis `find` / `filter`.
3. **Écrire** : `await data.create(...)`, `data.update(...)`, `data.remove(...)`, puis le `toast` et la navigation habituels. L'écran se met à jour seul.
4. Une page qui lit la base attend qu'elle soit prête (Suspense → `PageLoader`). Un cadre ou un fournisseur qui ne doit pas attendre utilise `useCollectionWhenReady` / `useDataReady`.
5. `shared/` peut importer `@/data`. `src/data/` n'importe ni `features/` ni `app/`.
6. **La landing n'utilise pas la base et ne doit pas être modifiée.**

## Compteurs (décision du 2026-11-24 : « calculs cohérents »)
- Un chiffre part de **celui de la maquette** et **suit les actions** : maquette + ajouts − retraits. On ne recalcule jamais un chiffre de la maquette à partir des lignes de la base.
- Écrire un compteur : `ajusterIndicateurs`, `ajusterNombreFormations`, `compterDansLAnnuaire` (`src/shared/utils/compteurs.ts`), à côté de l'écriture qui le fait varier.
- Afficher : `repartitionAJour` / `critereAJour` (avis), `ajoutes()` (éléments ajoutés par les testeurs, reconnus par `dateDeCreation(id)` de `src/data/index.ts`).
- Un établissement créé par un testeur part de zéro (`indicateursDe`) ; inscrit, il reste caché et non compté (`enVerification`) jusqu'à la validation par YIBOLO.

## Changer une donnée de départ
1. Modifier `src/data/depart/yibolo.sql` (une ligne = un élément, en JSON).
2. Augmenter `VERSION_DONNEES` dans `sources/sqliteSource.ts` : les bases des testeurs seront refaites à leur prochaine visite.

## Changer de stockage plus tard
1. Écrire `src/data/sources/<nouvelleSource>.ts` qui respecte `DataSource` (par exemple des appels `fetch` vers une API, ou Firebase).
2. L'ajouter à `SOURCES` dans `src/data/index.ts`.
3. Choisir `VITE_DATA_SOURCE=<nom>` (`.env.local` et Netlify).
Aucun écran ne change.

## Plus de panneau « Données de test »
Le panneau (exporter, importer, réinitialiser) est retiré de l'interface (décision du 2026-11-25 : rien ne parle de démonstration). `data.exportFile`, `importFile` et `reset` restent dans la couche de données.

## Ce qui reste dans le stockage local (`localStorage`)
| Clé | Contenu |
|---|---|
| `yibolo:compte` | identifiant du compte connecté avec « Se souvenir de moi » (sinon dans le stockage de la visite, `sessionStorage`) |
| `yibolo:avis-utiles` | avis marqués « Utile » par ce navigateur (le nombre est dans la base) |
| `yibolo:inscription-v2:<auto-école>:<permis>` | brouillon d'inscription en auto-école (avant l'envoi) |
| `yibolo:langue` | langue choisie |

La base SQLite est dans l'IndexedDB du navigateur (base `yibolo`, clé `base-sqlite`). Vider les données du navigateur ou la navigation privée la font perdre : exporter pour garder une copie.

## Données de la maquette
1. Les valeurs de départ (`yibolo.sql`) sont celles de la maquette (noms, chiffres, dates, textes). Les chiffres d'annuaire (532 IPES, 1 248 établissements…) sont **recopiés**, pas calculés.
2. Les données restent **en français** : on ne modifie pas les données pour traduire (voir [traduction.md](traduction.md)).

## Découpage territorial
- Tables de référence `departements` (`id`, `region`, `nom`, `chefLieu`) et `arrondissements` (`id`, `departement`, `nom`, `ville`), reprises du fichier `decoupage-cameroun.csv` de yibolo-backend (58 départements, 360 arrondissements). Lecture : `useDecoupage()` ; tri et ville : `src/shared/utils/geographie.ts`.
- Un lieu saisi garde `region`, `departement`, `arrondissement`, `quartier` et la `ville` déduite (pour l'affichage et les recherches existantes).
