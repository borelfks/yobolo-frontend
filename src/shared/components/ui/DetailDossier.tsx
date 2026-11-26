import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, FileText, Paperclip } from 'lucide-react'
import { useFichiers } from '@/data/hooks'
import { Button } from '@/shared/components/ui/Button'
import { Section } from '@/shared/components/ui/Card'
import { telecharger } from '@/shared/utils/fichiers'

/** Une liste « libellé : valeur » d'un dossier (les valeurs vides sont omises). Mon espace et espace pro. */
export function ChampsDossier({ titre, icone, champs }: { titre: string; icone: ReactNode; champs: { label: string; valeur?: string }[] }) {
  const remplis = champs.filter((c) => c.valeur)
  if (remplis.length === 0) return null
  return (
    <Section title={titre} icon={icone}>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {remplis.map((c) => (
          <div key={c.label} className="min-w-0">
            <dt className="text-[13px] text-muted">{c.label}</dt>
            <dd className="truncate font-semibold text-navy-900">{c.valeur}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

/** Les pièces jointes d'un dossier, gardées dans la table `fichiers`, à télécharger. */
export function PiecesDossier({ pieces }: { pieces: { cle: string; nom: string; fichierId?: string }[] }) {
  const { t } = useTranslation()
  const fichiers = useFichiers()
  return (
    <Section title={t('dossier.pieces')} icon={<Paperclip />}>
      {pieces.length === 0 ? (
        <p className="text-sm text-muted">{t('dossier.aucunePiece')}</p>
      ) : (
        <ul className="space-y-2">
          {pieces.map((p) => {
            const f = fichiers.find((x) => x.id === p.fichierId)
            return (
              <li key={p.cle} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2">
                <FileText className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-900">{f?.nom ?? p.nom}</span>
                {f && (
                  <Button variant="outline" size="sm" onClick={() => telecharger(f.dataUrl, f.nom)}>
                    <Download aria-hidden="true" />
                    {t('dossier.fil.telecharger')}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Section>
  )
}
