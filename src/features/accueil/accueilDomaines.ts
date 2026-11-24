import {
  Briefcase,
  Building2,
  Calculator,
  GraduationCap,
  HeartPulse,
  Landmark,
  Megaphone,
  Monitor,
  Receipt,
  Scale,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * L'apparence d'un domaine d'expertise (icône et teinte), une seule fois : le
 * menu des domaines et la colonne de gauche montrent la même icône et la même
 * teinte pour le même domaine. Repris de yibolo-client (apparenceDomaines.ts).
 * Les domaines eux-mêmes (noms, ordre) sont dans la base (`domainesExpertise`) ;
 * un domaine inconnu reçoit une icône générique.
 */
const ICONES: Record<string, LucideIcon> = {
  'conseil-juridique': Scale,
  fiscalite: Receipt,
  'marches-publics': Landmark,
  'ressources-humaines': Users,
  comptabilite: Calculator,
  finance: Wallet,
  banque: Landmark,
  assurance: ShieldCheck,
  immobilier: Building2,
  agriculture: Sprout,
  informatique: Monitor,
  sante: HeartPulse,
  education: GraduationCap,
  commerce: Store,
  transport: Truck,
  marketing: Megaphone,
  'gestion-d-entreprise': Briefcase,
}

const TEINTES = {
  bleu: { texte: 'text-brand-600', fond: 'bg-brand-50' },
  orange: { texte: 'text-orange', fond: 'bg-teinte-orange' },
  rouge: { texte: 'text-rose-600', fond: 'bg-teinte-rose' },
  vert: { texte: 'text-emeraude', fond: 'bg-teinte-emeraude' },
  violet: { texte: 'text-violet', fond: 'bg-teinte-violet' },
  rose: { texte: 'text-rose', fond: 'bg-teinte-rose' },
} as const

const TEINTE_DU_DOMAINE: Record<string, keyof typeof TEINTES> = {
  informatique: 'bleu',
  commerce: 'bleu',
  transport: 'bleu',
  'gestion-d-entreprise': 'bleu',
  finance: 'orange',
  comptabilite: 'orange',
  banque: 'orange',
  assurance: 'orange',
  sante: 'rouge',
  agriculture: 'vert',
  education: 'vert',
  'ressources-humaines': 'vert',
  immobilier: 'violet',
  'conseil-juridique': 'violet',
  fiscalite: 'violet',
  'marches-publics': 'violet',
  marketing: 'rose',
}

const teinte = (id: string) => TEINTES[TEINTE_DU_DOMAINE[id] ?? 'vert']

export function iconeDuDomaine(id: string): LucideIcon {
  return ICONES[id] ?? Landmark
}

/** La couleur de l'icône seule : la colonne des domaines. */
export function couleurDuDomaine(id: string) {
  return teinte(id).texte
}

/** L'icône sur son rond pâle : le menu des domaines. */
export function teinteDuDomaine(id: string) {
  const { texte, fond } = teinte(id)
  return `${fond} ${texte}`
}
