/**
 * BreadcrumbSchema — BreadcrumbList JSON-LD for a single page.
 *
 * Why this exists instead of calling getBreadcrumbsForPath():
 * that helper falls back to generateBreadcrumbsFromPath(), which links EVERY path
 * segment whether or not a page exists there. On the dental site that shape produced
 * 122 crumb links to 404s. Here, every intermediate hub was verified live on
 * 2026-09-18 (all 9 return 200), so the segments are safe — but they are listed
 * explicitly so that deleting a hub page cannot silently reintroduce broken crumbs.
 *
 * An intermediate segment that is NOT a known hub is skipped rather than linked.
 */

import { getSiteUrl } from '@/lib/utils/site-url'

/** Hub paths verified to return 200 on engg.jkkn.ac.in (measured 2026-09-18). */
const HUB_PATHS = new Set([
  '/admissions',
  '/blog',
  '/courses-offered',
  '/courses-offered/pg',
  '/courses-offered/ug',
  '/facilities',
  '/iqac',
  '/iqac/nirf',
  '/others',
])

const ACRONYMS: Record<string, string> = {
  ug: 'UG',
  pg: 'PG',
  iqac: 'IQAC',
  nirf: 'NIRF',
  naac: 'NAAC',
  cse: 'CSE',
  ece: 'ECE',
  eee: 'EEE',
  it: 'IT',
  mba: 'MBA',
  nss: 'NSS',
  sh: 'Science & Humanities',
}

function titleize(segment: string): string {
  if (ACRONYMS[segment]) return ACRONYMS[segment]
  return segment
    .split('-')
    .map((w) => ACRONYMS[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function BreadcrumbSchema({
  path,
  label,
}: {
  /** Path of the current page, e.g. "/courses-offered/ug/be-cse" */
  path: string
  /** Optional human label for the final crumb (defaults to a titleized slug) */
  label?: string
}) {
  const siteUrl = getSiteUrl()
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return null

  // Home always carries the trailing slash the site redirects to.
  const items: { name: string; url: string }[] = [{ name: 'Home', url: `${siteUrl}/` }]

  let current = ''
  segments.forEach((segment, i) => {
    current += `/${segment}`
    const isLast = i === segments.length - 1
    if (!isLast && !HUB_PATHS.has(current)) return
    items.push({
      name: isLast && label ? label : titleize(segment),
      url: `${siteUrl}${current}`,
    })
  })

  if (items.length < 2) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}${path}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
