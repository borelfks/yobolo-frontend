import { useTranslation } from 'react-i18next'
import { MarqueYibolo } from '@/shared/blocs/Marque'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

const LIENS = [
  { cle: 'aide', vers: ROUTES.help },
  { cle: 'conditions', vers: ROUTES.terms },
] as const

/** Le pied de page du canevas (planche « Pied de page ») : logo et devise, Aide et contact · Conditions générales, copyright. */
export function PiedDePage({ className }: { className?: string }) {
  const { t } = useTranslation('layout')
  return (
    <footer className={cn('bg-foreground text-footer-foreground', className)}>
      <div className="mx-auto flex max-w-bar flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-7">
        <MarqueYibolo taille={34} clair devise={t('pied.devise')} />
        <nav aria-label={t('pied.aideLegal')} className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          {LIENS.map(({ cle, vers }) => (
            <Lien key={cle} to={vers} className="text-footer-foreground no-underline hover:text-white hover:underline">
              {t(`pied.${cle}`)}
            </Lien>
          ))}
        </nav>
        <p className="text-meta">{t('pied.copyright')}</p>
      </div>
    </footer>
  )
}
