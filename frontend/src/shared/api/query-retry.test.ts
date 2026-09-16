import { describe, expect, it } from 'vitest'
import { ApiError } from './api-error'
import { shouldRetryQuery } from './query-retry'

describe('shouldRetryQuery', () => {
  it('never retries client errors', () => {
    const notFound = new ApiError({ status: 404, title: 'Resource not found', detail: 'nope' })
    expect(shouldRetryQuery(0, notFound)).toBe(false)
  })

  it('retries network and server errors twice', () => {
    const offline = new ApiError({ status: 0, title: 'Cannot reach the server', detail: 'offline' })
    expect(shouldRetryQuery(0, offline)).toBe(true)
    expect(shouldRetryQuery(2, offline)).toBe(false)
  })
})
