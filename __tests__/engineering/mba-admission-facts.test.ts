// Step 6 of the 10,300-lead plan (GL6-376, 2026-11-03): the Engineering MBA pages state only what official
// sources say - TN MBA / MCA Admissions 2026 (eligibility, TANCET for Government Quota, code 2647) - and name no
// exam for Management Quota, which no official document covers for this college.
import { describe, expect, it } from 'vitest'
import { MBA_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'
import { MBA_SAMPLE_DATA } from '@/lib/cms/templates/mba-data'
import {
  MBA_ELIGIBILITY,
  MBA_ME_CARD_CRITERIA,
  officialPgCriteria,
} from '@/lib/institutions/engineering/mba-admission-facts'
import { withOfficialMbaText } from '@/lib/institutions/engineering/admissions-mba-override'
import {
  ADMISSION_STEPS,
  DETAILED_ELIGIBILITY,
  REQUIRED_DOCUMENTS,
} from '@/lib/institutions/engineering/admissions-data'

const UNSOURCED = [
  /\bCAT\b/,
  /\bXAT\b/,
  /\bCMAT\b/,
  /\bATMA\b/,
  /\bMAT\b/,
  /group discussion/i,
  /\bGD\b/,
  /without entrance learning assessment/i,
  /score preferred/i,
]

function text(value: unknown): string {
  return JSON.stringify(value, (_k, v) => (typeof v === 'function' ? undefined : v))
}

describe('MBA admission pages', () => {
  for (const [name, data] of [
    ['/admissions/mba', MBA_ADMISSION],
    ['/courses-offered/pg/mba', MBA_SAMPLE_DATA],
  ] as const) {
    it(`${name}: no unsourced entrance or selection claim`, () => {
      const t = text(data)
      for (const re of UNSOURCED) expect(t).not.toMatch(re)
    })

    it(`${name}: carries the official facts`, () => {
      const t = text(data)
      expect(t).toContain('TANCET (MBA)')
      expect(t).toContain('2647')
      expect(t).toContain('45% for Tamil Nadu candidates of the BC, BCM, MBC & DNC, SC, SCA and ST communities')
      expect(t).toContain('Management Quota')
    })
  }

  it('the eligibility sentence matches the TN rule: 3-year degree, 50%, 45% for the listed communities', () => {
    expect(MBA_ELIGIBILITY).toMatch(/at least 3 years/)
    expect(MBA_ELIGIBILITY).toMatch(/50% marks/)
  })

  it('no FAQ answer ends with a doubled full stop', () => {
    for (const faq of [...MBA_ADMISSION.faqs, ...(MBA_SAMPLE_DATA.faqs ?? [])]) {
      expect(faq.answer).not.toMatch(/\.\.\s*$/)
    }
  })
})

describe('homepage admission card', () => {
  it('replaces the old CMS "MBA / M.E" lines with the official ones', () => {
    const cms = [
      "Bachelor's degree in any discipline with 50% marks",
      'Valid TANCET / CAT / MAT / XAT score',
      'Group discussion and personal interview clearance',
    ]
    expect(officialPgCriteria(cms)).toEqual([...MBA_ME_CARD_CRITERIA])
  })

  it('leaves every other card alone', () => {
    const ug = ['Passed 10+2 with Physics, Chemistry, and Mathematics', 'Valid TNEA counselling rank or direct admission']
    expect(officialPgCriteria(ug)).toEqual(ug)
  })
})

describe('admissions hub (Supabase site_settings rows)', () => {
  // The four lines as they were live on https://engg.jkkn.ac.in/admissions on 2026-11-03 after 20fca53.
  const dbRows = {
    eligibility: [
      {
        programme: 'For M.E Computer Science & Engineering',
        criteria: ['Minimum 50% aggregate marks in the qualifying degree', 'TANCET score preferred; direct merit-based admission also available'],
      },
      {
        programme: 'For M.B.A — Master of Business Administration',
        criteria: [
          'Bachelor’s degree in any discipline from a recognized university',
          'Minimum 50% aggregate marks in the qualifying degree',
          'Valid score in TANCET / CAT / MAT / XAT (any one)',
          'Shortlisted candidates appear for Group Discussion (GD) + Personal Interview (PI)',
        ],
      },
    ],
    steps: [
      { number: 4, title: 'Application Screening', description: 'The admissions team verifies eligibility and document completeness.' },
      {
        number: 5,
        title: 'Counselling & Selection',
        description:
          'UG candidates attend TNEA counselling conducted by Anna University. Management Quota and PG candidates attend direct counselling / GD+PI at the JKKN campus.',
      },
    ],
    documents: {
      common: [{ name: 'Aadhaar Card' }],
      ugOnly: [{ name: 'TNEA Rank Card / Allotment Order', note: 'For TNEA counselling seats' }],
      pgOnly: [
        { name: 'Degree Certificate & Consolidated Marksheet' },
        { name: 'TANCET / CAT / MAT / XAT Score Card' },
        { name: 'Character Certificate', note: 'From graduating college' },
      ],
    },
    overview: 'unchanged',
  }

  it('replaces the four unsourced MBA lines with the official ones', () => {
    const out = withOfficialMbaText(dbRows)
    const t = text({ e: out.eligibility[1], s: out.steps, d: out.documents.pgOnly })
    for (const re of UNSOURCED) expect(t).not.toMatch(re)
    expect(t).toContain('TANCET (MBA)')
    expect(t).toContain('2647')
    expect(out.documents.pgOnly[1]).toEqual({ name: 'TANCET (MBA) mark sheet', note: 'For MBA Government Quota seats' })
    expect(out.steps[1].title).toBe('Counselling & Selection')
  })

  it('leaves the M.E. card, other steps, other documents and other fields alone', () => {
    const out = withOfficialMbaText(dbRows)
    expect(out.eligibility[0]).toEqual(dbRows.eligibility[0])
    expect(out.steps[0]).toEqual(dbRows.steps[0])
    expect(out.documents.pgOnly[0]).toEqual(dbRows.documents.pgOnly[0])
    expect(out.documents.pgOnly[2]).toEqual(dbRows.documents.pgOnly[2])
    expect(out.documents.common).toEqual(dbRows.documents.common)
    expect(out.overview).toBe('unchanged')
  })

  it('does not change its input', () => {
    const before = JSON.stringify(dbRows)
    withOfficialMbaText(dbRows)
    expect(JSON.stringify(dbRows)).toBe(before)
  })

  it('is a no-op on the static fallback, which already carries the official text', () => {
    const fallback = { eligibility: DETAILED_ELIGIBILITY, steps: ADMISSION_STEPS, documents: REQUIRED_DOCUMENTS }
    expect(withOfficialMbaText(fallback)).toEqual(fallback)
  })
})
