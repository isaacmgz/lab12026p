import { customerFullName, type Customer } from '@/features/customers/model/customer'
import { formatCurrency } from '@/shared/lib/format'
import { Card, CardBody, CardHeader } from '@/shared/ui'

export interface TransferSummaryProps {
  sender: Customer | undefined
  receiver: Customer | undefined
  amount: number
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium tabular-nums">{value}</dd>
    </div>
  )
}

export function TransferSummary({ sender, receiver, amount }: TransferSummaryProps) {
  return (
    <Card>
      <CardHeader title="Summary" description="Balances update as soon as you confirm." />
      <CardBody>
        <dl className="divide-y divide-border">
          <Row label="From" value={sender ? customerFullName(sender) : '—'} />
          <Row label="To" value={receiver ? customerFullName(receiver) : '—'} />
          <Row label="Amount" value={formatCurrency(amount)} />
          <Row
            label="Sender balance after"
            value={sender ? formatCurrency(sender.balance - amount) : '—'}
          />
          <Row
            label="Receiver balance after"
            value={receiver ? formatCurrency(receiver.balance + amount) : '—'}
          />
        </dl>
      </CardBody>
    </Card>
  )
}
