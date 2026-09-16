import type { ReactNode } from 'react'
import { CircleAlert, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string
  description?: ReactNode
  onRetry?: () => void
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center px-6 py-12 text-center', className)}
    >
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
        <CircleAlert aria-hidden="true" className="size-5" />
      </span>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-muted">{description}</p> : null}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <Button
            variant="secondary"
            onClick={onRetry}
            icon={<RefreshCw aria-hidden="true" className="size-4" />}
          >
            Try again
          </Button>
        ) : null}
        {action}
      </div>
    </div>
  )
}
