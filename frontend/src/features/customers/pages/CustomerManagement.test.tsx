import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { renderApp } from '@/test/render'

async function findCustomerTable() {
  return screen.findByRole('table', { name: 'Customers and their account balances' })
}

describe('customer management', () => {
  it('validates the create form before calling the API', async () => {
    const { user } = renderApp('/customers')

    await user.click(await screen.findByRole('button', { name: 'New customer' }))

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Create customer' }))

    expect(await within(dialog).findByText('First name is required')).toBeInTheDocument()
    expect(within(dialog).getByText('Account number is required')).toBeInTheDocument()
    expect(within(dialog).getByText('Initial balance is required')).toBeInTheDocument()
  })

  it('creates a customer and shows it in the table', async () => {
    const { user } = renderApp('/customers')

    await user.click(await screen.findByRole('button', { name: 'New customer' }))
    const dialog = await screen.findByRole('dialog')

    await user.type(within(dialog).getByLabelText('First name'), 'Sofía')
    await user.type(within(dialog).getByLabelText('Last name'), 'Restrepo')
    await user.type(within(dialog).getByLabelText('Account number'), '4455')
    await user.type(within(dialog).getByLabelText('Initial balance'), '750.25')
    await user.click(within(dialog).getByRole('button', { name: 'Create customer' }))

    const table = await findCustomerTable()
    await waitFor(() => {
      expect(within(table).getByText('Sofía Restrepo')).toBeInTheDocument()
    })
    expect(within(table).getByText('$750.25')).toBeInTheDocument()
  })

  it('maps a duplicate account number to the account field', async () => {
    const { user } = renderApp('/customers')

    await user.click(await screen.findByRole('button', { name: 'New customer' }))
    const dialog = await screen.findByRole('dialog')

    await user.type(within(dialog).getByLabelText('First name'), 'Ana')
    await user.type(within(dialog).getByLabelText('Last name'), 'Díaz')
    await user.type(within(dialog).getByLabelText('Account number'), '1001')
    await user.type(within(dialog).getByLabelText('Initial balance'), '10')
    await user.click(within(dialog).getByRole('button', { name: 'Create customer' }))

    expect(
      await within(dialog).findByText('Account number 1001 is already in use'),
    ).toBeInTheDocument()
  })

  it('renames a customer through the edit dialog', async () => {
    const { user } = renderApp('/customers')

    const table = await findCustomerTable()
    await user.click(within(table).getByRole('button', { name: 'Edit Luis Rojas' }))
    const dialog = await screen.findByRole('dialog')

    expect(within(dialog).getByLabelText('Account number')).toHaveAttribute('readonly')

    const firstName = within(dialog).getByLabelText('First name')
    await user.clear(firstName)
    await user.type(firstName, 'Luisa')
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(within(table).getByText('Luisa Rojas')).toBeInTheDocument()
    })
  })

  it('explains why a customer with transactions cannot be deleted', async () => {
    const { user } = renderApp('/customers')

    const table = await findCustomerTable()
    await user.click(within(table).getByRole('button', { name: 'Delete Ana Díaz' }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Delete customer' }))

    expect(
      await within(dialog).findByText('Customer with transactions cannot be deleted'),
    ).toBeInTheDocument()
  })

  it('deletes a customer without transactions', async () => {
    const { user } = renderApp('/customers')

    await user.click(await screen.findByRole('button', { name: 'New customer' }))
    const createDialog = await screen.findByRole('dialog')
    await user.type(within(createDialog).getByLabelText('First name'), 'Pedro')
    await user.type(within(createDialog).getByLabelText('Last name'), 'Salas')
    await user.type(within(createDialog).getByLabelText('Account number'), '9090')
    await user.type(within(createDialog).getByLabelText('Initial balance'), '10')
    await user.click(within(createDialog).getByRole('button', { name: 'Create customer' }))

    const table = await findCustomerTable()
    await waitFor(() => {
      expect(within(table).getByText('Pedro Salas')).toBeInTheDocument()
    })

    await user.click(within(table).getByRole('button', { name: 'Delete Pedro Salas' }))
    const deleteDialog = await screen.findByRole('dialog')
    await user.click(within(deleteDialog).getByRole('button', { name: 'Delete customer' }))

    await waitFor(() => {
      expect(within(table).queryByText('Pedro Salas')).not.toBeInTheDocument()
    })
  })
})
