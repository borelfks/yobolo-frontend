# YIBOLO — Cahier des charges (front-end)

> Référence fonctionnelle de l'interface : **ce que fait l'application, écran par écran**, dans son état réel (front seul, fausses données).
> La source de vérité visuelle est le **canevas YIBOLO** (planches à 1440 px et 390 px), complété par la maquette Word du client (`C:\Users\USER\Documents\yibolo\NOUVEAU DESIGN YIBOLO.docx`).
>
> Documents liés : [DESIGN.md](DESIGN.md) (apparence), [DECISIONS.md](DECISIONS.md) (historique et points à revoir), [.claude/rules/](../.claude/rules/) (règles pour coder), [README.md](../README.md) (démarrer). L'administration est décrite dans yibolo-admin (`docs/SPECIFICATIONS.md`).

---

## 1. Présentation

**YIBOLO** est la plateforme de **formation, d'expertise et d'emploi en Afrique centrale**. Quatre univers :

| Univers | Pour qui | Dans ce dépôt |
|---|---|---|
| **École** | trouver un établissement, une formation, une auto-école, un permis | **réalisé** |
| **Consultation** | consulter un expert | « Bientôt » dans le menu, page « bientôt disponible » |
| **Métiers** | découvrir les métiers | pas encore dans le canevas |
| **Emploi** | offres d'emploi, de stage et d'apprentissage | « Bientôt » dans le menu, page « bientôt disponible » |

En attendant l'API de yibolo-backend, toutes les données sont fausses (`src/data/fausses-donnees/`) et gardées dans le navigateur de chaque testeur ; aucun serveur n'est appelé.

**Marché :** Cameroun (10 régions, 58 départements, 360 arrondissements). Interface en **français** (référence) et en **anglais britannique**, montants en **FCFA**.

---

## 2. Principe de fonctionnement

1. **L'espace professionnel** : l'établissement renseigne et actualise ses informations (profil, formations, contenus).
2. **L'espace public** : visiteurs, étudiants, candidats et parents cherchent des établissements, des formations et des auto-écoles.

Ce que l'établissement enregistre dans son espace pro (profil, formations publiées, actualités, documents, FAQ, médias) **s'affiche sur sa fiche publique**. Pas de validation par YIBOLO (décision du 2026-11-27) : une formation enregistrée est « Publiée » tout de suite, ou gardée en « Brouillon ».

Tous les chiffres sont **calculés à partir de la base** (notes, nombres d'avis, de formations, d'établissements, statistiques), jamais recopiés de la maquette.

---

## 3. Vocabulaire

| Mot | Sens |
|---|---|
| **École** | l'univers « formation » (menu « École ») |
| **Établissement** | un IPES, un CFP ou un « Autre » établissement |
| **IPES** · **CFP** · **Autres** | Institut Privé d'Enseignement Supérieur · Centre de Formation Professionnelle · autres établissements (langues, informatique, couture…) |
| **Auto-école** | école de conduite ; badge **« Agréée »** |
| **Formation** · **Filière** · **Diplôme** | cursus · domaine · titre obtenu (BTS, Licence, Master…) |
| **Permis A, B, C, D, E** | catégories de permis de conduire |
| **Favoris** | formations, établissements, auto-écoles ou permis gardés, rangés en dossiers |
| **Avis** | note et commentaire sur un établissement ou une auto-école |
| **Espace professionnel** | la gestion de l'établissement (`/pro/ecole`) |
| **Établissement vérifié** | badge vert : ses accords de création et d'ouverture sont enregistrés |

Mots anglais : glossaire de [.claude/rules/traduction.md](../.claude/rules/traduction.md).

---

## 4. Comptes et accès

| Rôle | Compte de départ | Première page | Espace |
|---|---|---|---|
| `utilisateur` | Jean Dupont (`jean.dupont@exemple.cm`) | `/accueil` | pages publiques, accueil connecté, favoris, profil, paramètres, notifications |
| `ipes` | IPC Yaoundé (`contact@ipc.cm`) | `/accueil` | espace pro (établissement `ipc`) |
| `cfp` | CFP du BTP (`contact@cfp-btp.cm`) | `/accueil` | espace pro (établissement `cfp-btp`) |
| `autre` | Centre Linguistique (`contact@langues.cm`) | `/accueil` | espace pro (établissement `langues`) |

- Mot de passe des comptes de départ : `yibolo2026`. Connexion par e-mail ou téléphone, vérifiée dans la base (mot de passe haché).
- **Un compte = un espace.** Les trois comptes école partagent le même espace pro (`useMonEcole`).
- Un compte sans établissement sur `/pro/ecole…` est renvoyé à `/connexion?espace=ecole`. Les listes d'écoles renvoient un compte école vers son espace ; les fiches restent ouvertes.
- À la première visite et après « Se déconnecter » : **visiteur non connecté**. « Se souvenir de moi » garde la session après la fermeture du navigateur.
- **Menu du compte** : nom, « Voir mon profil » (personne) ou « Voir ma page publique » (école) ; personne : Mes favoris · Paramètres · Aide et contact · Se déconnecter ; école : Profil de l'établissement · Statistiques · Paramètres · Aide et contact · Se déconnecter. **Cloche** : lien vers les notifications, avec le nombre de non lues.

---

## 5. Pages publiques

| Écran | Adresse | Contenu |
|---|---|---|
| **Landing** | `/` | copie gelée de yibolo-client, réservée aux visiteurs (un compte connecté va à `/accueil`) |
| **Connexion** | `/connexion` | cadre de connexion (formulaire à gauche, photo et 4 points de la marque à droite) : e-mail ou téléphone, mot de passe (afficher / masquer), « Se souvenir de moi », « Mot de passe oublié ? », « Se connecter », « Créer un compte », « Continuer sans compte » ; erreur « Identifiant ou mot de passe incorrect. » |
| **Créer un compte** | `/inscription` | Profil (École / IPES et Personne physique ouverts ; Consultant et Entreprise « Bientôt disponible ») puis les étapes du profil (§ 5.1) |
| **Mot de passe oublié** | `/mot-de-passe-oublie` | numéro du compte → code à 6 chiffres → nouveau mot de passe → connexion |
| **Aide et contact** | `/aide` | thèmes, questions fréquentes, formulaire de contact (enregistré dans `demandesAssistance`) |
| **Conditions générales** | `/conditions` | texte des conditions |

### 5.1 Création de compte
- **Personne physique** : Profil → **Vous** (civilité, prénom, nom, nationalité, lieu) → **Votre accès** (téléphone +237, « numéro WhatsApp », e-mail facultatif, mot de passe de 8 caractères et confirmation, conditions) → **Code** (6 cases, renvoi après 60 s ; sans serveur d'envoi, le code est affiché). Le bon code ouvre le compte sur `/accueil`.
- **École** : Profil → **Infos** (type d'établissement, raison sociale, sigle, responsable et fonction, téléphone, e-mail, lieu, adresse, mot de passe) → **Code** → **Documents** (au moins un accord de création et un accord d'ouverture, chacun avec autorité, numéro, dates et document ; NIU et son certificat) → l'école entre dans son espace pro. Une auto-école reçoit un compte « Autre » (pas encore d'espace auto-école).
- Le compte est enregistré dès l'envoi du code ; s'il revient sans avoir saisi le code, « Confirmez votre numéro » lui envoie un nouveau code. Un e-mail ou un numéro déjà utilisé est refusé.
- Lieu : région → département → arrondissement (la ville se déduit) → quartier (`ChampsLieu`).

---

## 6. Accueil connecté — `/accueil`

Réservé aux comptes connectés (un visiteur va à `/connexion`).
- **Trois colonnes** sur ordinateur : le compte et « Mes domaines » · le fil · les experts et les sujets du moment ; sur téléphone, le fil seul.
- **Fil** : publications des experts (pas d'offres ni de formations), avec J'aime, Commenter, Partager, menu ⋯ (Enregistrer, Copier le lien, Signaler). Recherche et filtres dans l'adresse : `?vue=enregistres`, `?domaine=`, `?sujet=`, `?q=`. Une personne physique ne publie pas.
- **Page d'une publication** (`/accueil/publications/:id`) : rubrique, titre, auteur, date, visuel, actions, texte, sujets, commentaires (un niveau de réponses, modifier, supprimer, signaler).
- Les dates s'affichent en âge (« il y a 3 h », « hier ») jusqu'à une semaine, puis en date.

---

## 7. Univers École

### 7.1 Page École — `/ecoles`
Recherche (établissement ou formation, ville), puis une rangée par type (IPES, CFP, Autres établissements, Auto-écoles) avec leurs 4 premières vignettes et « Voir tout » ; une recherche montre tous les résultats. Recherche et ville dans l'adresse.

### 7.2 Listes IPES, CFP, Autres — `/ecoles/:type`
En-tête (titre, introduction, pilules des types avec leur nombre), filtres **Ville, Diplôme, Domaine, Cours** (cases à cocher avec le nombre de résultats ; panneau plein écran sur téléphone) et « Établissement vérifié », tri (Pertinence, Les mieux notés, Le plus de formations, Nom), vignettes, pagination (« 1 – 10 sur N »). Filtres, tri et page sont dans l'adresse.

### 7.3 Fiche d'un établissement — `/ecoles/:type/etablissement/:id/:onglet?`
En-tête : couverture, logo, nom, type et lieu, « Établissement vérifié », note, nombre de formations ; Contacter, Ajouter aux favoris, Partager. Colonne de droite : contacter l'établissement (Appeler, WhatsApp), autres établissements du même type.

| Onglet | Segment | Contenu |
|---|---|---|
| **Aperçu** | — | vidéo de présentation, présentation, informations clés, principales filières, dernière actualité |
| **Formations** | `formations` | formations publiées, filtres par diplôme et cours |
| **Informations** | `informations` | présentation, conditions d'admission, calendrier, actualités, documents à télécharger, FAQ, contact et localisation |
| **Avis** | `avis` | profils (Tous, Étudiants, Anciens étudiants, Entreprises), résumé des notes, avis triés, Utile, réponse de l'établissement, « Donner mon avis » |
| **Galerie** | `galerie` | vidéos, albums et médias ajoutés, dans la visionneuse |

### 7.4 Formation — `/ecoles/formations/:id/:onglet?`
En-tête (photo, établissement, nom, diplôme, cours, rentrée), onglets **Détails** · **Programme** (`programme`) · **Conditions d'admission** (`admission`) · **Débouchés** (`debouches`) ; à droite : l'établissement, prochaine rentrée, autres formations. Plus aucune mention des frais (décision du 2026-11-27).

### 7.5 Auto-écoles — `/ecoles/auto-ecoles`
Même gabarit que les listes : filtres **Permis** et **Ville**, carte « **Les permis** » (une tuile par permis : code, nom, durée, âge minimum ; une tuile se coche comme le filtre), tri (Pertinence, Les mieux notées, Nom, Les plus anciennes), vignettes (permis et année de création), pagination.

### 7.6 Fiche d'une auto-école — `/ecoles/auto-ecoles/:id/:onglet?`
En-tête : couverture, logo, nom, « Auto-école · ville, quartier (région) », « Agréée », note, « Depuis 2014 » ; Contacter, Ajouter aux favoris, Partager. Colonne de droite : **Contact & accès** (adresse, téléphone, e-mail, site, Appeler, Voir sur la carte) et **Pourquoi nous choisir ?**.

| Onglet | Segment | Contenu |
|---|---|---|
| **Aperçu** | — | présentation, 4 repères (création, localisation, horaires, statut), permis proposés (liens vers leur page), galerie de 6 photos |
| **Formations & Permis** | `formations` | puces Catégorie de permis et Type de formation, une ligne par permis (photo, durée, prix, Voir les détails) |
| **Tarifs** | `tarifs` | une carte par permis (formation complète, prix), ce que comprend le tarif, modalités de paiement |
| **Planning** | `planning` | puces Catégorie, prochaines sessions (tableau ; cartes sur téléphone), prochaine rentrée, bon à savoir |
| **Galerie** | `galerie` | photos et vidéos, dans la visionneuse |
| **Avis** | `avis` | résumé des notes, avis triés (Les plus récents, Les mieux notés), Utile, Partager, Signaler (motif), « Donner mon avis » |

Un seul prix par permis (table `permis`), partout (décision du 2026-11-28).

### 7.7 Page d'un permis — `/ecoles/auto-ecoles/:id/permis/:code/:onglet?`
Gabarit des fiches (pas de planche dans le canevas) : « Permis B – Véhicule léger », l'auto-école, durée, âge minimum, prix ; Ajouter aux favoris, Partager. Onglets **Aperçu** (présentation, programme, conditions) · **Programme** · **Conditions** · **Tarifs** · **Planning** ; à droite : le prix et ce qu'il comprend, Contact & accès. Un permis que l'auto-école ne propose pas ramène à son onglet Formations & Permis.

### 7.8 Avis
« Donner mon avis » ouvre une fenêtre : note globale (1 à 5), notes par critère facultatives, commentaire d'au moins 10 caractères, confirmation d'avoir suivi une formation. L'avis s'enregistre et s'affiche en tête ; message « Merci ! Votre avis sera publié après vérification par YIBOLO. ». L'établissement connecté répond aux avis de sa fiche.

### 7.9 Favoris — `/favoris`
Le cœur (vignettes) et « Ajouter aux favoris » (fiches) ajoutent ou retirent un favori ; dossiers Mes formations, Mes établissements, À comparer. La page « Mes favoris » (personne physique) : filtres Tous · Formations · Établissements avec leur nombre, retirer, tout supprimer.

---

## 8. Compte de la personne physique

- **Mon profil** (`/profil`) : civilité, prénom, nom, nationalité, date de naissance, téléphone (WhatsApp, un nouveau numéro est confirmé par code), e-mail, résidence, photo (enregistrée dès qu'elle est choisie).
- **Paramètres** (`/parametres`) : notifications par sujet et par canal (Application, SMS, E-mail), mot de passe (8 caractères, une majuscule, un chiffre, un caractère spécial), langue, suppression du compte.
- **Notifications** (`/notifications`) : Toutes / Non lues, « Nouvelles » puis « Plus tôt », marquer lue / non lue, supprimer, tout marquer comme lu.
- Réservé au rôle `utilisateur` : un visiteur va à la connexion, une école à son espace pro.

---

## 9. Espace professionnel École — `/pro/ecole`

Un seul espace pour les IPES, CFP et Autres. Cadre : barre du haut du site, menu de l'établissement dans une carte de 240 px (photo, nom, type, « Établissement vérifié », « Voir ma page publique », 6 menus) ; tiroir sur téléphone.

| Menu | Adresse | Contenu |
|---|---|---|
| **Tableau de bord** | `/pro/ecole` | chiffres clés, « À faire », complétude du profil, aperçu de la page publique, raccourcis |
| **Profil de l'établissement** | `/pro/ecole/profil/:onglet?` | Informations générales · Coordonnées (`coordonnees`, site web ; sans site : fenêtre « Pas encore de site web ? ») · Agrément & documents (`agrement` : accords de création et d'ouverture, NIU) · Médias (`medias` : logo, photos, vidéos) |
| **Formations** › Gérer | `/pro/ecole/formations` | tableau (formation, filière, diplôme, durée, prochaine rentrée, statut Publiée / Brouillon, actions), recherche, filière, tri, puces de statut, pagination |
| **Formations** › Créer | `/pro/ecole/formations/nouvelle` · `…/:id/modifier` | nom composé à partir de la nomenclature (diplôme, secteur, domaine, spécialité, option), organisation, description ; progression, « Bon à savoir », aperçu ; « Enregistrer et continuer » (publiée) ou « Enregistrer en brouillon » |
| **Contenus et informations** | `/pro/ecole/contenus/:onglet?` | Présentation · Actualités (`actualites`, publication, page « Voir ma publication ») · Documents (`documents`, liste de contrôle des documents attendus, importer, remplacer) · FAQ (`faq`, catégories, ajouter une question) |
| **Statistiques** | `/pro/ecole/statistiques` | période (7 jours, 30 jours, 6 mois), vues, téléchargements, note, évolution des visites, sources, formations les plus consultées, dernières activités, export PDF (impression) ; tout est mesuré (table `evenements`) |
| **Paramètres** | `/pro/ecole/parametres/:onglet?` | Compte · Sécurité (`securite`) · Notifications · Préférences · Utilisateurs (`utilisateurs`, « Inviter un utilisateur ») · À propos (`a-propos`) |

---

## 10. Pages masquées

Masquées le 2026-11-25 à la demande du porteur du projet (code gardé, sans adresse ; à refaire d'après le canevas si elles reviennent) : **préinscription** à une formation (4 étapes), **inscription en auto-école** (3 étapes) et sa modification, **Mon espace** (Aperçu, Mes préinscriptions, Mes permis, Mes avis) et ses dossiers.

---

## 11. Consultation et Emploi — `/consultation`, `/emploi`

Page « bientôt disponible », avec « Explorer les écoles ». **À venir (maquette : « CONSULTATION ») :** espace professionnel du consultant en 11 menus (Tableau de bord, Mon profil, Mes services, Agenda et rendez-vous, Salle de consultation, Demande de prestation, Mes clients, Revenus et paiements, Avis & réputation, Statistiques, Paramètres), puis l'espace public. Rien n'est commencé ; à confirmer par le porteur du projet.

---

## 12. Écrans d'erreur et états

- **Adresse inconnue** et **identifiant inconnu** (établissement, formation, auto-école, permis) : « Page introuvable », avec un retour.
- **Page qui plante** : « Une erreur est survenue » dans le cadre, menu conservé.
- **Page qui ne se télécharge pas** : « Pas de connexion internet », avec « Réessayer » ; bandeau en bas de l'écran quand la connexion est coupée.
- **Bloc de données en erreur** : « Réessayer » à la place du bloc ; **liste vide** : message et action (« Réinitialiser les filtres »).
- **Chargement** : squelettes de la même forme que le contenu.

---

## 13. Ce qui est simulé

- **Pas de serveur** : tout est enregistré dans la base du navigateur (IndexedDB) ; vider les données du site remet les données de départ.
- **Code par SMS** : affiché à l'écran.
- Toutes les actions sont réelles : vidéo (lecteur), carte (Google Maps), WhatsApp (wa.me), partage (feuille du téléphone ou lien copié), fichiers joints (enregistrés dans la base), export PDF (impression).
