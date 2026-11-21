// F5 of the engineering perception audit (2026-11-21): www.jkkn.ac.in/rankings-and-recognitions must not
// call the group "NAAC A", "NBA Accredited" or "NIRF Ranked"; it gives each college's NAAC grade instead.
import { describe, expect, it } from 'vitest'
import {
  applyMainCmsPageOverrides,
  applyMainCmsSeoOverrides,
  META_DESCRIPTION_NEW,
  META_TITLE_NEW,
  RANKINGS_SLUG,
} from '@/lib/institutions/main/cms-page-overrides'

// The four blocks as served on 2026-11-21 (other props trimmed).
const LIVE_BLOCKS = [
  {
    component_name: 'HeroSection',
    props: {
      title: 'Rankings and Recognitions',
      subtitle: 'NAAC A Accredited | AICTE Approved | UGC Recognised | NBA Accredited | NIRF Ranked | 74+ Years of Excellence',
    },
  },
  {
    component_name: 'WhyChooseSection',
    props: {
      title: 'Our Accreditations and Approvals',
      features: [
        {
          icon: 'Award',
          title: 'NAAC A Grade Accreditation',
          description:
            'JKKN Institutions has been accredited by the National Assessment and Accreditation Council (NAAC) with an A Grade — validating our commitment to quality education, infrastructure, and governance.',
        },
        { icon: 'Building2', title: 'AICTE Approval', description: 'unchanged' },
      ],
    },
  },
  {
    component_name: 'StatsCounter',
    props: {
      stats: [
        { label: 'NAAC Grade', value: 'A', suffix: '' },
        { label: 'Years of Excellence', value: '74', suffix: '+' },
      ],
      tagline: 'Recognised by NAAC | AICTE | UGC | DCI | PCI | INC | NBA',
    },
  },
  {
    component_name: 'CallToAction',
    props: {
      title: 'Study at a NAAC A Accredited Institution',
      description:
        'JKKN Institutions is NAAC A accredited with all colleges holding individual regulatory approvals. Admissions 2026-27 are open. Secure your seat today.',
    },
  },
]

const BANNED = [/NAAC A Accredited/, /NAAC A accredited/, /NBA/, /NIRF Ranked/, /NAAC A Grade/, /2026-27 are open/]

describe('main /rankings-and-recognitions overrides', () => {
  const out = applyMainCmsPageOverrides(RANKINGS_SLUG, LIVE_BLOCKS)
  const text = JSON.stringify(out)

  it('removes the group NAAC A, NBA and NIRF Ranked claims', () => {
    for (const pattern of BANNED) expect(text).not.toMatch(pattern)
  })

  it('shows each college NAAC grade from the NAAC list', () => {
    expect(text).toContain('Dental A, Pharmacy A, Nursing B++, Engineering B+, Arts and Science B')
    expect(text).toContain('Engineering B+ (2.67)')
    expect(text).toContain('NAAC-Accredited Colleges')
  })

  it('leaves other blocks, other features and other pages alone', () => {
    expect((out[1].props as { features: unknown[] }).features[1]).toBe(LIVE_BLOCKS[1].props.features[1])
    expect(applyMainCmsPageOverrides('about', LIVE_BLOCKS)).toBe(LIVE_BLOCKS)
    expect(LIVE_BLOCKS[0].props.subtitle).toMatch(/NBA/)
  })

  it('fixes the page title and description and keeps them short', () => {
    const seo = applyMainCmsSeoOverrides(RANKINGS_SLUG, {
      meta_title: 'Rankings & Recognitions | JKKN Institutions — NAAC, NIRF & Awards',
      meta_description:
        'JKKN Institutions rankings and recognitions: NAAC A Grade, NIRF rankings, NBA accreditation, government approvals and awards for academic excellence near Erode, Tamil Nadu.',
    })
    expect(seo).toEqual({ meta_title: META_TITLE_NEW, meta_description: META_DESCRIPTION_NEW })
    expect(META_TITLE_NEW.length).toBeLessThanOrEqual(60)
    expect(META_DESCRIPTION_NEW.length).toBeLessThanOrEqual(160)
  })
})
