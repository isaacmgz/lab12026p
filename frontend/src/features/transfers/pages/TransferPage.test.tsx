import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/shared/api/config'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/render'

describe('TransferPage', () => {
  it('prevents choosing the sender as the receiver', async () => {
    const { user } = renderApp('/transfer')

    const from = await screen.findByLabelText('From account')
    await user.selectOptions(from, '1001')

    const to = screen.getByLabelText('To account')
    const sameAccountOption = within(to).getByRole('option', { name: /1001/ })

    await waitFor(() => {
      expect(sameAccountOption).toBeDisabled()
    })
    expect(within(to).getByRole('option', { name: /1002/ })).toBeEnabled()
  })

  it('blocks amounts above the sender balance before calling the API', async () => {
    const { user } = renderApp('/transfer')

    await user.selectOptions(await screen.findByLabelText('From account'), '1002')
    await user.selectOptions(screen.getByLabelText('To account'), '1001')
    await user.type(screen.getByLabelText('Amount'), '900')
    await user.click(screen.getByRole('button', { name: 'Review transfer' }))

    expect(
      await screen.findByText('Amount exceeds the available balance of $100.50'),
    ).toBeInTheDocument()
  })

  it('prefills the sender from the query string and completes a transfer', async () => {
    const { user } = renderApp('/transfer?from=1001')

    const from = await screen.findByLabelText('From account')
    await waitFor(() => {
      expect(from).toHaveValue('1001')
    })

    await user.selectOptions(screen.getByLabelText('To account'), '1002')
    await user.type(screen.getByLabelText('Amount'), '120.35')
    await user.click(screen.getByRole('button', { name: 'Review transfer' }))

    expect(await screen.findByText('Review and confirm')).toBeInTheDocument()
    expect(screen.getAllByText('$120.35').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Confirm transfer' }))

    expect(await screen.findByRole('heading', { name: 'Transfer completed' })).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View sender history' })).toHaveAttribute(
      'href',
      '/history?account=1001',
    )
  })

  it('shows the server message when the API rejects the transfer', async () => {
    server.use(
      http.post(`${API_BASE_URL}/transactions`, () =>
        HttpResponse.json(
          {
            type: 'about:blank',
            title: 'Business rule violation',
            status: 422,
            detail: 'Insufficient funds in account 1001',
          },
          { status: 422, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    )

    const { user } = renderApp('/transfer')

    await user.selectOptions(await screen.findByLabelText('From account'), '1001')
    await user.selectOptions(screen.getByLabelText('To account'), '1002')
    await user.type(screen.getByLabelText('Amount'), '100')
    await user.click(screen.getByRole('button', { name: 'Review transfer' }))
    await user.click(await screen.findByRole('button', { name: 'Confirm transfer' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Insufficient funds in account 1001')
  })
})
