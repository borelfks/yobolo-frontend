# Comptes et accès

## Comptes (table `comptes` de la base)
| Rôle | Nom | Établissement | Première page |
|---|---|---|---|
| `utilisateur` | Jean Dupont (personne physique) | — | `/accueil` |
| `ipes` | IPC Yaoundé | `ipc` | `/pro/ecole` |
| `cfp` | CFP du BTP | `cfp-btp` | `/pro/ecole` |
| `autre` | Centre Linguistique | `langues` | `/pro/ecole` |

- **Un compte = un espace.** Pas de changement de rôle : on change de compte en se déconnectant puis en se reconnectant.
- Session : `useSession()` (`features/auth/hooks/useSession.tsx`) garde l'identifiant du compte sous `yibolo:compte` ; le compte est lu dans la base. À la première visite : **visiteur non connecté**.
- L'établissement de l'espace pro : `useMonEcole()` (celui du compte ; l'IPC par défaut).

## Connexion (`/connexion`)
1. Identifiant (e-mail ou téléphone) + mot de passe, validés par zod ; n'importe quelles valeurs valides sont acceptées.
2. L'identifiant (e-mail ou téléphone) et le mot de passe sont **vérifiés dans la base** (mot de passe haché, `shared/utils/motDePasse.ts`). Comptes de départ : `jean.dupont@exemple.cm` (Personne physique), `contact@ipc.cm` (École – IPES), `contact@cfp-btp.cm` (École – CFP), `contact@langues.cm` (École – Autre), tous avec le mot de passe `yibolo2026`. Erreurs : « Identifiant ou mot de passe incorrect. », « Votre compte est en cours de vérification par YIBOLO… ».
3. Après connexion : message « Bienvenue, … ! » et arrivée sur la première page du compte.
4. « Mot de passe oublié ? » : page `/mot-de-passe-oublie` (comme yibolo-client) : numéro du compte → code à 6 chiffres (affiché à l'écran, faute de SMS sans serveur) → nouveau mot de passe enregistré (haché). « Se souvenir de moi » coché : la session reste après fermeture du navigateur ; sinon elle s'arrête (stockage de la visite). « Continuer sans compte » mène à l'accueil.

## Inscription (`/inscription`)
1. **Profil** : École / IPES, Consultant, Entreprise, Personne physique. **École / IPES** et **Personne physique** sont ouverts ; Consultant et Entreprise affichent « Bientôt disponible » (décisions du 2026-11-24).
2. **Infos** : raison sociale ou nom, téléphone, e-mail, région, ville, quartier, mot de passe (8 caractères) + confirmation.
3. **Vérification** : pièces selon le profil (pièce d'identité ; ou autorisation d'ouverture / justificatif d'activité + NIU).
4. **En cours de vérification** (24 à 48 heures, notification par e-mail et SMS), puis **Compte validé !** La vérification par YIBOLO est faite quand l'école revient se connecter : écran « Compte validé ! », puis son espace (`validerCompteEcole`, `features/auth/authComptes.ts`). Le compte est **enregistré dans la base** à l'envoi du code, statut « En vérification » ; son établissement l'est à « Soumettre pour vérification » ;  Un e-mail déjà utilisé est refusé.

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
- Personne physique : Profil → Vous → Votre accès → Code ; le compte est enregistré à l'envoi du code (`telephoneVerifie: false`) et connecté au bon code. École : Profil → Infos → Code → Vérification (pièces) → validation simulée.
- Code OTP : `features/auth/components/VerificationCode.tsx` (6 cases, renvoi après 60 s, `authOtp.ts`).
- Code jamais saisi : la connexion affiche « Confirmez votre numéro » (nouveau code) ; puis la personne entre, l'école reprend `/inscription` à l'étape des pièces (`state.reprise`).
- Lieu : `SelectionGeographique` (région → département → arrondissement → quartier).

## Formations en attente
- Une formation « Envoyée pour validation » (« En attente ») est publiée par YIBOLO quand l'établissement revient se connecter (`publierFormationsVerifiees`) ; celles de la maquette gardent leur statut. Plus de « Simuler la validation ».
