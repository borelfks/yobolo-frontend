# Erreurs, états et hors connexion

1. **Chargement d'une page** : les pages sont chargées à la demande ; pendant ce temps, `PageLoader` s'affiche dans le cadre (`RouteOutlet`).
2. **Page qui plante** : `ErrorBoundary` (dans `RouteOutlet`) affiche « Une erreur est survenue » (`ErrorScreen` : recharger, retour à l'accueil) **dans le cadre**, menu conservé. L'erreur s'efface quand on change de page. Hors cadre, le routeur affiche `ErrorPage`.
3. **Pas de connexion** : si une page ne peut pas se télécharger, `OfflineScreen` (« Pas de connexion internet », « Réessayer »).
4. **Adresse inconnue** : `NotFound` (« 404 — Page introuvable », « Retour à l'accueil ») dans le cadre public.
5. **Élément introuvable** (mauvais identifiant d'établissement, de formation, d'auto-école) : aujourd'hui, les fonctions `…ById` de `src/mocks/` renvoient le premier élément. Ne pas s'appuyer sur ce comportement ; un message « … introuvable » est à décider (voir [DECISIONS.md](../../docs/DECISIONS.md)).
6. **Liste vide après un filtre ou une recherche** : un message clair dans une carte (« Aucune auto-école ne correspond à ces critères. », « Aucun établissement ne correspond à « … ». »), avec si possible « Réinitialiser les filtres ».
7. **Messages (toasts, sonner)** : réussite en vert (`toast.success`), erreur en rouge (`toast.error`), information neutre (`toast`). En haut à droite, avec une croix. Textes traduits.
8. **Actions de démonstration non réalisées** (vidéo, carte, partager, export…) : un `toast` qui finit par « (démo) ». Jamais un bouton qui ne fait rien, jamais un lien mort.
9. Le stockage local est toujours lu et écrit **sous try/catch** (`load` / `save` de `src/shared/utils/storage.ts`). La navigation privée ne doit rien casser.
