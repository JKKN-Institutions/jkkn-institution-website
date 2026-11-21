// F2 of the engineering perception audit (2026-11-21): PLACEMENTS must open the engineering NIRF page.
import { describe, expect, it } from 'vitest'
import { applyEngineeringNavOverrides, ENGG_PLACEMENTS_HREF } from '@/lib/institutions/engineering/nav-overrides'

const NAV = [
  { id: '1', label: 'Home', href: '/', is_homepage: true },
  {
    id: '2',
    label: 'IQAC',
    href: '/iqac',
    is_homepage: false,
    children: [{ id: '3', label: 'NIRF', href: '/iqac/nirf', is_homepage: false }],
  },
  {
    id: '4',
    label: 'PLACEMENTS',
    href: 'https://placements.jkkn.ac.in/',
    external_url: 'https://placements.jkkn.ac.in/',
    is_homepage: false,
  },
]

describe('applyEngineeringNavOverrides', () => {
  const out = applyEngineeringNavOverrides(NAV)

  it('points PLACEMENTS at the NIRF 2026 page and drops the external url', () => {
    expect(out[2].href).toBe(ENGG_PLACEMENTS_HREF)
    expect(out[2].external_url).toBeNull()
    expect(out[2].label).toBe('PLACEMENTS')
  })

  it('leaves every other item, and the input, unchanged', () => {
    expect(out[0]).toBe(NAV[0])
    expect(out[1]).toBe(NAV[1])
    expect(NAV[2].href).toBe('https://placements.jkkn.ac.in/')
  })

  it('also rewrites a nested portal link', () => {
    const nested = [{ ...NAV[1], children: [{ id: '5', label: 'Placement Cell', href: 'https://placements.jkkn.ac.in', is_homepage: false }] }]
    expect(applyEngineeringNavOverrides(nested)[0].children?.[0].href).toBe(ENGG_PLACEMENTS_HREF)
  })
})
