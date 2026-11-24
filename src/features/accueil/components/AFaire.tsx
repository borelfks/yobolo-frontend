import { BriefcaseBusiness, CalendarSync, ChevronRight, CreditCard, FileCheck2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useTachesAccueil } from '@/data/hooks'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import type { CleDeTache } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

/** L'icône et la page de chaque geste. Rendez-vous et prestations sont dans l'univers Consultation (« bientôt disponible »). */
const GESTES: Record<CleDeTache, { icone: LucideIcon; vers: string }> = {
  paiementsAReprendre: { icone: CreditCard, vers: ROUTES.consultation },
  reportsATrancher: { icone: CalendarSync, vers: ROUTES.consultation },
  propositionsAExaminer: { icone: BriefcaseBusiness, vers: ROUTES.consultation },
  rapportsAValider: { icone: FileCheck2, vers: ROUTES.consultation },
}

function dejaMontre(cle: string) {
  try {
    return window.sessionStorage.getItem(cle) !== null
  } catch {
    return false
  }
}

function retenir(cle: string) {
  try {
    window.sessionStorage.setItem(cle, '1')
  } catch {
    // Stockage refusé : la fenêtre reviendra au prochain accueil, rien de plus.
  }
}

/**
 * Ce qui attend un geste, dit une fois à l'arrivée (AFaire de yibolo-client) :
 * une fenêtre qui s'ouvre s'il y a quelque chose à faire, et seulement alors.
 * Elle ne revient pas de la session (onglet du navigateur). Une ligne par
 * geste, lue dans la table `tachesAccueil` du compte.
 */
export function AFaire({ compteId }: { compteId: string }) {
  const { t } = useTranslation('accueil')
  const taches = useTachesAccueil(compteId).filter((tache) => tache.nombre > 0)
  const memoire = `yibolo:accueil:aFaire:${compteId}`
  const [fermee, setFermee] = useState(() => dejaMontre(memoire))

  const fermer = () => {
    retenir(memoire)
    setFermee(true)
  }

  return createPortal(
    <Modal
      open={!fermee && taches.length > 0}
      onClose={fermer}
      title={t('aFaire.titre')}
      footer={
        <Button variant="neutral" onClick={fermer}>
          {t('aFaire.plusTard')}
        </Button>
      }
    >
      <p className="-mt-2 text-sm text-muted">{t('aFaire.description')}</p>
      <ul className="flex flex-col gap-2 pt-4">
        {taches.map(({ id, cle, nombre }) => {
          const { icone: Icone, vers } = GESTES[cle]
          return (
            <li key={id}>
              <Link
                to={vers}
                onClick={fermer}
                className="group flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm text-ink transition-colors hover:border-brand-600/30 hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <Icone className="size-5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="leading-snug font-semibold">{t(`aFaire.${cle}.texte`, { count: nombre })}</span>
                  <span className="text-xs leading-snug text-muted">{t(`aFaire.${cle}.aide`, { count: nombre })}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>
    </Modal>,
    document.body,
  )
}
