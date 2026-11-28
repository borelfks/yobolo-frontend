import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ChevronDown, CircleHelp, Search } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useFaq } from '@/data/hooks'
import { Champ, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/shared/shadcn/dialog'
import { Input } from '@/shared/shadcn/input'
import { Textarea } from '@/shared/shadcn/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { cn } from '@/shared/utils/cn'
import type { QuestionFaq } from '@/shared/types'
import { CartePro } from '@/modules/ecole/espace-pro/components/BlocsPro'

/** Catégories de la FAQ : valeur enregistrée (en français) → clé de traduction. */
const CATEGORIES = { Admission: 'admission', Formation: 'formation', Diplômes: 'diplomes' } as const
type Categorie = keyof typeof CATEGORIES
const NOMS = Object.keys(CATEGORIES) as Categorie[]
const estCategorie = (c: string): c is Categorie => c in CATEGORIES

/** Contenus › FAQ : les catégories à gauche (puces sur téléphone), les questions dépliables, ajouter, modifier, supprimer. */
export function Faq() {
  const { t } = useTranslation('pro', { keyPrefix: 'contenus.faq' })
  const { t: tp } = useTranslation('pro')
  const id = useId()
  const { ecole } = useMonEcole()
  const faq = useFaq(ecole.id)
  const [cat, setCat] = useState<'toutes' | Categorie>('toutes')
  const [q, setQ] = useState('')
  const [ouverte, setOuverte] = useState<string | null>(faq[0]?.id ?? null)
  const [fenetre, setFenetre] = useState(false)
  const [edition, setEdition] = useState<QuestionFaq | null>(null)
  const [question, setQuestion] = useState('')
  const [reponse, setReponse] = useState('')
  const [categorie, setCategorie] = useState<Categorie>('Admission')
  const [erreurs, setErreurs] = useState<{ question?: string; reponse?: string }>({})

  const libelle = (c: string) => (estCategorie(c) ? t(`categories.${CATEGORIES[c]}`) : c)
  const recherche = q.trim().toLowerCase()
  const liste = faq.filter((f) => (cat === 'toutes' || f.categorie === cat) && (!recherche || `${f.q} ${f.r}`.toLowerCase().includes(recherche)))
  const categories = [{ id: 'toutes' as const, nom: t('categories.toutes'), n: faq.length }, ...NOMS.map((c) => ({ id: c, nom: libelle(c), n: faq.filter((f) => f.categorie === c).length }))]

  const ouvrir = (f: QuestionFaq | null) => {
    setEdition(f)
    setQuestion(f?.q ?? '')
    setReponse(f?.r ?? '')
    setCategorie(f && estCategorie(f.categorie) ? f.categorie : 'Admission')
    setErreurs({})
    setFenetre(true)
  }
  const enregistrer = async () => {
    const e = { question: question.trim() ? undefined : t('form.questionRequise'), reponse: reponse.trim() ? undefined : t('form.reponseRequise') }
    setErreurs(e)
    if (e.question || e.reponse) return
    const champs = { q: question.trim(), r: reponse.trim(), categorie }
    if (edition) await data.update('faq', edition.id, champs)
    else await data.create('faq', { ...champs, etablissementId: ecole.id }, 'faq')
    toast.success(t(edition ? 'modifiee' : 'ajoutee'))
    setFenetre(false)
  }
  const supprimer = async (f: QuestionFaq) => {
    await data.remove('faq', f.id)
    toast.success(t('supprimee'))
  }

  return (
    <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-4">
      <CartePro titre={t('categoriesTitre')} serree>
        {/* Ordinateur : une liste ; téléphone : des puces. */}
        <nav aria-label={t('categoriesTitre')} className="-mx-4 hidden flex-col lg:flex">
          {categories.map((c) => (
            <Button
              key={c.id}
              variant="ghost"
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
              className={cn('h-auto min-h-[42px] justify-start gap-2.5 rounded-none border-0 border-l-[3px] px-4 py-2 text-sm font-semibold focus-visible:-outline-offset-2', cat === c.id ? 'border-primary bg-primary-soft text-primary-strong hover:bg-primary-soft hover:text-primary-strong' : 'border-transparent text-foreground-soft hover:bg-background')}
            >
              {c.nom}
              <b className="ml-auto">{c.n}</b>
            </Button>
          ))}
        </nav>
        <ToggleGroup type="single" variant="outline" size="lg" value={cat} onValueChange={(v) => v && setCat(v === 'toutes' || estCategorie(v) ? v : 'toutes')} aria-label={t('categoriesTitre')} className="flex-wrap lg:hidden">
          {categories.map((c) => (
            <ToggleGroupItem key={c.id} value={c.id}>
              {c.nom} <b>{c.n}</b>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CartePro>
      <CartePro
        titre={t('nombre', { count: liste.length })}
        action={
          <Button size="md" onClick={() => ouvrir(null)}>
            {t('ajouter')}
          </Button>
        }
      >
        <label className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('recherche')} aria-label={t('rechercheAria')} className="pl-10" />
        </label>
        {liste.length === 0 ? (
          <div className="flex flex-col items-center gap-2 border-t border-border py-8 text-center">
            <CircleHelp className="size-6 text-muted-foreground" aria-hidden />
            <b className="text-base text-foreground">{faq.length === 0 ? t('vide') : t('aucune')}</b>
          </div>
        ) : (
          <ul>
            {liste.map((f) => {
              const o = ouverte === f.id
              return (
                <li key={f.id} className="border-t border-border">
                  <Button variant="ghost" aria-expanded={o} onClick={() => setOuverte(o ? null : f.id)} className="h-auto w-full justify-start gap-2.5 rounded-none px-0 py-3.5 text-left font-normal whitespace-normal text-foreground hover:bg-transparent hover:text-primary">
                    <span className="flex flex-1 flex-col gap-1">
                      <b className="text-ui">{f.q}</b>
                      <span className="flex gap-1.5">
                        <Badge variant="gray">{libelle(f.categorie)}</Badge>
                      </span>
                    </span>
                    <ChevronDown className={cn('size-[18px] shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none', o && 'rotate-180')} aria-hidden />
                  </Button>
                  {o && (
                    <div className="flex flex-col gap-2.5 pb-3.5">
                      <p className="text-sm leading-relaxed text-foreground-soft">{f.r}</p>
                      <span className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => ouvrir(f)}>
                          {tp('commun.modifier')}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => void supprimer(f)}>
                          {tp('commun.supprimer')}
                        </Button>
                      </span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CartePro>
      <Dialog open={fenetre} onOpenChange={setFenetre}>
        <DialogContent className="gap-3.5 p-5 sm:max-w-[560px]">
          <DialogTitle className="text-xl font-extrabold">{edition ? t('form.titreModifier') : t('form.titreAjouter')}</DialogTitle>
          <Champ id={`${id}-q`} label={t('form.question')} requis erreur={erreurs.question}>
            <Input id={`${id}-q`} value={question} onChange={(e) => setQuestion(e.target.value)} aria-invalid={!!erreurs.question || undefined} />
          </Champ>
          <Champ id={`${id}-cat`} label={t('form.categorie')} requis>
            <ListeDeroulante id={`${id}-cat`} valeur={categorie} onChange={(v) => setCategorie(estCategorie(v) ? v : 'Admission')} options={NOMS.map((c) => ({ value: c, label: libelle(c) }))} />
          </Champ>
          <Champ id={`${id}-r`} label={t('form.reponse')} requis erreur={erreurs.reponse}>
            <Textarea id={`${id}-r`} rows={4} value={reponse} onChange={(e) => setReponse(e.target.value)} aria-invalid={!!erreurs.reponse || undefined} />
          </Champ>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setFenetre(false)}>
              {tp('commun.annuler')}
            </Button>
            <Button onClick={() => void enregistrer()}>{tp('commun.publier')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
