import { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/shared/components/forms/Fields'
import { cn } from '@/shared/utils/cn'
import { forceDuMotDePasse, NIVEAUX_FORCE } from '@/shared/utils/motDePasse'

/**
 * Champ mot de passe avec la bascule afficher / masquer (œil), comme dans
 * yibolo-client. S'utilise comme `Input` (y compris avec `register`).
 */
export function ChampMotDePasse({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const Icone = visible ? EyeOff : Eye
  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className={cn('pr-12', className)} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('motDePasse.masquer') : t('motDePasse.afficher')}
        aria-pressed={visible}
        title={visible ? t('motDePasse.masquer') : t('motDePasse.afficher')}
        className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-lg text-navy-800 hover:bg-brand-50"
      >
        <Icone className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}

const COULEURS = ['bg-rose-500', 'bg-amber-500', 'bg-brand-600', 'bg-emerald-500'] as const

/**
 * La solidité du mot de passe saisi (yibolo-client) : quatre barres et
 * « Solidité du mot de passe : Faible / Moyen / Bon / Excellent », avec un
 * conseil tant qu'il est faible ou moyen. Vide : l'aide `aide`.
 */
export function JaugeMotDePasse({ motDePasse, aide }: { motDePasse: string; aide?: string }) {
  const { t } = useTranslation()
  const force = forceDuMotDePasse(motDePasse)
  return (
    <div className="mt-1.5 flex flex-col gap-1.5" aria-live="polite">
      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {NIVEAUX_FORCE.map((niveau, rang) => (
          <span key={niveau} className={cn('h-1.5 rounded-full transition-colors', rang < force ? COULEURS[force - 1] : 'bg-slate-200')} />
        ))}
      </div>
      <p className="text-xs text-muted">
        {force === 0 ? (
          aide
        ) : (
          <>
            <span className="font-semibold text-navy-900">
              {t('motDePasse.force.niveau', { niveau: t(`motDePasse.force.${NIVEAUX_FORCE[force - 1] ?? 'faible'}`) })}
            </span>
            {force < 3 && <> · {t('motDePasse.force.conseil')}</>}
          </>
        )}
      </p>
    </div>
  )
}
