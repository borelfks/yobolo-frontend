import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Bold, Italic, Link2, List } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useActualites, useDocuments, useFaq, useParametres } from '@/data/hooks'
import { Champ } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Textarea } from '@/shared/shadcn/textarea'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { CartePro, Conseil } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { texte } from '@/modules/ecole/espace-pro/proData'

const MAX = 500
type Outil = 'gras' | 'italique' | 'liste' | 'lien'
const OUTILS: { id: Outil; icone: typeof Bold }[] = [
  { id: 'gras', icone: Bold },
  { id: 'italique', icone: Italic },
  { id: 'liste', icone: List },
  { id: 'lien', icone: Link2 },
]

/** Contenus › Présentation : le texte de présentation (brouillon ou publié), puis les résumés des actualités, documents et FAQ. */
export function Presentation() {
  const { t } = useTranslation('pro', { keyPrefix: 'contenus.presentation' })
  const { t: tp } = useTranslation('pro')
  const id = useId()
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  const actualites = useActualites(ecole.id)
  const documents = useDocuments(ecole.id)
  const faq = useFaq(ecole.id)
  const [titre, setTitre] = useState(() => texte(reglages, 'presentation.titre', t(/^[aeiouyéèh]/i.test(ecole.sigle || ecole.nom) ? 'titreDefautVoyelle' : 'titreDefaut', { sigle: ecole.sigle || ecole.nom })))
  const [contenu, setContenu] = useState(() => texte(reglages, 'presentation.texte', ecole.description))
  const zone = useRef<HTMLTextAreaElement>(null)

  // La barre de mise en forme entoure la sélection (**gras**, _italique_), commence une liste (« • ») ou un lien.
  const mettreEnForme = (outil: Outil) => {
    const el = zone.current
    if (!el) return
    const { selectionStart: a, selectionEnd: b } = el
    const choisi = contenu.slice(a, b)
    const insere = outil === 'gras' ? `**${choisi}**` : outil === 'italique' ? `_${choisi}_` : outil === 'liste' ? `\n• ${choisi}` : `[${choisi || t('lienTexte')}](https://)`
    setContenu((contenu.slice(0, a) + insere + contenu.slice(b)).slice(0, MAX))
    requestAnimationFrame(() => el.focus())
  }
  const enregistrer = async (statut: 'Publiée' | 'Brouillon') => {
    if (!titre.trim() || !contenu.trim()) return void toast.error(t('requis'))
    await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, 'presentation.titre': titre.trim(), 'presentation.texte': contenu, 'presentation.statut': statut } })
    toast.success(t(statut === 'Publiée' ? 'publiee' : 'brouillon'))
  }
  const publiees = actualites.filter((a) => a.statut === 'Publiée').slice(0, 2)
  const docsPublies = documents.filter((d) => d.statut === 'Publié').length
  const resume = 'flex min-w-0 flex-col gap-1.5 border-y border-border bg-card p-4 text-foreground no-underline hover:shadow-card-hover lg:rounded-lg lg:border'
  return (
    <>
      <CartePro titre={t('titre')} description={t('description')}>
        <Champ id={`${id}-titre`} label={t('titreLabel')}>
          <Input id={`${id}-titre`} value={titre} onChange={(e) => setTitre(e.target.value)} />
        </Champ>
        <Champ id={`${id}-texte`} label={t('contenuLabel')}>
          <div className="overflow-hidden rounded-sm border border-input focus-within:border-ring focus-within:outline-2 focus-within:outline-ring">
            <div role="toolbar" aria-label={t('miseEnForme')} className="flex gap-0.5 border-b border-border bg-muted p-1">
              {OUTILS.map(({ id: o, icone: Icone }) => (
                <Button key={o} type="button" variant="ghost" size="icon-sm" className="text-foreground" aria-label={t(`outils.${o}`)} onClick={() => mettreEnForme(o)}>
                  <Icone className="size-4" aria-hidden />
                </Button>
              ))}
            </div>
            <Textarea ref={zone} id={`${id}-texte`} rows={7} maxLength={MAX} value={contenu} onChange={(e) => setContenu(e.target.value)} className="rounded-none border-0 focus-visible:outline-0" />
          </div>
          <span className="text-right text-xs font-medium text-muted-foreground">{tp('profil.general.caracteres', { n: contenu.length, max: MAX })}</span>
        </Champ>
        <Conseil>{t('conseil')}</Conseil>
        <div className="flex flex-col-reverse gap-2 lg:flex-row lg:justify-end">
          <Button variant="outline" onClick={() => void enregistrer('Brouillon')}>
            {tp('commun.brouillon')}
          </Button>
          <Button onClick={() => void enregistrer('Publiée')}>{tp('commun.publier')}</Button>
        </div>
      </CartePro>
      <div className="grid gap-2 lg:grid-cols-3">
        <CartePro titre={t('actualites')} serree>
          {publiees.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('aucuneActualite')}</p>
          ) : (
            publiees.map((a) => (
              <Lien key={a.id} to={ROUTES.pro.publication(a.id)} className="group flex flex-col gap-0.5 border-t border-border py-2 text-foreground no-underline">
                <b className="text-sm group-hover:text-primary group-hover:underline">{a.titre}</b>
                <span className="text-xs font-medium text-muted-foreground">{t('publieeLe', { date: a.date })}</span>
              </Lien>
            ))
          )}
          <Lien to={`${ROUTES.pro.contents('actualites')}?nouvelle=1`} className="text-sm font-bold text-primary no-underline hover:underline">
            {t('nouvelleActualite')}
          </Lien>
        </CartePro>
        {[
          { to: ROUTES.pro.contents('documents'), titre: t('documents'), n: docsPublies, detail: t('documentsDetail', { count: documents.length - docsPublies }), lien: t('gererDocuments') },
          { to: ROUTES.pro.contents('faq'), titre: t('faq'), n: faq.length, detail: t('faqDetail'), lien: t('gererFaq') },
        ].map((r) => (
          <Lien key={r.to} to={r.to} className={cn(resume, 'group')}>
            <h2 className="text-base font-extrabold">{r.titre}</h2>
            <b className="text-titre-lg leading-tight font-extrabold">{num(r.n)}</b>
            <span className="text-xs font-medium text-muted-foreground">{r.detail}</span>
            <span className="mt-auto text-sm font-bold text-primary group-hover:underline">{r.lien}</span>
          </Lien>
        ))}
      </div>
    </>
  )
}
