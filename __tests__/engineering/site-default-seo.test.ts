// F4 / F1 of the engineering perception audit (2026-11-21): the site-wide default title and description carry
// no unsourced "Best" and no placement rate.
import { describe, expect, it } from 'vitest'
import {
  applyEngineeringSiteDefaultSeo,
  DEFAULT_DESCRIPTION_NEW,
  DEFAULT_DESCRIPTION_OLD,
  DEFAULT_TITLE_NEW,
  DEFAULT_TITLE_OLD,
} from '@/lib/institutions/engineering/site-default-seo'
import { CITY_PAGES_CONFIG } from '@/lib/config/city-pages'

describe('applyEngineeringSiteDefaultSeo', () => {
  it('swaps the two known defaults', () => {
    const out = applyEngineeringSiteDefaultSeo({ defaultTitle: DEFAULT_TITLE_OLD, siteDescription: DEFAULT_DESCRIPTION_OLD, siteName: 'x' })
    expect(out).toEqual({ defaultTitle: DEFAULT_TITLE_NEW, siteDescription: DEFAULT_DESCRIPTION_NEW, siteName: 'x' })
  })

  it('keeps values edited in the CMS', () => {
    const row = { defaultTitle: 'Edited', siteDescription: 'Edited too' }
    expect(applyEngineeringSiteDefaultSeo(row)).toEqual(row)
  })

  it('new values have no Best, no percentage and fit the length limits', () => {
    for (const text of [DEFAULT_TITLE_NEW, DEFAULT_DESCRIPTION_NEW]) {
      expect(text).not.toMatch(/best|top\b|\d+\s?%/i)
    }
    expect(DEFAULT_TITLE_NEW.length).toBeLessThanOrEqual(60)
    expect(DEFAULT_DESCRIPTION_NEW.length).toBeLessThanOrEqual(160)
  })
})

describe('engineering city pages (F4)', () => {
  it('no city title, H1 or breadcrumb says Best', () => {
    for (const city of CITY_PAGES_CONFIG) {
      const texts = [city.seo?.title, city.h1, city.schema?.breadcrumbLabel].filter(Boolean) as string[]
      for (const text of texts) expect(text, city.slug).not.toMatch(/\bbest\b/i)
    }
  })

  it('Coimbatore, Salem and Tiruppur now have their own H1', () => {
    for (const slug of ['coimbatore', 'salem', 'tiruppur']) {
      expect(CITY_PAGES_CONFIG.find((city) => city.slug === slug)?.h1).toMatch(/^Engineering College near /)
    }
  })
})
