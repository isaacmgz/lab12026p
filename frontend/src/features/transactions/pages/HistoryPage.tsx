import { useEffect } from 'react'
import { Inbox, ReceiptText } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { useCustomerQuery, useCustomersQuery } from '@/features/customers/api/customer-queries'
import { getErrorMessage, toApiError } from '@/shared/api/api-error'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'
import {
  buttonStyles,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  SegmentedControl,
  Skeleton,
} from '@/shared/ui'
import { useAccountTransactionsQuery } from '../api/transaction-queries'
import { CustomerPicker } from '../components/CustomerPicker'
import { HistoryCustomerCard } from '../components/HistoryCustomerCard'
import { HistoryStats } from '../components/HistoryStats'
import { TransactionHistoryTable } from '../components/TransactionHistoryTable'
import {
  filterHistory,
  parseHistoryFilter,
  toHistoryEntries,
  type HistoryFilter,
} from '../model/history'

const filterOptions: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'Incoming' },
  { value: 'out', label: 'Outgoing' },
]

export function HistoryPage() {
  useDocumentTitle('Transaction history')

  const { customerId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const customersQuery = useCustomersQuery()
  const customers = customersQuery.data ?? []
  const filter = parseHistoryFilter(searchParams.get('type'))
  const accountParam = searchParams.get('account')

  const selectedId = customerId && /^\d+$/.test(customerId) ? Number(customerId) : undefined
  const customerQuery = useCustomerQuery(selectedId)
  const customer = customerQuery.data
  const transactionsQuery = useAccountTransactionsQuery(customer?.accountNumber)

  const accountMatchId = accountParam
    ? customers.find((item) => item.accountNumber === accountParam)?.id
    : undefined

  useEffect(() => {
    if (customerId || !accountMatchId) {
      return
    }

    navigate(`/history/${accountMatchId}`, { replace: true })
  }, [accountMatchId, customerId, navigate])

  const entries = toHistoryEntries(
    transactionsQuery.data ?? [],
    customer?.accountNumber ?? '',
    customers,
  )
  const visibleEntries = filterHistory(entries, filter)

  const handleSelect = (value: string) => {
    navigate(value ? `/history/${value}` : '/history')
  }

  const handleFilter = (value: HistoryFilter) => {
    setSearchParams(value === 'all' ? {} : { type: value }, { replace: true })
  }

  const notFound = customerQuery.isError && toApiError(customerQuery.error).isNotFound

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction history"
        description="Every transfer sent or received by an account."
        actions={
          <CustomerPicker
            customers={customers}
            value={selectedId ? String(selectedId) : ''}
            onChange={handleSelect}
          />
        }
      />

      {!selectedId ? (
        <Card>
          <EmptyState
            icon={ReceiptText}
            title="Select a customer to see their history"
            description="Pick an account above and every transfer will show up here."
            action={
              <Link to="/customers" className={buttonStyles('secondary')}>
                Browse customers
              </Link>
            }
          />
        </Card>
      ) : notFound ? (
        <Card>
          <ErrorState
            title="Customer not found"
            description="This customer does not exist anymore."
            action={
              <Link to="/customers" className={buttonStyles('primary')}>
                Go to customers
              </Link>
            }
          />
        </Card>
      ) : customerQuery.isError ? (
        <Card>
          <ErrorState
            title="Could not load the customer"
            description={getErrorMessage(customerQuery.error)}
            onRetry={() => void customerQuery.refetch()}
          />
        </Card>
      ) : (
        <>
          {customer ? <HistoryCustomerCard customer={customer} /> : <Skeleton className="h-24" />}

          <HistoryStats entries={entries} loading={transactionsQuery.isPending} />

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4">
              <SegmentedControl
                label="Filter transactions"
                value={filter}
                options={filterOptions}
                onChange={handleFilter}
              />
              <p aria-live="polite" className="text-sm text-muted">
                {visibleEntries.length} of {entries.length}
              </p>
            </div>

            {transactionsQuery.isPending ? (
              <div className="space-y-3 p-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : transactionsQuery.isError ? (
              <ErrorState
                title="Could not load the history"
                description={getErrorMessage(transactionsQuery.error)}
                onRetry={() => void transactionsQuery.refetch()}
              />
            ) : visibleEntries.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title={entries.length === 0 ? 'No transactions yet' : 'No transactions to show'}
                description={
                  entries.length === 0
                    ? 'This account has not sent or received money yet.'
                    : 'Try a different filter to see more movements.'
                }
                action={
                  customer ? (
                    <Link
                      to={`/transfer?from=${customer.accountNumber}`}
                      className={buttonStyles('primary')}
                    >
                      Make a transfer
                    </Link>
                  ) : null
                }
              />
            ) : (
              <TransactionHistoryTable entries={visibleEntries} />
            )}
          </Card>
        </>
      )}
    </div>
  )
}
