import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import { EmptyState } from '@/shared/blocs/Etats'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/select'
import { Lien } from '@/shared/ui/Lien'
import { GrilleVignettes, VignetteEcole } from '@/modules/ecole/etablissements/components/Vignette'
import type { EcoleResumee, GenreEcole } from '@/modules/ecole/etablissements/schoolListing'

/** Valeur de « Toutes les villes » dans la liste (une valeur vide n'est pas permise). */
const TOUTES = '*'

/**
 * La recherche de la page École : « Établissement ou formation », la ville,
 * « Rechercher ». Le texte filtre en direct ; la ville aussi.
 */
export function RechercheEcole({ q, ville, villes, onQ, onVille }: { q: string; ville: string; villes: string[]; onQ: (q: string) => void; onVille: (v: string) => void }) {
  const { t } = useTranslation('schools')
  const [texte, setTexte] = useState(q)
  const [qPrecedent, setQPrecedent] = useState(q)
  // La recherche a changé ailleurs (« Effacer la recherche », retour arrière) : le champ suit.
  if (q !== qPrecedent) {
    setQPrecedent(q)
    if (q !== texte) setTexte(q)
  }
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        onQ(texte.trim())
      }}
      className="flex flex-wrap gap-2.5 border-b border-border bg-card px-4 py-3.5 sm:rounded-lg sm:border sm:p-4"
    >
      <label className="flex h-11 min-w-0 flex-[1_1_220px] items-center gap-2 rounded-sm border border-input bg-card px-3.5 text-muted-foreground focus-within:border-ring focus-within:outline-2 focus-within:outline-ring">
        <Search className="size-[18px] shrink-0" strokeWidth={2.2} aria-hidden />
        <Input
          type="search"
          value={texte}
          onChange={(e) => {
            setTexte(e.target.value)
            onQ(e.target.value)
          }}
          aria-label={t('ecole.recherche')}
          placeholder={t('ecole.recherche')}
          className="h-auto border-0 bg-transparent px-0 focus-visible:outline-none"
        />
      </label>
      <Select value={ville || TOUTES} onValueChange={(v) => onVille(v === TOUTES ? '' : v)}>
        <SelectTrigger aria-label={t('ecole.ville')} className="min-w-0 flex-[1_1_180px]">
          <span className="flex min-w-0 items-center gap-2">
            <MapPin className="size-[18px] text-muted-foreground" aria-hidden />
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TOUTES}>{t('ecole.toutesVilles')}</SelectItem>
          {villes.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="lg" className="max-sm:w-full">
        {t('ecole.rechercher')}
      </Button>
    </form>
  )
}

/**
 * Une rangée de la page École (IPES, CFP, Autres établissements, Auto-écoles) :
 * titre, chiffres du type, « Voir les … » vers sa liste, puis les vignettes.
 */
export function RangeeEcole({ genre, lien, tous, montres, cherche }: { genre: GenreEcole; lien: string; tous: EcoleResumee[]; montres: EcoleResumee[]; cherche: boolean }) {
  const { t } = useTranslation('schools')
  const codes = [...new Set(tous.flatMap((e) => e.permis))].sort()
  const sous = cherche
    ? t('ecole.resultats', { count: montres.length, total: tous.length })
    : genre === 'auto'
      ? t('ecole.sousAuto', { count: tous.length, de: codes[0], a: codes[codes.length - 1] })
      : t('ecole.sousEtablissements', { count: tous.length, formations: t('vignette.formations', { count: tous.reduce((n, e) => n + e.formations.length, 0) }) })
  const titreId = `ecole-${genre}`
  return (
    <section aria-labelledby={titreId} className="flex flex-col gap-3.5 border-y border-border bg-card py-4 sm:rounded-lg sm:border sm:pt-[18px]">
      <div className="flex items-end justify-between gap-3 px-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 id={titreId} className="text-xl font-bold text-foreground">
            {t(`ecole.titres.${genre}`)}
          </h2>
          <span className="text-sm text-muted-foreground">{sous}</span>
        </div>
        <Lien to={lien} className="inline-flex items-center gap-1 text-sm font-bold whitespace-nowrap text-primary no-underline hover:underline">
          {t(`ecole.voir.${genre}`, { count: tous.length })}
          <ArrowRight className="size-[18px]" aria-hidden />
        </Lien>
      </div>
      <GrilleVignettes className="sm:px-4">
        {montres.map((e) => (
          <VignetteEcole key={e.id} ecole={e} />
        ))}
      </GrilleVignettes>
    </section>
  )
}

/** Aucune école ne correspond à la recherche : « Effacer la recherche ». */
export function VideEcole({ titre, onEffacer }: { titre: string; onEffacer: () => void }) {
  const { t } = useTranslation('schools')
  return (
    <EmptyState
      icone={Search}
      titre={titre}
      className="rounded-none border-x-0 py-12 sm:rounded-lg sm:border-x"
      action={
        <Button variant="link" onClick={onEffacer}>
          {t('ecole.effacer')}
        </Button>
      }
    />
  )
}
