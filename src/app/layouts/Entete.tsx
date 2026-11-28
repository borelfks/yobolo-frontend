import { useTranslation } from 'react-i18next'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ChoixLangue } from '@/shared/blocs/ChoixLangue'
import { MarqueYibolo } from '@/shared/blocs/Marque'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { LienActif } from '@/shared/ui/LienActif'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { ClocheNotifications, MenuCompte } from './AccountMenu'
import { publicNav, type PublicNavItem } from './navConfig'
import { RechercheEntete, RechercheEnteteMobile } from './RechercheEntete'

/** Les univers du menu principal, avec leur adresse pour ce compte. */
function useUnivers() {
  const { account } = useSession()
  // Connecté, « Accueil » et le logo mènent à l'accueil connecté (la landing est réservée aux visiteurs) ;
  // pour une école, « École » mène à son espace professionnel.
  const accueil = account ? account.home : ROUTES.home
  const ecole = !!account && account.role !== 'utilisateur'
  const vers = (to: string) => (to === ROUTES.home ? accueil : ecole && to === ROUTES.schools ? ROUTES.pro.root : to)
  // Consultation et Emploi (« Bientôt ») ne sont montrés qu'aux comptes connectés.
  const univers = publicNav.filter((l) => !l.bientot || !!account).map((l) => ({ ...l, to: vers(l.to) }))
  return { accueil, univers }
}

/** Un univers du menu : icône au-dessus du nom ; l'actif est bleu, souligné de 3 px. « Bientôt » : grisé, sans lien. */
function Univers({ item, mobile }: { item: PublicNavItem; mobile?: boolean }) {
  const { t } = useTranslation('layout')
  const base = cn('flex flex-col items-center justify-center border-b-[3px] whitespace-nowrap no-underline', mobile ? 'h-14 gap-[3px] text-xs' : 'min-w-[104px] gap-[3px] px-4 text-sm')
  const icone = mobile ? 'size-[22px]' : 'size-6'
  if (item.bientot)
    return (
      <span aria-disabled="true" title={t('entete.bientotDisponible')} className={cn(base, 'cursor-default gap-0.5 border-transparent font-semibold text-input')}>
        <item.icon className={icone} aria-hidden />
        {t(item.labelKey)}
        <span className="rounded-full bg-secondary px-1.5 py-px text-[10px] font-bold text-subtle-foreground">{t('entete.bientot')}</span>
      </span>
    )
  return (
    <LienActif
      to={item.to}
      end={item.to === ROUTES.home}
      className={({ isActive }) =>
        cn(base, isActive ? 'border-primary font-extrabold text-primary' : 'border-transparent font-semibold text-foreground-soft hover:text-foreground', isActive && !mobile && 'bg-primary-wash')
      }
    >
      <item.icon className={icone} aria-hidden />
      {t(item.labelKey)}
    </LienActif>
  )
}

/**
 * La barre du haut du canevas (planches « Barre du haut » et « Barre du haut et
 * onglets — téléphone »). Ordinateur : logo et recherche, les univers au centre,
 * langue, cloche et compte à droite. Téléphone : une barre de 56 px, puis les
 * univers en onglets dessous.
 */
export function Entete() {
  const { t } = useTranslation('layout')
  const { account } = useSession()
  const { accueil, univers } = useUnivers()
  const logo = (
    <Lien to={accueil} aria-label={t('entete.accueilAria')} className="flex shrink-0 no-underline">
      <MarqueYibolo taille={38} classeSymbole="size-8 lg:size-[38px]" classeNom="max-lg:text-lg" />
    </Lien>
  )
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card text-foreground shadow-bar">
      {/* Ordinateur */}
      <div className="mx-auto hidden h-[68px] max-w-bar grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 lg:grid">
        <div className="flex min-w-0 items-center gap-3.5">
          {logo}
          <RechercheEntete />
        </div>
        <nav aria-label={t('entete.menuPrincipal')} className="flex h-[68px] items-stretch">
          {univers.map((u) => (
            <Univers key={u.labelKey} item={u} />
          ))}
        </nav>
        <div className="flex items-center justify-end gap-1.5">
          <ChoixLangue />
          {account ? (
            <>
              <ClocheNotifications />
              <MenuCompte />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="px-3 text-sm text-foreground hover:bg-transparent hover:text-primary">
                <Lien to={ROUTES.signUp}>{t('account.signUp')}</Lien>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <Lien to={ROUTES.signIn}>{t('account.signIn')}</Lien>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Téléphone et tablette */}
      <div className="flex h-14 items-center gap-1 pr-2 pl-3.5 lg:hidden">
        <div className="flex flex-1">{logo}</div>
        <RechercheEnteteMobile />
        <ChoixLangue compact />
        {account ? (
          <>
            <ClocheNotifications />
            <MenuCompte />
          </>
        ) : (
          <Button asChild variant="secondary" size="md" className="ml-1">
            <Lien to={ROUTES.signIn}>{t('account.signIn')}</Lien>
          </Button>
        )}
      </div>
      <nav aria-label={t('entete.menuPrincipal')} className={cn('grid border-t border-secondary lg:hidden', univers.length > 2 ? 'grid-cols-4' : 'grid-cols-2')}>
        {univers.map((u) => (
          <Univers key={u.labelKey} item={u} mobile />
        ))}
      </nav>
    </header>
  )
}
