import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { useJaimes } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import type { Publication } from '@/shared/types'

/**
 * « J'aime » une publication : une ligne de la table `jaimes` par compte. Le
 * nombre affiché = celui de départ de la publication + les « J'aime » des comptes.
 */
export function useJaime(publication: Publication) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const lignes = useJaimes().filter((j) => j.publicationId === publication.id)
  const mienne = lignes.find((j) => j.compteId === account?.id)
  const [enCours, setEnCours] = useState(false)

  const basculer = async () => {
    if (!account || enCours) return
    setEnCours(true)
    try {
      if (mienne) await data.remove('jaimes', mienne.id)
      else await data.create('jaimes', { compteId: account.id, publicationId: publication.id }, 'jaime')
    } catch {
      toast.error(t('actions.echecJaime'))
    } finally {
      setEnCours(false)
    }
  }

  return { aime: mienne !== undefined, nombre: publication.jaimes + lignes.length, basculer, enCours }
}
