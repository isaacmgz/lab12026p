import { describe, expect, it } from 'vitest'
import type { Customer } from '@/features/customers/model/customer'
import { filterHistory, parseHistoryFilter, summarizeHistory, toHistoryEntries } from './history'
import type { Transaction } from './transaction'

const customers: Customer[] = [
  { id: 1, firstName: 'Ana', lastName: 'Díaz', accountNumber: '1001', balance: 500 },
  { id: 2, firstName: 'Luis', lastName: 'Rojas', accountNumber: '1002', balance: 100 },
]

const transactions: Transaction[] = [
  {
    id: 2,
    senderAccountNumber: '9999',
    receiverAccountNumber: '1001',
    amount: 80,
    timestamp: '2026-09-15T09:30:00.654321',
  },
  {
    id: 1,
    senderAccountNumber: '1001',
    receiverAccountNumber: '1002',
    amount: 120.35,
    timestamp: '2026-09-14T10:15:00.123456',
  },
]

describe('toHistoryEntries', () => {
  it('marks direction and resolves counterparty names', () => {
    const entries = toHistoryEntries(transactions, '1001', customers)

    expect(entries[0]).toMatchObject({
      direction: 'in',
      counterpartyAccount: '9999',
      counterpartyName: null,
      amount: 80,
    })
    expect(entries[1]).toMatchObject({
      direction: 'out',
      counterpartyAccount: '1002',
      counterpartyName: 'Luis Rojas',
    })
    expect(entries[1]?.date.getFullYear()).toBe(2026)
  })
})

describe('filterHistory', () => {
  it('keeps only the requested direction', () => {
    const entries = toHistoryEntries(transactions, '1001', customers)

    expect(filterHistory(entries, 'all')).toHaveLength(2)
    expect(filterHistory(entries, 'in')).toHaveLength(1)
    expect(filterHistory(entries, 'out')[0]?.id).toBe(1)
  })
})

describe('summarizeHistory', () => {
  it('totals money in and money out', () => {
    const entries = toHistoryEntries(transactions, '1001', customers)

    expect(summarizeHistory(entries)).toEqual({ moneyIn: 80, moneyOut: 120.35, count: 2 })
  })
})

describe('parseHistoryFilter', () => {
  it('falls back to all for unknown values', () => {
    expect(parseHistoryFilter('in')).toBe('in')
    expect(parseHistoryFilter('out')).toBe('out')
    expect(parseHistoryFilter('nope')).toBe('all')
    expect(parseHistoryFilter(null)).toBe('all')
  })
})
