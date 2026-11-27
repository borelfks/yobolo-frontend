import type { TFunction } from 'i18next'
import type { AutoEcole, PermisCode } from '@/shared/types'
import { demoDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

type T = TFunction<'driving-schools'>

export const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
export const soft = 'rounded-xl bg-[#f0f4fc]'

/** Adresse de l'inscription : le permis donné, sinon le B (ou le premier proposé). */
export function inscrireHref(a: Pick<AutoEcole, 'id' | 'permis'>, code?: string) {
  return ROUTES.enrollment(a.id, code ?? (a.permis.includes('B') ? 'B' : a.permis[0]))
}

/** Clés de « Pourquoi nous choisir ? », dans l'ordre de pourquoiNousChoisir (mocks). */
export const whyKeys = ['approved', 'instructors', 'vehicles', 'successRate', 'flexibleHours', 'examSupport'] as const

/** Clés des critères d'avis, dans l'ordre de criteresAvis (mocks). */
export const criteriaKeys = ['quality', 'instructors', 'organisation', 'facilities', 'welcome'] as const

/** « 15 nov. 2026 » (données de démo) → date courte dans la langue choisie. */
export const sessionStart = demoDate

/** « Lun – Ven » → libellé traduit. */
export function sessionDays(t: T, value: string) {
  return value === 'Lun – Ven' ? t('sessions.days.monFri') : value
}

/** « 08h – 12h » → horaires traduits. */
export function sessionHours(t: T, value: string) {
  const m = /^(\d{2})h – (\d{2})h$/.exec(value)
  return m ? t('sessions.hours', { from: m[1], to: m[2] }) : value
}

/** « ≈ 2 mois » → durée traduite. */
export function sessionDuration(t: T, value: string) {
  const m = /^≈ (\d+) mois$/.exec(value)
  return m ? t('sessions.duration', { count: Number(m[1]) }) : value
}

/** « Il y a 3 jours » / « Il y a 1 semaine » (avis de démo) → date relative traduite. */
export function reviewDate(t: T, value: string) {
  const m = /^Il y a (\d+) (jours?|semaines?)$/.exec(value)
  if (!m) return value
  const count = Number(m[1])
  return m[2].startsWith('jour') ? t('reviewDate.days', { count }) : t('reviewDate.weeks', { count })
}

/** Nom court d'un permis tel qu'affiché dans les listes (« Moto » pour le A). */
export function permisShortName(t: T, code: PermisCode) {
  return code === 'A' ? t('permis.A.short') : t(`permis.${code}.name`)
}
