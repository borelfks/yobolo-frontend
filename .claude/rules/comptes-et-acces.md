# Comptes et accès

## Comptes de démonstration (`src/mocks/demoAccounts.ts`)
| Rôle | Nom | Établissement | Première page |
|---|---|---|---|
| `utilisateur` | Jean Dupont (personne physique) | — | `/ecoles` |
| `ipes` | IPC Yaoundé | `ipc` | `/pro/ecole` |
| `cfp` | CFP du BTP | `cfp-btp` | `/pro/ecole` |
| `autre` | Centre Linguistique | `langues` | `/pro/ecole` |

- **Un compte = un espace.** Pas de changement de rôle : on change de compte depuis la connexion (« Changer de compte de démo »).
- Session : `useSession()` (`features/auth/hooks/useSession.tsx`), gardée sous `yibolo:role`. À la première visite : **visiteur non connecté** (la landing montre « Se connecter » ; décision du 2026-11-24).
- L'établissement de l'espace pro : `useMonEcole()` (celui du compte ; l'IPC par défaut).

## Connexion (`/connexion`)
1. Identifiant (e-mail ou téléphone) + mot de passe, validés par zod ; n'importe quelles valeurs valides sont acceptées.
2. Le compte ouvert est celui choisi dans **« Compte de démonstration »** sous le formulaire. `?espace=ecole` présélectionne l'IPES.
3. Après connexion : message « Bienvenue, … ! » et arrivée sur la première page du compte.
4. « Mot de passe oublié ? » affiche un message (code par SMS ou WhatsApp) ; « Continuer sans compte » mène à l'accueil.

## Inscription (`/inscription`)
1. **Profil** : École / IPES, Consultant, Entreprise, Personne physique. Seul **École / IPES** est ouvert ; les trois autres affichent « Bientôt disponible » et ne se choisissent pas (décision du 2026-11-24).
2. **Infos** : raison sociale ou nom, téléphone, e-mail, région, ville, quartier, mot de passe (8 caractères) + confirmation.
3. **Vérification** : pièces selon le profil (pièce d'identité ; ou autorisation d'ouverture / justificatif d'activité + NIU).
4. **En cours de vérification** (24 à 48 heures, notification par e-mail et SMS), puis **Compte validé !** (lien de démo « Simuler la validation par YIBOLO »). « Se connecter à mon espace » ouvre le compte IPES (profil École) ou Utilisateur.

## Accès
| Situation | Résultat |
|---|---|
| Compte sans établissement sur `/pro/ecole…` | → `/connexion?espace=ecole` |
| Pages publiques (annuaires, fiches, préinscription, inscription en auto-école, avis, favoris) | ouvertes à tous |
| « Se déconnecter » | → `/connexion` |

- Le menu du compte montre « Mon espace professionnel » seulement aux comptes école, et « Donner un avis » seulement à l'utilisateur.
- Il n'y a pas de vraie sécurité (front seul) : ces gardes servent la démonstration. Ne pas ajouter de logique d'authentification réelle.
