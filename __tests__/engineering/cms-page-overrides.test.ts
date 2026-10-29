import { describe, expect, it } from 'vitest'
import {
  applyEngineeringCmsPageOverrides,
  applyEngineeringCmsSeoOverrides,
} from '@/lib/institutions/engineering/cms-page-overrides'
import {
  APPROVALS_DIRECT_ANSWER,
  APPROVALS_FAQS,
  APPROVALS_KEY_FACTS,
} from '@/lib/institutions/engineering/official-data'
// The ApprovalsAffiliationSection block exactly as /approvals-and-affiliation served it on 2026-10-29.
import liveApprovals from './fixtures/approvals-block-2026-10-29.json'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
type Props = Record<string, unknown>
type Doc = { id: string; pdfUrl: string; buttonLabel: string }
type Section = { id: string; title: string; documents: Doc[] }

const words = (text: string) => text.trim().split(/\s+/).length

describe('engineering /approvals-and-affiliation overrides', () => {
  const [out] = applyEngineeringCmsPageOverrides('approvals-and-affiliation', [clone(liveApprovals)])
  const props = out.props as Props
  const sections = props.sections as Section[]

  it('no longer labels the Anna University order as an AICTE EOA', () => {
    const eoa = sections.find((section) => section.id === '1')!
    expect(eoa.documents.map((doc) => doc.buttonLabel)).toEqual([
      'AICTE EOA 2026-2027',
      'AICTE EOA 2025-2026',
      'AICTE EOA 2024-2025',
      'Older EOA letters',
    ])
    expect(eoa.documents.some((doc) => doc.pdfUrl.includes('Anna-University'))).toBe(false)
    expect(sections.find((section) => section.id === '2')!.title).toBe('Anna University Affiliation Orders')
  })

  it('keeps the affiliation and RTI documents untouched', () => {
    const before = liveApprovals.props.sections
    expect(sections[1].documents).toEqual(before[1].documents)
    expect(sections[2]).toEqual(before[2])
  })

  it('puts the direct answer under a renamed H1', () => {
    expect(props.pageTitle).toBe('Approvals, Affiliation and Official Data')
    expect(props.pageSubtitle).toBe(APPROVALS_DIRECT_ANSWER)
    expect(words(APPROVALS_DIRECT_ANSWER)).toBeGreaterThanOrEqual(40)
    expect(words(APPROVALS_DIRECT_ANSWER)).toBeLessThanOrEqual(55)
  })

  it('lets CMS edits win', () => {
    const edited = clone(liveApprovals)
    ;(edited.props as Props).pageSubtitle = 'Edited in the CMS'
    ;(edited.props.sections[0].documents as Doc[]).pop()
    const [result] = applyEngineeringCmsPageOverrides('approvals-and-affiliation', [edited])
    expect((result.props as Props).pageSubtitle).toBe('Edited in the CMS')
    expect(((result.props as Props).sections as Section[])[0].documents).toHaveLength(1)
  })

  it('does nothing to the same block on another page', () => {
    const block = clone(liveApprovals)
    expect(applyEngineeringCmsPageOverrides('approvals', [block])).toEqual([liveApprovals])
  })

  it('swaps the page title and description, and their share copies', () => {
    const oldTitle = 'Approvals & Affiliation — JKKN Engineering | AICTE, Anna University'
    const oldDescription =
      'JKKN College of Engineering is AICTE approved, Anna University affiliated, and NAAC accredited. View all regulatory approvals, affiliations, and compliance certificates.'
    const seo = applyEngineeringCmsSeoOverrides('approvals-and-affiliation', {
      meta_title: oldTitle,
      meta_description: oldDescription,
      og_title: null,
      twitter_description: oldDescription,
      canonical_url: 'https://engg.jkkn.ac.in/approvals-and-affiliation',
    })!
    expect(seo.meta_title).toBe('Approvals, NAAC and Official Codes | JKKN Engineering')
    expect(seo.meta_title.length).toBeGreaterThanOrEqual(50)
    expect(seo.meta_title.length).toBeLessThanOrEqual(60)
    expect(seo.meta_description.length).toBeGreaterThanOrEqual(140)
    expect(seo.meta_description.length).toBeLessThanOrEqual(160)
    expect(seo.twitter_description).toBe(seo.meta_description)
    expect(seo.og_title).toBeNull()
    expect(seo.canonical_url).toBe('https://engg.jkkn.ac.in/approvals-and-affiliation')
    expect(applyEngineeringCmsSeoOverrides('fee-structure', { meta_title: oldTitle })).toEqual({ meta_title: oldTitle })
  })
})

describe('engineering AdmissionHero trust badges', () => {
  const hero = { component_name: 'AdmissionHero', props: { title: 'JKKN College of Engineering — Fee Structure' } }

  it('replaces the component defaults ("UGC Recognized", NAAC twice) with sourced badges', () => {
    const [out] = applyEngineeringCmsPageOverrides('fee-structure', [clone(hero)])
    expect((out.props as Props).trustBadges).toEqual([
      { icon: 'check', label: 'AICTE Approved' },
      { icon: 'check', label: 'Anna University Affiliated' },
      { icon: 'check', label: 'NAAC Accredited (B+)' },
      { icon: 'check', label: 'Listed by UGC under Section 2(f)' },
    ])
  })

  it('keeps badges set in the CMS', () => {
    const own = { component_name: 'AdmissionHero', props: { trustBadges: [{ icon: 'check', label: 'Own' }] } }
    expect(applyEngineeringCmsPageOverrides('fee-structure', [clone(own)])).toEqual([own])
  })
})

describe('engineering official data copy', () => {
  it('gives every key fact a source line', () => {
    for (const fact of APPROVALS_KEY_FACTS) expect(fact.source).toMatch(/^Source: /)
  })

  it('keeps every FAQ answer between 40 and 55 words', () => {
    for (const faq of APPROVALS_FAQS) {
      expect(words(faq.answer)).toBeGreaterThanOrEqual(40)
      expect(words(faq.answer)).toBeLessThanOrEqual(55)
    }
  })

  it('says nothing about an effective year, syllabus or examinations', () => {
    const text = JSON.stringify([APPROVALS_DIRECT_ANSWER, APPROVALS_KEY_FACTS, APPROVALS_FAQS])
    for (const banned of ['w.e.f', '2029', 'syllabus', 'examination', 'own curriculum']) {
      expect(text.toLowerCase()).not.toContain(banned)
    }
  })
})
