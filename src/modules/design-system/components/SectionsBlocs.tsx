import { useState } from 'react'
import { Inbox, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Avatar, AvatarFallback } from '@/shared/shadcn/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/shadcn/accordion'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/shadcn/alert-dialog'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/shadcn/breadcrumb'
import { Button } from '@/shared/shadcn/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shared/shadcn/chart'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/shadcn/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'
import { Pagination, PaginationButton, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/shared/shadcn/pagination'
import { Progress } from '@/shared/shadcn/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadcn/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/tooltip'
import { Badge } from '@/shared/shadcn/badge'
import { PageSpinner, Spinner, SpinnerOverlay } from '@/shared/blocs/Chargement'
import { EmptyState, ErrorState, MessagePage } from '@/shared/blocs/Etats'
import { SkeletonCard, SkeletonList, SkeletonPageHeader, SkeletonStats, SkeletonTable, SkeletonZone } from '@/shared/blocs/Squelettes'
import { Rangee, Section } from './Vitrine'

export function SectionNavigation() {
  const [page, setPage] = useState(2)
  return (
    <Section id="navigation" titre="Navigation" texte="Fil d'Ariane, onglets soulignés, pagination (page courante en bleu nuit).">
      <Rangee nom="Fil d'Ariane">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#ecole">École</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#ipes">IPES</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Institut Professionnel du Centre (IPC)</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Rangee>
      <Tabs defaultValue="apercu">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="avis">Avis</TabsTrigger>
        </TabsList>
        <TabsContent value="apercu" className="text-sm text-muted-foreground">Contenu de l'onglet Aperçu.</TabsContent>
        <TabsContent value="formations" className="text-sm text-muted-foreground">Contenu de l'onglet Formations.</TabsContent>
        <TabsContent value="informations" className="text-sm text-muted-foreground">Contenu de l'onglet Informations.</TabsContent>
        <TabsContent value="avis" className="text-sm text-muted-foreground">Contenu de l'onglet Avis.</TabsContent>
      </Tabs>
      <Pagination className="justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={page === 1} onClick={() => setPage(page - 1)} />
          </PaginationItem>
          {[1, 2, 3].map((n) => (
            <PaginationItem key={n}>
              <PaginationButton isActive={page === n} onClick={() => setPage(n)}>
                {n}
              </PaginationButton>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext disabled={page === 3} onClick={() => setPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Section>
  )
}

export function SectionSurfaces() {
  return (
    <Section id="surfaces" titre="Menus, fenêtres, infobulles" texte="Menus flottants (10 px, ombre), fenêtres (ombre forte), infobulle bleu nuit.">
      <Rangee nom="Exemples">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="Plus d'actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Pencil /> Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Ouvrir une fenêtre</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un arrondissement</DialogTitle>
              <DialogDescription>Il sera rattaché au département choisi.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Confirmer une suppression</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette formation ?</AlertDialogTitle>
              <AlertDialogDescription>Elle ne sera plus visible sur la fiche publique.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">Survolez-moi</Button>
          </TooltipTrigger>
          <TooltipContent>Infobulle</TooltipContent>
        </Tooltip>
      </Rangee>
      <Accordion type="single" collapsible>
        <AccordionItem value="q1">
          <AccordionTrigger>Comment s'inscrire à une formation ?</AccordionTrigger>
          <AccordionContent>Ouvrez la formation, puis « Préinscrire maintenant ».</AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>Les avis sont-ils vérifiés ?</AccordionTrigger>
          <AccordionContent>Oui, chaque auteur confirme avoir suivi une formation.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  )
}

export function SectionDonnees() {
  return (
    <Section id="donnees" titre="Tableau, avatars, progression" texte="En-têtes en capitales grises, lignes séparées, survol pâle.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Établissement</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ['IP', 'Institut Professionnel du Centre', 'IPES', 'Actif'],
            ['CB', 'CFP du BTP', 'CFP', 'Suspendu'],
          ].map(([init, nom, type, statut]) => (
            <TableRow key={nom}>
              <TableCell>
                <span className="flex items-center gap-2.5 font-semibold">
                  <Avatar>
                    <AvatarFallback>{init}</AvatarFallback>
                  </Avatar>
                  {nom}
                </span>
              </TableCell>
              <TableCell>{type}</TableCell>
              <TableCell>
                <Badge variant={statut === 'Actif' ? 'green' : 'red'}>{statut}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Rangee nom="Progression">
        <Progress value={60} className="max-w-sm" aria-label="Progression" />
      </Rangee>
    </Section>
  )
}

const DONNEES = [
  { mois: 'Juin', vues: 420, preinscriptions: 18 },
  { mois: 'Juil.', vues: 610, preinscriptions: 25 },
  { mois: 'Août', vues: 540, preinscriptions: 31 },
  { mois: 'Sept.', vues: 890, preinscriptions: 52 },
  { mois: 'Oct.', vues: 760, preinscriptions: 44 },
]
const CONFIG = {
  vues: { label: 'Vues', color: 'var(--color-chart-1)' },
  preinscriptions: { label: 'Préinscriptions', color: 'var(--color-chart-2)' },
} satisfies ChartConfig

export function SectionGraphiques() {
  return (
    <Section id="graphiques" titre="Graphiques" texte="recharts, par le composant chart de shadcn. Une couleur par série (jetons chart-1 à chart-5).">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartContainer config={CONFIG} className="h-56 w-full">
          <AreaChart data={DONNEES} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mois" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="vues" type="monotone" stroke="var(--color-vues)" fill="var(--color-vues)" fillOpacity={0.15} strokeWidth={2.5} />
          </AreaChart>
        </ChartContainer>
        <ChartContainer config={CONFIG} className="h-56 w-full">
          <BarChart data={DONNEES}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mois" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="preinscriptions" fill="var(--color-preinscriptions)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </Section>
  )
}

export function SectionChargement() {
  const [voile, setVoile] = useState(false)
  return (
    <Section id="chargement" titre="Chargement" texte="Squelettes quand la forme est connue (le plus souvent), indicateur sinon. Le bouton a son propre état « chargement ».">
      <Rangee nom="Indicateurs">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" />
        <div className="relative w-64 rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Bloc en cours d'enregistrement
          <SpinnerOverlay visible={voile} />
        </div>
        <Button variant="outline" size="md" onClick={() => setVoile(!voile)}>
          {voile ? 'Retirer le voile' : 'Poser le voile'}
        </Button>
      </Rangee>
      <div className="rounded-lg border border-dashed border-border-strong">
        <PageSpinner className="min-h-32" />
      </div>
      <SkeletonZone>
        <SkeletonPageHeader actions={2} />
        <SkeletonStats />
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonCard image />
          <SkeletonCard image />
          <SkeletonCard image />
        </div>
        <SkeletonList rows={3} />
        <SkeletonTable rows={3} />
      </SkeletonZone>
    </Section>
  )
}

export function SectionEtats() {
  return (
    <Section id="etats" titre="États et erreurs" texte="Liste vide, bloc qui n'a pas pu se charger, messages éphémères, pages message du canevas.">
      <div className="grid gap-4 lg:grid-cols-2">
        <EmptyState icone={Inbox} titre="Aucune formation pour l'instant" texte="Créez votre première formation : elle sera publiée tout de suite." action={<Button size="md">Créer une formation</Button>} />
        <ErrorState onRetry={() => toast('Nouvelle tentative…')} />
      </div>
      <Rangee nom="Messages éphémères">
        <Button variant="outline" size="md" onClick={() => toast.success('Formation publiée', { description: 'Elle est visible sur votre fiche.' })}>
          Réussite
        </Button>
        <Button variant="outline" size="md" onClick={() => toast.error("L'enregistrement n'a pas abouti. Réessayez.")}>
          Erreur
        </Button>
        <Button variant="outline" size="md" onClick={() => toast.warning('Votre agrément expire dans 30 jours.')}>
          Attention
        </Button>
        <Button variant="outline" size="md" onClick={() => toast.info('Lien copié.')}>
          Information
        </Button>
        <Button variant="outline" size="md" onClick={() => toast.promise(new Promise((ok) => window.setTimeout(ok, 1500)), { loading: 'Envoi…', success: 'Envoyé', error: 'Échec' })}>
          Avec chargement
        </Button>
      </Rangee>
      <div className="grid gap-4 lg:grid-cols-2">
        {(['404', 'erreur', 'horsligne', 'acces'] as const).map((type) => (
          <div key={type} className="flex rounded-lg border border-border bg-background">
            <MessagePage type={type} className="py-8 sm:py-8" />
          </div>
        ))}
      </div>
    </Section>
  )
}
