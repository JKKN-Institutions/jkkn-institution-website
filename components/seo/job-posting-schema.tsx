/**
 * JobPosting JSON-LD — enables Google for Jobs listings for /careers/[id].
 * Built from the MyJKKN PublicJob shape (whitelisted fields only).
 * @see https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
import type { PublicJob } from '@/lib/schemas/public-careers'
import { looksLikeHtml, sanitizeJobHtml } from '@/lib/utils/careers-html'

const EMPLOYMENT_TYPE: Record<string, string> = {
  full_time: 'FULL_TIME', part_time: 'PART_TIME', contract: 'CONTRACTOR', internship: 'INTERN', freelance: 'CONTRACTOR',
}
const UNIT_TEXT: Record<string, string> = {
  per_month: 'MONTH', per_year: 'YEAR', per_annum: 'YEAR', per_hour: 'HOUR', per_day: 'DAY',
}
const COUNTRY_CODE: Record<string, string> = { india: 'IN' }

export function buildJobPostingJsonLd(job: PublicJob, pageUrl: string): Record<string, unknown> {
  const description = [
    // Google accepts HTML in JobPosting.description; ship the sanitised markup.
    job.description ? (looksLikeHtml(job.description) ? sanitizeJobHtml(job.description) : job.description) : '',
    job.qualifications.length ? `Qualifications: ${job.qualifications.join(', ')}.` : '',
    job.skills.length ? `Skills: ${job.skills.join(', ')}.` : '',
  ].filter(Boolean).join('\n\n') || job.title

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted: job.posted_at ?? new Date().toISOString(),
    url: pageUrl,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.institution?.name ?? 'JKKN Institutions',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city ?? undefined,
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
  if (job.education_level) {
    ld.educationRequirements = { '@type': 'EducationalOccupationalCredential', credentialCategory: job.education_level }
  }
  if (job.min_experience_years !== null) {
    ld.experienceRequirements = { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: job.min_experience_years * 12 }
  }
  return ld
}

export function JobPostingSchema({ job, pageUrl }: { job: PublicJob; pageUrl: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingJsonLd(job, pageUrl)) }}
    />
  )
}
