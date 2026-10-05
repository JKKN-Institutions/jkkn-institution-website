import { describe, expect, it } from 'vitest'
import { buildIndex, editDistance, parseQuery, relatedJobs, search, sortHits } from '@/lib/utils/careers-search'
import { formatJobTitle, normalizeText, tokenize } from '@/lib/utils/careers-text'
import { makeJob, sampleJobs } from './fixtures'

const NOW = new Date('2026-10-05T00:00:00Z')
const index = buildIndex(sampleJobs(), NOW)

/** Titles in ranked order for a query. */
function titles(q: string): string[] {
  return sortHits(search(index, parseQuery(q)).hits, 'relevance').map(h => h.item.title)
}

describe('normalisation', () => {
  it('collapses dotted degrees into one word', () => {
    expect(normalizeText('M.Tech / Ph.D, M.D.S & Pharm.D')).toBe('mtech phd mds and pharmd')
  })
  it('folds plurals so "professors" finds "professor"', () => {
    expect(tokenize('Professors, Technologies')).toEqual(['professor', 'technology'])
  })
  it('tidies shouted titles for display but keeps acronyms and mixed case', () => {
    expect(formatJobTitle('SENIOR LECTURER')).toBe('Senior Lecturer')
    expect(formatJobTitle('CCTV MONITORING OPERATOR - Main Office')).toBe('CCTV Monitoring Operator - Main Office')
    expect(formatJobTitle('Vice Principal,')).toBe('Vice Principal')
    expect(formatJobTitle('Chief Executive Officer_JKKN Institutions')).toBe('Chief Executive Officer – JKKN Institutions')
    expect(formatJobTitle('Assistant Professor — Computer Science & Engineering')).toBe('Assistant Professor — Computer Science & Engineering')
  })
})

describe('parseQuery', () => {
  it('drops conversational filler', () => {
    expect(parseQuery('I am looking for teaching jobs in computer science').terms).toEqual(['teaching', 'computer', 'science'])
  })
  it('reads stated experience and removes it from the words', () => {
    expect(parseQuery('M.Tech CSE 3 years')).toMatchObject({ terms: ['mtech', 'cse'], years: 3 })
    expect(parseQuery('fresher computer science')).toMatchObject({ terms: ['computer', 'science'], years: 0 })
  })
  it('keeps "non teaching" distinct from "teaching"', () => {
    expect(parseQuery('non-teaching').terms).toEqual(['nonteaching'])
  })
})

describe('search', () => {
  it('scenario 1 — an exact title ranks first', () => {
    expect(titles('Assistant Professor')[0]).toBe('Assistant Professor')
    expect(titles('professor').slice(0, 2)).toEqual(['Professor', 'Professor'])
  })

  it('scenario 2 — finds a keyword that only appears in the description', () => {
    const result = search(index, parseQuery('python'))
    expect(result.mode).toBe('all')
    expect(result.hits.map(h => h.item.title)).toEqual(['Assistant Professor — Computer Science & Engineering'])
    expect(result.hits[0].reason).toBe('description')
  })

  it('scenario 3 — falls back to partial matches, most words first', () => {
    const result = search(index, parseQuery('python nursing'))
    expect(result.mode).toBe('partial')
    expect(result.hits.every(h => h.reason === 'partial')).toBe(true)
    expect(result.hits.map(h => h.item.title).sort()).toEqual(['Assistant Professor — Computer Science & Engineering', 'Nursing Tutor'])
  })

  it('scenario 4 — "M.Tech CSE" finds CSE jobs that accept M.E or M.Tech', () => {
    const found = titles('M.Tech CSE')
    expect(found).toEqual(['Assistant Professor — Computer Science & Engineering', 'Professor'])
  })

  it('scenario 5 — abbreviations match their long form', () => {
    expect(titles('MBA HR')).toEqual(['Human Resources Coordinator(HR)'])
    expect(titles('cse').length).toBe(2)
  })

  it('scenario 6 — tolerates a typo and reports the correction', () => {
    const result = search(index, parseQuery('nursng'))
    expect(result.hits.map(h => h.item.title)).toEqual(['Nursing Tutor'])
    expect(result.corrections).toEqual({ nursng: 'nursing' })
  })

  it('scenario 8 — an unknown word matches nothing', () => {
    expect(search(index, parseQuery('astronaut'))).toMatchObject({ mode: 'none', hits: [] })
  })

  it('"teaching" finds professors, but "professor" does not find every tutor', () => {
    expect(titles('teaching')).toContain('Professor')
    expect(titles('professor')).not.toContain('Nursing Tutor')
  })

  it('"non teaching" excludes teaching posts', () => {
    expect(titles('non teaching').sort()).toEqual(['Human Resources Coordinator(HR)', 'System Admin'])
  })

  it('stated experience reorders results without removing any', () => {
    const fresher = sortHits(search(index, parseQuery('fresher professor')).hits, 'relevance').map(h => h.item)
    expect(fresher).toHaveLength(search(index, parseQuery('professor')).hits.length)
    // The 0–5 year post outranks the titles that match better but need 5+ and 12+ years.
    expect(fresher[0].job.max_experience_years).toBe(5)
  })

  it('an experience-only query lists the jobs it fits', () => {
    const result = search(index, parseQuery('fresher'))
    expect(result.mode).toBe('browse')
    expect(result.hits.map(h => h.item.title).sort()).toEqual(['Assistant Professor', 'Human Resources Coordinator(HR)'])
  })

  it('does not treat two-letter words in prose as degrees or disciplines', () => {
    const idx = buildIndex([makeJob({ title: 'Clerk', description: 'It will be me.' })], NOW)
    expect(search(idx, parseQuery('IT')).mode).toBe('none')
  })
})

describe('sortHits', () => {
  it('orders by date with undated jobs last either way', () => {
    const hits = search(index, parseQuery('')).hits
    const newest = sortHits(hits, 'newest').map(h => h.item.title)
    const oldest = sortHits(hits, 'oldest').map(h => h.item.title)
    expect(newest[0]).toBe('Assistant Professor — Computer Science & Engineering')
    expect(newest.at(-1)).toBe('System Admin')
    expect(oldest[0]).toBe('Professor')
    expect(oldest.at(-1)).toBe('System Admin')
  })
})

describe('relatedJobs', () => {
  it('prefers the same department', () => {
    const source = index.jobs.find(i => i.title === 'Assistant Professor — Computer Science & Engineering')!
    const related = relatedJobs(index, source.job.id)
    expect(related[0].job.department?.name).toBe('Computer Science and Engineering')
    expect(related.every(r => r.job.id !== source.job.id)).toBe(true)
  })
})

describe('editDistance', () => {
  it('counts a transposition as one edit and stops past the limit', () => {
    expect(editDistance('nusring', 'nursing', 1)).toBe(1)
    expect(editDistance('abc', 'xyz', 1)).toBe(2)
  })
})
