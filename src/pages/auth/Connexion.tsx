import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail, UserRoundPlus } from 'lucide-react'
import { AuthShell } from '@/pages/auth/AuthShell'
import { demoAccounts, useSession, type Role } from '@/hooks/useSession'
import { cn } from '@/lib/utils'

const schema = z.object({
  identifiant: z.string().min(1, 'Saisissez votre e-mail ou votre téléphone.'),
  motDePasse: z.string().min(6, 'Le mot de passe compte au moins 6 caractères.'),
})

const input = 'h-12 w-full rounded-xl border border-[#c9d4ea] bg-white pr-11 pl-11 text-[15px] text-ink outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100'

export default function Connexion() {
  const { signIn } = useSession()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState<Role>(params.get('espace') === 'ecole' ? 'ipes' : 'utilisateur')
  const [show, setShow] = useState(false)
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifiant: '', motDePasse: '' },
  })

  const connect = () => {
    const account = signIn(role)
    toast.success(`Bienvenue, ${account.name} !`)
    navigate(account.home)
  }

  return (
    <AuthShell
      below={
        <div className="mt-4 rounded-2xl bg-white/12 p-3 text-white">
          <p className="mb-2 text-[12px] font-semibold tracking-wide uppercase opacity-80">Compte de démonstration</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(demoAccounts) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn('rounded-full px-3 py-1 text-[13px] font-semibold', role === r ? 'bg-white text-navy-900' : 'bg-white/15 hover:bg-white/25')}
              >
                {demoAccounts[r].label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(connect)} noValidate className="rounded-[22px] bg-white p-7 shadow-2xl shadow-navy-950/30">
        <h2 className="text-center text-[28px] font-bold text-navy-900">Connexion</h2>
        <div className="mt-6 space-y-4">
          <div>
            <label className="relative block">
              <Mail className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-800" />
              <input aria-label="Email ou téléphone" placeholder="Email ou téléphone" className={input} {...register('identifiant')} />
            </label>
            {formState.errors.identifiant && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.identifiant.message}</p>}
          </div>
          <div>
            <label className="relative block">
              <Lock className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-800" />
              <input aria-label="Mot de passe" type={show ? 'text' : 'password'} placeholder="Mot de passe" className={input} {...register('motDePasse')} />
              <button type="button" aria-label={show ? 'Masquer' : 'Afficher'} onClick={() => setShow(!show)} className="absolute top-1/2 right-4 -translate-y-1/2 text-navy-800">
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </label>
            {formState.errors.motDePasse && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.motDePasse.message}</p>}
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-navy-900">
            <input type="checkbox" className="size-[18px] accent-brand-600" />
            Se souvenir de moi
          </label>
          <p className="text-right">
            <button type="button" onClick={() => toast('Mot de passe oublié', { description: 'Un code vous serait envoyé par SMS ou WhatsApp.' })} className="text-[14px] font-semibold text-brand-600 hover:underline">
              Mot de passe oublié ?
            </button>
          </p>
          <button type="submit" className="h-12 w-full rounded-xl bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
            Se connecter
          </button>
          <div className="flex items-center gap-3 text-[14px] text-navy-900">
            <span className="h-px flex-1 bg-line" />
            Ou
            <span className="h-px flex-1 bg-line" />
          </div>
          <Link to="/inscription" className="flex h-12 items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
            <UserRoundPlus className="size-5" />
            Créer un compte
          </Link>
          <p className="text-center text-[13px]">
            <Link to="/" className="font-semibold text-brand-600 hover:underline">Continuer sans compte</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}
