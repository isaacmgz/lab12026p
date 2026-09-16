import { describe, expect, it } from 'vitest'
import { filterCustomers, sortCustomers, summarizeCustomers } from './customer-list'
import type { Customer } from './customer'

const customers: Customer[] = [
  { id: 1, firstName: 'Ana', lastName: 'Díaz', accountNumber: '1001', balance: 500 },
  { id: 2, firstName: 'Luis', lastName: 'Rojas', accountNumber: '1002', balance: 100 },
  { id: 3, firstName: 'Marta', lastName: 'Gómez', accountNumber: '2003', balance: 300 },
]

describe('filterCustomers', () => {
  it('matches names ignoring case and accents', () => {
    expect(filterCustomers(customers, 'diaz')).toHaveLength(1)
    expect(filterCustomers(customers, 'GÓMEZ')).toHaveLength(1)
  })

  it('matches account numbers', () => {
    expect(filterCustomers(customers, '200')).toEqual([customers[2]])
  })

  it('returns everything for an empty search', () => {
    expect(filterCustomers(customers, '   ')).toHaveLength(3)
  })
})

describe('sortCustomers', () => {
  it('sorts by full name by default', () => {
    expect(sortCustomers(customers, 'name').map((customer) => customer.firstName)).toEqual([
      'Ana',
      'Luis',
      'Marta',
    ])
  })

  it('sorts by balance in both directions', () => {
    expect(sortCustomers(customers, 'balance-desc')[0]?.balance).toBe(500)
    expect(sortCustomers(customers, 'balance-asc')[0]?.balance).toBe(100)
  })
})

describe('summarizeCustomers', () => {
  it('counts customers and totals balances', () => {
    expect(summarizeCustomers(customers)).toEqual({ count: 3, total: 900, average: 300 })
  })

  it('avoids dividing by zero', () => {
    expect(summarizeCustomers([])).toEqual({ count: 0, total: 0, average: 0 })
  })
})
