import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { ApplyForm } from '@/components/public/careers/apply-form'
import { StickyApply } from '@/components/public/careers/apply-cta'
import { JobViewTracker } from '@/components/public/careers/careers-trackers'
import { JobDetail, RelatedJobs } from '@/components/public/careers/job-detail'
import { JobPostingSchema } from '@/components/seo/job-posting-schema'
import type { PublicJob } from '@/lib/schemas/public-careers'
import { getMyJkknBaseUrl, getPublicJob, isUuid } from '@/lib/services/public-careers-api'
import {
  findJobInSite, getSiteCareers, relatedJobCards, type JobCardData,
} from '@/lib/services/public-careers-search'
import { canonicalCity, qualificationSummary } from '@/lib/utils/careers-facets'
import { APPLY_SECTION_ID, formatExperience } from '@/lib/utils/careers-format'
import { jobSlug } from '@/lib/utils/careers-slug'
import { formatJobTitle } from '@/lib/utils/careers-text'
import { getSiteUrl } from '@/lib/utils/site-url'

export const dynamic = 'force-dynamic'

// The folder keeps its original name, but the segment now carries a readable
// slug (or, for links from before v3, a bare job UUID).
interface JobPageProps { params: Promise<{ id: string }> }

interface ResolvedJob {
  job: PublicJob
  /** The job's current slug. Differs from the requested one after a retitle or for old UUID links. */
  slug: string
  related: JobCardData[]
}

/**
 * URL segment → job. Two kinds of segment arrive here (spec §5.1):
 *   - a readable slug, resolved through the cached feed by its trailing key;
 *   - a bare UUID from before v3, looked up directly.
 * A MyJKKN outage throws (→ error boundary / 500), it never returns null:
 * a job that exists must not be told "no longer accepting applications".
 * cache() shares one resolution between generateMetadata and the page.
 */
const resolveJob = cache(async (segment: string): Promise<ResolvedJob | null> => {
  if (isUuid(segment)) {
    const job = await getPublicJob(segment)
    if (!job) return null
    const site = await getSiteCareers()
    // A job outside this site's feed (another college on a pinned site) keeps
    // its UUID address — there is no slug here to send it to.
    const known = site.index.jobs.some(i => i.job.id === job.id)
    return { job, slug: known ? jobSlug(job) : segment, related: known ? relatedJobCards(site, job.id) : [] }
  }

  const site = await getSiteCareers()
  const item = findJobInSite(site, segment)
  if (!item) return null
  // The feed is up to five minutes old; the detail endpoint is the authority
  // on whether the job is still open.
  const job = await getPublicJob(item.job.id)
  if (!job) return null
  return { job, slug: jobSlug(job), related: relatedJobCards(site, job.id) }
})

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id: segment } = await params
  const resolved = await resolveJob(segment).catch(() => null)
  if (!resolved) return { title: 'Job not found', robots: { index: false } }
  const { job, slug } = resolved

  const where = job.institution?.name ?? 'JKKN Institutions'
  const title = `${formatJobTitle(job.title)} at ${where}`
  const location = [canonicalCity(job.city), job.state].filter(Boolean).join(', ')
  const experience = formatExperience(job.min_experience_years, job.max_experience_years)
  const qualification = qualificationSummary(job)
  const description = [
    `${formatJobTitle(job.title)}${job.department ? `, ${job.department.name}` : ''} at ${where}${location ? `, ${location}` : ''}.`,
    experience && `Experience: ${experience}.`,
    qualification && `Qualification: ${qualification}.`,
    'Apply online, no account needed.',
  ].filter(Boolean).join(' ')
  const url = `${getSiteUrl()}/careers/${slug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'en_IN' },
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { id: segment } = await params
  const resolved = await resolveJob(segment)
  if (!resolved) notFound()
  const { job, slug, related } = resolved
  // Old UUID links and outdated slugs land on the one canonical address.
  if (slug !== segment) permanentRedirect(`/careers/${slug}`)

  const pageUrl = `${getSiteUrl()}/careers/${slug}`

  return (
    // data-sticky-root: lets the form column stick (see app/(public)/layout.tsx).
    <div data-sticky-root className="min-h-screen bg-background">
      <JobPostingSchema job={job} pageUrl={pageUrl} />
      <JobViewTracker jobId={job.id} title={formatJobTitle(job.title)} institution={job.institution?.name ?? ''} />

      {/* Mobile order: job → form → similar jobs. From lg the form is a sticky second column. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_420px]">
        <JobDetail job={job} slug={slug} pageUrl={pageUrl} />
        <aside
          id={APPLY_SECTION_ID}
          aria-label="Apply for this job"
          className="scroll-mt-32 lg:sticky lg:top-32 lg:row-span-2 lg:max-h-[calc(100dvh-9rem)] lg:self-start lg:overflow-y-auto lg:rounded-2xl"
        >
          <ApplyForm jobId={job.id} jobTitle={formatJobTitle(job.title)} apiBaseUrl={getMyJkknBaseUrl()} />
        </aside>
        <RelatedJobs jobs={related} />
      </div>

      <StickyApply jobId={job.id} />
    </div>
  )
}
