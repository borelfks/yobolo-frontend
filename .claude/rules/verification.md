# Vérifier avant de dire « c'est fait »

## Toujours
1. `npm run typecheck` : **0 erreur**.
2. `npm run lint` (oxlint) : pas de nouvel avertissement.
3. `npm run i18n:check` : mêmes clés en français et en anglais.
4. `npm run build` : réussi.

## Selon le changement
5. **Dans le navigateur** : `npm run dev`, puis **http://localhost:5199** (jamais 5173 ni 5180, pris par d'autres projets), avec un script Playwright (Chrome) ou à la main :
   - à **1440 px** (largeur de la maquette) et à **390 px** (aucun défilement horizontal) ;
   - en **français** et en **anglais** ;
   - avec les bons comptes (Utilisateur, École – IPES, CFP, Autre).
6. **Changement visible** : capture de l'écran **à côté de la capture de la maquette** (`word/media/imageN` du fichier Word), et capture avant / après. Le français doit être identique à la maquette (textes, chiffres).
7. **Changement censé être invisible** (rangement, traduction, découpage d'une page) : comparer les écrans avant et après, en français, texte et image. Aucun écart accepté.
8. **Parcours** : rejouer le parcours de bout en bout (préinscription en 4 étapes, inscription en auto-école en 3 étapes et sa modification, avis, favoris, création de compte, espace pro) en naviguant **dans l'app**.
9. **Liens** : aucun lien mort, aucune erreur dans la console, chaque onglet a sa propre adresse et s'ouvre directement.
10. **Formulaires** : envoi à vide (messages attendus), envoi valide.

## Après
- Supprimer les fichiers temporaires (captures, scripts, extraits de la maquette). Ils vont dans le dossier temporaire, **jamais dans le projet**.
- Dire ce qui a été vérifié, et comment. Si un test échoue, le dire avec le résultat.
