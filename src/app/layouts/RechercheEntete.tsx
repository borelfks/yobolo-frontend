import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/shared/shadcn/sheet'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Le champ « Rechercher » de la barre du haut. Un compte connecté cherche dans
 * le fil de l'accueil (`/accueil?q=`), un visiteur dans l'annuaire des écoles.
 */
function useChercher() {
  const { account } = useSession()
  const navigate = useNavigate()
  return (q: string) => {
    const texte = q.trim()
    if (!texte) return false
    navigate({ href: account ? ROUTES.accueilRecherche(texte) : ROUTES.schoolSearch(texte) })
    return true
  }
}

function Formulaire({ onFini, grand = false, className }: { onFini?: () => void; grand?: boolean; className?: string }) {
  const { t } = useTranslation('layout')
  const chercher = useChercher()
  const envoyer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (chercher(String(new FormData(e.currentTarget).get('q') ?? ''))) {
      e.currentTarget.reset()
      onFini?.()
    }
  }
  return (
    <form role="search" onSubmit={envoyer} className={className}>
      <label
        className={cn(
          'flex items-center gap-2 rounded-full bg-surface-search px-3 text-muted-foreground focus-within:outline-2 focus-within:outline-ring',
          grand ? 'h-11' : 'h-[38px]',
        )}
      >
        <Search className="size-4 shrink-0" strokeWidth={2.2} aria-hidden />
        <Input
          name="q"
          type="search"
          autoFocus={grand}
          aria-label={t('entete.rechercherAria')}
          placeholder={t('entete.rechercher')}
          className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 text-sm focus-visible:outline-none"
        />
      </label>
    </form>
  )
}

/** Ordinateur : le champ, à côté du logo. */
export function RechercheEntete() {
  return <Formulaire className="min-w-0 flex-[0_1_220px]" />
}

/** Téléphone : la loupe, qui ouvre le champ en haut de l'écran. */
export function RechercheEnteteMobile() {
  const { t } = useTranslation('layout')
  const [ouvert, setOuvert] = useState(false)
  return (
    <Sheet open={ouvert} onOpenChange={setOuvert}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('entete.rechercher')} className="size-[42px] text-foreground">
          <Search className="size-[22px]" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" aria-describedby={undefined} className="gap-0 p-3 pr-14">
        <SheetTitle className="sr-only">{t('entete.rechercherAria')}</SheetTitle>
        <Formulaire grand onFini={() => setOuvert(false)} />
      </SheetContent>
    </Sheet>
  )
}
