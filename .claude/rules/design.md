# Design

Référence : le **canevas YIBOLO** (planches ordinateur 1440 px et téléphone 390 px). Détail des jetons et composants : [DESIGN.md](../../docs/DESIGN.md) et la page **/design-system** (développement).

## Règles absolues
1. **Identique au canevas.** Mise en page, textes, couleurs, espacements, icônes de chaque planche. Ce que le canevas ne montre pas (états, erreurs) suit les blocs existants.
2. **Incohérence entre deux planches → on corrige** pour un ensemble cohérent (la version la plus fréquente, ou celle du composant partagé) et on le signale (décision du 2026-11-27).
3. **Ordinateur et téléphone** : vérifier à 1440 px et 390 px, jamais de défilement horizontal.
4. **Jetons seulement** (`src/app/styles/theme.css`, noms shadcn). Une valeur du canevas qui manque devient un jeton. Jamais `[#…]` ni `style={{ color }}`.
5. **Pas de mode sombre**, pas de variantes `dark:`.

## Le système du canevas (en bref)
- **Couleurs** : fond `background` #F4F6FA, cartes `card` blanc, texte `foreground` #0B1B3F, texte d'appoint `muted-foreground` #4A5670, bordures `border` #E0E4EC, champs `input` #9AA5BA, bleu `primary` #1F55E6 (survol `primary-hover` #1843B8), vert `success` #0F7A55, rouge `destructive` #D92D4B, ambre `warning` #E0A500.
- **Texte** : Plus Jakarta Sans. Titre de page 28 px / 800, section 24, carte 18 / 800 ; boutons et onglets 15 px / 700 (`text-ui`) ; courant 14 px ; appoint 13 px (`text-meta`) ; en-têtes de tableau 12 px capitales. Les autres tailles du canevas sont des jetons : `text-micro` 10, `text-legende` 11, `text-intro` 17, `text-titre-sm` 22, `text-titre-md` 26, `text-titre` 28, `text-titre-lg` 30, `text-titre-xl` 32, `text-titre-2xl` 34, `text-chiffre` 44, `text-chiffre-xl` 56 (jamais `text-[…px]`). Une taille ajoutée se déclare aussi dans `cn.ts` (tailwind-merge), sinon elle efface la couleur du texte.
- **Formes** : boutons en **pilule** (40 px ; 32, 36, 44 selon l'usage), champs 44 px arrondis à 6 px, cartes 10 px avec bordure et sans ombre, badges 24 px, puces 32 px (actives en vert), onglets 48 px soulignés de 3 px.
- **Ombres** : `shadow-floating` (menus), `shadow-dialog` (fenêtres), `shadow-card-hover` (vignette survolée), `shadow-thumb` (bouton posé sur une photo).
- **Largeur** des pages publiques : `max-w-page` (1128 px) ; espace pro : `max-w-pro` (1280 px).
- **Logo** : celui de la landing, partout (`MarqueYibolo`, jetons `marque`, `marque-texte`, `marque-devise`).

## Mouvement
- Animations rares et courtes ; toujours `motion-reduce:` (respecter « réduire les animations »).
