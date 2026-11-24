import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalePublication } from '@/features/accueil/components/ModalePublication'
import { useSession } from '@/features/auth/hooks/useSession'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/utils/routes'

/** La photo de la carte : celle de yibolo-client n'est pas dans ce projet, on reprend une photo de la maquette. */
const PHOTO_EXPERT = '/images/maquette/reco-consultant.jpg'

/**
 * La carte « Vous êtes expert ? » (CarteExpert de yibolo-client). Qui peut
 * publier ouvre la fenêtre de publication sur place (dans cette démo : tout
 * compte connecté) ; sinon « Devenir consultant » mène à l'univers
 * Consultation (« bientôt disponible »).
 */
export function CarteExpert() {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const [ouverte, setOuverte] = useState(false)
  const [photoEnEchec, setPhotoEnEchec] = useState(false)

  const classesBouton = 'mt-1 h-8 w-fit rounded-md px-4'

  return (
    <section aria-labelledby="titre-carte-expert" className="relative isolate overflow-hidden rounded-xl bg-gradient-to-r from-navy-900 to-navy-700">
      {!photoEnEchec && (
        <img
          src={PHOTO_EXPERT}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setPhotoEnEchec(true)}
          className="absolute right-0 bottom-0 -z-10 h-full w-[42%] object-cover object-[35%_top] [mask-image:linear-gradient(to_right,transparent,black_35%)]"
        />
      )}

      <div className="flex min-h-[8rem] max-w-[68%] flex-col justify-center gap-1.5 p-4">
        <h2 id="titre-carte-expert" className="text-base leading-tight font-bold text-white">
          {t('expert.titre')}
        </h2>
        <p className="text-xs leading-relaxed text-white/85">{t('expert.texte')}</p>
        {account ? (
          <Button size="sm" className={classesBouton} onClick={() => setOuverte(true)}>
            {t('expert.publier')}
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : (
          <Button to={ROUTES.consultation} size="sm" className={classesBouton}>
            {t('expert.devenir')}
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>

      {account && <ModalePublication ouverte={ouverte} onFermer={() => setOuverte(false)} />}
    </section>
  )
}
