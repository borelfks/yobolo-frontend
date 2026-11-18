import { useState } from 'react'
import { Bike, Bus, Car, Container, Truck } from 'lucide-react'
import { load, save } from '@/lib/storage'
import type { PermisCode } from '@/mocks/autoecoles'

export const permisIcon: Record<PermisCode, typeof Car> = { A: Bike, B: Car, C: Truck, D: Bus, E: Container }

/** Brouillon d'inscription partagé entre les étapes et les pages « Modifier ». */
export type InscriptionDraft = {
  nom: string
  prenom: string
  naissance: string
  sexe: string
  telephone: string
  email: string
  ville: string
  quartier: string
  autoEcoleId: string
  permis: PermisCode
  session: string
  pieces: Record<string, boolean>
}

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

export const piecesAE = [
  { key: 'cni', label: 'Copie de la carte nationale d’identité (CNI)', court: 'CNI', etat: 'Ajoutée', hint: 'Format : PDF, JPG ou PNG (≤ 5 Mo)', bouton: 'Importer le fichier' },
  { key: 'photos', label: 'Photos d’identité récentes (x2)', court: 'Photos (x2)', etat: 'Ajoutées', hint: 'Format : JPG ou PNG (≤ 2 Mo par photo)', bouton: 'Importer les photos' },
  { key: 'medical', label: 'Certificat médical d’aptitude à la conduite', court: 'Certificat médical', etat: 'Ajouté', hint: 'Format : PDF, JPG ou PNG (≤ 5 Mo)', bouton: 'Importer le fichier' },
]

export function vehiculePhoto(code: PermisCode) {
  return `/maquette/vehicule-${code === 'E' ? 'C' : code}.jpg`
}
