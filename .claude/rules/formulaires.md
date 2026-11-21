# Formulaires

1. **Fidèles à la maquette** : mêmes champs, même ordre, mêmes libellés, mêmes exemples (« Ex. : G2 – Comptabilité et Gestion »). Les valeurs **préremplies** de la maquette (ex. l'inscription avec les données de l'IPC) restent préremplies.
2. **Validation :**
   - la **connexion** et l'**inscription** utilisent **react-hook-form + zod** (`zodResolver`), avec le schéma déclaré **en haut du fichier**, hors du composant ;
   - les autres formulaires de la démo (préinscription, inscription en auto-école, avis, invitation, création de formation, paramètres) vérifient l'essentiel à la main et affichent un message `toast.error` ;
   - **tout nouveau formulaire** utilise react-hook-form + zod. Passer les anciens sur ce modèle est noté dans [DECISIONS.md](../../docs/DECISIONS.md).
3. **Messages :** en français (et traduits), sous le champ ou dans un message, disant **comment corriger** (« Le mot de passe compte au moins 6 caractères. »). Les messages zod passent aussi par la traduction.
4. **Règles actuelles :**
   - connexion : identifiant obligatoire, mot de passe de 6 caractères au moins ;
   - inscription : nom (2 caractères), téléphone (9 caractères), e-mail valide, région, ville, quartier, mot de passe de 8 caractères au moins + confirmation identique ;
   - avis : note obligatoire, commentaire d'au moins 10 caractères, confirmation d'avoir suivi une formation ;
   - inscription en auto-école : case de certification cochée avant l'envoi ;
   - mot de passe (Paramètres › Sécurité) : 8 caractères, une majuscule, un chiffre, un caractère spécial.
5. **Champs :** toujours ceux de `shared/components/forms/Fields.tsx` (et `ProLabel` / `proInput` dans l'espace pro). Astérisque rouge si obligatoire, « (facultatif) » quand la maquette l'écrit.
6. **Étapes :** préinscription en 4 étapes, inscription en auto-école en 3, création de compte en 4. L'indicateur d'étapes permet de revenir en arrière ; l'étape « Validation » montre un récapitulatif avec « Modifier » par bloc.
7. **Pièces à fournir :** bouton « Importer » (champ fichier caché) ; le nom du fichier s'affiche, rien n'est envoyé. Formats affichés comme sur la maquette (« PDF, JPG ou PNG (max. 5 Mo) »).
8. **Envoi :** message de réussite, puis écran de confirmation ou retour à la page parente. **Rien n'est enregistré** (front seul), sauf le brouillon d'inscription en auto-école (`useInscriptionDraft`).
