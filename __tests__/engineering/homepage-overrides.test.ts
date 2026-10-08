import { describe, expect, it } from 'vitest'
import {
  applyEngineeringHomepageOverrides,
  applyEngineeringHomepageSeoOverrides,
  applyEngineeringLogoAltOverride,
} from '@/lib/institutions/engineering/homepage-overrides'
// The ten homepage blocks exactly as the live page served them on 2026-10-08, and the
// state the overrides are meant to produce from them.
import liveBlocks from './fixtures/homepage-blocks-2026-10-08.before.json'
import expectedBlocks from './fixtures/homepage-blocks-2026-10-08.expected.json'

type Block = (typeof liveBlocks)[number]

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
const propsOf = (blocks: Block[], name: string) =>
  blocks.find((block) => block.component_name === name)!.props as Record<string, unknown>

const OLD_META =
  'JKKNCET — one of the best private engineering colleges in Tamilnadu. A top engineering college with NAAC accreditation, excellent placements & affordable fees.'
const NEW_META =
  'JKKNCET (Autonomous) — one of the best private engineering colleges in Tamilnadu. AICTE approved, affiliated to Anna University, Chennai, and NAAC accredited.'

describe('engineering homepage block overrides', () => {
  it('turns the live blocks into the planned state', () => {
    expect(applyEngineeringHomepageOverrides(clone(liveBlocks))).toEqual(expectedBlocks)
  })

  it('does not mutate the blocks it is given', () => {
    const input = clone(liveBlocks)
    applyEngineeringHomepageOverrides(input)
    expect(input).toEqual(liveBlocks)
  })

  it('is a no-op once the CMS already holds the new wording', () => {
    const once = applyEngineeringHomepageOverrides(clone(liveBlocks))
    expect(applyEngineeringHomepageOverrides(once)).toEqual(once)
    expect(applyEngineeringHomepageOverrides(clone(expectedBlocks))).toEqual(expectedBlocks)
  })

  it('lets a CMS edit win over the rule for that field only', () => {
    const edited = clone(liveBlocks)
    propsOf(edited, 'EngineeringHeroSection').badge = 'Edited in the CMS'
    const result = applyEngineeringHomepageOverrides(edited)
    expect(propsOf(result, 'EngineeringHeroSection').badge).toBe('Edited in the CMS')
    expect(propsOf(result, 'EngineeringAboutSection').title).toBe(
      'Welcome to JKKN College of Engineering and Technology (Autonomous)'
    )
  })

  it('leaves the approved-by strip alone when its list was changed in the CMS', () => {
    const edited = clone(liveBlocks)
    const strip = propsOf(edited, 'EngineeringAccreditationsBar')
    ;(strip.accreditations as unknown[]).pop()
    const result = applyEngineeringHomepageOverrides(edited)
    expect(propsOf(result, 'EngineeringAccreditationsBar').accreditations).toHaveLength(2)
  })

  it('adds the autonomous question once, right after the approval question', () => {
    const faqs = propsOf(applyEngineeringHomepageOverrides(clone(liveBlocks)), 'FAQAccordion').faqs as {
      question: string
    }[]
    const questions = faqs.map((faq) => faq.question)
    expect(questions).toHaveLength(9)
    expect(questions[1]).toBe('Is JKKN Engineering College AICTE approved?')
    expect(questions[2]).toBe('Is JKKN College of Engineering and Technology an autonomous college?')
    expect(questions.filter((question) => /autonomous college/.test(question))).toHaveLength(1)
  })

  it('touches no block of another component', () => {
    const others = [{ component_name: 'HeroSection', props: { badge: 'AICTE Approved | Anna University Affiliated | NAAC Accredited' } }]
    expect(applyEngineeringHomepageOverrides(others)).toEqual(others)
  })
})

describe('engineering homepage SEO and logo overrides', () => {
  it('swaps the description and its share-text copies, and nothing else', () => {
    const row = { meta_title: 'Best Private Engineering Colleges in Tamilnadu | JKKNCET', meta_description: OLD_META, og_description: OLD_META, twitter_description: null }
    expect(applyEngineeringHomepageSeoOverrides(row)).toEqual({
      ...row,
      meta_description: NEW_META,
      og_description: NEW_META,
    })
  })

  it('keeps a description that was edited in the CMS', () => {
    const row = { meta_description: 'Edited in the CMS', og_description: null }
    expect(applyEngineeringHomepageSeoOverrides(row)).toEqual(row)
  })

  it('passes a missing SEO row through', () => {
    expect(applyEngineeringHomepageSeoOverrides(undefined)).toBeUndefined()
    expect(applyEngineeringHomepageSeoOverrides(null)).toBeNull()
  })

  it('renames only the known logo alt text', () => {
    expect(applyEngineeringLogoAltOverride('JKKN Engineering College')).toBe(
      'JKKN College of Engineering and Technology (Autonomous)'
    )
    expect(applyEngineeringLogoAltOverride('Something else')).toBe('Something else')
  })
})
