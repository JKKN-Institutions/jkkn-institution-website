import { describe, expect, it } from 'vitest'
import {
  applyEngineeringHomepageOverrides,
  applyEngineeringHomepageSeoOverrides,
  applyEngineeringLogoAltOverride,
} from '@/lib/institutions/engineering/homepage-overrides'
// The ten homepage blocks exactly as the live page served them on 2026-10-08 (still the same on
// 2026-10-29: 232 of 240 strings found in the live payload, the other 8 are the swapped ones), and
// the state the overrides are meant to produce from them.
import liveBlocks from './fixtures/homepage-blocks-2026-10-08.before.json'
import expectedBlocks from './fixtures/homepage-blocks-2026-10-08.expected.json'

type Block = (typeof liveBlocks)[number]

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
const propsOf = (blocks: Block[], name: string) =>
  blocks.find((block) => block.component_name === name)!.props as Record<string, unknown>

const OLD_META =
  'JKKNCET — one of the best private engineering colleges in Tamilnadu. A top engineering college with NAAC accreditation, excellent placements & affordable fees.'
const OCT08_META =
  'JKKNCET (Autonomous) — one of the best private engineering colleges in Tamilnadu. AICTE approved, affiliated to Anna University, Chennai, and NAAC accredited.'
const NEW_META =
  'JKKNCET (Autonomous) — one of the best private engineering colleges in Tamilnadu. AICTE approved, affiliated to Anna University, Chennai, NAAC accredited (B+).'

describe('engineering homepage official-data rules (2026-10-29)', () => {
  const result = applyEngineeringHomepageOverrides(clone(liveBlocks))
  const text = JSON.stringify(result)

  it('leaves none of the claims the official documents contradict', () => {
    for (const claim of ['95%', '3000', 'Artificial Intelligence & Machine Learning', 'Civil Engineering', 'MCA', 'LPA', 'NAAC Accredited Programs', 'National Board of Accreditation']) {
      expect(text).not.toContain(claim)
    }
  })

  it('shows the AICTE 2026-27 intake on every programme card', () => {
    const programs = propsOf(result, 'EngineeringProgramsSection').programs as { link: string; seats: number }[]
    const seats = Object.fromEntries(programs.map((program) => [program.link, program.seats]))
    expect(seats).toEqual({
      '/courses-offered/ug/be-cse': 60,
      '/courses-offered/ug/be-ece': 60,
      '/courses-offered/ug/be-mechanical': 60,
      '/courses-offered/ug/be-eee': 60,
      '/courses-offered/ug/btech-it': 60,
      '/courses-offered/pg/mba': 60,
      '/courses-offered/pg/me-cse': 12,
    })
    expect(Object.values(seats).reduce((sum, value) => sum + value, 0)).toBe(372)
  })

  it('keeps hero stats and counters that were changed in the CMS', () => {
    const edited = clone(liveBlocks)
    const stats = propsOf(edited, 'EngineeringHeroSection').stats as { value: number }[]
    stats[0].value = 607
    const counters = propsOf(edited, 'EngineeringPlacementsSection').stats as { value: number }[]
    counters[0].value = 43
    const out = applyEngineeringHomepageOverrides(edited)
    expect(propsOf(out, 'EngineeringHeroSection').stats).toEqual(stats)
    expect(propsOf(out, 'EngineeringPlacementsSection').stats).toEqual(counters)
  })

  it('keeps a seat count that was corrected in the CMS', () => {
    const edited = clone(liveBlocks)
    const programs = propsOf(edited, 'EngineeringProgramsSection').programs as { link: string; seats: number }[]
    programs.find((program) => program.link === '/courses-offered/pg/mba')!.seats = 90
    const out = propsOf(applyEngineeringHomepageOverrides(edited), 'EngineeringProgramsSection').programs as {
      link: string
      seats: number
    }[]
    expect(out.find((program) => program.link === '/courses-offered/pg/mba')!.seats).toBe(90)
  })

  it('also upgrades the 2026-10-08 wording if the CMS row already holds it', () => {
    const fromOct08 = applyEngineeringHomepageOverrides(clone(expectedBlocks))
    expect(propsOf(fromOct08, 'EngineeringHeroSection').badge).toBe(
      'AICTE Approved | Autonomous | Anna University Affiliated | NAAC Accredited (B+)'
    )
    const oct08Faqs = clone(liveBlocks)
    const faqs = propsOf(oct08Faqs, 'FAQAccordion').faqs as { question: string; answer: string }[]
    faqs[1].answer =
      'Yes. JKKN College of Engineering and Technology is approved by AICTE (All India Council for Technical Education) and affiliated to Anna University, Chennai. It is an autonomous institution, with autonomous status conferred by UGC, New Delhi and Anna University, Chennai, and it is NAAC accredited.'
    const out = propsOf(applyEngineeringHomepageOverrides(oct08Faqs), 'FAQAccordion').faqs as { answer: string }[]
    expect(out[1].answer).toContain('accredited by NAAC with Grade B+')
  })

  it('swaps the AI & ML question only together with its old answer', () => {
    const edited = clone(liveBlocks)
    const faqs = propsOf(edited, 'FAQAccordion').faqs as { question: string; answer: string }[]
    const aiml = faqs.find((faq) => faq.question === 'Does JKKN offer AI and Machine Learning courses?')!
    aiml.answer = 'Edited in the CMS'
    const out = propsOf(applyEngineeringHomepageOverrides(edited), 'FAQAccordion').faqs as { question: string; answer: string }[]
    expect(out.find((faq) => faq.answer === 'Edited in the CMS')!.question).toBe(
      'Does JKKN offer AI and Machine Learning courses?'
    )
  })
})

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

  it('upgrades the 2026-10-08 description too', () => {
    expect(applyEngineeringHomepageSeoOverrides({ meta_description: OCT08_META })).toEqual({ meta_description: NEW_META })
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
