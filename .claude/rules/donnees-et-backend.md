# Données et backend

## Pas de backend (décision du 2026-11-16)
- yibolo-frontend est **un front seul** : aucun backend, aucun appel d'API, **pas d'Orval**, pas de react-query, pas de `VITE_API_URL`.
- **Ne jamais proposer de brancher le backend** (yibolo-backend ou autre). Le porteur du projet a refusé cette approche.

## Les données de démonstration (`src/mocks/`)
Elles jouent le rôle du serveur. Les écrans les importent directement.

| Fichier | Contenu |
|---|---|
| `schools.ts` | établissements (`etablissements`, `etablissementById`), formations (`formations`, `formationById`, `formationsOf`), `typeConfig` (IPES, CFP, Autres : libellés et chiffres de la maquette), `typesEcole`, domaines, filières, diplômes, régions, villes, quartiers, avis et répartition de l'IPC, albums, programme |
| `drivingSchools.ts` | `permisCatalogue` (A à E), `autoEcoles`, `autoEcoleById`, sessions, « Pourquoi nous choisir », critères et avis d'auto-école, catégories de galerie |
| `pro.ts` | espace pro : actualités, documents, FAQ, utilisateurs, rôles, notifications, statistiques de visites, sessions et activité de sécurité, `formationsPro` (tableau de la maquette) |
| `demoAccounts.ts` | les 4 comptes de démonstration |

Règles :
1. **Les valeurs viennent de la maquette** (noms, chiffres, dates, textes). Les chiffres d'annuaire (532 IPES, 1 248 établissements…) sont **recopiés**, pas calculés.
2. Les données restent **en français** : on ne modifie pas `src/mocks/` pour traduire (voir [traduction.md](traduction.md)).
3. Les types viennent de `src/shared/types.ts`.
4. Une donnée propre à un seul écran peut rester en constante en haut de la page (ex. textes des permis dans `PermisDetail.tsx`) si elle reprend une capture ; une donnée partagée va dans `src/mocks/`.
5. `shared/` n'importe jamais `mocks/`.

## Ce qui est gardé dans le navigateur
| Clé | Contenu |
|---|---|
| `yibolo:role` | compte de démonstration choisi |
| `yibolo:favorites` | favoris et leurs dossiers |
| `yibolo:inscription-v2:<auto-école>:<permis>` | brouillon d'inscription en auto-école |
| `yibolo:langue` | langue choisie (i18next) |

Tout le reste (préinscriptions, avis, formations créées, actualités, paramètres) **n'est pas enregistré** : l'envoi affiche un message de réussite, rien de plus.

## Écritures simulées
- Une action qui « enregistre » affiche un `toast.success` (« Modifications enregistrées », « Formation envoyée pour validation par YIBOLO »…) puis navigue si la maquette le montre.
- Les espaces pro et public ne sont pas reliés : une modification dans l'espace pro ne change pas la fiche publique.
