import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  courseShort,
  gateIntentForHref,
  isGateNumber,
  isGateOffPath,
  isUngatedPath,
  numberAtOffset,
  pageTag,
  programmeForPath,
  telUrlFor,
  whatsappGateUrl,
} from '@/lib/call-gate'
import { submitEnquiryToCrm } from '@/lib/enquiry/crm-submit'
import { enquirySiteFor } from '@/lib/enquiry/site'

const BE_CSE = '7bf53be0-1cc5-407d-9a14-c1b6b39e874a'
const MBA = '43eed6cf-fa51-4e6b-ba93-1b27c4c16df4'
const IT = '5acfd400-da68-4fb6-8886-40e8b27c6a7c'
const ME_CSE = '24102930-dded-46e0-869b-3247cdca334d'
const BDS = 'aea1e367-65ad-442d-9b11-ab0277d93a83'

describe('numberAtOffset (plain-text numbers)', () => {
  const text = 'For admission call +91 93458 55001 or the office on 98765 43210 today.'
  it('finds the number a tap lands on, in any of its written forms', () => {
    expect(numberAtOffset(text, text.indexOf('93458 55001') + 3)).toBe('9345855001')
    expect(numberAtOffset(text, text.indexOf('+91'))).toBe('9345855001')
    expect(numberAtOffset(text, text.indexOf('43210'))).toBe('9876543210')
    expect(numberAtOffset('Call 9345855001 now', 7)).toBe('9345855001')
    expect(numberAtOffset('Call +91-9345855001 now', 8)).toBe('9345855001')
  })
  it('returns null off the number, and for years, landlines or short numbers', () => {
    expect(numberAtOffset(text, 2)).toBeNull()
    expect(numberAtOffset('Established in 1969, intake 300 seats', 16)).toBeNull()
    expect(numberAtOffset('Office: 0422 2661100', 10)).toBeNull()
  })
  it('only the admission number is gated', () => {
    expect(isGateNumber('9345855001')).toBe(true)
    expect(isGateNumber('9876543210')).toBe(false)
    expect(telUrlFor('9876543210')).toBe('tel:+919876543210')
  })
})

describe('gateIntentForHref', () => {
  it('gates every way the sites write the admission number', () => {
    expect(gateIntentForHref('tel:+919345855001')).toBe('call')
    expect(gateIntentForHref('tel:+91 93458 55001')).toBe('call')
    expect(gateIntentForHref('tel: +91 93458 55001')).toBe('call')
    expect(gateIntentForHref('tel:9345855001')).toBe('call')
    expect(gateIntentForHref('https://wa.me/919345855001')).toBe('whatsapp')
    expect(gateIntentForHref('https://wa.me/919345855001?text=Hi%20from%20Salem')).toBe('whatsapp')
    expect(gateIntentForHref('https://api.whatsapp.com/send?phone=919345855001&text=hi')).toBe('whatsapp')
  })
  it('leaves the office line, the publishing script number and every other link alone', () => {
    expect(gateIntentForHref('tel:+914222661100')).toBeNull() // CMS floating button default
    expect(gateIntentForHref('tel:+914565226001')).toBeNull() // scripts/publish-facilities-pages.ts
    expect(gateIntentForHref('https://wa.me/919876543210')).toBeNull()
    expect(gateIntentForHref('https://www.jkkn.ai/apply/jkkn-admission-2026')).toBeNull()
    expect(gateIntentForHref('mailto:engg@jkkn.ac.in')).toBeNull()
    expect(gateIntentForHref('/contact')).toBeNull()
  })
})

describe('isUngatedPath / isGateOffPath', () => {
  it('keeps careers and the two school pages direct', () => {
    expect(isUngatedPath('/careers')).toBe(true)
    expect(isUngatedPath('/careers/teaching-jobs')).toBe(true)
    expect(isUngatedPath('/our-schools')).toBe(true)
    expect(isUngatedPath('/jkkn-matriculation-higher-secondary-school')).toBe(true)
    expect(isUngatedPath('/nattraja-vidhyalya')).toBe(true)
    expect(isUngatedPath('/')).toBe(false)
    expect(isUngatedPath('/contact')).toBe(false)
    expect(isUngatedPath('/our-colleges/dental')).toBe(false)
    expect(isUngatedPath('/careers-fair-2026')).toBe(false)
  })
  it('switches the gate off on staff routes only', () => {
    expect(isGateOffPath('/admin')).toBe(true)
    expect(isGateOffPath('/admin/content/pages')).toBe(true)
    expect(isGateOffPath('/editor/abc')).toBe(true)
    expect(isGateOffPath('/preview/token-1')).toBe(true)
    expect(isGateOffPath('/administration')).toBe(false)
    expect(isGateOffPath('/admissions')).toBe(false)
  })
})

describe('programmeForPath', () => {
  it("pre-selects Engineering's one-programme pages and nothing elsewhere", () => {
    expect(programmeForPath('/admissions/be-cse')).toBe(BE_CSE)
    expect(programmeForPath('/admissions/mba/')).toBe(MBA)
    expect(programmeForPath('/courses-offered/ug/btech-it')).toBe(IT)
    expect(programmeForPath('/courses-offered/pg/me-cse')).toBe(ME_CSE)
    expect(programmeForPath('/courses/it')).toBe(IT)
    expect(programmeForPath('/courses/me-cse')).toBe(ME_CSE)
    expect(programmeForPath('/courses-offered/ug/sh')).toBeUndefined()
    expect(programmeForPath('/admissions')).toBeUndefined()
    expect(programmeForPath('/admissions/engineering')).toBeUndefined()
    expect(programmeForPath('/admissions/constructor')).toBeUndefined()
    expect(programmeForPath('/dental-courses')).toBeUndefined()
    expect(programmeForPath('/')).toBeUndefined()
  })
})

describe('whatsappGateUrl', () => {
  const textOf = (url: string) => decodeURIComponent(new URL(url).searchParams.get('text') ?? '')
  it('types the course and a page reference per site, never a name or phone', () => {
    const engg = whatsappGateUrl(BE_CSE, '/admissions/be-cse', 'engineering')
    expect(engg.startsWith('https://wa.me/919345855001?text=')).toBe(true)
    expect(textOf(engg)).toBe('Hi, B.E. Computer Science and Engineering admission details venum. Ref: WEB-ENGG-admissions-be-cse')
    expect(textOf(whatsappGateUrl(MBA, '/', 'engineering'))).toBe('Hi, MBA admission details venum. Ref: WEB-ENGG-home')
    expect(textOf(whatsappGateUrl(BDS, '/contact', 'main'))).toBe('Hi, BDS admission details venum. Ref: WEB-MAIN-contact')
  })
  it('short course names read as a parent types them', () => {
    expect(courseShort('b3640fc2-4260-4548-b66b-1a9908e876ea')).toBe('Pharm.D')
    expect(courseShort('e56b6ef9-6266-4097-9287-7c7920b3822e')).toBe('M.Pharm Pharmaceutics')
    expect(courseShort('432ea38a-947a-4959-98c5-fbcef4068252')).toBe('M.Sc Child Health Nursing')
    expect(courseShort('de176e31-2fe8-431c-857f-35fcd5f6c40e')).toBe('B.Ed Tamil')
    expect(courseShort('unknown')).toBe('')
  })
  it('page tags are safe for the CRM source', () => {
    expect(pageTag('/')).toBe('-home')
    expect(pageTag('/fee-structure/dental/')).toBe('-fee-structure-dental')
    expect(pageTag('/Admissions/BE-CSE')).toBe('-admissions-be-cse')
  })
})

describe('ENQUIRY_DRY_RUN (local test switch)', () => {
  const env = { ...process.env }
  afterEach(() => {
    process.env = { ...env }
  })
  const form = () => {
    const f = new FormData()
    f.set('name', 'Test Parent')
    f.set('phone', '9876543210')
    f.set('programme', BE_CSE)
    f.set('source_page', 'call-gate-contact')
    return f
  }
  const site = enquirySiteFor('engineering')!

  it('answers accepted without calling the CRM when on, off Vercel', async () => {
    process.env.ENQUIRY_DRY_RUN = '1'
    delete process.env.VERCEL
    const fetchSpy = vi.fn()
    const result = await submitEnquiryToCrm(form(), site, fetchSpy as unknown as typeof fetch)
    expect(result.success).toBe(true)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
  it('still validates first', async () => {
    process.env.ENQUIRY_DRY_RUN = '1'
    delete process.env.VERCEL
    const f = form()
    f.set('phone', '12345')
    const result = await submitEnquiryToCrm(f, site, vi.fn() as unknown as typeof fetch)
    expect(result.success).toBe(false)
  })
  it('is ignored on Vercel', async () => {
    process.env.ENQUIRY_DRY_RUN = '1'
    process.env.VERCEL = '1'
    const fetchSpy = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    await submitEnquiryToCrm(form(), site, fetchSpy as unknown as typeof fetch)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})
