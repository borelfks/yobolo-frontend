import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ImagePlus, Play } from 'lucide-react'
import { data } from '@/data'
import { useMedias } from '@/data/hooks'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/shared/shadcn/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { lireFichier, TAILLE_MAX_DOCUMENT, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { changerVisuel } from '@/modules/ecole/espace-pro/proFichiers'
import { cn } from '@/shared/utils/cn'
import type { Etablissement, MediaEtablissement } from '@/shared/types'
import { CartePro, MenuPlus } from '@/modules/ecole/espace-pro/components/BlocsPro'

type Filtre = 'toutes' | 'photos' | 'videos'

/** Un bouton qui ouvre le choix d'un fichier (champ caché). */
function BoutonFichier({ label, accept, onFichier, className }: { label: string; accept: string; onFichier: (f: File) => void; className?: string }) {
  return (
    <Button asChild variant="secondary" size="sm" className={cn('h-[34px] cursor-pointer px-3.5 focus-within:outline-2 focus-within:outline-ring', className)}>
      <label>
        {label}
        <input type="file" accept={accept} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFichier(f) }} />
      </label>
    </Button>
  )
}

/** Profil › Médias : bannière et logo, puis la galerie (photos et vidéos). */
export function Medias({ ecole }: { ecole: Etablissement }) {
  const { t } = useTranslation('pro', { keyPrefix: 'profil.medias' })
  const medias = useMedias(ecole.id)
  const [filtre, setFiltre] = useState<Filtre>('toutes')
  const [vue, setVue] = useState<MediaEtablissement | null>(null)
  const videos = medias.filter((m) => m.video).length
  const montres = medias.filter((m) => filtre === 'toutes' || (filtre === 'videos') === m.video)
  const tropLourd = t('tropLourd')
  const ajouter = async (fichier: File) => {
    const video = fichier.type.startsWith('video/')
    if (fichier.size > (video ? TAILLE_MAX_DOCUMENT : TAILLE_MAX_PHOTO)) return void toast.error(tropLourd)
    await data.create('medias', { etablissementId: ecole.id, src: await lireFichier(fichier), video }, 'media')
    toast.success(t('ajoute', { name: fichier.name }))
  }
  const filtres: { id: Filtre; n: number }[] = [
    { id: 'toutes', n: medias.length },
    { id: 'photos', n: medias.length - videos },
    { id: 'videos', n: videos },
  ]
  return (
    <>
      <CartePro titre={t('visuels')}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            <b className="text-sm text-foreground">{t('banniere')}</b>
            <img src={ecole.couverture ?? ecole.bandeau ?? ecole.image} alt={t('banniereAlt')} className="h-[150px] w-full rounded-md object-cover" />
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">{t('banniereFormat')}</span>
              <BoutonFichier label={t('modifierBanniere')} accept="image/png,image/jpeg" onFichier={(f) => void changerVisuel(ecole.id, 'banniere', f, { ok: t('banniereChangee'), tropLourd })} />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <b className="text-sm text-foreground">{t('logo')}</b>
            <div className="flex items-center gap-3.5">
              <img src={ecole.logo ?? ecole.vignette ?? ecole.image} alt={t('logoAlt')} className="size-24 shrink-0 rounded-xl border border-border object-cover" />
              <span className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">{t('logoFormat')}</span>
                <span className="text-xs font-medium text-muted-foreground">{t('logoTaille')}</span>
                <BoutonFichier label={t('changerLogo')} accept="image/png,image/jpeg" className="mt-1 self-start" onFichier={(f) => void changerVisuel(ecole.id, 'logo', f, { ok: t('logoChange'), tropLourd })} />
              </span>
            </div>
          </div>
        </div>
      </CartePro>
      <CartePro titre={t('galerie')}>
        <ToggleGroup type="single" variant="outline" size="lg" value={filtre} onValueChange={(v) => v && setFiltre(v as Filtre)} aria-label={t('filtrer')} className="flex-wrap">
          {filtres.map((f) => (
            <ToggleGroupItem key={f.id} value={f.id}>
              {t(`filtres.${f.id}`, { n: f.n })}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {montres.length === 0 ? (
          <p className="rounded-md bg-muted px-3.5 py-3 text-sm text-muted-foreground">{t('aucun')}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {montres.map((m) => (
              <li key={m.id} className="relative overflow-hidden rounded-md bg-foreground">
                <button type="button" onClick={() => setVue(m)} aria-label={t(m.video ? 'voirVideo' : 'voirPhoto')} className="block w-full cursor-pointer">
                  {m.video && m.src.startsWith('data:video') ? <video src={m.src} muted className="h-[130px] w-full object-cover opacity-85 lg:h-[140px]" /> : <img src={m.src} alt="" className={cn('h-[130px] w-full object-cover lg:h-[140px]', m.video && 'opacity-85')} />}
                  {m.video && (
                    <span className="absolute inset-0 grid place-items-center" aria-hidden>
                      <span className="grid size-10 place-items-center rounded-full bg-card text-primary">
                        <Play className="size-[18px] fill-current" />
                      </span>
                    </span>
                  )}
                </button>
                <span className="absolute top-2 left-2 rounded-full bg-foreground/80 px-2 py-0.5 text-[11px] font-bold text-white">{t(m.video ? 'video' : 'photo')}</span>
                <MenuPlus
                  label={t('options')}
                  className="absolute top-1.5 right-1.5 size-8 bg-card text-foreground hover:bg-card"
                  actions={[
                    { label: t('voir'), onSelect: () => setVue(m) },
                    { label: t('supprimer'), danger: true, onSelect: async () => { await data.remove('medias', m.id); toast.success(t('supprime')) } },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
        <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed border-border-strong bg-surface-faint px-4 py-[22px] text-center focus-within:outline-2 focus-within:outline-ring hover:bg-row-hover">
          <ImagePlus className="size-7 text-primary" aria-hidden />
          <b className="text-ui text-foreground">{t('ajouter')}</b>
          <span className="text-xs font-medium text-muted-foreground">{t('deposer')}</span>
          <span className="text-xs font-medium text-muted-foreground">{t('formats')}</span>
          <input type="file" accept="image/png,image/jpeg,video/mp4" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void ajouter(f) }} />
        </label>
      </CartePro>
      <Dialog open={vue !== null} onOpenChange={(o) => !o && setVue(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogTitle>{t(vue?.video ? 'video' : 'photo')}</DialogTitle>
          {vue && (vue.video && (vue.src.startsWith('data:video') || vue.src.endsWith('.webm') || vue.src.endsWith('.mp4')) ? <video src={vue.src} controls className="max-h-[70vh] w-full rounded-md" /> : <img src={vue.src} alt="" className="max-h-[70vh] w-full rounded-md object-contain" />)}
        </DialogContent>
      </Dialog>
    </>
  )
}
