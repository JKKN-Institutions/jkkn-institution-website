import { describe, expect, it } from 'vitest'
import { buildJobPostingJsonLd } from '@/components/seo/job-posting-schema'
import type { PublicJob } from '@/lib/schemas/public-careers'

const JOB: PublicJob = {
  id: 'j1', job_code: 'JOB-007', title: 'Lab Assistant', role_category: 'non_teaching', job_type: 'full_time',
  description: 'Run the lab.', institution: { id: 'i1', name: 'JKKN College of Pharmacy' }, department: null,
  city: 'Komarapalayam', state: 'Tamil Nadu', country: 'India', education_level: 'bachelors',
  min_experience_years: 1, max_experience_years: 3, qualifications: ['B.Pharm'], skills: ['GLP'],
  positions_open: 2, posted_at: '2026-09-01T00:00:00Z', closes_at: '2026-10-01T00:00:00Z',
  salary: { min: 30000, max: 50000, currency: 'INR', duration: 'per_month' },
}

describe('buildJobPostingJsonLd', () => {
  it('emits the Google JobPosting essentials', () => {
    const ld = buildJobPostingJsonLd(JOB, 'https://jkkn.ac.in/careers/j1')
    expect(ld['@type']).toBe('JobPosting')
    expect(ld.title).toBe('Lab Assistant')
    expect(ld.datePosted).toBe('2026-09-01T00:00:00Z')
    expect(ld.validThrough).toBe('2026-10-01T00:00:00Z')
    expect(ld.employmentType).toBe('FULL_TIME')
    expect(ld.hiringOrganization).toMatchObject({ '@type': 'Organization', name: 'JKKN College of Pharmacy' })
    expect(ld.jobLocation).toMatchObject({ address: { addressLocality: 'Komarapalayam', addressRegion: 'Tamil Nadu', addressCountry: 'IN' } })
    expect(ld.baseSalary).toMatchObject({ currency: 'INR', value: { minValue: 30000, maxValue: 50000, unitText: 'MONTH' } })
    expect(ld.totalJobOpenings).toBe(2)
    expect(ld.identifier).toMatchObject({ value: 'JOB-007' })
    expect(ld.url).toBe('https://jkkn.ac.in/careers/j1')
  })
  it('omits salary and validThrough when unknown', () => {
    const ld = buildJobPostingJsonLd({ ...JOB, salary: null, closes_at: null }, 'https://x/careers/j1')
    expect(ld).not.toHaveProperty('baseSalary')
    expect(ld).not.toHaveProperty('validThrough')
  })
})
