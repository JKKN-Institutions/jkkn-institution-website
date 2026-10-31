// Campaign tags from the visitor's landing URL, carried to the jkkn.ai CRM (Step 2 of the
// 10,300-lead plan, 2026-10-31).
//
// WHY. Until 2026-10-31 this site sent every lead to the CRM as utmSource = the site host, and every
// Apply link carried a fixed utm_medium=organic. A parent who came from a Meta ad, a WhatsApp link or
// a brochure QR was filed as the site's own organic traffic (CRM pull 2026-10-24: 1,017 of 1,348
// website leads had no channel tag). This file keeps the tags the visitor ARRIVED with - the first
// tagged landing of the visit, in sessionStorage - and hands them to the enquiry form and to every
// jkkn.ai/apply link. The six college sites carry the same file (lib/campaign-tags.ts).
//
// WHAT THE CRM KEEPS (read on 2 test leads, 2026-10-31): only utmSource, shown as the lead tag
// "utm:<value>". utmMedium and utmCampaign are sent but not stored yet - that is a CRM-side change.
// So the source is the value that decides the report:
//   the visitor's own utm_source > google (Google Ads click id) > facebook (Meta click id) > site host
// The site host stays the fallback, so organic search, direct visits and other sites read exactly as
// before (GA4 splits those). Values follow the house UTM convention: lower case, words joined by "-".
//
// Only the campaign words of the landing URL are kept here - never a name, a phone or anything personal.

export const CAMPAIGN_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
] as const

export type CampaignKey = (typeof CAMPAIGN_KEYS)[number]
export type CampaignTags = Partial<Record<CampaignKey, string>>
export type CrmCampaign = { utmSource: string; utmMedium: string; utmCampaign: string }

const STORE_KEY = 'jkkn_first_touch'
const CLICK_IDS: ReadonlyArray<CampaignKey> = ['gclid', 'gbraid', 'wbraid', 'fbclid']

/** House shape for a utm value: lower case, a-z 0-9 . _ - only, spaces become "-". Click ids keep their case. */
export function cleanTag(key: CampaignKey, value: unknown): string {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (CLICK_IDS.includes(key)) return raw.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 200)
  return raw
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

/** Every campaign key in a query string, cleaned; empty values are dropped. */
export function tagsFromSearch(search: string): CampaignTags {
  const query = new URLSearchParams(search)
  const tags: CampaignTags = {}
  for (const key of CAMPAIGN_KEYS) {
    const value = cleanTag(key, query.get(key))
    if (value) tags[key] = value
  }
  return tags
}

/** The tags stored as JSON, cleaned again (storage can be edited by hand). */
export function parseCampaignTags(json: string): CampaignTags {
  try {
    const saved: unknown = JSON.parse(json || '{}')
    if (!saved || typeof saved !== 'object') return {}
    const tags: CampaignTags = {}
    for (const key of CAMPAIGN_KEYS) {
      const value = cleanTag(key, (saved as Record<string, unknown>)[key])
      if (value) tags[key] = value
    }
    return tags
  } catch {
    return {}
  }
}

/**
 * Browser: the tags of this visit as JSON ("" when it has none). The first tagged landing of the
 * visit is stored and wins; later pages without tags keep it. Same string on every call until
 * storage changes, so it is safe as a useSyncExternalStore snapshot.
 */
export function campaignTagsSnapshot(): string {
  const here = JSON.stringify(tagsFromSearch(window.location.search))
  const fresh = here === '{}' ? '' : here
  try {
    const saved = window.sessionStorage.getItem(STORE_KEY)
    if (saved) return saved
    if (fresh) window.sessionStorage.setItem(STORE_KEY, fresh)
  } catch {
    // Storage blocked (private mode, strict settings): this page's own URL is all there is.
  }
  return fresh
}

/**
 * Source / medium / campaign for the CRM. `fallback` is this site's own values (host, form kind,
 * <prefix>-<page>); the visitor's tags replace them only where the visitor brought one.
 */
export function resolveCampaign(tags: CampaignTags, fallback: CrmCampaign): CrmCampaign & { tagged: boolean } {
  const tag = (key: CampaignKey) => cleanTag(key, tags[key])
  // Google adds gclid / gbraid / wbraid to ad clicks only (auto-tagging), so they mean a Google ad.
  // Meta adds fbclid to ad AND post clicks, so it proves Facebook / Instagram, not that it was paid.
  const google = tag('gclid') || tag('gbraid') || tag('wbraid')
  const meta = tag('fbclid')
  const source = tag('utm_source') || (google ? 'google' : meta ? 'facebook' : '')
  if (!source) return { ...fallback, tagged: false }
  return {
    utmSource: source,
    utmMedium: tag('utm_medium') || (google ? 'cpc' : meta ? 'social' : fallback.utmMedium),
    utmCampaign: tag('utm_campaign') || fallback.utmCampaign,
    tagged: true,
  }
}

/** Server: the CRM payload's utm fields, from the hidden inputs campaign-fields.tsx adds to the form. */
export function crmCampaign(formData: FormData, fallback: CrmCampaign): CrmCampaign {
  const tags: CampaignTags = {}
  for (const key of CAMPAIGN_KEYS) {
    const value = formData.get(key)
    if (typeof value === 'string' && value) tags[key] = value
  }
  const { utmSource, utmMedium, utmCampaign } = resolveCampaign(tags, fallback)
  return { utmSource, utmMedium, utmCampaign }
}

/**
 * A jkkn.ai/apply link carrying this visit's tags. Without tags the link keeps its own utm_source /
 * utm_campaign and only loses a fixed utm_medium=organic (CMS posts still carry it). A link with no
 * utm_source at all gets `defaults` - this site's host and page. Any other link comes back unchanged.
 */
export function tagApplyHref(
  href: string,
  tags: CampaignTags,
  defaults: { utmSource: string; utmCampaign: string },
  base = 'https://www.jkkn.ai/'
): string {
  let url: URL
  try {
    url = new URL(href, base)
  } catch {
    return href
  }
  if (!/(^|\.)jkkn\.ai$/.test(url.hostname) || !url.pathname.startsWith('/apply')) return href
  const query = url.searchParams
  if (query.get('utm_medium') === 'organic') query.delete('utm_medium')
  if (!query.get('utm_source')) {
    query.set('utm_source', cleanTag('utm_source', defaults.utmSource))
    if (!query.get('utm_campaign')) query.set('utm_campaign', cleanTag('utm_campaign', defaults.utmCampaign))
  }
  const own = {
    utmSource: query.get('utm_source') || '',
    utmMedium: query.get('utm_medium') || '',
    utmCampaign: query.get('utm_campaign') || '',
  }
  const resolved = resolveCampaign(tags, own)
  if (resolved.tagged) {
    query.set('utm_source', resolved.utmSource)
    if (resolved.utmMedium) query.set('utm_medium', resolved.utmMedium)
    else query.delete('utm_medium')
    if (resolved.utmCampaign) query.set('utm_campaign', resolved.utmCampaign)
    for (const key of ['utm_content', 'utm_term'] as const) {
      const value = cleanTag(key, tags[key])
      if (value) query.set(key, value)
    }
  }
  return url.toString()
}
