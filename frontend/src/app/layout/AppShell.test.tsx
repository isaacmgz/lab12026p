import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderApp } from '@/test/render'

describe('AppShell', () => {
  it('renders the brand and the three main destinations', () => {
    renderApp('/customers')

    expect(screen.getAllByText('Lab Bank').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Customers' }).length).toBe(2)
    expect(screen.getAllByRole('link', { name: 'Transfer' }).length).toBe(2)
    expect(screen.getAllByRole('link', { name: 'History' }).length).toBe(2)
  })

  it('marks the current destination for assistive technology', () => {
    renderApp('/transfer')

    const [transferLink] = screen.getAllByRole('link', { name: 'Transfer' })
    expect(transferLink).toHaveAttribute('aria-current', 'page')

    const [customersLink] = screen.getAllByRole('link', { name: 'Customers' })
    expect(customersLink).not.toHaveAttribute('aria-current')
  })

  it('redirects the index route to customers', () => {
    const { router } = renderApp('/')

    expect(router.state.location.pathname).toBe('/customers')
  })
})
