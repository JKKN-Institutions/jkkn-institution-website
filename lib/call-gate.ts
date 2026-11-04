// Call / WhatsApp form gate for the two sites this codebase serves - the JKKN parent site
// (www.jkkn.ac.in, site id "main") and JKKN College of Engineering (engg.jkkn.ac.in, "engineering").
// Ported 2026-11-04 from the Dental site, where it went live 2026-11-03 / 11-04 and the user tested
// it on a phone; Pharmacy and Nursing carry the same port.
//
// WHY. Every Call and WhatsApp button on both sites points at ONE number, +91 93458 55001, and a
// tap on it left no trace in the CRM: a tap carries no phone number, so no call or chat could be
// tied to a website visit. With the gate, a tap opens the 3-box enquiry form first; its button
// ("Call Counsellor" / "Chat on WhatsApp") sends the lead to the CRM AND opens the dialer /
// WhatsApp in the same tap. So every gated contact has a CRM "website" lead created a moment
// before it.
//
// User's choices (Dental, 2026-11-03 / 11-04, the same for every site): every 93458 55001 button
// is gated, the form is a must (no skip link), the visitor picks a course the CRM holds
// (lib/enquiry/crm-programmes.ts: Engineering's 7 programmes on engg, all seven colleges on the
// main site). Any other phone number never matches, so it stays direct (the CMS floating button's
// office line +91 4222 661100, staff and committee mobiles, etc.).
//
// Not gated (a tap reaches the number directly), on both sites:
//  - /careers and below: job seekers, not admission enquiries.
//  - The two school pages of the main site - /our-schools, /jkkn-matriculation-higher-secondary-
//    school and /nattraja-vidhyalya (live sitemap-institutions.xml, read 2026-11-04). The CRM has
//    no school institution, so the form cannot take a school admission - the Dental "DSA page" rule.
//  - Admin, editor and preview routes (isGateOffPath): staff, not visitors. The enquiry provider is
//    not mounted there at all; this list is the second lock.
// Engineering has no course page outside its 7 CRM programmes (live sitemap-courses.xml, read
// 2026-11-04: be-cse, be-ece, be-eee, be-mechanical, btech-it, me-cse, mba, plus the S&H first-year
// department page, which feeds every B.E. / B.Tech programme), so nothing more is ungated there.
//
// Plain module: no React, no server code - the modal and the form both import it.

import { CRM_INSTITUTIONS, ENGG_DEFAULT_PROGRAMME_BY_SLUG } from '@/lib/enquiry/crm-programmes'

export type GateIntent = 'call' | 'whatsapp'

export const GATE_PHONE = '+919345855001'
export const GATE_PHONE_DISPLAY = '+91 93458 55001'
const GATE_DIGITS = '9345855001'

/** Paths where a tap must reach the number directly. */
const UNGATED_PATH_PREFIXES = [
  '/careers',
  '/our-schools',
  '/jkkn-matriculation-higher-secondary-school',
  '/nattraja-vidhyalya',
]

/** Staff routes: no gate and no plain-text dialling (an editor clicks numbers while editing). */
const GATE_OFF_PATH_PREFIXES = ['/admin', '/editor', '/faculty-admin', '/auth', '/preview', '/test-richtext']

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  const p = pathname.toLowerCase()
  return prefixes.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))
}

export function isUngatedPath(pathname: string): boolean {
  return matchesPrefix(pathname, UNGATED_PATH_PREFIXES)
}

export function isGateOffPath(pathname: string): boolean {
  return matchesPrefix(pathname, GATE_OFF_PATH_PREFIXES)
}

/**
 * Which gate a link belongs to, or null for any other link.
 * tel: links match when their digits end in the admission number (so "tel:+91 93458 55001",
 * "tel:9345855001" and "tel: +91 93458 55001" all count, and any other number does not).
 * WhatsApp links match wa.me/<number> and api.whatsapp.com/send?phone=<number>.
 */
export function gateIntentForHref(rawHref: string): GateIntent | null {
  const href = rawHref.trim().toLowerCase()
  if (href.startsWith('tel:')) {
    const digits = href.slice(4).replace(/\D/g, '')
    return digits.endsWith(GATE_DIGITS) ? 'call' : null
  }
  const wa = href.match(/^https?:\/\/(?:wa\.me\/(\d+)|(?:api|web)\.whatsapp\.com\/send\/?\?(?:.*&)?phone=(\d+))/)
  if (wa) {
    const digits = wa[1] ?? wa[2] ?? ''
    return digits.endsWith(GATE_DIGITS) ? 'whatsapp' : null
  }
  return null
}

/** Short page tag for the CRM source and the WhatsApp reference, e.g. "-contact" or "-home". */
export function pageTag(pathname: string): string {
  return (
    pathname
      .toLowerCase()
      .replace(/[^a-z0-9/-]/g, '')
      .replace(/\/+$/, '')
      .replace(/\/+/g, '-') || '-home'
  )
}

/** Own keys only: a path like /admissions/constructor must not read Object.prototype. */
function own(map: Readonly<Record<string, string>>, key: string | undefined): string | undefined {
  return key && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined
}

// The /courses/<slug> pages use their own slugs for three Engineering programmes.
const COURSES_ROUTE_SLUG: Readonly<Record<string, string>> = { ece: 'be-ece', it: 'btech-it', 'me-cse': 'me-cse' }

/**
 * Pre-selects the course on a one-programme page, so /admissions/be-cse opens on B.E. CSE.
 * Engineering's programme pages only: /admissions/<slug>, /courses-offered/ug|pg/<slug> and
 * /courses/<slug>. Both sites offer these ids (the main form lists all seven colleges). Every other
 * page - the S&H department page, the main site's per-college course lists - opens on "Select a
 * Programme": its visitor's course is not known.
 */
export function programmeForPath(pathname: string): string | undefined {
  const seg = pathname.toLowerCase().split('/').filter(Boolean)
  if (seg[0] === 'admissions') return own(ENGG_DEFAULT_PROGRAMME_BY_SLUG, seg[1])
  if (seg[0] === 'courses-offered' && (seg[1] === 'ug' || seg[1] === 'pg')) return own(ENGG_DEFAULT_PROGRAMME_BY_SLUG, seg[2])
  if (seg[0] === 'courses') return own(ENGG_DEFAULT_PROGRAMME_BY_SLUG, own(COURSES_ROUTE_SLUG, seg[1]))
  return undefined
}

/** "BDS", "B.E. Computer Science and Engineering", "M.Pharm Pharmaceutics" - the course as a parent would type it. */
export function courseShort(programmeId: string): string {
  for (const inst of CRM_INSTITUTIONS) {
    const label = inst.programmes.find((p) => p.id === programmeId)?.label
    if (!label) continue
    const clean = label.replace(/\s*\(\d+ years?\)\s*$/i, '')
    const [head, tail] = clean.split(' — ')
    if (!tail || /^(Bachelor|Master)\b/.test(tail)) return head
    if (head === 'M.Sc Nursing') return `M.Sc ${tail}`
    return `${head} ${tail}`
  }
  return ''
}

/** WhatsApp reference code per site: WEB-MAIN-<page> on www.jkkn.ac.in, WEB-ENGG-<page> on engg. */
export function refCode(siteId: string): string {
  return siteId === 'engineering' ? 'ENGG' : 'MAIN'
}

/**
 * WhatsApp link with the course and a page reference typed into the box.
 * No name and no phone in it, ever: a link like this can end up in analytics or logs.
 */
export function whatsappGateUrl(programmeId: string, pathname: string, siteId: string): string {
  const ref = pageTag(pathname).replace(/^-/, '').slice(0, 30) || 'home'
  const course =
    courseShort(programmeId) || (siteId === 'engineering' ? 'B.E. / B.Tech / M.E. / MBA' : 'JKKN college')
  const text = `Hi, ${course} admission details venum. Ref: WEB-${refCode(siteId)}-${ref}`
  return `https://wa.me/${GATE_PHONE.replace('+', '')}?text=${encodeURIComponent(text)}`
}

export const telGateUrl = `tel:${GATE_PHONE}`

// Plain-text numbers. Both sites print the number as plain text in many places (FAQ answers, the
// admission pages, page copy); iPhone used to turn those into dial links of its own, outside the
// gate. The root layout now switches that off, and the enquiry modal reads a tap on such a number
// with numberAtOffset(). Indian mobiles only, as a visitor reads them: "+91 93458 55001",
// "93458 55001", "9345855001", "+91-9345855001".
const PLAIN_MOBILE = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g

/** The 10-digit mobile number that a character offset of a text falls inside, or null. */
export function numberAtOffset(text: string, offset: number): string | null {
  for (const m of text.matchAll(PLAIN_MOBILE)) {
    const start = m.index ?? 0
    if (offset >= start && offset <= start + m[0].length) return m[0].replace(/\D/g, '').slice(-10)
  }
  return null
}

/** True for the admission number - the one number the gate applies to. */
export function isGateNumber(digits: string): boolean {
  return digits === GATE_DIGITS
}

export function telUrlFor(digits: string): string {
  return `tel:+91${digits}`
}
