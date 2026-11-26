import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Car, Check, Coins, Info } from 'lucide-react'
import { ProCard, ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { usePermisCatalogue } from '@/data/hooks'
import { data } from '@/data'
import { permisIcon } from '@/features/driving-schools/autoEcoleRules'
import { Button } from '@/shared/components/ui/Button'
import { Img } from '@/shared/components/ui/Img'
import { Switch } from '@/shared/components/forms/Fields'
import { proCard, proInput } from '@/features/pro/proStyles'
import { cn } from '@/shared/utils/cn'
import { fcfa } from '@/shared/utils/format'
import type { PermisCode } from '@/shared/types'

/** Prix acceptés pour un permis (FCFA). */
const PRIX_MIN = 10_000
const PRIX_MAX = 3_000_000

type Ligne = { propose: boolean; prix: string }

/**
 * « Permis & tarifs » : les permis que l'auto-école enseigne et leur prix.
 * Enregistré, cela change sa fiche publique (Aperçu, Formation & Permis,
 * Tarifs, fiche de chaque permis, inscription).
 */
export function PermisTarifs() {
  const { t } = useTranslation('pro')
  const { t: tae } = useTranslation('driving-schools')
  const { autoEcole } = useMonEcole()
  const catalogue = usePermisCatalogue()
  const codes = (Object.keys(catalogue) as PermisCode[]).sort()
  const depart = (c: PermisCode): Ligne => ({ propose: !!autoEcole?.permis.includes(c), prix: String(autoEcole?.tarifs?.[c] ?? catalogue[c].prixFiche ?? catalogue[c].prix) })
  const [saisie, setSaisie] = useState<Partial<Record<PermisCode, Ligne>>>({})
  const ligne = (c: PermisCode) => saisie[c] ?? depart(c)
  const changer = (c: PermisCode, l: Partial<Ligne>) => setSaisie((s) => ({ ...s, [c]: { ...ligne(c), ...l } }))
  const prixValide = (v: string) => /^\d+$/.test(v) && Number(v) >= PRIX_MIN && Number(v) <= PRIX_MAX
  if (!autoEcole) return null

  const enregistrer = async () => {
    const proposes = codes.filter((c) => ligne(c).propose)
    if (proposes.length === 0) return void toast.error(t('autoEcole.tarifs.aucun'))
    if (proposes.some((c) => !prixValide(ligne(c).prix))) return void toast.error(t('autoEcole.tarifs.prixInvalide', { min: fcfa(PRIX_MIN), max: fcfa(PRIX_MAX) }))
    const tarifs = Object.fromEntries(proposes.map((c) => [c, Number(ligne(c).prix)]))
    await data.update('autoEcoles', autoEcole.id, { permis: proposes, tarifs })
    setSaisie({})
    toast.success(t('autoEcole.tarifs.enregistre'))
  }

  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={[{ label: t('autoEcole.tarifs.crumb') }]} icon={<Car />} title={t('autoEcole.tarifs.title')} subtitle={t('autoEcole.tarifs.subtitle')} />
      <div className="grid gap-4 md:grid-cols-2">
        {codes.map((c) => {
          const p = catalogue[c]
          const l = ligne(c)
          const Icone = permisIcon[c]
          const invalide = l.propose && !prixValide(l.prix)
          return (
            <div key={c} className={cn(proCard, 'flex gap-4 p-4', !l.propose && 'opacity-70')}>
              <Img src={p.tarifImage} alt="" className="hidden h-24 w-32 shrink-0 rounded-xl sm:block" />
              <div className="min-w-0 flex-1 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-[18px] font-bold text-navy-900">
                      <Icone className="size-6 text-brand-600" aria-hidden="true" />
                      {tae('common.licence', { code: c })}
                    </p>
                    <p className="text-[13.5px] text-navy-900">{tae(`permis.${c}.name`)} · {tae(`permis.${c}.duration`)}</p>
                  </div>
                  <Switch checked={l.propose} onChange={(v) => changer(c, { propose: v })} ariaLabel={t('autoEcole.tarifs.propose', { code: c })} />
                </div>
                <label className="block">
                  <ProLabel required={l.propose}>{t('autoEcole.tarifs.prix')}</ProLabel>
                  <span className="relative block">
                    <Coins className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" aria-hidden="true" />
                    <input
                      inputMode="numeric"
                      value={l.prix}
                      disabled={!l.propose}
                      aria-invalid={invalide || undefined}
                      onChange={(e) => changer(c, { prix: e.target.value.replace(/\D/g, '').slice(0, 7) })}
                      className={cn(proInput, 'pr-16 pl-11 disabled:bg-slate-50', invalide && 'border-rose-500')}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-muted">FCFA</span>
                  </span>
                  {invalide && <span className="mt-1 block text-xs font-medium text-rose-600">{t('autoEcole.tarifs.prixInvalide', { min: fcfa(PRIX_MIN), max: fcfa(PRIX_MAX) })}</span>}
                </label>
              </div>
            </div>
          )
        })}
      </div>
      <ProCard title={t('autoEcole.tarifs.noteTitre')} icon={<Info />}>
        <p className="mt-1 text-sm text-navy-900">{t('autoEcole.tarifs.note')}</p>
      </ProCard>
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={() => setSaisie({})}>
          {t('footer.cancel')}
        </Button>
        <Button onClick={() => void enregistrer()}>
          <Check strokeWidth={3} />
          {t('autoEcole.tarifs.enregistrer')}
        </Button>
      </div>
    </div>
  )
}
