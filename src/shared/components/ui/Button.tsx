import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700',
        navy: 'bg-navy-800 text-white hover:bg-navy-900',
        sun: 'bg-sun-400 text-navy-950 shadow-sm shadow-sun-500/30 hover:bg-sun-500',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700',
        violet: 'bg-violet-600 text-white hover:bg-violet-700',
        outline: 'border border-brand-200 bg-white text-brand-700 hover:bg-brand-50',
        neutral: 'border border-line bg-white text-ink hover:bg-slate-50',
        soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
        ghost: 'text-ink hover:bg-slate-100',
        danger: 'bg-rose-600 text-white hover:bg-rose-700',
        'danger-outline': 'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50',
        white: 'bg-white text-navy-900 hover:bg-white/90',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type Variants = VariantProps<typeof buttonVariants>

type ButtonProps = ComponentProps<'button'> & Variants & { to?: undefined }
type LinkProps = Omit<ComponentProps<typeof Link>, 'to'> & Variants & { to: string; children?: ReactNode }

export function Button(props: ButtonProps | LinkProps) {
  const { variant, size, className, ...rest } = props
  const classes = cn(buttonVariants({ variant, size }), className)
  if (rest.to !== undefined) {
    return <Link {...(rest as LinkProps)} className={classes} />
  }
  const { type = 'button', ...buttonRest } = rest as ButtonProps
  return <button type={type} {...buttonRest} className={classes} />
}
