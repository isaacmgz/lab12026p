export interface CustomerRecord {
  id: number
  firstName: string
  lastName: string
  accountNumber: string
  balance: number
}

export interface TransactionRecord {
  id: number
  senderAccountNumber: string
  receiverAccountNumber: string
  amount: number
  timestamp: string
}

export const seedCustomers: CustomerRecord[] = [
  { id: 1, firstName: 'Ana', lastName: 'Díaz', accountNumber: '1001', balance: 500 },
  { id: 2, firstName: 'Luis', lastName: 'Rojas', accountNumber: '1002', balance: 100.5 },
  { id: 3, firstName: 'Marta', lastName: 'Gómez', accountNumber: '1003', balance: 2500 },
]

export const seedTransactions: TransactionRecord[] = [
  {
    id: 1,
    senderAccountNumber: '1001',
    receiverAccountNumber: '1002',
    amount: 120.35,
    timestamp: '2026-09-14T10:15:00.123456',
  },
  {
    id: 2,
    senderAccountNumber: '1003',
    receiverAccountNumber: '1001',
    amount: 80,
    timestamp: '2026-09-15T09:30:00.654321',
  },
]

export interface TestDb {
  customers: CustomerRecord[]
  transactions: TransactionRecord[]
  nextCustomerId: number
  nextTransactionId: number
}

export const db: TestDb = {
  customers: [],
  transactions: [],
  nextCustomerId: 1,
  nextTransactionId: 1,
}

export function resetDb() {
  db.customers = seedCustomers.map((customer) => ({ ...customer }))
  db.transactions = seedTransactions.map((transaction) => ({ ...transaction }))
  db.nextCustomerId = 4
  db.nextTransactionId = 3
}
