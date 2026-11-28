import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/shadcn/button'
import { Champ, ChampTexte, ListeDeroulante, PieceAJoindre } from '@/shared/blocs/Formulaire'
import { accordVide, AUTORITES, type AccordSaisi, type Autorite, type ErreursAccord } from '@/shared/utils/accords'
import { tailleFichier } from '@/shared/utils/fichiers'
import type { NatureAccord } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

/**
 * Les champs d'un accord (canevas : inscription d'une école, Profil › Agrément) :
 * autorité (ou « Autre » + son nom), numéro, date de délivrance, date
 * d'expiration (facultative) et le document de l'accord.
 */
export function ChampsAccord({
  valeur,
  onChange,
  erreurs = {},
  onVoir,
  exempleNumero,
  grand = false,
}: {
  valeur: AccordSaisi
  onChange: (v: AccordSaisi) => void
  erreurs?: ErreursAccord
  /** Ouvrir le document déjà joint (accord enregistré). */
  onVoir?: () => void
  /** L'exemple de numéro, selon le type d'établissement (« Ex. : N° 184/MINESUP »). */
  exempleNumero?: string
  /** Champs de 48 px (inscription). */
  grand?: boolean
}) {
  const { t } = useTranslation('common', { keyPrefix: 'accords' })
  const id = useId()
  const maj = (champs: Partial<AccordSaisi>) => onChange({ ...valeur, ...champs })
  const fichier = valeur.fichier
  const champ = grand ? undefined : 'h-11'
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Champ id={`${id}-autorite`} label={t('champs.autorite')} requis erreur={erreurs.autorite}>
          <ListeDeroulante
            id={`${id}-autorite`}
            grand={grand}
            valeur={valeur.autorite}
            onChange={(autorite) => maj({ autorite })}
            options={AUTORITES.map((a: Autorite) => ({ value: a, label: t(`autorites.${a}`) }))}
            invalide={!!erreurs.autorite}
          />
        </Champ>
        <Champ id={`${id}-numero`} label={t('champs.numero')} requis erreur={erreurs.numero}>
          <ChampTexte id={`${id}-numero`} className={champ} value={valeur.numero} onChange={(e) => maj({ numero: e.target.value })} placeholder={exempleNumero ?? t('champs.numeroExemple')} aria-invalid={!!erreurs.numero || undefined} />
        </Champ>
        {valeur.autorite === 'Autre' && (
          <Champ id={`${id}-autre`} label={t('champs.autre')} requis erreur={erreurs.autre} className="sm:col-span-2">
            <ChampTexte id={`${id}-autre`} className={champ} value={valeur.autre} onChange={(e) => maj({ autre: e.target.value })} placeholder={t('champs.autreExemple')} aria-invalid={!!erreurs.autre || undefined} />
          </Champ>
        )}
        <Champ id={`${id}-delivre`} label={t('champs.delivreLe')} requis erreur={erreurs.delivreLe}>
          <ChampTexte id={`${id}-delivre`} className={champ} type="date" value={valeur.delivreLe} onChange={(e) => maj({ delivreLe: e.target.value })} aria-invalid={!!erreurs.delivreLe || undefined} />
        </Champ>
        <Champ id={`${id}-expire`} label={t('champs.expireLe')} facultatif aide={t('champs.expireAide')} erreur={erreurs.expireLe}>
          <ChampTexte id={`${id}-expire`} className={champ} type="date" value={valeur.expireLe} onChange={(e) => maj({ expireLe: e.target.value })} aria-invalid={!!erreurs.expireLe || undefined} />
        </Champ>
      </div>
      <PieceAJoindre
        titre={t('champs.document')}
        aide={t('champs.formats')}
        nomFichier={fichier ? `${fichier.name} · ${tailleFichier(fichier.size)}` : valeur.documentActuel}
        erreur={erreurs.fichier}
        onFichier={(f) => maj({ fichier: f })}
        onVoir={onVoir && valeur.documentActuel && !fichier ? onVoir : undefined}
      />
    </div>
  )
}

/**
 * Les accords d'une nature (création ou ouverture) : titre et aide, un bloc
 * encadré par accord (« Retirer » s'il y en a plusieurs) et « + Ajouter un
 * autre accord… ».
 */
export function ListeAccords({
  nature,
  saisis,
  onChange,
  erreurs,
  etat,
  onVoir,
  autoriteParDefaut,
  exempleNumero,
  grand,
  className,
}: {
  nature: NatureAccord
  saisis: AccordSaisi[]
  onChange: (liste: AccordSaisi[]) => void
  erreurs: (i: number) => ErreursAccord
  /** Un badge d'état à côté du titre du bloc (accord enregistré). */
  etat?: (a: AccordSaisi) => ReactNode
  /** Ouvrir le document déjà joint d'un accord enregistré. */
  onVoir?: (a: AccordSaisi) => (() => void) | undefined
  /** L'autorité proposée pour un nouvel accord (selon le type d'établissement). */
  autoriteParDefaut?: Autorite
  exempleNumero?: string
  grand?: boolean
  className?: string
}) {
  const { t } = useTranslation('common', { keyPrefix: 'accords' })
  const idTitre = `titre-accords-${nature}`
  return (
    <section className={cn('flex flex-col gap-2.5', className)} aria-labelledby={idTitre}>
      <div className="flex flex-col gap-0.5">
        <h3 id={idTitre} className="text-base font-bold text-foreground">
          {t(`natures.${nature}.titre`)}
        </h3>
        <p className="text-xs font-medium text-muted-foreground">{t(`natures.${nature}.aide`)}</p>
      </div>
      {saisis.map((a, i) => (
        <div key={a.id ?? `nouveau-${i}`} role="group" aria-label={t(`natures.${nature}.bloc`, { n: i + 1 })} className="flex flex-col gap-3 rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <b className="text-ui text-foreground">{t(`natures.${nature}.bloc`, { n: i + 1 })}</b>
            {etat?.(a)}
            {saisis.length > 1 && (
              <Button type="button" variant="link" className="ml-auto text-destructive-hover" onClick={() => onChange(saisis.filter((_, k) => k !== i))}>
                {t('retirer')}
              </Button>
            )}
          </div>
          <ChampsAccord valeur={a} onChange={(v) => onChange(saisis.map((x, k) => (k === i ? v : x)))} erreurs={erreurs(i)} onVoir={onVoir?.(a)} exempleNumero={exempleNumero} grand={grand} />
        </div>
      ))}
      <Button type="button" variant="link" className="self-start" onClick={() => onChange([...saisis, accordVide(autoriteParDefaut)])}>
        + {t(`natures.${nature}.ajouter`)}
      </Button>
    </section>
  )
}
