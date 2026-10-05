'use client'

// Hero search box with type-ahead (spec §4.2–4.3).
//
// It is a real GET form, so it still searches with JavaScript disabled. With
// JS it submits through the shared careers transition and keeps the active
// filters. Suggestions are matched in the browser against a list the server
// streams in — the box is usable before that list arrives.

import { useEffect, useId, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Loader2, Search } from 'lucide-react'
import { FACET_KEYS } from '@/lib/utils/careers-facets'
import { MAX_QUERY_LENGTH } from '@/lib/utils/careers-params'
import {
  MIN_SUGGEST_LENGTH, SUGGEST_TYPE_LABELS, matchSuggestions, suggestHref, type SuggestItem,
} from '@/lib/utils/careers-suggest'
import { useCareersNav } from './careers-nav'

interface CareersSearchBarProps {
  /** Resolves with the suggestion list once the job feed has loaded. */
  suggestions: Promise<SuggestItem[]>
}

export function CareersSearchBar({ suggestions }: CareersSearchBarProps) {
  const { params, pending, navigate } = useCareersNav()
  const urlQuery = params.get('q') ?? ''

  const [value, setValue] = useState(urlQuery)
  // Follow the URL when it changes from elsewhere (popular chip, Back, clear).
  const [syncedQuery, setSyncedQuery] = useState(urlQuery)
  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery)
    setValue(urlQuery)
  }

  const [items, setItems] = useState<SuggestItem[]>([])
  useEffect(() => {
    let live = true
    suggestions.then(list => { if (live) setItems(list) }, () => {})
    return () => { live = false }
  }, [suggestions])

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const listId = useId()

  const trimmed = value.trim()
  const matches = useMemo(() => matchSuggestions(items, value), [items, value])
  const showList = open && trimmed.length >= MIN_SUGGEST_LENGTH
  // Row 0 is always "Search for …"; suggestions follow.
  const rowCount = showList ? matches.length + 1 : 0

  function runSearch(text: string) {
    const next = new URLSearchParams(params)
    if (text) next.set('q', text)
    else next.delete('q')
    next.delete('page')
    next.delete('sort') // a new search starts on its default order
    setOpen(false)
    setActive(-1)
    navigate(next, { push: true })
  }

  function choose(index: number) {
    if (index <= 0) return runSearch(trimmed)
    const item = matches[index - 1]
    setOpen(false)
    setActive(-1)
    // Roles become a text search; departments, degrees and colleges become a filter.
    navigate(new URLSearchParams(suggestHref(item).split('?')[1] ?? ''), { push: true })
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (showList && active >= 0) choose(active)
    else runSearch(trimmed)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      if (open) e.preventDefault()
      setOpen(false)
      setActive(-1)
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    if (!showList) {
      setOpen(true)
      return
    }
    const step = e.key === 'ArrowDown' ? 1 : -1
    setActive(prev => (prev + step + rowCount + (prev === -1 && step === -1 ? 1 : 0)) % rowCount)
  }

  const optionId = (i: number) => `${listId}-opt-${i}`
  const optionClass = (i: number) =>
    `flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-2 text-left text-sm ${
      active === i ? 'bg-primary/10 text-foreground' : 'text-foreground'
    }`

  return (
    <form action="/careers" method="get" role="search" onSubmit={onSubmit} className="relative mx-auto w-full max-w-2xl">
      {/* Without JS the native submit must still carry the active filters. */}
      {FACET_KEYS.map(key => {
        const v = params.get(key)
        return v ? <input key={key} type="hidden" name={key} value={v} /> : null
      })}

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <label htmlFor={`${listId}-input`} className="sr-only">Search jobs</label>
        <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id={`${listId}-input`}
          name="q"
          type="search"
          value={value}
          maxLength={MAX_QUERY_LENGTH}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Search by job title, department, qualification or keyword"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
          onChange={e => { setValue(e.target.value); setOpen(true); setActive(-1) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-6"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4 sm:hidden" aria-hidden="true" />}
          <span className="sr-only sm:not-sr-only">Search jobs</span>
        </button>
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!showList}
        // Keep focus in the input so a click on an option isn't lost to blur.
        onMouseDown={e => e.preventDefault()}
        className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card py-1 text-left shadow-lg"
      >
        {showList && (
          <>
            <li id={optionId(0)} role="option" aria-selected={active === 0} onClick={() => choose(0)} className={optionClass(0)}>
              <span className="truncate">Search for <strong className="font-semibold">&ldquo;{trimmed}&rdquo;</strong></span>
            </li>
            {matches.map((item, i) => (
              <li
                key={`${item.type}:${item.label}`}
                id={optionId(i + 1)}
                role="option"
                aria-selected={active === i + 1}
                onClick={() => choose(i + 1)}
                className={optionClass(i + 1)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{SUGGEST_TYPE_LABELS[item.type]}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{item.count} {item.count === 1 ? 'job' : 'jobs'}</span>
              </li>
            ))}
          </>
        )}
      </ul>
    </form>
  )
}
