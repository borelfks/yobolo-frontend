# Git

1. Branche de travail : **`implementation-maquettes`** (front) ; `main` reste la version d'avant la refonte. yibolo-admin : `main`.
2. **Commiter seul après chaque étape importante** (un lot d'écrans fini et vérifié, une migration, une nouvelle brique) — décision du 2026-11-27. Les petites retouches attendent le commit suivant.
3. **Pousser seulement sur demande** (« push »).
4. Un commit par sujet. Message **en français** : titre court (`feat(…)`, `fix(…)`, `refactor(…)`), liste à puces si besoin, puis la ligne d'attribution :
   ```
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```
5. Vérifier avant de commiter : types, lint, traduction, build.
6. Jamais de captures, de scripts temporaires, de `dist/`, ni de la maquette dans un commit.
7. Pas de `--no-verify`, pas de réécriture d'historique, pas de `push --force`.
