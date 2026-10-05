'use client'

// Everything between the hero and the cards: result count, saved jobs, sort,
// the mobile Filters button, and the chips for filters that are switched on
// (spec §4.5–4.7). All of it reads and writes the URL through the shared
// careers transition.

import { X } from 'lucide-react'
import { trackCareersEvent } from '@/lib/analytics/careers-events'
import type { ActiveFilter } from '@/lib/services/public-careers-search'
import { FACET_LABELS, type Facet } from '@/lib/utils/careers-facets'
import { SORT_LABELS, clearFilterParams, toggleFilterParam, type SortKey } from '@/lib/utils/careers-params'
import { useCareersNav } from './careers-nav'
import { FiltersSheetButton } from './job-filters'
import { SavedJobsButton } from './save-job-button'

interface CareersToolbarProps {
  total: number
  totalOpen: number
  query: string
  /** True when no job matched every word and the list holds partial matches. */
  partial: boolean
  /** Query words that were read as a different spelling ("nursng" → "nursing"). */
  corrections: Record<string, string>
  sort: SortKey
  sortOptions: SortKey[]
  facets: Facet[]
  activeFilters: ActiveFilter[]
}

function countText(total: number, totalOpen: number, query: string, filtered: boolean, partial: boolean): string {
  const noun = total === 1 ? 'job' : 'jobs'
  if (partial) return `${total} partial ${total === 1 ? 'match' : 'matches'} for “${query}”`
  if (query) return `${total} ${noun} found for “${query}”`
  if (filtered) return `${total} ${noun} found`
  return `${totalOpen} open ${totalOpen === 1 ? 'position' : 'positions'}`
}

export function CareersToolbar({
  total, totalOpen, query, partial, corrections, sort, sortOptions, facets, activeFilters,
}: CareersToolbarProps) {
  const { params, navigate } = useCareersNav()
  const corrected = Object.entries(corrections)

  function changeSort(value: string) {
    const next = new URLSearchParams(params)
    // The first option is the default for this view, so it needs no parameter.
    if (value === sortOptions[0]) next.delete('sort')
    else next.set('sort', value)
    next.delete('page')
    navigate(next)
  }

  function removeFilter(filter: ActiveFilter) {
    trackCareersEvent('careers_filter', { filter_name: filter.key, filter_value: filter.label, action: 'remove' })
    navigate(toggleFilterParam(params, filter.key, filter.value))
  }

  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {/* Announced to screen readers whenever the result set changes. */}
          <p role="status" aria-live="polite" className="text-base font-semibold text-foreground sm:text-lg">
            {countText(total, totalOpen, query, activeFilters.length > 0, partial)}
          </p>
          {corrected.length > 0 && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Showing results for {corrected.map(([from, to], i) => (
                <span key={from}>{i > 0 && ', '}<strong className="font-medium text-foreground">{to}</strong> instead of “{from}”</span>
              ))}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SavedJobsButton />
          <FiltersSheetButton facets={facets} total={total} />
          <label className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card pl-4 pr-2 text-sm text-muted-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
            <span>Sort<span className="sr-only"> jobs by</span>:</span>
            <select
              value={sort}
              onChange={e => changeSort(e.target.value)}
              className="h-full cursor-pointer rounded-full bg-transparent pr-1 font-medium text-foreground focus:outline-none"
            >
              {sortOptions.map(s => <option key={s} value={s}>{SORT_LABELS[s]}</option>)}
            </select>
          </label>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground" id="careers-active-filters">Filters:</span>
          <ul aria-labelledby="careers-active-filters" className="contents">
            {activeFilters.map(filter => (
              <li key={`${filter.key}:${filter.value}`}>
                <button
                  type="button"
                  onClick={() => removeFilter(filter)}
                  aria-label={`Remove filter ${FACET_LABELS[filter.key]}: ${filter.label}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-sm font-medium text-primary hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {filter.label}
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate(clearFilterParams(params))}
            className="min-h-9 rounded-full px-2 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
