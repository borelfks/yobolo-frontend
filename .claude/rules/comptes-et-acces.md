# Comptes et accès

## Comptes (table `comptes` de la base)
| Rôle | Nom | Établissement | Première page |
|---|---|---|---|
| `utilisateur` | Jean Dupont (personne physique) | — | `/accueil` |
| `ipes` | IPC Yaoundé | `ipc` | `/accueil` |
| `cfp` | CFP du BTP | `cfp-btp` | `/accueil` |
| `autre` | Centre Linguistique | `langues` | `/accueil` |

- **Tous les comptes arrivent sur l'accueil connecté** (`account.home` = `/accueil`, `useSession`) ; une école ouvre son espace pro avec « Mon espace professionnel » (menu du compte). Pas de « Mes favoris » pour une école.
- **Un compte = un espace.** Pas de changement de rôle : on change de compte en se déconnectant puis en se reconnectant.
- Session : `useSession()` (`features/auth/hooks/useSession.tsx`) garde l'identifiant du compte sous `yibolo:compte` ; le compte est lu dans la base. À la première visite : **visiteur non connecté**.
- L'établissement de l'espace pro : `useMonEcole()` (celui du compte ; l'IPC par défaut).

## Connexion (`/connexion`)
1. Identifiant (e-mail ou téléphone) + mot de passe, validés par zod ; n'importe quelles valeurs valides sont acceptées.
2. L'identifiant (e-mail ou téléphone) et le mot de passe sont **vérifiés dans la base** (mot de passe haché, `shared/utils/motDePasse.ts`). Comptes de départ : `jean.dupont@exemple.cm` (Personne physique), `contact@ipc.cm` (École – IPES), `contact@cfp-btp.cm` (École – CFP), `contact@langues.cm` (École – Autre), tous avec le mot de passe `yibolo2026`. Erreur : « Identifiant ou mot de passe incorrect. ».
3. Après connexion : message « Bienvenue, … ! » et arrivée sur la première page du compte.
4. « Mot de passe oublié ? » : page `/mot-de-passe-oublie` (comme yibolo-client) : numéro du compte → code à 6 chiffres (affiché à l'écran, faute de SMS sans serveur) → nouveau mot de passe enregistré (haché). « Se souvenir de moi » coché : la session reste après fermeture du navigateur ; sinon elle s'arrête (stockage de la visite). « Continuer sans compte » mène à l'accueil.

## Inscription (`/inscription`)
1. **Profil** : École / IPES, Consultant, Entreprise, Personne physique. **École / IPES** et **Personne physique** sont ouverts ; Consultant et Entreprise affichent « Bientôt disponible » (décisions du 2026-11-24).
2. **Infos** : raison sociale ou nom, téléphone, e-mail, région, ville, quartier, mot de passe (8 caractères) + confirmation.
3. **Documents** (obligatoires) : pièces selon le profil (pièce d'identité ; ou autorisation d'ouverture / justificatif d'activité + NIU).
4. **« Créer mon compte »** : le compte (statut « Validé ») et son établissement sont enregistrés, et l'école **entre directement dans son espace professionnel**. **Pas de validation par YIBOLO** (décision du 2026-11-27). Le compte est enregistré dès l'envoi du code ; un e-mail déjà utilisé est refusé.

## Accès
| Situation | Résultat |
|---|---|
| Compte sans établissement sur `/pro/ecole…` | → `/connexion?espace=ecole` |
| Pages publiques (annuaires, fiches, préinscription, inscription en auto-école, avis, favoris) | ouvertes à tous |
| « Se déconnecter » | → `/connexion` |

- Le menu du compte montre « Mon espace professionnel » seulement aux comptes école ; « Mon espace » et « Mon profil » seulement à l'utilisateur. « Donner un avis » est dans Mon espace › Mes avis (« À évaluer »).
- Il n'y a pas de vraie sécurité (front seul) : ces gardes servent la démonstration. Ne pas ajouter de logique d'authentification réelle.

## Espace pro : compte et sécurité
- Paramètres › Compte : nom, téléphone, e-mail et photo du compte enregistrés dans `comptes`.
- Paramètres › Sécurité : vrai changement de mot de passe (mot de passe actuel vérifié), double authentification enregistrée, fermeture d'une session (`sessionsActives`), activité ajoutée à `activiteSecurite`.
- « Assistance YIBOLO » et « Contacter le support » : demande enregistrée (`demandesAssistance`).

## Mon espace (personne physique)
- `/mon-espace/:onglet?` : Aperçu · Mes préinscriptions · Mes permis · Mes avis (voir [SPECIFICATIONS.md](../../docs/SPECIFICATIONS.md) § 9 bis). Pages à part, ouvertes depuis le menu du compte ou la cloche : `/profil` (photo enregistrée dès qu'elle est choisie, nouveau numéro confirmé par code), `/parametres` (notifications par sujet et par canal, mot de passe, langue, suppression), `/notifications` (à la manière de Facebook : Toutes / Non lues, Nouvelles / Plus tôt).
- Réservé au rôle `utilisateur` : un visiteur va à `/connexion`, un compte école à son espace pro.
- Annuler un dossier, modifier ou supprimer un avis tient les compteurs à jour (`features/espace/espaceActions.ts`).

## Inscription (comme yibolo-client)
- Personne physique : Profil → Vous → Votre accès → Code ; le compte est enregistré à l'envoi du code (`telephoneVerifie: false`) et connecté au bon code. École : Profil → Infos → Code → Documents (pièces, obligatoires) → espace pro, sans validation.
- Code OTP : `features/auth/components/VerificationCode.tsx` (6 cases, renvoi après 60 s, `authOtp.ts`).
- Code jamais saisi : la connexion affiche « Confirmez votre numéro » (nouveau code) ; puis la personne entre, l'école reprend `/inscription` à l'étape des pièces (`state.reprise`).
- Lieu : `SelectionGeographique` (région → département → arrondissement → quartier).

## Formations : pas de validation
- Une formation enregistrée par l'établissement est **publiée tout de suite** (« Publiée ») ou gardée en « Brouillon » ; le statut « En attente » n'existe plus (décision du 2026-11-27). Une pièce d'agrément ajoutée est « Validé » tout de suite.
