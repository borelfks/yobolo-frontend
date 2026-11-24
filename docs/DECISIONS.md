# YIBOLO — Décisions

> Ce qui a été décidé, quand, et pourquoi, plus **tout ce qu'il faudra faire ou revoir plus tard**.
> Une décision récente remplace une décision plus ancienne sur le même sujet. Le cahier des charges ([SPECIFICATIONS.md](SPECIFICATIONS.md)) décrit toujours l'état à jour.

---

## 1. Journal des décisions

### Produit et périmètre

| Date | Décision | Pourquoi / remarque |
|---|---|---|
| 2026-11-16 | **yibolo-frontend est un front seul** : aucun backend, aucun client d'API, pas d'Orval. Toutes les données viennent de `src/mocks/`. **Ne pas proposer de brancher le backend.** | Le porteur du projet a refusé l'approche mixte (brancher yibolo-backend). Le client veut voir sa maquette devenir une interface qui fonctionne. |
| 2026-11-17 | **Périmètre : univers École uniquement** : IPES, CFP et Autres sur le même gabarit, et auto-écoles. **Un seul espace pro** partagé par les IPES, CFP et Autres. Consultation et Emploi = page « bientôt disponible ». | Livrer d'abord un univers complet. |
| 2026-11-17 | **Les écrans doivent être identiques à la maquette** (« ça doit être identique ») : photos découpées de la maquette (aujourd'hui dans `public/images/maquette/`), textes et chiffres recopiés de chaque capture. **Les contradictions de la maquette** (prix des permis entre liste et détail, modes de formation) **sont gardées telles quelles**, écran par écran. | La maquette du client est la référence ; on ne la réinterprète pas. |
| 2026-11-18 | Univers École réalisé, fidèle à la maquette, avec des données de démonstration (premier commit). | — |
| 2026-11-21 | **La landing (`/`) est une copie exacte de celle de yibolo-client** (`features/home` : héro, recherche, cinq services, quatre arguments, en-tête flottant, pied de page), avec **ses photos** (Unsplash, licence libre, téléchargées dans `public/images/accueil/`) et **son style** (police Geist, couleurs, espacement de 0,3 rem, appliqués seulement sous `.theme-client`). Elle remplace l'accueil de la maquette Word. Les cartes Formations, Bibliothèque et les liens Aide, Conditions mènent à une page « bientôt disponible ». | Demande du porteur du projet (« copie la landing page exactement… avec toutes les images… style tout »). Comparée pixel à pixel à yibolo-client : mêmes positions, mêmes tailles, en français et en anglais, à 1440 et 390 px. |

### Technique

| Date | Décision | Pourquoi / remarque |
|---|---|---|
| 2026-11 (départ) | Port de développement **5199** (`vite --port 5199`). | 5173 (yibolo-client) et 5180 (mboajuris-frontend) sont pris par d'autres projets. |
| 2026-11-21 | **Code réorganisé par fonctionnalité, sur le modèle d'Autopia** : `src/app/` (routes, cadres, styles), `src/features/<sujet>/` (pages, composants, hooks, logique), `src/shared/` (ce qui sert à plusieurs sujets), `src/mocks/` (données de démo), `src/assets/` (police, logo). Types du domaine dans `src/shared/types.ts`, adresses dans `ROUTES` (`src/shared/utils/routes.ts`), **TypeScript `strict`**. Documentation dans `docs/`, règles dans `.claude/rules/`, `CLAUDE.md` à la racine. | Même organisation que les autres projets du porteur, plus facile à reprendre. |
| 2026-11-21 | **Police Plus Jakarta Sans hébergée localement** (`src/assets/fonts/`), plus de chargement depuis Google Fonts. **Icônes d'application et manifeste** dans `public/` (`favicon.svg`, `icons/`, `site.webmanifest`). Photos déplacées de `public/maquette/` vers `public/images/maquette/`. | Fonctionne hors ligne, même rendu partout. |
| 2026-11-23 | **Données de test enregistrées dans une base SQLite dans le navigateur** (sql.js, gardée dans l'IndexedDB). Chaque testeur a sa propre base ; partage par **export / import** d'un fichier `.sqlite` (menu du compte › « Données de test »), et « Réinitialiser » revient aux données de départ. Tout passe par **une seule couche de données** (`src/data/`, contrat `DataSource`) pour **changer de stockage plus tard** (fichiers Netlify, Firebase, vrai backend) sans toucher aux écrans. Dépendance ajoutée : `sql.js`. | Le porteur du projet veut que l'équipe teste avec des données qui restent, sans backend pour le moment. Options étudiées : Firebase, json-server, fichiers Netlify (Netlify Blobs), Turso ; choix : SQLite dans le navigateur, « de sorte qu'on puisse changer plus tard ». Règles : [.claude/rules/donnees-et-backend.md](../.claude/rules/donnees-et-backend.md). |
| 2026-11-24 | **Inscription : seul le profil École / IPES est ouvert.** Les cartes Consultant, Entreprise et Personne physique restent affichées, grisées, avec « Bientôt disponible », et ne se choisissent pas. | Le porteur du projet : « c'est École qui doit marcher absolument ». Les autres profils suivront avec leurs univers. |
| 2026-11-24 | **Première visite : non connecté.** La session ne s'ouvre plus d'office avec le compte Utilisateur : la landing montre « Se connecter » → connexion → « Créer un compte » (choix du profil). | Le porteur du projet veut que la landing mène à la connexion et à la création de compte. La landing elle-même n'est pas modifiée. |
| 2026-11-24 | **Affichage sur téléphone et tablette corrigé** sans changer l'ordinateur : plus aucun débordement à 390, 768 et 1024 px ; à 1440 px, les écrans restent identiques au pixel près. | Demande du porteur du projet (« mobile responsive »). Sur demande, « Voir les formations » (cartes d'établissement) tient aussi sur une ligne, à toutes les largeurs (avant, il passait sur deux lignes, même à 1440 px). |
| 2026-11-24 | **Le logo de l'accueil partout** : symbole carré bleu (« Y » en coche), « Yibolo » et la devise « Apprendre · Évoluer · Réussir » (composant `Logo`), favicon et icônes d'application de yibolo-client. **Pied de page des pages publiques = la partie basse de celui de l'accueil** (logo et devise, Aide · Conditions, copyright), en bleu nuit et texte blanc, sans la vague ni la phrase de la marque : les colonnes École · Établissements · Mon compte et le contact disparaissent. | Demande du porteur du projet (« utilise le logo qui est à l'accueil comme logo partout », « le footer comme celui de l'accueil, juste la couleur qui change », puis « juste la petite partie, pas : Yibolo, plus qu’une plateforme… »). L'ancien logo redessiné d'après la maquette Word n'est plus utilisé. |
| 2026-11-24 | **Page de connexion refaite** sur la mise en page de la connexion de yibolo-client, **aux couleurs de l'application après connexion** (bleu YIBOLO, bleu nuit, Plus Jakarta Sans) : formulaire à gauche sur le fond des pages de l'application, photo de l'accueil à droite avec la phrase de la marque ; libellés visibles ; sur téléphone, le formulaire tout de suite. Textes ajoutés : « Heureux de vous revoir ! Connectez-vous pour retrouver votre espace. », « Retour à l’accueil ». | Le porteur du projet (« la page de connexion, tu peux mieux faire… », « fais ce qui te semble juste », puis « ça doit suivre les couleurs de la page après connexion »). Défauts de l'ancienne : bloc des comptes de démo qui débordait sur la photo, texte peu lisible sur la photo, formulaire sous le texte sur téléphone. S'éloigne du « grand cadre bleu » de la maquette Word. |
| 2026-11-24 | **Tout dans la base, rien en dur** : `src/mocks/` est supprimé. Les données de départ sont dans `src/data/depart/yibolo.sql` (42 tables : écoles, formations, auto-écoles, avis, régions, villes, permis, chiffres de l'espace pro, galeries…) ; les écrans lisent tout par `src/data/hooks.ts`. **Comptes dans la base** (table `comptes`) avec mot de passe haché : la connexion vérifie l'e-mail ou le téléphone et le mot de passe ; « Créer un compte » enregistre le compte (et son établissement pour le profil École), « en vérification » jusqu'à la validation simulée. Comptes de départ : `jean.dupont@exemple.cm` (Personne physique), `contact@ipc.cm` (École – IPES), `contact@cfp-btp.cm` (École – CFP), `contact@langues.cm` (École – Autre), tous avec le mot de passe `yibolo2026`. Plus de bloc « Compte de démonstration » à la connexion. | Demande du porteur du projet (« tout lié à SQLite, crée en BD, crée-moi les comptes, plus de mock », « tout doit être dynamique, je ne veux rien en dur »). Les bases des testeurs sont refaites une fois (`VERSION_DONNEES` = 2). |
| 2026-11-24 | **Tout fonctionne vraiment** : plus aucune action « (démo) ». Annuaires : recherche par critères (région, ville, filière via le domaine des formations, niveau, type), tri, pagination, compteurs calculés. Avis : tri, « Voir plus », « Utile », réponse de l'établissement, signalement, partage. Plan (Google Maps), WhatsApp, visionneuse photos / vidéos, impression PDF. Espace pro : dupliquer / publier / dépublier / renommer / supprimer, fichiers joints enregistrés (documents, pièces d'agrément, médias, bannière, logo, couverture), utilisateurs (rôle, activer, retirer), compte et sécurité réels, assistance. Connexion : mot de passe oublié (code affiché), « Se souvenir de moi ». Cloche : notifications du compte. Le traitement « spécial IPC » du code est remplacé par des champs de l'établissement (vignette, bannière, logo, agrément…). | Demande du porteur du projet (« tout doit marcher, même la connexion, tout je dis bien tout »). Limites sans serveur : le code de « mot de passe oublié » s'affiche au lieu d'un SMS ; les fichiers sont gardés dans la base du navigateur (3 Mo au plus). |
| 2026-11-24 | **Calculs cohérents** : chaque chiffre part de celui de la maquette et suit les actions des testeurs (maquette + ajouts − retraits). Avis : nombre, moyenne, répartition des étoiles et notes par critère (auto-école). Préinscription : candidatures et activité du jour de l'établissement, notification au candidat. Inscription en auto-école : une place de moins dans la session, notification. Formations créées, dupliquées, supprimées : nombre de formations de l'établissement (fiche, tableau de bord). Médias, téléchargements, avis à répondre. Une école inscrite n'apparaît et n'est comptée dans l'annuaire (tuiles, type, région, ville) qu'après validation par YIBOLO ; un changement de type, région ou ville la déplace dans les chiffres. Un établissement créé part de zéro (statistiques). Outils : `src/shared/utils/compteurs.ts`, `dateDeCreation()` (`src/data/index.ts`). | Demande du porteur du projet (« être cohérent, les calculs, tous »). |
| 2026-11-24 | **Accueil de l'utilisateur connecté** (`/accueil`) : copie de l'accueil connecté de yibolo-client (domaines d'expertise à gauche, fil en grille de cartes avec recherche, onglets, « Type », « Plus de filtres », « Mes enregistrés », « Les plus lues », bandeau, zone « Publier », raccourcis, offres d'emploi populaires, « Vous êtes expert ? », bande du bas), **aux couleurs de l'application** (bleu, bleu nuit, Plus Jakarta Sans) et avec les mesures de l'original (espacement de 0,3 rem sur la page). **Tout en base** : nouvelles tables `domainesExpertise`, `experts`, `publications`, `offresEmploi`, `enregistrements`, `jaimes`, `signalements`, `tachesAccueil` ; les formations du fil viennent de `formations` (champ `publieeLe` ajouté). Publier, enregistrer, aimer et signaler écrivent dans la base. **Un compte connecté qui ouvre `/` est mené à sa page d'arrivée** (`account.home` : `/accueil` pour l'utilisateur, `/pro/ecole` pour une école) ; le logo et « Accueil » y mènent aussi ; un visiteur voit toujours la landing. | Le porteur du projet : « l'utilisateur connecté ne doit plus retourner à l'accueil principal ; quand il est connecté, son accueil c'est ça : copie exactement l'accueil de l'utilisateur connecté de yibolo-client, rien en dur, tout en BD ». `VERSION_DONNEES` = 3. Pas encore réalisés (message « démo » ou page « bientôt disponible ») : commentaires, Ville, Conseils, Actualités, Mes notifications, Mon profil, offres (univers Emploi), images et vidéo des publications. |
| 2026-11-21 | « Se déconnecter » est gardé : après un rechargement, on reste visiteur (avant, on redevenait le compte Utilisateur). | Nécessaire pour voir la landing en visiteur, comme dans yibolo-client. |
| 2026-11-21 | **Traduction français / anglais** avec i18next : français par défaut et **référence**, anglais **britannique**, **un namespace par fonctionnalité**, clés **typées**, `npm run i18n:check`. Les données de démo restent en français (elles jouent le rôle du serveur). Règles : [.claude/rules/traduction.md](../.claude/rules/traduction.md). | Le Cameroun est bilingue ; le français reste identique à la maquette. |

### Prochaine étape envisagée

| Date | Décision |
|---|---|
| 2026-11-21 | Après l'univers École : l'**univers Consultation** (espace pro du consultant en 11 menus, environ 72 captures de la maquette). **À confirmer** par le porteur du projet avant de commencer. |

---

## 2. À faire plus tard

### Fidélité à la maquette
- [ ] Repasser chaque écran à côté de sa capture (1440 px) après la traduction, pour vérifier que **le français n'a pas bougé**.
- [ ] Remplacer les images de démonstration qui viennent encore d'internet (`photo()` → picsum.photos, `portrait()` → randomuser.me : comptes CFP et Autre, utilisateurs de l'espace pro) par des photos découpées de la maquette, si elle en contient. **À confirmer.**
- [ ] Faute « Comptabilté » dans la filière de deux formations de l'espace pro (table `formationsPro`, `src/data/depart/yibolo.sql`) : vient-elle de la maquette ? **À confirmer** avant de corriger.

### Code
- [ ] **Adresses écrites à la main** : beaucoup de liens utilisent encore des chaînes (`'/ecoles/…'`, `'/pro/ecole/…'`) au lieu de `ROUTES` (cadres, pied de page, `schoolLinks.tsx`, pages). Les remplacer, écran par écran.
- [ ] **Couleurs et tailles écrites à la main** (environ 240 couleurs `[#…]`, environ 600 tailles `text-[…px]`) : créer les jetons qui manquent dans `theme.css` (ex. bordure des champs `#c9d4ea`, fond bleu très clair `#eef3fc`) et les utiliser, **sans changer le rendu** (capture avant / après).
- [ ] **Élément introuvable** : `etablissementById`, `formationById`, `autoEcoleById`, `actualiteById` renvoient le premier élément quand l'identifiant est inconnu. Afficher plutôt « … introuvable » avec un lien utile. **À confirmer** (la maquette ne montre pas ce cas).
- [ ] **Formulaires** : seuls la connexion et l'inscription utilisent react-hook-form + zod ; les autres (préinscription, inscription en auto-école, avis, invitation, formation) vérifient à la main avec un message. Les passer sur react-hook-form + zod, avec des messages traduits.
- [ ] **Session** : après « Se déconnecter » puis un rechargement, la démo revient au compte Utilisateur (la valeur vide n'est pas gardée). Décider si un visiteur non connecté doit rester non connecté. **À confirmer.**
- [ ] Les **notifications** de la cloche sont écrites dans `AccountMenu.tsx` : les lire dans la table `notifications`.
- [ ] date-fns est installé mais pas utilisé : l'utiliser ou le retirer (avec accord).
- [x] Les menus des cadres (en-tête public, pied de page, espace pro) sont dans `src/app/layouts/navConfig.ts`, avec `ROUTES` et des clés de traduction (2026-11-21).

### Univers suivants
- [ ] **Consultation** : espace pro du consultant (11 menus : Tableau de bord, Mon profil, Mes services, Agenda et rendez-vous, Salle de consultation, Demande de prestation, Mes clients, Revenus et paiements, Avis & réputation, Statistiques, Paramètres), puis son espace public.
- [ ] **Emploi** et **Métiers** : pas encore dans la maquette lue. **À confirmer.**

---

## 3. Idées à étudier

- [ ] Relier l'espace pro et la fiche publique dans la démo (une formation créée apparaît sur la fiche), pour illustrer le principe « modification répercutée après validation par YIBOLO ».
- [ ] Un écran « validation par YIBOLO » (côté administrateur YIBOLO) : la maquette en parle mais ne le montre pas. **À confirmer.**

---

## 4. Points ouverts

1. **Espace pro des auto-écoles** : la maquette montre l'espace pro de l'IPES ; une auto-école a-t-elle le même espace ? **À confirmer.**
2. **Permis E** : présent dans les données (filtres de la liste), absent des pages de la maquette (A à D).
3. **Recherche de l'accueil** : elle mène toujours à `/ecoles`, quels que soient les choix (Consultant, Métiers). À revoir quand les autres univers existeront.
