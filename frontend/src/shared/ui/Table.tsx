import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/shared/lib/cn'

export function TableContainer({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />
}

export function Table({ className, ...props }: ComponentPropsWithRef<'table'>) {
  return <table className={cn('w-full border-collapse text-sm', className)} {...props} />
}

export function Th({ className, scope = 'col', ...props }: ComponentPropsWithRef<'th'>) {
  return (
    <th
      scope={scope}
      className={cn(
        'border-b border-border bg-surface-muted/60 px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted uppercase',
        className,
      )}
      {...props}
    />
  )
}

export function Td({ className, ...props }: ComponentPropsWithRef<'td'>) {
  return (
    <td className={cn('border-b border-border px-4 py-3 align-middle', className)} {...props} />
  )
}

export function Tr({ className, ...props }: ComponentPropsWithRef<'tr'>) {
  return <tr className={cn('transition-colors hover:bg-surface-muted/50', className)} {...props} />
}
