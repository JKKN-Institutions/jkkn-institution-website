// Engineering careers list page -> the parent site's careers list (user's choice 2026-11-24). Only the
// exact /careers path moves; job pages stay on engg; the parent site must never get this redirect.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ENGG_CAREERS_LIST_REDIRECT } from '@/lib/institutions/engineering/careers-list-redirect'

type Redirect = { source: string; destination: string; permanent?: boolean; has?: unknown }

async function redirectsFor(institution: string): Promise<Redirect[]> {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_INSTITUTION_ID', institution)
  const config = (await import('../../next.config')).default as { redirects: () => Promise<Redirect[]> }
  return config.redirects()
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('engineering careers list redirect', () => {
  it('sends the list page to the www careers list', () => {
    expect(ENGG_CAREERS_LIST_REDIRECT).toEqual({ source: '/careers', destination: 'https://www.jkkn.ac.in/careers' })
  })

  it('next.config.ts applies the same redirect, permanent, on engineering', async () => {
    const found = (await redirectsFor('engineering')).filter((r) => r.source === '/careers')
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ ...ENGG_CAREERS_LIST_REDIRECT, permanent: true })
    expect(found[0].has).toBeUndefined()
  })

  it('leaves engineering job pages alone (no /careers/<slug> rule)', async () => {
    const redirects = await redirectsFor('engineering')
    expect(redirects.filter((r) => r.source.startsWith('/careers/') || r.source.startsWith('/careers:'))).toEqual([])
  })

  it('never applies on the main site, where it would redirect /careers to itself', async () => {
    for (const institution of ['main', '']) {
      const redirects = await redirectsFor(institution)
      expect(redirects.find((r) => r.source === '/careers'), institution || 'unset').toBeUndefined()
    }
  })
})
