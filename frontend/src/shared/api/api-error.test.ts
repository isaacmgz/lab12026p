import { describe, expect, it } from 'vitest'
import { http as mswHttp, HttpResponse } from 'msw'
import { ApiError, toApiError } from './api-error'
import { API_BASE_URL } from './config'
import { http } from './http'
import { server } from '@/test/msw/server'

describe('toApiError', () => {
  it('reads problem details returned by the API', async () => {
    server.use(
      mswHttp.post(`${API_BASE_URL}/customers`, () =>
        HttpResponse.json(
          {
            type: 'about:blank',
            title: 'Validation failed',
            status: 400,
            detail: 'One or more fields are invalid.',
            errors: { accountNumber: 'Account number must contain 4 to 20 digits', balance: 12 },
          },
          { status: 400, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    )

    const error = await http.post('/customers', {}).catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    const apiError = error as ApiError
    expect(apiError.status).toBe(400)
    expect(apiError.title).toBe('Validation failed')
    expect(apiError.detail).toBe('One or more fields are invalid.')
    expect(apiError.fieldErrors).toEqual({
      accountNumber: 'Account number must contain 4 to 20 digits',
    })
  })

  it('explains that the API is unreachable on network failures', async () => {
    server.use(mswHttp.get(`${API_BASE_URL}/customers`, () => HttpResponse.error()))

    const error = (await http.get('/customers').catch((caught: unknown) => caught)) as ApiError

    expect(error.isNetworkError).toBe(true)
    expect(error.detail).toContain('Make sure the API is running')
  })

  it('falls back to a status title when the body is not a problem document', async () => {
    server.use(
      mswHttp.get(`${API_BASE_URL}/customers/9`, () => new HttpResponse(null, { status: 404 })),
    )

    const error = (await http.get('/customers/9').catch((caught: unknown) => caught)) as ApiError

    expect(error.isNotFound).toBe(true)
    expect(error.title).toBe('Resource not found')
  })

  it('keeps unknown errors readable', () => {
    expect(toApiError(new Error('boom')).detail).toBe('boom')
  })
})
