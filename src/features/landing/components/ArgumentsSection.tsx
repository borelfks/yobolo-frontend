import { ShieldCheck, Star, Users, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type CleArgument = 'fiable' | 'accessible' | 'rapide' | 'pourTous'

const ARGUMENTS: { cle: CleArgument; icone: LucideIcon }[] = [
  { cle: 'fiable', icone: ShieldCheck },
  { cle: 'accessible', icone: Users },
  { cle: 'rapide', icone: Zap },
  { cle: 'pourTous', icone: Star },
]

/** Les quatre arguments sous les cartes (copiés de yibolo-client), séparés d'un trait fin — 2 × 2 sur téléphone. */
export function ArgumentsSection() {
  const { t } = useTranslation('landing')

  return (
    <section aria-labelledby="titre-arguments" className="px-6 sm:px-10 lg:px-14">
      <h2 id="titre-arguments" className="sr-only">
        {t('arguments.titre')}
      </h2>
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-border">
        {ARGUMENTS.map(({ cle, icone: Icone }, rang) => (
          <li key={cle} className={rang % 2 === 1 ? 'flex justify-center border-l border-border lg:border-l-0' : 'flex justify-center'}>
            <div className="flex flex-col items-center gap-2 px-2 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
              <Icone className="size-6 shrink-0 text-primary sm:mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground">{t(`arguments.${cle}.titre`)}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{t(`arguments.${cle}.texte`)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
