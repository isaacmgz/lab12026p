import { ArrowLeftRight, ReceiptText } from 'lucide-react'
import { Link } from 'react-router'
import { formatCurrency } from '@/shared/lib/format'
import {
  Avatar,
  CopyButton,
  Table,
  TableContainer,
  Td,
  Th,
  Tr,
  iconButtonStyles,
} from '@/shared/ui'
import { customerFullName, type Customer } from '../model/customer'

export interface CustomerTableProps {
  customers: Customer[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <TableContainer className="hidden md:block">
      <Table>
        <caption className="sr-only">Customers and their account balances</caption>
        <thead>
          <tr>
            <Th>Customer</Th>
            <Th>Account</Th>
            <Th className="text-right">Balance</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <Tr key={customer.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={customerFullName(customer)}
                    seed={customer.accountNumber}
                    size="sm"
                  />
                  <span className="font-medium">{customerFullName(customer)}</span>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm text-muted">{customer.accountNumber}</span>
                  <CopyButton
                    value={customer.accountNumber}
                    label={`Copy account number of ${customerFullName(customer)}`}
                    successMessage="Account number copied"
                  />
                </div>
              </Td>
              <Td className="text-right font-semibold tabular-nums">
                {formatCurrency(customer.balance)}
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/history/${customer.id}`}
                    aria-label={`View history of ${customerFullName(customer)}`}
                    title="View history"
                    className={iconButtonStyles()}
                  >
                    <ReceiptText aria-hidden="true" className="size-4" />
                  </Link>
                  <Link
                    to={`/transfer?from=${customer.accountNumber}`}
                    aria-label={`Transfer from ${customerFullName(customer)}`}
                    title="Transfer from this account"
                    className={iconButtonStyles()}
                  >
                    <ArrowLeftRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  )
}
