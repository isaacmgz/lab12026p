import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/shared/api/config'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/render'

describe('CustomersPage', () => {
  it('lists customers with their balances and summary', async () => {
    renderApp('/customers')

    expect(await screen.findByRole('heading', { name: 'Customers' })).toBeInTheDocument()

    const table = await screen.findByRole('table', {
      name: 'Customers and their account balances',
    })
    expect(within(table).getByText('Ana Díaz')).toBeInTheDocument()
    expect(within(table).getByText('$500.00')).toBeInTheDocument()
    expect(within(table).getAllByRole('row')).toHaveLength(4)

    expect(await screen.findByText('$3,100.50')).toBeInTheDocument()
  })

  it('filters customers by name or account number', async () => {
    const { user } = renderApp('/customers')

    const search = await screen.findByLabelText('Search customers')
    await user.type(search, 'rojas')

    const table = screen.getByRole('table', { name: 'Customers and their account balances' })
    await waitFor(() => {
      expect(within(table).getAllByRole('row')).toHaveLength(2)
    })
    expect(within(table).getByText('Luis Rojas')).toBeInTheDocument()
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('shows a recoverable error when the API is unreachable', async () => {
    server.use(http.get(`${API_BASE_URL}/customers`, () => HttpResponse.error()))

    renderApp('/customers')

    expect(await screen.findByText('Could not load customers')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(await screen.findByText('API unreachable')).toBeInTheDocument()
  })
})
