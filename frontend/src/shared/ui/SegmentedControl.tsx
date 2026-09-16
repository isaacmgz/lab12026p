import { useId } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const name = useId()

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex rounded-xl border border-border bg-surface-muted p-1 text-sm',
        className,
      )}
    >
      {options.map((option) => {
        const checked = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'relative cursor-pointer rounded-lg px-3 py-1.5 font-medium transition-colors',
              checked ? 'bg-surface text-foreground shadow-xs' : 'text-muted hover:text-foreground',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
