import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail, UserRoundPlus } from 'lucide-react'
import { AuthShell } from '@/app/layouts/AuthLayout'
import { demoAccounts } from '@/mocks/demoAccounts'
import { useSession } from '@/features/auth/hooks/useSession'
import type { Role } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

const input = 'h-12 w-full rounded-xl border border-[#c9d4ea] bg-white pr-11 pl-11 text-[15px] text-ink outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100'

export function Connexion() {
  const { t } = useTranslation('auth')
  const { signIn } = useSession()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState<Role>(params.get('espace') === 'ecole' ? 'ipes' : 'utilisateur')
  const [show, setShow] = useState(false)
  // Construit dans le composant (comme yibolo-client) : les messages suivent la langue.
  const schema = useMemo(
    () =>
      z.object({
        identifiant: z.string().min(1, t('connexion.errors.identifier')),
        motDePasse: z.string().min(6, t('connexion.errors.password')),
      }),
    [t],
  )
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifiant: '', motDePasse: '' },
  })

  const connect = () => {
    const account = signIn(role)
    toast.success(t('connexion.welcome', { name: account.name }))
    navigate(account.home)
  }

  return (
    <AuthShell
      below={
        <div className="mt-4 rounded-2xl bg-white/12 p-3 text-white">
          <p className="mb-2 text-[12px] font-semibold tracking-wide uppercase opacity-80">{t('connexion.demoAccount')}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(demoAccounts) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn('rounded-full px-3 py-1 text-[13px] font-semibold', role === r ? 'bg-white text-navy-900' : 'bg-white/15 hover:bg-white/25')}
              >
                {t(`demoAccounts.${r}.label`)}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(connect)} noValidate className="rounded-[22px] bg-white p-7 shadow-2xl shadow-navy-950/30">
        <h2 className="text-center text-[28px] font-bold text-navy-900">{t('connexion.title')}</h2>
        <div className="mt-6 space-y-4">
          <div>
            <label className="relative block">
              <Mail className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-800" />
              <input aria-label={t('connexion.identifier')} placeholder={t('connexion.identifier')} className={input} {...register('identifiant')} />
            </label>
            {formState.errors.identifiant && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.identifiant.message}</p>}
          </div>
          <div>
            <label className="relative block">
              <Lock className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-800" />
              <input aria-label={t('connexion.password')} type={show ? 'text' : 'password'} placeholder={t('connexion.password')} className={input} {...register('motDePasse')} />
              <button type="button" aria-label={show ? t('connexion.hide') : t('connexion.show')} onClick={() => setShow(!show)} className="absolute top-1/2 right-4 -translate-y-1/2 text-navy-800">
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </label>
            {formState.errors.motDePasse && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.motDePasse.message}</p>}
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-navy-900">
            <input type="checkbox" className="size-[18px] accent-brand-600" />
            {t('connexion.remember')}
          </label>
          <p className="text-right">
            <button type="button" onClick={() => toast(t('connexion.forgot.title'), { description: t('connexion.forgot.text') })} className="text-[14px] font-semibold text-brand-600 hover:underline">
              {t('connexion.forgot.link')}
            </button>
          </p>
          <button type="submit" className="h-12 w-full rounded-xl bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
            {t('connexion.submit')}
          </button>
          <div className="flex items-center gap-3 text-[14px] text-navy-900">
            <span className="h-px flex-1 bg-line" />
            {t('connexion.or')}
            <span className="h-px flex-1 bg-line" />
          </div>
          <Link to={ROUTES.signUp} className="flex h-12 items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
            <UserRoundPlus className="size-5" />
            {t('connexion.signUp')}
          </Link>
          <p className="text-center text-[13px]">
            <Link to={ROUTES.home} className="font-semibold text-brand-600 hover:underline">{t('connexion.guest')}</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}
