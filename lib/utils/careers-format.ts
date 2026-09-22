// lib/utils/careers-format.ts
//
// Pure display helpers for the public careers pages. No React, no env —
// safe to import from server and client components and trivially unit-tested.

import type { PublicJob } from '@/lib/schemas/public-careers'

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
}

const titleCase = (s: string) =>
  s.split('_').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

export function formatJobType(t: string | null): string {
  if (!t) return ''
  return JOB_TYPE_LABELS[t] ?? titleCase(t)
}

export function formatRoleCategory(c: string): string {
  return titleCase(c)
}

export function formatExperience(min: number | null, max: number | null): string {
  if (min === null && max === null) return ''
  if (min !== null && max !== null) return min === max ? `${min} years` : `${min}–${max} years`
  if (min !== null) return min === 0 ? 'Freshers welcome' : `${min}+ years`
  return `Up to ${max} years`
}

const DURATION_LABELS: Record<string, string> = {
  per_month: 'per month',
  per_year: 'per year',
  per_annum: 'per year',
  per_hour: 'per hour',
  per_day: 'per day',
}

function money(amount: number, currency: string): string {
  const n = amount.toLocaleString('en-IN')
  return currency === 'INR' ? `₹${n}` : `${currency} ${n}`
}

export function formatSalary(s: PublicJob['salary']): string | null {
  if (!s || (s.min === null && s.max === null)) return null
  const duration = DURATION_LABELS[s.duration] ?? s.duration.replace(/_/g, ' ')
  if (s.min !== null && s.max !== null) return `${money(s.min, s.currency)} – ${money(s.max, s.currency)} ${duration}`
  if (s.min !== null) return `${money(s.min, s.currency)}+ ${duration}`
  return `Up to ${money(s.max as number, s.currency)} ${duration}`
}

/** City + state; country is implied for an Indian institution group. */
export function formatLocation(j: Pick<PublicJob, 'city' | 'state' | 'country'>): string {
  return [j.city, j.state].filter(Boolean).join(', ')
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
}

export function daysUntil(iso: string | null, now: Date = new Date()): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return null
  return Math.ceil((t - now.getTime()) / 86_400_000)
}
