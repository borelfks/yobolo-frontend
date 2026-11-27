import { Bike, Bus, Car, Container, Truck } from 'lucide-react'
import type { PermisCode } from '@/shared/types'

export const permisIcon: Record<PermisCode, typeof Car> = { A: Bike, B: Car, C: Truck, D: Bus, E: Container }

/**
 * Pièces à fournir pour une inscription en auto-école. Seule la clé est gardée ici :
 * les textes (libellé, nom court, état, consigne, bouton) sont résolus dans les écrans
 * avec t(`pieces.${key}.label`), t(`pieces.${key}.short`)… (namespace « enrollment »).
 */
export const piecesAE = [{ key: 'cni' }, { key: 'photos' }, { key: 'medical' }] as const

export type PieceKey = (typeof piecesAE)[number]['key']

export function vehiculePhoto(code: PermisCode) {
  return `/images/maquette/vehicule-${code === 'E' ? 'C' : code}.jpg`
}
