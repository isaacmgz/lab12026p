import { http } from '@/shared/api/http'
import type { Transaction, TransferPayload } from '../model/transaction'

export async function listAccountTransactions(accountNumber: string) {
  const { data } = await http.get<Transaction[]>(`/transactions/${accountNumber}`)
  return data
}

export async function createTransfer(payload: TransferPayload) {
  const { data } = await http.post<Transaction>('/transactions', payload)
  return data
}
