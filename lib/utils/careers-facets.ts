// lib/utils/careers-facets.ts
//
// Filter model for the careers listing. Every filter value is derived from the
// PublicJob fields MyJKKN already sends — nothing is stored on this site.
//
// Two rules shape the UI (spec §4.5):
//   - a filter group is offered only when the site's jobs have 2+ values for it,
//     so a board that is 100% full-time in one town shows no Job type/Location;
//   - counts are "disjunctive": a group's counts ignore that group's own
//     selection, so ticking one department doesn't zero out the others.

import type { PublicJob } from '@/lib/schemas/public-careers'
import { formatJobType } from '@/lib/utils/careers-format'
import { slugify } from '@/lib/utils/careers-text'

export const FACET_KEYS = [
  'category', 'institution', 'department', 'experience', 'qualification', 'job_type', 'location', 'posted',
] as const
export type FacetKey = (typeof FACET_KEYS)[number]
export type FacetSelection = Record<FacetKey, string[]>

export const FACET_LABELS: Record<FacetKey, string> = {
  category: 'Category',
  institution: 'Institution',
  department: 'Department',
  experience: 'Your experience',
  qualification: 'Qualification',
  job_type: 'Job type',
  location: 'Location',
  posted: 'Posted',
}

/** Single-choice groups render as radios; the rest as checkboxes. */
export const SINGLE_SELECT: ReadonlySet<FacetKey> = new Set<FacetKey>(['experience', 'posted'])

export function emptySelection(): FacetSelection {
  return {
    category: [], institution: [], department: [], experience: [], qualification: [], job_type: [], location: [], posted: [],
  }
}

export function hasSelection(sel: FacetSelection): boolean {
  return FACET_KEYS.some(k => sel[k].length > 0)
}

// ── Category ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  teaching_faculty: 'Teaching',
  non_teaching: 'Non-teaching',
  senior_leadership: 'Leadership',
  medical: 'Medical',
}
const CATEGORY_ORDER = ['teaching_faculty', 'non_teaching', 'senior_leadership', 'medical']

export function categoryLabel(roleCategory: string): string {
  return CATEGORY_LABELS[roleCategory]
    ?? roleCategory.split('_').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

// ── Location ────────────────────────────────────────────────────────────────

// MyJKKN holds two spellings of the campus town; the site uses the first.
const CITY_ALIASES: Record<string, string> = { kumarapalayam: 'Komarapalayam', komarapalayam: 'Komarapalayam' }

export function canonicalCity(city: string | null): string | null {
  const trimmed = city?.trim()
  if (!trimmed) return null
  return CITY_ALIASES[trimmed.toLowerCase()] ?? trimmed
}

// ── Experience ──────────────────────────────────────────────────────────────

interface ExperienceBucket { value: string; label: string; min: number; max: number }

/** [min, max) in years of the candidate's own experience. */
export const EXPERIENCE_BUCKETS: ExperienceBucket[] = [
  { value: 'fresher', label: 'Fresher', min: 0, max: 0 },
  { value: '0-2', label: '0–2 years', min: 0, max: 2 },
  { value: '2-5', label: '2–5 years', min: 2, max: 5 },
  { value: '5-10', label: '5–10 years', min: 5, max: 10 },
  { value: '10-plus', label: '10+ years', min: 10, max: Infinity },
]

/**
 * Buckets whose candidates fall inside the job's stated range. Unknown range → none.
 * A shared endpoint is not an overlap: a "0–5 years" post belongs under 2–5,
 * not under 5–10, even though someone with exactly five years fits both.
 */
export function experienceBuckets(min: number | null, max: number | null): string[] {
  if (min === null && max === null) return []
  const lo = min ?? 0
  const hi = max ?? Infinity
  return EXPERIENCE_BUCKETS
    .filter(b => (b.value === 'fresher' ? lo === 0 : lo < b.max && (hi > b.min || (lo === hi && lo === b.min))))
    .map(b => b.value)
}

// ── Qualification ───────────────────────────────────────────────────────────

interface QualificationTag { value: string; label: string; test: RegExp }

// Matched against HR's free text ("M.E. / M.Tech in CSE", "M.Sc., Ph.D").
// Two-letter degrees are case-sensitive so "must be" never reads as B.E.
export const QUALIFICATION_TAGS: QualificationTag[] = [
  { value: 'phd', label: 'Ph.D', test: /\bPh\.?\s?D\b|\bdoctorate\b/i },
  { value: 'me-mtech', label: 'M.E / M.Tech', test: /\bM\.?\s?E\b|\b[Mm]\.?\s?[Tt]ech\b/ },
  { value: 'be-btech', label: 'B.E / B.Tech', test: /\bB\.?\s?E\b|\b[Bb]\.?\s?[Tt]ech\b/ },
  { value: 'mba', label: 'MBA', test: /\bM\.?\s?B\.?\s?A\b/i },
  { value: 'mca', label: 'MCA', test: /\bM\.?\s?C\.?\s?A\b/i },
  { value: 'mds', label: 'MDS', test: /\bM\.?\s?D\.?\s?S\b/i },
  { value: 'bds', label: 'BDS', test: /\bB\.?\s?D\.?\s?S\b/i },
  { value: 'mbbs', label: 'MBBS', test: /\bM\.?B\.?B\.?S\b/i },
  { value: 'mpharm', label: 'M.Pharm', test: /\bM\.?\s?Pharm/i },
  { value: 'bpharm', label: 'B.Pharm', test: /\bB\.?\s?Pharm/i },
  { value: 'pharmd', label: 'Pharm.D', test: /\bPharm\.?\s?D\b/i },
  { value: 'msc', label: 'M.Sc', test: /\bM\.?\s?Sc\b/i },
  { value: 'bsc', label: 'B.Sc', test: /\bB\.?\s?Sc\b/i },
  { value: 'ma', label: 'M.A', test: /\bM\.?\s?A\b/ },
  { value: 'ba', label: 'B.A', test: /\bB\.?\s?A\b/ },
  { value: 'mcom', label: 'M.Com', test: /\bM\.?\s?Com\b/i },
  { value: 'bcom', label: 'B.Com', test: /\bB\.?\s?Com\b/i },
  { value: 'med', label: 'M.Ed', test: /\bM\.?\s?Ed\b/ },
  { value: 'bed', label: 'B.Ed', test: /\bB\.?\s?Ed\b/ },
  { value: 'mphil', label: 'M.Phil', test: /\bM\.?\s?Phil\b/i },
  { value: 'diploma', label: 'Diploma', test: /\bdiploma\b/i },
  { value: 'iti', label: 'ITI', test: /\bITI\b/ },
]

export function qualificationTags(job: Pick<PublicJob, 'qualifications' | 'education_level'>): string[] {
  const text = job.qualifications.join(' ; ')
  const tags = QUALIFICATION_TAGS.filter(t => t.test.test(text)).map(t => t.value)
  if (job.education_level === 'phd' && !tags.includes('phd')) tags.push('phd')
  return tags
}

const QUALIFICATION_LABEL = new Map(QUALIFICATION_TAGS.map(t => [t.value, t.label]))

/** Card line: recognised degrees, else HR's first line as written. */
export function qualificationSummary(job: Pick<PublicJob, 'qualifications' | 'education_level'>): string {
  const labels = qualificationTags(job).slice(0, 3).map(v => QUALIFICATION_LABEL.get(v) as string)
  return labels.length ? labels.join(' / ') : (job.qualifications[0] ?? '')
}

// ── Posted ──────────────────────────────────────────────────────────────────

const POSTED_BUCKETS = [
  { value: '1', label: 'Today', days: 1 },
  { value: '3', label: 'Last 3 days', days: 3 },
  { value: '7', label: 'Last 7 days', days: 7 },
  { value: '30', label: 'Last 30 days', days: 30 },
]

export function postedBuckets(postedAt: string | null, now: Date): string[] {
  if (!postedAt) return []
  const age = (now.getTime() - new Date(postedAt).getTime()) / 86_400_000
  if (Number.isNaN(age) || age < 0) return []
  return POSTED_BUCKETS.filter(b => age <= b.days).map(b => b.value)
}

// ── Per-job values ──────────────────────────────────────────────────────────

export type FacetValues = Record<FacetKey, string[]>

export function deriveFacetValues(job: PublicJob, now: Date): FacetValues {
  const city = canonicalCity(job.city)
  return {
    category: [job.role_category],
    institution: job.institution ? [slugify(job.institution.name)] : [],
    department: job.department ? [slugify(job.department.name)] : [],
    experience: experienceBuckets(job.min_experience_years, job.max_experience_years),
    qualification: qualificationTags(job),
    job_type: job.job_type ? [job.job_type] : [],
    location: city ? [slugify(city)] : [],
    posted: postedBuckets(job.posted_at, now),
  }
}

/** value → human label for the open-ended groups, collected while indexing. */
export type FacetLabelMap = Record<FacetKey, Map<string, string>>

export function collectLabels(jobs: PublicJob[]): FacetLabelMap {
  const labels = Object.fromEntries(FACET_KEYS.map(k => [k, new Map<string, string>()])) as FacetLabelMap
  for (const b of EXPERIENCE_BUCKETS) labels.experience.set(b.value, b.label)
  for (const t of QUALIFICATION_TAGS) labels.qualification.set(t.value, t.label)
  for (const b of POSTED_BUCKETS) labels.posted.set(b.value, b.label)
  for (const job of jobs) {
    labels.category.set(job.role_category, categoryLabel(job.role_category))
    if (job.institution) labels.institution.set(slugify(job.institution.name), job.institution.name)
    if (job.department) labels.department.set(slugify(job.department.name), job.department.name)
    if (job.job_type) labels.job_type.set(job.job_type, formatJobType(job.job_type))
    const city = canonicalCity(job.city)
    if (city) labels.location.set(slugify(city), city)
  }
  return labels
}

// ── Filtering and counting ──────────────────────────────────────────────────

interface Faceted { facets: FacetValues }

function matchesGroup(values: string[], selected: string[]): boolean {
  return selected.length === 0 || selected.some(v => values.includes(v))
}

/** OR inside a group, AND across groups. `except` skips one group (for its own counts). */
export function applyFilters<T extends Faceted>(jobs: T[], sel: FacetSelection, except?: FacetKey): T[] {
  const active = FACET_KEYS.filter(k => k !== except && sel[k].length > 0)
  if (active.length === 0) return jobs
  return jobs.filter(j => active.every(k => matchesGroup(j.facets[k], sel[k])))
}

export interface FacetOption { value: string; label: string; count: number; selected: boolean }
export interface Facet { key: FacetKey; label: string; single: boolean; options: FacetOption[] }

const FIXED_ORDER: Partial<Record<FacetKey, string[]>> = {
  category: CATEGORY_ORDER,
  experience: EXPERIENCE_BUCKETS.map(b => b.value),
  posted: POSTED_BUCKETS.map(b => b.value),
}

function countValues<T extends Faceted>(jobs: T[], key: FacetKey): Map<string, number> {
  const counts = new Map<string, number>()
  for (const j of jobs) for (const v of j.facets[key]) counts.set(v, (counts.get(v) ?? 0) + 1)
  return counts
}

/**
 * @param siteJobs  every job on this site — decides which groups exist at all
 * @param matched   jobs matching the text search, before filters — drives counts
 */
export function computeFacets<T extends Faceted>(
  siteJobs: T[],
  matched: T[],
  sel: FacetSelection,
  labels: FacetLabelMap,
): Facet[] {
  const facets: Facet[] = []
  for (const key of FACET_KEYS) {
    const siteCounts = countValues(siteJobs, key)
    if (siteCounts.size < 2) continue

    const counts = countValues(applyFilters(matched, sel, key), key)
    const order = FIXED_ORDER[key]
    const options = [...siteCounts.keys()]
      .map(value => ({
        value,
        label: labels[key].get(value) ?? value,
        count: counts.get(value) ?? 0,
        selected: sel[key].includes(value),
      }))
      .filter(o => o.count > 0 || o.selected)
      .sort((a, b) => order
        ? order.indexOf(a.value) - order.indexOf(b.value)
        : b.count - a.count || a.label.localeCompare(b.label))
    if (options.length > 0) facets.push({ key, label: FACET_LABELS[key], single: SINGLE_SELECT.has(key), options })
  }
  return facets
}
