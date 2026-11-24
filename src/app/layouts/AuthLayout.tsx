import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft, CircleCheck } from 'lucide-react'
import { Logo } from '@/shared/components/ui/Logo'
import { Img } from '@/shared/components/ui/Img'
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher'
import { ROUTES } from '@/shared/utils/routes'

const points = ['schools', 'consultants', 'jobs', 'skills'] as const

/**
 * Choix de la langue des écrans de connexion et d'inscription : dans le coin
 * de la page sur grand écran (hors de la carte), au-dessus de la carte sinon.
 */
function AuthLanguage() {
  return <LanguageSwitcher className="mb-3 self-end justify-self-end lg:absolute lg:top-4 lg:right-4 lg:mb-0" />
}

/**
 * Écran de connexion, sur le modèle de la connexion de yibolo-client, aux
 * couleurs de l'application (bleu YIBOLO, bleu nuit, Plus Jakarta Sans) : le
 * formulaire à gauche sur le fond des pages (`page`), la photo et la phrase de la marque à droite. Sur téléphone et tablette, seule la colonne
 * du formulaire reste, pour se connecter sans défiler.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation('layout')
  return (
    <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] bg-page lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]">
      <main className="flex min-w-0 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-2 px-5 sm:px-8 lg:px-12">
          <Logo className="mr-auto" />
          <Link
            to={ROUTES.home}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted transition-colors hover:bg-brand-50 hover:text-navy-900"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            <span className="sm:hidden">{t('authLayout.home')}</span>
            <span className="hidden sm:inline">{t('authLayout.backHome')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 flex-col px-5 sm:px-8 lg:px-12">
          <div className="mx-auto flex w-full max-w-[25rem] flex-1 flex-col pt-6 pb-14 sm:justify-center sm:pt-10">{children}</div>
        </div>
      </main>

      {/* La photo voilée et la phrase de la marque posée en bas, comme le héro de l'accueil. */}
      <aside className="relative hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:p-3">
        <div className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl p-10 text-white xl:p-12">
          <Img src="/images/accueil/ecoles.jpg" alt="" className="absolute inset-0 size-full object-cover object-[center_25%]" />
          <div className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-900/35 to-transparent" />
          <div className="relative max-w-lg">
            <h2 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-balance">{t('authLayout.headline')}</h2>
            <ul className="mt-6 grid gap-x-6 gap-y-3 text-[15px] text-white/90 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
                  {t(`authLayout.points.${p}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}

/** Carte centrée des écrans d'inscription (img1, écrans 2 à 6). */
export function AuthCard({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_top,#eef3ff,#f4f7fc_60%)] p-4">
      <AuthLanguage />
      <div className="w-full max-w-[720px] rounded-[26px] border border-line bg-white p-6 shadow-xl shadow-navy-900/10 md:p-8">
        <div className="flex items-center justify-between">
          <Logo />
          {title && <p className="text-[22px] font-bold text-navy-900">{title}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
