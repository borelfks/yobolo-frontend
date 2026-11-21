# Produit

## Ce qu'est YIBOLO
- La plateforme de **formation, d'expertise et d'emploi en Afrique centrale** (Cameroun d'abord). Devise : **Apprendre · Former · Consulter · Travailler**.
- Quatre univers : **École**, **Consultation**, **Métiers**, **Emploi**.
- Nom de la marque : **YIBOLO**, en capitales dans les textes (« Assistance YIBOLO », « Rechercher sur YIBOLO », « validation par YIBOLO »).

## Ce dépôt : un front seul
- **Aucun backend, aucun appel d'API, pas d'Orval, pas de react-query.** Toutes les données viennent de `src/mocks/` (voir [donnees-et-backend.md](donnees-et-backend.md)).
- But : montrer au client **sa maquette qui fonctionne**. Chaque écran est **identique à sa capture** (voir [design.md](design.md)).

## Périmètre (décision du 2026-11-17)
- **Réalisé : l'univers École.**
  - **IPES, CFP, Autres** : même gabarit (annuaire en 7 onglets, fiche, formation, préinscription). Le type vient de l'adresse (`/ecoles/ipes|cfp|autres`) et de `typeConfig` (`src/mocks/schools.ts`).
  - **Auto-écoles** : écrans propres (liste, fiche en 6 onglets, permis A à D, inscription en 3 étapes).
  - **Espace professionnel** : **un seul**, partagé par les IPES, CFP et Autres (`/pro/ecole`). Le compte choisit l'établissement (`useMonEcole`).
- **Pas réalisé : Consultation et Emploi** (et Métiers) : page « bientôt disponible » (`HorsPerimetre`). Ne pas les commencer sans accord.

## Deux espaces totalement différents (principe de la maquette)
- **Espace professionnel** : l'établissement renseigne et actualise ses informations.
- **Espace public** : visiteurs, étudiants, candidats et parents cherchent des établissements et des formations.
- Une modification faite dans l'espace pro est **répercutée sur la fiche publique**, éventuellement **après validation par YIBOLO** (informations sensibles ou réglementaires). Dans la démo, les deux espaces ne sont pas reliés : on affiche le message, rien ne change sur la fiche.

## Confiance
- Badge **« Établissement vérifié »** (vert) pour les établissements, **« Agréée »** pour les auto-écoles.
- Les avis sont publiés **après vérification par YIBOLO** ; l'auteur confirme avoir suivi une formation.
- Chiffres et notes affichés = **ceux de la maquette**, jamais inventés ni recalculés.

## Argent
- Montants en **FCFA**, entiers, écrits avec `fcfa()` : « 450 000 FCFA ».
- YIBOLO ne prend aucun paiement dans la démo : les frais et tarifs sont **affichés** (frais d'inscription, frais par an, modalités, remise de 5 % en une fois…), jamais payés dans l'application.
