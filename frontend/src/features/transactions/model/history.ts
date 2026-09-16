import type { Customer } from '@/features/customers/model/customer'
import { customerFullName } from '@/features/customers/model/customer'
import { parseServerDateTime } from '@/shared/lib/datetime'
import type { Transaction } from './transaction'

export type HistoryFilter = 'all' | 'in' | 'out'

export interface HistoryEntry {
  id: number
  direction: 'in' | 'out'
  date: Date
  amount: number
  counterpartyAccount: string
  counterpartyName: string | null
}

export function parseHistoryFilter(value: string | null): HistoryFilter {
  return value === 'in' || value === 'out' ? value : 'all'
}

export function toHistoryEntries(
  transactions: Transaction[],
  accountNumber: string,
  customers: Customer[],
): HistoryEntry[] {
  const namesByAccount = new Map(
    customers.map((customer) => [customer.accountNumber, customerFullName(customer)]),
  )

  return transactions.map((transaction) => {
    const isOutgoing = transaction.senderAccountNumber === accountNumber
    const counterpartyAccount = isOutgoing
      ? transaction.receiverAccountNumber
      : transaction.senderAccountNumber

    return {
      id: transaction.id,
      direction: isOutgoing ? 'out' : 'in',
      date: parseServerDateTime(transaction.timestamp),
      amount: transaction.amount,
      counterpartyAccount,
      counterpartyName: namesByAccount.get(counterpartyAccount) ?? null,
    }
  })
}

export function filterHistory(entries: HistoryEntry[], filter: HistoryFilter) {
  if (filter === 'all') {
    return entries
  }

  return entries.filter((entry) => entry.direction === filter)
}

export function summarizeHistory(entries: HistoryEntry[]) {
  return entries.reduce(
    (summary, entry) => {
      if (entry.direction === 'in') {
        summary.moneyIn += entry.amount
      } else {
        summary.moneyOut += entry.amount
      }
      return summary
    },
    { moneyIn: 0, moneyOut: 0, count: entries.length },
  )
}
