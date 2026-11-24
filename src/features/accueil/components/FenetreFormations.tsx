import { ArrowRight, CarFront, GraduationCap } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useAutoEcoles, useEtablissements, useFormations, useMesInscriptions } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const CLASSES_LIGNE =
  'group flex items-center gap-3 rounded-xl border border-line bg-white p-3 transition-colors hover:border-brand-600/30 hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

/**
 * « Mes formations » : les préinscriptions (table `preinscriptions`) et les
 * inscriptions en auto-école (table `inscriptionsAutoEcole`) envoyées par le
 * compte, chacune avec un lien vers sa formation ou son permis.
 */
export function FenetreFormations({ onFermer }: { onFermer: () => void }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const { preinscriptions, inscriptionsAutoEcole } = useMesInscriptions(account?.id)
  const formations = useFormations()
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  const vide = preinscriptions.length === 0 && inscriptionsAutoEcole.length === 0

  return createPortal(
    <Modal open onClose={onFermer} size="lg" icon={<GraduationCap className="mt-1 size-5 text-brand-600" aria-hidden="true" />} title={t('mesFormations.titre')}>
      {vide ? (
        <div className="flex flex-col items-start gap-3 rounded-xl bg-page p-4">
          <p className="text-sm text-muted">{t('mesFormations.aucune')}</p>
          <Button to={ROUTES.schools} size="sm" onClick={onFermer}>
            {t('mesFormations.trouver')}
          </Button>
        </div>
      ) : (
        <div className="flex max-h-[60dvh] flex-col gap-5 overflow-y-auto pr-1">
          {preinscriptions.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-navy-900">{t('mesFormations.preinscriptions', { count: preinscriptions.length })}</h3>
              <ul className="flex flex-col gap-2">
                {preinscriptions
                  .toSorted((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))
                  .map((p) => {
                    const formation = formations.find((f) => f.id === p.formationId)
                    const ecole = etablissements.find((e) => e.id === p.etablissementId)
                    return (
                      <li key={p.id}>
                        <Link to={ROUTES.training(p.formationId)} onClick={onFermer} className={CLASSES_LIGNE}>
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                            <GraduationCap className="size-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1 text-sm">
                            <span className="block font-semibold text-navy-900">{formation?.nom ?? p.formationId}</span>
                            <span className="block truncate text-muted">{ecole?.nom}</span>
                            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                              <Badge tone="green">{t(`mesFormations.statuts.${p.statut}`)}</Badge>
                              {t('mesFormations.envoyeeLe', { date: shortDate(p.envoyeeLe) })}
                            </span>
                          </span>
                          <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                        </Link>
                      </li>
                    )
                  })}
              </ul>
            </section>
          )}

          {inscriptionsAutoEcole.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-navy-900">{t('mesFormations.permis', { count: inscriptionsAutoEcole.length })}</h3>
              <ul className="flex flex-col gap-2">
                {inscriptionsAutoEcole
                  .toSorted((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))
                  .map((i) => (
                    <li key={i.id}>
                      <Link to={ROUTES.license(i.autoEcoleId, i.permis)} onClick={onFermer} className={CLASSES_LIGNE}>
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teinte-orange text-orange">
                          <CarFront className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 text-sm">
                          <span className="block font-semibold text-navy-900">{t('mesFormations.permisCode', { code: i.permis })}</span>
                          <span className="block truncate text-muted">{autoEcoles.find((a) => a.id === i.autoEcoleId)?.nom}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                            <Badge tone="green">{t(`mesFormations.statuts.${i.statut}`)}</Badge>
                            {t('mesFormations.envoyeeLe', { date: shortDate(i.envoyeeLe) })}
                          </span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Modal>,
    document.body,
  )
}
