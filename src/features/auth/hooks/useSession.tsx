import { createContext, use, useState, type ReactNode } from 'react'
import { load, loadSession, save, saveSession } from '@/shared/utils/storage'
import { useCollectionWhenReady, useDataReady } from '@/data'
import type { Compte } from '@/shared/types'
import { useEtablissement, useFormationsOf } from '@/data/hooks'

type SessionValue = {
  /** Le compte connecté (table `comptes`), ou null pour un visiteur. */
  account: Compte | null
  /** Faux tant que la base n'est pas chargée : on ne sait pas encore qui est connecté. */
  pret: boolean
  /** L'identifiant gardé dans le navigateur, connu avant que la base soit prête (null : visiteur). */
  compteId: string | null
  /** Ouvre la session d'un compte de la base (après vérification du mot de passe). `retenir` faux : la session s'arrête à la fermeture du navigateur. */
  signIn: (compte: Compte, retenir?: boolean) => void
  signOut: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

/**
 * La session garde seulement l'identifiant du compte (clé `yibolo:compte`) ; le compte lui-même est lu dans la base.
 * « Se souvenir de moi » : dans le stockage local (reste après fermeture) ; sinon dans le stockage de la visite.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  // Première visite : visiteur non connecté (la landing montre « Se connecter »).
  const [compteId, setCompteId] = useState<string | null>(() => load<string | null>('compte', null) ?? loadSession<string | null>('compte', null))
  const comptes = useCollectionWhenReady('comptes')
  const pret = useDataReady()
  const value: SessionValue = {
    account: comptes.find((c) => c.id === compteId) ?? null,
    pret,
    compteId,
    signIn: (compte, retenir = true) => {
      setCompteId(compte.id)
      save('compte', retenir ? compte.id : null)
      saveSession('compte', retenir ? null : compte.id)
    },
    signOut: () => {
      setCompteId(null)
      save('compte', null)
      saveSession('compte', null)
    },
  }
  return <SessionContext value={value}>{children}</SessionContext>
}

export function useSession() {
  const ctx = use(SessionContext)
  if (!ctx) throw new Error('useSession hors de SessionProvider')
  return ctx
}

/** L'établissement de l'espace pro : celui du compte connecté. */
export function useMonEcole() {
  const { account } = useSession()
  const ecole = useEtablissement(account?.ecoleId)
  return { ecole, formations: useFormationsOf(ecole.id) }
}
