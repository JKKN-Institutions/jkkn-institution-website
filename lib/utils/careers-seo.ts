// lib/utils/careers-seo.ts
//
// <head> SEO for /careers/<job>. HR can write it per job in MyJKKN (job form →
// "Website SEO", columns hr_recruitment_jobs.seo_*, sent as `job.seo`); whatever
// HR leaves empty is built here from the job's own fields.
//
// Nothing here reaches the visible page: the heading and text keep showing
// HR's `title` and `description`. Pure — safe in tests and on the server.

import type { PublicJob } from '@/lib/schemas/public-careers'
import { canonicalCity, qualificationSummary } from '@/lib/utils/careers-facets'
import { formatExperience } from '@/lib/utils/careers-format'
import { formatJobTitle, normalizeText } from '@/lib/utils/careers-text'

const DEFAULT_ORGANISATION = 'JKKN Institutions'
const MAX_AUTO_KEYWORDS = 8

export interface JobSeoMeta {
  title: string
  description: string
  keywords: string[]
  /** https share image HR chose, or null for the site default. */
  ogImage: string | null
  /** HR asked search engines to skip this job (e.g. a test posting). */
  noindex: boolean
}

type SeoSource = Pick<
  PublicJob,
  | 'title' | 'institution' | 'department' | 'city' | 'state'
  | 'min_experience_years' | 'max_experience_years' | 'qualifications' | 'education_level' | 'seo'
>

// "<role> - <place>" / "–" / "—" / "|": the LAST separator splits off the tail.
const TRAILING_SEGMENT = /^(.*\S)\s+[-–—|]\s+(\S.*)$/

/**
 * The role as it should read in front of "at <institution>": tidied, and
 * without a trailing segment the institution name already says —
 * "CCTV Monitoring Operator - Main Office" at "JKKN Main Office" would
 * otherwise read "… Main Office at JKKN Main Office".
 */
function roleFor(job: SeoSource, where: string): string {
  const title = formatJobTitle(job.title)
  const m = title.match(TRAILING_SEGMENT)
  if (m && normalizeText(where).includes(normalizeText(m[2]))) return m[1]
  return title
}

/** Department, only when the role does not already name it. */
function departmentFor(job: SeoSource, role: string): string | null {
  const dept = job.department?.name?.trim()
  if (!dept) return null
  return normalizeText(role).includes(normalizeText(dept)) ? null : dept
}

export function autoJobTitle(job: SeoSource): string {
  const where = job.institution?.name ?? DEFAULT_ORGANISATION
  const title = formatJobTitle(job.title)
  // "Principal JKKN College of Education" already says where.
  if (normalizeText(title).includes(normalizeText(where))) return title
  const role = roleFor(job, where)
  const dept = departmentFor(job, role)
  return `${role}${dept ? `, ${dept}` : ''} at ${where}`
}

export function autoJobDescription(job: SeoSource): string {
  const where = job.institution?.name ?? DEFAULT_ORGANISATION
  const role = roleFor(job, where)
  const dept = departmentFor(job, role)
  const location = [canonicalCity(job.city), job.state].filter(Boolean).join(', ')
  const experience = formatExperience(job.min_experience_years, job.max_experience_years)
  const qualification = qualificationSummary(job)
  return [
    `${role}${dept ? `, ${dept}` : ''} at ${where}${location ? `, ${location}` : ''}.`,
    experience && `Experience: ${experience}.`,
    qualification && `Qualification: ${qualification}.`,
    'Apply online, no account needed.',
  ].filter(Boolean).join(' ')
}

export function autoJobKeywords(job: SeoSource): string[] {
  const where = job.institution?.name ?? DEFAULT_ORGANISATION
  const role = roleFor(job, where)
  const city = canonicalCity(job.city)
  return uniqueKeywords([
    role,
    `${role} job`,
    job.department?.name,
    where,
    city && `jobs in ${city}`,
    `${where} careers`,
  ]).slice(0, MAX_AUTO_KEYWORDS)
}

function uniqueKeywords(values: Array<string | null | undefined | false>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of values) {
    const k = typeof v === 'string' ? v.trim() : ''
    if (!k || seen.has(k.toLowerCase())) continue
    seen.add(k.toLowerCase())
    out.push(k)
  }
  return out
}

/** HR's SEO first, field by field; anything HR left empty is built from the job. */
export function buildJobSeo(job: SeoSource): JobSeoMeta {
  const seo = job.seo
  const keywords = uniqueKeywords(seo?.keywords ?? [])
  const ogImage = seo?.og_image?.trim() ?? ''
  return {
    title: seo?.title?.trim() || autoJobTitle(job),
    description: seo?.description?.trim() || autoJobDescription(job),
    keywords: keywords.length > 0 ? keywords : autoJobKeywords(job),
    ogImage: /^https:\/\//.test(ogImage) ? ogImage : null,
    noindex: seo?.noindex === true,
  }
}
