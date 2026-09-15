import { create } from 'axios'
import { toApiError } from './api-error'
import { API_BASE_URL } from './config'

export const http = create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    Accept: 'application/json, application/problem+json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
)
