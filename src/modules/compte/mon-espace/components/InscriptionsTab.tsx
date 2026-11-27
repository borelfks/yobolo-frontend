import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Car } from 'lucide-react'
import { useAutoEcoles, useMesInscriptions, usePermisCatalogue } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { annulerInscription } from '@/modules/compte/mon-espace/espaceActions'
import { AucunDossier, ConfirmerAnnulation, LigneDossier } from '@/modules/compte/mon-espace/components/Dossiers'
import type { InscriptionAutoEcole } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

/** « Mes permis » : les inscriptions envoyées aux auto-écoles, les plus récentes d'abord. */
export function InscriptionsTab() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const liste = [...useMesInscriptions(account?.id).inscriptionsAutoEcole].sort((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))
  const autoEcoles = useAutoEcoles()
  const permis = usePermisCatalogue()
  const [annuler, setAnnuler] = useState<InscriptionAutoEcole | null>(null)

  const confirmer = async () => {
    const i = annuler
    setAnnuler(null)
    if (!i) return
    try {
      await annulerInscription(i)
      toast.success(t('dossiers.annulation.faite'))
    } catch {
      toast.error(t('dossiers.annulation.echec'))
    }
  }

  if (liste.length === 0) return <AucunDossier texte={t('dossiers.aucunPermis')} action={t('dossiers.trouverAutoEcole')} vers={ROUTES.drivingSchools} />
  return (
    <div className="space-y-3">
      {liste.map((i) => {
        const a = autoEcoles.find((x) => x.id === i.autoEcoleId)
        const p = permis[i.permis]
        return (
          <LigneDossier
            key={i.id}
            image={p?.image ?? a?.image ?? ''}
            titre={t('dossiers.permis', { code: i.permis })}
            sousTitre={a?.nom ?? '—'}
            envoyeeLe={i.envoyeeLe}
            annuleeLe={i.annuleeLe}
            statut={i.statut}
            extra={
              i.donnees.session && (
                <span className="inline-flex items-center gap-1">
                  <Car className="size-4 text-brand-600" aria-hidden="true" />
                  {t('dossiers.session', { date: i.donnees.session })}
                </span>
              )
            }
            vers={ROUTES.espaceInscription(i.id)}
            onAnnuler={() => setAnnuler(i)}
          />
        )
      })}
      <ConfirmerAnnulation open={!!annuler} onClose={() => setAnnuler(null)} onConfirm={() => void confirmer()} />
    </div>
  )
}
