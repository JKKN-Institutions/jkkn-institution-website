// Per-site settings for the enquiry form. One codebase serves two live sites (main = www.jkkn.ac.in,
// engineering = engg.jkkn.ac.in), picked by NEXT_PUBLIC_INSTITUTION_ID at build time. Any other
// institution id gets null, and every enquiry component renders nothing there.
//
// Phone: +91 93458 55001 is the number both live sites print on /contact and /admissions (read
// 2026-10-31). Trust line: each Engineering item comes from the official data module, which names
// its source; the main site has no such module yet, so it shows no trust line rather than an
// unsourced one.

import { ENGG_OFFICIAL, NAAC_LABEL } from '@/lib/institutions/engineering/official-data'

export type EnquirySiteId = 'main' | 'engineering'

export type EnquirySite = {
  id: EnquirySiteId
  /** utm_source on every lead from this site - the same shape the six college sites send. */
  host: string
  /** Prefix of utm_campaign, e.g. engg-admissions-be-cse. */
  campaignPrefix: string
  /** GA4 form_name. */
  formName: string
  phone: string
  phoneDisplay: string
  trust: ReadonlyArray<string>
  dialogTitle: string
  sectionHeading: string
  questionPlaceholder: string
}

const PHONE = '+919345855001'
const PHONE_DISPLAY = '+91 93458 55001'

const SITES: Record<EnquirySiteId, EnquirySite> = {
  engineering: {
    id: 'engineering',
    host: 'engg.jkkn.ac.in',
    campaignPrefix: 'engg',
    formName: 'engg_enquiry',
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    // NAAC: NAAC valid-accreditation list as on 14-08-2025. AICTE: Extension of Approval 2026-27.
    // TNEA code: DoTE TNEA 2026 list. All three in lib/institutions/engineering/official-data.ts.
    trust: [NAAC_LABEL, 'AICTE Approved', `TNEA Code ${ENGG_OFFICIAL.codes.tnea}`],
    dialogTitle: 'Get engineering course fee and admission details',
    sectionHeading: 'Get B.E. / B.Tech / M.E. / MBA Fee & Admission Details',
    questionPlaceholder: 'e.g., What is the fee for B.E. CSE?',
  },
  main: {
    id: 'main',
    host: 'www.jkkn.ac.in',
    campaignPrefix: 'main',
    formName: 'main_enquiry',
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    trust: [],
    dialogTitle: 'Get course fee and admission details for any JKKN college',
    sectionHeading: 'Get Fee & Admission Details for Any JKKN College',
    questionPlaceholder: 'e.g., What is the fee for B.Pharm?',
  },
}

export function enquirySiteFor(institutionId: string | undefined): EnquirySite | null {
  const id = institutionId || 'main'
  return id === 'main' || id === 'engineering' ? SITES[id] : null
}

/** The site this build serves. Safe on the server and in the browser (NEXT_PUBLIC_ is inlined). */
export function currentEnquirySite(): EnquirySite | null {
  return enquirySiteFor(process.env.NEXT_PUBLIC_INSTITUTION_ID)
}

const APPLY_BASE = 'https://www.jkkn.ai/apply/jkkn-admission-2026'

/** The full jkkn.ai application, tagged with this site and the page it was opened from. */
export function fullApplicationHref(site: EnquirySite, sourcePage: string): string {
  const q = new URLSearchParams({
    utm_source: site.host,
    utm_medium: 'organic',
    utm_campaign: `${site.campaignPrefix}-${sourcePage}`.slice(0, 80),
  })
  return `${APPLY_BASE}?${q.toString()}`
}

/** "/admissions/be-cse/" -> "admissions-be-cse"; "/" -> "home". Safe for a utm_campaign value. */
export function sourcePageFromPath(pathname: string): string {
  const slug = pathname
    .toLowerCase()
    .replace(/[^a-z0-9/-]/g, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '-')
  return (slug || 'home').slice(0, 60)
}
