'use server'

// Server action behind the site enquiry form (engg.jkkn.ac.in and www.jkkn.ac.in). The work is in
// lib/enquiry/crm-submit.ts; this file exports ONLY an async function and an erased type, because
// a 'use server' module may not export plain values.

import { submitEnquiryToCrm, type EnquiryState } from '@/lib/enquiry/crm-submit'
import { currentEnquirySite } from '@/lib/enquiry/site'

export type { EnquiryState }

export async function submitEnquiry(
  _prevState: EnquiryState | null,
  formData: FormData
): Promise<EnquiryState> {
  const site = currentEnquirySite()
  if (!site) return { success: false, error: 'Enquiries are not open on this site.' }
  return submitEnquiryToCrm(formData, site)
}
