import { Landmark, PiggyBank, Users } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/format'
import { StatCard } from '@/shared/ui'
import { summarizeCustomers } from '../model/customer-list'
import type { Customer } from '../model/customer'

export function CustomerStats({ customers, loading }: { customers: Customer[]; loading: boolean }) {
  const summary = summarizeCustomers(customers)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Customers"
        value={summary.count}
        icon={Users}
        tone="primary"
        loading={loading}
      />
      <StatCard
        label="Total balance"
        value={formatCurrency(summary.total)}
        icon={Landmark}
        tone="success"
        loading={loading}
      />
      <StatCard
        label="Average balance"
        value={formatCurrency(summary.average)}
        icon={PiggyBank}
        loading={loading}
      />
    </div>
  )
}
