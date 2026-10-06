import { describe, expect, it } from 'vitest'
import {
  buildFaqJsonLd, buildLandingJsonLd, buildTeachingFaqs, buildTeachingLanding, groupNote, teachingBucket,
  type LandingJob,
} from '@/lib/utils/careers-landing'

const job = (title: string, over: Partial<LandingJob> = {}): LandingJob => ({
  title, roleCategory: 'teaching_faculty', qualification: '', experience: '', closesAt: null, ...over,
})

describe('careers-landing', () => {
  it('sorts faculty grades by title, including the misspelt ones on the live feed', () => {
    expect(teachingBucket(job('Assistant Professor - Physics'))).toBe('assistant-professor')
    expect(teachingBucket(job('Asst Prof - Pharmacology - Cop'))).toBe('assistant-professor')
    expect(teachingBucket(job('AP - ECE - CET - Asst Prof'))).toBe('assistant-professor')
    expect(teachingBucket(job('Assistant Profesor- Pedagogy of History'))).toBe('assistant-professor')
    expect(teachingBucket(job('Associate Prfessor'))).toBe('professor')
    expect(teachingBucket(job('Assoicate Professor'))).toBe('professor')
    expect(teachingBucket(job('Profeesor'))).toBe('professor')
    expect(teachingBucket(job('Professor of Practice'))).toBe('professor')
    expect(teachingBucket(job('Senior Lecturer'))).toBe('lecturer')
    expect(teachingBucket(job('Reader - Phd - Dch'))).toBe('lecturer')
    expect(teachingBucket(job('Nursing Tutor'))).toBe('tutor')
  })

  it('recognises a faculty grade outside the teaching category, but never in leadership', () => {
    expect(teachingBucket(job('Lecturer with MBBS', { roleCategory: 'medical' }))).toBe('lecturer')
    expect(teachingBucket(job('Professor', { roleCategory: 'senior_leadership' }))).toBeNull()
  })

  it('groups school and trainer roles, and leaves non-teaching roles out', () => {
    expect(teachingBucket(job('Post Graduate Assistant in Maths'))).toBe('higher-secondary')
    expect(teachingBucket(job('B T Assistant in Biology'))).toBe('high-school')
    expect(teachingBucket(job('Secondary School Teacher - Physics'))).toBe('high-school')
    expect(teachingBucket(job('Computer Teacher'))).toBe('high-school')
    expect(teachingBucket(job('Aptitude Trainer'))).toBe('trainers')
    expect(teachingBucket(job('Physical Educator'))).toBe('trainers')
    expect(teachingBucket(job('Kg Teacher'))).toBe('primary')
    expect(teachingBucket(job('Vice Principal'))).toBeNull()
    expect(teachingBucket(job('Non teaching staff'))).toBeNull()
    expect(teachingBucket(job('Human Resources Coordinator(HR)'))).toBeNull()
    expect(teachingBucket(job('Lab Assistant'))).toBeNull()
    expect(teachingBucket(job('Senior Librarian'))).toBeNull()
    expect(teachingBucket(job('Accountant', { roleCategory: 'non_teaching' }))).toBeNull()
  })

  const board = [
    job('Primary Teacher'),
    job('B T Assistant in Tamil', { qualification: 'B.A / B.Ed', experience: '1+ years' }),
    job('B T Assistant in Maths', { qualification: 'B.Sc / B.Ed', experience: '1+ years' }),
    job('Physical Educator', { experience: 'Freshers welcome' }),
    job('Assistant Professor'),
    job('Assistant Professor - Zoology'),
    job('Professor'),
    job('Tutor'),
    job('Accountant', { roleCategory: 'non_teaching' }),
  ]

  it('builds the page from the feed: listed jobs, faculty counts and a total that adds up', () => {
    const landing = buildTeachingLanding(board)
    expect(landing.groups.map(g => [g.key, g.jobs.length])).toEqual([['primary', 1], ['high-school', 2], ['trainers', 1]])
    expect(landing.groups[1].jobs.map(j => j.title)).toEqual(['B T Assistant in Maths', 'B T Assistant in Tamil'])
    expect(landing.faculty.map(f => [f.key, f.count])).toEqual([['assistant-professor', 2], ['professor', 1], ['tutor', 1]])
    expect(landing.listed).toHaveLength(4)
    expect(landing.facultyTotal).toBe(4)
    expect(landing.total).toBe(8)
  })

  it('writes a group note only from what the listings show', () => {
    expect(groupNote([job('A', { qualification: 'B.Ed', experience: '1+ years' }), job('B')])).toBe(
      '2 roles listed. Qualification shown on the listings: B.Ed. Experience shown: 1+ years. 1 listing does not show a qualification line, so read the job description.',
    )
    expect(groupNote([job('A')])).toBe('1 role listed. 1 listing does not show a qualification line, so read the job description.')
  })

  it('answers with live counts and never mentions salary, hours or benefits', () => {
    const landing = buildTeachingLanding(board)
    const faqs = buildTeachingFaqs(landing, '6 October 2026')
    expect(faqs).toHaveLength(7)
    expect(faqs[0].answer).toContain('8 teaching openings')
    expect(faqs[1].answer).toContain('4 are school teacher, trainer and physical education roles, and 4 are college faculty roles')
    expect(faqs[2].answer).toContain('B.A / B.Ed; B.Sc / B.Ed')
    expect(faqs[3].answer).toContain('1 current listing states that freshers are welcome')
    expect(faqs[6].answer).toContain('do not show a closing date')
    const text = faqs.map(f => f.answer).join(' ').toLowerCase()
    for (const word of ['salary', 'working hours', 'pf', 'hostel']) expect(text).not.toContain(word)
  })

  it('stops saying there is no closing date once a listed job has one', () => {
    const landing = buildTeachingLanding([job('Primary Teacher', { closesAt: '2026-12-31T00:00:00Z' })])
    expect(buildTeachingFaqs(landing, '6 October 2026')[6].answer).toContain('Some listings show a closing date')
  })

  it('emits ItemList for the listed jobs and no JobPosting on the list page', () => {
    const pageUrl = 'https://www.jkkn.ac.in/careers/teaching-jobs'
    const ld = buildLandingJsonLd({
      pageUrl, name: 'Teaching Jobs', description: 'd', crumb: 'Teaching Jobs',
      jobs: [{ title: 'Primary Teacher', url: 'https://www.jkkn.ac.in/careers/primary-teacher-1' }],
    })
    expect(ld.map(x => x['@type'])).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList'])
    expect(ld[0].mainEntity).toEqual({ '@id': `${pageUrl}#jobs` })
    expect(JSON.stringify(ld)).not.toContain('JobPosting')
    const empty = buildLandingJsonLd({ pageUrl, name: 'Teaching Jobs', description: 'd', crumb: 'Teaching Jobs', jobs: [] })
    expect(empty.map(x => x['@type'])).toEqual(['CollectionPage', 'BreadcrumbList'])
    expect(empty[0].mainEntity).toBeUndefined()
    expect(buildFaqJsonLd([{ question: 'Q', answer: 'A' }])).toMatchObject({
      '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'Q', acceptedAnswer: { '@type': 'Answer', text: 'A' } }],
    })
  })
})
