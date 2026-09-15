import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateCustomerPayload, UpdateCustomerPayload } from '../model/customer'
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from './customers-api'

export const customerKeys = {
  all: ['customers'] as const,
  detail: (id: number) => ['customers', id] as const,
}

export function useCustomersQuery() {
  return useQuery({
    queryKey: customerKeys.all,
    queryFn: listCustomers,
  })
}

export function useCustomerQuery(id: number | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id ?? 0),
    queryFn: () => getCustomer(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id),
  })
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createCustomer(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  })
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCustomerPayload }) =>
      updateCustomer(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  })
}

export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  })
}
