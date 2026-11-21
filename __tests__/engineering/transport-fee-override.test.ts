// F7 of the engineering perception audit (2026-11-21): the transport page states the bus fee (₹5,500 a year,
// every route, college office via the user) instead of "an affordable fee calculated based on the distance".
import { describe, expect, it } from 'vitest'
import {
  applyEngineeringCmsPageOverrides,
  TRANSPORT_FEE_FEATURE_NEW,
} from '@/lib/institutions/engineering/cms-page-overrides'

const LIVE_TRANSPORT = {
  component_name: 'ModernTransportSection',
  props: {
    pageTitle: 'Transport',
    features: [
      { icon: 'Wrench', title: 'Well-Maintained Buses', description: 'unchanged' },
      {
        icon: 'Banknote',
        title: 'Affordable Fees',
        description:
          'The transport facility is available to all learners and senior learners at an affordable fee calculated based on the distance from the campus.',
      },
    ],
  },
}

describe('transport fee override', () => {
  const [out] = applyEngineeringCmsPageOverrides('facilities/transport', [LIVE_TRANSPORT])
  const features = (out.props as { features: { title: string; description: string; icon: string }[] }).features

  it('replaces the distance-based line with the ₹5,500 bus fee and keeps the icon', () => {
    expect(features[1]).toEqual({ icon: 'Banknote', ...TRANSPORT_FEE_FEATURE_NEW })
    expect(features[1].description).toContain('₹5,500 a year')
  })

  it('leaves the other features and the input alone', () => {
    expect(features[0]).toBe(LIVE_TRANSPORT.props.features[0])
    expect(LIVE_TRANSPORT.props.features[1].title).toBe('Affordable Fees')
  })

  it('keeps a fee line that was already edited in the CMS', () => {
    const edited = { ...LIVE_TRANSPORT, props: { features: [{ icon: 'Banknote', title: 'Fees', description: 'Edited' }] } }
    expect(applyEngineeringCmsPageOverrides('facilities/transport', [edited])[0]).toEqual(edited)
  })
})
