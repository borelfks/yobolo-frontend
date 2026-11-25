import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowRight, Building2, CalendarDays, Car, CircleCheck, Folder, GraduationCap, Heart, Landmark, Lightbulb, MapPin, Megaphone, Star, Sun, Trash2 } from 'lucide-react'
import { Hero } from '@/shared/components/ui/Hero'
import { Img } from '@/shared/components/ui/Img'
import { useFavorites } from '@/shared/hooks/useFavorites'
import type { Enregistrement, Favorite, ModeCours, PermisCode } from '@/shared/types'
import { ecoleUrl, formationUrl } from '@/features/schools/schoolLinks'
import { useAutoEcoles, useEnregistrements, useEtablissements, useExperts, useFormations, usePermisCatalogue, usePublications } from '@/data/hooks'
import { data } from '@/data'
import { useSession } from '@/features/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { fcfa, num, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

type Filter = 'tous' | 'formation' | 'etablissement' | 'publication'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

export function Favoris() {
  const { t } = useTranslation('favorites')
  const { favorites, remove, clear } = useFavorites()
  const { account } = useSession()
  // Les publications mises en favoris sur l'accueil (« Enregistrer ») : les mêmes favoris.
  const publications = useEnregistrements(account?.id)
  const [filter, setFilter] = useState<Filter>('tous')
  const isFormation = (f: Favorite) => f.kind === 'formation' || f.kind === 'permis'
  const isEtab = (f: Favorite) => f.kind === 'etablissement' || f.kind === 'auto-ecole'
  const list = filter === 'publication' ? [] : favorites.filter((f) => filter === 'tous' || (filter === 'formation' ? isFormation(f) : isEtab(f)))
  const pubs = filter === 'tous' || filter === 'publication' ? publications : []
  const total = list.length + pubs.length
  const menu: { key: Filter; label: string; count: number; icon: ReactNode }[] = [
    { key: 'tous', label: t('favoris.filtres.tous'), count: favorites.length + publications.length, icon: <Folder /> },
    { key: 'formation', label: t('favoris.filtres.formation'), count: favorites.filter(isFormation).length, icon: <GraduationCap /> },
    { key: 'etablissement', label: t('favoris.filtres.etablissement'), count: favorites.filter(isEtab).length, icon: <Building2 /> },
    ...(account ? [{ key: 'publication' as const, label: t('favoris.filtres.publication'), count: publications.length, icon: <Megaphone /> }] : []),
  ]
  const toutRetirer = async () => {
    clear()
    await Promise.all(publications.map((e) => data.remove('enregistrements', e.id)))
  }
  return (
    <div className="mx-auto max-w-[1320px] space-y-5 px-5 py-4">
      <Hero
        crumbs={[{ label: t('favoris.crumbs.ecole'), to: ROUTES.schools }, { label: t('favoris.crumbs.mesFavoris') }]}
        icon={<Heart />}
        image="/images/maquette/favoris-hero.jpg"
        title={t('favoris.title')}
        subtitle={t('favoris.subtitle')}
      />
      <div className="grid gap-5 lg:grid-cols-[266px_1fr]">
        <div className="space-y-5">
          <div className={cn(card, 'space-y-2 p-2.5')}>
            {menu.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setFilter(m.key)}
                className={cn('flex h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-[16px] font-semibold [&_svg]:size-6', filter === m.key ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}
              >
                {m.icon}
                {m.label} ({m.count})
              </button>
            ))}
          </div>
          <div className={cn(card, 'bg-[#f3f6fc] p-5')}>
            <p className="flex items-center gap-2.5 text-[18px] font-bold text-navy-900">
              <Lightbulb className="size-7 fill-amber-300 text-amber-500" /> {t('favoris.astuce.titre')}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-navy-900">{t('favoris.astuce.texte')}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-[24px] font-bold text-navy-900">
              <Heart className="size-7" /> {menu.find((m) => m.key === filter)?.label} ({total})
            </h2>
            {favorites.length + publications.length > 0 && (
              <button type="button" onClick={() => void toutRetirer()} className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-5 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
                <Trash2 className="size-5" />
                {t('favoris.toutSupprimer')}
              </button>
            )}
          </div>
          {total === 0 && (
            <div className={cn(card, 'p-10 text-center')}>
              <Heart className="mx-auto size-10 text-slate-300" />
              <p className="mt-3 font-semibold text-navy-900">{t('favoris.vide.titre')}</p>
              <p className="text-sm text-muted">{t('favoris.vide.texte')}</p>
              <Link to={ROUTES.schools} className="mt-4 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 font-semibold text-white">
                {t('favoris.vide.explorer')}
              </Link>
            </div>
          )}
          {list.map((fav) => (
            <FavRow key={fav.id} fav={fav} onRemove={() => remove(fav.id)} />
          ))}
          {pubs.map((e) => (
            <PublicationFavorite key={e.id} enregistrement={e} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Mode de cours (valeur des données de démo) → clé de traduction. */
const modeKeys: Record<ModeCours, 'jour' | 'soir' | 'jourSoir'> = { Jour: 'jour', Soir: 'soir', 'Jour & Soir': 'jourSoir' }

function ModePill({ mode }: { mode: ModeCours }) {
  const { t } = useTranslation('favorites')
  const style = mode === 'Soir' ? 'bg-[#ece6ff]' : mode === 'Jour' ? 'bg-[#fff3cf]' : 'bg-[#f6e6f7]'
  const label = t(`row.modes.${modeKeys[mode]}`)
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[14px] text-navy-900', style)}>
      <Sun className="size-5 fill-amber-300 text-amber-500" />
      {label}
    </span>
  )
}

function FavRow({ fav, onRemove }: { fav: Favorite; onRemove: () => void }) {
  const permisCatalogue = usePermisCatalogue()
  const { t } = useTranslation('favorites')
  // Lus une fois dans la base ; comme avant, un identifiant inconnu renvoie le premier élément.
  const formations = useFormations()
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  const etablissementDe = (id: string) => etablissements.find((x) => x.id === id) ?? etablissements[0]!
  const autoEcoleDe = (id?: string) => autoEcoles.find((x) => x.id === id) ?? autoEcoles[0]!
  let image = ''
  let badge = t('row.badges.formation')
  let title = ''
  let left: ReactNode = null
  let right: ReactNode = null
  let to: string = ROUTES.schools
  let cta = t('row.voirDetails')
  const price = (n: number) => (
    <>
      <p className="text-[14px] text-navy-900">{t('row.fraisFormation')}</p>
      <p className="mt-1 rounded-full bg-[#e8efff] px-4 py-1.5 text-[18px] font-extrabold text-navy-800">
        {fcfa(n)} <span className="text-[14px] font-bold">{t('row.parAn')}</span>
      </p>
    </>
  )
  const formation = fav.kind === 'formation' ? formations.find((x) => x.id === fav.id) : undefined
  if (formation) {
    const f = formation
    const e = etablissementDe(f.etablissementId)
    ;[image, title, to] = [fav.vignette ?? f.image, f.nom, formationUrl(f)]
    left = (
      <>
        <p className="flex items-center gap-2 text-[15px] text-navy-900"><Landmark className="size-5" />{e.nom}</p>
        <p className="flex items-center gap-4 text-[15px] text-navy-900">
          <span className="inline-flex items-center gap-2"><CalendarDays className="size-5" />{t('row.dureeMois', { count: f.dureeMois })}</span>
          <ModePill mode={f.mode} />
        </p>
      </>
    )
    right = price(f.fraisAn)
  } else if (fav.kind === 'etablissement' && etablissements.some((x) => x.id === fav.id)) {
    const e = etablissementDe(fav.id)
    ;[image, badge, title, to, cta] = [fav.vignette ?? e.image, t('row.badges.etablissement'), e.nom, ecoleUrl(e), t('row.voirEtablissement')]
    left = <p className="flex items-center gap-2 text-[15px] text-navy-900"><MapPin className="size-5" />{e.ville} – {e.quartier}</p>
    right = (
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-[16px] text-navy-900"><Star className="size-5 fill-amber-400 text-amber-400" />{t('row.note', { note: num(e.note), count: e.avis })}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1 text-[14px] font-semibold text-white">
          <CircleCheck className="size-5 fill-white text-emerald-700" />
          {t('row.etablissementVerifie')}
        </span>
      </div>
    )
  } else if (fav.kind === 'auto-ecole' && autoEcoles.some((x) => x.id === fav.id)) {
    const a = autoEcoleDe(fav.id)
    ;[image, badge, title, to, cta] = [a.image, t('row.badges.etablissement'), a.nom, ROUTES.drivingSchool(a.id), t('row.voirEtablissement')]
    left = <p className="flex items-center gap-2 text-[15px] text-navy-900"><MapPin className="size-5" />{a.ville} – {a.quartier}</p>
    right = <p className="flex items-center gap-1.5 text-[16px] text-navy-900"><Star className="size-5 fill-amber-400 text-amber-400" />{t('row.note', { note: num(a.note), count: a.avis })}</p>
  } else if (fav.kind === 'permis') {
    const [aeId, code] = fav.id.split(':')
    const a = autoEcoleDe(aeId)
    const p = permisCatalogue[code as PermisCode] ?? permisCatalogue.B
    ;[image, title, to] = [p.image, t('row.permisTitre', { code: p.code, nom: t(`row.permis.${p.code}`) }), ROUTES.license(a.id, p.code)]
    left = (
      <>
        <p className="flex items-center gap-2 text-[15px] text-navy-900"><Car className="size-5" />{a.nom}</p>
        <p className="flex items-center gap-2 text-[15px] text-navy-900"><CalendarDays className="size-5" />{t(`row.duree.${p.code}`)}</p>
      </>
    )
    right = (
      <>
        <p className="text-[14px] text-navy-900">{t('row.tarifFormation')}</p>
        <p className="mt-1 rounded-full bg-[#e8efff] px-4 py-1.5 text-[18px] font-extrabold text-navy-800">{fcfa(p.prix)}</p>
      </>
    )
  } else return null
  return (
    <div className={cn(card, 'relative flex flex-col gap-4 p-3 xl:flex-row xl:items-center')}>
      <Img src={image} alt={title} className="h-32 w-full rounded-xl xl:h-[100px] xl:w-[194px]" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="inline-block rounded-full bg-brand-600 px-3 py-0.5 text-[13px] font-semibold text-white">{badge}</span>
        <Link to={to} className="block text-[20px] font-bold text-navy-900 hover:text-brand-600">{title}</Link>
        {left}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-line xl:min-w-[420px] xl:flex-nowrap xl:self-stretch xl:border-l xl:pl-8">
        <div className="flex-1">{right}</div>
        <Link to={to} className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-6 text-[15px] font-semibold whitespace-nowrap text-navy-800 hover:bg-brand-50">
          {cta}
          <ArrowRight className="size-5" />
        </Link>
      </div>
      <button type="button" aria-label={t('row.retirer')} onClick={onRemove} className="absolute top-3 right-5">
        <Heart className="size-7 fill-rose-600 text-rose-600" />
      </button>
    </div>
  )
}

/** Une publication de l'accueil mise en favoris : titre, auteur, date ; le cœur la retire. */
function PublicationFavorite({ enregistrement }: { enregistrement: Enregistrement }) {
  const { t } = useTranslation('favorites')
  const publication = usePublications().find((p) => p.id === enregistrement.publicationId)
  const experts = useExperts()
  if (!publication) return null
  const auteur = experts.find((x) => x.id === publication.auteurId)?.nom
  const titre = publication.titre || publication.texte.split('\n')[0]
  const retirer = async () => {
    await data.remove('enregistrements', enregistrement.id)
    toast.success(t('row.publicationRetiree'))
  }
  return (
    <div className={cn(card, 'relative flex flex-col gap-4 p-3 xl:flex-row xl:items-center')}>
      <Img src={publication.image ?? ''} alt="" className="h-32 w-full rounded-xl xl:h-[100px] xl:w-[194px]" />
      <div className="min-w-0 flex-1 space-y-1.5 pr-10">
        <span className="inline-block rounded-full bg-violet-600 px-3 py-0.5 text-[13px] font-semibold text-white">{t('row.publication')}</span>
        <Link to={ROUTES.publication(publication.id)} className="line-clamp-2 block text-[20px] font-bold text-navy-900 hover:text-brand-600">
          {titre}
        </Link>
        <p className="text-[15px] text-muted">
          {auteur} · {shortDate(publication.publieeLe, { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <Link to={ROUTES.publication(publication.id)} className="inline-flex h-10 items-center gap-2 self-start rounded-full border-2 border-brand-600/60 px-6 text-[15px] font-semibold whitespace-nowrap text-navy-800 hover:bg-brand-50 xl:self-center">
        {t('row.lire')}
        <ArrowRight className="size-5" />
      </Link>
      <button type="button" aria-label={t('row.retirer')} onClick={() => void retirer()} className="absolute top-3 right-5">
        <Heart className="size-7 fill-rose-600 text-rose-600" />
      </button>
    </div>
  )
}
