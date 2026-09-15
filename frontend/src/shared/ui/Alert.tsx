import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

const toneStyles: Record<AlertTone, string> = {
  info: 'border-border bg-surface-muted text-foreground',
  success: 'border-success/30 bg-success-soft text-success',
  warning: 'border-warning/30 bg-warning-soft text-warning',
  danger: 'border-danger/30 bg-danger-soft text-danger',
}

const toneIcons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
}

export interface AlertProps {
  tone?: AlertTone
  title?: ReactNode
  className?: string
  children: ReactNode
}

export function Alert({ tone = 'info', title, className, children }: AlertProps) {
  const Icon = toneIcons[tone]

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl border px-4 py-3 text-sm', toneStyles[tone], className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
