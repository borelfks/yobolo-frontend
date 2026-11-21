import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Check, Eye, Save } from 'lucide-react'
import { Breadcrumb, type Crumb } from '@/shared/components/ui/Breadcrumb'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { cn } from '@/shared/utils/cn'
import { proCard } from '@/features/pro/proStyles'


/** En-tête des pages pro (img7, img13) : fil d'Ariane, icône, titre, sous-titre, page publique. */
export function ProHeader({ crumbs, icon, title, subtitle, actions }: { crumbs: Crumb[]; icon: ReactNode; title: string; subtitle: string; actions?: ReactNode }) {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  return (
    <div className="space-y-1.5">
      <Breadcrumb items={crumbs} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-brand-600 [&_svg]:size-12 [&_svg]:stroke-[1.6]">{icon}</span>
          <div>
            <h1 className="text-[28px] leading-tight font-bold text-navy-900">{title}</h1>
            <p className="text-[15.5px] text-navy-900">{subtitle}</p>
          </div>
        </div>
        {actions ?? (
          <Link to={ecoleUrl(ecole)} className="inline-flex h-12 items-center gap-2.5 rounded-full border-2 border-brand-600/70 bg-white px-6 text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
            <Eye className="size-6" />
            {t('header.viewPublicPage')}
            <ArrowUpRight className="size-5" />
          </Link>
        )}
      </div>
    </div>
  )
}

/** Carte à titre avec icône. */
export function ProCard({ title, icon, subtitle, action, children, className }: { title: ReactNode; icon?: ReactNode; subtitle?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn(proCard, 'p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-[14px] text-navy-900">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

/** Pied de formulaire : Annuler · Enregistrer en brouillon · Enregistrer et publier. */
export function ProFooter({ onPublish, publishLabel }: { onPublish?: () => void; publishLabel?: string }) {
  const { t } = useTranslation('pro')
  return (
    <div className="flex flex-wrap justify-end gap-3 pt-1">
      <button type="button" onClick={() => toast(t('footer.cancelled'))} className="h-12 w-40 rounded-full border-2 border-brand-600/60 bg-white text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
        {t('footer.cancel')}
      </button>
      <button type="button" onClick={() => toast.success(t('footer.draftSaved'))} className="inline-flex h-12 items-center gap-2.5 rounded-full border-2 border-brand-600/60 bg-white px-8 text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
        <Save className="size-6" />
        {t('footer.saveDraft')}
      </button>
      <button type="button" onClick={onPublish ?? (() => toast.success(t('footer.published')))} className="inline-flex h-12 items-center gap-2.5 rounded-full bg-brand-600 px-10 text-[17px] font-semibold text-white hover:bg-brand-700">
        <Check className="size-6" strokeWidth={3} />
        {publishLabel ?? t('footer.publish')}
      </button>
    </div>
  )
}

export function ProLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1 block text-[14.5px] font-bold text-navy-900">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  )
}

