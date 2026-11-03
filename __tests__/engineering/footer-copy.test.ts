// Step 5 of the 10,300-lead plan (2026-11-03): the Engineering footer's unsourced ranking line
// ("recognized as one of the best engineering colleges in Erode Region") is replaced by facts.
import { describe, expect, it } from 'vitest'
import { withoutUnsourcedFooterClaim } from '@/lib/institutions/engineering/footer-copy'

describe('footer description', () => {
  const cms =
    'JKKN College of Engineering and Technology, recognized as one of the best engineering colleges in Erode Region, is committed to providing quality technical education.'

  it('replaces the unsourced ranking clause with facts', () => {
    const out = withoutUnsourcedFooterClaim(cms)
    expect(out).not.toMatch(/best engineering colleges/i)
    expect(out).toBe(
      'JKKN College of Engineering and Technology, an autonomous college in Komarapalayam approved by AICTE and affiliated to Anna University, Chennai, is committed to providing quality technical education.'
    )
  })

  it('leaves other text and empty values alone', () => {
    expect(withoutUnsourcedFooterClaim('JKKN Institutions is committed to quality.')).toBe(
      'JKKN Institutions is committed to quality.'
    )
    expect(withoutUnsourcedFooterClaim(undefined)).toBeUndefined()
    expect(withoutUnsourcedFooterClaim('')).toBe('')
  })
})
