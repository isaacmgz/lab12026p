import { customerFullName, type Customer } from '@/features/customers/model/customer'
import { formatCurrency, maskAccountNumber } from '@/shared/lib/format'

export function accountOptionLabel(customer: Customer) {
  return `${customerFullName(customer)} · ${maskAccountNumber(customer.accountNumber)} · ${formatCurrency(customer.balance)}`
}

export function findByAccount(customers: Customer[], accountNumber: string) {
  return customers.find((customer) => customer.accountNumber === accountNumber)
}
