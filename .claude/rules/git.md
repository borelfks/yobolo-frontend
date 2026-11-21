# Git

1. Branche principale : **`main`** (c'est aussi la branche de travail aujourd'hui). Une branche de travail séparée (comme `develop` dans Autopia) : **à confirmer** avec le porteur du projet.
2. **Commiter seulement quand le porteur du projet le demande** (« commit »). **Pousser seulement sur demande** (« push »).
3. **Un commit par sujet** : quand plusieurs changements sont approuvés à la suite, un commit par point. Si on demande de commiter avant de continuer, on commite d'abord ce qui est fini et vérifié.
4. Message **en français** : un titre court qui dit ce qui change (préfixe comme `feat(ecole): …` si le dépôt l'utilise), puis une liste à puces si besoin. Terminer par la ligne d'attribution demandée par l'outil, par exemple :
   ```
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```
5. Ne commiter que les fichiers de la tâche. Jamais de captures, de scripts temporaires, de `dist/`, ni la maquette Word.
6. Vérifier avant de commiter : types, lint, traduction, build (voir [verification.md](verification.md)).
7. Pas de `--no-verify`, pas de réécriture d'historique, pas de `push --force` sans demande explicite.
8. Plusieurs agents peuvent modifier le dépôt en même temps : ne pas ajouter au commit les fichiers modifiés par un autre.
