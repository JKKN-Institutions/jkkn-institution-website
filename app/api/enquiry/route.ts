// POST /api/enquiry - the same site enquiry submit (www.jkkn.ac.in and engg.jkkn.ac.in), reachable
// with fetch().
//
// WHY A ROUTE AND NOT ONLY THE SERVER ACTION. The Call / WhatsApp gate (lib/call-gate.ts, 2026-11-04)
// must open the dialer or WhatsApp in the SAME tap that sends the lead: a browser lets a page open
// another app only during a user's tap, and waiting for the CRM's answer first can outlast that
// window. So the form sends itself with fetch(..., { keepalive: true }) - which a server action
// cannot be called with - and opens the app at once; keepalive lets the request finish even if the
// page goes away.
//
// It runs the SAME server action as the form (submitEnquiry -> submitEnquiryToCrm): same
// validation, same CRM payload, same 409 handling, same ENQUIRY_DRY_RUN test switch. Nothing new is
// decided here.
//
// No trailing slash: this site does not normalise to one (next.config.ts has no trailingSlash), so
// the client calls "/api/enquiry" exactly.

import { submitEnquiry } from '@/app/actions/enquiry'

export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ success: false, error: 'Bad request.' }, { status: 400 })
  }
  const result = await submitEnquiry(null, formData)
  return Response.json(result, { status: result.success ? 200 : 422 })
}
