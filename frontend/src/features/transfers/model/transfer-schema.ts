import { z } from 'zod'
import type { Customer } from '@/features/customers/model/customer'
import { formatCurrency } from '@/shared/lib/format'
import { isMoneyAmount, parseMoney } from '@/shared/lib/money'

export interface TransferFormValues {
  senderAccountNumber: string
  receiverAccountNumber: string
  amount: string
}

export function createTransferSchema(customers: Customer[]) {
  return z
    .object({
      senderAccountNumber: z.string().min(1, 'Choose the account to send from'),
      receiverAccountNumber: z.string().min(1, 'Choose the account to send to'),
      amount: z
        .string()
        .trim()
        .min(1, 'Amount is required')
        .refine((value) => !value.startsWith('-'), 'Amount must be greater than zero')
        .refine(isMoneyAmount, 'Enter an amount with up to 2 decimals')
        .refine((value) => parseMoney(value) > 0, 'Amount must be greater than zero'),
    })
    .superRefine((values, context) => {
      if (
        values.senderAccountNumber &&
        values.senderAccountNumber === values.receiverAccountNumber
      ) {
        context.addIssue({
          code: 'custom',
          path: ['receiverAccountNumber'],
          message: 'Choose an account different from the sender',
        })
      }

      const sender = customers.find(
        (customer) => customer.accountNumber === values.senderAccountNumber,
      )

      if (sender && isMoneyAmount(values.amount) && parseMoney(values.amount) > sender.balance) {
        context.addIssue({
          code: 'custom',
          path: ['amount'],
          message: `Amount exceeds the available balance of ${formatCurrency(sender.balance)}`,
        })
      }
    })
}
