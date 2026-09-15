import { ArrowLeftRight, Pencil, ReceiptText, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { formatCurrency } from '@/shared/lib/format'
import { Avatar, IconButton, iconButtonStyles } from '@/shared/ui'
import { customerFullName } from '../model/customer'
import type { CustomerListProps } from './CustomerTable'

export function CustomerCardList({ customers, onEdit, onDelete }: CustomerListProps) {
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
            <IconButton
              label={`Edit ${customerFullName(customer)}`}
              onClick={() => onEdit(customer)}
            >
              <Pencil aria-hidden="true" className="size-4" />
            </IconButton>
            <IconButton
              label={`Delete ${customerFullName(customer)}`}
              tone="danger"
              onClick={() => onDelete(customer)}
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </IconButton>
          </div>
        </li>
      ))}
    </ul>
  )
}
