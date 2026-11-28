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
6. **Changement visible** : capture de l'écran **à côté de sa planche du canevas** (ordinateur et téléphone). Textes identiques à la planche ; incohérences corrigées et signalées.
7. **Changement censé être invisible** (rangement, jetons, traduction, découpage d'une page) : captures **avant** puis **après** des mêmes pages (1440 et 390 px, comptes visiteur, personne, école), comparées au pixel et au texte. Aucun écart accepté, sauf une animation (graphique, outil de développement) qu'on vérifie à l'œil.
8. **Parcours** : rejouer le parcours de bout en bout en naviguant **dans l'app** : création de compte (personne, école), connexion et déconnexion, avis (donner, Utile, Partager, Signaler, réponse de l'école), favoris, listes (filtres, tri, pages), espace pro (profil, formation, contenus, FAQ, paramètres, invitation).
9. **Liens** : aucun lien mort, aucune erreur dans la console, chaque onglet a sa propre adresse et s'ouvre directement.
10. **Formulaires** : envoi à vide (messages attendus), envoi valide.
11. **Tour des pages** : toutes les pages (visiteur, personne, école), à 1440 et 390 px : aucune erreur dans la console, aucun défilement horizontal (`scrollWidth` ≤ largeur).
12. **Accessibilité** : audit **axe-core** (installé dans le dossier temporaire, pas dans le projet) sur les pages touchées : aucun défaut, hors le double pied de page de l'outil de développement du routeur (absent du site publié). Voir [accessibilite.md](accessibilite.md).
13. **Poids** : après l'ajout d'une bibliothèque, taille des fichiers de `dist/assets` (voir [performances.md](performances.md)).
14. **Front et admin** : un fichier commun modifié l'est dans les deux projets, vérifiés tous les deux (voir [front-et-admin.md](front-et-admin.md)).

## Après
- Supprimer les fichiers temporaires (captures, scripts, extraits de la maquette). Ils vont dans le dossier temporaire, **jamais dans le projet**.
- Dire ce qui a été vérifié, et comment. Si un test échoue, le dire avec le résultat.
