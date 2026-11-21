# YIBOLO — Décisions

> Ce qui a été décidé, quand, et pourquoi, plus **tout ce qu'il faudra faire ou revoir plus tard**.
> Une décision récente remplace une décision plus ancienne sur le même sujet. Le cahier des charges ([SPECIFICATIONS.md](SPECIFICATIONS.md)) décrit toujours l'état à jour.

---

## 1. Journal des décisions

### Produit et périmètre

| Date | Décision | Pourquoi / remarque |
|---|---|---|
| 2026-11-16 | **yibolo-frontend est un front seul** : aucun backend, aucun client d'API, pas d'Orval. Toutes les données viennent de `src/mocks/`. **Ne pas proposer de brancher le backend.** | Le porteur du projet a refusé l'approche mixte (brancher yibolo-backend). Le client veut voir sa maquette devenir une interface qui fonctionne. |
| 2026-11-17 | **Périmètre : univers École uniquement** : IPES, CFP et Autres sur le même gabarit, et auto-écoles. **Un seul espace pro** partagé par les IPES, CFP et Autres. Consultation et Emploi = page « bientôt disponible ». | Livrer d'abord un univers complet. |
| 2026-11-17 | **Les écrans doivent être identiques à la maquette** (« ça doit être identique ») : photos découpées de la maquette (aujourd'hui dans `public/images/maquette/`), textes et chiffres recopiés de chaque capture. **Les contradictions de la maquette** (prix des permis entre liste et détail, modes de formation) **sont gardées telles quelles**, écran par écran. | La maquette du client est la référence ; on ne la réinterprète pas. |
| 2026-11-18 | Univers École réalisé, fidèle à la maquette, avec des données de démonstration (premier commit). | — |

### Technique

| Date | Décision | Pourquoi / remarque |
|---|---|---|
| 2026-11 (départ) | Port de développement **5199** (`vite --port 5199`). | 5173 (yibolo-client) et 5180 (mboajuris-frontend) sont pris par d'autres projets. |
| 2026-11-21 | **Code réorganisé par fonctionnalité, sur le modèle d'Autopia** : `src/app/` (routes, cadres, styles), `src/features/<sujet>/` (pages, composants, hooks, logique), `src/shared/` (ce qui sert à plusieurs sujets), `src/mocks/` (données de démo), `src/assets/` (police, logo). Types du domaine dans `src/shared/types.ts`, adresses dans `ROUTES` (`src/shared/utils/routes.ts`), **TypeScript `strict`**. Documentation dans `docs/`, règles dans `.claude/rules/`, `CLAUDE.md` à la racine. | Même organisation que les autres projets du porteur, plus facile à reprendre. |
| 2026-11-21 | **Police Plus Jakarta Sans hébergée localement** (`src/assets/fonts/`), plus de chargement depuis Google Fonts. **Icônes d'application et manifeste** dans `public/` (`favicon.svg`, `icons/`, `site.webmanifest`). Photos déplacées de `public/maquette/` vers `public/images/maquette/`. | Fonctionne hors ligne, même rendu partout. |
| 2026-11-21 | **Traduction français / anglais** avec i18next : français par défaut et **référence**, anglais **britannique**, **un namespace par fonctionnalité**, clés **typées**, `npm run i18n:check`. Les données de démo restent en français (elles jouent le rôle du serveur). Règles : [.claude/rules/traduction.md](../.claude/rules/traduction.md). | Le Cameroun est bilingue ; le français reste identique à la maquette. |

### Prochaine étape envisagée

| Date | Décision |
|---|---|
| 2026-11-21 | Après l'univers École : l'**univers Consultation** (espace pro du consultant en 11 menus, environ 72 captures de la maquette). **À confirmer** par le porteur du projet avant de commencer. |

---

## 2. À faire plus tard

### Fidélité à la maquette
- [ ] Repasser chaque écran à côté de sa capture (1440 px) après la traduction, pour vérifier que **le français n'a pas bougé**.
- [ ] Remplacer les images de démonstration qui viennent encore d'internet (`photo()` → picsum.photos, `portrait()` → randomuser.me : comptes CFP et Autre, utilisateurs de l'espace pro) par des photos découpées de la maquette, si elle en contient. **À confirmer.**
- [ ] Faute « Comptabilté » dans la filière de deux formations de l'espace pro (`src/mocks/pro.ts`) : vient-elle de la maquette ? **À confirmer** avant de corriger.

### Code
- [ ] **Adresses écrites à la main** : beaucoup de liens utilisent encore des chaînes (`'/ecoles/…'`, `'/pro/ecole/…'`) au lieu de `ROUTES` (cadres, pied de page, `schoolLinks.tsx`, pages). Les remplacer, écran par écran.
- [ ] **Couleurs et tailles écrites à la main** (environ 240 couleurs `[#…]`, environ 600 tailles `text-[…px]`) : créer les jetons qui manquent dans `theme.css` (ex. bordure des champs `#c9d4ea`, fond bleu très clair `#eef3fc`) et les utiliser, **sans changer le rendu** (capture avant / après).
- [ ] **Élément introuvable** : `etablissementById`, `formationById`, `autoEcoleById`, `actualiteById` renvoient le premier élément quand l'identifiant est inconnu. Afficher plutôt « … introuvable » avec un lien utile. **À confirmer** (la maquette ne montre pas ce cas).
- [ ] **Formulaires** : seuls la connexion et l'inscription utilisent react-hook-form + zod ; les autres (préinscription, inscription en auto-école, avis, invitation, formation) vérifient à la main avec un message. Les passer sur react-hook-form + zod, avec des messages traduits.
- [ ] **Session** : après « Se déconnecter » puis un rechargement, la démo revient au compte Utilisateur (la valeur vide n'est pas gardée). Décider si un visiteur non connecté doit rester non connecté. **À confirmer.**
- [ ] Les **notifications** de la cloche sont écrites dans `AccountMenu.tsx` : les déplacer dans `src/mocks/`.
- [ ] date-fns est installé mais pas utilisé : l'utiliser ou le retirer (avec accord).
- [x] Les menus des cadres (en-tête public, pied de page, espace pro) sont dans `src/app/layouts/navConfig.ts`, avec `ROUTES` et des clés de traduction (2026-11-21).

### Univers suivants
- [ ] **Consultation** : espace pro du consultant (11 menus : Tableau de bord, Mon profil, Mes services, Agenda et rendez-vous, Salle de consultation, Demande de prestation, Mes clients, Revenus et paiements, Avis & réputation, Statistiques, Paramètres), puis son espace public.
- [ ] **Emploi** et **Métiers** : pas encore dans la maquette lue. **À confirmer.**

---

## 3. Idées à étudier

- [ ] Relier l'espace pro et la fiche publique dans la démo (une formation créée apparaît sur la fiche), pour illustrer le principe « modification répercutée après validation par YIBOLO ».
- [ ] Un écran « validation par YIBOLO » (côté administrateur YIBOLO) : la maquette en parle mais ne le montre pas. **À confirmer.**

---

## 4. Points ouverts

1. **Espace pro des auto-écoles** : la maquette montre l'espace pro de l'IPES ; une auto-école a-t-elle le même espace ? **À confirmer.**
2. **Permis E** : présent dans les données (filtres de la liste), absent des pages de la maquette (A à D).
3. **Recherche de l'accueil** : elle mène toujours à `/ecoles`, quels que soient les choix (Consultant, Métiers). À revoir quand les autres univers existeront.
