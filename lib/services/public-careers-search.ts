// lib/services/public-careers-search.ts
//
// Server-side view model for /careers. One cached MyJKKN feed request serves
// every search, filter and job-slug lookup on this deployment: the feed is
// fetched whole (Next data cache, 300s), indexed once per process for the same
// 300s, and everything else is in-memory work on that index.
// Server-only — never import from a 'use client' file.
// Spec: docs/superpowers/specs/2026-10-05-careers-search-and-ux-design.md

import type { PublicJob } from '@/lib/schemas/public-careers'
import { getCareersInstitutionId, getMyJkknBaseUrl, listPublicJobs } from '@/lib/services/public-careers-api'
import {
  FACET_KEYS, applyFilters, categoryLabel, canonicalCity, computeFacets, qualificationSummary,
  type Facet, type FacetKey, type FacetSelection,
} from '@/lib/utils/careers-facets'
import { formatExperience, formatJobType } from '@/lib/utils/careers-format'
import { careersHref, type CareersQuery, type SortKey } from '@/lib/utils/careers-params'
import {
  buildIndex, parseQuery, relatedJobs, search, sortHits,
  type CareersIndex, type IndexedJob, type MatchReason, type SearchHit, type SearchResult,
} from '@/lib/utils/careers-search'
import { findJobBySlug } from '@/lib/utils/careers-slug'
import type { SuggestItem } from '@/lib/utils/careers-suggest'
import { slugify } from '@/lib/utils/careers-text'

export const PAGE_SIZE = 24
const INDEX_TTL_MS = 300_000
const NEW_DAYS = 7
const RECENT_DAYS = 30

// ── Site-wide data (cached) ─────────────────────────────────────────────────

export interface PopularSearch { label: string; href: string }
export interface CategoryTile { value: string; label: string; count: number; href: string }

export interface SiteCareers {
  index: CareersIndex
  suggestions: SuggestItem[]
  popular: PopularSearch[]
  categories: CategoryTile[]
}

// Curated starting points; each is shown only while it returns jobs on this site.
const POPULAR_CANDIDATES: Array<{ label: string; q?: string; filters?: Partial<FacetSelection> }> = [
  { label: 'Assistant Professor', q: 'Assistant Professor' },
  { label: 'Professor', q: 'Professor' },
  { label: 'Computer Science', q: 'Computer Science' },
  { label: 'Engineering', q: 'Engineering' },
  { label: 'Nursing', q: 'Nursing' },
  { label: 'Pharmacy', q: 'Pharmacy' },
  { label: 'Dental', q: 'Dental' },
  { label: 'HR', q: 'HR' },
  { label: 'Administration', q: 'Administration' },
  { label: 'Freshers', filters: { experience: ['fresher'] } },
  { label: 'Lab Technician', q: 'Lab Technician' },
]
const MAX_POPULAR = 8
const CATEGORY_ORDER = ['teaching_faculty', 'non_teaching', 'senior_leadership']

function buildSuggestions(index: CareersIndex): SuggestItem[] {
  const roles = new Map<string, { label: string; count: number }>()
  for (const item of index.jobs) {
    const key = item.title.toLowerCase()
    const entry = roles.get(key) ?? { label: item.title, count: 0 }
    entry.count += 1
    roles.set(key, entry)
  }
  const items: SuggestItem[] = [...roles.values()].map(r => ({
    type: 'role', label: r.label, count: r.count,
  }))

  // Suggest types double as their filter keys (see suggestHref).
  const fromFacet = (key: Exclude<SuggestItem['type'], 'role'>) => {
    const type = key
    const counts = new Map<string, number>()
    for (const item of index.jobs) for (const v of item.facets[key]) counts.set(v, (counts.get(v) ?? 0) + 1)
    for (const [value, count] of counts) {
      items.push({ type, label: index.labels[key].get(value) ?? value, count, value })
    }
  }
  fromFacet('department')
  fromFacet('qualification')
  // On a college site every job shares one institution — suggesting it is noise.
  if (index.labels.institution.size > 1) fromFacet('institution')
  return items
}

function buildPopular(index: CareersIndex): PopularSearch[] {
  const out: PopularSearch[] = []
  for (const c of POPULAR_CANDIDATES) {
    const count = c.q
      ? (r => (r.mode === 'all' ? r.hits.length : 0))(search(index, parseQuery(c.q)))
      : index.jobs.filter(i => FACET_KEYS.every(k => !c.filters?.[k]?.length || c.filters[k]!.some(v => i.facets[k].includes(v)))).length
    if (count > 0) out.push({ label: c.label, href: careersHref({ q: c.q, filters: c.filters }) })
    if (out.length === MAX_POPULAR) break
  }
  return out
}

function buildCategories(index: CareersIndex): CategoryTile[] {
  const counts = new Map<string, number>()
  for (const item of index.jobs) counts.set(item.job.role_category, (counts.get(item.job.role_category) ?? 0) + 1)
  const rank = (v: string) => { const i = CATEGORY_ORDER.indexOf(v); return i === -1 ? CATEGORY_ORDER.length : i }
  return [...counts]
    .map(([value, count]) => ({ value, count, label: categoryLabel(value), href: careersHref({ filters: { category: [value] } }) }))
    .sort((a, b) => rank(a.value) - rank(b.value) || b.count - a.count)
}

export function buildSiteCareers(jobs: PublicJob[], now: Date = new Date()): SiteCareers {
  const index = buildIndex(jobs, now)
  return {
    index,
    suggestions: buildSuggestions(index),
    popular: buildPopular(index),
    categories: buildCategories(index),
  }
}

let cached: { key: string; at: number; value: Promise<SiteCareers> } | null = null

/**
 * The indexed feed for this deployment. Throws when MyJKKN is unreachable so
 * callers can tell an outage from an empty board.
 */
export function getSiteCareers(fetchImpl: typeof fetch = fetch): Promise<SiteCareers> {
  const institutionId = getCareersInstitutionId()
  const key = `${getMyJkknBaseUrl()}|${institutionId ?? '*'}`
  const now = Date.now()
  if (cached && cached.key === key && now - cached.at < INDEX_TTL_MS) return cached.value

  const value = listPublicJobs({ institutionId }, fetchImpl).then(res => buildSiteCareers(res.data))
  const entry = { key, at: now, value }
  cached = entry
  // A failed build must not be served for the next five minutes.
  value.catch(() => { if (cached === entry) cached = null })
  return value
}

/** Test hook. */
export function resetCareersCache(): void {
  cached = null
}

// ── Listing view ────────────────────────────────────────────────────────────

export interface JobCardData {
  id: string
  slug: string
  title: string
  category: string
  jobType: string
  institution: string | null
  department: string | null
  location: string
  experience: string
  qualification: string
  openings: number
  /** "Posted 3 days ago" for the last 30 days; empty for older or undated jobs. */
  postedLabel: string
  isNew: boolean
  /** Why this job matched the search; null when browsing. */
  matchLabel: string | null
}

export interface ActiveFilter { key: FacetKey; value: string; label: string }

export interface CareersView {
  /** every open job on this site, before search and filters */
  totalOpen: number
  /** jobs matching search + filters */
  total: number
  /** jobs matching the search alone — tells a no-result page whether filters are to blame */
  totalBeforeFilters: number
  mode: SearchResult['mode']
  jobs: JobCardData[]
  page: number
  pageCount: number
  sort: SortKey
  sortOptions: SortKey[]
  facets: Facet[]
  activeFilters: ActiveFilter[]
  /** the query as applied (legacy parameters folded in, page clamped) */
  query: CareersQuery
  searchedTerms: number
  corrections: Record<string, string>
}

const REASON_LABELS: Record<Exclude<MatchReason, 'partial' | null>, string> = {
  strong: 'Strong match',
  qualification: 'Matches your qualification',
  skills: 'Matches your skills',
  description: 'Mentioned in the job description',
}

function postedInfo(postedTime: number, now: number): { postedLabel: string; isNew: boolean } {
  if (!postedTime || postedTime > now) return { postedLabel: '', isNew: false }
  const days = Math.floor((now - postedTime) / 86_400_000)
  if (days > RECENT_DAYS) return { postedLabel: '', isNew: false }
  const postedLabel = days === 0 ? 'Posted today' : days === 1 ? 'Posted yesterday' : `Posted ${days} days ago`
  return { postedLabel, isNew: days <= NEW_DAYS }
}

export function toCard(item: IndexedJob, now: number, hit?: SearchHit, termCount = 0): JobCardData {
  const { job } = item
  let matchLabel: string | null = null
  if (hit && termCount > 0) {
    matchLabel = hit.reason === 'partial'
      ? `Matches ${hit.matchedTerms} of ${termCount} words`
      : hit.reason ? REASON_LABELS[hit.reason] : null
  }
  return {
    id: job.id,
    slug: item.slug,
    title: item.title,
    category: categoryLabel(job.role_category),
    jobType: formatJobType(job.job_type),
    institution: job.institution?.name ?? null,
    department: job.department?.name ?? null,
    location: [canonicalCity(job.city), job.state].filter(Boolean).join(', '),
    experience: formatExperience(job.min_experience_years, job.max_experience_years),
    qualification: qualificationSummary(job),
    openings: job.positions_open,
    matchLabel,
    ...postedInfo(item.postedTime, now),
  }
}

export function buildCareersView(site: SiteCareers, input: CareersQuery, now: number = Date.now()): CareersView {
  const { index } = site

  // Links from before v3 identify the institution by MyJKKN uuid.
  const filters: FacetSelection = { ...input.filters }
  if (input.legacyInstitutionId && filters.institution.length === 0) {
    const name = index.jobs.find(i => i.job.institution?.id === input.legacyInstitutionId)?.job.institution?.name
    if (name) filters.institution = [slugify(name)]
  }

  const parsed = parseQuery(input.q)
  const result = search(index, parsed)
  const matchedItems = result.hits.map(h => h.item)
  const allowed = new Set(applyFilters(matchedItems, filters))
  const hits = result.hits.filter(h => allowed.has(h.item))

  const searching = parsed.terms.length > 0
  const sort: SortKey = input.sort && (input.sort !== 'relevance' || searching) ? input.sort : searching ? 'relevance' : 'newest'
  const ordered = sortHits(hits, sort)

  const pageCount = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE))
  const page = Math.min(input.page, pageCount)
  const pageHits = ordered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilters: ActiveFilter[] = FACET_KEYS.flatMap(key =>
    filters[key].map(value => ({ key, value, label: index.labels[key].get(value) ?? value })))

  return {
    totalOpen: index.jobs.length,
    total: ordered.length,
    totalBeforeFilters: result.hits.length,
    mode: ordered.length === 0 ? 'none' : result.mode,
    jobs: pageHits.map(h => toCard(h.item, now, h, parsed.terms.length)),
    page,
    pageCount,
    sort,
    sortOptions: searching ? ['relevance', 'newest', 'oldest', 'title'] : ['newest', 'oldest', 'title'],
    facets: computeFacets(index.jobs, matchedItems, filters, index.labels),
    activeFilters,
    query: { ...input, filters, page, legacyInstitutionId: null },
    searchedTerms: parsed.terms.length,
    corrections: result.corrections,
  }
}

// ── Job page helpers ────────────────────────────────────────────────────────

/** The open job a slug points at, plus its current slug (they differ after a retitle). */
export function findJobInSite(site: SiteCareers, slug: string): IndexedJob | null {
  const job = findJobBySlug(site.index.jobs.map(i => i.job), slug)
  return job ? site.index.jobs.find(i => i.job === job) ?? null : null
}

export function relatedJobCards(site: SiteCareers, jobId: string, limit = 4, now: number = Date.now()): JobCardData[] {
  return relatedJobs(site.index, jobId, limit).map(item => toCard(item, now))
}
