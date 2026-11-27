import { useState } from 'react'
import { load, save } from '@/shared/utils/storage'
import type { InscriptionDraft, PermisCode } from '@/shared/types'
import { useSessions } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'

export function useInscriptionDraft(aeId: string, code: PermisCode) {
  // Session proposée : la prochaine session du permis, enregistrée dans la base.
  const prochaine = useSessions().find((x) => x.permis === code)?.debut ?? ''
  // Une personne physique connectée : son profil préremplit l'inscription.
  const { account } = useSession()
  const moi = account?.role === 'utilisateur' ? account : null
  const key = `inscription-v2:${aeId}:${code}`
  const initial: InscriptionDraft = {
    nom: moi?.nom ?? '',
    prenom: moi?.prenom ?? '',
    naissance: '',
    sexe: '',
    telephone: moi?.telephone ?? '',
    email: moi?.identifiant.includes('@') ? moi.identifiant : '',
    region: moi?.region ?? '',
    departement: moi?.departement ?? '',
    arrondissement: moi?.arrondissement ?? '',
    ville: moi?.ville ?? '',
    quartier: moi?.quartier ?? '',
    autoEcoleId: aeId,
    permis: code,
    session: prochaine,
    pieces: {},
  }
  const [draft, setDraft] = useState<InscriptionDraft>(() => load(key, initial))
  const update = (patch: Partial<InscriptionDraft>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    save(key, next)
  }
  return [draft, update] as const
}
