// The enquiry submit, server side: validate, then post to the jkkn.ai CRM's public form API.
// Lives outside app/actions so the unit tests can call it with a fake fetch; the server action in
// app/actions/enquiry.ts is a one-line wrapper around it.
//
// WHY THE SERVER POSTS, NOT THE BROWSER. An OPTIONS preflight to the CRM submit endpoint with a
// college-site Origin answers 204 with NO Access-Control-Allow-Origin header (measured 2026-08-11,
// re-confirmed 2026-08-16), so a browser blocks a direct cross-origin POST. Server-to-server has no
// CORS check. The endpoint is public - no key, no auth - so nothing secret lives here.
//
// SAME CONTRACT AS THE SIX COLLEGE SITES (app/actions/<college>-enquiry.ts on each): same body,
// same honeypot key, utmSource = the visitor's own utm_source or else the site host, utmMedium =
// site-form, utmCampaign = <prefix>-<page> (lib/enquiry/campaign-tags.ts, 2026-10-31),
// 409 = "this phone already applied", shown as success. Unlike the old admission_inquiries form,
// nothing is written to this site's own Supabase: the CRM is the one list counsellors work from.
//
// PII: name and phone go to the CRM and nowhere else. Never log them, never send them to GA4.

import { z } from 'zod'
import { institutionForProgramme } from '@/lib/enquiry/crm-programmes'
import { crmCampaign } from '@/lib/enquiry/campaign-tags'
import type { EnquirySite } from '@/lib/enquiry/site'

const CRM_SLUG = 'jkkn-admission-2026'
export const CRM_SUBMIT_URL = `https://www.jkkn.ai/api/public/forms/${CRM_SLUG}/submit`

type Field = 'name' | 'phone' | 'programme'

export type EnquiryState = {
  success: boolean
  message?: string
  error?: string
  /** Echoed back so the browser can fire the GA4 event with no PII in it. */
  tracking?: { source_page: string; programme_id: string }
  fieldErrors?: Partial<Record<Field, string>>
}

const EnquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(100, 'Please shorten the name.'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number (it starts with 6, 7, 8 or 9).'),
  programme: z.string().min(1, 'Please choose a programme.'),
  district: z.string().trim().max(60),
  question: z.string().trim().max(300),
  sourcePage: z.string().trim().max(60),
})

function text(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v : ''
}

export async function submitEnquiryToCrm(
  formData: FormData,
  site: EnquirySite,
  fetchImpl: typeof fetch = fetch
): Promise<EnquiryState> {
  const parsed = EnquirySchema.safeParse({
    name: text(formData, 'name'),
    phone: text(formData, 'phone').replace(/\D/g, ''),
    programme: text(formData, 'programme'),
    district: text(formData, 'district'),
    question: text(formData, 'question'),
    sourcePage: text(formData, 'source_page').toLowerCase().replace(/[^a-z0-9-]/g, '-'),
  })

  const fieldErrors: EnquiryState['fieldErrors'] = {}
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if ((key === 'name' || key === 'phone' || key === 'programme') && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
  }
  // The programme must be one this site offers; the institution is read from it, never sent by
  // the browser, so a tampered form cannot file a lead under the wrong college.
  const programme = text(formData, 'programme')
  const institutionId = institutionForProgramme(site.id, programme)
  if (!institutionId && !fieldErrors.programme) fieldErrors.programme = 'Please choose a programme.'

  if (!parsed.success || !institutionId || Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  const d = parsed.data
  const sourcePage = d.sourcePage || 'site'
  const payload = {
    formData: {
      first_name: d.name,
      phone: d.phone,
      district: d.district,
      institution_program: { institution_id: institutionId, program_id: d.programme },
    },
    // The CRM expects this key and treats a non-empty value as a bot. The form renders it
    // off-screen; a person never fills it.
    honeypot: text(formData, 'company_website'),
    sessionId: crypto.randomUUID(),
    // The visitor's own campaign tags win when they brought some (lib/enquiry/campaign-tags.ts).
    ...crmCampaign(formData, {
      utmSource: site.host,
      utmMedium: 'site-form',
      utmCampaign: `${site.campaignPrefix}-${sourcePage}`.slice(0, 80),
    }),
    campaignLinkId: null,
    referrerUrl: d.question ? `question: ${d.question}` : '',
  }

  const tracking = { source_page: sourcePage, programme_id: d.programme }
  const callUs = `Please call ${site.phoneDisplay} or message us on WhatsApp.`

  try {
    const res = await fetchImpl(CRM_SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // A parent staring at a spinner is a lost lead. Fail loudly and fast.
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    })

    if (res.status === 409) {
      // This phone has already applied. Not a failure for the parent - they are in the list.
      return {
        success: true,
        message:
          'You have already enquired with this number. Our admission team will call you — no need to submit again.',
        tracking,
      }
    }

    if (!res.ok) {
      console.error('[enquiry] CRM rejected submit', res.status, site.id)
      return { success: false, error: `We could not submit your enquiry just now. ${callUs}` }
    }

    return {
      success: true,
      message: 'Thank you. Our admission team will contact you within 24 hours on WhatsApp or by phone.',
      tracking,
    }
  } catch (err) {
    console.error('[enquiry] network/timeout reaching CRM', site.id, err instanceof Error ? err.name : 'error')
    return { success: false, error: `We could not reach our admission system. ${callUs}` }
  }
}
