import Link from 'next/link'
import {
  Briefcase, Building2, CalendarClock, CalendarDays, Check, ChevronRight, GraduationCap, Hash, IndianRupee, MapPin, Timer,
  Users,
} from 'lucide-react'
import type { PublicJob } from '@/lib/schemas/public-careers'
import type { JobCardData } from '@/lib/services/public-careers-search'
import { splitPlainDescription, type DescriptionSection } from '@/lib/utils/careers-description'
import { canonicalCity, categoryLabel, qualificationSummary } from '@/lib/utils/careers-facets'
import { formatDate, formatExperience, formatJobType, formatSalary } from '@/lib/utils/careers-format'
import { looksLikeHtml, sanitizeJobHtml } from '@/lib/utils/careers-html'
import { formatJobTitle } from '@/lib/utils/careers-text'
import { ApplyNowButton } from './apply-cta'
import { JobCard } from './job-card'
import { SaveJobButton } from './save-job-button'
import { ShareJob } from './share-job'

// Reading order follows the candidate's decision (spec §5.2): what is it,
// do I qualify, what would I do, who is the employer — then how to apply.

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="break-words text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

function PlainSection({ section }: { section: DescriptionSection }) {
  return (
    <div>
      {section.heading && <h3 className="text-base font-semibold text-foreground">{section.heading}</h3>}
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{section.body}</p>
    </div>
  )
}

interface JobDetailProps {
  job: PublicJob
  slug: string
  /** Canonical URL of this page, used for sharing. */
  pageUrl: string
}

export function JobDetail({ job, slug, pageUrl }: JobDetailProps) {
  const title = formatJobTitle(job.title)
  const institution = job.institution?.name ?? 'JKKN Institutions'
  const location = [canonicalCity(job.city), job.state].filter(Boolean).join(', ')
  const experience = formatExperience(job.min_experience_years, job.max_experience_years)
  const hasEligibility = job.qualifications.length > 0 || Boolean(experience)

  const html = job.description && looksLikeHtml(job.description) ? sanitizeJobHtml(job.description) : null
  const sections = job.description && !html ? splitPlainDescription(job.description) : []
  const roleSections = sections.filter(s => !s.about)
  const aboutSections = sections.filter(s => s.about)

  return (
    <article className="min-w-0 space-y-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary hover:underline">Home</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href="/careers" className="hover:text-primary hover:underline">Careers</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li aria-current="page" className="line-clamp-1 text-foreground">{title}</li>
        </ol>
      </nav>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{categoryLabel(job.role_category)}</p>
        <h1 className="mt-1 font-sans font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {institution}{job.department && <> · {job.department.name}</>}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ApplyNowButton jobId={job.id} />
          <SaveJobButton variant="full" job={{ id: job.id, slug, title, institution: job.institution?.name ?? null }} />
        </div>
      </header>

      {/* Labelled facts: the same block answers people, search engines and AI assistants (spec §6). */}
      <section aria-labelledby="job-facts-heading">
        <h2 id="job-facts-heading" className="sr-only">Key facts</h2>
        <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
          <Fact icon={Building2} label="Institution" value={job.institution?.name ?? null} />
          <Fact icon={Briefcase} label="Department" value={job.department?.name ?? null} />
          <Fact icon={MapPin} label="Location" value={location || null} />
          <Fact icon={CalendarClock} label="Job type" value={formatJobType(job.job_type) || null} />
          <Fact icon={Timer} label="Experience" value={experience || null} />
          <Fact icon={GraduationCap} label="Qualification" value={qualificationSummary(job) || null} />
          <Fact icon={Users} label="Openings" value={String(job.positions_open)} />
          <Fact icon={IndianRupee} label="Salary" value={formatSalary(job.salary)} />
          <Fact icon={CalendarDays} label="Posted" value={formatDate(job.posted_at)} />
          <Fact icon={CalendarDays} label="Apply by" value={formatDate(job.closes_at)} />
          <Fact icon={Hash} label="Job code" value={job.job_code} />
        </dl>
      </section>

      {/* Restates the posting's own requirements; it never judges the reader. */}
      {hasEligibility && (
        <section aria-labelledby="job-eligibility-heading" className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <h2 id="job-eligibility-heading" className="text-xl font-semibold text-foreground">Am I eligible?</h2>
          <p className="mt-1 text-sm text-muted-foreground">This role asks for:</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {job.qualifications.map(q => (
              <li key={q} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> <span>{q}</span>
              </li>
            ))}
            {experience && (
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> <span>Experience: {experience}</span>
              </li>
            )}
          </ul>
        </section>
      )}

      {job.skills.length > 0 && (
        <section aria-labelledby="job-skills-heading">
          <h2 id="job-skills-heading" className="text-xl font-semibold text-foreground">Skills</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {job.skills.map(s => (
              <li key={s} className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">{s}</li>
            ))}
          </ul>
        </section>
      )}

      {html && (
        <section aria-labelledby="job-role-heading">
          <h2 id="job-role-heading" className="text-xl font-semibold text-foreground">About the role</h2>
          {/* MyJKKN's editor emits HTML; it is sanitised to a small allow-list first. */}
          <div
            className="prose mt-3 max-w-none text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:text-base [&_h3]:text-base [&_h4]:text-sm [&_li]:text-sm [&_p]:mb-3 [&_p]:text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </section>
      )}

      {roleSections.length > 0 && (
        <section aria-labelledby="job-role-heading" className="space-y-4">
          <h2 id="job-role-heading" className="text-xl font-semibold text-foreground">About the role</h2>
          {roleSections.map((s, i) => <PlainSection key={i} section={s} />)}
        </section>
      )}

      {aboutSections.length > 0 && (
        <section aria-labelledby="job-about-heading" className="space-y-4">
          <h2 id="job-about-heading" className="text-xl font-semibold text-foreground">About the institution</h2>
          {aboutSections.map((s, i) => <PlainSection key={i} section={{ ...s, heading: null }} />)}
        </section>
      )}

      <ShareJob jobId={job.id} title={title} institution={institution} url={pageUrl} />
    </article>
  )
}

export function RelatedJobs({ jobs }: { jobs: JobCardData[] }) {
  if (jobs.length === 0) return null
  return (
    <section aria-labelledby="related-jobs-heading">
      <h2 id="related-jobs-heading" className="text-xl font-semibold text-foreground">You may also be interested in</h2>
      <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {jobs.map(job => (
          <li key={job.id}><JobCard job={job} /></li>
        ))}
      </ul>
    </section>
  )
}
