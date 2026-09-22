import Link from 'next/link'
import {
  ArrowLeft, Briefcase, Building2, CalendarClock, CalendarDays, GraduationCap, IndianRupee, MapPin, Users,
} from 'lucide-react'
import type { PublicJob } from '@/lib/schemas/public-careers'
import {
  formatDate, formatExperience, formatJobType, formatLocation, formatRoleCategory, formatSalary,
} from '@/lib/utils/careers-format'
import { looksLikeHtml, sanitizeJobHtml } from '@/lib/utils/careers-html'

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

export function JobDetail({ job }: { job: PublicJob }) {
  const salary = formatSalary(job.salary)
  return (
    <article className="space-y-8">
      <Link href="/careers" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All openings
      </Link>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{formatRoleCategory(job.role_category)}</p>
        <h1 className="mt-1 font-sans font-bold text-foreground">{job.title}</h1>
        {job.job_code && <p className="mt-1 text-sm text-muted-foreground">Job code: {job.job_code}</p>}
      </header>

      <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <Fact icon={Building2} label="Institution" value={job.institution?.name ?? null} />
        <Fact icon={Briefcase} label="Department" value={job.department?.name ?? null} />
        <Fact icon={MapPin} label="Location" value={formatLocation(job) || null} />
        <Fact icon={CalendarClock} label="Job type" value={formatJobType(job.job_type) || null} />
        <Fact icon={GraduationCap} label="Experience" value={formatExperience(job.min_experience_years, job.max_experience_years) || null} />
        <Fact icon={Users} label="Openings" value={String(job.positions_open)} />
        <Fact icon={IndianRupee} label="Salary" value={salary} />
        <Fact icon={CalendarDays} label="Posted" value={formatDate(job.posted_at)} />
        <Fact icon={CalendarDays} label="Apply by" value={formatDate(job.closes_at)} />
      </dl>

      {job.description && (
        <section>
          <h2 className="text-xl font-semibold text-foreground">About the role</h2>
          {/* MyJKKN's editor emits HTML; older/plain rows are shown with their line breaks. */}
          {looksLikeHtml(job.description) ? (
            <div
              className="prose mt-3 max-w-none text-foreground/90 [&_p]:mb-3 [&_p]:text-sm [&_li]:text-sm [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: sanitizeJobHtml(job.description) }}
            />
          ) : (
            <div className="mt-3 max-w-none whitespace-pre-line text-sm leading-relaxed text-foreground/90">{job.description}</div>
          )}
        </section>
      )}

      {(job.qualifications.length > 0 || job.skills.length > 0) && (
        <section className="grid gap-6 sm:grid-cols-2">
          {job.qualifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Qualifications</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/90">
                {job.qualifications.map(q => <li key={q}>{q}</li>)}
              </ul>
            </div>
          )}
          {job.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Skills</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <li key={s} className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </article>
  )
}
