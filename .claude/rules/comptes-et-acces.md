# Comptes et accès

## Comptes (table `comptes` de la base)
| Rôle | Nom | Établissement | Première page |
|---|---|---|---|
| `utilisateur` | Jean Dupont (personne physique) | — | `/accueil` |
| `ipes` | IPC Yaoundé | `ipc` | `/pro/ecole` |
| `cfp` | CFP du BTP | `cfp-btp` | `/pro/ecole` |
| `autre` | Centre Linguistique | `langues` | `/pro/ecole` |

- **Un compte = un espace.** Pas de changement de rôle : on change de compte depuis la connexion (« Changer de compte de démo »).
- Session : `useSession()` (`features/auth/hooks/useSession.tsx`) garde l'identifiant du compte sous `yibolo:compte` ; le compte est lu dans la base. À la première visite : **visiteur non connecté**.
- L'établissement de l'espace pro : `useMonEcole()` (celui du compte ; l'IPC par défaut).

## Connexion (`/connexion`)
1. Identifiant (e-mail ou téléphone) + mot de passe, validés par zod ; n'importe quelles valeurs valides sont acceptées.
2. L'identifiant (e-mail ou téléphone) et le mot de passe sont **vérifiés dans la base** (mot de passe haché, `shared/utils/motDePasse.ts`). Comptes de départ : `jean.dupont@exemple.cm` (Personne physique), `contact@ipc.cm` (École – IPES), `contact@cfp-btp.cm` (École – CFP), `contact@langues.cm` (École – Autre), tous avec le mot de passe `yibolo2026`. Erreurs : « Identifiant ou mot de passe incorrect. », « Votre compte est en cours de vérification par YIBOLO… ».
3. Après connexion : message « Bienvenue, … ! » et arrivée sur la première page du compte.
4. « Mot de passe oublié ? » : identifiant → code de vérification (affiché à l'écran, faute de SMS sans serveur) → nouveau mot de passe enregistré (haché). « Se souvenir de moi » coché : la session reste après fermeture du navigateur ; sinon elle s'arrête (stockage de la visite). « Continuer sans compte » mène à l'accueil.

## Inscription (`/inscription`)
1. **Profil** : École / IPES, Consultant, Entreprise, Personne physique. Seul **École / IPES** est ouvert ; les trois autres affichent « Bientôt disponible » et ne se choisissent pas (décision du 2026-11-24).
2. **Infos** : raison sociale ou nom, téléphone, e-mail, région, ville, quartier, mot de passe (8 caractères) + confirmation.
3. **Vérification** : pièces selon le profil (pièce d'identité ; ou autorisation d'ouverture / justificatif d'activité + NIU).
4. **En cours de vérification** (24 à 48 heures, notification par e-mail et SMS), puis **Compte validé !** (lien de démo « Simuler la validation par YIBOLO »). Le compte (et, pour le profil École, son établissement) est **enregistré dans la base** à « Soumettre pour vérification », statut « En vérification » ; « Simuler la validation par YIBOLO » le passe à « Validé » ; « Se connecter à mon espace » ouvre ce compte. Un e-mail déjà utilisé est refusé.

## Accès
| Situation | Résultat |
|---|---|
| Compte sans établissement sur `/pro/ecole…` | → `/connexion?espace=ecole` |
| Pages publiques (annuaires, fiches, préinscription, inscription en auto-école, avis, favoris) | ouvertes à tous |
| « Se déconnecter » | → `/connexion` |

- Le menu du compte montre « Mon espace professionnel » seulement aux comptes école, et « Donner un avis » seulement à l'utilisateur.
- Il n'y a pas de vraie sécurité (front seul) : ces gardes servent la démonstration. Ne pas ajouter de logique d'authentification réelle.

## Espace pro : compte et sécurité
- Paramètres › Compte : nom, téléphone, e-mail et photo du compte enregistrés dans `comptes`.
- Paramètres › Sécurité : vrai changement de mot de passe (mot de passe actuel vérifié), double authentification enregistrée, fermeture d'une session (`sessionsActives`), activité ajoutée à `activiteSecurite`.
- « Assistance YIBOLO » et « Contacter le support » : demande enregistrée (`demandesAssistance`).
