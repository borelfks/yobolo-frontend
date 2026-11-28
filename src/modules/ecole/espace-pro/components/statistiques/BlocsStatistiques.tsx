import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Button } from '@/shared/shadcn/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shared/shadcn/chart'
import { Progress } from '@/shared/shadcn/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadcn/table'
import { Lien } from '@/shared/ui/Lien'
import { num } from '@/shared/utils/format'

export type PointCourbe = { date: string; vues: number }

/** La courbe des visites (une aire bleue), et son tableau des données à afficher sur demande. */
export function CourbeVisites({ points, enteteDate }: { points: PointCourbe[]; enteteDate: string }) {
  const { t } = useTranslation('pro', { keyPrefix: 'statistiques.courbe' })
  const [tableau, setTableau] = useState(false)
  const config = { vues: { label: t('vues'), color: 'var(--color-chart-1)' } } satisfies ChartConfig
  return (
    <>
      <ChartContainer config={config} className="aspect-auto h-60 w-full">
        <AreaChart data={points} margin={{ left: 0, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis orientation="right" tickLine={false} axisLine={false} width={34} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area dataKey="vues" type="linear" stroke="var(--color-vues)" fill="var(--color-vues)" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
      <Button variant="link" className="self-start text-meta" aria-expanded={tableau} onClick={() => setTableau((x) => !x)}>
        {t(tableau ? 'masquer' : 'afficher')}
      </Button>
      {tableau && (
        <div className="max-h-60 overflow-y-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{enteteDate}</TableHead>
                <TableHead className="text-right">{t('vues')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...points].reverse().map((p) => (
                <TableRow key={p.date}>
                  <TableCell>{p.date}</TableCell>
                  <TableCell className="text-right font-bold">{num(p.vues)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

/** Une barre de répartition : libellé, valeur, part, et la barre bleue (relative au plus grand). */
export function BarreRepartition({ nom, valeur, part, relatif }: { nom: string; valeur: string; part?: string; relatif: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex justify-between gap-2 text-sm text-foreground">
        <span>{nom}</span>
        <span>
          <b>{valeur}</b> {part && <span className="text-muted-foreground">· {part}</span>}
        </span>
      </span>
      <Progress value={relatif} aria-hidden className="**:data-[slot=progress-indicator]:bg-primary" />
    </div>
  )
}

/** Une formation du classement : rang, nom, vues, barre. */
export function LigneClassement({ rang, nom, vues, relatif, to }: { rang: number; nom: string; vues: string; relatif: number; to: string }) {
  return (
    <Lien to={to} className="group flex flex-col gap-1 text-foreground no-underline">
      <span className="flex items-center gap-2.5">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-extrabold">{rang}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold group-hover:text-primary">{nom}</span>
        <b className="shrink-0 text-meta">{vues}</b>
      </span>
      <Progress value={relatif} aria-hidden className="ml-[34px] h-1.5 w-auto **:data-[slot=progress-indicator]:bg-primary" />
    </Lien>
  )
}
