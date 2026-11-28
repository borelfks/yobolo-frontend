import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Encadre } from '@/shared/blocs/Formulaire'
import { DELAI_RENVOI, LONGUEUR_CODE, masquerNumero, nouveauCode } from '@/modules/compte/auth/authOtp'

/**
 * Saisie du code reçu sur le téléphone (canevas « Code ») : six cases, le SMS
 * reçu (affiché à l'écran faute de serveur d'envoi), « Vérifier », puis
 * « Renvoyer le code » après 60 s. `onVerifie` est appelé quand le bon code est saisi.
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
      chiffres
        .split('')
        .slice(0, LONGUEUR_CODE - rang)
        .forEach((ch, i) => (suite[rang + i] = ch))
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
    <div className="flex flex-col gap-4">
      <p className="text-ui text-foreground">
        <Trans t={t} i18nKey="envoye" values={{ telephone: telephone.replace(/ /g, ' ') }} components={{ b: <b /> }} />
      </p>
      <div className="flex flex-col gap-1.5">
        <div role="group" aria-label={t('champ')} className="flex justify-between gap-2">
          {cases.map((c, i) => (
            <Input
              key={i}
              ref={(el) => {
                champs.current[i] = el
              }}
              value={c}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={t('chiffre', { n: i + 1 })}
              aria-invalid={!!erreur || undefined}
              maxLength={i === 0 ? LONGUEUR_CODE : 1}
              onChange={(e) => ecrire(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !c && i > 0) champs.current[i - 1]?.focus()
                if (e.key === 'Enter') void verifier()
              }}
              className="h-[54px] w-[46px] min-w-0 shrink px-0 text-center text-[22px] font-extrabold"
            />
          ))}
        </div>
        {erreur && <p className="text-xs font-semibold text-destructive">{erreur}</p>}
      </div>
      <Encadre ton="info" icone={MessageCircle} className="items-center py-3.5">
        {t('sms')} <b className="tracking-[0.1em]">{code}</b>
      </Encadre>
      <Button size="lg" className="h-[52px] w-full text-base" loading={envoi} onClick={() => void verifier()}>
        {libelleBouton ?? t('verifier')}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t('pasRecu')}{' '}
        {secondes > 0 ? (
          <b className="text-foreground">{t('renvoyerDans', { secondes })}</b>
        ) : (
          <Button type="button" variant="link" onClick={renvoyer}>
            {t('renvoyer')}
          </Button>
        )}
      </p>
    </div>
  )
}
