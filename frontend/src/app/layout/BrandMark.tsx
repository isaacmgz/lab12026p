import { Landmark } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Landmark aria-hidden="true" className="size-5" />
      </span>
      <span className="text-base font-semibold tracking-tight">Lab Bank</span>
    </span>
  )
}
