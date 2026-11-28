import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Bell, Download, Info, MessageCircle, UserRound } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useNotifications } from '@/data/hooks'
import { Button } from '@/shared/shadcn/button'
import { Switch } from '@/shared/shadcn/switch'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { cn } from '@/shared/utils/cn'
import type { NotificationPro } from '@/shared/types'
import { CartePro, LigneReglage, Pastille, type TonPastille } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { useReglages } from '@/modules/ecole/espace-pro/hooks/useReglages'

/** Apparence de chaque type de notification (valeur `type` des données). */
const TYPES: Record<string, { icone: typeof Bell; ton: TonPastille }> = {
  avis: { icone: MessageCircle, ton: 'violet' },
  document: { icone: Download, ton: 'bleu' },
  rappel: { icone: Bell, ton: 'ambre' },
  candidature: { icone: UserRound, ton: 'vert' },
}
const FILTRES = ['toutes', 'nonLues', 'lues'] as const
type Filtre = (typeof FILTRES)[number]
/** Les alertes réglables : clé enregistrée (`notifications.alertes.*`) et valeur par défaut. */
const ALERTES = [
  ['downloads', true],
  ['reviews', true],
  ['reminders', true],
  ['news', false],
] as const

/** 7.3 Notifications : la liste (lues / non lues), « Tout marquer comme lu », puis les alertes (enregistrées tout de suite). */
export function Notifications() {
  const { t } = useTranslation('pro', { keyPrefix: 'parametres.notifications' })
  const id = useId()
  const { ecole } = useMonEcole()
  const toutes = useNotifications().filter((n) => !n.etablissementId || n.etablissementId === ecole.id)
  const reglages = useReglages('notifications')
  const [filtre, setFiltre] = useState<Filtre>('toutes')
  const nonLues = toutes.filter((n) => !n.lu).length
  const nombres: Record<Filtre, number> = { toutes: toutes.length, nonLues, lues: toutes.length - nonLues }
  const liste = toutes.filter((n) => filtre === 'toutes' || (filtre === 'lues') === n.lu)
  const marquer = (ns: NotificationPro[]) => Promise.all(ns.filter((n) => !n.lu).map((n) => data.update('notifications', n.id, { lu: true })))
  return (
    <>
      <CartePro
        titre={t('titre')}
        action={
          <Button variant="link" disabled={nonLues === 0} onClick={async () => { await marquer(toutes); toast.success(t('toutesLues')) }}>
            {t('toutLire')}
          </Button>
        }
      >
        <ToggleGroup type="single" variant="outline" size="lg" value={filtre} onValueChange={(v) => v && setFiltre(FILTRES.find((f) => f === v) ?? 'toutes')} aria-label={t('filtrer')} className="flex-wrap">
          {FILTRES.map((f) => (
            <ToggleGroupItem key={f} value={f}>
              {t(`filtres.${f}`, { n: nombres[f] })}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {liste.length === 0 ? (
          <p className="py-5 text-center text-sm text-muted-foreground">{t('vide')}</p>
        ) : (
          <ul>
            {liste.map((n) => {
              const type = TYPES[n.type] ?? { icone: Info, ton: 'gris' as const }
              return (
                <li key={n.id} className={cn('-mx-3 flex items-start gap-3 border-t border-border px-3 py-3.5', !n.lu && 'bg-primary-wash')}>
                  <Pastille icone={type.icone} ton={type.ton} />
                  <Button variant="ghost" onClick={() => void marquer([n])} className="h-auto min-w-0 flex-1 flex-col items-start gap-[3px] rounded-none border-0 p-0 text-left font-normal whitespace-normal text-foreground hover:bg-transparent hover:text-foreground">
                    <b className="text-ui">{n.titre}</b>
                    <span className="text-sm text-foreground-soft">{n.texte}</span>
                    <span className={cn('text-xs font-bold', n.lu ? 'text-subtle-foreground' : 'text-primary')}>{n.date}</span>
                  </Button>
                  {!n.lu && <span className="size-2.5 shrink-0 self-center rounded-full bg-primary" role="img" aria-label={t('nonLue')} />}
                </li>
              )
            })}
          </ul>
        )}
      </CartePro>
      <CartePro titre={t('reglages')}>
        <div>
          {ALERTES.map(([cle, defaut]) => (
            <LigneReglage key={cle} id={`${id}-${cle}`} titre={t(`alertes.${cle}.titre`)} aide={t(`alertes.${cle}.aide`)}>
              <Switch
                checked={reglages.oui(`alertes.${cle}`, defaut)}
                aria-labelledby={`${id}-${cle}`}
                onCheckedChange={async (v) => {
                  await reglages.enregistrer({ [`alertes.${cle}`]: v })
                  toast.success(t(v ? 'alerteActivee' : 'alerteDesactivee'))
                }}
              />
            </LigneReglage>
          ))}
        </div>
      </CartePro>
    </>
  )
}
