import { ArrowLeftRight, ReceiptText } from 'lucide-react'
import { Link } from 'react-router'
import { formatCurrency } from '@/shared/lib/format'
import { Avatar, iconButtonStyles } from '@/shared/ui'
import { customerFullName } from '../model/customer'
import type { CustomerTableProps } from './CustomerTable'

export function CustomerCardList({ customers }: CustomerTableProps) {
  return (
    <ul className="divide-y divide-border md:hidden">
      {customers.map((customer) => (
        <li key={customer.id} className="flex flex-col gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={customerFullName(customer)} seed={customer.accountNumber} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{customerFullName(customer)}</p>
              <p className="font-mono text-xs text-muted">{customer.accountNumber}</p>
            </div>
            <p className="font-semibold tabular-nums">{formatCurrency(customer.balance)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to={`/history/${customer.id}`}
              aria-label={`View history of ${customerFullName(customer)}`}
              className={iconButtonStyles()}
            >
              <ReceiptText aria-hidden="true" className="size-4" />
            </Link>
            <Link
              to={`/transfer?from=${customer.accountNumber}`}
              aria-label={`Transfer from ${customerFullName(customer)}`}
              className={iconButtonStyles()}
            >
              <ArrowLeftRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
