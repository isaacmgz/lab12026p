import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { renderApp } from '@/test/render'

describe('HistoryPage', () => {
  it('asks for a customer when none is selected', async () => {
    renderApp('/history')

    expect(await screen.findByText('Select a customer to see their history')).toBeInTheDocument()
  })

  it('shows signed amounts, counterparty names and totals', async () => {
    renderApp('/history/1')

    const table = await screen.findByRole('table', { name: 'Transaction history' })

    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(3)

    expect(within(table).getByText('Marta Gómez')).toBeInTheDocument()
    expect(within(table).getByText('+$80.00')).toBeInTheDocument()
    expect(within(table).getByText('Luis Rojas')).toBeInTheDocument()
    expect(within(table).getByText('−$120.35')).toBeInTheDocument()

    expect(await screen.findByText('$500.00')).toBeInTheDocument()
  })

  it('filters by direction and keeps it in the URL', async () => {
    const { user, router } = renderApp('/history/1')

    await screen.findByRole('table', { name: 'Transaction history' })
    await user.click(screen.getByRole('radio', { name: 'Incoming' }))

    await waitFor(() => {
      expect(router.state.location.search).toBe('?type=in')
    })

    const table = screen.getByRole('table', { name: 'Transaction history' })
    await waitFor(() => {
      expect(within(table).getAllByRole('row')).toHaveLength(2)
    })
    expect(within(table).queryByText('−$120.35')).not.toBeInTheDocument()
    expect(screen.getByText('1 of 2')).toBeInTheDocument()
  })

  it('resolves the account query parameter coming from a receipt', async () => {
    const { router } = renderApp('/history?account=1002')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/history/2')
    })
    expect(await screen.findByText('Luis Rojas')).toBeInTheDocument()
  })

  it('explains when the customer does not exist', async () => {
    renderApp('/history/999')

    expect(await screen.findByText('Customer not found')).toBeInTheDocument()
  })
})
