import { describe, expect, it } from 'vitest'
import {
  daysUntil, formatDate, formatExperience, formatJobType, formatLocation, formatRoleCategory, formatSalary,
} from '@/lib/utils/careers-format'

describe('careers-format', () => {
  it('formats job type and role category from snake_case', () => {
    expect(formatJobType('full_time')).toBe('Full-time')
    expect(formatJobType('part_time')).toBe('Part-time')
    expect(formatJobType('contract')).toBe('Contract')
    expect(formatJobType(null)).toBe('')
    expect(formatRoleCategory('teaching_faculty')).toBe('Teaching Faculty')
    expect(formatRoleCategory('non_teaching')).toBe('Non Teaching')
  })

  it('formats experience ranges', () => {
    expect(formatExperience(null, null)).toBe('')
    expect(formatExperience(0, null)).toBe('Freshers welcome')
    expect(formatExperience(2, null)).toBe('2+ years')
    expect(formatExperience(1, 5)).toBe('1–5 years')
    expect(formatExperience(3, 3)).toBe('3 years')
    expect(formatExperience(null, 4)).toBe('Up to 4 years')
  })

  it('formats salary or returns null', () => {
    expect(formatSalary(null)).toBeNull()
    expect(formatSalary({ min: 30000, max: 50000, currency: 'INR', duration: 'per_month' })).toBe('₹30,000 – ₹50,000 per month')
    expect(formatSalary({ min: 30000, max: null, currency: 'INR', duration: 'per_month' })).toBe('₹30,000+ per month')
    expect(formatSalary({ min: null, max: null, currency: 'INR', duration: 'per_month' })).toBeNull()
    expect(formatSalary({ min: 1000, max: 2000, currency: 'USD', duration: 'per_year' })).toBe('USD 1,000 – USD 2,000 per year')
  })

  it('formats location from available parts', () => {
    expect(formatLocation({ city: 'Komarapalayam', state: 'Tamil Nadu', country: 'India' })).toBe('Komarapalayam, Tamil Nadu')
    expect(formatLocation({ city: null, state: 'Tamil Nadu', country: 'India' })).toBe('Tamil Nadu')
    expect(formatLocation({ city: null, state: null, country: null })).toBe('')
  })

  it('formats dates and days-until', () => {
    expect(formatDate('2026-09-01T00:00:00Z')).toMatch(/^1 Sept? 2026$/)
    expect(formatDate(null)).toBeNull()
    expect(daysUntil('2026-09-25T00:00:00Z', new Date('2026-09-22T10:00:00Z'))).toBe(3)
    expect(daysUntil(null)).toBeNull()
  })
})
