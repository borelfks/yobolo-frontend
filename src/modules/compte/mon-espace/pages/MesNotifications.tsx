import { Navigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data, dateDeCreation } from '@/data'
import { useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CadreMonCompte } from '@/modules/compte/mon-espace/components/CadreMonCompte'
import { LigneNotification } from '@/modules/compte/mon-espace/components/LigneNotification'
import { CarteCompte, EnTeteCompte, PucesCompte } from '@/shared/blocs/CadreCompte'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { SkeletonList, SkeletonZone } from '@/shared/blocs/Squelettes'
import { useParametresRecherche } from '@/shared/hooks/useParametresRecherche'
import { Button } from '@/shared/shadcn/button'
import type { NotificationCompte } from '@/shared/types'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'

/** Les plus récentes d'abord : celles créées par l'application, puis celles de départ. */
const rang = (n: NotificationCompte) => dateDeCreation(n.id)?.getTime() ?? 0

/**
 * « Notifications » (canevas : 1. Toutes, 2. Non lues ; le filtre est dans
 * l'adresse, `?filtre=non-lues`) : « Nouvelles » (non lues) puis « Plus tôt »,
 * « Tout marquer comme lu », et le lien vers les paramètres des notifications.
 */
export function MesNotifications() {
  const { account } = useSession()
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />
  return (
    <CadreMonCompte page="notifications">
      <ChargementDonnees
        fallback={
          <SkeletonZone>
            <SkeletonList rows={3} />
          </SkeletonZone>
        }
      >
        <ListeNotifications compteId={account.id} />
      </ChargementDonnees>
    </CadreMonCompte>
  )
}

function ListeNotifications({ compteId }: { compteId: string }) {
  const { t } = useTranslation('espace')
  const [parametres] = useParametresRecherche()
  const seulementNonLues = parametres.get('filtre') === 'non-lues'
  const toutes = useNotificationsCompte(compteId).toSorted((a, b) => rang(b) - rang(a))
  const nonLues = toutes.filter((n) => !n.lu)
  const groupes = [
    { cle: 'nouvelles' as const, items: nonLues },
    { cle: 'plusTot' as const, items: seulementNonLues ? [] : toutes.filter((n) => n.lu) },
  ].filter((g) => g.items.length > 0)

  const toutLire = async () => {
    try {
      await Promise.all(nonLues.map((n) => data.update('notificationsCompte', n.id, { lu: true })))
      toast.success(t('notifications.toutesLues'))
    } catch {
      toast.error(t('parametres.notifications.echec'))
    }
  }

  return (
    <CarteCompte>
      <EnTeteCompte
        titre={t('notifications.titre')}
        action={
          nonLues.length > 0 && (
            <Button variant="link" onClick={() => void toutLire()}>
              {t('notifications.toutLire')}
            </Button>
          )
        }
      />
      <PucesCompte
        titre={t('notifications.filtres.titre')}
        puces={[
          { cle: 'toutes', vers: ROUTES.notifications, libelle: t('notifications.filtres.toutes'), actif: !seulementNonLues },
          { cle: 'non-lues', vers: `${ROUTES.notifications}?filtre=non-lues`, libelle: t('notifications.filtres.nonLues', { count: nonLues.length }), actif: seulementNonLues },
        ]}
      />
      {groupes.map((g) => (
        <section key={g.cle} aria-labelledby={`groupe-${g.cle}`} className="flex flex-col">
          <h2 id={`groupe-${g.cle}`} className="pt-2.5 pb-1.5 text-ui font-bold">
            {t(`notifications.groupes.${g.cle}`)}
          </h2>
          {g.items.map((n) => (
            <LigneNotification key={n.id} notification={n} />
          ))}
        </section>
      ))}
      {groupes.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">{seulementNonLues ? t('notifications.aucuneNonLue') : t('notifications.aucune')}</p>}
      <Button asChild variant="link" className="justify-start border-t border-border pt-2">
        <Lien to={ROUTES.parametres('notifications')}>{t('notifications.parametresLien')}</Lien>
      </Button>
    </CarteCompte>
  )
}
