import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customerKeys } from '@/features/customers/api/customer-queries'
import type { TransferPayload } from '../model/transaction'
import { createTransfer, listAccountTransactions } from './transactions-api'

export const transactionKeys = {
  all: ['transactions'] as const,
  byAccount: (accountNumber: string) => ['transactions', accountNumber] as const,
}

export function useAccountTransactionsQuery(accountNumber: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.byAccount(accountNumber ?? ''),
    queryFn: () => listAccountTransactions(accountNumber as string),
    enabled: Boolean(accountNumber),
  })
}

export function useTransferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TransferPayload) => createTransfer(payload),
    onSuccess: (_transaction, payload) => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all })
      void queryClient.invalidateQueries({
        queryKey: transactionKeys.byAccount(payload.senderAccountNumber),
      })
      void queryClient.invalidateQueries({
        queryKey: transactionKeys.byAccount(payload.receiverAccountNumber),
      })
    },
  })
}
