import { customerFullName, type Customer } from '@/features/customers/model/customer'
import { formatCurrency, maskAccountNumber } from '@/shared/lib/format'
import { Select } from '@/shared/ui'

export interface CustomerPickerProps {
  customers: Customer[]
  value: string
  onChange: (customerId: string) => void
}

export function CustomerPicker({ customers, value, onChange }: CustomerPickerProps) {
  return (
    <div className="w-full sm:w-96">
      <label htmlFor="history-customer" className="sr-only">
        Customer
      </label>
      <Select
        id="history-customer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select a customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={String(customer.id)}>
            {`${customerFullName(customer)} · ${maskAccountNumber(customer.accountNumber)} · ${formatCurrency(customer.balance)}`}
          </option>
        ))}
      </Select>
    </div>
  )
}
