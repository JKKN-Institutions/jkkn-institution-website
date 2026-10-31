// Enquiry form -> jkkn.ai CRM. Every CRM answer is faked: no test here sends a real lead.
import { describe, expect, it, vi } from 'vitest'
import {
  CRM_INSTITUTIONS,
  ENGG_DEFAULT_PROGRAMME_BY_SLUG,
  ENGINEERING_INSTITUTION_ID,
  institutionForProgramme,
  institutionsForSite,
} from '@/lib/enquiry/crm-programmes'
import { CRM_SUBMIT_URL, submitEnquiryToCrm } from '@/lib/enquiry/crm-submit'
import { enquirySiteFor, fullApplicationHref, sourcePageFromPath } from '@/lib/enquiry/site'

const engg = enquirySiteFor('engineering')!
const main = enquirySiteFor('main')!
const BE_CSE = ENGG_DEFAULT_PROGRAMME_BY_SLUG['be-cse']
const BDS = CRM_INSTITUTIONS.find((i) => i.key === 'dental')!.programmes[0].id
const DENTAL_ID = CRM_INSTITUTIONS.find((i) => i.key === 'dental')!.id

function form(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const good = { name: 'Test Parent', phone: '98765 43210', programme: BE_CSE, source_page: 'admissions-be-cse' }

function fakeCrm(status: number) {
  return vi.fn(async () => new Response(JSON.stringify({ ok: status < 300 }), { status }))
}

describe('programme list', () => {
  it('has 7 colleges and 70 programmes, ids unique and UUID-shaped', () => {
    const ids = CRM_INSTITUTIONS.flatMap((i) => i.programmes.map((p) => p.id))
    expect(CRM_INSTITUTIONS).toHaveLength(7)
    expect(ids).toHaveLength(70)
    expect(new Set(ids).size).toBe(70)
    for (const id of [...ids, ...CRM_INSTITUTIONS.map((i) => i.id)]) {
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    }
  })

  it('engineering offers only its own 7 programmes; main offers all 7 colleges; others nothing', () => {
    expect(institutionsForSite('engineering').map((i) => i.id)).toEqual([ENGINEERING_INSTITUTION_ID])
    expect(institutionsForSite('engineering')[0].programmes).toHaveLength(7)
    expect(institutionsForSite('main')).toHaveLength(7)
    expect(institutionsForSite('dental')).toHaveLength(0)
  })

  it('reads the institution from the programme, per site', () => {
    expect(institutionForProgramme('engineering', BE_CSE)).toBe(ENGINEERING_INSTITUTION_ID)
    expect(institutionForProgramme('engineering', BDS)).toBeNull()
    expect(institutionForProgramme('main', BDS)).toBe(DENTAL_ID)
    expect(Object.values(ENGG_DEFAULT_PROGRAMME_BY_SLUG).every((id) => institutionForProgramme('engineering', id))).toBe(true)
  })
})

describe('site helpers', () => {
  it('only main and engineering get a form', () => {
    expect(enquirySiteFor('engineering')?.host).toBe('engg.jkkn.ac.in')
    expect(enquirySiteFor(undefined)?.host).toBe('www.jkkn.ac.in')
    expect(enquirySiteFor('dental')).toBeNull()
  })

  it('turns a path into a utm-safe page tag', () => {
    expect(sourcePageFromPath('/')).toBe('home')
    expect(sourcePageFromPath('/admissions/be-cse/')).toBe('admissions-be-cse')
    expect(sourcePageFromPath('/Salem')).toBe('salem')
  })

  it('tags the full application link with site and page', () => {
    const href = new URL(fullApplicationHref(engg, 'home-popup'))
    expect(href.origin + href.pathname).toBe('https://www.jkkn.ai/apply/jkkn-admission-2026')
    expect(href.searchParams.get('utm_source')).toBe('engg.jkkn.ac.in')
    expect(href.searchParams.get('utm_campaign')).toBe('engg-home-popup')
  })
})

describe('submit to CRM (faked)', () => {
  it('sends the house payload on engineering and reports success', async () => {
    const crm = fakeCrm(200)
    const state = await submitEnquiryToCrm(form({ ...good, company_website: '' }), engg, crm)
    expect(state.success).toBe(true)
    expect(state.tracking).toEqual({ source_page: 'admissions-be-cse', programme_id: BE_CSE })
    expect(crm).toHaveBeenCalledTimes(1)
    const [url, init] = crm.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe(CRM_SUBMIT_URL)
    const body = JSON.parse(String(init.body))
    expect(body.formData).toEqual({
      first_name: 'Test Parent',
      phone: '9876543210',
      district: '',
      institution_program: { institution_id: ENGINEERING_INSTITUTION_ID, program_id: BE_CSE },
    })
    expect(body).toMatchObject({
      honeypot: '',
      utmSource: 'engg.jkkn.ac.in',
      utmMedium: 'site-form',
      utmCampaign: 'engg-admissions-be-cse',
      campaignLinkId: null,
      referrerUrl: '',
    })
  })

  it('on the main site files a BDS enquiry under Dental', async () => {
    const crm = fakeCrm(200)
    await submitEnquiryToCrm(form({ ...good, programme: BDS, source_page: 'home-popup', question: 'Fee?' }), main, crm)
    const body = JSON.parse(String((crm.mock.calls[0] as unknown as [string, RequestInit])[1].body))
    expect(body.formData.institution_program).toEqual({ institution_id: DENTAL_ID, program_id: BDS })
    expect(body.utmSource).toBe('www.jkkn.ac.in')
    expect(body.utmCampaign).toBe('main-home-popup')
    expect(body.referrerUrl).toBe('question: Fee?')
  })

  it('409 (phone already applied) reads as success', async () => {
    const state = await submitEnquiryToCrm(form(good), engg, fakeCrm(409))
    expect(state.success).toBe(true)
    expect(state.message).toMatch(/already enquired/)
  })

  it('a CRM error shows the call-us message', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const state = await submitEnquiryToCrm(form(good), engg, fakeCrm(500))
    expect(state.success).toBe(false)
    expect(state.error).toMatch(/93458 55001/)
    // the log line carries no name and no phone
    expect(JSON.stringify(spy.mock.calls)).not.toMatch(/Test Parent|9876543210/)
    spy.mockRestore()
  })

  it('a network failure shows the call-us message', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const down = vi.fn(async () => {
      throw new TypeError('fetch failed')
    })
    const state = await submitEnquiryToCrm(form(good), engg, down)
    expect(state.success).toBe(false)
    expect(state.error).toMatch(/could not reach/)
    spy.mockRestore()
  })

  it('bad fields never reach the CRM', async () => {
    const crm = fakeCrm(200)
    const state = await submitEnquiryToCrm(form({ name: 'A', phone: '12345', programme: '', source_page: 'x' }), engg, crm)
    expect(state.success).toBe(false)
    expect(Object.keys(state.fieldErrors ?? {}).sort()).toEqual(['name', 'phone', 'programme'])
    expect(crm).not.toHaveBeenCalled()
  })

  it('a number that is not an Indian mobile never reaches the CRM', async () => {
    // Two such numbers reached the CRM in the 2026-10-31 live test (0000000000, 0101010101).
    for (const phone of ['0000000000', '0101010101', '1234567890', '5999999999']) {
      const crm = fakeCrm(200)
      const state = await submitEnquiryToCrm(form({ ...good, phone }), engg, crm)
      expect(state.success).toBe(false)
      expect(state.fieldErrors?.phone).toMatch(/starts with 6, 7, 8 or 9/)
      expect(crm).not.toHaveBeenCalled()
    }
    for (const phone of ['6000000000', '9876543210', '+91 98765 43210'.slice(4)]) {
      const state = await submitEnquiryToCrm(form({ ...good, phone }), engg, fakeCrm(200))
      expect(state.success).toBe(true)
    }
  })

  it('a programme from another college is refused on the engineering site', async () => {
    const crm = fakeCrm(200)
    const state = await submitEnquiryToCrm(form({ ...good, programme: BDS }), engg, crm)
    expect(state.success).toBe(false)
    expect(state.fieldErrors?.programme).toBeTruthy()
    expect(crm).not.toHaveBeenCalled()
  })
})
