import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { useEnregistrements } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import type { Publication } from '@/shared/types'

/** Mettre une publication de côté (« Mes enregistrés ») : une ligne de la table `enregistrements`. */
export function useEnregistrement(publication: Publication) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const ligne = useEnregistrements(account?.id).find((e) => e.publicationId === publication.id)
  const [enCours, setEnCours] = useState(false)

  const basculer = async () => {
    if (!account || enCours) return
    setEnCours(true)
    try {
      if (ligne) {
        await data.remove('enregistrements', ligne.id)
        toast.success(t('actions.retireeDesEnregistres'))
      } else {
        await data.create('enregistrements', { compteId: account.id, publicationId: publication.id, le: new Date().toISOString() }, 'enr')
        toast.success(t('actions.ajouteeAuxEnregistres'))
      }
    } catch {
      toast.error(t('actions.echecEnregistrement'))
    } finally {
      setEnCours(false)
    }
  }

  return { enregistree: ligne !== undefined, basculer, enCours }
}
