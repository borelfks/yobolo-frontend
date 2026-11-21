import { clsx } from 'clsx'
import { ArrowRight, BookOpen, BriefcaseBusiness, GraduationCap, MessagesSquare, MonitorPlay } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Apparition } from '@/features/landing/components/Apparition'
import { Vague } from '@/shared/components/ui/Vague'
import { ROUTES } from '@/shared/utils/routes'

type CleService = 'consultation' | 'ecoles' | 'emplois' | 'formation' | 'bibliotheque'

interface Service {
  cle: CleService
  icone: LucideIcon
  photo: string
  /** Où tombe le sujet de la photo une fois recadrée dans la bande. */
  cadrage: string
  vers: string
  /** La teinte pâle du fond et de la vague, la franche de l'icône et de la flèche. */
  teinte: { fond: string; vague: string; franche: string; texte: string }
}

/**
 * Les cinq services de l'accueil (copiés de yibolo-client). Photos Unsplash,
 * licence libre : un rendez-vous, une étudiante, un candidat, un cours en
 * ligne, une lectrice.
 */
const SERVICES: Service[] = [
  {
    cle: 'consultation',
    icone: MessagesSquare,
    photo: '/images/accueil/consultation.jpg',
    cadrage: 'object-[center_40%]',
    vers: ROUTES.consultation,
    teinte: { fond: 'bg-teinte-bleu', vague: 'text-teinte-bleu', franche: 'bg-primary', texte: 'text-primary' },
  },
  {
    cle: 'ecoles',
    icone: GraduationCap,
    photo: '/images/accueil/ecoles.jpg',
    cadrage: 'object-[center_22%]',
    vers: ROUTES.schools,
    teinte: { fond: 'bg-teinte-orange', vague: 'text-teinte-orange', franche: 'bg-orange', texte: 'text-orange' },
  },
  {
    cle: 'emplois',
    icone: BriefcaseBusiness,
    photo: '/images/accueil/emplois.jpg',
    cadrage: 'object-[center_25%]',
    vers: ROUTES.emploi,
    teinte: { fond: 'bg-teinte-emeraude', vague: 'text-teinte-emeraude', franche: 'bg-emeraude', texte: 'text-emeraude' },
  },
  {
    cle: 'formation',
    icone: MonitorPlay,
    photo: '/images/accueil/formation.jpg',
    cadrage: 'object-[center_30%]',
    vers: ROUTES.courses,
    teinte: { fond: 'bg-teinte-violet', vague: 'text-teinte-violet', franche: 'bg-violet', texte: 'text-violet' },
  },
  {
    cle: 'bibliotheque',
    icone: BookOpen,
    photo: '/images/accueil/bibliotheque.jpg',
    cadrage: 'object-[center_45%]',
    vers: ROUTES.library,
    teinte: { fond: 'bg-teinte-rose', vague: 'text-teinte-rose', franche: 'bg-rose', texte: 'text-rose' },
  },
]

/**
 * Où se pose chaque carte : trois en haut et deux en bas sur grand écran, deux
 * colonnes sur tablette — la dernière prend alors la ligne entière —, une
 * seule colonne sur téléphone.
 */
function placement(rang: number) {
  if (rang < 3) return 'lg:col-span-2'
  return rang === SERVICES.length - 1 ? 'md:col-span-2 lg:col-span-3' : 'lg:col-span-3'
}

/** Les cinq portes de l'accueil. */
export function ServicesSection() {
  const { t } = useTranslation('landing')

  return (
    <section aria-labelledby="titre-services" className="px-6 sm:px-10 lg:px-14">
      <h2 id="titre-services" className="sr-only">
        {t('services.titre')}
      </h2>
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-6">
        {SERVICES.map((service, rang) => (
          <Apparition key={service.cle} className={clsx('h-full', placement(rang))} delai={(rang % 3) * 90}>
            <CarteService service={service} />
          </Apparition>
        ))}
      </div>
    </section>
  )
}

/**
 * Une carte : la photo, la vague qui remonte la teinte, l'icône à cheval, puis
 * le titre, l'accroche et le texte. Cliquable en entier par le lien du titre.
 */
function CarteService({ service }: { service: Service }) {
  const { t } = useTranslation('landing')
  const { cle, icone: Icone, photo, cadrage, vers, teinte } = service

  return (
    <article className={clsx('group relative flex h-full flex-col overflow-hidden rounded-[1.5rem]', teinte.fond)}>
      <div className="relative h-44 sm:h-52">
        <img
          src={photo}
          alt=""
          aria-hidden="true"
          className={clsx('size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]', cadrage)}
        />
        <Vague className={clsx('absolute inset-x-0 -bottom-px h-10 sm:h-12', teinte.vague)} />
      </div>

      <span
        aria-hidden="true"
        className={clsx('relative -mt-10 ml-5 grid size-16 place-items-center rounded-full text-white ring-4 ring-white/70 sm:ml-6', teinte.franche)}
      >
        <Icone className="size-7" />
      </span>

      <div className="flex flex-1 items-end gap-4 px-5 pt-3 pb-5 sm:px-6 sm:pb-6">
        <div className="min-w-0 flex-1 self-start">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            <Link
              to={vers}
              className="rounded-[1.5rem] outline-none after:absolute after:inset-0 after:rounded-[1.5rem] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {t(`services.${cle}.titre`)}
            </Link>
          </h3>
          <p className="mt-1 font-medium text-foreground">{t(`services.${cle}.accroche`)}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{t(`services.${cle}.texte`)}</p>
        </div>

        <span
          aria-hidden="true"
          className={clsx(
            'grid size-11 shrink-0 place-items-center rounded-full bg-card shadow-[0_1px_2px_0_rgb(24_24_27/0.05),0_1px_3px_0_rgb(24_24_27/0.04)] transition-transform motion-safe:group-hover:translate-x-0.5',
            teinte.texte,
          )}
        >
          <ArrowRight className="size-5" />
        </span>
      </div>
    </article>
  )
}
