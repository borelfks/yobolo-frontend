import { createContext, use, useState, type ReactNode } from 'react'
import { load, loadSession, save, saveSession } from '@/shared/utils/storage'
import { useCollectionWhenReady, useDataReady } from '@/data'
import type { AutoEcole, Compte, Etablissement } from '@/shared/types'
import { useAutoEcoles, useEtablissement, useFormationsOf } from '@/data/hooks'
import { ROUTES } from '@/shared/utils/routes'

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

const avecAccueil = (c: Compte | null): Compte | null => (c ? { ...c, home: ROUTES.accueil } : null)

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
    // Tous les comptes arrivent sur l'accueil connecté ; une école ouvre son espace pro depuis le menu (décision du 2026-11-25).
    account: avecAccueil(comptes.find((c) => c.id === compteId) ?? null),
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

/**
 * Une auto-école vue comme un établissement : l'espace professionnel (cadre,
 * en-têtes, paramètres, statistiques, notifications) la gère par les mêmes
 * champs. Ses pages propres (permis, planning, inscriptions) lisent l'auto-école elle-même.
 */
function commeEtablissement(a: AutoEcole): Etablissement {
  return {
    id: a.id,
    nom: a.nom,
    sigle: '',
    type: 'Auto-école',
    region: a.region,
    departement: a.departement,
    arrondissement: a.arrondissement,
    ville: a.ville,
    quartier: a.quartier,
    note: a.note,
    avis: a.avis,
    image: a.image,
    vignette: a.logo,
    logo: a.logo,
    filieres: [],
    formations: 0,
    description: a.description ?? '',
    telephone: a.telephone,
    email: a.email,
    rentree: '',
    anneeCreation: a.creation ? String(a.creation) : undefined,
    adresse: a.adresse,
    agrement: a.agrement,
    enVerification: a.enVerification,
  }
}

/**
 * L'établissement de l'espace pro : celui du compte connecté. Pour un compte
 * auto-école, `autoEcole` est sa fiche et `ecole` la même, vue comme un établissement.
 */
export function useMonEcole() {
  const { account } = useSession()
  const etablissement = useEtablissement(account?.ecoleId)
  const autoEcoles = useAutoEcoles()
  const formations = useFormationsOf(etablissement.id)
  const autoEcole = account?.role === 'auto-ecole' ? autoEcoles.find((a) => a.id === account.ecoleId) : undefined
  if (autoEcole) return { ecole: commeEtablissement(autoEcole), formations: [], autoEcole }
  return { ecole: etablissement, formations, autoEcole: undefined }
}
