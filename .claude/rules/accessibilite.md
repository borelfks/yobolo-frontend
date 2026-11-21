# Accessibilité

1. Chaque champ a une **étiquette** : visible, ou `aria-label` quand la maquette n'en montre pas (ex. connexion : « Email ou téléphone »). L'erreur est sous le champ.
2. Un bouton qui n'a qu'une icône a un **`aria-label`** traduit (« Menu », « Plus d'actions », « Voir », « Supprimer »). Les icônes décoratives ont `aria-hidden`.
3. **Clavier :** tout est utilisable au clavier ; le focus est visible (contour bleu `brand-500`, défini dans `globals.css`). Pas de `outline-none` sans remplacement.
4. **Contrastes :** pas de gris clair sur fond gris ; texte blanc seulement sur bleu, bleu nuit ou couleur pleine.
5. **Zones de toucher** d'au moins 40 px sur téléphone (boutons d'icône `size-10`).
6. Statut et rôle **par le texte**, pas seulement par la couleur (« Publiée », « En attente », « Établissement vérifié »).
7. Le compteur de la cloche a un libellé lisible (« Notifications (3 non lues) »).
8. `aria-current="page"` sur le menu et l'onglet actifs (fourni par `NavLink`).
9. L'attribut `lang` de la page suit la langue choisie (`src/i18n/index.ts`).
10. Respecter « réduire les animations ». Images : voir [images-et-medias.md](images-et-medias.md).
