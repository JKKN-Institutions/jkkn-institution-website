import Link from 'next/link'
import { ArrowRight, Briefcase, Building2, CalendarClock, MapPin } from 'lucide-react'
import type { PublicJob } from '@/lib/schemas/public-careers'
import { daysUntil, formatExperience, formatJobType, formatLocation, formatRoleCategory } from '@/lib/utils/careers-format'

export function JobCard({ job }: { job: PublicJob }) {
  const location = formatLocation(job)
  const experience = formatExperience(job.min_experience_years, job.max_experience_years)
  const closing = daysUntil(job.closes_at)

  return (
    <Link
      href={`/careers/${job.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{formatRoleCategory(job.role_category)}</p>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-foreground">{job.title}</h3>
        </div>
        {job.job_type && (
          <span className="shrink-0 rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">
            {formatJobType(job.job_type)}
          </span>
        )}
      </div>

      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {job.institution && (
          <li className="flex items-center gap-2"><Building2 className="h-4 w-4 shrink-0" /> <span className="truncate">{job.institution.name}</span></li>
        )}
        {job.department && (
          <li className="flex items-center gap-2"><Briefcase className="h-4 w-4 shrink-0" /> <span className="truncate">{job.department.name}</span></li>
        )}
        {location && (
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> {location}</li>
        )}
        {experience && (
          <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4 shrink-0" /> {experience}</li>
        )}
      </ul>

      <div className="mt-auto flex items-center justify-between pt-2 text-sm">
        <span className="text-muted-foreground">
          {job.positions_open > 1 ? `${job.positions_open} openings` : '1 opening'}
          {closing !== null && closing >= 0 && closing <= 7 && (
            <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {closing === 0 ? 'Closes today' : `Closes in ${closing}d`}
            </span>
          )}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-primary transition-all group-hover:gap-2">
          View &amp; apply <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
