import { lazy } from 'react'
import { Card, Skeleton } from '@/shared/ui'

export const CustomersPage = lazy(() =>
  import('@/features/customers/pages/CustomersPage').then((module) => ({
    default: module.CustomersPage,
  })),
)

export const TransferPage = lazy(() =>
  import('@/features/transfers/pages/TransferPage').then((module) => ({
    default: module.TransferPage,
  })),
)

export const HistoryPage = lazy(() =>
  import('@/features/transactions/pages/HistoryPage').then((module) => ({
    default: module.HistoryPage,
  })),
)

export function PageFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <Card>
        <div className="space-y-3 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    </div>
  )
}
