import { LoaderCircle, SendHorizontal } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LONGUEUR_MAX_COMMENTAIRE } from '@/modules/communaute/accueil/accueilFil'

/** En deçà, le compteur de caractères n'apprend rien et alourdit la ligne. */
const RESTE_AVANT_COMPTEUR = 100

/**
 * La pilule de saisie (ZoneDeSaisie de yibolo-client), la même pour commenter,
 * répondre et corriger. Elle grandit avec le texte ; Entrée envoie,
 * Maj+Entrée va à la ligne, Échap annule une réponse ou une correction.
 */
export function ZoneDeSaisie({
  placeholder,
  libelleEnvoi,
  valeurInitiale = '',
  onEnvoyer,
  onAnnuler,
  focusAuMontage = false,
}: {
  placeholder: string
  libelleEnvoi: string
  valeurInitiale?: string
  onEnvoyer: (texte: string) => Promise<boolean>
  onAnnuler?: () => void
  focusAuMontage?: boolean
}) {
  const { t } = useTranslation('accueil')
  const [texte, setTexte] = useState(valeurInitiale)
  const [enCours, setEnCours] = useState(false)
  const zone = useRef<HTMLTextAreaElement>(null)
  const vide = texte.trim().length === 0
  const reste = LONGUEUR_MAX_COMMENTAIRE - texte.length

  const ajusterLaHauteur = useCallback(() => {
    const element = zone.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }, [])

  useEffect(ajusterLaHauteur, [ajusterLaHauteur])

  useEffect(() => {
    const element = zone.current
    if (!focusAuMontage || !element) return
    element.focus()
    element.setSelectionRange(element.value.length, element.value.length)
  }, [focusAuMontage])

  const envoyer = async () => {
    if (vide || enCours) return
    setEnCours(true)
    try {
      if (await onEnvoyer(texte.trim())) {
        setTexte('')
        requestAnimationFrame(ajusterLaHauteur)
      }
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={(evenement) => {
        evenement.preventDefault()
        void envoyer()
      }}
    >
      <div className="flex items-end gap-1 rounded-xl border border-line bg-white py-1 pr-1 pl-3 transition-colors focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-brand-100">
        <div className="flex min-w-0 flex-1 py-1.5">
          <textarea
            ref={zone}
            rows={1}
            value={texte}
            placeholder={placeholder}
            maxLength={LONGUEUR_MAX_COMMENTAIRE}
            aria-label={placeholder}
            onChange={(evenement) => {
              setTexte(evenement.target.value)
              ajusterLaHauteur()
            }}
            onKeyDown={(evenement) => {
              if (evenement.key === 'Enter' && !evenement.shiftKey) {
                evenement.preventDefault()
                void envoyer()
              }
              if (evenement.key === 'Escape' && onAnnuler) onAnnuler()
            }}
            className="max-h-40 w-full resize-none bg-transparent text-sm text-ink placeholder:text-slate-400 focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={vide || enCours}
          aria-label={libelleEnvoi}
          title={libelleEnvoi}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:bg-transparent disabled:text-slate-400"
        >
          {enCours ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <SendHorizontal className="size-4" aria-hidden="true" />}
        </button>
      </div>
      {(reste <= RESTE_AVANT_COMPTEUR || onAnnuler) && (
        <span className="flex items-center gap-3 pl-3 text-xs text-muted-foreground">
          {reste <= RESTE_AVANT_COMPTEUR && <span className="tabular-nums">{t('commentaires.reste', { reste })}</span>}
          {onAnnuler && (
            <span>
              {t('commentaires.echapPour')}{' '}
              <button type="button" onClick={onAnnuler} className="rounded-sm font-medium text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none">
                {t('commentaires.annulerMinuscule')}
              </button>
            </span>
          )}
        </span>
      )}
    </form>
  )
}
