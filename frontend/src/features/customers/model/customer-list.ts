import { normalizeText } from '@/shared/lib/format'
import { customerFullName, type Customer } from './customer'

export type CustomerSort = 'name' | 'balance-desc' | 'balance-asc'

export const customerSortOptions: { value: CustomerSort; label: string }[] = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'balance-desc', label: 'Balance: high to low' },
  { value: 'balance-asc', label: 'Balance: low to high' },
]

export function filterCustomers(customers: Customer[], search: string) {
  const term = normalizeText(search.trim())

  if (!term) {
    return customers
  }

  return customers.filter((customer) => {
    const haystack = normalizeText(`${customerFullName(customer)} ${customer.accountNumber}`)
    return haystack.includes(term)
  })
}

export function sortCustomers(customers: Customer[], sort: CustomerSort) {
  const sorted = [...customers]

  switch (sort) {
    case 'balance-desc':
      return sorted.sort((left, right) => right.balance - left.balance)
    case 'balance-asc':
      return sorted.sort((left, right) => left.balance - right.balance)
    default:
      return sorted.sort((left, right) =>
        customerFullName(left).localeCompare(customerFullName(right), 'en'),
      )
  }
}

export function summarizeCustomers(customers: Customer[]) {
  const total = customers.reduce((sum, customer) => sum + customer.balance, 0)

  return {
    count: customers.length,
    total,
    average: customers.length > 0 ? total / customers.length : 0,
  }
}
