import { describe, expect, it } from 'vitest'
import { buildJobPostingJsonLd } from '@/components/seo/job-posting-schema'
import { PublicJobSchema } from '@/lib/schemas/public-careers'
import { autoJobDescription, autoJobKeywords, autoJobTitle, buildJobSeo } from '@/lib/utils/careers-seo'
import { makeJob } from './fixtures'

const OFFICE = { id: 'inst-office', name: 'JKKN Main Office' }
const DENTAL = { id: 'inst-dental', name: 'JKKN Dental College and Hospital' }
const NO_SEO = { title: null, description: null, keywords: [], og_image: null, noindex: false }

describe('autoJobTitle', () => {
  it('drops a trailing segment the institution name already says', () => {
    const job = makeJob({ title: 'CCTV MONITORING OPERATOR - Main Office', institution: OFFICE })
    expect(autoJobTitle(job)).toBe('CCTV Monitoring Operator at JKKN Main Office')
  })

  it('keeps a trailing segment that adds information', () => {
    const job = makeJob({ title: 'Assistant Professor — Computer Science & Engineering' })
    expect(autoJobTitle(job)).toBe('Assistant Professor — Computer Science & Engineering at JKKN College of Engineering and Technology')
  })

  it('does not append the institution when the title already names it', () => {
    const job = makeJob({ title: 'Principal JKKN College of Education', institution: { id: 'e', name: 'JKKN College of Education' } })
    expect(autoJobTitle(job)).toBe('Principal JKKN College of Education')
  })

  it('adds the department so same-titled jobs get different titles', () => {
    const a = makeJob({ title: 'PROFESSOR', institution: DENTAL, department: { id: 'd1', name: 'Oral Medicine' } })
    const b = makeJob({ title: 'PROFESSOR', institution: DENTAL, department: { id: 'd2', name: 'Prosthodontics' } })
    expect(autoJobTitle(a)).toBe('Professor, Oral Medicine at JKKN Dental College and Hospital')
    expect(autoJobTitle(a)).not.toBe(autoJobTitle(b))
  })

  it('does not repeat a department the title already names (& vs and)', () => {
    const job = makeJob({
      title: 'Assistant Professor — Computer Science & Engineering',
      department: { id: 'd', name: 'Computer Science and Engineering' },
    })
    expect(autoJobTitle(job)).not.toContain(', Computer Science and Engineering')
  })
})

describe('autoJobDescription / autoJobKeywords', () => {
  it('describes the role, place, experience and qualification', () => {
    const job = makeJob({
      title: 'CCTV MONITORING OPERATOR - Main Office', institution: OFFICE,
      min_experience_years: 0, max_experience_years: 3, education_level: 'diploma',
    })
    const d = autoJobDescription(job)
    expect(d).toMatch(/^CCTV Monitoring Operator at JKKN Main Office, Komarapalayam, Tamil Nadu\./)
    expect(d).toContain('Experience: 0–3 years.')
    expect(d).toContain('Apply online, no account needed.')
  })

  it('builds de-duplicated job keywords', () => {
    const kw = autoJobKeywords(makeJob({ title: 'CCTV MONITORING OPERATOR - Main Office', institution: OFFICE }))
    expect(kw).toEqual([
      'CCTV Monitoring Operator', 'CCTV Monitoring Operator job', 'JKKN Main Office',
      'jobs in Komarapalayam', 'JKKN Main Office careers',
    ])
  })
})

describe('buildJobSeo', () => {
  it('is fully automatic when MyJKKN sends no seo block (older API)', () => {
    const job = makeJob({ title: 'Lab Assistant' })
    expect(buildJobSeo(job)).toMatchObject({ title: autoJobTitle(job), description: autoJobDescription(job), ogImage: null, noindex: false })
  })

  it("uses HR's SEO field by field and fills the gaps automatically", () => {
    const job = makeJob({
      title: 'CCTV MONITORING OPERATOR - Main Office', institution: OFFICE,
      seo: { ...NO_SEO, title: '  CCTV Monitoring Operator Job in Komarapalayam | JKKN ', keywords: ['CCTV operator job', 'cctv operator job', 'ITI'] },
    })
    const seo = buildJobSeo(job)
    expect(seo.title).toBe('CCTV Monitoring Operator Job in Komarapalayam | JKKN')
    expect(seo.description).toBe(autoJobDescription(job))
    expect(seo.keywords).toEqual(['CCTV operator job', 'ITI'])
  })

  it('treats blank HR text as unset', () => {
    const job = makeJob({ seo: { ...NO_SEO, title: '   ', description: '' } })
    expect(buildJobSeo(job).title).toBe(autoJobTitle(job))
  })

  it('accepts only https share images', () => {
    expect(buildJobSeo(makeJob({ seo: { ...NO_SEO, og_image: 'https://x.test/a.jpg' } })).ogImage).toBe('https://x.test/a.jpg')
    expect(buildJobSeo(makeJob({ seo: { ...NO_SEO, og_image: 'javascript:alert(1)' } })).ogImage).toBeNull()
  })

  it('never touches the visible title or description', () => {
    const job = makeJob({ title: 'PROFESSOR', description: 'HR text', seo: { ...NO_SEO, title: 'SEO', description: 'SEO' } })
    buildJobSeo(job)
    expect(job.title).toBe('PROFESSOR')
    expect(job.description).toBe('HR text')
  })
})

describe('PublicJobSchema seo block', () => {
  const raw = () => {
    const { seo: _seo, ...rest } = makeJob()
    return rest
  }

  it('parses jobs from before MyJKKN sent seo', () => {
    expect(PublicJobSchema.parse(raw()).seo).toBeUndefined()
  })

  it('parses a full seo block', () => {
    const seo = { title: 'T', description: 'D', keywords: ['k'], og_image: null, noindex: true }
    expect(PublicJobSchema.parse({ ...raw(), seo }).seo).toMatchObject(seo)
  })

  it('degrades a malformed seo block to null instead of failing the feed', () => {
    expect(PublicJobSchema.parse({ ...raw(), seo: { keywords: 'not-an-array' } }).seo).toBeNull()
  })
})

describe('noindex', () => {
  it('drops the Google for Jobs markup', () => {
    const job = makeJob({ seo: { ...NO_SEO, noindex: true } })
    expect(buildJobPostingJsonLd(job, 'https://jkkn.ac.in/careers/x')).toBeNull()
  })

  it('keeps JobPosting title and description equal to the visible page even with an SEO title', () => {
    const job = makeJob({ title: 'Lab Assistant', description: 'Run the lab.', seo: { ...NO_SEO, title: 'Lab Assistant Job in Komarapalayam' } })
    const ld = buildJobPostingJsonLd(job, 'https://jkkn.ac.in/careers/x')!
    expect(ld.title).toBe('Lab Assistant')
    expect(ld.description).toBe('Run the lab.')
  })
})
