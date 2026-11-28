import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { ecoleUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { LienActif } from '@/shared/ui/LienActif'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { proNav } from './navConfig'

/**
 * Le menu de l'espace professionnel (canevas) : l'établissement (logo, nom,
 * type et ville, « Établissement vérifié », « Voir ma page publique → »), puis
 * les rubriques, soulignées à gauche quand elles sont ouvertes, avec leurs
 * sous-rubriques toujours visibles.
 */
export function MenuPro({ onNavigate, enTete }: { onNavigate?: () => void; /** Le bouton « Fermer » du tiroir (téléphone). */ enTete?: ReactNode }) {
  const { t } = useTranslation('layout')
  const { ecole } = useMonEcole()
  // Une auto-école inscrite n'a pas encore de fiche d'auto-école : sa page publique est celle d'un établissement « Autres ».
  const pagePublique = ecole.type === 'Auto-école' ? ROUTES.school('autres', ecole.id) : ecoleUrl(ecole)
  return (
    <>
      <div className="flex flex-col gap-2 border-b border-border p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-12 rounded-md border border-border bg-card">
            <AvatarImage src={ecole.vignette ?? ecole.image} alt="" className="object-cover" />
            <AvatarFallback className="rounded-md">{ecole.sigle || ecole.nom.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <b className="text-ui text-foreground">{ecole.nom}</b>
            <span className="text-xs text-muted-foreground">{t('compte.roleEcole', { type: t(`schoolType.${ecole.type}`) })} · {ecole.ville}</span>
          </span>
          {enTete}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
          <ShieldCheck className="size-3.5" strokeWidth={2.4} aria-hidden />
          {t('pro.verified')}
        </span>
        <Button asChild variant="link" className="self-start">
          <Lien to={pagePublique} onClick={onNavigate}>
            {t('pro.pagePublique')}
          </Lien>
        </Button>
      </div>
      <nav aria-label={t('pro.navAria')} className="flex flex-col py-2">
        {proNav.map((item) => (
          <div key={item.labelKey}>
            <LienActif
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[42px] w-full items-center gap-2.5 border-l-[3px] px-4 py-2 text-sm font-semibold no-underline transition-colors',
                  isActive ? 'border-primary bg-primary-soft text-primary-strong' : 'border-transparent text-foreground-soft hover:bg-background hover:text-foreground',
                )
              }
            >
              <item.icon className="size-[18px] shrink-0" aria-hidden />
              {t(item.labelKey)}
            </LienActif>
            {item.children?.map((c) => (
              <Lien key={c.to} to={c.to} onClick={onNavigate} className="block py-[7px] pr-4 pl-[46px] text-meta font-semibold text-muted-foreground no-underline hover:text-primary hover:underline">
                {t(c.labelKey)}
              </Lien>
            ))}
          </div>
        ))}
      </nav>
    </>
  )
}
