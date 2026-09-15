import { Skeleton } from '@/shared/ui'

export function CustomerListSkeleton() {
  return (
    <ul className="divide-y divide-border">
      {Array.from({ length: 4 }, (_, index) => (
        <li key={index} className="flex items-center gap-3 px-4 py-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-24" />
        </li>
      ))}
    </ul>
  )
}
