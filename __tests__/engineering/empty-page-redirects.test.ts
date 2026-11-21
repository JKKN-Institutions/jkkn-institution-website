// F3 of the engineering perception audit (2026-11-21): the 9 empty engineering CMS pages 301 to real pages on
// the engineering deployment only, and next.config.ts carries exactly the list the sitemap leaves out.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ENGG_EMPTY_PAGE_REDIRECTS, ENGG_EMPTY_PAGE_SLUGS } from '@/lib/institutions/engineering/empty-page-redirects'

type Redirect = { source: string; destination: string; permanent?: boolean }

async function redirectsFor(institution: string): Promise<Redirect[]> {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_INSTITUTION_ID', institution)
  const config = (await import('../../next.config')).default as { redirects: () => Promise<Redirect[]> }
  return config.redirects()
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('engineering empty-page redirects', () => {
  it('lists the 9 pages and their targets', () => {
    expect(ENGG_EMPTY_PAGE_REDIRECTS).toHaveLength(9)
    expect(ENGG_EMPTY_PAGE_SLUGS.has('placements')).toBe(true)
    expect(ENGG_EMPTY_PAGE_SLUGS.has('courses-offered/ug')).toBe(true)
  })

  it('next.config.ts applies the same list as permanent redirects on engineering', async () => {
    const redirects = await redirectsFor('engineering')
    for (const expected of ENGG_EMPTY_PAGE_REDIRECTS) {
      const found = redirects.find((r) => r.source === expected.source)
      expect(found, expected.source).toBeDefined()
      expect(found?.destination).toBe(expected.destination)
      expect(found?.permanent).toBe(true)
    }
  })

  it('does not apply them on the main site', async () => {
    const redirects = await redirectsFor('main')
    for (const expected of ENGG_EMPTY_PAGE_REDIRECTS) {
      expect(redirects.find((r) => r.source === expected.source && r.destination === expected.destination)).toBeUndefined()
    }
  })

  it('never redirects a target to another redirect in the list', () => {
    for (const { destination } of ENGG_EMPTY_PAGE_REDIRECTS) {
      expect(ENGG_EMPTY_PAGE_REDIRECTS.some((r) => r.source === destination)).toBe(false)
    }
  })
})
