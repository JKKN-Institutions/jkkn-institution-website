import { Suspense } from 'react'
import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { CareerCategories, PopularSearches } from '@/components/public/careers/careers-discovery'
import { CareersNavProvider, PendingRegion } from '@/components/public/careers/careers-nav'
import { CareersSearchBar } from '@/components/public/careers/careers-search-bar'
import { CareersToolbar } from '@/components/public/careers/careers-toolbar'
import { CareersSearchTracker } from '@/components/public/careers/careers-trackers'
import { CareersUnavailable } from '@/components/public/careers/careers-unavailable'
import { FiltersSidebar } from '@/components/public/careers/job-filters'
import { JobList } from '@/components/public/careers/job-list'
import { buildCareersView, getSiteCareers, type SiteCareers } from '@/lib/services/public-careers-search'
import { getCurrentInstitution, isMainInstitution } from '@/lib/config/multi-tenant'
import { careersHref, parseCareersParams } from '@/lib/utils/careers-params'
import { getSiteUrl } from '@/lib/utils/site-url'

// Jobs come from MyJKKN (HR's system of record), not this site's Supabase.
// All listing state lives in the URL; the feed is cached for 300s and searched
// in memory (lib/services/public-careers-search.ts).
// This coded route shadows the CMS `careers` page (which held the old CVViz iframe).
// Spec: docs/superpowers/specs/2026-10-05-careers-search-and-ux-design.md
export const dynamic = 'force-dynamic'

const institution = getCurrentInstitution()

type RawSearchParams = Record<string, string | string[] | undefined>
interface CareersPageProps { searchParams: Promise<RawSearchParams> }

export async function generateMetadata({ searchParams }: CareersPageProps): Promise<Metadata> {
  const sp = await searchParams
  const title = `Careers | ${institution.name}`
  const description = `Open teaching and non-teaching positions at ${institution.name}. Search by role, department or qualification and apply online.`
  return {
    title,
    description,
    alternates: { canonical: `${getSiteUrl()}/careers` },
    // Every search/filter/page combination is the same list re-cut; only the
    // bare listing is indexable. Job pages are reached through the sitemap.
    robots: Object.keys(sp).length > 0 ? { index: false, follow: true } : undefined,
    openGraph: { title, description: `Open positions at ${institution.name}. Apply online.`, type: 'website' },
  }
}

function ResultsSkeleton() {
  return (
    <div className="mt-10 space-y-4" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[150px] rounded-2xl" />)}
    </div>
  )
}

async function CareersResults({ site, searchParams }: { site: Promise<SiteCareers | null>; searchParams: RawSearchParams }) {
  const data = await site
  if (!data) return <div className="mt-10"><CareersUnavailable /></div>

  const view = buildCareersView(data, parseCareersParams(searchParams))

  const browsing = !view.query.q && view.activeFilters.length === 0
  const filterSummary = view.activeFilters.map(f => `${f.key}:${f.label}`).join('|')

  return (
    <>
      {browsing && (
        <>
          <PopularSearches items={data.popular} />
          <CareerCategories items={data.categories} />
        </>
      )}

      <section aria-label="Job results" className={browsing ? 'mt-10' : 'mt-8'}>
        <CareersToolbar
          total={view.total}
          totalOpen={view.totalOpen}
          query={view.query.q}
          partial={view.mode === 'partial'}
          corrections={view.corrections}
          sort={view.sort}
          sortOptions={view.sortOptions}
          facets={view.facets}
          activeFilters={view.activeFilters}
        />
        {/* Filters left, results right from md up; below that the filters move into a sheet. */}
        <div className={view.facets.length > 0 ? 'grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[19rem_minmax(0,1fr)]' : ''}>
          <FiltersSidebar facets={view.facets} />
          <PendingRegion>
            <JobList view={view} popular={data.popular} />
          </PendingRegion>
        </div>
      </section>

      <CareersSearchTracker query={view.query.q} filters={filterSummary} total={view.total} mode={view.mode} />
    </>
  )
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const sp = await searchParams
  // Started here, awaited inside <Suspense>: the heading and search box paint
  // without waiting for MyJKKN. null = feed unreachable (never thrown, so the
  // JSX below stays outside try/catch).
  const site: Promise<SiteCareers | null> = getSiteCareers().catch(err => {
    console.error('[careers] listing failed', err)
    return null
  })

  // Pre-v3 links (?institution_id=<uuid>) move to the readable parameter. This
  // has to happen before anything streams — once the shell is sent the status
  // is already 200 — so these rare requests wait for the feed.
  const requested = parseCareersParams(sp)
  if (requested.legacyInstitutionId) {
    const data = await site
    if (data) permanentRedirect(careersHref(buildCareersView(data, requested).query))
  }

  const scope = isMainInstitution() ? 'across JKKN institutions' : `at ${institution.name}`

  return (
    // data-sticky-root: lets the filter sidebar stick (see app/(public)/layout.tsx).
    <div data-sticky-root className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <CareersNavProvider>
          <header className="text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[2.5px] text-primary">
              <span className="mr-2 inline-block h-0.5 w-6 bg-primary align-middle" />
              Careers
            </p>
            <h1 className="font-sans font-bold text-foreground">Find Your Next Opportunity at JKKN</h1>
            <p className="mx-auto mb-6 mt-3 max-w-2xl text-muted-foreground">
              Explore teaching, non-teaching and leadership roles {scope}. Search by role, department or qualification,
              and apply online without creating an account.
            </p>
            <CareersSearchBar suggestions={site.then(s => s?.suggestions ?? [])} />
          </header>

          <Suspense fallback={<ResultsSkeleton />}>
            <CareersResults site={site} searchParams={sp} />
          </Suspense>
        </CareersNavProvider>
      </div>
    </div>
  )
}
