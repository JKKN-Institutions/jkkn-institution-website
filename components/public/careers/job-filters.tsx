'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { JOB_TYPES, type InstitutionFacet } from '@/lib/schemas/public-careers'
import { formatJobType } from '@/lib/utils/careers-format'

interface JobFiltersProps {
  institutions: InstitutionFacet[]
  /** When false (college sites) the institution chips are hidden. */
  showInstitutions: boolean
}

/**
 * Filter state lives in the URL so the server page refetches from MyJKKN with
 * the right query and the result is shareable / survives reload.
 */
export function JobFilters({ institutions, showInstitutions }: JobFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  const q = params.get('q') ?? ''
  const jobType = params.get('job_type') ?? ''
  const institutionId = params.get('institution_id') ?? ''
  const [search, setSearch] = useState(q)

  const update = useCallback((patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(patch)) v ? next.set(k, v) : next.delete(k)
    const qs = next.toString()
    startTransition(() => router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false }))
  }, [params, pathname, router])

  // Debounce typing → URL so we don't refetch on every keystroke.
  useEffect(() => {
    if (search === q) return
    const t = setTimeout(() => update({ q: search.trim() }), 350)
    return () => clearTimeout(t)
  }, [search, q, update])

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all ${
      active ? 'bg-primary text-primary-foreground shadow-md' : 'border border-border bg-card text-foreground hover:border-primary/40'
    }`

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-md">
          <span className="sr-only">Search jobs by title</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by job title…"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary/50 focus:outline-none"
          />
        </label>
        <label className="text-sm text-muted-foreground">
          <span className="sr-only">Job type</span>
          <select
            value={jobType}
            onChange={e => update({ job_type: e.target.value })}
            className="rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
          >
            <option value="">All job types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{formatJobType(t)}</option>)}
          </select>
        </label>
        {pending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Updating results" />}
      </div>

      {showInstitutions && institutions.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => update({ institution_id: '' })} className={chip(!institutionId)}>
            All institutions
          </button>
          {institutions.map(i => (
            <button key={i.id} type="button" onClick={() => update({ institution_id: i.id })} className={chip(institutionId === i.id)}>
              {i.name} <span className="opacity-70">({i.open_jobs})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
