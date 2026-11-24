# Avis et favoris

## Avis
1. On donne un avis sur un **établissement** (`/ecoles/:type/etablissement/:id/avis/nouveau`) ou une **auto-école** (`/ecoles/auto-ecoles/:id/avis/nouveau`), depuis l'onglet **Avis** (« Donner mon avis ») ou le menu du compte.
2. Le formulaire :
   - **note globale** obligatoire, 1 à 5 étoiles (Décevant, Moyen, Bien, Très bien, Excellent) ;
   - notes par **critère**, facultatives (5 critères pour une auto-école, 5 pour un établissement) ;
   - **commentaire** d'au moins 10 caractères ;
   - case « Je confirme avoir suivi une formation dans cet établissement / cette auto-école », obligatoire.
3. « Publier mon avis » : l'avis est enregistré dans la base et s'affiche en tête des avis (« À l'instant »). Message : « Merci ! Votre avis sera publié après vérification par YIBOLO. », retour à l'onglet Avis.
4. Affichage : `RatingSummary` (note globale + répartition), `ReviewItem` (un avis), `Stars` / `Rating`. Les avis, notes, nombres d'avis et répartitions sont **ceux de la maquette** (`avisIpc`, `repartitionNotes`, `avisAutoEcole`, `repartitionAutoEcole`, `criteresAvis`).
5. Fiche établissement : filtres Tous · Étudiants · Anciens étudiants · Entreprises. Fiche auto-école : tri « Les plus récents » / « Les mieux notés ».
6. **Réponse aux avis** : l'établissement connecté voit « Répondre » sous chaque avis de sa fiche publique (onglet Avis) ; la réponse est enregistrée sur l'avis (`reponse`) et affichée à tous, modifiable ou retirable. « Répondre aux avis » du tableau de bord y mène. **Utile** (pouce) : compté dans la base. Avis d'auto-école : menu « … » → Partager (lien copié) · Signaler (table `signalementsAvis`). Tri, « Voir plus » réels.

## Favoris
1. Ce qu'on peut garder (`FavoriteKind`) : une **formation**, un **établissement**, une **auto-école**, un **permis**.
2. Ajouter / retirer : `FavoriteButton` (cœur) ou « Ajouter aux favoris » ; côté auto-école, la fenêtre `FavoriteModal` propose un **dossier** (facultatif).
3. Dossiers : **Mes formations**, **Mes établissements**, **À comparer**.
4. Messages : « Ajouté à vos favoris » (avec le dossier), « Retiré de vos favoris », « Tous vos favoris ont été supprimés ».
5. Page **Mes favoris** (`/favoris`) : filtres Tous les favoris · Formations · Établissements, avec leur nombre ; retirer un favori ; tout supprimer.
6. Logique : `useFavorites()` (`src/shared/hooks/useFavorites.tsx`), gardée sous `yibolo:favorites`. Favoris de départ : 2 formations de l'IPC et l'IPC (vignettes de la maquette).
7. Les favoris sont ouverts à tous, connecté ou non (démo).
