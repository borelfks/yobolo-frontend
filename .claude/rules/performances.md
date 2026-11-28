# Performances

1. **Une page = un fichier chargé à la demande** (`lazy` dans `src/app/routes/pages.ts`). La table des routes et les cadres restent légers : jamais de bibliothèque lourde (zod, recharts…) importée par une route ou un cadre ; la validation de la recherche d'une adresse se fait avec une petite fonction (constaté le 2026-11-28 dans l'admin : zod importé par une route alourdissait le premier fichier de 76 Ko).
2. **Graphiques** (recharts) : seulement dans les pages qui en affichent (Statistiques) ; ils arrivent avec elles.
3. **Pré-compilation Vite** : toute bibliothèque importée par une page chargée à la demande est listée dans `optimizeDeps.include` (`vite.config.ts`), sinon « Invalid hook call » en développement.
4. **Images** : celles de la maquette, légères (`public/images/maquette/`) ; vidéos de 300 à 420 Ko, jamais de GIF. Une image a une taille fixe dans la page (classes de hauteur), pour que la page ne saute pas.
5. **Données** : lues une fois par table (`useCollection`, TanStack Query) ; on filtre et on calcule en mémoire, sans relire la base dans une boucle.
6. **Squelettes de la même forme** que le contenu : rien ne saute à l'arrivée des données.
7. **Mesurer avant de dire « fait »** quand une dépendance entre dans un écran : `npm run build`, puis regarder la taille des fichiers de `dist/assets` (le premier fichier chargé ne doit pas grossir sans raison).
8. Pas de nouvelle dépendance sans accord (voir [code-et-architecture.md](code-et-architecture.md)).
