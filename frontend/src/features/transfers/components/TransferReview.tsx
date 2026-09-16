import { customerFullName, type Customer } from '@/features/customers/model/customer'
import type { ApiError } from '@/shared/api/api-error'
import { formatCurrency } from '@/shared/lib/format'
import { Alert, Avatar, Button } from '@/shared/ui'

export interface TransferReviewProps {
  sender: Customer
  receiver: Customer
  amount: number
  pending: boolean
  error: ApiError | null
  onConfirm: () => void
  onBack: () => void
}

function Party({ customer, caption }: { customer: Customer; caption: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={customerFullName(customer)} seed={customer.accountNumber} />
      <div className="min-w-0">
        <p className="text-xs tracking-wide text-muted uppercase">{caption}</p>
        <p className="truncate font-medium">{customerFullName(customer)}</p>
        <p className="font-mono text-xs text-muted">{customer.accountNumber}</p>
      </div>
    </div>
  )
}

export function TransferReview({
  sender,
  receiver,
  amount,
  pending,
  error,
  onConfirm,
  onBack,
}: TransferReviewProps) {
  return (
    <div className="space-y-5">
      {error ? (
        <Alert tone="danger" title={error.title}>
          {error.detail}
        </Alert>
      ) : null}

      <div className="rounded-card border border-border bg-surface-muted/50 p-5 text-center">
        <p className="text-xs tracking-wide text-muted uppercase">Amount to transfer</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">{formatCurrency(amount)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Party customer={sender} caption="From" />
        <Party customer={receiver} caption="To" />
      </div>

      <Alert tone="warning" title="Transfers cannot be undone">
        Check both accounts and the amount before confirming.
      </Alert>

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button size="lg" className="sm:flex-1" loading={pending} onClick={onConfirm}>
          Confirm transfer
        </Button>
        <Button size="lg" variant="secondary" onClick={onBack} disabled={pending}>
          Back
        </Button>
      </div>
    </div>
  )
}
