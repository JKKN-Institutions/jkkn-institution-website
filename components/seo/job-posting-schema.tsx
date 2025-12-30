/**
 * JobPosting JSON-LD Schema Component
 *
 * This component renders structured data for job postings.
 * Enables Google Jobs integration for enhanced search visibility.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */

import type { CareerJobWithRelations } from '@/app/actions/cms/careers'

interface JobPostingSchemaProps {
  job: CareerJobWithRelations
}

/**
 * Map job type to schema.org employment type
 */
function mapEmploymentType(jobType: string): string {
  const typeMap: Record<string, string> = {
    full_time: 'FULL_TIME',
    part_time: 'PART_TIME',
    contract: 'CONTRACTOR',
    internship: 'INTERN',
    visiting: 'TEMPORARY',
  }
  return typeMap[jobType] || 'OTHER'
}

/**
 * Map work mode to schema.org job location type
 */
function mapJobLocationType(workMode: string): string | undefined {
  if (workMode === 'remote') return 'TELECOMMUTE'
  return undefined
}

/**
 * Generate salary specification if salary info is available
 */
function generateSalarySpecification(job: CareerJobWithRelations) {
  if (!job.show_salary || (!job.salary_min && !job.salary_max)) {
    return undefined
  }

  const salaryPeriodMap: Record<string, string> = {
    hourly: 'HOUR',
    daily: 'DAY',
    weekly: 'WEEK',
    monthly: 'MONTH',
    yearly: 'YEAR',
  }

  return {
    '@type': 'MonetaryAmount',
    currency: job.salary_currency || 'INR',
    value: {
      '@type': 'QuantitativeValue',
      minValue: job.salary_min || undefined,
      maxValue: job.salary_max || undefined,
      unitText: salaryPeriodMap[job.salary_period || 'monthly'] || 'MONTH',
    },
  }
}

export function JobPostingSchema({ job }: JobPostingSchemaProps) {
  const baseUrl = 'https://jkkn.ac.in'
  const jobUrl = `${baseUrl}/careers/${job.slug}`

  // Build the schema
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'JKKN Institutions',
      value: job.id,
    },
    datePosted: job.published_at || job.created_at,
    validThrough: job.deadline || undefined,
    employmentType: mapEmploymentType(job.job_type),
    hiringOrganization: {
      '@type': 'EducationalOrganization',
      '@id': `${baseUrl}/#organization`,
      name: 'JKKN Institutions',
      sameAs: baseUrl,
      logo: `${baseUrl}/images/logo.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Natarajapuram, NH-544',
        addressLocality: 'Komarapalayam',
        addressRegion: 'Tamil Nadu',
        postalCode: '638183',
        addressCountry: 'IN',
      },
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Natarajapuram, NH-544',
        addressLocality: job.location || 'Komarapalayam',
        addressRegion: 'Tamil Nadu',
        postalCode: '638183',
        addressCountry: 'IN',
      },
    },
    url: jobUrl,
    directApply: job.application_method === 'internal',
  }

  // Add job location type for remote/hybrid
  const locationType = mapJobLocationType(job.work_mode)
  if (locationType) {
    schema.jobLocationType = locationType
  }

  // Add salary if visible
  const baseSalary = generateSalarySpecification(job)
  if (baseSalary) {
    schema.baseSalary = baseSalary
  }

  // Add experience requirements
  if (job.experience_years_min || job.experience_years_max) {
    schema.experienceRequirements = {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: (job.experience_years_min || 0) * 12,
    }
  }

  // Add qualifications
  if (job.qualifications && job.qualifications.length > 0) {
    schema.qualifications = job.qualifications.join(', ')
  }

  // Add skills
  if (job.skills_required && job.skills_required.length > 0) {
    schema.skills = job.skills_required.join(', ')
  }

  // Add department as category
  if (job.department) {
    schema.industry = job.department.name
  }

  // Add experience level
  if (job.experience_level) {
    const levelMap: Record<string, string> = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      lead: 'Lead/Manager',
      director: 'Director/Executive',
    }
    schema.occupationalCategory = levelMap[job.experience_level]
  }

  // Add number of positions
  if (job.positions_available > 1) {
    schema.totalJobOpenings = job.positions_available
  }

  // Add benefits if available
  if (job.benefits && job.benefits.length > 0) {
    schema.jobBenefits = job.benefits.join(', ')
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
