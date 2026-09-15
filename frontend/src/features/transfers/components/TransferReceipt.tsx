import { CircleCheckBig } from 'lucide-react'
import { Link } from 'react-router'
import { customerFullName, type Customer } from '@/features/customers/model/customer'
import type { Transaction } from '@/features/transactions/model/transaction'
import { parseServerDateTime } from '@/shared/lib/datetime'
import { formatCurrency, formatDateTime } from '@/shared/lib/format'
import { Button, buttonStyles } from '@/shared/ui'

export interface TransferReceiptProps {
  transaction: Transaction
  sender: Customer | undefined
  receiver: Customer | undefined
  onNewTransfer: () => void
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  )
}

export function TransferReceipt({
  transaction,
  sender,
  receiver,
  onNewTransfer,
}: TransferReceiptProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CircleCheckBig aria-hidden="true" className="size-7" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Transfer completed</h2>
          <p className="text-sm text-muted">The money is already available in the destination.</p>
        </div>
        <p className="text-3xl font-semibold tabular-nums">{formatCurrency(transaction.amount)}</p>
      </div>

      <dl className="divide-y divide-border rounded-card border border-border px-4 text-left">
        <Row
          label="From"
          value={
            sender
              ? `${customerFullName(sender)} · ${transaction.senderAccountNumber}`
              : transaction.senderAccountNumber
          }
        />
        <Row
          label="To"
          value={
            receiver
              ? `${customerFullName(receiver)} · ${transaction.receiverAccountNumber}`
              : transaction.receiverAccountNumber
          }
        />
        <Row label="Date" value={formatDateTime(parseServerDateTime(transaction.timestamp))} />
        <Row label="Reference" value={`#${transaction.id}`} />
      </dl>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button onClick={onNewTransfer}>Make another transfer</Button>
        <Link
          to={`/history?account=${transaction.senderAccountNumber}`}
          className={buttonStyles('secondary')}
        >
          View sender history
        </Link>
      </div>
    </div>
  )
}
