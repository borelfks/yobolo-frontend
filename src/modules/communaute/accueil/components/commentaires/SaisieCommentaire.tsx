import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LONGUEUR_MAX_COMMENTAIRE } from '@/modules/communaute/accueil/accueilFil'
import { PhotoRonde } from '@/modules/communaute/accueil/components/Carte'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'

/**
 * La saisie d'un commentaire (canevas) : la photo du compte, une pilule de
 * 44 px « Ajouter un commentaire… », et « Publier » dès qu'il y a du texte.
 * La même sert à répondre et à corriger (Échap annule alors).
 */
export function SaisieCommentaire({
  photo,
  nom,
  placeholder,
  libelleEnvoi,
  valeurInitiale = '',
  onEnvoyer,
  onAnnuler,
  focus = false,
  id,
}: {
  photo?: string
  nom: string
  placeholder: string
  libelleEnvoi: string
  valeurInitiale?: string
  onEnvoyer: (texte: string) => Promise<boolean>
  onAnnuler?: () => void
  focus?: boolean
  id?: string
}) {
  const { t } = useTranslation('accueil')
  const [texte, setTexte] = useState(valeurInitiale)
  const [enCours, setEnCours] = useState(false)
  const champ = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focus || !champ.current) return
    champ.current.focus()
    champ.current.setSelectionRange(champ.current.value.length, champ.current.value.length)
  }, [focus])

  const envoyer = async () => {
    if (!texte.trim() || enCours) return
    setEnCours(true)
    try {
      if (await onEnvoyer(texte.trim())) setTexte('')
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        void envoyer()
      }}
    >
      <PhotoRonde src={photo} nom={nom} className="size-10" />
      <Input
        ref={champ}
        id={id}
        value={texte}
        maxLength={LONGUEUR_MAX_COMMENTAIRE}
        onChange={(e) => setTexte(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onAnnuler?.()}
        aria-label={placeholder}
        placeholder={placeholder}
        className="h-11 flex-1 rounded-full px-4 text-sm font-normal"
      />
      {texte.trim() && (
        <Button type="submit" size="md" loading={enCours}>
          {libelleEnvoi}
        </Button>
      )}
      {onAnnuler && (
        <Button type="button" variant="link-muted" className="text-xs font-bold" onClick={onAnnuler}>
          {t('commentaires.annuler')}
        </Button>
      )}
    </form>
  )
}
