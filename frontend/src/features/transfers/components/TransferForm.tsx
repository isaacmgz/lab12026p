import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { Customer } from '@/features/customers/model/customer'
import { formatCurrency } from '@/shared/lib/format'
import { toAmountInput } from '@/shared/lib/money'
import { Button, Field, IconButton, MoneyInput, Select } from '@/shared/ui'
import { createTransferSchema, type TransferFormValues } from '../model/transfer-schema'
import { accountOptionLabel, findByAccount } from './AccountOption'

export interface TransferFormProps {
  customers: Customer[]
  defaultValues: TransferFormValues
  onReview: (values: TransferFormValues) => void
  onValuesChange: (values: TransferFormValues) => void
}

const quickAmounts = [
  { label: '25%', factor: 0.25 },
  { label: '50%', factor: 0.5 },
  { label: 'Max', factor: 1 },
]

export function TransferForm({
  customers,
  defaultValues,
  onReview,
  onValuesChange,
}: TransferFormProps) {
  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(createTransferSchema(customers)),
    defaultValues,
  })

  const senderAccountNumber = watch('senderAccountNumber')
  const receiverAccountNumber = watch('receiverAccountNumber')
  const amount = watch('amount')
  const sender = findByAccount(customers, senderAccountNumber)

  useEffect(() => {
    onValuesChange({ senderAccountNumber, receiverAccountNumber, amount })
  }, [senderAccountNumber, receiverAccountNumber, amount, onValuesChange])

  const handleSwap = () => {
    const currentSender = getValues('senderAccountNumber')
    const currentReceiver = getValues('receiverAccountNumber')
    setValue('senderAccountNumber', currentReceiver)
    setValue('receiverAccountNumber', currentSender)
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onReview)(event)
      }}
    >
      <Field label="From account" error={errors.senderAccountNumber?.message}>
        <Select {...register('senderAccountNumber')}>
          <option value="">Select an account</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.accountNumber}>
              {accountOptionLabel(customer)}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex justify-center">
        <IconButton label="Swap accounts" onClick={handleSwap} className="border border-border">
          <ArrowUpDown aria-hidden="true" className="size-4" />
        </IconButton>
      </div>

      <Field label="To account" error={errors.receiverAccountNumber?.message}>
        <Select {...register('receiverAccountNumber')}>
          <option value="">Select an account</option>
          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.accountNumber}
              disabled={customer.accountNumber === senderAccountNumber}
            >
              {accountOptionLabel(customer)}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Amount"
        error={errors.amount?.message}
        hint={sender ? `Available: ${formatCurrency(sender.balance)}` : 'Select the sender first'}
      >
        <MoneyInput {...register('amount')} />
      </Field>

      {sender ? (
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((quick) => (
            <button
              key={quick.label}
              type="button"
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary"
              onClick={() =>
                setValue('amount', toAmountInput(sender.balance * quick.factor), {
                  shouldValidate: true,
                })
              }
            >
              {quick.label}
            </button>
          ))}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!senderAccountNumber || !receiverAccountNumber}
      >
        Review transfer
      </Button>
    </form>
  )
}
