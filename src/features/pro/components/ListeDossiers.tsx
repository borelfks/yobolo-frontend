import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CalendarDays, CircleCheck, CircleX, FolderOpen, Hourglass, Inbox, Search, UserRound } from 'lucide-react'
import { Kpi, KpiGrid } from '@/shared/components/ui/Blocks'
import { BadgeDossier } from '@/shared/components/ui/BadgeDossier'
import { Pagination } from '@/shared/components/ui/Pagination'
import { Select } from '@/shared/components/forms/Fields'
import { proCard } from '@/features/pro/proStyles'
import { CLE_STATUT, dossierATraiter, dossierOuvert, STATUTS_DOSSIER } from '@/shared/utils/dossiers'
import { cn } from '@/shared/utils/cn'
import { shortDate } from '@/shared/utils/format'
import type { StatutDossier } from '@/shared/types'

/** Une ligne du tableau : un dossier reçu (préinscription ou inscription en auto-école). */
export type LigneDossier = { id: string; candidat: string; telephone?: string; objet: string; envoyeeLe: string; statut: StatutDossier; vers: string }

const PAR_PAGE = 8
const DATE = { day: '2-digit', month: 'short', year: 'numeric' } as const

/**
 * Les dossiers reçus par l'établissement : chiffres, recherche, filtres
 * (formation ou permis, statut), tableau. Les plus récents d'abord ; ceux
 * « à traiter » sont signalés.
 */
export function ListeDossiers({ lignes, objetLabel, objetIcone }: { lignes: LigneDossier[]; objetLabel: string; objetIcone: ReactNode }) {
  const { t } = useTranslation('pro')
  const { t: tc } = useTranslation()
  const [q, setQ] = useState('')
  const [objet, setObjet] = useState('')
  const [statut, setStatut] = useState('')
  const [page, setPage] = useState(1)
  const triees = [...lignes].sort((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))
  const filtrees = triees.filter((l) => l.candidat.toLowerCase().includes(q.trim().toLowerCase()) && (!objet || l.objet === objet) && (!statut || l.statut === statut))
  const pages = Math.max(1, Math.ceil(filtrees.length / PAR_PAGE))
  const visibles = filtrees.slice((page - 1) * PAR_PAGE, page * PAR_PAGE)
  const compte = (f: (s: StatutDossier) => boolean) => lignes.filter((l) => f(l.statut)).length
  const changer = (fixer: (v: string) => void) => (v: string) => {
    fixer(v)
    setPage(1)
  }
  return (
    <div className="space-y-3.5">
      <KpiGrid cols={5}>
        <Kpi icon={<FolderOpen />} label={t('dossiers.kpis.total')} value={lignes.filter((l) => l.statut !== 'Annulée').length} />
        <Kpi icon={<Inbox />} label={t('dossiers.kpis.aTraiter')} value={compte(dossierATraiter)} tone="orange" />
        <Kpi icon={<Hourglass />} label={t('dossiers.kpis.enCours')} value={compte((s) => dossierOuvert(s) && !dossierATraiter(s))} tone="sky" />
        <Kpi icon={<CircleCheck />} label={t('dossiers.kpis.acceptes')} value={compte((s) => s === 'Acceptée')} tone="green" />
        <Kpi icon={<CircleX />} label={t('dossiers.kpis.refuses')} value={compte((s) => s === 'Refusée')} tone="red" />
      </KpiGrid>
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" aria-hidden="true" />
          <input value={q} onChange={(e) => changer(setQ)(e.target.value)} placeholder={t('dossiers.search')} aria-label={t('dossiers.search')} className="h-11 w-full rounded-full border border-[#c9d4ea] bg-white pr-4 pl-11 text-[14.5px] focus:ring-3 focus:ring-brand-100" />
        </label>
        <Select aria-label={objetLabel} value={objet} onChange={(e) => changer(setObjet)(e.target.value)} options={[{ value: '', label: t('dossiers.tous', { label: objetLabel }) }, ...[...new Set(lignes.map((l) => l.objet))].map((o) => ({ value: o, label: o }))]} className="h-11 rounded-full" />
        <Select aria-label={t('dossiers.table.statut')} value={statut} onChange={(e) => changer(setStatut)(e.target.value)} options={[{ value: '', label: t('dossiers.tousStatuts') }, ...STATUTS_DOSSIER.map((s) => ({ value: s, label: tc(`dossier.statuts.${CLE_STATUT[s]}`) }))]} className="h-11 rounded-full" />
      </div>
      {lignes.length === 0 ? (
        <div className={cn(proCard, 'p-8 text-center text-sm text-muted')}>{t('dossiers.aucun')}</div>
      ) : filtrees.length === 0 ? (
        <div className={cn(proCard, 'p-8 text-center text-sm text-muted')}>{t('dossiers.vide')}</div>
      ) : (
        <div className={cn(proCard, 'overflow-hidden')}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[14.5px] text-navy-900">
              <thead>
                <tr className="bg-[#eef3fc] text-left text-[15px] font-bold">
                  <th className="py-3 pl-5">{t('dossiers.table.candidat')}</th>
                  <th>{objetLabel}</th>
                  <th>{t('dossiers.table.envoyee')}</th>
                  <th>{t('dossiers.table.statut')}</th>
                  <th className="pr-5 text-right">{t('dossiers.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((l) => (
                  <tr key={l.id} className={cn('border-t border-line', dossierATraiter(l.statut) && 'bg-orange-50/40')}>
                    <td className="py-2.5 pl-5">
                      <span className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eef3fc] text-brand-600"><UserRound className="size-5" aria-hidden="true" /></span>
                        <span className="leading-tight">
                          <Link to={l.vers} className="block font-bold text-navy-800 hover:text-brand-600">{l.candidat}</Link>
                          {l.telephone && <span className="text-[13px] text-muted">{l.telephone}</span>}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-brand-600">
                        {objetIcone}
                        {l.objet}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <CalendarDays className="size-4 text-brand-600" aria-hidden="true" />
                        {shortDate(l.envoyeeLe, DATE)}
                      </span>
                    </td>
                    <td><BadgeDossier statut={l.statut} /></td>
                    <td className="pr-5 text-right">
                      <Link to={l.vers} className="inline-flex h-9 items-center rounded-full bg-[#eef3fc] px-4 text-[13.5px] font-semibold text-navy-800 hover:bg-brand-100">
                        {dossierATraiter(l.statut) ? t('dossiers.table.traiter') : t('dossiers.table.voir')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Pagination label={t('dossiers.count', { shown: visibles.length, total: filtrees.length, count: filtrees.length })} pages={pages} page={page} onChange={setPage} />
    </div>
  )
}
