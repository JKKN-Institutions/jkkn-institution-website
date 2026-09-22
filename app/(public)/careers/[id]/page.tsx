import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JobDetail } from '@/components/public/careers/job-detail'
import { ApplyForm } from '@/components/public/careers/apply-form'
import { JobPostingSchema } from '@/components/seo/job-posting-schema'
import { getMyJkknBaseUrl, getPublicJob } from '@/lib/services/public-careers-api'
import { getSiteUrl } from '@/lib/utils/site-url'
import { formatLocation } from '@/lib/utils/careers-format'

export const dynamic = 'force-dynamic'

interface JobPageProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params
  const job = await getPublicJob(id).catch(() => null)
  if (!job) return { title: 'Job not found', robots: { index: false } }

  const where = job.institution?.name ?? 'JKKN Institutions'
  const title = `${job.title} — ${where}`
  const location = formatLocation(job)
  const description = `${job.title} at ${where}${location ? `, ${location}` : ''}. Apply online.`
  const url = `${getSiteUrl()}/careers/${job.id}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'en_IN' },
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params
  // A MyJKKN outage surfaces as a 500 here (error boundary), not a false 404
  // — a job that exists must never be told "no longer accepting applications".
  const job = await getPublicJob(id)
  if (!job) notFound()

  const pageUrl = `${getSiteUrl()}/careers/${job.id}`

  return (
    <div className="min-h-screen bg-background">
      <JobPostingSchema job={job} pageUrl={pageUrl} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_420px]">
        <JobDetail job={job} />
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ApplyForm jobId={job.id} jobTitle={job.title} apiBaseUrl={getMyJkknBaseUrl()} />
        </aside>
      </div>
    </div>
  )
}
