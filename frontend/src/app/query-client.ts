import { QueryClient } from '@tanstack/react-query'
import { shouldRetryQuery } from '@/shared/api/query-retry'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetryQuery,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
