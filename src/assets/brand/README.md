# Logo YIBOLO

Le logo de l'accueil (repris de yibolo-client) : le « Y » dont les branches forment une coche, dans un carré bleu, puis « Yibolo » et la devise « Apprendre · Évoluer · Réussir ». Décision du 2026-11-24 : ce logo est utilisé partout.

| Fichier | Usage |
|---|---|
| `yibolo-icon.svg` | Symbole seul (même dessin que `public/favicon.svg`) |
| `yibolo-icon-white.svg` | Symbole sur fond sombre (le carré bleu reste tel quel) |
| `yibolo-logo.svg` | Symbole + « Yibolo » + devise |
| `yibolo-logo-white.svg` | Logo complet sur fond sombre (texte blanc) |

Dans l'interface, le logo est dessiné par les blocs `MarqueYibolo` et `SymboleYibolo` (`src/shared/blocs/Marque.tsx`), mêmes formes et mêmes couleurs ; la landing garde son propre `LandingLogo`, identique.
Le favicon (`public/favicon.svg`, `favicon.ico`), les icônes PNG de `public/icons/` (192, 512, 512 « maskable », Apple) et l’image de partage `public/og-image.png` viennent de yibolo-client, comme le titre et les balises de partage (SEO) de `index.html`.
