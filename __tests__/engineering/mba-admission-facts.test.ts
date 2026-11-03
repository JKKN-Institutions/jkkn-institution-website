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
