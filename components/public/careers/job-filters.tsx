'use client'

// Filter controls for the careers listing (spec §4.5). The same groups render
// in the desktop sidebar and in the mobile bottom sheet. Which groups exist,
// their options and their counts are decided on the server from live job
// data; this file only reflects the URL and changes it.

import { useId, useState } from 'react'
import { Check, ChevronDown, Loader2, Search, SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { trackCareersEvent } from '@/lib/analytics/careers-events'
import { FACET_KEYS, type Facet, type FacetKey, type FacetOption } from '@/lib/utils/careers-facets'
import { clearFilterParams, toggleFilterParam } from '@/lib/utils/careers-params'
import { normalizeText } from '@/lib/utils/careers-text'
import { useCareersNav } from './careers-nav'

/** Groups open by default; the rest start collapsed unless something in them is ticked. */
const OPEN_BY_DEFAULT = 3
/** Options shown before "Show all". */
const COLLAPSED_OPTIONS = 6
/** Lists longer than this get their own search box. */
const SEARCHABLE_FROM = 9

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

function selectedValues(params: URLSearchParams, key: FacetKey): string[] {
  return (params.get(key) ?? '').split(',').filter(Boolean)
}

function activeCount(params: URLSearchParams): number {
  return FACET_KEYS.reduce((n, key) => n + selectedValues(params, key).length, 0)
}

interface OptionRowProps {
  label: string
  count?: number
  checked: boolean
  single: boolean
  name?: string
  onChange: () => void
}

/**
 * One choice. The native input is kept (visually hidden) so keyboard, screen
 * reader and form behaviour are the browser's own; the box beside it is drawn
 * to match the brand and mirrors the input's state.
 */
function OptionRow({ label, count, checked, single, name, onChange }: OptionRowProps) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-center gap-3 py-1.5 text-[0.9375rem] leading-snug transition-colors hover:text-primary lg:min-h-10 ${
        checked ? 'font-medium text-foreground' : 'text-foreground/90'
      }`}
    >
      <input type={single ? 'radio' : 'checkbox'} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center border-[1.5px] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
          single ? 'rounded-full' : 'rounded-[5px]'
        } ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/50 bg-card'}`}
      >
        {checked && (single
          ? <span className="h-2 w-2 rounded-full bg-primary-foreground" />
          : <Check className="h-3.5 w-3.5" strokeWidth={3} />)}
      </span>
      <span className="min-w-0 flex-1 break-words">
        {label}
        {count !== undefined && (
          <span className="ml-1.5 font-normal tabular-nums text-muted-foreground">
            <span aria-hidden="true">({count})</span>
            <span className="sr-only">, {count} {count === 1 ? 'job' : 'jobs'}</span>
          </span>
        )}
      </span>
    </label>
  )
}

function FilterGroup({ facet, defaultOpen }: { facet: Facet; defaultOpen: boolean }) {
  const { params, navigate } = useCareersNav()
  const id = useId()
  const selected = selectedValues(params, facet.key)
  const [open, setOpen] = useState(defaultOpen || selected.length > 0)
  const [showAll, setShowAll] = useState(false)
  const [find, setFind] = useState('')

  const searchable = facet.options.length >= SEARCHABLE_FROM
  const needle = normalizeText(find)
  const matching: FacetOption[] = needle
    ? facet.options.filter(o => normalizeText(o.label).includes(needle))
    : facet.options
  // While searching, show every match; otherwise the top few plus anything ticked.
  const visible = needle || showAll
    ? matching
    : matching.filter((o, i) => i < COLLAPSED_OPTIONS || selected.includes(o.value))
  const canExpand = !needle && facet.options.length > COLLAPSED_OPTIONS

  function toggle(option: FacetOption) {
    const removing = selected.includes(option.value)
    trackCareersEvent('careers_filter', { filter_name: facet.key, filter_value: option.label, action: removing ? 'remove' : 'add' })
    navigate(toggleFilterParam(params, facet.key, option.value))
  }

  function clearGroup() {
    const next = new URLSearchParams(params)
    next.delete(facet.key)
    next.delete('page')
    navigate(next)
  }

  return (
    <section className="border-b border-border last:border-b-0">
      <h3>
        <button
          type="button"
          id={`${id}-toggle`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen(v => !v)}
          className={`flex min-h-14 w-full items-center justify-between gap-2 rounded-lg text-left ${focusRing}`}
        >
          <span className="flex items-center gap-2 text-base font-semibold text-foreground">
            {facet.label}
            {selected.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {selected.length}<span className="sr-only"> selected</span>
              </span>
            )}
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </h3>

      <div id={`${id}-panel`} role="group" aria-labelledby={`${id}-toggle`} hidden={!open} className="pb-4">
        {searchable && (
          <label className="relative mb-2 block">
            <span className="sr-only">Find in {facet.label.toLowerCase()}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={find}
              onChange={e => setFind(e.target.value)}
              placeholder={`Find ${facet.label.toLowerCase()}`}
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
          </label>
        )}

        <div className="space-y-0.5">
          {facet.single && !needle && (
            <OptionRow label="Any" checked={selected.length === 0} single name={id} onChange={clearGroup} />
          )}
          {visible.map(option => (
            <OptionRow
              key={option.value}
              label={option.label}
              count={option.count}
              checked={selected.includes(option.value)}
              single={facet.single}
              name={facet.single ? id : undefined}
              onChange={() => toggle(option)}
            />
          ))}
          {needle && visible.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">Nothing matches &ldquo;{find.trim()}&rdquo;.</p>
          )}
        </div>

        {canExpand && (
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls={`${id}-panel`}
            onClick={() => setShowAll(v => !v)}
            className={`mt-1 inline-flex min-h-9 items-center gap-1 rounded-lg text-sm font-medium text-primary hover:underline ${focusRing}`}
          >
            {showAll ? 'Show fewer' : `Show all ${facet.options.length}`}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  )
}

function FilterGroups({ facets }: { facets: Facet[] }) {
  return (
    <div>
      {facets.map((facet, i) => <FilterGroup key={facet.key} facet={facet} defaultOpen={i < OPEN_BY_DEFAULT} />)}
    </div>
  )
}

/** Tablet and desktop (md+): a sticky column to the left of the results. */
export function FiltersSidebar({ facets }: { facets: Facet[] }) {
  const { params, navigate } = useCareersNav()
  if (facets.length === 0) return null
  const count = activeCount(params)

  return (
    <aside aria-label="Filter jobs" className="hidden md:block">
      {/* Stays in view while the results scroll; scrolls on its own when taller than the screen.
          top-32 clears the site header, which is two rows tall at narrower desktop widths.
          Below lg the public bottom nav is fixed over the last ~4.5rem of the screen, so the
          panel stops short of it there. */}
      <div className="sticky top-32 max-h-[calc(100dvh-13.5rem)] lg:max-h-[calc(100dvh-9rem)] overflow-y-auto rounded-2xl border border-border bg-card shadow-sm [scrollbar-width:thin]">
        <div className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-2 border-b border-border bg-card px-5 lg:px-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            All Filters
            {count > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {count}<span className="sr-only"> active</span>
              </span>
            )}
          </h2>
          {count > 0 && (
            <button
              type="button"
              onClick={() => navigate(clearFilterParams(params))}
              className={`min-h-9 rounded-lg px-2 text-sm font-medium text-primary hover:underline ${focusRing}`}
            >
              Clear all
            </button>
          )}
        </div>
        <div className="px-5 py-1 lg:px-6">
          <FilterGroups facets={facets} />
        </div>
      </div>
    </aside>
  )
}

/** Phones (below md): a button that opens the same groups in a bottom sheet. */
export function FiltersSheetButton({ facets, total }: { facets: Facet[]; total: number }) {
  const { params, pending, navigate } = useCareersNav()
  const [open, setOpen] = useState(false)
  if (facets.length === 0) return null
  const count = activeCount(params)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:border-primary/40 md:hidden ${focusRing}`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {count > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {count}<span className="sr-only"> active</span>
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] gap-0 rounded-t-2xl">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Results update as you choose.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-1">
          <FilterGroups facets={facets} />
        </div>
        <SheetFooter className="flex-row gap-3 border-t border-border">
          <button
            type="button"
            disabled={count === 0}
            onClick={() => navigate(clearFilterParams(params))}
            className={`h-12 flex-1 rounded-full border border-border bg-card text-sm font-medium text-foreground disabled:opacity-50 ${focusRing}`}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground ${focusRing}`}
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Show {total} {total === 1 ? 'job' : 'jobs'}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
