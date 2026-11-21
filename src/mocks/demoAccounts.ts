import { photo } from '@/shared/utils/format'
import type { Account, Role } from '@/shared/types'

/** Les comptes de démonstration : un compte = un espace. */
export const demoAccounts: Record<Role, Account> = {
  utilisateur: { role: 'utilisateur', name: 'Jean Dupont', subtitle: 'Utilisateur', avatar: '/images/maquette/avatar-jean.jpg', home: '/ecoles', label: 'Personne physique', description: 'Chercher une école, se préinscrire, s’inscrire à une auto-école, gérer ses favoris.' },
  ipes: { role: 'ipes', name: 'IPC Yaoundé', subtitle: 'Administrateur', avatar: '/images/maquette/avatar-ipc-header.jpg', home: '/pro/ecole', ecoleId: 'ipc', label: 'École – IPES', description: 'Institut Professionnel du Centre : espace professionnel complet.' },
  cfp: { role: 'cfp', name: 'CFP du BTP', subtitle: 'Administrateur', avatar: photo('cfp-btp', 120, 120), home: '/pro/ecole', ecoleId: 'cfp-btp', label: 'École – CFP', description: 'Centre de Formation Professionnelle du BTP, à Douala.' },
  autre: { role: 'autre', name: 'Centre Linguistique', subtitle: 'Administrateur', avatar: photo('langues', 120, 120), home: '/pro/ecole', ecoleId: 'langues', label: 'École – Autre', description: 'Centre Linguistique Pilote : cours de langues.' },
}
