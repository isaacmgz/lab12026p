import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { WandSparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { ApiError } from '@/shared/api/api-error'
import { Alert, Button, Dialog, Field, Input, MoneyInput } from '@/shared/ui'
import { customerFullName, type Customer } from '../model/customer'
import {
  createCustomerSchema,
  generateAccountNumber,
  type CreateCustomerValues,
} from '../model/customer-schema'

export interface CustomerFormDialogProps {
  open: boolean
  customer: Customer | null
  pending: boolean
  error: ApiError | null
  onSubmit: (values: CreateCustomerValues) => void
  onClose: () => void
}

const emptyValues: CreateCustomerValues = {
  firstName: '',
  lastName: '',
  accountNumber: '',
  balance: '',
}

export function CustomerFormDialog({
  open,
  customer,
  pending,
  error,
  onSubmit,
  onClose,
}: CustomerFormDialogProps) {
  const isEdit = customer !== null
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<CreateCustomerValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!open) {
      return
    }
    reset(
      customer
        ? {
            firstName: customer.firstName,
            lastName: customer.lastName,
            accountNumber: customer.accountNumber,
            balance: customer.balance.toFixed(2),
          }
        : emptyValues,
    )
  }, [open, customer, reset])

  useEffect(() => {
    if (!error) {
      return
    }

    for (const [field, message] of Object.entries(error.fieldErrors)) {
      if (
        field === 'firstName' ||
        field === 'lastName' ||
        field === 'accountNumber' ||
        field === 'balance'
      ) {
        setError(field, { message })
      }
    }

    if (error.isConflict) {
      setError('accountNumber', { message: error.detail })
    }
  }, [error, setError])

  const showGeneralError =
    error !== null && !error.isConflict && Object.keys(error.fieldErrors).length === 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit customer' : 'New customer'}
      description={
        isEdit
          ? `Update the personal details of ${customerFullName(customer)}.`
          : 'Register a new customer and their opening balance.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="customer-form" loading={pending}>
            {isEdit ? 'Save changes' : 'Create customer'}
          </Button>
        </>
      }
    >
      <form
        id="customer-form"
        className="space-y-4"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
      >
        {showGeneralError ? (
          <Alert tone="danger" title={error.title}>
            {error.detail}
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName?.message}>
            <Input autoComplete="given-name" {...register('firstName')} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input autoComplete="family-name" {...register('lastName')} />
          </Field>
        </div>

        <Field
          label="Account number"
          error={errors.accountNumber?.message}
          hint={isEdit ? 'Account numbers cannot be changed.' : '4 to 20 digits.'}
          action={
            isEdit ? null : (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                onClick={() =>
                  setValue('accountNumber', generateAccountNumber(), { shouldValidate: true })
                }
              >
                <WandSparkles aria-hidden="true" className="size-3.5" />
                Generate
              </button>
            )
          }
        >
          <Input
            inputMode="numeric"
            autoComplete="off"
            readOnly={isEdit}
            className="font-mono"
            {...register('accountNumber')}
          />
        </Field>

        <Field
          label="Initial balance"
          error={errors.balance?.message}
          hint={
            isEdit ? 'Balances change only through transfers.' : 'Opening deposit for this account.'
          }
        >
          <MoneyInput readOnly={isEdit} {...register('balance')} />
        </Field>
      </form>
    </Dialog>
  )
}
