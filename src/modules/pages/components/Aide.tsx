import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Car, GraduationCap, Heart, LayoutDashboard, Search, Star, UserRound, type LucideIcon } from 'lucide-react'
import { data } from '@/data'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { QUESTIONS_AIDE, SUJETS_CONTACT, THEMES_AIDE, type ThemeAide } from '@/modules/pages/pagesContenu'
import { Champ, Encadre, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/shadcn/accordion'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Textarea } from '@/shared/shadcn/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { cn } from '@/shared/utils/cn'

const ICONES: Record<ThemeAide, LucideIcon> = { compte: UserRound, ecoles: GraduationCap, auto: Car, avis: Star, favoris: Heart, pro: LayoutDashboard }

/** Une carte de la page (blanche, bordée ; sur téléphone, sur toute la largeur). */
export function CartePage({ children, className, ...props }: { children: ReactNode; className?: string; 'aria-labelledby'?: string }) {
  return (
    <section className={cn('flex flex-col gap-3 border-y border-border bg-card p-5 sm:rounded-lg sm:border', className)} {...props}>
      {children}
    </section>
  )
}

/** Le bandeau bleu de l'aide : titre et recherche dans les questions. */
export function BandeauAide({ recherche, onRecherche }: { recherche: string; onRecherche: (q: string) => void }) {
  const { t } = useTranslation('pages', { keyPrefix: 'aide' })
  return (
    <section className="bg-linear-[120deg] from-foreground to-primary-hover text-white">
      <div className="mx-auto flex max-w-page flex-col items-center gap-[18px] px-4 py-8 text-center sm:py-14">
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] sm:text-4xl">{t('titre')}</h1>
        <label className="flex h-[50px] w-full max-w-[620px] items-center gap-2.5 rounded-full bg-card px-4 text-muted-foreground shadow-search focus-within:outline-2 focus-within:outline-white">
          <Search className="size-5 shrink-0" strokeWidth={2.2} aria-hidden />
          <Input
            type="search"
            value={recherche}
            onChange={(e) => onRecherche(e.target.value)}
            aria-label={t('rechercheAria')}
            placeholder={t('recherchePlaceholder')}
            className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 focus-visible:outline-none"
          />
        </label>
      </div>
    </section>
  )
}

/** Les thèmes : une carte par thème (icône, nom, nombre de questions) ; un clic filtre les questions, un second l'annule. */
export function ThemesAide({ theme, onTheme }: { theme: ThemeAide | ''; onTheme: (t: ThemeAide | '') => void }) {
  const { t } = useTranslation('pages', { keyPrefix: 'aide.themes' })
  return (
    <section className="flex flex-col gap-3 px-3 sm:px-0" aria-labelledby="aide-themes">
      <h2 id="aide-themes" className="text-xl font-bold text-foreground">
        {t('titre')}
      </h2>
      <ToggleGroup type="single" value={theme} onValueChange={(v) => onTheme(v as ThemeAide | '')} className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-3">
        {THEMES_AIDE.map((k) => {
          const Icone = ICONES[k]
          return (
            <ToggleGroupItem
              key={k}
              value={k}
              className="h-auto flex-col items-start justify-start gap-2 rounded-lg border border-border bg-card p-4 text-left whitespace-normal text-foreground hover:border-primary hover:bg-card data-[state=on]:border-primary data-[state=on]:bg-primary-wash data-[state=on]:text-foreground data-[state=on]:ring-1 data-[state=on]:ring-primary data-[state=on]:ring-inset"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icone className="size-5" aria-hidden />
              </span>
              <b className="text-ui">{t(k)}</b>
              <span className="text-meta font-normal text-muted-foreground">{t('nb', { count: QUESTIONS_AIDE.filter((q) => q.theme === k).length })}</span>
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </section>
  )
}

/** Les questions fréquentes, filtrées par thème et par la recherche (dans la langue affichée). */
export function QuestionsAide({ theme, recherche, onToutes }: { theme: ThemeAide | ''; recherche: string; onToutes: () => void }) {
  const { t } = useTranslation('pages', { keyPrefix: 'aide' })
  const rq = recherche.trim().toLowerCase()
  const questions = QUESTIONS_AIDE.filter((q) => (!theme || q.theme === theme) && (!rq || `${t(`faq.${q.id}.q`)} ${t(`faq.${q.id}.r`)}`.toLowerCase().includes(rq)))
  return (
    <CartePage aria-labelledby="aide-faq">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="aide-faq" className="text-xl font-bold text-foreground">
          {theme ? t(`themes.${theme}`) : t('faqTitre')}
        </h2>
        {theme && (
          <Button variant="link" onClick={onToutes}>
            {t('toutes')}
          </Button>
        )}
      </div>
      <Accordion type="multiple" defaultValue={[QUESTIONS_AIDE[0].id]}>
        {questions.map((q) => (
          <AccordionItem key={q.id} value={q.id}>
            <AccordionTrigger>{t(`faq.${q.id}.q`)}</AccordionTrigger>
            <AccordionContent className="text-ui leading-[1.7]">{t(`faq.${q.id}.r`)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {questions.length === 0 && <p className="border-t border-border py-4 text-sm text-muted-foreground">{t('aucune', { recherche: recherche.trim() })}</p>}
    </CartePage>
  )
}

/** « Vous ne trouvez pas votre réponse ? » : la demande est enregistrée pour l'assistance YIBOLO (table `demandesAssistance`). */
export function ContactAide() {
  const { t } = useTranslation('pages', { keyPrefix: 'aide.contact' })
  const { account } = useSession()
  const [envoye, setEnvoye] = useState(false)
  const schema = z.object({
    nom: z.string().trim().min(1, t('erreurs.nom')),
    contact: z.string().trim().min(1, t('erreurs.contact')),
    sujet: z.enum(SUJETS_CONTACT),
    message: z.string().trim().min(10, t('erreurs.message')),
  })
  const { register, handleSubmit, formState, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nom: account?.name ?? '', contact: account?.identifiant ?? '', sujet: 'compte' as const, message: '' },
  })
  const e = formState.errors
  const envoyer = handleSubmit(async (v) => {
    try {
      await data.create(
        'demandesAssistance',
        { compteId: account?.id ?? '', nom: v.nom, contact: v.contact, sujet: t(`sujets.${v.sujet}`, { lng: 'fr' }), message: v.message, envoyeeLe: new Date().toISOString(), statut: 'Envoyée' },
        'demande',
      )
      setEnvoye(true)
    } catch {
      toast.error(t('erreurs.envoi'))
    }
  })
  return (
    <CartePage aria-labelledby="aide-contact">
      <h2 id="aide-contact" className="text-xl font-bold text-foreground">
        {t('titre')}
      </h2>
      <p className="text-ui text-muted-foreground">{t('texte')}</p>
      {envoye ? (
        <Encadre ton="succes" className="rounded-md text-ui">
          <b>{t('merci')}</b> {t('envoye')}
        </Encadre>
      ) : (
        <form noValidate onSubmit={(ev) => void envoyer(ev)} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ id="aide-nom" label={t('nom')} erreur={e.nom?.message}>
              <Input id="aide-nom" placeholder={t('nomExemple')} aria-invalid={!!e.nom || undefined} {...register('nom')} />
            </Champ>
            <Champ id="aide-contact-champ" label={t('contact')} erreur={e.contact?.message}>
              <Input id="aide-contact-champ" placeholder={t('contactExemple')} aria-invalid={!!e.contact || undefined} {...register('contact')} />
            </Champ>
          </div>
          <Champ id="aide-sujet" label={t('sujet')}>
            <ListeDeroulante id="aide-sujet" valeur={watch('sujet')} onChange={(v) => setValue('sujet', v as (typeof SUJETS_CONTACT)[number])} options={SUJETS_CONTACT.map((s) => ({ value: s, label: t(`sujets.${s}`) }))} />
          </Champ>
          <Champ id="aide-message" label={t('message')} erreur={e.message?.message}>
            <Textarea id="aide-message" placeholder={t('messageExemple')} className="h-[120px]" aria-invalid={!!e.message || undefined} {...register('message')} />
          </Champ>
          <Button type="submit" loading={formState.isSubmitting} className="self-start">
            {t('envoyer')}
          </Button>
        </form>
      )}
    </CartePage>
  )
}
