import { describe, expect, it } from 'vitest'
import { buildSiteCareers, findJobInSite } from '@/lib/services/public-careers-search'
import { splitPlainDescription } from '@/lib/utils/careers-description'
import { findJobBySlug, jobKey, jobSlug } from '@/lib/utils/careers-slug'
import { matchSuggestions, suggestHref } from '@/lib/utils/careers-suggest'
import { makeJob, sampleJobs } from './fixtures'

describe('job slugs', () => {
  const coded = makeJob({
    id: '8e529d01-1111-4111-8111-111111111111',
    job_code: 'Assistant__1746249092',
    title: 'ASSISTANT PROFESSOR',
    department: { id: 'd', name: 'Computer Science and Engineering' },
  })

  it('uses the number at the end of the job code as the key', () => {
    expect(jobKey(coded)).toBe('1746249092')
    expect(jobSlug(coded)).toBe('assistant-professor-computer-science-and-engineering-1746249092')
  })

  it('falls back to the id when there is no usable code', () => {
    expect(jobKey({ ...coded, job_code: null })).toBe('8e529d01')
    expect(jobKey({ ...coded, job_code: 'JOB-TEST001' })).toBe('8e529d01')
  })

  it('does not repeat a department the title already names', () => {
    expect(jobSlug({ ...coded, title: 'Professor - Computer Science and Engineering' }))
      .toBe('professor-computer-science-and-engineering-1746249092')
  })

  it('still finds the job after HR changes the title', () => {
    const jobs = [coded, makeJob()]
    expect(findJobBySlug(jobs, jobSlug(coded))).toBe(coded)
    expect(findJobBySlug(jobs, 'an-older-title-1746249092')).toBe(coded)
    expect(findJobBySlug(jobs, 'ASSISTANT-PROFESSOR-COMPUTER-SCIENCE-AND-ENGINEERING-1746249092')).toBe(coded)
    expect(findJobBySlug(jobs, 'no-such-job-999999999')).toBeNull()
  })

  it('gives every job in a board a distinct slug the site can resolve', () => {
    const site = buildSiteCareers(sampleJobs())
    const slugs = site.index.jobs.map(i => i.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const item of site.index.jobs) expect(findJobInSite(site, item.slug)).toBe(item)
  })
})

describe('suggestions', () => {
  const site = buildSiteCareers(sampleJobs())
  const labels = (input: string) => matchSuggestions(site.suggestions, input).map(s => `${s.type}:${s.label}`)

  it('waits for two characters and caps the list at five', () => {
    expect(labels('p')).toEqual([])
    expect(labels('pr').length).toBeLessThanOrEqual(5)
  })

  it('leads with the title most jobs share', () => {
    expect(labels('prof')[0]).toBe('role:Professor')
  })

  it('understands abbreviations', () => {
    expect(labels('cse')).toContain('department:Computer Science and Engineering')
  })

  it('links roles to a search and everything else to its filter', () => {
    const [role] = matchSuggestions(site.suggestions, 'nursing tutor')
    expect(suggestHref(role)).toBe('/careers?q=Nursing+Tutor')
    const dept = matchSuggestions(site.suggestions, 'pharmaceutics').find(s => s.type === 'department')!
    expect(suggestHref(dept)).toBe('/careers?department=pharmaceutics')
  })
})

describe('splitPlainDescription', () => {
  it('splits at the labels HR types inline and flags the about section', () => {
    const text = 'About the college: A premier institution. Job Description: Teach students. Responsibilities: Mentor and assess.'
    expect(splitPlainDescription(text)).toEqual([
      { heading: 'About the college', body: 'A premier institution.', about: true },
      { heading: 'Job Description', body: 'Teach students.', about: false },
      { heading: 'Responsibilities', body: 'Mentor and assess.', about: false },
    ])
  })

  it('keeps unlabelled text whole and ignores a lower-case word before a colon', () => {
    expect(splitPlainDescription('Teach students well.')).toEqual([{ heading: null, body: 'Teach students well.', about: false }])
    const text = 'The candidate meets these requirements: a degree.'
    expect(splitPlainDescription(text)).toEqual([{ heading: null, body: text, about: false }])
  })

  it('prefers the longer label', () => {
    expect(splitPlainDescription('Key Responsibilities : Lead the lab.')[0].heading).toBe('Key Responsibilities')
  })
})
