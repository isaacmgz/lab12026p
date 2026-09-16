import { cn } from '@/shared/lib/cn'
import { Input, type InputProps } from './Input'

export function MoneyInput({ className, ...props }: InputProps) {
  return (
    <Input
      inputMode="decimal"
      autoComplete="off"
      placeholder="0.00"
      leading={<span className="text-sm font-medium">$</span>}
      className={cn('font-medium tabular-nums', className)}
      {...props}
    />
  )
}
