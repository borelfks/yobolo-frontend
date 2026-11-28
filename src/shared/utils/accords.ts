import { z } from 'zod'
import type { TFunction } from 'i18next'
import { data } from '@/data'
import type { AccordEtablissement, NatureAccord } from '@/shared/types'
import { lireFichier, tailleFichier, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'

/**
 * Accords d'un établissement, de création et d'ouverture : il peut en avoir plusieurs
 * de chaque, délivrés par des autorités différentes, chacun avec son document.
 * Utilisé à la création du compte école et dans Profil › Agrément & documents.
 */

/** Les autorités proposées (libellés : common, accords.autorites.<sigle>). « Autre » : nom saisi. */
export const AUTORITES = ['MINESUP', 'MINEFOP', 'MINT', 'MINSANTE', 'Autre'] as const
export type Autorite = (typeof AUTORITES)[number]
export const estAutoriteConnue = (x: string): x is Exclude<Autorite, 'Autre'> => (AUTORITES as readonly string[]).includes(x) && x !== 'Autre'

/**
 * Un accord en cours de saisie (formulaire). `fichier` : le document choisi (absent : on garde celui de l'accord).
 * `id` et `documentActuel` : pour un accord déjà enregistré (son document déjà joint, « nom · taille »).
 */
export type AccordSaisi = { id?: string; autorite: string; autre: string; numero: string; delivreLe: string; expireLe: string; fichier: File | null; documentActuel?: string }

/** Les messages d'erreur d'un bloc, champ par champ. */
export type ErreursAccord = Partial<Record<keyof AccordSaisi, string>>

/** Les messages d'un bloc, à partir des erreurs du formulaire (react-hook-form) pour cet accord. */
export function erreursAccord(e?: object): ErreursAccord {
  const champ = (k: keyof AccordSaisi) => ((e as Record<string, { message?: string } | undefined> | undefined)?.[k])?.message
  return { autorite: champ('autorite'), autre: champ('autre'), numero: champ('numero'), delivreLe: champ('delivreLe'), expireLe: champ('expireLe'), fichier: champ('fichier') }
}

/** Un accord encore vide ; `autorite` : celle proposée d'abord (selon le type d'établissement). */
export const accordVide = (autorite: Autorite = 'MINESUP'): AccordSaisi => ({ autorite, autre: '', numero: '', delivreLe: '', expireLe: '', fichier: null })

/** Les champs d'un accord enregistré, remis dans le formulaire (modification). */
export function accordEnSaisie(a: AccordEtablissement): AccordSaisi {
  const connue = estAutoriteConnue(a.autorite)
  const documentActuel = a.fichierId || a.taille ? [a.nomFichier, a.taille].filter(Boolean).join(' · ') : undefined
  return { id: a.id, autorite: connue ? a.autorite : 'Autre', autre: connue ? '' : a.autorite, numero: a.numero, delivreLe: a.delivreLe, expireLe: a.expireLe ?? '', fichier: null, documentActuel }
}

/** La règle d'un accord : le document est obligatoire, sauf s'il est déjà joint (`documentActuel`). */
export function schemaAccord(t: TFunction<'common'>) {
  return z
    .object({
      id: z.string().optional(),
      documentActuel: z.string().optional(),
      autorite: z.string().min(1, t('accords.erreurs.autorite')),
      autre: z.string(),
      numero: z.string().trim().min(1, t('accords.erreurs.numero')),
      delivreLe: z.string().min(1, t('accords.erreurs.delivreLe')),
      expireLe: z.string(),
      fichier: z.custom<File | null>((v) => v === null || v instanceof File),
    })
    .refine((v) => v.autorite !== 'Autre' || v.autre.trim() !== '', { path: ['autre'], message: t('accords.erreurs.autre') })
    .refine((v) => !v.expireLe || !v.delivreLe || v.expireLe > v.delivreLe, { path: ['expireLe'], message: t('accords.erreurs.expireLe') })
    .refine((v) => v.fichier !== null || !!v.documentActuel, { path: ['fichier'], message: t('accords.erreurs.document') })
    .refine((v) => !v.fichier || v.fichier.size <= TAILLE_MAX_DOCUMENT, { path: ['fichier'], message: t('accords.erreurs.tropLourd') })
}

/** Les deux natures d'accord, dans l'ordre de la page : la création, puis l'ouverture. */
export const NATURES: NatureAccord[] = ['creation', 'ouverture']

/** Un bloc encore vide (rien saisi, aucun document) : ignoré à l'enregistrement de l'espace pro. */
export const accordVierge = (a: AccordSaisi) => !a.id && !a.numero.trim() && !a.delivreLe && !a.expireLe && !a.autre.trim() && !a.fichier

/** Enregistre un accord (nouveau, ou `existant` modifié) et son document dans la base. */
export async function enregistrerAccord(etablissementId: string, nature: NatureAccord, saisie: AccordSaisi, existant?: AccordEtablissement) {
  const champs = {
    etablissementId,
    nature,
    autorite: saisie.autorite === 'Autre' ? saisie.autre.trim() : saisie.autorite,
    numero: saisie.numero.trim(),
    delivreLe: saisie.delivreLe,
    expireLe: saisie.expireLe || undefined,
  }
  let document: Pick<AccordEtablissement, 'fichierId' | 'nomFichier' | 'taille'> = {}
  if (saisie.fichier) {
    const f = saisie.fichier
    const fichier = await data.create('fichiers', { nom: f.name, type: f.type, taille: f.size, dataUrl: await lireFichier(f) }, 'fichier')
    document = { fichierId: fichier.id, nomFichier: f.name, taille: tailleFichier(f.size) }
    if (existant?.fichierId) await data.remove('fichiers', existant.fichierId)
  }
  if (existant) return data.update('accordsEtablissement', existant.id, { ...champs, ...document })
  return data.create('accordsEtablissement', { ...champs, ...document }, 'accord')
}

/** Supprime un accord et son document. */
export async function supprimerAccord(accord: AccordEtablissement) {
  await data.remove('accordsEtablissement', accord.id)
  if (accord.fichierId) await data.remove('fichiers', accord.fichierId)
}

/** État d'un accord à une date : en cours, expire dans moins de 90 jours, expiré. */
export function etatAccord(a: Pick<AccordEtablissement, 'expireLe'>, aujourdHui = new Date().toISOString().slice(0, 10)) {
  if (!a.expireLe) return 'enCours' as const
  if (a.expireLe < aujourdHui) return 'expire' as const
  const dans90 = new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10)
  return a.expireLe <= dans90 ? ('bientot' as const) : ('enCours' as const)
}
