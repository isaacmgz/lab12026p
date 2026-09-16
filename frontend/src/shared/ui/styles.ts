import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type IconButtonTone = 'neutral' | 'danger'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface text-foreground shadow-xs hover:border-border-strong hover:bg-surface-muted',
  ghost: 'text-muted hover:bg-surface-muted hover:text-foreground',
  danger: 'bg-danger text-white shadow-sm hover:bg-danger-hover',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-4 text-sm sm:h-10',
  lg: 'h-12 gap-2 px-5 text-base sm:h-11',
}

const iconButtonTones: Record<IconButtonTone, string> = {
  neutral: 'text-muted hover:bg-surface-muted hover:text-foreground',
  danger: 'text-muted hover:bg-danger-soft hover:text-danger',
}

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(
    'inline-flex shrink-0 select-none items-center justify-center rounded-xl font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-55',
    buttonVariants[variant],
    buttonSizes[size],
  )
}

export function iconButtonStyles(tone: IconButtonTone = 'neutral') {
  return cn(
    'inline-flex size-9 items-center justify-center rounded-lg transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    iconButtonTones[tone],
  )
}

export const controlStyles = cn(
  'h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground shadow-xs sm:h-10',
  'transition-colors outline-none placeholder:text-muted/70',
  'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
  'aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/20',
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted',
  'read-only:bg-surface-muted read-only:text-muted',
)
