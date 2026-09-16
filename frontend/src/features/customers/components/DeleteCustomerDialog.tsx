import type { ApiError } from '@/shared/api/api-error'
import { Alert, Button, Dialog } from '@/shared/ui'
import { customerFullName, type Customer } from '../model/customer'

export interface DeleteCustomerDialogProps {
  customer: Customer | null
  pending: boolean
  error: ApiError | null
  onConfirm: () => void
  onClose: () => void
}

export function DeleteCustomerDialog({
  customer,
  pending,
  error,
  onConfirm,
  onClose,
}: DeleteCustomerDialogProps) {
  return (
    <Dialog
      open={customer !== null}
      onClose={onClose}
      title="Delete customer"
      description={
        customer
          ? `${customerFullName(customer)} will be removed from the bank. This cannot be undone.`
          : undefined
      }
      className="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={pending}>
            Delete customer
          </Button>
        </>
      }
    >
      {error ? (
        <Alert tone="danger" title={error.title}>
          {error.detail}
        </Alert>
      ) : (
        <p className="text-sm text-muted">
          Customers that already have transactions are kept for auditing and cannot be deleted.
        </p>
      )}
    </Dialog>
  )
}
