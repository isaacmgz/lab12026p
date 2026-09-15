import { z } from 'zod'
import { isMoneyAmount } from '@/shared/lib/money'

function nameSchema(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(50, `${label} must be 50 characters or fewer`)
}

export const createCustomerSchema = z.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  accountNumber: z
    .string()
    .trim()
    .min(1, 'Account number is required')
    .regex(/^\d{4,20}$/, 'Account number must contain 4 to 20 digits'),
  balance: z
    .string()
    .trim()
    .min(1, 'Initial balance is required')
    .refine((value) => !value.startsWith('-'), 'Initial balance cannot be negative')
    .refine(isMoneyAmount, 'Enter an amount with up to 2 decimals'),
})

export const updateCustomerSchema = z.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
})

export type CreateCustomerValues = z.infer<typeof createCustomerSchema>
export type UpdateCustomerValues = z.infer<typeof updateCustomerSchema>

export function generateAccountNumber() {
  let digits = ''
  for (let index = 0; index < 10; index += 1) {
    digits += Math.floor(Math.random() * 10).toString()
  }
  return digits
}
