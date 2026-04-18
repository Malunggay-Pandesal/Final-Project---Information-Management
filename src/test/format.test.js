import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, nextTransNo } from '../utils/format'

describe('formatCurrency', () => {
  it('formats a number as USD', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
  it('returns — for NaN', () => {
    expect(formatCurrency('not-a-number')).toBe('—')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    expect(formatDate('2010-06-27')).toBe('Jun 27, 2010')
  })
  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—')
  })
})

describe('nextTransNo', () => {
  it('increments TR000124 to TR000125', () => {
    expect(nextTransNo('TR000124')).toBe('TR000125')
  })
  it('returns TR000001 when no prior trans', () => {
    expect(nextTransNo(null)).toBe('TR000001')
  })
  it('pads to 6 digits', () => {
    expect(nextTransNo('TR000009')).toBe('TR000010')
  })
})
