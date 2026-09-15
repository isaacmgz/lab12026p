import { useState } from 'react'
import { SearchX, UserPlus } from 'lucide-react'
import { getErrorMessage } from '@/shared/api/api-error'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'
import { Button, Card, EmptyState, ErrorState, PageHeader } from '@/shared/ui'
import { useCustomersQuery } from '../api/customer-queries'
import { CustomerCardList } from '../components/CustomerCardList'
import { CustomerListSkeleton } from '../components/CustomerListSkeleton'
import { CustomerStats } from '../components/CustomerStats'
import { CustomerTable } from '../components/CustomerTable'
import { CustomerToolbar } from '../components/CustomerToolbar'
import { filterCustomers, sortCustomers, type CustomerSort } from '../model/customer-list'

export function CustomersPage() {
  useDocumentTitle('Customers')

  const customersQuery = useCustomersQuery()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<CustomerSort>('name')

  const customers = customersQuery.data ?? []
  const visibleCustomers = sortCustomers(filterCustomers(customers, search), sort)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Accounts registered in the bank and their current balances."
      />

      <CustomerStats customers={customers} loading={customersQuery.isPending} />

      <Card className="overflow-hidden">
        {customersQuery.isPending ? (
          <CustomerListSkeleton />
        ) : customersQuery.isError ? (
          <ErrorState
            title="Could not load customers"
            description={getErrorMessage(customersQuery.error)}
            onRetry={() => void customersQuery.refetch()}
          />
        ) : customers.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No customers yet"
            description="Create the first customer to start moving money between accounts."
          />
        ) : (
          <>
            <CustomerToolbar
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
              resultCount={visibleCustomers.length}
              totalCount={customers.length}
            />
            {visibleCustomers.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No customers match your search"
                description={`Nothing found for "${search}".`}
                action={
                  <Button variant="secondary" onClick={() => setSearch('')}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              <>
                <CustomerTable customers={visibleCustomers} />
                <CustomerCardList customers={visibleCustomers} />
              </>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
