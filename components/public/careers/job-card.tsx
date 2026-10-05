import Link from 'next/link'
import { ArrowRight, CalendarClock, GraduationCap, MapPin } from 'lucide-react'
import type { JobCardData } from '@/lib/services/public-careers-search'
import { SaveJobButton } from './save-job-button'

/**
 * A wide row built for scanning, not reading (spec §4.8): the role and who is
 * hiring, then one line of facts a candidate checks first — experience,
 * qualification, location. The title link is stretched over the whole card,
 * so the card is one tab stop plus the Save button.
 */
export function JobCard({ job, headingLevel: Heading = 'h3' }: { job: JobCardData; headingLevel?: 'h2' | 'h3' }) {
  const employer = [job.institution, job.department].filter(Boolean).join(' · ')
  const facts = [
    { icon: CalendarClock, label: 'Experience', value: job.experience },
    { icon: GraduationCap, label: 'Qualification', value: job.qualification },
    { icon: MapPin, label: 'Location', value: job.location },
  ].filter(f => f.value)
  const tags = [job.category, job.jobType, job.openings > 1 ? `${job.openings} openings` : '1 opening'].filter(Boolean)

  return (
    <article className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-primary hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Heading className="text-lg font-semibold leading-snug text-foreground">
            <Link
              href={`/careers/${job.slug}`}
              className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-primary focus:outline-none"
            >
              {job.title}
            </Link>
          </Heading>
          {employer && <p className="mt-1 text-sm font-medium text-foreground/80">{employer}</p>}
        </div>
        <SaveJobButton job={{ id: job.id, slug: job.slug, title: job.title, institution: job.institution }} />
      </div>

      {facts.length > 0 && (
        <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/80">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-center gap-2">
              <dt className="shrink-0 text-muted-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </dt>
              <dd className="line-clamp-1 min-w-0">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {job.matchLabel && (
        <p className="mt-3 w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{job.matchLabel}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">·</span>}
              {tag}
            </span>
          ))}
          {job.postedLabel && (
            <span className="flex items-center gap-2"><span aria-hidden="true">·</span>{job.postedLabel}</span>
          )}
          {job.isNew && (
            <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">New</span>
          )}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2" aria-hidden="true">
          View &amp; apply <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  )
}
