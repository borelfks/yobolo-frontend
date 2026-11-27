import { useState } from 'react'
import { Lien } from '@/shared/ui/Lien'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Award, BarChart3, CalendarDays, GraduationCap, Info, Layers, Search, Sun } from 'lucide-react'
import { FavoriteButton } from '@/shared/ui/FavoriteButton'
import { SearchField } from '@/shared/ui/SearchField'
import { Img } from '@/shared/ui/Img'
import { Select } from '@/shared/forms/Fields'
import { formationUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { FavoriteWide } from '@/modules/ecole/etablissements/components/profile/ActionButtons'
import { card, principales } from '@/modules/ecole/etablissements/components/profile/profileShared'
import { modeKey } from '@/modules/ecole/etablissements/components/training/trainingShared'
import { useEtablissement, useFormationsOf } from '@/data/hooks'
import type { Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

function FormationLine({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  const pill = {
    Jour: { cls: 'bg-[#fff3cf]', icon: <Sun className="size-4 fill-amber-400 text-amber-500" /> },
    Soir: { cls: 'bg-[#ece6ff]', icon: <MoonIcon /> },
    'Jour & Soir': { cls: 'bg-[#fde7ef]', icon: <Sun className="size-4 fill-amber-400 text-amber-500" /> },
  }[f.mode]
  return (
    <div className={cn(card, 'relative flex flex-col gap-4 p-2.5 sm:flex-row sm:items-center')}>
      <Img src={f.image} alt={f.nom} className="h-32 w-full rounded-xl sm:h-[82px] sm:w-[162px]" />
      <div className="min-w-0 flex-1 space-y-2">
        <Lien to={formationUrl(f)} className="text-[18px] font-bold text-navy-800 hover:text-brand-600">
          {f.nom}
        </Lien>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] text-navy-900">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8efff] px-2.5 py-0.5">
            <GraduationCap className="size-4" />
            {f.diplome}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-4" />
            {f.filiere}
          </span>
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-navy-900">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {t('shared.months', { count: f.dureeMois })}
          </span>
          <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-0.5 font-medium', pill.cls)}>
            {pill.icon}
            {t(`shared.modePills.${modeKey[f.mode]}`)}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4 border-line sm:self-stretch sm:border-l sm:pl-7 sm:pr-10">
        <Lien to={formationUrl(f)} className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700">
          {t('ecoleProfil.formations.seeDetails')}
          <ArrowRight className="size-4" />
        </Lien>
      </div>
      <FavoriteButton id={f.id} kind="formation" size="sm" className="absolute top-2.5 right-3 bg-transparent shadow-none ring-0" />
    </div>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-navy-800" aria-hidden>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  )
}

/** Onglet « Formations » de la fiche établissement. */
export function FormationsTab({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const all = useFormationsOf(id).filter((f) => f.statut === 'Publiée')
  const [q, setQ] = useState('')
  const list = all.filter((f) => f.nom.toLowerCase().includes(q.toLowerCase()))
  const diplomes = [...new Set(all.map((f) => f.diplome))]
  const fil = principales(e)
  return (
    <div className="grid gap-4 lg:grid-cols-[258px_1fr]">
      <div className={cn(card, 'h-fit space-y-3 p-4')}>
        <h2 className="flex items-center gap-2 text-[18px] font-bold text-navy-900">
          <Info className="size-5 text-brand-600" /> {t('ecoleProfil.formations.about', { sigle: e.sigle })}
        </h2>
        <ul className="space-y-1.5 text-[14px] text-navy-900 [&_svg]:size-[18px]">
          <li className="flex items-center gap-2.5"><GraduationCap />{t('ecoleProfil.formations.formationsCount', { count: e.formations })}</li>
          <li className="flex items-center gap-2.5"><Layers />{t('ecoleProfil.formations.fieldsCount', { count: fil.length })}</li>
          <li className="flex items-center gap-2.5"><Award />{diplomes.join(', ')}</li>
          <li className="flex items-center gap-2.5"><CalendarDays />{t('ecoleProfil.formations.coursJourSoir')}</li>
        </ul>
        <h3 className="flex items-center gap-2 border-t border-line pt-3 text-[17px] font-bold text-navy-900">
          <BarChart3 className="size-5 text-brand-600" /> {t('ecoleProfil.formations.mainFields')}
        </h3>
        <div className="space-y-1.5">
          {fil.map((f) => (
            <span key={f} className="block rounded-full bg-[#e8efff] px-4 py-1 text-[14px] text-navy-900">{f}</span>
          ))}
        </div>
        <FavoriteWide id={id} />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-3 text-[24px] font-bold text-navy-900">
            <GraduationCap className="size-8" /> {t('ecoleProfil.formations.ourTrainings', { n: e.formations })}
          </h2>
          <span className="flex items-center gap-2 text-sm">
            {t('shared.sortBy')}
            <span className="w-44"><Select aria-label={t('shared.sortByAria')} options={[t('ecoleProfil.formations.sort.pertinence'), t('ecoleProfil.formations.sort.duree')]} className="h-10" /></span>
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
            <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder={t('ecoleProfil.formations.searchPlaceholder')} className="h-[46px] w-full rounded-full border border-line bg-white pr-4 pl-11 text-[14px] outline-none focus:ring-3 focus:ring-brand-100" />
          </label>
          <SearchField icon={<Layers />} label={t('ecoleProfil.formations.filiere')} hint={t('ecoleProfil.formations.toutes')} options={fil} className="h-[46px] border border-line" />
          <SearchField icon={<Award />} label={t('ecoleProfil.formations.diplome')} hint={t('ecoleProfil.formations.tous')} options={diplomes} className="h-[46px] border border-line" />
          <SearchField icon={<CalendarDays />} label={t('ecoleProfil.formations.cours')} hint={t('ecoleProfil.formations.tous')} options={[t('shared.modes.jour'), t('shared.modes.soir'), t('shared.modes.jourEtSoir')]} className="h-[46px] border border-line" />
        </div>
        {list.map((f) => (
          <FormationLine key={f.id} f={f} />
        ))}
      </div>
    </div>
  )
}
