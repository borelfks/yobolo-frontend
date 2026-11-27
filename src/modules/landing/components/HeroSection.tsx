import { useTranslation } from 'react-i18next'
import { RechercheAccueil } from '@/modules/landing/components/RechercheAccueil'
import { TraitCourbe, Vague } from '@/shared/ui/Vague'

/** Une professionnelle souriante à son bureau, placée à droite pour laisser le texte à gauche (Unsplash, licence libre). */
const PHOTO = '/images/accueil/hero.jpg'

/**
 * Le héro (copié de yibolo-client) : la grande photo voilée, le salut, le titre
 * dont le mot fort passe en orange, l'accroche et le slogan ; le bas de la
 * photo ondule et la recherche vient chevaucher la vague.
 */
export function HeroSection() {
  const { t } = useTranslation('landing')

  return (
    <section>
      <div className="relative overflow-hidden">
        <img src={PHOTO} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-[62%_18%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
        {/* Le voile du haut garde l'en-tête flottant lisible sur la photo. */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative flex min-h-[36rem] flex-col justify-center px-9 pt-28 pb-28 sm:min-h-[38rem] sm:px-13 lg:min-h-[44rem] lg:px-17">
          <div className="max-w-xl">
            <p className="text-lg font-medium text-white/90 sm:text-xl">{t('hero.bienvenue')}</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-white italic sm:text-6xl">
              <span className="block">{t('hero.ligneUne')}</span>
              <span className="relative inline-block pb-3">
                {t('hero.ligneDeux')} <span className="text-orange">{t('hero.motFort')}</span>
                <TraitCourbe className="absolute inset-x-[12%] bottom-0 h-3 text-orange" />
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">{t('hero.accroche')}</p>
          </div>

          <p className="mt-8 max-w-56 text-xl leading-snug font-medium text-white italic lg:absolute lg:right-17 lg:bottom-40 lg:mt-0 lg:max-w-64 lg:-rotate-3 lg:text-2xl">
            {t('hero.slogan')}
            <TraitCourbe className="mt-1 h-2.5 w-4/5 text-orange" />
          </p>
        </div>

        <Vague className="absolute inset-x-0 -bottom-px h-12 text-background sm:h-16" />
      </div>

      <div className="relative z-10 -mt-12 px-3 sm:-mt-14 sm:px-13 lg:px-17">
        <RechercheAccueil />
      </div>
    </section>
  )
}
