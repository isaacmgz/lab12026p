import { useState } from 'react'
import { Plus, SearchX, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { toApiError, getErrorMessage, type ApiError } from '@/shared/api/api-error'
import { parseMoney } from '@/shared/lib/money'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'
import { Button, Card, EmptyState, ErrorState, PageHeader } from '@/shared/ui'
import {
  useCreateCustomerMutation,
  useCustomersQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} from '../api/customer-queries'
import { CustomerCardList } from '../components/CustomerCardList'
import { CustomerFormDialog } from '../components/CustomerFormDialog'
import { CustomerListSkeleton } from '../components/CustomerListSkeleton'
import { CustomerStats } from '../components/CustomerStats'
import { CustomerTable } from '../components/CustomerTable'
import { CustomerToolbar } from '../components/CustomerToolbar'
import { DeleteCustomerDialog } from '../components/DeleteCustomerDialog'
import { customerFullName, type Customer } from '../model/customer'
import { filterCustomers, sortCustomers, type CustomerSort } from '../model/customer-list'
import type { CreateCustomerValues } from '../model/customer-schema'

export function CustomersPage() {
  useDocumentTitle('Customers')

  const customersQuery = useCustomersQuery()
  const createMutation = useCreateCustomerMutation()
  const updateMutation = useUpdateCustomerMutation()
  const deleteMutation = useDeleteCustomerMutation()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<CustomerSort>('name')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)
  const [formError, setFormError] = useState<ApiError | null>(null)
  const [deleteError, setDeleteError] = useState<ApiError | null>(null)

  const customers = customersQuery.data ?? []
  const visibleCustomers = sortCustomers(filterCustomers(customers, search), sort)

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setFormError(null)
  }

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (customer: Customer) => {
    setEditing(customer)
    setFormError(null)
    setFormOpen(true)
  }

  const openDelete = (customer: Customer) => {
    setDeleteError(null)
    setDeleting(customer)
  }

  const handleSubmit = (values: CreateCustomerValues) => {
    setFormError(null)

    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          payload: { firstName: values.firstName, lastName: values.lastName },
        },
        {
          onSuccess: (customer) => {
            toast.success(`${customerFullName(customer)} updated`)
            closeForm()
          },
          onError: (error) => setFormError(toApiError(error)),
        },
      )
      return
    }

    createMutation.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        accountNumber: values.accountNumber,
        balance: parseMoney(values.balance),
      },
      {
        onSuccess: (customer) => {
          toast.success(`${customerFullName(customer)} created`)
          closeForm()
        },
        onError: (error) => setFormError(toApiError(error)),
      },
    )
  }

  const handleDelete = () => {
    if (!deleting) {
      return
    }

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`${customerFullName(deleting)} deleted`)
        setDeleting(null)
      },
      onError: (error) => {
        const apiError = toApiError(error)
        setDeleteError(apiError)
        toast.error(apiError.detail)
      },
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Accounts registered in the bank and their current balances."
        actions={
          <Button icon={<Plus aria-hidden="true" className="size-4" />} onClick={openCreate}>
            New customer
          </Button>
        }
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
            action={<Button onClick={openCreate}>New customer</Button>}
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
                <CustomerTable
                  customers={visibleCustomers}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
                <CustomerCardList
                  customers={visibleCustomers}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              </>
            )}
          </>
        )}
      </Card>

      <CustomerFormDialog
        open={formOpen}
        customer={editing}
        pending={createMutation.isPending || updateMutation.isPending}
        error={formError}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <DeleteCustomerDialog
        customer={deleting}
        pending={deleteMutation.isPending}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => {
          setDeleting(null)
          setDeleteError(null)
        }}
      />
    </div>
  )
}
