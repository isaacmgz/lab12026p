import type { ComponentPropsWithRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useFieldControl } from './field-context'
import { controlStyles } from './styles'

export function Select({ className, children, ...props }: ComponentPropsWithRef<'select'>) {
  const fieldProps = useFieldControl()

  return (
    <div className="relative flex items-center">
      <select
        className={cn(controlStyles, 'appearance-none pr-9', className)}
        {...fieldProps}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 size-4 text-muted"
      />
    </div>
  )
}
