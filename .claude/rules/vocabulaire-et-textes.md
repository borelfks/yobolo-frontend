# Vocabulaire et textes

## Règle d'or
- **Les textes viennent de la maquette, mot pour mot** : titres, boutons, libellés, phrases d'aide, chiffres. On ne reformule pas, on ne raccourcit pas, on n'« améliore » pas.
- Une faute visible dans la maquette ou dans les données : la **signaler**, ne pas la corriger sans accord.
- Un texte qui n'existe pas dans la maquette (message de réussite, erreur, état vide) : court, clair, dans le ton de la maquette, et **proposé** au porteur du projet.

## Ton
- **Français**, **vouvoiement** (« vous »), phrases courtes, mots simples.
- Guillemets français « … », apostrophe typographique ’ dans l'interface, espace insécable avant « : ; ! ? » comme dans la maquette.
- Tout texte visible passe par la traduction (voir [traduction.md](traduction.md)) ; le texte français du fichier JSON est **la copie exacte** du texte de la maquette.

## Mots de la maquette (interface ET code)
| À utiliser | Sens |
|---|---|
| École | l'univers « formation » (menu) |
| Établissement | un IPES, un CFP ou un « Autre » |
| IPES · CFP · Autres | Institut Privé d'Enseignement Supérieur · Centre de Formation Professionnelle · autres établissements |
| Auto-école (« Auto-Écoles » dans les fils d'Ariane de la maquette) | école de conduite |
| Formation · Filière · Diplôme | cursus · domaine · titre obtenu |
| Préinscription / **Préinscrire maintenant** | demande de place dans une formation |
| Inscription / **S'inscrire maintenant** | demande de place pour un permis (auto-école) ; aussi « Créer un compte » |
| Permis A, B, C, D | catégories de permis |
| Pièces à fournir | documents demandés |
| Favoris / **Ajouter aux favoris** / Mes favoris | éléments gardés par l'utilisateur |
| Avis / **Donner mon avis** | note et commentaire |
| Espace professionnel | gestion de l'établissement |
| Tableau de bord | première page de l'espace pro (c'est le mot de la maquette) |
| Établissement vérifié · Agréée | badges de confiance |
| Voir les informations · Voir le profil | ouvrir une fiche |

**Menus de l'espace pro (libellés exacts) :** Tableau de bord · Profil de l'établissement · Formations (Gérer les formations, Créer une formation) · Contenus et informations (Contenus & actualités, Documents à télécharger, FAQ (Questions fréquentes)) · Statistiques · Paramètres.

**Statuts d'une formation (libellés exacts) :** Publiée · Brouillon (plus de « En attente » : pas de validation par YIBOLO, décision du 2026-11-27).

**Modes de cours :** Jour · Soir · Jour & Soir (« Cours du jour », « Cours du soir »). Les modes affichés suivent la capture de chaque écran, même s'ils se contredisent.

## Où sont les textes
- Textes de l'interface : `locales/fr.json` et `locales/en.json` à côté de chaque partie de module (voir `traduction.md`).
- Libellés qui viennent des données (noms d'établissements, filières, villes, avis, actualités) : les fausses données (`src/data/fausses-donnees/`), en français, non traduits.
- Une valeur fixe affichée comme libellé (mode de cours, statut, nom d'un permis, rôle) se traduit **à l'affichage** avec une clé construite à partir de la valeur (voir [traduction.md](traduction.md)).

## Formats
- Montants : `fcfa(450000)` → « 450 000 FCFA ». Nombres : `num()`. Notes : `num(4.7)` → « 4,7 ».
- Dates : `formaterDate()` et `dateRelative()` (date-fns, voir [dates-et-nombres.md](dates-et-nombres.md)) ; les dates des données de démo (« 06 oct. 2026 », « Il y a 3 jours ») sont du texte recopié de la maquette, affiché traduit (`demoDate`).
- Plus de `toLocaleString('fr-FR')` dans le code : il ignore la langue choisie.
