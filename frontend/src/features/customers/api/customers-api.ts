import { http } from '@/shared/api/http'
import type { CreateCustomerPayload, Customer, UpdateCustomerPayload } from '../model/customer'

export async function listCustomers() {
  const { data } = await http.get<Customer[]>('/customers')
  return data
}

export async function getCustomer(id: number) {
  const { data } = await http.get<Customer>(`/customers/${id}`)
  return data
}

export async function createCustomer(payload: CreateCustomerPayload) {
  const { data } = await http.post<Customer>('/customers', payload)
  return data
}

export async function updateCustomer(id: number, payload: UpdateCustomerPayload) {
  const { data } = await http.put<Customer>(`/customers/${id}`, payload)
  return data
}

export async function deleteCustomer(id: number) {
  await http.delete(`/customers/${id}`)
}
