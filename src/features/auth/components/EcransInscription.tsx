import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Clock, LogIn, Mail } from 'lucide-react'
import { AuthCard } from '@/app/layouts/AuthLayout'
import { Img } from '@/shared/components/ui/Img'
import { useSession } from '@/features/auth/hooks/useSession'
import type { Compte } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

/** Inscription d'une école : « Votre compte est en cours de vérification » (maquette). */
export function EcranAttente() {
  const { t } = useTranslation('auth')
  return (
    <AuthCard>
      <div className="py-4 text-center">
        <Img src="/images/maquette/auth-verification.jpg" alt="" className="mx-auto h-[150px] w-[255px]" />
        <h1 className="mt-4 text-[24px] font-bold text-navy-900">{t('inscription.pending.title')}</h1>
        <p className="mt-2 text-[15.5px] text-navy-900">
          {t('inscription.pending.text1')}
          <br />
          {t('inscription.pending.text2')}
        </p>
        <div className="mx-auto mt-5 grid max-w-md grid-cols-2 divide-x divide-line rounded-xl bg-[#eef3fc] py-3 text-left">
          <p className="flex items-center gap-3 px-5 text-[13.5px] text-navy-900"><Clock className="size-7 text-brand-600" /><span>{t('inscription.pending.delay')}<b className="block text-[15px]">{t('inscription.pending.delayValue')}</b></span></p>
          <p className="flex items-center gap-3 px-5 text-[13.5px] text-navy-900"><Mail className="size-7 text-brand-600" /><span>{t('inscription.pending.notification')}<b className="block text-[15px]">{t('inscription.pending.notificationValue')}</b></span></p>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link to={ROUTES.signIn} className="inline-flex h-11 w-72 items-center justify-center rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">{t('inscription.pending.back')}</Link>
        </div>
      </div>
    </AuthCard>
  )
}

/** « Compte validé ! » (maquette) : se connecter à son espace. */
export function EcranValide({ compte }: { compte: Compte | null }) {
  const { t } = useTranslation('auth')
  const { signIn } = useSession()
  const navigate = useNavigate()
  return (
    <AuthCard>
      <div className="py-4 text-center">
        <Img src="/images/maquette/auth-valide.jpg" alt="" className="mx-auto h-[120px] w-[296px]" />
        <h1 className="mt-4 text-[30px] font-extrabold text-navy-900">{t('inscription.validated.title')}</h1>
        <p className="mt-2 text-[16px] text-navy-900">
          {t('inscription.validated.text1')}
          <br />
          {t('inscription.validated.text2')}
        </p>
        <button
          type="button"
          onClick={() => {
            if (!compte) return navigate(ROUTES.signIn)
            signIn(compte)
            navigate(compte.home)
          }}
          className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-brand-600 px-14 text-[17px] font-semibold text-white hover:bg-brand-700"
        >
          <LogIn className="size-5" />
          {t('inscription.validated.signIn')}
        </button>
      </div>
    </AuthCard>
  )
}
