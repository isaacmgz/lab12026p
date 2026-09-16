import { Suspense, type ReactNode } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import { CustomersPage, HistoryPage, PageFallback, TransferPage } from './lazy-pages'
import { AppShell } from './layout/AppShell'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'

function withSuspense(page: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{page}</Suspense>
}

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/customers" replace /> },
      { path: 'customers', element: withSuspense(<CustomersPage />) },
      { path: 'transfer', element: withSuspense(<TransferPage />) },
      { path: 'history', element: withSuspense(<HistoryPage />) },
      { path: 'history/:customerId', element: withSuspense(<HistoryPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
