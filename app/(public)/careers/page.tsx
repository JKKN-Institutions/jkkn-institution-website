import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Skeleton } from '@/components/ui/skeleton'
import { JobFilters } from '@/components/public/careers/job-filters'
import { JobList } from '@/components/public/careers/job-list'
import { CareersUnavailable } from '@/components/public/careers/careers-unavailable'
import { getCareersInstitutionId, listPublicJobs } from '@/lib/services/public-careers-api'
import { getCurrentInstitution, isMainInstitution } from '@/lib/config/multi-tenant'

// Jobs come from MyJKKN (HR's system of record), not this site's Supabase.
// Filters live in the URL; the data cache revalidates every 300s.
// This coded route shadows the CMS `careers` page (which held the old CVViz iframe).
export const dynamic = 'force-dynamic'

const institution = getCurrentInstitution()

export const metadata: Metadata = {
  title: `Careers | ${institution.name}`,
  description: `Open teaching and non-teaching positions at ${institution.name}. Browse current vacancies and apply online.`,
  openGraph: {
    title: `Careers | ${institution.name}`,
    description: `Open positions at ${institution.name}. Apply online.`,
    type: 'website',
  },
}

interface CareersPageProps {
  searchParams: Promise<{ q?: string; job_type?: string; institution_id?: string }>
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[220px] rounded-2xl" />)}
    </div>
  )
}

async function CareersContent({ searchParams }: CareersPageProps) {
  const sp = await searchParams
  const showInstitutions = isMainInstitution()
  // College sites are pinned to their own MyJKKN institution; the main site
  // lets the visitor pick one.
  const institutionId = getCareersInstitutionId() ?? (showInstitutions ? sp.institution_id ?? null : null)

  try {
    const { data, institutions } = await listPublicJobs({ q: sp.q, jobType: sp.job_type, institutionId })
    const filtered = Boolean(sp.q || sp.job_type || sp.institution_id)
    return (
      <>
        <JobFilters institutions={institutions} showInstitutions={showInstitutions} />
        <JobList jobs={data} filtered={filtered} />
      </>
    )
  } catch (err) {
    console.error('[careers] listing failed', err)
    return <CareersUnavailable />
  }
}

export default function CareersPage(props: CareersPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[2.5px] text-primary">
            <span className="mr-2 inline-block h-0.5 w-6 bg-primary align-middle" />
            Careers
          </p>
          <h1 className="font-sans font-bold text-foreground">Join {institution.name}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Explore open teaching and non-teaching positions and apply online in minutes. No account needed.
          </p>
        </div>

        <Suspense fallback={<ListSkeleton />}>
          <CareersContent {...props} />
        </Suspense>
      </div>
    </div>
  )
}
