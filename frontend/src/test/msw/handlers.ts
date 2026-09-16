import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/shared/api/config'
import { db, type CustomerRecord } from './db'

interface ProblemOptions {
  status: number
  title: string
  detail: string
  errors?: Record<string, string>
}

function problem({ status, title, detail, errors }: ProblemOptions) {
  return HttpResponse.json(
    { type: 'about:blank', title, status, detail, ...(errors ? { errors } : {}) },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  )
}

function findByAccount(accountNumber: string) {
  return db.customers.find((customer) => customer.accountNumber === accountNumber)
}

export const handlers = [
  http.get(`${API_BASE_URL}/customers`, () => HttpResponse.json(db.customers)),

  http.get(`${API_BASE_URL}/customers/:id`, ({ params }) => {
    const customer = db.customers.find((item) => item.id === Number(params.id))

    if (!customer) {
      return problem({
        status: 404,
        title: 'Resource not found',
        detail: `Customer with id ${String(params.id)} was not found`,
      })
    }

    return HttpResponse.json(customer)
  }),

  http.post(`${API_BASE_URL}/customers`, async ({ request }) => {
    const body = (await request.json()) as Partial<CustomerRecord>
    const accountNumber = String(body.accountNumber ?? '')

    if (findByAccount(accountNumber)) {
      return problem({
        status: 409,
        title: 'Conflict',
        detail: `Account number ${accountNumber} is already in use`,
      })
    }

    const customer: CustomerRecord = {
      id: db.nextCustomerId++,
      firstName: String(body.firstName ?? ''),
      lastName: String(body.lastName ?? ''),
      accountNumber,
      balance: Number(body.balance ?? 0),
    }

    db.customers.push(customer)
    return HttpResponse.json(customer, { status: 201 })
  }),

  http.put(`${API_BASE_URL}/customers/:id`, async ({ params, request }) => {
    const customer = db.customers.find((item) => item.id === Number(params.id))

    if (!customer) {
      return problem({
        status: 404,
        title: 'Resource not found',
        detail: `Customer with id ${String(params.id)} was not found`,
      })
    }

    const body = (await request.json()) as { firstName?: string; lastName?: string }
    customer.firstName = String(body.firstName ?? customer.firstName)
    customer.lastName = String(body.lastName ?? customer.lastName)

    return HttpResponse.json(customer)
  }),

  http.delete(`${API_BASE_URL}/customers/:id`, ({ params }) => {
    const customer = db.customers.find((item) => item.id === Number(params.id))

    if (!customer) {
      return problem({
        status: 404,
        title: 'Resource not found',
        detail: `Customer with id ${String(params.id)} was not found`,
      })
    }

    const hasTransactions = db.transactions.some(
      (transaction) =>
        transaction.senderAccountNumber === customer.accountNumber ||
        transaction.receiverAccountNumber === customer.accountNumber,
    )

    if (hasTransactions) {
      return problem({
        status: 409,
        title: 'Conflict',
        detail: 'Customer with transactions cannot be deleted',
      })
    }

    db.customers = db.customers.filter((item) => item.id !== customer.id)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${API_BASE_URL}/transactions/:accountNumber`, ({ params }) => {
    const accountNumber = String(params.accountNumber)

    if (!findByAccount(accountNumber)) {
      return problem({
        status: 404,
        title: 'Resource not found',
        detail: `Account ${accountNumber} was not found`,
      })
    }

    const transactions = db.transactions
      .filter(
        (transaction) =>
          transaction.senderAccountNumber === accountNumber ||
          transaction.receiverAccountNumber === accountNumber,
      )
      .sort((left, right) => right.timestamp.localeCompare(left.timestamp))

    return HttpResponse.json(transactions)
  }),

  http.post(`${API_BASE_URL}/transactions`, async ({ request }) => {
    const body = (await request.json()) as {
      senderAccountNumber?: string
      receiverAccountNumber?: string
      amount?: number
    }

    const sender = findByAccount(String(body.senderAccountNumber ?? ''))
    const receiver = findByAccount(String(body.receiverAccountNumber ?? ''))
    const amount = Number(body.amount ?? 0)

    if (body.senderAccountNumber === body.receiverAccountNumber) {
      return problem({
        status: 422,
        title: 'Business rule violation',
        detail: 'Sender and receiver accounts must be different',
      })
    }

    if (!sender || !receiver) {
      return problem({
        status: 404,
        title: 'Resource not found',
        detail: `Account ${String(body.senderAccountNumber)} was not found`,
      })
    }

    if (sender.balance < amount) {
      return problem({
        status: 422,
        title: 'Business rule violation',
        detail: `Insufficient funds in account ${sender.accountNumber}`,
      })
    }

    sender.balance = Number((sender.balance - amount).toFixed(2))
    receiver.balance = Number((receiver.balance + amount).toFixed(2))

    const transaction = {
      id: db.nextTransactionId++,
      senderAccountNumber: sender.accountNumber,
      receiverAccountNumber: receiver.accountNumber,
      amount,
      timestamp: '2026-09-15T18:45:12.123456789',
    }

    db.transactions.push(transaction)
    return HttpResponse.json(transaction, { status: 201 })
  }),
]
