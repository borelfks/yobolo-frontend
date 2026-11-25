import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { MessageSquareCode, RotateCcw, ShieldCheck } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { DELAI_RENVOI, LONGUEUR_CODE, masquerNumero, nouveauCode } from '@/features/auth/authOtp'

/**
 * Saisie du code reçu sur le téléphone (6 cases), avec « Renvoyer le code »
 * après 60 s, comme dans yibolo-client. Sans serveur d'envoi de SMS, le
 * message reçu s'affiche dans un encadré. `onVerifie` est appelé quand le
 * bon code est saisi.
 */
export function VerificationCode({
  telephone,
  libelleBouton,
  onVerifie,
}: {
  telephone: string
  libelleBouton?: string
  onVerifie: () => void | Promise<void>
}) {
  const { t } = useTranslation('auth', { keyPrefix: 'otp' })
  const [code, setCode] = useState(nouveauCode)
  const [cases, setCases] = useState<string[]>(() => Array<string>(LONGUEUR_CODE).fill(''))
  const [erreur, setErreur] = useState('')
  const [secondes, setSecondes] = useState(DELAI_RENVOI)
  const [envoi, setEnvoi] = useState(false)
  const champs = useRef<(HTMLInputElement | null)[]>([])

  // Le compte à rebours avant de pouvoir redemander un code.
  useEffect(() => {
    if (secondes <= 0) return
    const minuterie = window.setTimeout(() => setSecondes((s) => s - 1), 1000)
    return () => window.clearTimeout(minuterie)
  }, [secondes])

  const ecrire = (rang: number, saisie: string) => {
    const chiffres = saisie.replace(/\D/g, '')
    if (!chiffres) {
      setCases((c) => c.map((x, i) => (i === rang ? '' : x)))
      return
    }
    // Un code collé d'un coup remplit les cases suivantes.
    setCases((c) => {
      const suite = [...c]
      chiffres.split('').slice(0, LONGUEUR_CODE - rang).forEach((ch, i) => (suite[rang + i] = ch))
      return suite
    })
    setErreur('')
    champs.current[Math.min(rang + chiffres.length, LONGUEUR_CODE - 1)]?.focus()
  }

  const verifier = async () => {
    const saisi = cases.join('')
    if (saisi.length < LONGUEUR_CODE) return setErreur(t('erreurs.incomplet'))
    if (saisi !== code) return setErreur(t('erreurs.invalide'))
    setEnvoi(true)
    try {
      toast.success(t('verifie'))
      await onVerifie()
    } finally {
      setEnvoi(false)
    }
  }

  const renvoyer = () => {
    setCode(nouveauCode())
    setCases(Array<string>(LONGUEUR_CODE).fill(''))
    setErreur('')
    setSecondes(DELAI_RENVOI)
    toast(t('renvoye', { telephone: masquerNumero(telephone) }))
    champs.current[0]?.focus()
  }

  return (
    <div className="space-y-4">
      <p className="flex items-start gap-2 text-[14.5px] text-navy-900">
        <MessageSquareCode className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
        {t('envoye', { telephone: masquerNumero(telephone) })}
      </p>
      <p role="status" className="flex items-center gap-2 rounded-xl border border-dashed border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm text-navy-900">
        <ShieldCheck className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
        <span>
          {t('sms')} <b className="tracking-[0.25em]">{code}</b>
        </span>
      </p>
      <fieldset>
        <legend className="mb-1.5 text-sm font-bold text-navy-900">{t('champ')}</legend>
        <div className="flex gap-2">
          {cases.map((c, i) => (
            <input
              key={i}
              ref={(el) => {
                champs.current[i] = el
              }}
              value={c}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={t('chiffre', { n: i + 1 })}
              maxLength={i === 0 ? LONGUEUR_CODE : 1}
              onChange={(e) => ecrire(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !c && i > 0) champs.current[i - 1]?.focus()
                if (e.key === 'Enter') void verifier()
              }}
              className="h-12 w-11 rounded-xl border border-[#c9d4ea] bg-white text-center text-xl font-bold text-navy-900 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100 sm:w-12"
            />
          ))}
        </div>
        {erreur && <p className="mt-1.5 text-xs font-medium text-rose-600">{erreur}</p>}
      </fieldset>
      <Button className="w-full" disabled={envoi} onClick={() => void verifier()}>
        {libelleBouton ?? t('verifier')}
      </Button>
      <p className="text-center text-sm text-muted">
        {t('pasRecu')}{' '}
        {secondes > 0 ? (
          <span>{t('renvoyerDans', { secondes })}</span>
        ) : (
          <button type="button" onClick={renvoyer} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t('renvoyer')}
          </button>
        )}
      </p>
    </div>
  )
}
