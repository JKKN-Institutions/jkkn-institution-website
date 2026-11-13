// DEP-100 (2026-11-13): the server tells GA4 only what the CRM really did with the lead.
// The CRM and GA4 are both faked here - no request leaves this machine and no lead is written.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const scheduled: Array<() => unknown> = []
vi.mock('next/server', () => ({ after: (task: () => unknown) => scheduled.push(task) }))
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: (k: string) => (k === '_ga' ? { value: 'GA1.1.111.222' } : undefined) }),
}))

import { CRM_INSTITUTIONS, ENGG_DEFAULT_PROGRAMME_BY_SLUG } from '@/lib/enquiry/crm-programmes'
import { submitEnquiryToCrm } from '@/lib/enquiry/crm-submit'
import {
  SECRET_ENV,
  buildMpBody,
  clientIdFromGaCookie,
  freshClientId,
  measurementIdFor,
  sendServerLeadEvent,
} from '@/lib/enquiry/ga4-server-event'
import { enquirySiteFor } from '@/lib/enquiry/site'

const MP = 'https://www.google-analytics.com/mp/collect'
const engg = enquirySiteFor('engineering')!
const main = enquirySiteFor('main')!
const BE_CSE = ENGG_DEFAULT_PROGRAMME_BY_SLUG['be-cse']
const BDS = CRM_INSTITUTIONS.find((i) => i.key === 'dental')!.programmes[0].id

function form(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}
const good = { name: 'Test Parent', phone: '9000000001', programme: BE_CSE, source_page: 'admissions-be-cse' }

function fakeCrm(status: number) {
  return vi.fn(async () => new Response(JSON.stringify({ ok: status < 300 }), { status }))
}
function fakeGa4() {
  const calls: Array<{ url: string; body: { client_id: string; events: Array<{ name: string; params: Record<string, unknown> }> } }> = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url: String(url), body: JSON.parse(String(init?.body)) })
      return new Response(null, { status: 204 })
    })
  )
  return calls
}
async function runScheduled() {
  while (scheduled.length) await scheduled.shift()!()
}

beforeEach(() => {
  scheduled.length = 0
  vi.stubEnv('ENQUIRY_DRY_RUN', '')
  vi.stubEnv('GA4_MP_API_SECRET_MAIN', 'test-secret-main')
  vi.stubEnv('GA4_MP_API_SECRET_ENGG', 'test-secret-engg')
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('ids and secrets per site', () => {
  it('uses the same GA4 ids as the page tags (institution-seo-config)', () => {
    expect(measurementIdFor('main')).toBe('G-CHXSXSC9YY')
    expect(measurementIdFor('engineering')).toBe('G-WH0VZ5V4TL')
  })
  it('keeps one secret per site, so www and engg can never cross', () => {
    expect(SECRET_ENV).toEqual({ main: 'GA4_MP_API_SECRET_MAIN', engineering: 'GA4_MP_API_SECRET_ENGG' })
  })
})

describe('helpers', () => {
  it('reads the client id from _ga, and makes one in gtag shape when there is none', () => {
    expect(clientIdFromGaCookie('GA1.1.1234567890.1700000000')).toBe('1234567890.1700000000')
    expect(clientIdFromGaCookie('abc')).toBeNull()
    expect(freshClientId(1_700_000_000_000, 0.5)).toBe('1073741823.1700000000')
  })
  it('drops empty params and cuts values to 100 characters', () => {
    const body = buildMpBody('1.2', 'lead_crm_accepted', { form_name: 'engg_enquiry', source_page: 'x'.repeat(150), programme: '' })
    expect(body.events[0].params).toEqual({ form_name: 'engg_enquiry', source_page: 'x'.repeat(100), engagement_time_msec: 1 })
  })
  it('does nothing at all without the site secret', async () => {
    vi.stubEnv('GA4_MP_API_SECRET_ENGG', '')
    const fetchImpl = vi.fn()
    await expect(
      sendServerLeadEvent({ siteId: 'engineering', name: 'lead_crm_accepted', params: {}, fetchImpl })
    ).resolves.toBe('not_configured')
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it('never throws and never logs the secret', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const boom = vi.fn(async () => {
      throw new Error('offline')
    })
    await expect(
      sendServerLeadEvent({ siteId: 'main', name: 'lead_crm_accepted', params: {}, fetchImpl: boom as unknown as typeof fetch })
    ).resolves.toBe('failed')
    const refused = vi.fn(async () => new Response(null, { status: 500 }))
    await expect(
      sendServerLeadEvent({ siteId: 'main', name: 'lead_crm_accepted', params: {}, fetchImpl: refused as unknown as typeof fetch })
    ).resolves.toBe('failed')
    expect(JSON.stringify(warn.mock.calls)).not.toContain('test-secret')
  })
})

describe('submitEnquiryToCrm -> GA4 server event', () => {
  it('engineering, new CRM lead (200): lead_crm_accepted to the Engg property, after the answer', async () => {
    const ga = fakeGa4()
    const r = await submitEnquiryToCrm(form(good), engg, fakeCrm(200))
    expect(r.success).toBe(true)
    expect(ga).toHaveLength(0)
    await runScheduled()
    expect(ga).toHaveLength(1)
    expect(ga[0].url).toBe(`${MP}?measurement_id=G-WH0VZ5V4TL&api_secret=test-secret-engg`)
    expect(ga[0].body.client_id).toBe('111.222')
    expect(ga[0].body.events[0].name).toBe('lead_crm_accepted')
    expect(ga[0].body.events[0].params).toMatchObject({
      form_name: 'engg_enquiry',
      source_page: 'admissions-be-cse',
      programme: BE_CSE,
    })
    expect(JSON.stringify(ga[0].body)).not.toContain('9000000001')
    expect(JSON.stringify(ga[0].body)).not.toContain('Test Parent')
  })

  it('main, phone already in the CRM (409): lead_crm_duplicate to the Main property', async () => {
    const ga = fakeGa4()
    const r = await submitEnquiryToCrm(form({ ...good, programme: BDS }), main, fakeCrm(409))
    expect(r.duplicate).toBe(true)
    await runScheduled()
    expect(ga).toHaveLength(1)
    expect(ga[0].url).toBe(`${MP}?measurement_id=G-CHXSXSC9YY&api_secret=test-secret-main`)
    expect(ga[0].body.events[0].name).toBe('lead_crm_duplicate')
  })

  it('a filled honeypot, a CRM refusal or a field error sends nothing to GA4', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const ga = fakeGa4()
    await submitEnquiryToCrm(form({ ...good, company_website: 'Test Company' }), engg, fakeCrm(200))
    await submitEnquiryToCrm(form(good), engg, fakeCrm(500))
    await submitEnquiryToCrm(form({ ...good, phone: '123' }), engg, fakeCrm(200))
    await runScheduled()
    expect(ga).toHaveLength(0)
  })

  it('without the secret the submit is exactly as before', async () => {
    vi.stubEnv('GA4_MP_API_SECRET_ENGG', '')
    const ga = fakeGa4()
    const crm = fakeCrm(200)
    const r = await submitEnquiryToCrm(form(good), engg, crm)
    expect(r.success).toBe(true)
    await runScheduled()
    expect(ga).toHaveLength(0)
    expect(crm).toHaveBeenCalledTimes(1)
  })
})
