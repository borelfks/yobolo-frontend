import { Images } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalePublication } from '@/features/accueil/components/ModalePublication'
import { useSession } from '@/features/auth/hooks/useSession'
import { Avatar } from '@/shared/components/ui/Avatar'

/**
 * « Partagez… » en tête du fil (ZonePublier de yibolo-client) — comme sur
 * Facebook : sa photo, une pilule où écrire, l'icône des photos. Un seul
 * bouton, une seule fenêtre. Dans cette démo, tout compte connecté peut publier.
 */
export function ZonePublier() {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const [ouverte, setOuverte] = useState(false)

  if (!account) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOuverte(true)}
        aria-label={t('composer.publier')}
        className="group -mx-4 flex items-center gap-2.5 border-y border-line bg-white px-4 py-3 text-left focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none focus-visible:ring-inset sm:mx-0 sm:rounded-2xl sm:border sm:px-4 sm:shadow-[0_1px_2px_rgb(0_0_0/0.05)]"
      >
        <Avatar src={account.avatar} name={account.name} size={48} />
        <span className="flex h-10 min-w-0 flex-1 items-center rounded-full border border-line bg-page px-4 text-[0.9375rem] text-muted transition-colors group-hover:bg-brand-50">
          <span className="truncate">{t('composer.invite')}</span>
        </span>
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full text-emerald-600 transition-colors group-hover:bg-emerald-600/10">
          <Images className="size-6" />
        </span>
      </button>

      <ModalePublication ouverte={ouverte} onFermer={() => setOuverte(false)} />
    </>
  )
}
