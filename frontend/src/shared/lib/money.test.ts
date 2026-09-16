import { describe, expect, it } from 'vitest'
import { isMoneyAmount, parseMoney, toAmountInput } from './money'

describe('isMoneyAmount', () => {
  it('accepts positive amounts with up to two decimals', () => {
    expect(isMoneyAmount('0')).toBe(true)
    expect(isMoneyAmount('120.35')).toBe(true)
  })

  it('rejects negatives, letters and more than two decimals', () => {
    expect(isMoneyAmount('-5')).toBe(false)
    expect(isMoneyAmount('12.345')).toBe(false)
    expect(isMoneyAmount('abc')).toBe(false)
    expect(isMoneyAmount('')).toBe(false)
  })
})

describe('parseMoney', () => {
  it('parses trimmed decimal strings', () => {
    expect(parseMoney(' 120.35 ')).toBe(120.35)
  })
})

describe('toAmountInput', () => {
  it('truncates to two decimals instead of rounding up', () => {
    expect(toAmountInput(333.339)).toBe('333.33')
    expect(toAmountInput(500)).toBe('500.00')
  })
})
