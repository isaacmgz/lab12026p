import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'danger' | 'warning'

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-muted ring-border',
  primary: 'bg-primary-soft text-primary ring-primary/20',
  success: 'bg-success-soft text-success ring-success/20',
  danger: 'bg-danger-soft text-danger ring-danger/20',
  warning: 'bg-warning-soft text-warning ring-warning/25',
}

export interface BadgeProps {
  tone?: BadgeTone
  icon?: ReactNode
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneStyles[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
