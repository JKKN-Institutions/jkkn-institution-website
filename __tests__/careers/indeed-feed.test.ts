import { describe, expect, it } from 'vitest'
import { buildJobPostingJsonLd } from '@/components/seo/job-posting-schema'
import type { PublicJob } from '@/lib/schemas/public-careers'
import {
  buildIndeedFeedXml, buildIndeedJobXml, cdata, experienceText, indeedDate, INDEED_UTM, salaryText,
} from '@/lib/utils/careers-indeed-feed'

const JOB: PublicJob = {
  id: '4f0abd9c-808a-4495-b648-d84d64e87b6a', job_code: 'Assistant__1746249092', title: 'ASSISTANT PROFESSOR',
  role_category: 'teaching_faculty', job_type: 'full_time',
  description: '<p>Teach <strong>pharmacology</strong>.</p>', institution: { id: 'i1', name: 'JKKN College of Pharmacy' },
  department: null, city: 'Kumarapalayam', state: 'Tamil Nadu', country: 'India', education_level: 'masters',
  min_experience_years: 5, max_experience_years: null, qualifications: [], skills: [],
  positions_open: 1, posted_at: '2026-11-03T09:02:47.01347+00:00', closes_at: null,
  salary: { min: 25000, max: 35000, currency: 'INR', duration: 'per_month' },
}
const PAGE = 'https://www.jkkn.ac.in/careers/assistant-professor-1746249092'
const EMAIL = 'jobs@example.org'
const JOB_OPTS = { accountEmail: EMAIL, utm: INDEED_UTM }
const entryFor = (job: PublicJob = JOB, extra: { category?: string; experienceYears?: number | null } = {}) =>
  ({ jobId: job.id, posting: buildJobPostingJsonLd(job, PAGE)!, ...extra })

describe('buildIndeedJobXml', () => {
  it('carries every field Indeed requires, from the page JSON-LD', () => {
    const xml = buildIndeedJobXml(entryFor(JOB, { category: 'Teaching Faculty' }), JOB_OPTS)!
    expect(xml).toContain('<title><![CDATA[Assistant Professor]]></title>')
    expect(xml).toContain('<date><![CDATA[2026-11-03T09:02:47.013Z]]></date>')
    expect(xml).toContain(`<referencenumber><![CDATA[${JOB.id}]]></referencenumber>`)
    expect(xml).toContain('<requisitionid><![CDATA[Assistant__1746249092]]></requisitionid>')
    expect(xml).toContain(`<url><![CDATA[${PAGE}?utm_source=indeed&utm_medium=job_feed]]></url>`)
    expect(xml).toContain('<company><![CDATA[JKKN College of Pharmacy]]></company>')
    expect(xml).toContain('<city><![CDATA[Komarapalayam]]></city>')
    expect(xml).toContain('<state><![CDATA[Tamil Nadu]]></state>')
    expect(xml).toContain('<country><![CDATA[IN]]></country>')
    expect(xml).toContain('<postalcode><![CDATA[638183]]></postalcode>')
    expect(xml).toContain('<streetaddress><![CDATA[Natarajapuram')
    expect(xml).toContain(`<email><![CDATA[${EMAIL}]]></email>`)
    expect(xml).toContain('<description><![CDATA[')
    expect(xml).toContain('pharmacology')
    expect(xml).toContain('<jobtype><![CDATA[fulltime]]></jobtype>')
    expect(xml).toContain('<education><![CDATA[Postgraduate degree]]></education>')
    expect(xml).toContain('<category><![CDATA[Teaching Faculty]]></category>')
    expect(xml).toContain('<experience><![CDATA[5+ years]]></experience>')
  })

  it('leaves out the ATS-only tags', () => {
    const xml = buildIndeedJobXml(entryFor(), JOB_OPTS)!
    expect(xml).not.toContain('<sourcename>')
    expect(xml).not.toContain('<publisher>')
  })

  it('writes the salary the page shows, in rupees', () => {
    expect(buildIndeedJobXml(entryFor(), JOB_OPTS)).toContain('<salary><![CDATA[₹25,000 - ₹35,000 per month]]></salary>')
  })

  it('never sends a closing date: JKKN jobs are always open', () => {
    const xml = buildIndeedJobXml(entryFor({ ...JOB, closes_at: '2026-12-31T00:00:00Z' }), JOB_OPTS)!
    expect(xml).not.toContain('expirationdate')
  })

  it('falls back to the job id for requisitionid and says so for freshers', () => {
    const xml = buildIndeedJobXml(entryFor({ ...JOB, job_code: null, min_experience_years: 0 }, { experienceYears: 0 }), JOB_OPTS)!
    expect(xml).toContain(`<requisitionid><![CDATA[${JOB.id}]]></requisitionid>`)
    expect(xml).toContain('<experience><![CDATA[No experience required]]></experience>')
  })

  it('leaves out a job that is missing a required field instead of sending it half-filled', () => {
    const { posting } = entryFor()
    expect(buildIndeedJobXml({ jobId: JOB.id, posting: { ...posting, title: '' } }, JOB_OPTS)).toBeNull()
    expect(buildIndeedJobXml({ jobId: JOB.id, posting: { ...posting, datePosted: 'not a date' } }, JOB_OPTS)).toBeNull()
    expect(buildIndeedJobXml({ jobId: '', posting }, JOB_OPTS)).toBeNull()
    expect(buildIndeedJobXml({ jobId: JOB.id, posting }, { accountEmail: ' ' })).toBeNull()
  })

  it('omits optional tags it has no value for', () => {
    const xml = buildIndeedJobXml(entryFor({ ...JOB, salary: null, min_experience_years: null }), JOB_OPTS)!
    expect(xml).not.toContain('<salary>')
    expect(xml).not.toContain('<experience>')
    expect(xml).not.toContain('<category>')
  })
})

describe('salaryText / experienceText / indeedDate / cdata', () => {
  const sal = (value: Record<string, unknown>) => ({ '@type': 'MonetaryAmount', currency: 'INR', value: { unitText: 'MONTH', ...value } })
  it('formats one figure, a range, an open top and an Indian lakh figure', () => {
    expect(salaryText(sal({ value: 15000 }))).toBe('₹15,000 per month')
    expect(salaryText(sal({ minValue: 24000 }))).toBe('From ₹24,000 per month')
    expect(salaryText(sal({ minValue: 100000, maxValue: 150000 }))).toBe('₹1,00,000 - ₹1,50,000 per month')
    expect(salaryText(undefined)).toBeUndefined()
  })
  it('reads experience in years, singular for one', () => {
    expect(experienceText({ monthsOfExperience: 12 })).toBe('1+ year')
    expect(experienceText({ monthsOfExperience: 18 })).toBe('18+ months')
    expect(experienceText(undefined)).toBeUndefined()
  })
  it('gives ISO 8601 dates in UTC and rejects bad ones', () => {
    expect(indeedDate('2022-05-14T05:30:00+05:30')).toBe('2022-05-14T00:00:00.000Z')
    expect(indeedDate('nope')).toBeUndefined()
  })
  it('keeps CDATA closed and drops characters XML forbids', () => {
    expect(cdata('a]]>b')).toBe('<![CDATA[a]]]]><![CDATA[>b]]>')
    expect(cdata('x\u0007y')).toBe('<![CDATA[xy]]>')
  })
})

describe('buildIndeedFeedXml', () => {
  const OPTS = JOB_OPTS
  it('wraps the jobs in one <source> and skips the broken ones', () => {
    const good = entryFor()
    const bad = { jobId: 'x', posting: { ...good.posting, description: '' } }
    const xml = buildIndeedFeedXml([good, bad], OPTS)
    expect(xml.startsWith('<?xml version="1.0" encoding="utf-8"?>\n<source>\n  <job>')).toBe(true)
    expect(xml).not.toContain('lastBuildDate')
    expect(xml.match(/<job>/g)).toHaveLength(1)
    expect(xml.trimEnd().endsWith('</source>')).toBe(true)
  })
  it('is still a valid, empty feed when there are no jobs', () => {
    const xml = buildIndeedFeedXml([], OPTS)
    expect(xml).not.toContain('<job>')
    expect(xml).toContain('</source>')
  })
})
