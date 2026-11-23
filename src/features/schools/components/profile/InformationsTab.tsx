import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowRight, Award, Briefcase, Building2, CalendarDays, GraduationCap, Info, Layers, Mail, Map as MapIcon, MapPin, Phone, Sun, Target, Trophy, Users, Wallet } from 'lucide-react'
import { ActionButtons } from '@/features/schools/components/profile/ActionButtons'
import { card } from '@/features/schools/components/profile/profileShared'
import { useEtablissement, useFormationsOf } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'

type SectionId = 'presentation' | 'admission' | 'frais' | 'calendrier' | 'contact'

const sections: { id: SectionId; icon: ReactNode }[] = [
  { id: 'presentation', icon: <Info /> },
  { id: 'admission', icon: <GraduationCap /> },
  { id: 'frais', icon: <Wallet /> },
  { id: 'calendrier', icon: <CalendarDays /> },
  { id: 'contact', icon: <MapPin /> },
]

const assets = ['a1', 'a2', 'a3', 'a4'] as const

/** Onglet « Informations » de la fiche établissement. */
export function InformationsTab({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const list = useFormationsOf(id).filter((f) => f.statut === 'Publiée')
  const [sec, setSec] = useState<SectionId>('presentation')
  return (
    <div className="grid gap-4 lg:grid-cols-[294px_1fr_336px]">
      <div className="space-y-4">
        <div className={cn(card, 'space-y-2 p-3')}>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSec(s.id)}
              className={cn('flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-[15.5px] font-semibold [&_svg]:size-6', sec === s.id ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}
            >
              {s.icon}
              {t(`ecoleProfil.informations.sections.${s.id}`)}
            </button>
          ))}
        </div>
        <div className={cn(card, 'p-4')}>
          <ActionButtons id={id} />
        </div>
      </div>
      <div className={cn(card, 'p-5')}>
        {sec === 'presentation' ? (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
              <Info className="size-6 text-brand-600" /> {t('ecoleProfil.informations.presentationTitle')}
            </h2>
            <p className="text-[15px] leading-relaxed text-ink">{t('ecoleProfil.informations.presentationText', { name: e.nom })}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: <Trophy className="text-amber-500" />, t: [t('ecoleProfil.informations.tiles.qualite1'), t('ecoleProfil.informations.tiles.qualite2')] },
                { icon: <Users className="text-brand-600" />, t: [t('ecoleProfil.informations.tiles.enseignants1'), t('ecoleProfil.informations.tiles.enseignants2')] },
                { icon: <Briefcase className="text-brand-600" />, t: [t('ecoleProfil.informations.tiles.stages1'), t('ecoleProfil.informations.tiles.stages2')] },
              ].map((x) => (
                <div key={x.t[0]} className="flex items-center justify-center gap-3 rounded-xl bg-[#eef3fc] px-3 py-2.5 text-[14px] leading-tight font-semibold text-navy-900 [&_svg]:size-8">
                  {x.icon}
                  <span>
                    {x.t[0]}
                    <span className="block">{x.t[1]}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-line pt-3">
              <h3 className="flex items-center gap-2.5 text-[18px] font-bold text-navy-900">
                <Target className="size-6 text-brand-600" /> {t('ecoleProfil.informations.mission')}
              </h3>
              <p className="mt-1 pl-9 text-[13.5px] text-ink">{t('ecoleProfil.informations.missionText')}</p>
            </div>
            <div className="border-t border-line pt-3">
              <h3 className="flex items-center gap-2.5 text-[18px] font-bold text-navy-900">
                <Target className="size-6 text-brand-600" /> {t('ecoleProfil.informations.assets')}
              </h3>
              <ul className="mt-1.5 space-y-1 pl-2 text-[13.5px] text-navy-900">
                {assets.map((a) => (
                  <li key={a} className="flex items-center gap-2.5">
                    <CheckMark />
                    {t(`ecoleProfil.informations.assetsList.${a}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <InfoSection sec={sec} id={id} />
        )}
      </div>
      <div className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Building2 className="size-6 text-brand-600" /> {t('ecoleProfil.informations.general')}
          </h2>
          <dl className="mt-2 divide-y divide-line text-[14.5px]">
            {[
              { icon: <Award />, k: t('ecoleProfil.informations.statut'), v: t('ecoleProfil.informations.statutValue') },
              { icon: <Layers />, k: t('ecoleProfil.informations.diplomes'), v: [...new Set(list.map((f) => f.diplome))].join(', ') },
              { icon: <Sun className="fill-amber-400 text-amber-500" />, k: t('ecoleProfil.informations.cours'), v: t('shared.modes.jourEtSoir') },
              { icon: <CalendarDays />, k: t('ecoleProfil.informations.rentree'), v: e.rentree },
            ].map((r) => (
              <div key={r.k} className="grid grid-cols-[22px_74px_10px_1fr] items-center gap-1.5 py-2 [&_svg]:size-5 [&_svg]:text-navy-800">
                {r.icon}
                <dt className="font-bold text-navy-900">{r.k}</dt>
                <span>:</span>
                <dd className="text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <MapPin className="size-6 text-brand-600" /> {t('ecoleProfil.informations.contactTitle')}
          </h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold text-navy-900">
            <li className="flex items-center gap-3 rounded-lg bg-[#f5f8fd] px-3 py-1.5"><Phone className="size-5" />{e.telephone}</li>
            <li className="flex items-center gap-3 rounded-lg px-3 py-1.5 font-medium"><Mail className="size-5" />{e.email}</li>
            <li className="flex items-center gap-3 rounded-lg bg-[#f5f8fd] px-3 py-1.5 font-medium"><MapPin className="size-5" />{e.ville} – {e.quartier}</li>
          </ul>
          <button type="button" onClick={() => toast(t('ecoleProfil.informations.mapToast'))} className="mt-3 flex h-11 w-full items-center justify-center gap-3 rounded-full border-2 border-brand-600/70 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
            <MapIcon className="size-5" />
            {t('ecoleProfil.informations.seeOnMap')}
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  )
}

function InfoSection({ sec, id }: { sec: Exclude<SectionId, 'presentation'>; id: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const r = (k: RowId) => t(`ecoleProfil.informations.rows.${k}`)
  const rows: Record<Exclude<SectionId, 'presentation'>, [string, string][]> = {
    admission: [
      [r('niveau'), r('niveauValue')],
      [r('selection'), r('selectionValue')],
      [r('periode'), r('periodeValue')],
      [r('pieces'), r('piecesValue')],
    ],
    frais: [
      [r('fraisInscription'), r('fraisInscriptionValue')],
      [r('fraisScolarite'), r('fraisScolariteValue')],
      [r('modalites'), r('modalitesValue')],
      [r('paiement'), r('paiementValue')],
    ],
    calendrier: [
      [r('ouverture'), r('ouvertureValue')],
      [r('cloture'), r('clotureValue')],
      [r('rentree'), e.rentree],
      [r('examens'), r('examensValue')],
    ],
    contact: [
      [r('telephone'), e.telephone],
      [r('email'), e.email],
      [r('adresse'), `${e.quartier}, ${e.ville}`],
      [r('horaires'), r('horairesValue')],
    ],
  }
  return (
    <div className="space-y-3">
      <h2 className="text-[21px] font-bold text-navy-900">{t(`ecoleProfil.informations.sections.${sec}`)}</h2>
      <dl className="divide-y divide-line">
        {rows[sec].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3 text-[14.5px]">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-semibold text-navy-900">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

type RowId = keyof (typeof import('@/features/schools/locales/fr.json'))['ecoleProfil']['informations']['rows']
