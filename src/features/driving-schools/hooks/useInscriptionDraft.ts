import { useState } from 'react'
import { load, save } from '@/shared/utils/storage'
import type { InscriptionDraft, PermisCode } from '@/shared/types'

export function useInscriptionDraft(aeId: string, code: PermisCode) {
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
    session: '15 novembre 2026',
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
