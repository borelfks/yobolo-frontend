# YIBOLO — Cahier des charges (front-end)

> Référence fonctionnelle de l'interface : **ce que fait l'application, écran par écran**.
> Il décrit l'état réel de la démonstration (front seul, données fictives). La source de vérité visuelle reste la **maquette Word du client** (`C:\Users\USER\Documents\yibolo\NOUVEAU DESIGN YIBOLO.docx`).
>
> Documents liés : [DESIGN.md](DESIGN.md) (apparence), [DECISIONS.md](DECISIONS.md) (historique des choix et points à revoir), [.claude/rules/](../.claude/rules/) (règles détaillées pour coder), [README.md](../README.md) (démarrer le projet).

---

## 1. Présentation

**YIBOLO** est la plateforme de **formation, d'expertise et d'emploi en Afrique centrale**. Sa devise : **Apprendre · Former · Consulter · Travailler**. Elle réunit quatre univers :

| Univers | Pour qui | Dans ce dépôt |
|---|---|---|
| **École** | trouver un établissement, une formation, une auto-école ; se préinscrire ou s'inscrire | **réalisé** |
| **Consultation** | consulter un expert (consultant, formateur, conseiller) | page « bientôt disponible » |
| **Métiers** | découvrir les métiers et les compétences clés | lien vers la page Emploi (« bientôt disponible ») |
| **Emploi** | offres d'emploi, de stage et d'apprentissage | page « bientôt disponible » |

**Ce dépôt est un front seul** : il transforme la maquette du client en interface qui fonctionne. Toutes les données sont fictives (`src/mocks/`), aucun serveur n'est appelé.

**Marché :** Cameroun (10 régions, Yaoundé et Douala en tête). Interface en **français** (référence) et en **anglais britannique**, montants en **FCFA**.

---

## 2. Principe de fonctionnement (repris de la maquette)

La maquette distingue **deux espaces totalement différents** pour chaque type d'établissement :

1. **L'espace professionnel** : l'établissement y **renseigne et actualise** ses informations (profil, formations, contenus).
2. **L'espace public** : les visiteurs, étudiants, candidats et parents y **cherchent** des établissements et des formations.

Une modification faite par l'établissement dans son espace pro doit être **répercutée sur sa fiche publique**, éventuellement **après validation par YIBOLO** pour les informations sensibles ou réglementaires.

Dans la démo, les deux espaces ne sont pas reliés : une modification dans l'espace pro affiche un message (« Formation envoyée pour validation par YIBOLO », « Modifications enregistrées ») mais **ne change pas** la fiche publique.

---

## 3. Vocabulaire

| Mot | Sens |
|---|---|
| **École** | l'univers « formation » de YIBOLO (menu « École ») |
| **Établissement** | un IPES, un CFP ou un « Autre » établissement de formation |
| **IPES** | Institut Privé d'Enseignement Supérieur |
| **CFP** | Centre de Formation Professionnelle |
| **Autres** | autres établissements (langues, informatique, arts…) |
| **Auto-école** | école de conduite ; badge **« Agréée »** |
| **Formation** | un cursus d'un établissement (ex. « BTS Comptabilité & Gestion ») |
| **Filière** · **Diplôme** | domaine d'une formation · titre obtenu (BTS, Licence, Master…) |
| **Préinscription** | demande d'une place dans une **formation** (IPES, CFP, Autres), en 4 étapes |
| **Inscription** | demande d'une place pour un **permis** dans une auto-école, en 3 étapes ; aussi la création d'un compte YIBOLO |
| **Permis A, B, C, D** | catégories de permis de conduire (E existe dans les données, pas dans la maquette) |
| **Favoris** | formations, établissements, auto-écoles ou permis gardés par l'utilisateur, rangés en dossiers |
| **Avis** | note et commentaire d'un apprenant sur un établissement ou une auto-école |
| **Espace professionnel** | l'espace de gestion de l'établissement (`/pro/ecole`) |
| **Établissement vérifié** | badge vert donné aux établissements contrôlés par YIBOLO |

Mots anglais : voir le glossaire de [.claude/rules/traduction.md](../.claude/rules/traduction.md).

---

## 4. Comptes et accès

### Profils à l'inscription
La maquette prévoit **4 profils** : **École / IPES** (institut, centre, auto-école…), **Consultant**, **Entreprise**, **Personne physique** (candidat, étudiant, demandeur d'emploi).

### Comptes de démonstration (`src/mocks/demoAccounts.ts`)
| Rôle (`Role`) | Nom | Première page | Espace |
|---|---|---|---|
| `utilisateur` | Jean Dupont | `/ecoles` | pages publiques |
| `ipes` | IPC Yaoundé (établissement `ipc`) | `/pro/ecole` | espace pro « IPES » |
| `cfp` | CFP du BTP (établissement `cfp-btp`) | `/pro/ecole` | espace pro « CFP » |
| `autre` | Centre Linguistique (établissement `langues`) | `/pro/ecole` | espace pro « Autre » |

- **Un compte = un espace.** Les trois comptes école partagent **le même espace pro** ; seuls le nom, le type affiché (« Espace professionnel – IPES / CFP / Autre ») et les données de l'établissement changent (`useMonEcole`).
- **Garde de l'espace pro** : un compte sans établissement (`ecoleId`) qui ouvre `/pro/ecole…` est renvoyé vers `/connexion?espace=ecole`.
- Les pages publiques sont ouvertes à tous, connecté ou non (préinscription et favoris compris).
- À la première visite, la session démarre avec le compte **Utilisateur**. Après « Se déconnecter », on arrive sur la connexion.
- La session est gardée dans le navigateur (`yibolo:role`).

### Menu du compte (avatar)
- Compte école : **Mon espace professionnel** · Mes favoris · Changer de compte de démo · Se déconnecter.
- Utilisateur : Mes favoris · **Donner un avis** · Changer de compte de démo · Se déconnecter.
- La cloche ouvre 3 notifications de démonstration ; dans l'espace pro, « Voir toutes les notifications » mène à Paramètres › Notifications.

---

## 5. Inscription et connexion (maquette : « INSCRIPTION »)

| Écran | Adresse | Contenu |
|---|---|---|
| **Connexion** | `/connexion` | Panneau bleu avec photo et 4 atouts (« Écoles et formations certifiées », « Consultants et experts qualifiés »…), carte blanche : e-mail ou téléphone, mot de passe (afficher / masquer), « Se souvenir de moi », « Mot de passe oublié ? » (message), « Se connecter », « Créer un compte », « Continuer sans compte ». Sous la carte : choix du **compte de démonstration**. |
| **Créer un compte** | `/inscription` | Étapes **Profil → Infos → Vérification → Terminé**. |

**Créer un compte :**
1. **Profil** : 4 cartes (École / IPES, Consultant, Entreprise, Personne physique).
2. **Infos** (« Informations générales ») : raison sociale / nom et prénoms, téléphone, e-mail, région, ville, quartier, mot de passe (8 caractères au moins) et confirmation. Champs **préremplis** avec les valeurs de la maquette (IPC). Validation react-hook-form + zod.
3. **Vérification** : documents à joindre. Personne physique : pièce d'identité. Autres profils : autorisation d'ouverture (école) ou justificatif d'activité, et NIU. Bouton « Soumettre pour vérification ».
4. **« Votre compte est en cours de vérification »** : délai 24 à 48 heures, notification par e-mail et SMS, « Retour à la connexion ». Lien de démo « Simuler la validation par YIBOLO ».
5. **« Compte validé ! »** : « Se connecter à mon espace » ouvre le compte IPES (profil École) ou Utilisateur (autres profils).

---

## 6. Accueil (maquette : « ACCUEIL ») — `/`

- **Bandeau** : « Formez-vous, trouvez un expert, développez votre carrière ! », trois atouts (Établissements vérifiés · Experts certifiés · Opportunités réelles), photo à droite.
- **4 cartes d'univers** : École (`/ecoles`), Consultant (`/consultation`), Métiers et Emploi (`/emploi`).
- **« Rechercher sur YIBOLO »** : Localisation, École, Consultant, Métiers + bouton jaune « Rechercher » (mène à `/ecoles`).
- **« Nos recommandations »** : onglets Écoles · Consultants · Métiers · Emplois ; 4 cartes (IPC, Me Alain Tchana, Mécanicien automobile, Moniteur(trice) de conduite). Les onglets changent l'onglet actif mais pas les cartes.

---

## 7. Univers École (maquette : « ECOLE »)

Le menu École comprend : **IPES**, **CFP**, **Auto-écoles** et **Autres**. IPES, CFP et Autres partagent **le même gabarit** ; les auto-écoles ont leurs propres écrans (§ 8).

### 7.1 Annuaire École — `/ecoles`
- Bandeau « Écoles & Centres de formation ».
- **5 tuiles** : Toutes les écoles (1 248), IPES (532), CFP (286), Auto-écoles (126), Autres (304).
- « Rechercher une école » (localisation, type d'école) ; la recherche filtre les cartes par nom.
- « 1 248 établissements trouvés » : cartes d'établissement (les 4 de la maquette d'abord), pagination de démonstration.

### 7.2 Espace public d'un type (IPES, CFP, Autres) — `/ecoles/:type/:onglet?`
`:type` = `ipes`, `cfp` ou `autres`. La maquette prévoit **7 menus**, faits en onglets portés par l'adresse :

| Onglet | Adresse | Contenu |
|---|---|---|
| **IPES** (ou CFP, Autres) | `/ecoles/ipes` | liste des établissements du type, recherche, formations populaires |
| **Filières** | `…/filieres` | domaines de formation (liste à gauche), cartes de filières, recherche |
| **Diplômes** | `…/diplomes` | niveaux de diplôme, diplômes disponibles |
| **Régions** | `…/regions` | les 10 régions du Cameroun, établissements par région |
| **Villes** | `…/villes` | villes par région, nombre d'établissements |
| **Frais** | `…/frais` | formations et frais, filtre par tranche (moins de 250 000 FCFA … plus de 1 000 000 FCFA) |
| **Cours (Jour/Soir)** | `…/cours` | formations par mode de cours (Jour, Soir, Jour & Soir) |

Chaque carte d'établissement mène à sa fiche (« Voir les informations »).

### 7.3 Fiche d'un établissement — `/ecoles/:type/etablissement/:id/:onglet?`
En-tête : photo du bâtiment, nom, badge « Établissement vérifié », type, ville, note, boutons (favori…). Onglets :

| Onglet | Adresse | Contenu |
|---|---|---|
| **Aperçu** | `…/etablissement/ipc` | vidéo de présentation (message), présentation, filières principales, formations, contact |
| **Formations (12)** | `…/formations` | formations de l'établissement : diplôme, mode de cours, frais |
| **Informations** | `…/informations` | Présentation · Conditions d'admission · Frais & paiements · Calendrier académique · Contact & localisation |
| **Avis (286)** | `…/avis` | note globale, répartition, filtres (Tous, Étudiants, Anciens étudiants, Entreprises), avis, « Donner mon avis » |
| **Galerie** | `…/galerie` | albums photos |

### 7.4 Détail d'une formation — `/ecoles/formations/:id/:onglet?`
Depuis une formation, l'utilisateur peut **Préinscrire maintenant**, **Ajouter aux favoris** ou contacter l'établissement. La maquette prévoit **5 menus** :

| Onglet | Adresse | Contenu |
|---|---|---|
| **Détails** | `/ecoles/formations/f-cg-ipc` | diplôme, durée, cours, frais ; présentation, objectifs, métiers |
| **Programme** | `…/programme` | aperçu et programme détaillé par semestre |
| **Conditions d'admission** | `…/admission` | conditions, pièces à fournir |
| **Frais & paiement** | `…/frais` | frais d'inscription et de formation, ce que couvrent les frais, modalités (remise de 5 % en une fois) |
| **Débouchés** | `…/debouches` | métiers accessibles, secteurs qui recrutent, évolution de carrière |

Colonne de droite : l'établissement (badge vérifié), prochaine rentrée, actions.

### 7.5 Préinscription — `/ecoles/formations/:id/preinscription`
**4 étapes**, avec un indicateur cliquable pour revenir en arrière :
1. **Informations personnelles**
2. **Parcours scolaire** (dernier diplôme, série / spécialité, année, établissement d'origine)
3. **Pièces à fournir** : CNI ou acte de naissance, dernier diplôme, relevé de notes, photo d'identité
4. **Validation** : récapitulatif par bloc, avec « Modifier » qui ramène à l'étape concernée

Envoi → « Préinscription envoyée ! », avec « Retour à l'établissement » ou « Continuer à explorer » (annuaire École). Rien n'est enregistré.

### 7.6 Ajouter aux favoris
Un cœur sur les cartes, les formations et les fiches ajoute ou retire un favori (message « Ajouté à vos favoris », avec le dossier). Côté auto-école, une fenêtre permet de **choisir un dossier** (facultatif).

---

## 8. Auto-écoles (maquette : « AUTO ECOLE »)

Quels que soient les filtres, l'objectif de l'utilisateur est double : **voir le profil** ou **s'inscrire**.

### 8.1 Liste — `/ecoles/auto-ecoles`
- Bandeau « Trouvez une auto-école agréée près de chez vous… ».
- Filtres : **type de permis** (Tous, A, B, C, D, E), région, recherche par nom ; « Réinitialiser les filtres ».
- « Auto-Écoles trouvées : 42 » (chiffre de la maquette ; le vrai nombre quand un filtre est actif).
- Chaque carte : note, quartier, permis proposés, **Voir le profil** et **S'inscrire** (permis B par défaut).

### 8.2 Fiche d'une auto-école — `/ecoles/auto-ecoles/:id/:onglet?`
En-tête : logo, nom, badge **« Agréée »**, note, ville et quartier. La maquette prévoit **6 menus** :

| Onglet | Adresse | Contenu |
|---|---|---|
| **Aperçu** | `/ecoles/auto-ecoles/conduite-plus` | présentation, pourquoi nous choisir, permis proposés, prochaines sessions, contact & accès |
| **Formation & Permis** | `…/formations` | les catégories de permis A à D, chacune menant à sa page |
| **Tarifs** | `…/tarifs` | tarifs par permis, ce que comprend le tarif, modalités de paiement |
| **Planning** | `…/planning` | prochaines sessions : permis, date de début, horaires, durée, places |
| **Galerie** | `…/galerie` | centre, véhicules, cours, examens |
| **Avis (286)** | `…/avis` | note globale, critères, répartition, avis, « Donner mon avis » |

### 8.3 Page d'un permis — `/ecoles/auto-ecoles/:id/permis/:code/:onglet?`
Permis **A, B, C, D** (textes repris des pages de la maquette). Onglets : **Aperçu**, **Programme**, **Conditions**, **Tarifs**, **Planning**. Parcours en 4 temps : Code de la route → Conduite pratique → Sécurité routière → Préparation à l'examen. Bouton « S'inscrire maintenant ».

**Contradiction gardée volontairement :** le prix d'un permis n'est pas le même partout dans la maquette (ex. permis A : 250 000 FCFA dans les listes, 150 000 FCFA sur sa page ; permis C : 450 000 / 500 000 FCFA). Chaque écran affiche **le chiffre de sa capture**.

### 8.4 Inscription — `/ecoles/auto-ecoles/:id/permis/:code/inscription`
**3 étapes** :
1. **Mes informations** : nom, prénom, date de naissance, sexe, téléphone, e-mail, ville, quartier.
2. **Pièces à fournir** : copie de la CNI, 2 photos d'identité, certificat médical d'aptitude à la conduite.
3. **Validation** : récapitulatif (formation, informations, pièces) avec « Modifier », case de certification obligatoire.

Envoi → « Demande envoyée ! ». Le brouillon est gardé dans le navigateur, par auto-école et par permis (`useInscriptionDraft`).

### 8.5 Modifier l'inscription — `…/inscription/modifier/:section`
Trois sections, ouvertes depuis la validation : `formation` (changer d'auto-école, de permis, de session), `infos` (informations personnelles), `pieces` (remplacer une pièce). « Enregistrer » revient à l'inscription.

---

## 9. Avis et favoris

### Donner un avis — `/ecoles/:type/etablissement/:id/avis/nouveau` · `/ecoles/auto-ecoles/:id/avis/nouveau`
- **Note globale** (1 à 5 étoiles : Décevant, Moyen, Bien, Très bien, Excellent), notes par critère **facultatives** (auto-école : qualité de la formation, compétence des moniteurs, organisation & planning, infrastructures & véhicules, accueil & accompagnement ; établissement : qualité des enseignements, compétence des enseignants, organisation & administration, infrastructures & équipements, insertion professionnelle), commentaire.
- Le commentaire compte **au moins 10 caractères** ; il faut **confirmer avoir suivi une formation** dans l'établissement.
- « Publier mon avis » : « Merci ! Votre avis sera publié après vérification par YIBOLO. », retour aux avis. L'avis sera marqué « Vérifié » après validation par YIBOLO. Dans la démo, il n'est pas ajouté à la liste.

### Mes favoris — `/favoris`
- Filtres : Tous les favoris · Formations · Établissements, avec leur nombre.
- Dossiers : Mes formations, Mes établissements, À comparer.
- Retirer un favori, tout supprimer.
- Favoris de départ : 2 formations de l'IPC et l'IPC. Gardés dans le navigateur (`yibolo:favorites`).

---

## 10. Espace professionnel École — `/pro/ecole`

Un seul espace pour les **IPES, CFP et Autres**. Cadre : barre du haut (logo, « Espace professionnel – IPES », cloche, aide, compte) et **barre latérale bleu nuit** : établissement (photo, nom, « Établissement vérifié »), **6 menus**, bouton « Assistance YIBOLO ».

| Menu | Adresse | Contenu |
|---|---|---|
| **Tableau de bord** | `/pro/ecole` | « Bienvenue sur votre espace professionnel », chiffres (formations, filières, avis, photos / vidéos), complétude du profil, **informations à gérer** (Présentation, Conditions d'admission, Frais & paiement, Calendrier académique, Débouchés, Contact & localisation), actions rapides |
| **Profil de l'établissement** | `/pro/ecole/profil/:onglet?` | Informations générales (bannière, statut et visibilité, chiffres clés) · **Coordonnées** (`coordonnees`, avec aperçu de la page publique) · **Agrément & documents** (`agrement`) · **Médias** (`medias` : logo, photos, vidéo) |
| **Formations** › Gérer les formations | `/pro/ecole/formations` | tableau : formation, filière, diplôme, durée, prochaine rentrée, statut (**Publiée**, **En attente**, **Brouillon**), actions ; filtres, tri, pagination |
| **Formations** › Créer une formation | `/pro/ecole/formations/nouvelle` · `…/:id/modifier` | 4 blocs : Informations générales, Organisation, Frais, Description ; « Enregistrer et continuer » (envoi pour validation par YIBOLO), « Enregistrer en brouillon », « Aperçu », « Annuler » |
| **Contenus et informations** | `/pro/ecole/contenus/:onglet?` | Présentation · **Actualités** (`actualites`, nouvelle actualité, page « Voir ma publication » `…/actualites/:id`) · **Documents** à télécharger (`documents`) · **FAQ** (`faq`, ajouter une question) |
| **Statistiques** | `/pro/ecole/statistiques` | période (7 jours, 30 jours, 6 mois), évolution des visites, sources des visites, formations les plus consultées, dernières activités, export PDF (message) |
| **Paramètres** | `/pro/ecole/parametres/:section?` | Compte et accès · Sécurité (mot de passe avec 4 critères, 2FA, sessions, activité) · Notifications · Préférences · **Utilisateurs** (`utilisateurs`, rôles, « Inviter un utilisateur » `…/utilisateurs/inviter`) · À propos |

Dans la barre latérale, **Formations** et **Contenus et informations** ont des sous-menus (comme sur la maquette) : Gérer les formations / Créer une formation ; Contenus & actualités / Documents à télécharger / FAQ.

---

## 11. Consultation et Emploi — `/consultation`, `/emploi`

Page « **Consultation — bientôt disponible** » (ou Emploi) : « Cette démonstration couvre l'univers École… », bouton « Explorer les écoles ».

**À venir (maquette : « CONSULTATION », environ 72 captures) :** espace professionnel du consultant en **11 menus** : Tableau de bord, Mon profil (Aperçu, Expertises, Services & Tarifs, Expériences, Avis, Documents ; « Ajouter une expertise » en 4 étapes : Détail, Compétences, Justificatifs, Validation), Mes services, Agenda et rendez-vous, Salle de consultation, Demande de prestation, Mes clients (planifier une prestation en 4 étapes : Cadrage, Planning, Ressources, Validation ; message, document, dossier complet, rejoindre la salle), Revenus et paiements, Avis & réputation, Statistiques, Paramètres ; puis l'espace public. Rien n'est commencé.

---

## 12. Écrans d'erreur

- **Adresse inconnue** : page « 404 — Page introuvable » dans le cadre public, avec « Retour à l'accueil ».
- **Page qui plante** : « Une erreur est survenue » (recharger, retour à l'accueil), dans le cadre, menu conservé.
- **Page qui ne peut pas se télécharger** (réseau coupé) : « Pas de connexion internet », avec « Réessayer ».
- **Identifiant inconnu** (établissement, formation, auto-école) : la page affiche **le premier élément des données** au lieu d'un message « introuvable » (voir [DECISIONS.md › À faire plus tard](DECISIONS.md#2-à-faire-plus-tard)).

---

## 13. Ce qui est simulé

- Les **envois** (préinscription, inscription, avis, formation, actualité, paramètres, invitation) affichent un message de réussite ; **rien n'est enregistré**, sauf les favoris, la session, la langue et le brouillon d'inscription en auto-école.
- Les actions secondaires (vidéo, carte, partager, dupliquer, export PDF, WhatsApp…) affichent un message « (démo) ».
- Les chiffres (1 248 établissements, 532 IPES, 286 avis…) sont **ceux de la maquette**, pas des calculs.
- Les notifications sont fixes (3 dans la cloche, 5 dans Paramètres › Notifications).
