import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { useAutoEcoles, useDomainesExpertise, useEnregistrements, useEtablissements, useExperts, useFormations, usePermisCatalogue, usePublications } from '@/data/hooks'
import { ecoleUrl, formationUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { useFavorites } from '@/shared/hooks/useFavorites'
import type { ModeCours, PermisCode } from '@/shared/types'
import { currentLocale } from '@/i18n'
import { fcfa, num, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Les filtres de « Mes favoris » (canevas : 1. Tous les favoris, 2. Formations, 3. Établissements, 4. Publications). */
export type FiltreFavoris = 'tous' | 'formations' | 'etablissements' | 'publications'
export const FILTRES_FAVORIS: FiltreFavoris[] = ['tous', 'formations', 'etablissements', 'publications']

type Genre = Exclude<FiltreFavoris, 'tous'>

/** Une ligne de « Mes favoris », prête à afficher. */
export type FavoriAffiche = {
  cle: string
  genre: Genre
  badge: string
  dossier: string
  verifie: boolean
  image?: string
  titre: string
  sous: string
  details: string
  action: string
  vers: string
  retirer: () => void
}

/** « il y a 2 j » (moins d'une semaine), sinon la date. */
function quand(date: string) {
  const jours = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
  if (jours >= 7) return shortDate(date, { day: '2-digit', month: 'short', year: 'numeric' })
  return new Intl.RelativeTimeFormat(currentLocale(), { numeric: 'auto', style: 'short' }).format(-Math.max(0, jours), 'day')
}

const MODES: Record<ModeCours, 'jour' | 'soir' | 'jourSoir'> = { Jour: 'jour', Soir: 'soir', 'Jour & Soir': 'jourSoir' }

/** Le titre d'une publication : son titre, sinon la première ligne de son texte. */
const premiereLigne = (texte: string, titre?: string) => (titre?.trim() || texte.trim().split('\n')[0] || '').trim()

/**
 * Les favoris du compte, dans l'ordre du canevas : formations et permis,
 * établissements et auto-écoles (table `favoris`), puis les publications
 * enregistrées sur l'accueil (table `enregistrements`). Chaque ligne sait se
 * retirer. Les chiffres (note, nombre de formations) sont calculés.
 */
export function useFavorisAffiches() {
  const { t } = useTranslation('favorites')
  const { account } = useSession()
  const { favorites, remove, clear } = useFavorites()
  const enregistrees = useEnregistrements(account?.id)
  const formations = useFormations()
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  const permis = usePermisCatalogue()
  const publications = usePublications()
  const experts = useExperts()
  const domaines = useDomainesExpertise()

  const dossier = (folder: string) => (folder === 'Mes formations' ? t('dossiers.formations') : folder === 'Mes établissements' ? t('dossiers.etablissements') : folder === 'À comparer' ? t('dossiers.comparer') : folder)
  const note = (n: number, avis: number) => (avis > 0 ? t('ligne.note', { note: num(n), count: avis }) : t('ligne.sansAvis'))

  const lignes: FavoriAffiche[] = []
  for (const fav of favorites) {
    const commun = { cle: `${fav.kind}-${fav.id}`, dossier: dossier(fav.folder), retirer: () => remove(fav.id) }
    if (fav.kind === 'formation') {
      const f = formations.find((x) => x.id === fav.id)
      if (!f) continue
      const e = etablissements.find((x) => x.id === f.etablissementId)
      lignes.push({
        ...commun,
        genre: 'formations',
        badge: t('badges.formation'),
        verifie: false,
        image: fav.vignette ?? f.image,
        titre: f.nom,
        sous: e ? `${e.nom} · ${e.ville}` : '',
        details: [f.diplome, t('ligne.mois', { count: f.dureeMois }), t(`ligne.modes.${MODES[f.mode]}`)].filter(Boolean).join(' · '),
        action: t('ligne.voirDetails'),
        vers: formationUrl(f),
      })
    } else if (fav.kind === 'permis') {
      const [aeId, code] = fav.id.split(':')
      const a = autoEcoles.find((x) => x.id === aeId)
      const p = permis[code as PermisCode]
      if (!a || !p) continue
      lignes.push({
        ...commun,
        genre: 'formations',
        badge: t('badges.formation'),
        verifie: false,
        image: fav.vignette ?? p.image,
        titre: t('ligne.permis', { code: p.code, nom: p.nom }),
        sous: `${a.nom} · ${a.ville}`,
        details: [p.duree, fcfa(p.prix)].filter(Boolean).join(' · '),
        action: t('ligne.voirDetails'),
        vers: ROUTES.license(a.id, p.code),
      })
    } else if (fav.kind === 'etablissement') {
      const e = etablissements.find((x) => x.id === fav.id)
      if (!e) continue
      lignes.push({
        ...commun,
        genre: 'etablissements',
        badge: t('badges.etablissement'),
        verifie: true,
        image: fav.vignette ?? e.image,
        titre: e.nom,
        sous: `${e.type} · ${[e.ville, e.quartier].filter(Boolean).join(', ')}`,
        details: `${note(e.note, e.avis)} · ${t('ligne.formations', { count: e.formations })}`,
        action: t('ligne.voirEtablissement'),
        vers: ecoleUrl(e),
      })
    } else {
      const a = autoEcoles.find((x) => x.id === fav.id)
      if (!a) continue
      lignes.push({
        ...commun,
        genre: 'etablissements',
        badge: t('badges.etablissement'),
        verifie: false,
        image: fav.vignette ?? a.image,
        titre: a.nom,
        sous: `${t('ligne.autoEcole')} · ${[a.ville, a.quartier].filter(Boolean).join(', ')}`,
        details: note(a.note, a.avis),
        action: t('ligne.voirEtablissement'),
        vers: ROUTES.drivingSchool(a.id),
      })
    }
  }
  // Les formations d'abord, puis les établissements (ordre du canevas).
  lignes.sort((a, b) => Number(a.genre === 'etablissements') - Number(b.genre === 'etablissements'))

  const retirerPublication = async (id: string) => {
    try {
      await data.remove('enregistrements', id)
      toast(t('publicationRetiree'))
    } catch {
      toast.error(t('echec'))
    }
  }
  for (const e of enregistrees) {
    const p = publications.find((x) => x.id === e.publicationId)
    if (!p) continue
    const expert = experts.find((x) => x.id === p.auteurId)
    const domaine = domaines.find((d) => d.id === (expert?.domaineId ?? p.domaines[0]))?.nom
    lignes.push({
      cle: `publication-${e.id}`,
      genre: 'publications',
      badge: t('badges.publication'),
      dossier: t('dossiers.enregistree'),
      verifie: false,
      image: p.image,
      titre: premiereLigne(p.texte, p.titre),
      sous: [expert?.nom, domaine].filter(Boolean).join(' · '),
      details: t('ligne.publiee', { quand: quand(p.publieeLe) }),
      action: t('ligne.lire'),
      vers: ROUTES.publication(p.id),
      retirer: () => void retirerPublication(e.id),
    })
  }

  return {
    lignes,
    nombre: (filtre: FiltreFavoris) => lignes.filter((l) => filtre === 'tous' || l.genre === filtre).length,
    /** « Tout supprimer » : les favoris et les publications enregistrées. */
    toutSupprimer: async () => {
      clear()
      try {
        await Promise.all(enregistrees.map((e) => data.remove('enregistrements', e.id)))
      } catch {
        toast.error(t('echec'))
      }
    },
  }
}
