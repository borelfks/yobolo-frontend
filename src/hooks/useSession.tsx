import { createContext, use, useState, type ReactNode } from 'react'
import { load, save } from '@/lib/storage'
import { photo } from '@/lib/utils'
import { etablissementById, formationsOf } from '@/mocks/ecoles'

/** Les comptes de démonstration : un compte = un espace. */
export type Role = 'utilisateur' | 'ipes' | 'cfp' | 'autre'

export type Account = {
  role: Role
  name: string
  subtitle: string
  avatar: string
  home: string
  /** L'établissement géré, pour les comptes école. */
  ecoleId?: string
  label: string
  description: string
}

export const demoAccounts: Record<Role, Account> = {
  utilisateur: { role: 'utilisateur', name: 'Jean Dupont', subtitle: 'Utilisateur', avatar: '/maquette/avatar-jean.jpg', home: '/ecoles', label: 'Personne physique', description: 'Chercher une école, se préinscrire, s’inscrire à une auto-école, gérer ses favoris.' },
  ipes: { role: 'ipes', name: 'IPC Yaoundé', subtitle: 'Administrateur', avatar: '/maquette/avatar-ipc-header.jpg', home: '/pro/ecole', ecoleId: 'ipc', label: 'École – IPES', description: 'Institut Professionnel du Centre : espace professionnel complet.' },
  cfp: { role: 'cfp', name: 'CFP du BTP', subtitle: 'Administrateur', avatar: photo('cfp-btp', 120, 120), home: '/pro/ecole', ecoleId: 'cfp-btp', label: 'École – CFP', description: 'Centre de Formation Professionnelle du BTP, à Douala.' },
  autre: { role: 'autre', name: 'Centre Linguistique', subtitle: 'Administrateur', avatar: photo('langues', 120, 120), home: '/pro/ecole', ecoleId: 'langues', label: 'École – Autre', description: 'Centre Linguistique Pilote : cours de langues.' },
}

type SessionValue = {
  account: Account | null
  signIn: (role: Role) => Account
  signOut: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => {
    const r = load<Role | null>('role', 'utilisateur')
    return r && r in demoAccounts ? r : 'utilisateur'
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
  const ecole = etablissementById(account?.ecoleId ?? 'ipc')
  return { ecole, formations: formationsOf(ecole.id) }
}
