import { useCallback, useState } from 'react'
import { Users } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { useCustomersQuery } from '@/features/customers/api/customer-queries'
import { useTransferMutation } from '@/features/transactions/api/transaction-queries'
import type { Transaction } from '@/features/transactions/model/transaction'
import { getErrorMessage, toApiError, type ApiError } from '@/shared/api/api-error'
import { parseMoney } from '@/shared/lib/money'
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle'
import {
  buttonStyles,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/shared/ui'
import { findByAccount } from '../components/AccountOption'
import { TransferForm } from '../components/TransferForm'
import { TransferReceipt } from '../components/TransferReceipt'
import { TransferReview } from '../components/TransferReview'
import { TransferSteps, type TransferStep } from '../components/TransferSteps'
import { TransferSummary } from '../components/TransferSummary'
import type { TransferFormValues } from '../model/transfer-schema'

const cardTitles: Record<TransferStep, string> = {
  details: 'Transfer details',
  review: 'Review and confirm',
  done: 'Receipt',
}

export function TransferPage() {
  useDocumentTitle('Transfer')

  const [searchParams] = useSearchParams()
  const customersQuery = useCustomersQuery()
  const transferMutation = useTransferMutation()

  const customers = customersQuery.data ?? []
  const [step, setStep] = useState<TransferStep>('details')
  const [formKey, setFormKey] = useState(0)
  const [receipt, setReceipt] = useState<Transaction | null>(null)
  const [transferError, setTransferError] = useState<ApiError | null>(null)
  const [values, setValues] = useState<TransferFormValues>({
    senderAccountNumber: searchParams.get('from') ?? '',
    receiverAccountNumber: '',
    amount: '',
  })

  const handleValuesChange = useCallback((next: TransferFormValues) => {
    setValues(next)
  }, [])

  const sender = findByAccount(customers, values.senderAccountNumber)
  const receiver = findByAccount(customers, values.receiverAccountNumber)
  const amount = Number.isFinite(parseMoney(values.amount)) ? parseMoney(values.amount) : 0

  const handleConfirm = () => {
    if (!sender || !receiver) {
      return
    }

    transferMutation.mutate(
      {
        senderAccountNumber: sender.accountNumber,
        receiverAccountNumber: receiver.accountNumber,
        amount,
      },
      {
        onSuccess: (transaction) => {
          setReceipt(transaction)
          setStep('done')
          toast.success('Transfer completed')
        },
        onError: (error) => {
          const apiError = toApiError(error)
          setTransferError(apiError)
          toast.error(apiError.detail)
        },
      },
    )
  }

  const handleNewTransfer = () => {
    setReceipt(null)
    setTransferError(null)
    setValues({ senderAccountNumber: '', receiverAccountNumber: '', amount: '' })
    setFormKey((key) => key + 1)
    setStep('details')
  }

  if (customersQuery.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transfer money" />
        <Card>
          <CardBody className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardBody>
        </Card>
      </div>
    )
  }

  if (customersQuery.isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transfer money" />
        <Card>
          <ErrorState
            title="Could not load accounts"
            description={getErrorMessage(customersQuery.error)}
            onRetry={() => void customersQuery.refetch()}
          />
        </Card>
      </div>
    )
  }

  if (customers.length < 2) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transfer money" />
        <Card>
          <EmptyState
            icon={Users}
            title="At least two accounts are needed"
            description="Create another customer to move money between accounts."
            action={
              <Link to="/customers" className={buttonStyles('primary')}>
                Go to customers
              </Link>
            }
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer money"
        description="Move money between two accounts of the bank."
      />

      <TransferSteps current={step} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title={cardTitles[step]}
            description={
              step === 'details' ? 'Choose the accounts and the amount to send.' : undefined
            }
          />
          <CardBody>
            {step === 'details' ? (
              <TransferForm
                key={formKey}
                customers={customers}
                defaultValues={values}
                onReview={() => {
                  setTransferError(null)
                  setStep('review')
                }}
                onValuesChange={handleValuesChange}
              />
            ) : null}

            {step === 'review' && sender && receiver ? (
              <TransferReview
                sender={sender}
                receiver={receiver}
                amount={amount}
                pending={transferMutation.isPending}
                error={transferError}
                onConfirm={handleConfirm}
                onBack={() => setStep('details')}
              />
            ) : null}

            {step === 'done' && receipt ? (
              <TransferReceipt
                transaction={receipt}
                sender={findByAccount(customers, receipt.senderAccountNumber)}
                receiver={findByAccount(customers, receipt.receiverAccountNumber)}
                onNewTransfer={handleNewTransfer}
              />
            ) : null}
          </CardBody>
        </Card>

        {step === 'done' ? null : (
          <div className="lg:col-span-1">
            <TransferSummary sender={sender} receiver={receiver} amount={amount} />
          </div>
        )}
      </div>
    </div>
  )
}
