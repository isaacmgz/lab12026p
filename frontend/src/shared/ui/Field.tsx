import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { FieldContext } from './field-context'

export interface FieldProps {
  label: string
  hint?: ReactNode
  error?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function Field({ label, hint, error, action, className, children }: FieldProps) {
  const controlId = useId()
  const hintId = `${controlId}-hint`
  const errorId = `${controlId}-error`
  const describedBy = cn(hint ? hintId : undefined, error ? errorId : undefined) || undefined

  return (
    <FieldContext value={{ controlId, describedBy, invalid: Boolean(error) }}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={controlId} className="text-sm font-medium text-foreground">
            {label}
          </label>
          {action}
        </div>
        {children}
        {hint && !error ? (
          <p id={hintId} className="text-xs text-muted">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext>
  )
}
