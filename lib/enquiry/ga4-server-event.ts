// Server-side GA4 lead events (Measurement Protocol) - 2026-11-13, DEP-100. Same design as the six
// college sites (lib/ga4-server-event.ts on each), with one id and one secret per site because this
// repo serves both www.jkkn.ac.in and engg.jkkn.ac.in.
//
// WHY. The browser event lead_form_submit misses leads the CRM did get: an ad blocker or a privacy
// browser stops gtag, the Call / WhatsApp gate opens the dialer and the tab can be gone before the CRM
// answers, and the shared apply page carries no GA4 at all. Measured 2026-11-13 for 2026-10-01..11-11:
// CRM 181 website leads against 127 GA4 lead_form_submit events across the 8 sites. An event sent from
// THIS server, only after the CRM has accepted the lead, cannot be stopped by the visitor's browser.
//
// SAFE BY DEFAULT. Nothing is sent unless the site's secret is set for the Vercel project
// (GA4_MP_API_SECRET_MAIN for www, GA4_MP_API_SECRET_ENGG for engg; Settings > Environment Variables,
// then a redeploy). Without it every call returns "not_configured" and does nothing. It never throws,
// and it never delays the lead: crm-submit.ts schedules it with after() from next/server.
//
// NO PII. Only where it happened: form name, source page, programme id. Never a name or a phone number.
//
// The secret is created in GA4: Admin > Data collection and modification > Data streams > the web
// stream > Measurement Protocol API secrets > Create (Google's Measurement Protocol guide, read
// 2026-11-13). It must never appear in client code, in a log line or in git.

import { getInstitutionSEOConfigById } from '@/lib/seo/institution-seo-config'
import type { EnquirySiteId } from '@/lib/enquiry/site'

const MP_ENDPOINT = 'https://www.google-analytics.com/mp/collect'

export type ServerLeadEvent = 'lead_crm_accepted' | 'lead_crm_duplicate'
export type SendResult = 'sent' | 'not_configured' | 'failed'

/** Name of the Vercel environment variable that holds each site's Measurement Protocol secret. */
export const SECRET_ENV: Readonly<Record<EnquirySiteId, string>> = {
  main: 'GA4_MP_API_SECRET_MAIN',
  engineering: 'GA4_MP_API_SECRET_ENGG',
}

/** The same id the page's GA tag uses (analytics.gaId in lib/seo/institution-seo-config.ts). */
export function measurementIdFor(siteId: EnquirySiteId): string | undefined {
  return getInstitutionSEOConfigById(siteId)?.analytics?.gaId
}

/** gtag's _ga cookie "GA1.1.1234567890.1700000000" -> client id "1234567890.1700000000"; else null. */
export function clientIdFromGaCookie(value: string | null | undefined): string | null {
  if (!value) return null
  const m = /^GA\d+\.\d+\.(\d+\.\d+)$/.exec(value.trim())
  return m ? m[1] : null
}

/** A client id in gtag's own shape, for a visitor whose browser never let gtag set the _ga cookie. */
export function freshClientId(now: number = Date.now(), rand: number = Math.random()): string {
  return `${Math.floor(rand * 2147483647)}.${Math.floor(now / 1000)}`
}

/** Request body. Empty params are dropped; values are cut to GA4's 100-character limit. */
export function buildMpBody(clientId: string, name: ServerLeadEvent, params: Record<string, string>) {
  const clean: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value) clean[key] = String(value).slice(0, 100)
  }
  clean.engagement_time_msec = 1
  return { client_id: clientId, events: [{ name, params: clean }] }
}

export async function sendServerLeadEvent(opts: {
  siteId: EnquirySiteId
  name: ServerLeadEvent
  params: Record<string, string>
  gaCookie?: string | null
  apiSecret?: string
  measurementId?: string
  fetchImpl?: typeof fetch
  timeoutMs?: number
}): Promise<SendResult> {
  const apiSecret = opts.apiSecret ?? process.env[SECRET_ENV[opts.siteId]]
  const measurementId = opts.measurementId ?? measurementIdFor(opts.siteId)
  if (!apiSecret || !measurementId) return 'not_configured'
  const clientId = clientIdFromGaCookie(opts.gaCookie) ?? freshClientId()
  const url =
    `${MP_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}` +
    `&api_secret=${encodeURIComponent(apiSecret)}`
  try {
    const res = await (opts.fetchImpl ?? fetch)(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildMpBody(clientId, opts.name, opts.params)),
      signal: AbortSignal.timeout(opts.timeoutMs ?? 3000),
      cache: 'no-store',
    })
    // The URL carries the secret, so it is never logged - only the event name and the status.
    if (!res.ok) console.warn('[ga4-server-event] not accepted', opts.name, res.status)
    return res.ok ? 'sent' : 'failed'
  } catch {
    console.warn('[ga4-server-event] not sent', opts.name)
    return 'failed'
  }
}
