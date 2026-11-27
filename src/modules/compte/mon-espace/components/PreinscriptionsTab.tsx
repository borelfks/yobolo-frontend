import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useEtablissements, useFormations, useMesInscriptions } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { annulerPreinscription } from '@/modules/compte/mon-espace/espaceActions'
import { AucunDossier, ConfirmerAnnulation, LigneDossier } from '@/modules/compte/mon-espace/components/Dossiers'
import type { Preinscription } from '@/shared/types'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Date du jour au format des notifications de l'espace pro (« 24 nov. 2026 »). */
const aujourdhui = () => shortDate(new Date(), { day: '2-digit', month: 'short', year: 'numeric' })

/** « Mes préinscriptions » : les dossiers envoyés aux établissements, les plus récents d'abord. */
export function PreinscriptionsTab() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const liste = [...useMesInscriptions(account?.id).preinscriptions].sort((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))
  const formations = useFormations()
  const etablissements = useEtablissements()
  const [annuler, setAnnuler] = useState<Preinscription | null>(null)

  const confirmer = async () => {
    const p = annuler
    setAnnuler(null)
    if (!p || !account) return
    const f = formations.find((x) => x.id === p.formationId)
    try {
      await annulerPreinscription(p, {
        titre: t('dossiers.annulation.notificationTitre'),
        texte: t('dossiers.annulation.notificationTexte', { name: account.name, training: f?.nom ?? '' }),
        date: aujourdhui(),
      })
      toast.success(t('dossiers.annulation.faite'))
    } catch {
      toast.error(t('dossiers.annulation.echec'))
    }
  }

  if (liste.length === 0) return <AucunDossier texte={t('dossiers.aucunePreinscription')} action={t('dossiers.trouverFormation')} vers={ROUTES.schools} />
  return (
    <div className="space-y-3">
      {liste.map((p) => {
        const f = formations.find((x) => x.id === p.formationId)
        const e = etablissements.find((x) => x.id === p.etablissementId)
        return (
          <LigneDossier
            key={p.id}
            image={f?.image ?? e?.image ?? ''}
            titre={f?.nom ?? '—'}
            sousTitre={e?.nom ?? '—'}
            envoyeeLe={p.envoyeeLe}
            annuleeLe={p.annuleeLe}
            statut={p.statut}
            vers={ROUTES.espacePreinscription(p.id)}
            onAnnuler={() => setAnnuler(p)}
          />
        )
      })}
      <ConfirmerAnnulation open={!!annuler} onClose={() => setAnnuler(null)} onConfirm={() => void confirmer()} />
    </div>
  )
}
