import { describe, expect, it } from 'vitest'
import { formatCurrency, formatSignedCurrency, maskAccountNumber, normalizeText } from './format'

describe('formatCurrency', () => {
  it('formats amounts with two decimals and a narrow symbol', () => {
    expect(formatCurrency(1234567.5)).toBe('$1,234,567.50')
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('formatSignedCurrency', () => {
  it('prefixes the sign and formats the absolute amount', () => {
    expect(formatSignedCurrency(120.35)).toBe('+$120.35')
    expect(formatSignedCurrency(-120.35)).toBe('−$120.35')
  })
})

describe('maskAccountNumber', () => {
  it('keeps only the last four digits', () => {
    expect(maskAccountNumber('1234567890')).toBe('•••• 7890')
  })
})

describe('normalizeText', () => {
  it('removes diacritics and lowercases', () => {
    expect(normalizeText('Ana Díaz')).toBe('ana diaz')
  })
})
