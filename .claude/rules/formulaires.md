# Formulaires

1. **Fidèles au canevas** : mêmes champs, même ordre, mêmes libellés, mêmes exemples (« Ex. : G2 – Comptabilité et Gestion »). Les valeurs **préremplies** du canevas restent préremplies.
2. **Validation : react-hook-form + zod** (`zodResolver`), schéma déclaré **en haut du fichier** avec des clés de message (résolues par `t` à l'affichage), ou dans le composant avec `useMemo([t])` quand ses messages sont traduits directement. C'est déjà le cas pour la connexion, l'inscription, le mot de passe oublié, l'aide et contact, le profil et les paramètres de la personne, l'invitation et les accords de l'espace pro. **Tout nouveau formulaire** suit ce modèle ; les plus anciens (création de formation, avis, paramètres de l'espace pro) vérifient l'essentiel à la main avec un message `toast.error` et passent sur ce modèle quand on les retouche.
3. **React Compiler** : toujours **déstructurer** `useForm` à l'appel (`const { register, formState, setError } = useForm(…)`), sinon les erreurs ne s'affichent pas (voir [code-et-architecture.md](code-et-architecture.md)).
4. **Messages** : traduits, sous le champ (`Champ`, `aria-invalid`) ou en message éphémère, et disent **comment corriger** (« Le mot de passe compte au moins 8 caractères. »). Les messages zod sont des clés, résolues par `t`.
5. **Règles actuelles :**
   - connexion : identifiant obligatoire, mot de passe de 6 caractères au moins ;
   - inscription d'une personne : prénom, nom, civilité, nationalité, lieu ; téléphone de 9 chiffres sans 0 devant ; e-mail facultatif ; mot de passe de 8 caractères + confirmation ; puis code à 6 chiffres ;
   - inscription d'une école : type, raison sociale, sigle, responsable, téléphone, e-mail, lieu, mot de passe ; puis code ; puis pièces (accords de création et d'ouverture, NIU et son certificat) ;
   - avis : note obligatoire, commentaire d'au moins 10 caractères, confirmation d'avoir suivi une formation ;
   - mot de passe (paramètres) : 8 caractères, une majuscule, un chiffre, un caractère spécial.
6. **Champs** : les blocs de `src/shared/blocs/Formulaire.tsx` (`Champ`, `ChampTexte` 48 px, `ChampTelephone` +237, `ChampMotDePasse`, `JaugeMotDePasse`, `CaseACocher`, `ListeDeroulante`, `Encadre`, `BarreEtapes`, `PieceAJoindre`) et les briques shadcn (`Input`, `Textarea`, `Select…`, `RadioGroup…`, `Switch`). Lieu : `ChampsLieu` (région → département → arrondissement → quartier). Accords : `ListeAccords`, `ChampsAccord`. Astérisque rouge si obligatoire, « (facultatif) » quand le canevas l'écrit.
7. **Dates saisies** : champ `type="date"` (valeur « 2026-11-15 ») ; affichage avec `formaterDate` (voir [dates-et-nombres.md](dates-et-nombres.md)).
8. **Étapes** : création de compte en 4 étapes (personne : Profil, Vous, Votre accès, Code ; école : Profil, Infos, Code, Documents), avec `BarreEtapes` ; on peut revenir en arrière.
9. **Pièces à fournir** : `PieceAJoindre` ; le fichier est **enregistré dans la base** (table `fichiers`, data URL, 3 Mo au plus ; photos 2 Mo), son nom s'affiche, on peut le revoir ou le remplacer. Formats affichés comme sur le canevas (« PDF, JPG ou PNG (max. 5 Mo) »).
10. **Envoi** : bouton `loading` pendant l'enregistrement ; tout est enregistré dans la base, puis message de réussite et retour à la page parente ou écran de confirmation. Les envois d'un compte connecté portent son `compteId`.
