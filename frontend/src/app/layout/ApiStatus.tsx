import { Wifi, WifiOff } from 'lucide-react'
import { useCustomersQuery } from '@/features/customers/api/customer-queries'
import { Badge } from '@/shared/ui'

export function ApiStatus() {
  const customersQuery = useCustomersQuery()

  if (customersQuery.isPending) {
    return null
  }

  return customersQuery.isError ? (
    <Badge tone="danger" icon={<WifiOff aria-hidden="true" className="size-3" />}>
      API unreachable
    </Badge>
  ) : (
    <Badge tone="success" icon={<Wifi aria-hidden="true" className="size-3" />}>
      API connected
    </Badge>
  )
}
