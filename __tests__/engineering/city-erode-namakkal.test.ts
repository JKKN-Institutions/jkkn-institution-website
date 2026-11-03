// Step 5 of the 10,300-lead plan (2026-11-03): the Namakkal page carries Anna University's
// official district list and no unsourced "Best"; the Erode list is re-read.
import { describe, expect, it } from 'vitest'
import { CITY_PAGES_CONFIG } from '@/lib/config/city-pages'

const city = (slug: string) => {
  const c = CITY_PAGES_CONFIG.find((x) => x.slug === slug)
  if (!c) throw new Error(`no city ${slug}`)
  return c
}

describe('Namakkal city page', () => {
  const n = city('namakkal')

  it('carries no "Best" claim in title, H1 or breadcrumb', () => {
    for (const text of [n.seo.title, n.h1 ?? '', n.schema.breadcrumbLabel]) {
      expect(text).not.toMatch(/\bbest\b/i)
    }
    expect(n.h1).toBeTruthy()
  })

  it("lists Anna University's 23 Namakkal district engineering colleges, JKKNCET among them", () => {
    const list = n.districtColleges!
    expect(list.colleges).toHaveLength(23)
    expect(new Set(list.colleges.map((c) => c.tneaCode)).size).toBe(23)
    expect(list.colleges.find((c) => c.tneaCode === '2647')?.name).toBe(
      'J.K.K. Nataraja College of Engineering and Technology'
    )
    expect(list.sourceUrl).toBe('https://www.annauniv.edu/cai/District%20wise/district/Namakkal.php')
    // The architecture college and the rows with no TNEA code stay out.
    expect(list.colleges.map((c) => c.tneaCode)).not.toContain('2667')
  })

  it('the FAQ count and intro agree with the table', () => {
    const faq = n.faqs.find((f) => /how many engineering colleges/i.test(f.question))!
    expect(faq.answer).toContain(`${n.districtColleges!.colleges.length} engineering colleges`)
    expect(n.districtColleges!.intro).toContain(`${n.districtColleges!.colleges.length} engineering colleges`)
  })

  it('meta description stays within 160 characters', () => {
    expect(n.seo.description.length).toBeLessThanOrEqual(160)
  })
})

describe('Erode city page', () => {
  it('keeps the 13-college list, re-read 3 November 2026', () => {
    const e = city('erode')
    expect(e.districtColleges!.colleges).toHaveLength(13)
    expect(e.districtColleges!.readOn).toBe('3 November 2026')
  })
})
