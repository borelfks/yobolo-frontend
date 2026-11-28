# Images, logos et médias

1. **Photos de la maquette** : découpées dans les captures du client et rangées dans `public/images/maquette/`. Nom en minuscules avec tirets, préfixé par l'écran (`ae-…` auto-école, `aeav-…` avis d'auto-école, `region-…`, `actu-…`, `ecole-…`, `form-…`, `vehicule-…`, `tarif-…`). Chemin dans le code : `/images/maquette/<nom>.jpg`.
2. Une photo manquante se **découpe dans la maquette** (dans le dossier temporaire, puis copiée dans `public/images/maquette/`). Ne pas télécharger d'image sur internet sans l'accord du porteur du projet.
3. Les **photos de personnes** de la maquette (avatars, témoignages, photo de la connexion) sont gardées : c'est la maquette du client. On n'en ajoute pas d'autres.
4. Images de démonstration venues d'internet (`photo()` → picsum.photos, `portrait()` → randomuser.me, dans `src/shared/utils/format.ts`) : seulement là où elles sont déjà ; à remplacer par des photos de la maquette quand c'est possible.
5. **Logo YIBOLO** : celui de l'accueil, repris de yibolo-client (décision du 2026-11-24) : `src/assets/brand/` (voir son `README.md`). Dans l'interface : `MarqueYibolo` / `SymboleYibolo` (`src/shared/blocs/Marque.tsx`). Favicon `public/favicon.svg`, icônes d'application `public/icons/` (192, 512, 512 « maskable », Apple), manifeste `public/site.webmanifest`.
6. Toujours le composant `Img` ou `Avatar`. Toute image a un `alt` qui la décrit (traduit) ; une image décorative a `alt=""`.
7. **Vidéos** : table `videos` (présentation et galerie d'un établissement, galerie d'une auto-école) ; elles se lisent dans la `Visionneuse`. Fichiers légers dans `public/videos/` (repris de yibolo-client, 300 à 420 Ko). Un établissement peut ajouter ses propres photos et vidéos (Profil › Médias, enregistrées dans la base). Pas de vidéo lourde ni de GIF.
8. **Icônes** : lucide-react uniquement.
