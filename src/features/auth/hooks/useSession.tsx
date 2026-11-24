import { createContext, use, useState, type ReactNode } from 'react'
import { load, save } from '@/shared/utils/storage'
import { demoAccounts } from '@/mocks/demoAccounts'
import type { Account, Role } from '@/shared/types'
import { useEtablissement, useFormationsOf } from '@/data/hooks'


type SessionValue = {
  account: Account | null
  signIn: (role: Role) => Account
  signOut: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => {
    // Première visite : visiteur non connecté (la landing montre « Se connecter »,
    // décision du 2026-11-24). Après « Se déconnecter », on reste visiteur.
    const r = load<Role | null>('role', null)
    return r !== null && r in demoAccounts ? r : null
  })
  const value: SessionValue = {
    account: role ? demoAccounts[role] : null,
    signIn: (r) => {
      setRole(r)
      save('role', r)
      return demoAccounts[r]
    },
    signOut: () => {
      setRole(null)
      save('role', null)
    },
  }
  return <SessionContext value={value}>{children}</SessionContext>
}

export function useSession() {
  const ctx = use(SessionContext)
  if (!ctx) throw new Error('useSession hors de SessionProvider')
  return ctx
}

/** L'établissement de l'espace pro : celui du compte, l'IPC par défaut. */
export function useMonEcole() {
  const { account } = useSession()
  const ecole = useEtablissement(account?.ecoleId ?? 'ipc')
  return { ecole, formations: useFormationsOf(ecole.id) }
}
