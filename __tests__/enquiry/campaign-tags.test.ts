// Campaign tags -> CRM. Pure functions only; no request leaves the test.
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  campaignTagsSnapshot,
  cleanTag,
  crmCampaign,
  parseCampaignTags,
  resolveCampaign,
  tagApplyHref,
  tagsFromSearch,
} from '@/lib/enquiry/campaign-tags'

const SITE = { utmSource: 'dental.jkkn.ac.in', utmMedium: 'site-form', utmCampaign: 'dental-contact' }
const APPLY = 'https://www.jkkn.ai/apply/jkkn-admission-2026'

function form(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

describe('cleanTag', () => {
  it('writes utm values in the house shape', () => {
    expect(cleanTag('utm_source', '  Facebook ')).toBe('facebook')
    expect(cleanTag('utm_campaign', '2026 - Dental Lead Campaign - BDS')).toBe('2026-dental-lead-campaign-bds')
    expect(cleanTag('utm_campaign', '{{campaign.name}}')).toBe('campaign.name')
    expect(cleanTag('utm_source', '<script>')).toBe('script')
    expect(cleanTag('utm_source', 42)).toBe('')
    expect(cleanTag('utm_source', 'x'.repeat(300))).toHaveLength(100)
  })

  it("keeps a click id's case and drops anything else", () => {
    expect(cleanTag('gclid', 'Cj0KCQ_abc-1')).toBe('Cj0KCQ_abc-1')
    expect(cleanTag('fbclid', 'IwAR1 x"y')).toBe('IwAR1xy')
  })
})

describe('resolveCampaign', () => {
  it("no tags: the site's own values, as before", () => {
    expect(resolveCampaign({}, SITE)).toEqual({ ...SITE, tagged: false })
  })

  it("the visitor's utm wins; missing parts fall back to the site", () => {
    expect(resolveCampaign({ utm_source: 'facebook', utm_medium: 'paid-social', utm_campaign: '2026-dental-lead-bds' }, SITE))
      .toEqual({ utmSource: 'facebook', utmMedium: 'paid-social', utmCampaign: '2026-dental-lead-bds', tagged: true })
    expect(resolveCampaign({ utm_source: 'brochure' }, SITE))
      .toEqual({ utmSource: 'brochure', utmMedium: 'site-form', utmCampaign: 'dental-contact', tagged: true })
  })

  it('a Google Ads click id reads as google / cpc; a Meta click id as facebook / social', () => {
    expect(resolveCampaign({ gclid: 'abc' }, SITE)).toMatchObject({ utmSource: 'google', utmMedium: 'cpc' })
    expect(resolveCampaign({ wbraid: 'abc' }, SITE)).toMatchObject({ utmSource: 'google', utmMedium: 'cpc' })
    expect(resolveCampaign({ fbclid: 'abc' }, SITE)).toMatchObject({ utmSource: 'facebook', utmMedium: 'social' })
    // An explicit utm_source beats the click id.
    expect(resolveCampaign({ fbclid: 'abc', utm_source: 'instagram' }, SITE)).toMatchObject({ utmSource: 'instagram' })
  })

  it('a tag that cleans to nothing counts as no tag', () => {
    expect(resolveCampaign({ utm_source: '!!!' }, SITE)).toEqual({ ...SITE, tagged: false })
  })
})

describe('crmCampaign (server)', () => {
  it('reads the hidden inputs and cleans them again', () => {
    expect(crmCampaign(form({ utm_source: 'WhatsApp', utm_campaign: 'Erode School Visit' }), SITE))
      .toEqual({ utmSource: 'whatsapp', utmMedium: 'site-form', utmCampaign: 'erode-school-visit' })
    expect(crmCampaign(form({}), SITE)).toEqual(SITE)
  })
})

describe('tagApplyHref', () => {
  const defaults = { utmSource: 'dental.jkkn.ac.in', utmCampaign: 'dental-apply-link-blog' }

  it('no tags: only the fixed utm_medium=organic goes', () => {
    const out = new URL(tagApplyHref(`${APPLY}?utm_source=dental.jkkn.ac.in&utm_medium=organic&utm_campaign=components-header`, {}, defaults))
    expect(out.searchParams.get('utm_source')).toBe('dental.jkkn.ac.in')
    expect(out.searchParams.get('utm_campaign')).toBe('components-header')
    expect(out.searchParams.has('utm_medium')).toBe(false)
  })

  it('a link with no utm at all gets this site and page', () => {
    const out = new URL(tagApplyHref(APPLY, {}, defaults))
    expect(out.searchParams.get('utm_source')).toBe('dental.jkkn.ac.in')
    expect(out.searchParams.get('utm_campaign')).toBe('dental-apply-link-blog')
  })

  it("the visit's tags replace the site's on the link", () => {
    const tags = { utm_source: 'facebook', utm_medium: 'paid-social', utm_campaign: '2026-dental-lead-bds', utm_content: 'v4' }
    const out = new URL(tagApplyHref(`${APPLY}?utm_source=dental.jkkn.ac.in&utm_campaign=dental-home`, tags, defaults))
    expect(out.pathname).toBe('/apply/jkkn-admission-2026')
    expect(Object.fromEntries(out.searchParams)).toEqual({
      utm_source: 'facebook',
      utm_medium: 'paid-social',
      utm_campaign: '2026-dental-lead-bds',
      utm_content: 'v4',
    })
  })

  it('is the same on a second pass, and leaves other links alone', () => {
    const tags = { gclid: 'abc' }
    const once = tagApplyHref(`${APPLY}?utm_source=dental.jkkn.ac.in`, tags, defaults)
    expect(tagApplyHref(once, tags, defaults)).toBe(once)
    expect(new URL(once).searchParams.get('utm_medium')).toBe('cpc')
    expect(tagApplyHref('https://www.jkkn.ai/auth/login', tags, defaults)).toBe('https://www.jkkn.ai/auth/login')
    expect(tagApplyHref('https://example.com/apply?utm_medium=organic', tags, defaults)).toBe('https://example.com/apply?utm_medium=organic')
    expect(tagApplyHref('http://[bad', tags, defaults)).toBe('http://[bad')
  })
})

describe('first-touch store', () => {
  afterEach(() => vi.unstubAllGlobals())

  function browser(search: string, store: Map<string, string> | null) {
    const sessionStorage = store
      ? { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }
      : {
          getItem: () => {
            throw new Error('blocked')
          },
          setItem: () => {
            throw new Error('blocked')
          },
        }
    vi.stubGlobal('window', { location: { search }, sessionStorage })
  }

  it('keeps the first tagged landing of the visit', () => {
    const store = new Map<string, string>()
    browser('?utm_source=Facebook&utm_campaign=2026-dental-lead-bds&x=1', store)
    const first = campaignTagsSnapshot()
    expect(parseCampaignTags(first)).toEqual({ utm_source: 'facebook', utm_campaign: '2026-dental-lead-bds' })
    browser('', store) // the next page has no tags
    expect(campaignTagsSnapshot()).toBe(first)
    browser('?utm_source=google', store) // a later tagged page does not replace the first
    expect(campaignTagsSnapshot()).toBe(first)
  })

  it('no tags: an empty snapshot and nothing stored', () => {
    const store = new Map<string, string>()
    browser('?page=2', store)
    expect(campaignTagsSnapshot()).toBe('')
    expect(store.size).toBe(0)
  })

  it("blocked storage still reads this page's own URL", () => {
    browser('?gclid=abc', null)
    expect(parseCampaignTags(campaignTagsSnapshot())).toEqual({ gclid: 'abc' })
  })

  it('hand-edited storage is cleaned again', () => {
    expect(parseCampaignTags('{"utm_source":"Face Book","phone":"9876543210"}')).toEqual({ utm_source: 'face-book' })
    expect(parseCampaignTags('not json')).toEqual({})
    expect(tagsFromSearch('?utm_source=&utm_medium=%20')).toEqual({})
  })
})
