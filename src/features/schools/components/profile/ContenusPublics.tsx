import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CalendarDays, ChevronDown, Download, FileText } from 'lucide-react'
import { Img } from '@/shared/components/ui/Img'
import { useActualites, useDocuments, useFaq, useFichiers } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { telecharger } from '@/shared/utils/fichiers'
import { ajusterIndicateurs } from '@/shared/utils/compteurs'

/**
 * Ce que l'établissement publie depuis son espace pro (Contenus et
 * informations), montré sur sa fiche publique : actualités publiées,
 * documents publiés (téléchargeables), questions fréquentes.
 */
export function ContenusPublics({ sec, id }: { sec: 'actualites' | 'documents' | 'faq'; id: string }) {
  const { t } = useTranslation('schools')
  const actualites = useActualites(id).filter((a) => a.statut === 'Publiée')
  const documents = useDocuments(id).filter((d) => d.statut === 'Publié')
  const faq = useFaq(id)
  const fichiers = useFichiers()
  const [ouverte, setOuverte] = useState<string | null>(null)
  const vide = (texte: string) => <p className="rounded-xl bg-[#f3f6fc] px-4 py-3 text-[14.5px] text-muted">{texte}</p>

  return (
    <div className="space-y-3">
      <h2 className="text-[21px] font-bold text-navy-900">{t(`ecoleProfil.informations.sections.${sec}`)}</h2>

      {sec === 'actualites' &&
        (actualites.length === 0
          ? vide(t('ecoleProfil.informations.contenus.noNews'))
          : actualites.map((a) => (
              <article key={a.id} className="flex gap-3 rounded-xl border border-line p-2.5">
                <Img src={a.image} alt="" className="h-16 w-24 shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <p className="font-bold text-navy-900">{a.titre}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[13px] text-muted">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="size-4" />{a.date}</span>
                    <span>{a.categorie}</span>
                  </p>
                </div>
              </article>
            )))}

      {sec === 'documents' &&
        (documents.length === 0
          ? vide(t('ecoleProfil.informations.contenus.noDocuments'))
          : documents.map((d) => {
              const f = fichiers.find((x) => x.id === d.fichierId)
              return (
                <div key={d.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                  <span className="grid h-10 w-9 shrink-0 place-items-center rounded-md bg-rose-600 text-[10px] font-extrabold text-white">{d.type}</span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <b className="block truncate text-[15px] text-navy-900">{d.nom}</b>
                    <span className="text-[13px] text-muted">{d.taille} · {d.date}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!f) return toast(t('ecoleProfil.informations.contenus.noFile'))
                      telecharger(f.dataUrl, f.nom)
                      void ajusterIndicateurs(id, { telechargements: 1, activite: 'downloads' })
                    }}
                    className="inline-flex h-9 items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[14px] font-semibold text-navy-800 hover:bg-brand-50"
                  >
                    <Download className="size-4" />
                    {t('ecoleProfil.informations.contenus.download')}
                  </button>
                </div>
              )
            }))}

      {sec === 'faq' &&
        (faq.length === 0
          ? vide(t('ecoleProfil.informations.contenus.noFaq'))
          : faq.map((q) => (
              <div key={q.id} className="rounded-xl border border-line">
                <button type="button" aria-expanded={ouverte === q.id} onClick={() => setOuverte(ouverte === q.id ? null : q.id)} className="flex w-full items-center gap-2 px-4 py-3 text-left text-[15px] font-bold text-navy-900">
                  <FileText className="size-4 shrink-0 text-brand-600" />
                  <span className="flex-1">{q.q}</span>
                  <ChevronDown className={cn('size-5 shrink-0 transition-transform', ouverte === q.id && 'rotate-180')} />
                </button>
                {ouverte === q.id && <p className="border-t border-line px-4 py-3 text-[14.5px] text-navy-900">{q.r}</p>}
              </div>
            )))}
    </div>
  )
}
