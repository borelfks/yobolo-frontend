import { useTranslation } from 'react-i18next'
import { ARTICLES_CONDITIONS } from '@/modules/pages/pagesContenu'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Conditions générales d'utilisation (planches « Conditions générales ») : le
 * sommaire (collé à gauche sur ordinateur, en tête sur téléphone) et les dix articles.
 */
export function Conditions() {
  const { t } = useTranslation('pages', { keyPrefix: 'conditions' })
  return (
    <div className="mx-auto flex max-w-page flex-col gap-2 pb-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:px-4 lg:pt-8 lg:pb-12">
      <nav aria-label={t('sommaire')} className="flex flex-col border-b border-border bg-card px-1 py-4 lg:sticky lg:top-[84px] lg:rounded-lg lg:border lg:px-0">
        <b className="px-3.5 pb-2 text-meta text-muted-foreground">{t('sommaire')}</b>
        {ARTICLES_CONDITIONS.map((a) => (
          <Lien key={a.id} to={`${ROUTES.terms}#cg-${a.n}`} className="block border-l-[3px] border-transparent px-3.5 py-2 text-sm font-semibold text-foreground-soft no-underline hover:text-primary">
            {a.n}. {t(`articles.${a.id}.titre`)}
          </Lien>
        ))}
      </nav>
      <article className="border-y border-border bg-card px-4 py-5 lg:rounded-lg lg:border lg:px-10 lg:py-8">
        <header className="flex flex-col gap-1.5 border-b border-border pb-4">
          <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-foreground lg:text-titre-lg">{t('titre')}</h1>
          <span className="text-meta text-muted-foreground">{t('miseAJour')}</span>
        </header>
        {ARTICLES_CONDITIONS.map((a) => (
          <section key={a.id} id={`cg-${a.n}`} className="flex scroll-mt-[84px] flex-col gap-2 pt-5">
            <h2 className="text-lg font-bold text-foreground">
              {a.n}. {t(`articles.${a.id}.titre`)}
            </h2>
            {a.paras.map((p) => (
              <p key={p} className="text-ui leading-[1.7] text-foreground-soft">
                {t(`articles.${a.id}.${p}`)}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}
