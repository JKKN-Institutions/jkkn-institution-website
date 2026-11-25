// lib/utils/careers-indeed-feed.ts
//
// Indeed XML job feed, built from the SAME JobPosting JSON-LD the job pages
// already serve to Google (components/seo/job-posting-schema.tsx). One source
// means a job can never say one thing on the page, another in Google for Jobs
// and a third on Indeed: title, salary, address and description all come from
// the one object.
//
// Tags follow Indeed's XML feed spec (docs.indeed.com/job-sync-xml/xml-feed,
// read 2026-11-25): required title, date (ISO 8601), referencenumber,
// requisitionid, url (the job details page), company, city, state, country,
// email (the Indeed account's address), description; postalcode,
// streetaddress, salary, education, jobtype and experience because the
// career site shows them; category because Indeed "strongly recommends" it.
// publisher / sourcename are for ATS developers only, so they are left out.
// No <expirationdate>: JKKN jobs are always open (user decision 2026-10-12),
// the same reason the JSON-LD carries no validThrough. The feed must hold
// EVERY job on the careers page - Indeed does not accept partial feeds.

export interface IndeedFeedEntry {
  /** MyJKKN job id (UUID). Stable across retitles, unlike the page slug. */
  jobId: string
  /** Output of buildJobPostingJsonLd for this job. */
  posting: Record<string, unknown>
  /** The category label the site shows (e.g. "Teaching Faculty"). */
  category?: string
  /** MyJKKN minimum experience; 0 means freshers, which the JSON-LD cannot say. */
  experienceYears?: number | null
}

export interface IndeedJobOptions {
  /** The email address of JKKN's Indeed employer account (required by Indeed). */
  accountEmail: string
  /** Added to every job URL so GA4 can tell Indeed visits apart. */
  utm?: Record<string, string>
}

export type IndeedFeedOptions = IndeedJobOptions

export const INDEED_UTM: Readonly<Record<string, string>> = { utm_source: 'indeed', utm_medium: 'job_feed' }

const JOB_TYPE: Record<string, string> = {
  FULL_TIME: 'fulltime', PART_TIME: 'parttime', CONTRACTOR: 'contract', INTERN: 'internship', TEMPORARY: 'temporary',
}
const UNIT_WORD: Record<string, string> = { MONTH: 'month', YEAR: 'year', HOUR: 'hour', DAY: 'day', WEEK: 'week' }
const CURRENCY_SIGN: Record<string, string> = { INR: '₹' }

type Obj = Record<string, unknown>
const obj = (v: unknown): Obj | undefined => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : undefined)
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined)

// XML 1.0 forbids most control characters even inside CDATA; HR text pasted
// from Word or a chat window can carry them, and one bad byte breaks the whole feed.
const INVALID_XML = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g

/** Wraps text in CDATA, splitting any "]]>" so it cannot close the section early. */
export function cdata(value: string): string {
  return `<![CDATA[${value.replace(INVALID_XML, '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

/** ISO 8601 in UTC, the date format Indeed's spec asks for; undefined for a bad date. */
export function indeedDate(iso: string): string | undefined {
  const t = Date.parse(iso)
  return Number.isNaN(t) ? undefined : new Date(t).toISOString()
}

const money = (n: number, currency: string) => {
  const amount = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)
  const sign = CURRENCY_SIGN[currency]
  return sign ? `${sign}${amount}` : `${currency} ${amount}`
}

/** "₹25,000 - ₹35,000 per month", "₹15,000 per month", "From ₹24,000 per month"; undefined when no salary. */
export function salaryText(baseSalary: unknown): string | undefined {
  const s = obj(baseSalary)
  const v = obj(s?.value)
  if (!s || !v) return undefined
  const currency = str(s.currency) ?? 'INR'
  const per = UNIT_WORD[str(v.unitText) ?? 'MONTH'] ?? 'month'
  const single = num(v.value)
  const min = num(v.minValue)
  const max = num(v.maxValue)
  if (single !== undefined) return `${money(single, currency)} per ${per}`
  if (min !== undefined && max !== undefined) return `${money(min, currency)} - ${money(max, currency)} per ${per}`
  if (min !== undefined) return `From ${money(min, currency)} per ${per}`
  if (max !== undefined) return `Up to ${money(max, currency)} per ${per}`
  return undefined
}

/** "5+ years" from monthsOfExperience 60; undefined when the posting carries none. */
export function experienceText(req: unknown): string | undefined {
  const months = num(obj(req)?.monthsOfExperience)
  if (!months || months <= 0) return undefined
  if (months % 12 === 0) {
    const years = months / 12
    return `${years}+ ${years === 1 ? 'year' : 'years'}`
  }
  return `${months}+ months`
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function withUtm(url: string, utm: Record<string, string> | undefined): string {
  if (!utm || !Object.keys(utm).length) return url
  const u = new URL(url)
  for (const [k, v] of Object.entries(utm)) u.searchParams.set(k, v)
  return u.toString()
}

/**
 * One <job> element, or null when a field Indeed requires cannot be filled
 * (title, date, url, company, description, email, id) - a broken job is left
 * out rather than sent half-filled.
 */
export function buildIndeedJobXml(entry: IndeedFeedEntry, opts: IndeedJobOptions): string | null {
  const p = entry.posting
  const title = str(p.title)
  const date = str(p.datePosted) ? indeedDate(p.datePosted as string) : undefined
  const pageUrl = str(p.url)
  const company = str(obj(p.hiringOrganization)?.name)
  const description = str(p.description)
  const jobId = str(entry.jobId)
  const email = str(opts.accountEmail)
  if (!title || !date || !pageUrl || !company || !description || !jobId || !email) return null

  const address = obj(obj(p.jobLocation)?.address) ?? {}
  const credential = str(obj(p.educationRequirements)?.credentialCategory)
  const experience = experienceText(p.experienceRequirements)
    ?? (entry.experienceYears === 0 ? 'No experience required' : undefined)
  const fields: Array<[string, string | undefined]> = [
    ['title', title],
    ['date', date],
    ['referencenumber', jobId],
    // Required by Indeed; the HR job code when MyJKKN has one, otherwise the job id.
    ['requisitionid', str(obj(p.identifier)?.value) ?? jobId],
    ['url', withUtm(pageUrl, opts.utm)],
    ['company', company],
    ['city', str(address.addressLocality)],
    ['state', str(address.addressRegion)],
    ['country', str(address.addressCountry) ?? 'IN'],
    ['postalcode', str(address.postalCode)],
    ['streetaddress', str(address.streetAddress)],
    ['email', email],
    ['description', description],
    ['salary', salaryText(p.baseSalary)],
    ['education', credential ? capitalise(credential) : undefined],
    ['jobtype', JOB_TYPE[str(p.employmentType) ?? '']],
    ['category', str(entry.category)],
    ['experience', experience],
  ]
  const body = fields
    .filter((f): f is [string, string] => typeof f[1] === 'string' && f[1].length > 0)
    .map(([tag, value]) => `    <${tag}>${cdata(value)}</${tag}>`)
    .join('\n')
  return `  <job>\n${body}\n  </job>`
}

/** The whole feed. Jobs that fail buildIndeedJobXml are skipped, never emitted empty. */
export function buildIndeedFeedXml(entries: IndeedFeedEntry[], opts: IndeedFeedOptions): string {
  const jobs = entries
    .map(e => buildIndeedJobXml(e, opts))
    .filter((x): x is string => x !== null)
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<source>',
    ...jobs,
    '</source>',
    '',
  ].join('\n')
}
