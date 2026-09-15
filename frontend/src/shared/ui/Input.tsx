import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { useFieldControl } from './field-context'
import { controlStyles } from './styles'

export interface InputProps extends ComponentPropsWithRef<'input'> {
  leading?: ReactNode
  trailing?: ReactNode
}

export function Input({ className, leading, trailing, ...props }: InputProps) {
  const fieldProps = useFieldControl()

  if (!leading && !trailing) {
    return <input className={cn(controlStyles, className)} {...fieldProps} {...props} />
  }

  return (
    <div className="relative flex items-center">
      {leading ? (
        <span className="pointer-events-none absolute left-3 flex items-center text-muted">
          {leading}
        </span>
      ) : null}
      <input
        className={cn(controlStyles, leading && 'pl-9', trailing && 'pr-10', className)}
        {...fieldProps}
        {...props}
      />
      {trailing ? <span className="absolute right-2 flex items-center">{trailing}</span> : null}
    </div>
  )
}
