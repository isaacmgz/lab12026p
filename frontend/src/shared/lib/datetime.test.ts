import { describe, expect, it } from 'vitest'
import { parseServerDateTime } from './datetime'

describe('parseServerDateTime', () => {
  it('parses server local date-times without an offset', () => {
    const parsed = parseServerDateTime('2026-09-15T17:26:16.387112387')

    expect(parsed.getFullYear()).toBe(2026)
    expect(parsed.getMonth()).toBe(8)
    expect(parsed.getDate()).toBe(15)
    expect(parsed.getHours()).toBe(17)
    expect(parsed.getMinutes()).toBe(26)
    expect(parsed.getSeconds()).toBe(16)
    expect(parsed.getMilliseconds()).toBe(387)
  })

  it('supports six fractional digits and missing seconds', () => {
    expect(parseServerDateTime('2026-09-15T17:26:16.387112').getMilliseconds()).toBe(387)
    expect(parseServerDateTime('2026-09-15T08:05').getHours()).toBe(8)
  })
})
