import { useTranslation } from 'react-i18next'
import { Building2, Download, MessagesSquare, UserRound } from 'lucide-react'
import { useFichiers } from '@/data/hooks'
import { BadgeDossier } from '@/shared/components/ui/BadgeDossier'
import { Button } from '@/shared/components/ui/Button'
import { Section } from '@/shared/components/ui/Card'
import { cn } from '@/shared/utils/cn'
import { shortDate } from '@/shared/utils/format'
import { telecharger } from '@/shared/utils/fichiers'
import type { EchangeDossier } from '@/shared/types'

const DATE = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const

/**
 * Le suivi d'un dossier : les décisions et demandes de l'établissement, les
 * compléments du candidat, du plus ancien au plus récent. `vue` dit qui lit
 * (« Vous » désigne le lecteur).
 */
export function FilDossier({ echanges, vue }: { echanges: EchangeDossier[]; vue: 'candidat' | 'etablissement' }) {
  const { t } = useTranslation()
  const fichiers = useFichiers()
  return (
    <Section title={t('dossier.fil.titre')} icon={<MessagesSquare />}>
      {echanges.length === 0 ? (
        <p className="text-sm text-muted">{t('dossier.fil.vide')}</p>
      ) : (
        <ol className="space-y-3">
          {echanges.map((e, i) => {
            const moi = e.de === vue
            const auteur = moi ? t('dossier.fil.vous') : e.de === 'etablissement' ? t('dossier.fil.etablissement') : t('dossier.fil.candidat')
            const f = fichiers.find((x) => x.id === e.fichierId)
            return (
              <li key={i} className={cn('rounded-xl border p-3', e.de === 'etablissement' ? 'border-brand-100 bg-brand-50/60' : 'border-line bg-white')}>
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="inline-flex items-center gap-1.5 font-bold text-navy-900">
                    {e.de === 'etablissement' ? <Building2 className="size-4 text-brand-600" aria-hidden="true" /> : <UserRound className="size-4 text-brand-600" aria-hidden="true" />}
                    {auteur}
                  </span>
                  <BadgeDossier statut={e.statut} />
                  <span className="ml-auto text-muted">{shortDate(e.le, DATE)}</span>
                </div>
                {e.texte && <p className="mt-1.5 text-sm whitespace-pre-line text-navy-900">{e.texte}</p>}
                {(f || e.fichierNom) && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-navy-800">{f?.nom ?? e.fichierNom}</span>
                    {f && (
                      <Button variant="outline" size="xs" onClick={() => telecharger(f.dataUrl, f.nom)}>
                        <Download aria-hidden="true" />
                        {t('dossier.fil.telecharger')}
                      </Button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </Section>
  )
}
