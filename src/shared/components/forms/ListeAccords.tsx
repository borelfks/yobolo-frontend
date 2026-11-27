import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { ChampsAccord } from '@/shared/components/forms/ChampsAccord'
import { accordVide, type AccordSaisi, type ErreursAccord } from '@/shared/utils/accords'
import type { NatureAccord } from '@/shared/types'

/**
 * Les accords d'une nature (création ou ouverture), remplis sur la page : un bloc
 * par accord (« Retirer » s'il y en a plusieurs) et « Ajouter un autre accord… ».
 * Création du compte école et Profil › Agrément & documents.
 */
export function ListeAccords({
  nature,
  saisis,
  onChange,
  erreurs,
  etat,
  onVoir,
}: {
  nature: NatureAccord
  saisis: AccordSaisi[]
  onChange: (liste: AccordSaisi[]) => void
  erreurs: (i: number) => ErreursAccord
  /** Un badge d'état à côté du titre du bloc (accord enregistré). */
  etat?: (a: AccordSaisi) => ReactNode
  /** Ouvrir le document déjà joint d'un accord enregistré. */
  onVoir?: (a: AccordSaisi) => (() => void) | undefined
}) {
  const { t: tc } = useTranslation('common', { keyPrefix: 'accords' })
  const idTitre = `titre-accords-${nature}`
  return (
    <section className="space-y-3" aria-labelledby={idTitre}>
      <div>
        <h3 id={idTitre} className="text-[16px] font-bold text-navy-900">{tc(`natures.${nature}.titre`)}</h3>
        <p className="text-[13.5px] text-muted">{tc(`natures.${nature}.aide`)}</p>
      </div>
      {saisis.map((a, i) => (
        <div key={a.id ?? `nouveau-${i}`} role="group" aria-label={tc(`natures.${nature}.bloc`, { n: i + 1 })} className="space-y-3 rounded-2xl border border-line p-4">
          <div className="flex flex-wrap items-center gap-2">
            <b className="text-[15px] text-navy-900">{tc(`natures.${nature}.bloc`, { n: i + 1 })}</b>
            {etat?.(a)}
            {saisis.length > 1 && (
              <button type="button" onClick={() => onChange(saisis.filter((_, k) => k !== i))} className="ml-auto rounded-full px-2 py-1 text-[13.5px] font-semibold text-rose-600 hover:bg-rose-50">
                {tc('retirer')}
              </button>
            )}
          </div>
          <ChampsAccord valeur={a} onChange={(v) => onChange(saisis.map((x, k) => (k === i ? v : x)))} erreurs={erreurs(i)} onVoir={onVoir?.(a)} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...saisis, accordVide()])} className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-[14.5px] font-semibold text-brand-600 hover:bg-brand-50">
        <Plus className="size-4" aria-hidden /> {tc(`natures.${nature}.ajouter`)}
      </button>
    </section>
  )
}
