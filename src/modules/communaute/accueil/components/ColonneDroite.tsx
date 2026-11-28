import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDomainesExpertise, useExperts, useSujetsPublication } from '@/data/hooks'
import { EXPERTS_EN_APERCU, SUJETS_DU_MOMENT } from '@/modules/communaute/accueil/accueilFil'
import { Carte, PhotoRonde } from '@/modules/communaute/accueil/components/Carte'
import { usePublicationsDuFil } from '@/modules/communaute/accueil/hooks/useFilDAccueil'
import { useFiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { Button } from '@/shared/shadcn/button'

/**
 * « Experts » (colonne de droite) : ceux des domaines choisis d'abord, trois
 * puis tous ; « Voir ses N publications » montre le fil de l'expert.
 */
export function CarteExperts() {
  const { t } = useTranslation('accueil')
  const experts = useExperts()
  const domaines = useDomainesExpertise()
  const { publications } = usePublicationsDuFil()
  const { filtres, seulement } = useFiltresDuFil()
  const [tous, setTous] = useState(false)
  const tries = experts.toSorted((a, b) => Number(filtres.domaines.includes(b.domaineId)) - Number(filtres.domaines.includes(a.domaineId)))
  return (
    <Carte className="px-4 pt-3.5 pb-2">
      <h2 className="text-base font-bold">{t('experts.titre')}</h2>
      {(tous ? tries : tries.slice(0, EXPERTS_EN_APERCU)).map((e) => {
        const nb = publications.filter((p) => p.auteurId === e.id).length
        return (
          <div key={e.id} className="flex gap-2 pt-3 pb-1">
            <PhotoRonde src={e.photo} nom={e.nom} />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
              <b className="text-sm">{e.nom}</b>
              <span className="text-xs text-muted-foreground">{[domaines.find((d) => d.id === e.domaineId)?.nom, e.ville].filter(Boolean).join(' · ')}</span>
              <Button variant="link" className="mt-1 text-meta" onClick={() => seulement({ experts: [e.id] })}>
                {t('experts.voirSes', { count: nb })}
              </Button>
            </div>
          </div>
        )
      })}
      {experts.length > EXPERTS_EN_APERCU && (
        <Button variant="link-muted" className="py-2.5 pb-1 font-bold" onClick={() => setTous(!tous)}>
          {tous ? t('experts.moins') : t('experts.tous', { count: experts.length })}
        </Button>
      )}
    </Carte>
  )
}

/** « Sujets du moment » : les sujets les plus employés par les publications ; un clic filtre le fil sur l'un d'eux. */
export function SujetsDuMoment() {
  const { t } = useTranslation('accueil')
  const sujets = useSujetsPublication()
  const { publications } = usePublicationsDuFil()
  const { seulement } = useFiltresDuFil()
  const compte = new Map<string, number>()
  publications.forEach((p) => p.sujets.forEach((s) => compte.set(s, (compte.get(s) ?? 0) + 1)))
  const nom = (id: string) => sujets.find((s) => s.id === id)?.nom ?? id
  const tendances = [...compte.keys()].sort((a, b) => compte.get(b)! - compte.get(a)! || nom(a).localeCompare(nom(b))).slice(0, SUJETS_DU_MOMENT)
  if (tendances.length === 0) return null
  return (
    <Carte className="pt-3.5 pb-2">
      <h2 className="px-4 pb-1 text-base font-bold">{t('sujets.titre')}</h2>
      {tendances.map((id) => (
        <Button
          key={id}
          variant="ghost"
          className="h-auto w-full flex-col items-start gap-0.5 rounded-none px-4 py-1.5 text-left font-normal whitespace-normal hover:bg-accent"
          onClick={() => seulement({ sujets: [id] })}
        >
          <b className="text-sm text-foreground">• {nom(id)}</b>
          <span className="pl-2.5 text-xs text-muted-foreground">{t('sujets.publications', { count: compte.get(id) })}</span>
        </Button>
      ))}
    </Carte>
  )
}

/** L'auteur d'une publication ouverte (en tête de la colonne de droite) : « Voir ses publications » montre son fil. */
export function CarteAuteur({ id, nom, photo, role }: { id: string; nom: string; photo?: string; role: string }) {
  const { t } = useTranslation('accueil')
  const { publications } = usePublicationsDuFil()
  const { seulement } = useFiltresDuFil()
  return (
    <Carte className="overflow-hidden">
      <div className="h-14 bg-linear-[120deg] from-foreground to-primary" />
      <div className="-mt-9 flex flex-col items-center gap-1 px-4 pb-4 text-center">
        <PhotoRonde src={photo} nom={nom} className="size-[72px] border-2 border-card bg-card" />
        <b className="mt-2 text-base">{nom}</b>
        <span className="text-xs text-muted-foreground">{role}</span>
        <span className="text-xs text-muted-foreground">{t('sujets.publications', { count: publications.filter((p) => p.auteurId === id).length })}</span>
        <Button size="md" className="mt-2.5 w-full" onClick={() => seulement({ experts: [id] })}>
          {t('auteur.voirSesPublications')}
        </Button>
      </div>
    </Carte>
  )
}
