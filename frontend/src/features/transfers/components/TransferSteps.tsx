import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export type TransferStep = 'details' | 'review' | 'done'

const steps: { id: TransferStep; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

export function TransferSteps({ current }: { current: TransferStep }) {
  const currentIndex = steps.findIndex((step) => step.id === current)

  return (
    <ol className="flex items-center gap-3" aria-label="Transfer progress">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <li key={step.id} className="flex items-center gap-3">
            <span className="flex items-center gap-2" aria-current={isCurrent ? 'step' : undefined}>
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-xs font-semibold',
                  isComplete && 'bg-success-soft text-success',
                  isCurrent && 'bg-primary text-primary-foreground',
                  !isComplete && !isCurrent && 'bg-surface-muted text-muted',
                )}
              >
                {isComplete ? <Check aria-hidden="true" className="size-4" /> : index + 1}
              </span>
              <span
                className={cn('text-sm font-medium', isCurrent ? 'text-foreground' : 'text-muted')}
              >
                {step.label}
              </span>
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="h-px w-6 bg-border sm:w-10" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
