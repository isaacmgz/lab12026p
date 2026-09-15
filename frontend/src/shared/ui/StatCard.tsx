import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Card } from './Card'
import { Skeleton } from './Skeleton'

export type StatTone = 'neutral' | 'primary' | 'success' | 'danger'

const toneStyles: Record<StatTone, string> = {
  neutral: 'bg-surface-muted text-muted',
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
}

export interface StatCardProps {
  label: string
  value: ReactNode
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  tone?: StatTone
  hint?: ReactNode
  loading?: boolean
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
  hint,
  loading = false,
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 px-5 py-4">
      <span
        className={cn(
          'inline-flex size-10 shrink-0 items-center justify-center rounded-xl',
          toneStyles[tone],
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
        {loading ? (
          <Skeleton className="mt-1.5 h-6 w-24" />
        ) : (
          <p className="truncate text-xl font-semibold tabular-nums">{value}</p>
        )}
        {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
      </div>
    </Card>
  )
}
