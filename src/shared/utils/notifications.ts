import { data } from '@/data'
import type { Compte, NotificationCompte, PreferenceNotification, SujetNotification } from '@/shared/types'

/** Les sujets dont un compte est prévenu (Paramètres › Notifications). Rien sur l'emploi ni la Consultation. */
export const SUJETS_NOTIFICATION: SujetNotification[] = ['preRegistration', 'session', 'review', 'message', 'info']

/** Les canaux : dans l'application, par SMS, par e-mail. */
export const CANAUX_NOTIFICATION = ['app', 'sms', 'email'] as const

/** Ce que le compte a choisi pour un sujet ; par défaut : l'application et le SMS (sauf les nouveautés). */
export function preferenceDe(compte: Pick<Compte, 'preferencesNotifications'>, sujet: SujetNotification): PreferenceNotification {
  return compte.preferencesNotifications?.[sujet] ?? { app: true, sms: sujet !== 'info', email: false }
}

/**
 * Prévient un compte : la notification s'ajoute à sa page « Mes
 * notifications » s'il le veut pour ce sujet (Paramètres › Notifications).
 */
export async function notifier(compteId: string, notification: Omit<NotificationCompte, 'id' | 'compteId' | 'lu'>) {
  const compte = (await data.list('comptes')).find((c) => c.id === compteId)
  if (!compte || !preferenceDe(compte, notification.type).app) return
  await data.create('notificationsCompte', { ...notification, compteId, lu: false }, 'notif')
}
