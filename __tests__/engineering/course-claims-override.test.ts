// F10 of the engineering perception audit (2026-11-21): course pages carry no per-role salary ranges and no
// unsupported research / partnership claims.
import { describe, expect, it } from 'vitest'
import { BE_IT_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-it-data'
import { beMechanicalCourseData } from '@/lib/cms/templates/engineering/be-mechanical-data'
import { withVerifiedItClaims, withVerifiedMechanicalClaims } from '@/lib/institutions/engineering/course-claims-override'

describe('B.Tech IT page', () => {
  const out = withVerifiedItClaims(BE_IT_SAMPLE_DATA)

  it('shows no LPA range on any career card', () => {
    expect(JSON.stringify(out.careerPaths)).not.toMatch(/LPA/)
    expect(out.careerPaths).toHaveLength(BE_IT_SAMPLE_DATA.careerPaths.length)
  })

  it('keeps the placement FAQ free of placement numbers (user choice 2026-11-24)', () => {
    const faq = out.faqs.find((f) => /placement support/i.test(f.question))
    expect(faq?.answer).toContain('Training & Placement Cell')
    expect(faq?.answer).not.toMatch(/NIRF|23 of|₹|LPA/)
    expect(out.faqs).toEqual(BE_IT_SAMPLE_DATA.faqs)
  })

  it('does not change the source data', () => {
    expect(JSON.stringify(BE_IT_SAMPLE_DATA.careerPaths)).toMatch(/₹10-30 LPA/)
  })
})

describe('B.E. Mechanical page', () => {
  const text = JSON.stringify(withVerifiedMechanicalClaims(beMechanicalCourseData).benefits)

  it('drops the funded-research and leading-partner claims', () => {
    expect(text).not.toMatch(/funded by government agencies/)
    expect(text).not.toMatch(/Strong partnerships with leading/)
    expect(text).not.toMatch(/active research/)
  })

  it('keeps every benefit card', () => {
    expect(withVerifiedMechanicalClaims(beMechanicalCourseData).benefits).toHaveLength(beMechanicalCourseData.benefits.length)
  })
})
