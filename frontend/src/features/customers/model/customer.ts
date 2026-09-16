export interface Customer {
  id: number
  firstName: string
  lastName: string
  accountNumber: string
  balance: number
}

export interface CreateCustomerPayload {
  firstName: string
  lastName: string
  accountNumber: string
  balance: number
}

export interface UpdateCustomerPayload {
  firstName: string
  lastName: string
}

export function customerFullName(customer: Customer) {
  return `${customer.firstName} ${customer.lastName}`.trim()
}
