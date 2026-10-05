import Link from 'next/link'
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import type { CareersView, PopularSearch } from '@/lib/services/public-careers-search'
import { careersHref, pageHref, type CareersQuery } from '@/lib/utils/careers-params'
import { JobCard } from './job-card'

const linkButton =
  'inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** Never a blank page (spec §4.9): say what happened and offer the next step. */
function NoResults({ view, popular }: { view: CareersView; popular: PopularSearch[] }) {
  const { q } = view.query
  const filtered = view.activeFilters.length > 0

  if (view.totalOpen === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <SearchX className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">No open positions right now</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          New roles are posted here as soon as they open. Please check back soon.
        </p>
      </div>
    )
  }

  // Filters are the cause when the search alone would have found something.
  const filtersToBlame = filtered && view.totalBeforeFilters > 0
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <SearchX className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        {q ? <>No jobs found for &ldquo;{q}&rdquo;</> : 'No jobs match these filters'}
      </h2>

      {filtersToBlame ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {view.totalBeforeFilters} {view.totalBeforeFilters === 1 ? 'job matches' : 'jobs match'}
          {q ? ' your search' : ''} without the filters you have chosen.
        </p>
      ) : (
        <ul className="mx-auto mt-3 max-w-xs list-disc space-y-1 pl-5 text-left text-sm text-muted-foreground">
          <li>Check the spelling</li>
          <li>Use fewer or broader words</li>
          <li>Try a job title or a department</li>
        </ul>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {filtered && (
          <Link href={careersHref({ q })} scroll={false} className={`${linkButton} bg-primary text-primary-foreground hover:bg-primary/90`}>
            Clear filters
          </Link>
        )}
        <Link href="/careers" scroll={false} className={`${linkButton} border border-border bg-card text-foreground hover:border-primary/50`}>
          View all {view.totalOpen} jobs
        </Link>
      </div>

      {popular.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Popular searches</h3>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {popular.map(p => (
              <li key={p.label}>
                <Link
                  href={p.href}
                  scroll={false}
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** Page numbers to show: first, last, and a window around the current page. */
function pageWindow(page: number, pageCount: number): Array<number | 'gap'> {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter(p => p >= 1 && p <= pageCount))
  const sorted = [...pages].sort((a, b) => a - b)
  const out: Array<number | 'gap'> = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap')
    out.push(p)
  })
  return out
}

function Pagination({ query, page, pageCount }: { query: CareersQuery; page: number; pageCount: number }) {
  if (pageCount <= 1) return null
  const item = 'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  const idle = `${item} border border-border bg-card text-foreground hover:border-primary/50`
  const disabled = `${item} border border-border text-muted-foreground opacity-50`

  return (
    <nav aria-label="Job results pages" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(query, page - 1)} className={idle} rel="prev">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /><span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /><span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </span>
      )}
      {pageWindow(page, pageCount).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden="true">…</span>
        ) : p === page ? (
          <span key={p} aria-current="page" className={`${item} bg-primary text-primary-foreground`}>
            <span className="sr-only">Page </span>{p}
          </span>
        ) : (
          <Link key={p} href={pageHref(query, p)} className={idle}>
            <span className="sr-only">Page </span>{p}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link href={pageHref(query, page + 1)} className={idle} rel="next">
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span><ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span><ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}

export function JobList({ view, popular }: { view: CareersView; popular: PopularSearch[] }) {
  if (view.jobs.length === 0) return <NoResults view={view} popular={popular} />
  return (
    <>
      {view.mode === 'partial' && (
        <p className="mb-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
          No job matches all of your words. Showing jobs that match some of them, closest first.
        </p>
      )}
      {/* One wide card per row: facts read left to right, titles line up for scanning. */}
      <ul className="space-y-4">
        {view.jobs.map(job => (
          <li key={job.id}><JobCard job={job} /></li>
        ))}
      </ul>
      <Pagination query={view.query} page={view.page} pageCount={view.pageCount} />
    </>
  )
}
