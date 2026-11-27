# Collaboration avec le porteur du projet

## La maquette d'abord

- La référence de chaque écran est **la maquette Word du client** : `C:\Users\USER\Documents\yibolo\NOUVEAU DESIGN YIBOLO.docx` (environ 150 captures). Pour en lire le plan, extraire le texte de `word/document.xml` (Python, `zipfile`) ; les captures sont `word/media/imageN`. Travailler sur une copie, **dans le dossier temporaire**, jamais dans le projet.
- Un changement visible doit **rapprocher** l'écran de sa capture, jamais l'en éloigner.
- Ce que la maquette ne montre pas (cas d'erreur, écran manquant, comportement d'un bouton) : **proposer**, ne pas inventer en silence.

## Avant de modifier

1. **Proposer d'abord** : ce qui change, où, ce que ça implique à l'écran (à côté de la capture de la maquette), et les choix à faire. Recommander une option.
2. Attendre « oui », « vas-y » ou « ok ». **Un accord vaut pour le changement demandé, et seulement lui.**
3. Quand il écrit « dis-moi juste » ou « réponds juste », **répondre seulement**, sans rien modifier.
4. Un rangement de code « invisible » (déplacer, découper, renommer, supprimer du code mort) demande **aussi** son accord, sauf s'il fait partie de la tâche demandée.
5. Si une tâche approuvée oblige à toucher un élément partagé (composant de `shared/`, thème, `ROUTES`, types), prévenir avant.
6. Pour un changement visible, montrer une **capture avant / après**, à côté de la capture de la maquette.

## Ce qu'on ne propose pas

- Brancher l'API de yibolo-backend **avant** qu'elle publie sa description OpenAPI et que le porteur du projet le demande : en attendant, les écrans lisent les fausses données (décision du 2026-11-27).
- Commencer **Consultation** ou **Emploi** sans que le porteur du projet l'ait demandé.
- « Améliorer » la maquette (autre mise en page, autres textes, chiffres recalculés).

## Façon de répondre

- **En français**, avec « vous », **court**, phrases simples, sans jargon technique inutile.
- Quand on demande un plan : **détaillé, concret, complet**, en étapes numérotées, en français simple.
- Dire clairement ce qui a été fait, ce qui a été vérifié et comment, ce qui n'a **pas** été fait et pourquoi.
- Ne jamais annoncer « c'est fait » sans l'avoir vérifié (voir [verification.md](verification.md)).
- Signaler un défaut trouvé en chemin (écart avec la maquette, lien mort, texte non traduit), même hors de la tâche, au lieu de le corriger en silence.
- Une demande ambiguë : choisir l'interprétation la plus probable, le dire, et avancer ; poser une question seulement si on ne peut vraiment pas trancher.

## Travail à plusieurs agents

- Plusieurs agents peuvent travailler en même temps sur le dépôt (ex. traduction d'un côté, documentation de l'autre). Ne modifier **que les fichiers de sa tâche** ; ne pas « réparer » le fichier d'un autre.

## Commit et push

- **Commiter ou pousser seulement quand c'est demandé** (voir [git.md](git.md)).
