import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface EmptyStateProps {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-surface-muted text-muted">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
