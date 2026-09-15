import { ArrowLeftRight } from 'lucide-react'
import { Link } from 'react-router'
import { customerFullName, type Customer } from '@/features/customers/model/customer'
import { formatCurrency } from '@/shared/lib/format'
import { Avatar, buttonStyles, Card, CardBody, CopyButton } from '@/shared/ui'

export function HistoryCustomerCard({ customer }: { customer: Customer }) {
  return (
    <Card>
      <CardBody className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={customerFullName(customer)} seed={customer.accountNumber} size="lg" />
          <div>
            <p className="text-lg font-semibold">{customerFullName(customer)}</p>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm text-muted">{customer.accountNumber}</span>
              <CopyButton
                value={customer.accountNumber}
                label={`Copy account number of ${customerFullName(customer)}`}
                successMessage="Account number copied"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs tracking-wide text-muted uppercase">Current balance</p>
            <p className="text-xl font-semibold tabular-nums">{formatCurrency(customer.balance)}</p>
          </div>
          <Link
            to={`/transfer?from=${customer.accountNumber}`}
            className={buttonStyles('secondary')}
          >
            <ArrowLeftRight aria-hidden="true" className="size-4" />
            Transfer
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
