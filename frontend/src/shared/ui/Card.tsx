import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function Card({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('rounded-card border border-border bg-surface shadow-card', className)}
      {...props}
    />
  )
}

export interface CardHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4',
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div className={cn('px-5 py-4', className)} {...props} />
}
