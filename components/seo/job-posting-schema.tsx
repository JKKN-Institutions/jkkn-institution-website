/**
 * JobPosting JSON-LD — enables Google for Jobs listings for /careers/<job>.
 * Built from the MyJKKN PublicJob shape (whitelisted fields only).
 * Emitted on job pages only, never on the listing, and every value mirrors
 * what the page shows (same tidied title, same town spelling).
 * @see https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
import type { PublicJob } from '@/lib/schemas/public-careers'
import { canonicalCity } from '@/lib/utils/careers-facets'
import { looksLikeHtml, sanitizeJobHtml } from '@/lib/utils/careers-html'
import { formatJobTitle } from '@/lib/utils/careers-text'

const EMPLOYMENT_TYPE: Record<string, string> = {
  full_time: 'FULL_TIME', part_time: 'PART_TIME', contract: 'CONTRACTOR', internship: 'INTERN', freelance: 'CONTRACTOR',
}
const UNIT_TEXT: Record<string, string> = {
  per_month: 'MONTH', per_year: 'YEAR', per_annum: 'YEAR', per_hour: 'HOUR', per_day: 'DAY',
}
const COUNTRY_CODE: Record<string, string> = { india: 'IN' }
// Google accepts only its own credentialCategory vocabulary; MyJKKN's levels map onto it.
const CREDENTIAL_CATEGORY: Record<string, string> = {
  high_school: 'high school',
  diploma: 'professional certificate',
  bachelors: 'bachelor degree',
  masters: 'postgraduate degree',
  phd: 'postgraduate degree',
}

/**
 * Returns null when the job has no posted date. `datePosted` is required, and
 * inventing one (the old code used "today") tells Google a years-old vacancy
 * was published this morning — no markup is better than false markup.
 * Also null when HR ticked "Hide from Google" (job.seo.noindex) in MyJKKN.
 *
 * title/description stay HR's visible text even when HR wrote a separate SEO
 * title: Google requires JobPosting markup to match what the page shows.
 */
export function buildJobPostingJsonLd(job: PublicJob, pageUrl: string): Record<string, unknown> | null {
  if (!job.posted_at || job.seo?.noindex) return null

  const title = formatJobTitle(job.title)
  const description = [
    // Google accepts HTML in JobPosting.description; ship the sanitised markup.
    job.description ? (looksLikeHtml(job.description) ? sanitizeJobHtml(job.description) : job.description) : '',
    job.qualifications.length ? `Qualifications: ${job.qualifications.join(', ')}.` : '',
    job.skills.length ? `Skills: ${job.skills.join(', ')}.` : '',
  ].filter(Boolean).join('\n\n') || title

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted: job.posted_at,
    url: pageUrl,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.institution?.name ?? 'JKKN Institutions',
      sameAs: new URL(pageUrl).origin,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: canonicalCity(job.city) ?? undefined,
        addressRegion: job.state ?? undefined,
        addressCountry: job.country ? (COUNTRY_CODE[job.country.toLowerCase()] ?? job.country) : 'IN',
      },
    },
    totalJobOpenings: job.positions_open,
    directApply: true,
  }
  if (job.closes_at) ld.validThrough = job.closes_at
  if (job.job_type && EMPLOYMENT_TYPE[job.job_type]) ld.employmentType = EMPLOYMENT_TYPE[job.job_type]
  if (job.job_code) ld.identifier = { '@type': 'PropertyValue', name: 'Job code', value: job.job_code }
  if (job.salary && (job.salary.min !== null || job.salary.max !== null)) {
    ld.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min ?? undefined,
        maxValue: job.salary.max ?? undefined,
        unitText: UNIT_TEXT[job.salary.duration] ?? 'MONTH',
      },
    }
  }
  const credential = job.education_level ? CREDENTIAL_CATEGORY[job.education_level] : undefined
  if (credential) {
    ld.educationRequirements = { '@type': 'EducationalOccupationalCredential', credentialCategory: credential }
  }
  if (job.min_experience_years !== null) {
    ld.experienceRequirements = { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: job.min_experience_years * 12 }
  }
  return ld
}

export function buildJobBreadcrumbJsonLd(title: string, pageUrl: string): Record<string, unknown> {
  const origin = new URL(pageUrl).origin
  const crumb = (position: number, name: string, item: string) => ({ '@type': 'ListItem', position, name, item })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [crumb(1, 'Home', origin), crumb(2, 'Careers', `${origin}/careers`), crumb(3, title, pageUrl)],
  }
}

// `<` is escaped so a description containing "</script>" cannot close the tag.
const toScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

export function JobPostingSchema({ job, pageUrl }: { job: PublicJob; pageUrl: string }) {
  const posting = buildJobPostingJsonLd(job, pageUrl)
  const breadcrumb = buildJobBreadcrumbJsonLd(formatJobTitle(job.title), pageUrl)
  return (
    <>
      {posting && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toScript(posting) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toScript(breadcrumb) }} />
    </>
  )
}
