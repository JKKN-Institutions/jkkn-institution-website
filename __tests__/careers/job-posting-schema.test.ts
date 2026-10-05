import { describe, expect, it } from 'vitest'
import { buildJobBreadcrumbJsonLd, buildJobPostingJsonLd } from '@/components/seo/job-posting-schema'
import type { PublicJob } from '@/lib/schemas/public-careers'

const JOB: PublicJob = {
  id: 'j1', job_code: 'JOB-007', title: 'Lab Assistant', role_category: 'non_teaching', job_type: 'full_time',
  description: 'Run the lab.', institution: { id: 'i1', name: 'JKKN College of Pharmacy' }, department: null,
  city: 'Komarapalayam', state: 'Tamil Nadu', country: 'India', education_level: 'bachelors',
  min_experience_years: 1, max_experience_years: 3, qualifications: ['B.Pharm'], skills: ['GLP'],
  positions_open: 2, posted_at: '2026-09-01T00:00:00Z', closes_at: '2026-10-01T00:00:00Z',
  salary: { min: 30000, max: 50000, currency: 'INR', duration: 'per_month' },
}
const URL = 'https://jkkn.ac.in/careers/lab-assistant-j1'

describe('buildJobPostingJsonLd', () => {
  it('emits the Google JobPosting essentials', () => {
    const ld = buildJobPostingJsonLd(JOB, URL)!
    expect(ld['@type']).toBe('JobPosting')
    expect(ld.title).toBe('Lab Assistant')
    expect(ld.datePosted).toBe('2026-09-01T00:00:00Z')
    expect(ld.validThrough).toBe('2026-10-01T00:00:00Z')
    expect(ld.employmentType).toBe('FULL_TIME')
    expect(ld.hiringOrganization).toMatchObject({ '@type': 'Organization', name: 'JKKN College of Pharmacy', sameAs: 'https://jkkn.ac.in' })
    expect(ld.jobLocation).toMatchObject({ address: { addressLocality: 'Komarapalayam', addressRegion: 'Tamil Nadu', addressCountry: 'IN' } })
    expect(ld.baseSalary).toMatchObject({ currency: 'INR', value: { minValue: 30000, maxValue: 50000, unitText: 'MONTH' } })
    expect(ld.totalJobOpenings).toBe(2)
    expect(ld.identifier).toMatchObject({ value: 'JOB-007' })
    expect(ld.url).toBe(URL)
  })

  it('omits salary and validThrough when unknown', () => {
    const ld = buildJobPostingJsonLd({ ...JOB, salary: null, closes_at: null }, URL)
    expect(ld).not.toHaveProperty('baseSalary')
    expect(ld).not.toHaveProperty('validThrough')
  })

  it('emits nothing rather than invent a posting date', () => {
    expect(buildJobPostingJsonLd({ ...JOB, posted_at: null }, URL)).toBeNull()
  })

  it('matches what the page shows: tidied title and unified town spelling', () => {
    const ld = buildJobPostingJsonLd({ ...JOB, title: 'SENIOR LECTURER,', city: 'Kumarapalayam' }, URL)!
    expect(ld.title).toBe('Senior Lecturer')
    expect(ld.jobLocation).toMatchObject({ address: { addressLocality: 'Komarapalayam' } })
  })

  it("uses Google's credential categories, and none for a level it cannot map", () => {
    expect(buildJobPostingJsonLd(JOB, URL)!.educationRequirements).toMatchObject({ credentialCategory: 'bachelor degree' })
    expect(buildJobPostingJsonLd({ ...JOB, education_level: 'phd' }, URL)!.educationRequirements).toMatchObject({ credentialCategory: 'postgraduate degree' })
    expect(buildJobPostingJsonLd({ ...JOB, education_level: 'other' }, URL)).not.toHaveProperty('educationRequirements')
  })
})

describe('buildJobBreadcrumbJsonLd', () => {
  it('lists Home, Careers and the job on this host', () => {
    const ld = buildJobBreadcrumbJsonLd('Lab Assistant', URL)
    expect(ld.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jkkn.ac.in' },
      { '@type': 'ListItem', position: 2, name: 'Careers', item: 'https://jkkn.ac.in/careers' },
      { '@type': 'ListItem', position: 3, name: 'Lab Assistant', item: URL },
    ])
  })
})
