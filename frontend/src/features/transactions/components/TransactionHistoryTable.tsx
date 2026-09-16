import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatDate, formatSignedCurrency, formatTime } from '@/shared/lib/format'
import { Badge, Table, TableContainer, Td, Th, Tr } from '@/shared/ui'
import type { HistoryEntry } from '../model/history'

function DirectionBadge({ direction }: { direction: HistoryEntry['direction'] }) {
  return direction === 'in' ? (
    <Badge tone="success" icon={<ArrowDownLeft aria-hidden="true" className="size-3" />}>
      Received
    </Badge>
  ) : (
    <Badge tone="danger" icon={<ArrowUpRight aria-hidden="true" className="size-3" />}>
      Sent
    </Badge>
  )
}

function amountClass(direction: HistoryEntry['direction']) {
  return cn('font-semibold tabular-nums', direction === 'in' ? 'text-success' : 'text-danger')
}

function signedAmount(entry: HistoryEntry) {
  return formatSignedCurrency(entry.direction === 'in' ? entry.amount : -entry.amount)
}

export function TransactionHistoryTable({ entries }: { entries: HistoryEntry[] }) {
  return (
    <>
      <TableContainer className="hidden md:block">
        <Table>
          <caption className="sr-only">Transaction history</caption>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Counterparty</Th>
              <Th>Reference</Th>
              <Th className="text-right">Amount</Th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <Tr key={entry.id}>
                <Td>
                  <p className="font-medium">{formatDate(entry.date)}</p>
                  <p className="text-xs text-muted">{formatTime(entry.date)}</p>
                </Td>
                <Td>
                  <DirectionBadge direction={entry.direction} />
                </Td>
                <Td>
                  <p className="font-medium">{entry.counterpartyName ?? 'Unknown account'}</p>
                  <p className="font-mono text-xs text-muted">{entry.counterpartyAccount}</p>
                </Td>
                <Td className="font-mono text-xs text-muted">#{entry.id}</Td>
                <Td className={cn('text-right', amountClass(entry.direction))}>
                  {signedAmount(entry)}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <ul className="divide-y divide-border md:hidden">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-4">
            <div className="min-w-0 space-y-1">
              <DirectionBadge direction={entry.direction} />
              <p className="truncate font-medium">{entry.counterpartyName ?? 'Unknown account'}</p>
              <p className="text-xs text-muted">
                {formatDate(entry.date)} · {formatTime(entry.date)}
              </p>
            </div>
            <p className={amountClass(entry.direction)}>{signedAmount(entry)}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
