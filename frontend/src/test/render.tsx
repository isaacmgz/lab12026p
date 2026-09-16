import type { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { routes } from '@/app/routes'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function renderApp(initialPath = '/') {
  const queryClient = createTestQueryClient()
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryClientProvider>,
  )

  return { ...result, user: userEvent.setup(), router, queryClient }
}

export function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient()

  const result = render(
    <QueryClientProvider client={queryClient}>
      {ui}
      <Toaster position="top-right" />
    </QueryClientProvider>,
  )

  return { ...result, user: userEvent.setup(), queryClient }
}
