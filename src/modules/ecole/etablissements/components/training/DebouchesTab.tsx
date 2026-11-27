import { useTranslation } from 'react-i18next'
import { BarChart3, Briefcase, Building2, Calculator, ChevronRight, ClipboardCheck, Coins, Factory, Handshake, Landmark, Network, ShieldCheck, ShoppingCart, TrendingUp, UserRound, Users } from 'lucide-react'
import { Heading } from '@/modules/ecole/etablissements/components/training/TrainingUi'
import { card, soft } from '@/modules/ecole/etablissements/components/training/trainingShared'
import type { Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

/** Onglet « Débouchés » d'une formation. */
export function DebouchesTab({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  const metiers = [
    { t: t('formationDetail.jobs.comptable'), icon: <Calculator />, c: 'bg-[#e3edff] text-brand-600' },
    { t: t('formationDetail.jobs.assistantGestion'), icon: <BarChart3 />, c: 'bg-[#fff0dc] text-orange-500' },
    { t: t('formationDetail.jobs.gestionnaireTresorerie'), icon: <Coins />, c: 'bg-[#fff6d6] text-amber-500' },
    { t: t('formationDetail.jobs.assistantControle'), icon: <ClipboardCheck />, c: 'bg-[#efe6ff] text-violet-600' },
    { t: t('formationDetail.jobs.collaborateurCabinet'), icon: <Users />, c: 'bg-[#e3edff] text-brand-600' },
  ]
  const secteurs = [
    { icon: <Building2 />, t: [t('formationDetail.debouches.sectorTiles.entreprises1'), t('formationDetail.debouches.sectorTiles.entreprises2')] },
    { icon: <Landmark />, t: [t('formationDetail.debouches.sectorTiles.banques1'), t('formationDetail.debouches.sectorTiles.banques2')] },
    { icon: <Handshake />, t: [t('formationDetail.debouches.sectorTiles.cabinets1'), t('formationDetail.debouches.sectorTiles.cabinets2')] },
    { icon: <ShoppingCart />, t: [t('formationDetail.debouches.sectorTiles.commerce1'), t('formationDetail.debouches.sectorTiles.commerce2')] },
  ]
  const etapes = [
    { t: [t('formationDetail.debouches.steps.comptable')], icon: <Briefcase />, c: 'bg-[#e8f0ff] text-brand-600', bar: 'bg-brand-500' },
    { t: [t('formationDetail.debouches.steps.chef1'), t('formationDetail.debouches.steps.chef2')], icon: <UserRound />, c: 'bg-[#f1e9ff] text-violet-600', bar: 'bg-violet-500' },
    { t: [t('formationDetail.debouches.steps.controleur1'), t('formationDetail.debouches.steps.controleur2')], icon: <Network />, c: 'bg-[#fff2df] text-orange-500', bar: 'bg-amber-400' },
    { t: [t('formationDetail.debouches.steps.raf1'), t('formationDetail.debouches.steps.raf2'), t('formationDetail.debouches.steps.raf3')], icon: <ShieldCheck />, c: 'bg-[#e4f7ea] text-emerald-600', bar: 'bg-emerald-500' },
  ]
  return (
    <div className="grid gap-4 xl:grid-cols-[350px_1fr]">
      <div className={cn(card, 'p-4')}>
        <Heading icon={<Briefcase />} className="text-[23px] [&_svg]:size-7">{t('formationDetail.debouches.jobsTitle')}</Heading>
        <p className="mt-2 text-[14px] text-navy-900">{t('formationDetail.debouches.jobsIntro', { name: f.nom })}</p>
        <ul className="mt-3 space-y-2">
          {metiers.map((m) => (
            <li key={m.t} className={cn(soft, 'flex items-center gap-3 px-2 py-2 text-[14.5px] font-semibold text-navy-900')}>
              <span className={cn('grid size-10 place-items-center rounded-lg [&_svg]:size-6', m.c)}>{m.icon}</span>
              {m.t}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Factory />}>{t('formationDetail.debouches.sectors')}</Heading>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {secteurs.map((s) => (
              <div key={s.t[0]} className={cn(soft, 'flex flex-col items-center gap-2 px-2 py-3 text-center text-[13.5px] leading-tight text-navy-900 [&_svg]:size-8 [&_svg]:text-brand-600')}>
                {s.icon}
                <span>
                  {s.t[0]}
                  <span className="block">{s.t[1]}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={cn(card, 'p-4')}>
          <Heading icon={<TrendingUp />} className="text-[22px]">{t('formationDetail.debouches.career')}</Heading>
          <p className="mt-1 text-[14px] text-navy-900">{t('formationDetail.debouches.careerIntro')}</p>
          <ol className="mt-3 flex flex-wrap items-center gap-2">
            {etapes.map((e, i) => (
              <li key={e.t.join(' ')} className="flex flex-1 items-center gap-2">
                <div className={cn('flex min-h-[120px] min-w-[104px] flex-1 flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center text-[14px] leading-tight font-semibold text-navy-900 [&_svg]:size-7', e.c)}>
                  {e.icon}
                  <span>
                    {e.t.map((x) => (
                      <span key={x} className="block">{x}</span>
                    ))}
                  </span>
                  <span className={cn('mt-1 h-1 w-3/4 rounded-full', e.bar)} />
                </div>
                {i < etapes.length - 1 && <ChevronRight className="size-5 shrink-0 text-brand-600" />}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
