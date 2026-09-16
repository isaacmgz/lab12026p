import { ArrowDownLeft, ArrowUpRight, ReceiptText } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/format'
import { StatCard } from '@/shared/ui'
import type { HistoryEntry } from '../model/history'
import { summarizeHistory } from '../model/history'

export function HistoryStats({ entries, loading }: { entries: HistoryEntry[]; loading: boolean }) {
  const summary = summarizeHistory(entries)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Money in"
        value={formatCurrency(summary.moneyIn)}
        icon={ArrowDownLeft}
        tone="success"
        loading={loading}
      />
      <StatCard
        label="Money out"
        value={formatCurrency(summary.moneyOut)}
        icon={ArrowUpRight}
        tone="danger"
        loading={loading}
      />
      <StatCard label="Transactions" value={summary.count} icon={ReceiptText} loading={loading} />
    </div>
  )
}
