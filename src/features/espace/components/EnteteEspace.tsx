import { useTranslation } from 'react-i18next'
import { CircleCheck, Mail, MapPin, PencilLine } from 'lucide-react'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Button } from '@/shared/components/ui/Button'
import type { Compte } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

/**
 * En-tête de « Mon espace » : la photo, le nom et la résidence du compte,
 * dans le bandeau bleu des fiches de l'univers École.
 */
export function EnteteEspace({ compte }: { compte: Compte }) {
  const { t } = useTranslation('espace')
  const residence = [compte.ville, compte.quartier].filter(Boolean).join(' – ')
  return (
    <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_60%,#1a47c4_100%)] text-white">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <Avatar src={compte.avatar || undefined} name={compte.name} size={84} className="shrink-0 ring-4 ring-white/25" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[22px] font-bold md:text-[27px]">{compte.name}</h1>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[12.5px] font-semibold">{t('entete.profil')}</span>
            {compte.statut === 'Validé' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[12.5px] font-semibold">
                <CircleCheck className="size-4 fill-white text-emerald-600" aria-hidden="true" />
                {t('entete.verifie')}
              </span>
            )}
          </div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-white/90">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{compte.identifiant}</span>
            </span>
            {residence && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {residence}
              </span>
            )}
          </p>
        </div>
        <Button to={ROUTES.espace('profil')} variant="white" size="sm" className="self-start sm:self-center">
          <PencilLine aria-hidden="true" />
          {t('entete.modifier')}
        </Button>
      </div>
    </section>
  )
}
