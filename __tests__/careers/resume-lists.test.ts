import { describe, expect, it } from 'vitest'
import {
  EMPTY_RESUME_LISTS, RESUME_LIST_FIELD_MAX_CHARS, RESUME_LIST_LIMITS,
  educationItemWouldBeDropped, listsFromFill, resumeListsAreEmpty,
  serializeResumeLists, workItemWouldBeDropped,
} from '@/lib/utils/resume-lists'

describe('listsFromFill', () => {
  it('maps MyJKKN fill keys onto editable rows', () => {
    const l = listsFromFill({
      work_history: [{ employer: 'ABC College', role: 'Assistant Professor', from: '2019-06', to: 'present' }],
      education: [{ degree: 'M.Pharm', subject: 'Pharmaceutics', institution: 'JKKN', year: 2021 }],
      skills: ['HPLC', 'Teaching'],
    })
    expect(l.work_history).toEqual([
      { employer: 'ABC College', role: 'Assistant Professor', from: '2019-06', to: 'present' },
    ])
    expect(l.education).toEqual([
      { degree: 'M.Pharm', subject: 'Pharmaceutics', institution: 'JKKN', year: '2021' },
    ])
    expect(l.skills).toBe('HPLC, Teaching')
  })

  it('reads skills as a comma-separated line too, de-duplicated case-insensitively', () => {
    expect(listsFromFill({ skills: 'HPLC, teaching , HPLC' }).skills).toBe('HPLC, teaching')
  })

  it('is empty for a reading with no lists, null, or junk', () => {
    expect(listsFromFill(null)).toEqual(EMPTY_RESUME_LISTS)
    expect(listsFromFill({})).toEqual(EMPTY_RESUME_LISTS)
    expect(listsFromFill({ work_history: 'nope', education: 7, skills: {} })).toEqual(EMPTY_RESUME_LISTS)
    expect(listsFromFill({ work_history: [null, 'x', []] })).toEqual(EMPTY_RESUME_LISTS)
  })

  it('holds MyJKKN caps so the editor can never start over them', () => {
    const l = listsFromFill({
      work_history: Array.from({ length: 40 }, (_, i) => ({ employer: `E${i}` })),
      education: Array.from({ length: 40 }, (_, i) => ({ degree: `D${i}` })),
      skills: Array.from({ length: 80 }, (_, i) => `s${i}`),
    })
    expect(l.work_history).toHaveLength(RESUME_LIST_LIMITS.workItems)
    expect(l.education).toHaveLength(RESUME_LIST_LIMITS.educationItems)
    expect(l.skills.split(', ')).toHaveLength(RESUME_LIST_LIMITS.skills)
  })

  it('trims each field to its own cap and collapses whitespace', () => {
    const l = listsFromFill({
      work_history: [{ employer: `  ${'e'.repeat(400)}  `, role: 'a\n\nb' }],
      education: [{ degree: 'D', institution: 'i'.repeat(400) }],
    })
    expect(l.work_history[0].employer).toHaveLength(RESUME_LIST_LIMITS.employer)
    expect(l.work_history[0].role).toBe('a b')
    expect(l.education[0].institution).toHaveLength(RESUME_LIST_LIMITS.institution)
  })

  it('drops a row MyJKKN would drop anyway — dates with no employer or role', () => {
    expect(listsFromFill({ work_history: [{ from: '2019', to: '2020' }] }).work_history).toHaveLength(1)
    expect(listsFromFill({ work_history: [{ from: '', to: '' }] }).work_history).toHaveLength(0)
  })
})

describe('would-be-dropped hints', () => {
  it('warns on a part-filled row MyJKKN will discard, and stays quiet on an empty one', () => {
    expect(workItemWouldBeDropped({ employer: '', role: '', from: '2019', to: '' })).toBe(true)
    expect(workItemWouldBeDropped({ employer: 'ABC', role: '', from: '', to: '' })).toBe(false)
    expect(workItemWouldBeDropped({ employer: '', role: '', from: '', to: '' })).toBe(false)
    expect(educationItemWouldBeDropped({ degree: '', subject: 'Maths', institution: '', year: '' })).toBe(true)
    expect(educationItemWouldBeDropped({ degree: 'B.Sc', subject: '', institution: '', year: '' })).toBe(false)
    expect(educationItemWouldBeDropped({ degree: '', subject: '', institution: '', year: '' })).toBe(false)
  })
})

describe('resumeListsAreEmpty', () => {
  it('is true for nothing typed and for blank rows', () => {
    expect(resumeListsAreEmpty(EMPTY_RESUME_LISTS)).toBe(true)
    expect(resumeListsAreEmpty({
      work_history: [{ employer: '', role: '', from: '', to: '' }],
      education: [{ degree: '', subject: '', institution: '', year: '' }],
      skills: '   ',
    })).toBe(true)
  })
  it('is false as soon as one value is real', () => {
    expect(resumeListsAreEmpty({ ...EMPTY_RESUME_LISTS, skills: 'HPLC' })).toBe(false)
  })
})

describe('serializeResumeLists', () => {
  it('sends work_history and education as JSON arrays and skills as a line', () => {
    const out = serializeResumeLists({
      work_history: [{ employer: 'ABC', role: 'AP', from: '2019', to: 'present' }],
      education: [{ degree: 'M.Pharm', subject: 'Pharmaceutics', institution: 'JKKN', year: '2021' }],
      skills: 'HPLC, Teaching',
    })
    expect(JSON.parse(out.work_history)).toEqual([{ employer: 'ABC', role: 'AP', from: '2019', to: 'present' }])
    expect(JSON.parse(out.education)).toEqual([
      { degree: 'M.Pharm', subject: 'Pharmaceutics', institution: 'JKKN', year: '2021' },
    ])
    expect(out.skills).toBe('HPLC, Teaching')
  })

  it('leaves a key out entirely rather than sending an empty one', () => {
    expect(serializeResumeLists(EMPTY_RESUME_LISTS)).toEqual({})
    expect(serializeResumeLists({
      work_history: [{ employer: '', role: '', from: '', to: '' }],
      education: [],
      skills: '  ',
    })).toEqual({})
  })

  it('drops blank rows the applicant added but never filled', () => {
    const out = serializeResumeLists({
      work_history: [{ employer: 'ABC', role: '', from: '', to: '' }, { employer: '', role: '', from: '', to: '' }],
      education: [],
      skills: '',
    })
    expect(JSON.parse(out.work_history)).toHaveLength(1)
  })

  it('leaves out a field over the 20,000-character limit, which MyJKKN would drop whole', () => {
    const huge = Array.from({ length: RESUME_LIST_LIMITS.workItems }, () => ({
      employer: 'e'.repeat(RESUME_LIST_LIMITS.employer),
      role: 'r'.repeat(RESUME_LIST_LIMITS.role),
      from: '2019', to: '2020',
    }))
    const out = serializeResumeLists({ work_history: huge, education: [], skills: 'HPLC' })
    const length = JSON.stringify(huge).length
    expect(length).toBeLessThan(RESUME_LIST_FIELD_MAX_CHARS)
    expect(out.work_history).toBeDefined()
    expect(out.skills).toBe('HPLC')
  })

  it('caps the rows it sends at MyJKKN limits', () => {
    const out = serializeResumeLists({
      work_history: Array.from({ length: 40 }, (_, i) => ({ employer: `E${i}`, role: '', from: '', to: '' })),
      education: Array.from({ length: 40 }, (_, i) => ({ degree: `D${i}`, subject: '', institution: '', year: '' })),
      skills: '',
    })
    expect(JSON.parse(out.work_history)).toHaveLength(RESUME_LIST_LIMITS.workItems)
    expect(JSON.parse(out.education)).toHaveLength(RESUME_LIST_LIMITS.educationItems)
  })
})
