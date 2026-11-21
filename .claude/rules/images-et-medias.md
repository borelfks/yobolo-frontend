# Images, logos et médias

1. **Photos de la maquette** : découpées dans les captures du client et rangées dans `public/images/maquette/`. Nom en minuscules avec tirets, préfixé par l'écran (`ae-…` auto-école, `aeav-…` avis d'auto-école, `region-…`, `actu-…`, `ecole-…`, `form-…`, `vehicule-…`, `tarif-…`). Chemin dans le code : `/images/maquette/<nom>.jpg`.
2. Une photo manquante se **découpe dans la maquette** (dans le dossier temporaire, puis copiée dans `public/images/maquette/`). Ne pas télécharger d'image sur internet sans l'accord du porteur du projet.
3. Les **photos de personnes** de la maquette (avatars, témoignages, photo de la connexion) sont gardées : c'est la maquette du client. On n'en ajoute pas d'autres.
4. Images de démonstration venues d'internet (`photo()` → picsum.photos, `portrait()` → randomuser.me, dans `src/shared/utils/format.ts`) : seulement là où elles sont déjà ; à remplacer par des photos de la maquette quand c'est possible.
5. **Logo YIBOLO** : `src/assets/brand/` (icône, icône blanche, logo, logo blanc ; voir son `README.md`), redessiné d'après la maquette. Dans l'interface : `Logo` / `LogoMark`. Favicon `public/favicon.svg`, icônes d'application `public/icons/` (192, 512, Apple), manifeste `public/site.webmanifest`.
6. Toujours le composant `Img` ou `Avatar`. Toute image a un `alt` qui la décrit (traduit) ; une image décorative a `alt=""`.
7. **Vidéos** : la maquette en montre (présentation, galerie) ; dans la démo, la vignette affiche un message « (démo) ». Pas de vidéo lourde ni de GIF dans le projet.
8. **Icônes** : lucide-react uniquement.
