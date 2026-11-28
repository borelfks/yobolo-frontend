import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Bell, Building2, ChartColumn, ChevronDown, CircleHelp, Heart, LogOut, SlidersVertical, type LucideIcon } from 'lucide-react'
import { POUR_TOUS, useCollectionWhenReady } from '@/data'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { slugOfType } from '@/modules/ecole/etablissements/schoolTypes'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar'
import { buttonVariants } from '@/shared/shadcn/variants'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'
import { Lien } from '@/shared/ui/Lien'
import { LienActif } from '@/shared/ui/LienActif'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Les notifications non lues du compte connecté (espace pro : table `notifications` ; personne : `notificationsCompte`). */
function useNonLues() {
  const { account } = useSession()
  const pro = useCollectionWhenReady('notifications')
  const perso = useCollectionWhenReady('notificationsCompte')
  if (!account) return 0
  if (account.ecoleId) return pro.filter((n) => (!n.etablissementId || n.etablissementId === account.ecoleId) && !n.lu).length
  return perso.filter((n) => (n.compteId === account.id || n.compteId === POUR_TOUS) && n.type !== 'preRegistration' && n.type !== 'session' && !n.lu).length
}

/**
 * Ce que le menu montre du compte connecté : nom court du bouton, nom complet,
 * ligne de rôle (« Personne physique · Yaoundé », « École – IPES · Yaoundé »),
 * page « Voir mon profil » / « Voir ma page publique ».
 */
function useResumeCompte() {
  const { t } = useTranslation('layout')
  const { account } = useSession()
  const ecoles = useCollectionWhenReady('etablissements')
  if (!account) return null
  const ecole = account.ecoleId ? ecoles.find((e) => e.id === account.ecoleId) : undefined
  const estEcole = account.role !== 'utilisateur'
  const ville = ecole?.ville ?? account.ville
  const role = estEcole ? t('compte.roleEcole', { type: t(`schoolType.${ecole?.type ?? 'IPES'}`) }) : t('compte.rolePersonne')
  // Une auto-école inscrite n'a pas encore de fiche d'auto-école : sa page publique est celle d'un établissement « Autres ».
  const slug = ecole ? slugOfType(ecole.type) : 'ipes'
  return {
    estEcole,
    nom: account.name,
    court: account.prenom ?? (ecole?.sigle || account.name.split(' ')[0] || account.name),
    role: ville ? `${role} · ${ville}` : role,
    photo: account.avatar || ecole?.vignette || ecole?.image || '',
    initiales: account.name
      .split(/\s+/)
      .map((m) => m[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    voir: estEcole ? (ecole ? ROUTES.school(slug === 'auto-ecoles' ? 'autres' : slug, ecole.id) : ROUTES.pro.profile()) : ROUTES.profil,
  }
}

/**
 * La cloche du canevas : un lien vers les notifications (personne : la page
 * Notifications ; école : Paramètres › Notifications), avec le nombre de non lues.
 */
export function ClocheNotifications({ className }: { className?: string }) {
  const { t } = useTranslation('layout')
  const { account } = useSession()
  const count = useNonLues()
  if (!account) return null
  const vers = account.role === 'utilisateur' ? ROUTES.notifications : ROUTES.pro.settings('notifications')
  return (
    <LienActif
      to={vers}
      end
      aria-label={t('notifications.aria', { count })}
      className={({ isActive }) =>
        cn(
          'relative grid size-[42px] shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-accent sm:size-11',
          isActive && 'bg-primary-wash text-primary',
          className,
        )
      }
    >
      <Bell className="size-[22px] sm:size-6" aria-hidden />
      {count > 0 && (
        <span aria-hidden className="absolute top-1 right-[3px] grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-card bg-destructive px-[5px] text-legende leading-none font-extrabold text-white">
          {count}
        </span>
      )}
    </LienActif>
  )
}

type Entree = { icone: LucideIcon; cle: 'favoris' | 'parametres' | 'aide' | 'profilEtablissement' | 'statistiques'; vers: string }

/**
 * Le menu du compte du canevas (clic sur la photo) : photo, nom, rôle,
 * « Voir mon profil » (ou « Voir ma page publique »), les lieux du compte,
 * « Se déconnecter ». Sur téléphone, il s'ouvre sous la barre, sur toute la largeur.
 */
export function MenuCompte() {
  const { t } = useTranslation('layout')
  const { signOut } = useSession()
  const navigate = useNavigate()
  const r = useResumeCompte()
  if (!r) return null
  const entrees: Entree[] = r.estEcole
    ? [
        { icone: Building2, cle: 'profilEtablissement', vers: ROUTES.pro.profile() },
        { icone: ChartColumn, cle: 'statistiques', vers: ROUTES.pro.statistics },
        { icone: SlidersVertical, cle: 'parametres', vers: ROUTES.pro.settings() },
        { icone: CircleHelp, cle: 'aide', vers: ROUTES.help },
      ]
    : [
        { icone: Heart, cle: 'favoris', vers: ROUTES.favorites },
        { icone: SlidersVertical, cle: 'parametres', vers: ROUTES.parametres() },
        { icone: CircleHelp, cle: 'aide', vers: ROUTES.help },
      ]
  const photo = (classe: string) => (
    <Avatar className={cn(classe, r.estEcole && 'rounded-md')}>
      {r.photo && <AvatarImage src={r.photo} alt="" className="object-cover" />}
      <AvatarFallback className={cn(r.estEcole && 'rounded-md')}>{r.initiales}</AvatarFallback>
    </Avatar>
  )
  const entree = 'min-h-11 gap-3 rounded-md px-3 text-sm font-semibold text-foreground focus:bg-background [&_svg]:size-5'
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={t('compte.aria', { nom: r.nom })}
        className="group flex shrink-0 cursor-pointer items-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-ring sm:h-11 sm:gap-2 sm:border sm:border-border sm:bg-card sm:pr-2.5 sm:pl-1 sm:text-foreground sm:hover:bg-accent sm:data-[state=open]:border-primary sm:data-[state=open]:bg-primary-wash max-sm:size-[42px] max-sm:justify-center"
      >
        {/* Téléphone : la photo seule, entourée de bleu quand le menu est ouvert. */}
        <span className="rounded-full group-data-[state=open]:max-sm:ring-2 group-data-[state=open]:max-sm:ring-primary group-data-[state=open]:max-sm:ring-offset-2">
          {photo('size-8 sm:size-[34px]')}
        </span>
        <span className="hidden text-sm font-bold sm:inline">{r.court}</span>
        <ChevronDown className="hidden size-4 sm:block" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        collisionPadding={0}
        aria-label={t('compte.menu')}
        className="flex w-[300px] flex-col rounded-xl p-2.5 shadow-account max-sm:w-screen max-sm:rounded-none max-sm:border-x-0 max-sm:border-b-0 max-sm:px-3 max-sm:pb-3"
      >
        <div className="flex items-center gap-3 px-1.5 pt-1.5 pb-3">
          {photo('size-14')}
          <span className="flex min-w-0 flex-col gap-0.5">
            <b className="text-ui text-foreground">{r.nom}</b>
            <span className="text-xs text-muted-foreground">{r.role}</span>
          </span>
        </div>
        <DropdownMenuItem asChild className={cn(buttonVariants({ variant: 'secondary', size: 'md' }), 'mx-1 mb-2 min-h-9 justify-center text-primary focus:bg-primary-soft focus:text-primary')}>
          <Lien to={r.voir}>{r.estEcole ? t('compte.voirPagePublique') : t('compte.voirProfil')}</Lien>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mx-1 mt-0 mb-1.5" />
        {entrees.map(({ icone: Icone, cle, vers }) => (
          <DropdownMenuItem key={cle} asChild className={entree}>
            <Lien to={vers}>
              <Icone className="text-muted-foreground" aria-hidden />
              <span className="flex-1">{t(`compte.${cle}`)}</span>
            </Lien>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="mx-1 my-1.5" />
        <DropdownMenuItem
          className={cn(entree, 'text-destructive-hover focus:text-destructive-hover [&_svg]:text-destructive-hover')}
          onSelect={() => {
            signOut()
            navigate({ href: ROUTES.signIn })
          }}
        >
          <LogOut aria-hidden />
          {t('compte.deconnexion')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Noms gardés pour l'en-tête de la landing (gelée), qui les importe. */
export { ClocheNotifications as NotificationsBell, MenuCompte as UserMenu }
