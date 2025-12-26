/**
 * Date Presets Utility
 * Functions for handling analytics date range presets
 */

import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  differenceInDays,
  format
} from 'date-fns'
import type { DatePreset, DateRange, DateRangeParams } from './types'

/**
 * Get date range from a preset
 */
export function getDateRangeFromPreset(preset: DatePreset): DateRange {
  const now = new Date()

  switch (preset) {
    case 'today':
      return {
        from: startOfDay(now),
        to: endOfDay(now),
        preset
      }

    case 'last_7_days':
      return {
        from: startOfDay(subDays(now, 6)),
        to: endOfDay(now),
        preset
      }

    case 'last_30_days':
      return {
        from: startOfDay(subDays(now, 29)),
        to: endOfDay(now),
        preset
      }

    case 'this_month':
      return {
        from: startOfMonth(now),
        to: endOfDay(now),
        preset
      }

    case 'last_month':
      const lastMonth = subMonths(now, 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
        preset
      }

    default:
      // Default to last 30 days
      return {
        from: startOfDay(subDays(now, 29)),
        to: endOfDay(now),
        preset: 'last_30_days'
      }
  }
}

/**
 * Convert DateRange to query params for server actions
 */
export function dateRangeToParams(range: DateRange): DateRangeParams {
  const daysDiff = differenceInDays(range.to, range.from)

  // Determine groupBy based on date range span
  let groupBy: 'day' | 'week' | 'month' = 'day'
  if (daysDiff > 90) {
    groupBy = 'month'
  } else if (daysDiff > 30) {
    groupBy = 'week'
  }

  return {
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    groupBy
  }
}

/**
 * Get preset from URL query params
 */
export function getPresetFromParams(searchParams: URLSearchParams): DatePreset {
  const preset = searchParams.get('preset') as DatePreset | null

  if (preset && isValidPreset(preset)) {
    return preset
  }

  return 'last_30_days' // Default preset
}

/**
 * Check if a string is a valid date preset
 */
export function isValidPreset(value: string): value is DatePreset {
  return ['today', 'last_7_days', 'last_30_days', 'this_month', 'last_month'].includes(value)
}

/**
 * Get display label for a preset
 */
export function getPresetLabel(preset: DatePreset): string {
  const labels: Record<DatePreset, string> = {
    today: 'Today',
    last_7_days: 'Last 7 Days',
    last_30_days: 'Last 30 Days',
    this_month: 'This Month',
    last_month: 'Last Month'
  }

  return labels[preset] || 'Last 30 Days'
}

/**
 * Get all available presets with labels
 */
export function getAllPresets(): Array<{ value: DatePreset; label: string }> {
  return [
    { value: 'today', label: 'Today' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' }
  ]
}

/**
 * Format date range for display
 */
export function formatDateRange(range: DateRange): string {
  const fromStr = format(range.from, 'MMM d, yyyy')
  const toStr = format(range.to, 'MMM d, yyyy')

  if (fromStr === toStr) {
    return fromStr
  }

  return `${fromStr} - ${toStr}`
}

/**
 * Determine the appropriate groupBy based on date range
 */
export function getGroupByFromRange(range: DateRange): 'day' | 'week' | 'month' {
  const daysDiff = differenceInDays(range.to, range.from)

  if (daysDiff <= 14) {
    return 'day'
  } else if (daysDiff <= 90) {
    return 'week'
  } else {
    return 'month'
  }
}

/**
 * Get comparison period for trend calculation
 * Returns the previous period of the same length
 */
export function getComparisonPeriod(range: DateRange): DateRange {
  const daysDiff = differenceInDays(range.to, range.from) + 1

  return {
    from: subDays(range.from, daysDiff),
    to: subDays(range.to, daysDiff),
    preset: range.preset
  }
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): {
  value: number
  direction: 'up' | 'down' | 'neutral'
} {
  if (previous === 0) {
    return {
      value: current > 0 ? 100 : 0,
      direction: current > 0 ? 'up' : 'neutral'
    }
  }

  const change = ((current - previous) / previous) * 100

  return {
    value: Math.abs(Math.round(change * 10) / 10),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  }
}

/**
 * Format a number for display in analytics
 */
export function formatAnalyticsNumber(value: number, format: 'number' | 'percentage' | 'currency' = 'number'): string {
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`

    case 'currency':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(value)

    case 'number':
    default:
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
      }
      return value.toLocaleString()
  }
}
