import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBandeauxAccueil } from '@/data/hooks'
import { LogoMark } from '@/shared/components/ui/Logo'
import { Button } from '@/shared/components/ui/Button'
import { langueActive } from '@/i18n'
import type { BandeauAccueil as Bandeau } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** Où mène le bouton de chaque bandeau. */
const VERS: Record<Bandeau['cible'], string> = {
  ecoles: ROUTES.schools,
  offres: ROUTES.accueilGenre('offre'),
  conseils: ROUTES.accueilGenre('conseil'),
}

/**
 * Le bandeau en tête du fil (BandeauAccueil de yibolo-client), en carrousel :
 * les bandeaux viennent de la table `bandeauxAccueil` (textes en français et
 * en anglais), la flèche passe au suivant, les points mènent à chacun. Si une
 * photo manque, le dégradé et le symbole s'affichent — jamais une case vide.
 */
export function BandeauAccueil() {
  const { t, i18n } = useTranslation('accueil')
  const bandeaux = useBandeauxAccueil()
  const [rang, setRang] = useState(0)
  const [photosEnEchec, setPhotosEnEchec] = useState<string[]>([])

  if (bandeaux.length === 0) return null
  const actuel = bandeaux[rang % bandeaux.length]!
  const langue = langueActive(i18n.language)
  const photoEnEchec = photosEnEchec.includes(actuel.id)

  return (
    <section
      aria-roledescription={t('bandeau.carrousel')}
      aria-labelledby="titre-bandeau-accueil"
      className="relative isolate overflow-hidden rounded-xl bg-gradient-to-r from-navy-900 to-navy-700"
    >
      {photoEnEchec ? (
        <LogoMark className="absolute top-1/2 right-10 -z-10 hidden size-28 -translate-y-1/2 opacity-15 sm:block" />
      ) : (
        <img
          key={actuel.id}
          src={actuel.image}
          alt=""
          aria-hidden="true"
          loading="eager"
          onError={() => setPhotosEnEchec((liste) => [...liste, actuel.id])}
          className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover object-[80%_center] sm:w-[54%] sm:object-[85%_30%]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50 sm:via-navy-900/80 sm:via-44% sm:to-transparent sm:to-58%"
      />

      <div className="flex min-h-[9.5rem] items-center gap-4 px-5 py-5 sm:px-6">
        <div className="flex max-w-[21rem] flex-col items-start gap-2" aria-live="polite">
          <h2 id="titre-bandeau-accueil" className="text-xl leading-tight font-bold text-balance text-white sm:text-[1.375rem]">
            {actuel.titre[langue]}
          </h2>
          <p className="text-[0.8125rem] leading-relaxed text-white/85">{actuel.texte[langue]}</p>
          <Button to={VERS[actuel.cible]} size="sm" className="mt-1.5 h-8 rounded-md px-4">
            {actuel.action[langue]}
          </Button>
        </div>

        {bandeaux.length > 1 && (
          <button
            type="button"
            aria-label={t('bandeau.suivant')}
            title={t('bandeau.suivant')}
            onClick={() => setRang((rang + 1) % bandeaux.length)}
            className="ml-auto hidden size-[2.25rem] shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:flex"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {bandeaux.length > 1 && (
        <div className="absolute right-0 bottom-1 left-0 flex justify-center sm:right-auto sm:left-6 sm:justify-start">
          {bandeaux.map((bandeau, position) => (
            <button
              key={bandeau.id}
              type="button"
              aria-label={t('bandeau.aller', { rang: position + 1, total: bandeaux.length })}
              aria-current={position === rang % bandeaux.length ? 'true' : undefined}
              onClick={() => setRang(position)}
              className="group grid size-6 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span className={cn('block h-1.5 rounded-full transition-all motion-reduce:transition-none', position === rang % bandeaux.length ? 'w-4 bg-white' : 'w-1.5 bg-white/50 group-hover:bg-white/80')} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
