# Design

Référence complète : [DESIGN.md](../../docs/DESIGN.md).

## Règles absolues
1. **Identique à la maquette.** Chaque écran reproduit sa capture : mise en page, photos, textes, chiffres, couleurs, icônes. Les contradictions entre deux captures (prix d'un permis, mode de cours) sont **gardées**, chaque écran suit **sa** capture. Ne rien « harmoniser » sans accord.
2. **Ordinateur d'abord** (la maquette est en largeur d'ordinateur, vérifier à **1440 px**), et **utilisable sur téléphone** (390 px), sans défilement horizontal.
3. **Pas de nouvelle couleur en dur.** Utiliser les jetons de `src/app/styles/theme.css` (`brand-…`, `navy-…`, `sun-…`, `page`, `ink`, `muted`, `line`) et la palette Tailwind pour les couleurs de sens (`emerald`, `amber`, `rose`, `violet`…). Une couleur de la maquette qui manque devient **un jeton**. Les ~240 valeurs `[#…]` existantes ne se recopient pas ailleurs.
4. **Une chose = un composant**, partout. Avant de dessiner un élément, chercher dans [composants.md](composants.md).
5. **Pas de mode sombre** (la maquette n'en a pas). Pas de variantes `dark:`.

## Couleurs et sens
- Bleu `brand-600` : bouton principal, onglet actif, liens, icônes. Survol : `brand-700`.
- Bleu nuit `navy-800` / `navy-900` : menu actif public, bandeau de recherche, barre latérale de l'espace pro, titres.
- Jaune `sun-400` : **« Rechercher »**, « Préinscrire » et quelques accents (soulignement du titre de l'accueil).
- Vert `emerald` : « Établissement vérifié », « Agréée », « Publiée », réussite. Orange/ambre : « En attente », attention. Rouge `rose` : erreur, suppression, compteur. Gris : « Brouillon », neutre.
- Étoiles : `amber-400`, pleines ; vides en `slate-200`.

## Typographie
- Police **Plus Jakarta Sans**, hébergée dans `src/assets/fonts/` (jamais Google Fonts).
- Tailles et graisses : celles de la capture. Nombres et prix avec `num()` / `fcfa()`.

## Formes
- Cartes : `Card` (16 px, bordure `line`, ombre légère) ; espace pro : `proCard`.
- Boutons : `Button` (12 px) ou pilule `rounded-full` quand la maquette le montre. Badges, pastilles, avatars : ronds.
- Champs : bordure bleu-gris, focus bleu (`brand-500` + anneau `brand-100`).

## Mise en page
- Pages publiques : contenu jusqu'à 1320 px, marges de 20 px ; bandeau (`Hero`), fil d'Ariane, onglets en blocs.
- Espace pro : barre latérale de 250 px, en-tête de page `ProHeader`.
- Connexion : grand cadre bleu (`AuthShell`) ; inscription : carte centrée (`AuthCard`).

## Messages
- Toasts (sonner) en haut à droite, couleurs de leur sens, avec une croix. Une action non réalisée dans la démo affiche un message qui finit par « (démo) ».

## Mouvement
- Animations rares et courtes (survols, ouverture des menus). Respecter « réduire les animations » (`motion-reduce`).
