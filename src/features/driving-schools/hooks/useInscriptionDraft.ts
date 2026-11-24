import { useState } from 'react'
import { load, save } from '@/shared/utils/storage'
import type { InscriptionDraft, PermisCode } from '@/shared/types'
import { useSessions } from '@/data/hooks'

export function useInscriptionDraft(aeId: string, code: PermisCode) {
  // Session proposée : la prochaine session du permis, enregistrée dans la base.
  const prochaine = useSessions().find((x) => x.permis === code)?.debut ?? ''
  const key = `inscription-v2:${aeId}:${code}`
  const initial: InscriptionDraft = {
    nom: '',
    prenom: '',
    naissance: '',
    sexe: '',
    telephone: '',
    email: '',
    ville: '',
    quartier: '',
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
