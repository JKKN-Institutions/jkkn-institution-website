import { describe, expect, it } from 'vitest'
import { buildCareersView, buildSiteCareers } from '@/lib/services/public-careers-search'
import {
  canonicalCity, experienceBuckets, postedBuckets, qualificationSummary, qualificationTags,
} from '@/lib/utils/careers-facets'
import { careersHref, clearFilterParams, parseCareersParams, toggleFilterParam } from '@/lib/utils/careers-params'
import { makeJob, sampleJobs } from './fixtures'

const NOW = new Date('2026-10-05T00:00:00Z')
const site = buildSiteCareers(sampleJobs(), NOW)
const view = (params: Record<string, string>) => buildCareersView(site, parseCareersParams(params), NOW.getTime())

describe('derived filter values', () => {
  it('recognises degrees in free text without false positives', () => {
    expect(qualificationTags(makeJob({ qualifications: ['M.E. / M.Tech in CSE', 'Ph.D. preferred'] }))).toEqual(['phd', 'me-mtech'])
    expect(qualificationTags(makeJob({ qualifications: ['M.Sc., M.Ed'] }))).toEqual(['msc', 'med'])
    expect(qualificationTags(makeJob({ qualifications: ['M.D.S(Public Health Dentistry)'] }))).toEqual(['mds'])
    // "be" / "ma" as ordinary words are not B.E / M.A
    expect(qualificationTags(makeJob({ qualifications: ['Must be a graduate from Madras'] }))).toEqual([])
    // the structured level counts when the text is silent
    expect(qualificationTags(makeJob({ qualifications: [], education_level: 'phd' }))).toEqual(['phd'])
  })

  it('summarises for the card, falling back to HR wording', () => {
    expect(qualificationSummary(makeJob({ qualifications: ['M.E., Ph.D'] }))).toBe('Ph.D / M.E / M.Tech')
    expect(qualificationSummary(makeJob({ qualifications: ['12th Pass (HSC)'] }))).toBe('12th Pass (HSC)')
  })

  it('puts a job in every experience bucket its range overlaps', () => {
    expect(experienceBuckets(0, 5)).toEqual(['fresher', '0-2', '2-5'])
    expect(experienceBuckets(5, null)).toEqual(['5-10', '10-plus'])
    expect(experienceBuckets(2, 8)).toEqual(['2-5', '5-10'])
    expect(experienceBuckets(5, 5)).toEqual(['5-10'])
    expect(experienceBuckets(null, null)).toEqual([])
  })

  it('unifies the two spellings of the campus town', () => {
    expect(canonicalCity('Kumarapalayam')).toBe('Komarapalayam')
    expect(canonicalCity('Erode')).toBe('Erode')
    expect(canonicalCity(null)).toBeNull()
  })

  it('buckets posting age cumulatively', () => {
    expect(postedBuckets('2026-10-03T00:00:00Z', NOW)).toEqual(['3', '7', '30'])
    expect(postedBuckets('2025-01-01T00:00:00Z', NOW)).toEqual([])
    expect(postedBuckets(null, NOW)).toEqual([])
  })
})

describe('listing view', () => {
  it('offers only filters with two or more values', () => {
    const keys = view({}).facets.map(f => f.key)
    expect(keys).toEqual(['category', 'institution', 'department', 'experience', 'qualification'])
    // one job type, one town, one recent posting → no group
    expect(keys).not.toContain('job_type')
    expect(keys).not.toContain('location')
    expect(keys).not.toContain('posted')
  })

  it('scenario 7 — search and filters combine, and chips name each filter', () => {
    const v = view({ q: 'professor', department: 'pharmaceutics', experience: '5-10' })
    expect(v.jobs.map(j => j.title)).toEqual(['Professor'])
    expect(v.jobs[0].institution).toBe('JKKN College of Pharmacy')
    expect(v.activeFilters.map(f => f.label)).toEqual(['Pharmaceutics', '5–10 years'])
    expect(v.totalBeforeFilters).toBeGreaterThan(v.total)
  })

  it("a group's counts ignore its own selection", () => {
    const department = view({ department: 'pharmaceutics' }).facets.find(f => f.key === 'department')!
    expect(department.options.map(o => [o.label, o.count, o.selected])).toEqual([
      ['Computer Science and Engineering', 2, false],
      ['Pharmaceutics', 2, true],
    ])
  })

  it('values in one group are alternatives', () => {
    expect(view({ category: 'non_teaching,senior_leadership' }).total).toBe(3)
  })

  it('reports no results and whether filters caused it', () => {
    const v = view({ q: 'nursing', department: 'pharmaceutics' })
    expect(v).toMatchObject({ mode: 'none', total: 0, totalBeforeFilters: 1 })
  })

  it('defaults to relevance when searching and newest otherwise', () => {
    expect(view({ q: 'professor' })).toMatchObject({ sort: 'relevance', sortOptions: ['relevance', 'newest', 'oldest', 'title'] })
    expect(view({})).toMatchObject({ sort: 'newest', sortOptions: ['newest', 'oldest', 'title'] })
    expect(view({ sort: 'relevance' }).sort).toBe('newest')
  })

  it('maps a pre-v3 institution uuid onto the readable filter', () => {
    const v = view({ institution_id: 'inst-pharm' })
    expect(v.query.filters.institution).toEqual(['jkkn-college-of-pharmacy'])
    expect(v.total).toBe(3)
  })

  it('builds cards with a match label only while searching', () => {
    expect(view({}).jobs.every(j => j.matchLabel === null)).toBe(true)
    expect(view({ q: 'professor' }).jobs[0].matchLabel).toBe('Strong match')
    const card = view({ q: 'python' }).jobs[0]
    expect(card).toMatchObject({ matchLabel: 'Mentioned in the job description', location: 'Komarapalayam, Tamil Nadu', postedLabel: 'Posted 15 days ago', isNew: false })
  })

  it('keeps popular searches and tiles that lead somewhere', () => {
    // "Dental" and "Lab Technician" find nothing on this board; the list stops at eight.
    expect(site.popular.map(p => p.label)).toEqual(['Assistant Professor', 'Professor', 'Computer Science', 'Engineering', 'Nursing', 'Pharmacy', 'HR', 'Administration'])
    expect(site.categories.map(c => [c.label, c.count])).toEqual([['Teaching', 5], ['Non-teaching', 2], ['Leadership', 1]])
  })
})

describe('URL state', () => {
  it('round-trips a search with filters', () => {
    const href = careersHref({ q: 'python teaching', filters: { department: ['cse', 'it'], experience: ['2-5'] }, sort: 'newest', page: 2 })
    expect(href).toBe('/careers?q=python+teaching&department=cse%2Cit&experience=2-5&sort=newest&page=2')
    const parsed = parseCareersParams(Object.fromEntries(new URLSearchParams(href.split('?')[1])))
    expect(parsed).toMatchObject({ q: 'python teaching', sort: 'newest', page: 2 })
    expect(parsed.filters.department).toEqual(['cse', 'it'])
  })

  it('rejects malformed values', () => {
    const parsed = parseCareersParams({ department: 'ok-value,<script>,', sort: 'sideways', page: '-3', experience: '0-2,2-5' })
    expect(parsed.filters.department).toEqual(['ok-value'])
    expect(parsed.filters.experience).toEqual(['0-2']) // single-choice group
    expect(parsed).toMatchObject({ sort: null, page: 1 })
  })

  it('toggling a filter returns to page 1 and keeps the search', () => {
    const start = new URLSearchParams('q=professor&department=cse&page=3')
    expect(toggleFilterParam(start, 'department', 'it').toString()).toBe('q=professor&department=cse%2Cit')
    expect(toggleFilterParam(start, 'department', 'cse').toString()).toBe('q=professor')
    expect(toggleFilterParam(new URLSearchParams('experience=0-2'), 'experience', '2-5').toString()).toBe('experience=2-5')
    expect(clearFilterParams(new URLSearchParams('q=professor&department=cse&category=medical&sort=title')).toString()).toBe('q=professor&sort=title')
  })
})
