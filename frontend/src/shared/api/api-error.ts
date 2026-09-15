import { isAxiosError } from 'axios'
import { API_URL } from './config'

export interface ApiErrorOptions {
  status: number
  title: string
  detail: string
  fieldErrors?: Record<string, string>
}

export class ApiError extends Error {
  readonly status: number
  readonly title: string
  readonly detail: string
  readonly fieldErrors: Record<string, string>

  constructor(options: ApiErrorOptions) {
    super(options.detail)
    this.name = 'ApiError'
    this.status = options.status
    this.title = options.title
    this.detail = options.detail
    this.fieldErrors = options.fieldErrors ?? {}
  }

  get isNetworkError() {
    return this.status === 0
  }

  get isNotFound() {
    return this.status === 404
  }

  get isConflict() {
    return this.status === 409
  }
}

const statusTitles: Record<number, string> = {
  400: 'Validation failed',
  404: 'Resource not found',
  409: 'Conflict',
  422: 'Business rule violation',
  500: 'Internal server error',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readFieldErrors(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    return {}
  }

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  )

  return Object.fromEntries(entries)
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (isAxiosError(error)) {
    const response = error.response

    if (response) {
      const data: unknown = response.data
      const problem = isRecord(data) ? data : {}
      const title = typeof problem.title === 'string' ? problem.title : undefined
      const detail = typeof problem.detail === 'string' ? problem.detail : undefined

      return new ApiError({
        status: response.status,
        title: title ?? statusTitles[response.status] ?? 'Request failed',
        detail:
          detail ??
          (typeof data === 'string' && data.trim().length > 0
            ? data
            : 'The server could not process the request.'),
        fieldErrors: readFieldErrors(problem.errors),
      })
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError({
        status: 0,
        title: 'Request timed out',
        detail: 'The server took too long to respond. Please try again.',
      })
    }

    return new ApiError({
      status: 0,
      title: 'Cannot reach the server',
      detail: `Cannot reach the server at ${API_URL}. Make sure the API is running.`,
    })
  }

  return new ApiError({
    status: 0,
    title: 'Unexpected error',
    detail: error instanceof Error ? error.message : 'Something went wrong.',
  })
}

export function getErrorMessage(error: unknown) {
  return toApiError(error).detail
}
