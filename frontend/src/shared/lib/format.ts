const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'COP',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
const timeFormatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' })

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatSignedCurrency(value: number) {
  const sign = value < 0 ? '−' : '+'
  return `${sign}${currencyFormatter.format(Math.abs(value))}`
}

export function formatDateTime(value: Date) {
  return dateTimeFormatter.format(value)
}

export function formatDate(value: Date) {
  return dateFormatter.format(value)
}

export function formatTime(value: Date) {
  return timeFormatter.format(value)
}

export function maskAccountNumber(accountNumber: string) {
  return `•••• ${accountNumber.slice(-4)}`
}

export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}
