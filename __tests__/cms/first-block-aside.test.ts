// www homepage, 2026-11-17: the enquiry card goes into the hero only when the first top-level block is
// the HeroSection. Any other first block, any other position, or no aside = undefined = page unchanged.
import { describe, expect, it } from 'vitest'
import { asideForBlock } from '@/lib/cms/first-block-aside'

const aside = { component: 'HeroSection', node: 'CARD' }

describe('asideForBlock', () => {
  it('gives the card to a HeroSection in first place', () => {
    expect(asideForBlock(0, 'HeroSection', aside)).toBe('CARD')
  })

  it('gives nothing to a HeroSection further down the page', () => {
    expect(asideForBlock(1, 'HeroSection', aside)).toBeUndefined()
  })

  it('gives nothing when the first block is another component (the under-hero card stays visible then)', () => {
    expect(asideForBlock(0, 'ModernHeroSection', aside)).toBeUndefined()
    expect(asideForBlock(0, 'EngineeringHeroSection', aside)).toBeUndefined()
  })

  it('gives nothing when the page passes no aside (Engineering, every other page)', () => {
    expect(asideForBlock(0, 'HeroSection', undefined)).toBeUndefined()
  })
})
