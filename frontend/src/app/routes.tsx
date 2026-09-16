import { Navigate, type RouteObject } from 'react-router'
import { AppShell } from './layout/AppShell'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/customers" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
