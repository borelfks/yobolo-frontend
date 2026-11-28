import { Check, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUES, langueActive } from '@/i18n'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'
import { cn } from '@/shared/utils/cn'

/**
 * Le choix de la langue : globe et code de la langue active (« FR »), menu Français / English.
 * `auth` : écrans de connexion et d'inscription (36 px, globe de 16 px) ; `compact` : le globe seul.
 */
export function ChoixLangue({ auth = false, compact = false, className }: { auth?: boolean; compact?: boolean; className?: string }) {
  const { t, i18n } = useTranslation()
  const active = langueActive(i18n.language)
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={t('languageSwitcher.changerDeLangue')}
        className={cn(
          'inline-flex shrink-0 cursor-pointer items-center gap-1.5 px-2.5 text-meta font-bold text-muted-foreground outline-none hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring',
          auth ? 'h-9 rounded-full' : 'h-10 rounded-lg',
          compact && 'w-10 justify-center px-0',
          className,
        )}
      >
        <Globe className={auth ? 'size-4' : 'size-[18px]'} aria-hidden />
        {!compact && active.toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LANGUES.map(({ code, libelleCle }) => (
          <DropdownMenuItem key={code} lang={code} onSelect={() => void i18n.changeLanguage(code)}>
            <span className="flex-1">{t(libelleCle)}</span>
            {active === code && <Check className="text-primary" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
