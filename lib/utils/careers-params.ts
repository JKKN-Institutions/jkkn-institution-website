// lib/utils/careers-params.ts
//
// The careers listing keeps all of its state in the URL (spec §4.6) so a
// search survives refresh, Back and sharing. This module is the only place
// that reads or writes those parameters; server and client both import it.
//
//   /careers?q=python+teaching&department=cse,it&experience=2-5&sort=newest&page=2

import { FACET_KEYS, SINGLE_SELECT, emptySelection, type FacetKey, type FacetSelection } from '@/lib/utils/careers-facets'

export const SORT_KEYS = ['relevance', 'newest', 'oldest', 'title'] as const
export type SortKey = (typeof SORT_KEYS)[number]

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: 'Relevance',
  newest: 'Newest',
  oldest: 'Oldest',
  title: 'Job title',
}

export const MAX_QUERY_LENGTH = 100
const MAX_VALUES_PER_GROUP = 20
const VALUE_RE = /^[a-z0-9_+-]{1,80}$/

export interface CareersQuery {
  q: string
  filters: FacetSelection
  /** null = the default for the current view (relevance when searching, else newest). */
  sort: SortKey | null
  page: number
  /** Pre-v3 links carried a MyJKKN institution uuid; the service maps it to a slug. */
  legacyInstitutionId: string | null
}

type RawParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined): string => (Array.isArray(v) ? v[0] : v) ?? ''

export function parseCareersParams(sp: RawParams): CareersQuery {
  const filters = emptySelection()
  for (const key of FACET_KEYS) {
    const values = [...new Set(first(sp[key]).split(',').map(v => v.trim()).filter(v => VALUE_RE.test(v)))]
    filters[key] = SINGLE_SELECT.has(key) ? values.slice(0, 1) : values.slice(0, MAX_VALUES_PER_GROUP)
  }
  const sort = first(sp.sort)
  const page = Number.parseInt(first(sp.page), 10)
  return {
    q: first(sp.q).replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH),
    filters,
    sort: (SORT_KEYS as readonly string[]).includes(sort) ? (sort as SortKey) : null,
    page: Number.isFinite(page) && page > 1 ? Math.min(page, 500) : 1,
    legacyInstitutionId: first(sp.institution_id) || null,
  }
}

export interface CareersHrefInput {
  q?: string
  filters?: Partial<FacetSelection>
  sort?: SortKey | null
  page?: number
}

export function careersHref({ q, filters, sort, page }: CareersHrefInput = {}): string {
  const params = new URLSearchParams()
  if (q?.trim()) params.set('q', q.trim())
  for (const key of FACET_KEYS) {
    const values = filters?.[key]
    if (values?.length) params.set(key, values.join(','))
  }
  if (sort) params.set('sort', sort)
  if (page && page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/careers?${qs}` : '/careers'
}

/** Same view, different page — used by pagination links. */
export function pageHref(query: CareersQuery, page: number): string {
  return careersHref({ q: query.q, filters: query.filters, sort: query.sort, page })
}

/** Add/remove one filter value on the current URL. Any change returns to page 1. */
export function toggleFilterParam(current: URLSearchParams, key: FacetKey, value: string): URLSearchParams {
  const next = new URLSearchParams(current)
  const values = (next.get(key) ?? '').split(',').filter(Boolean)
  const has = values.includes(value)
  const updated = SINGLE_SELECT.has(key)
    ? (has ? [] : [value])
    : (has ? values.filter(v => v !== value) : [...values, value])
  if (updated.length) next.set(key, updated.join(','))
  else next.delete(key)
  next.delete('page')
  next.delete('institution_id')
  return next
}

export function clearFilterParams(current: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(current)
  for (const key of FACET_KEYS) next.delete(key)
  next.delete('page')
  next.delete('institution_id')
  return next
}
