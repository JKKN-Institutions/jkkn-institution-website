/**
 * Indeed XML job feed - every open job, for Indeed's crawler.
 *
 * Built from the same cached MyJKKN feed, slug rules and JobPosting JSON-LD as
 * the job pages (see lib/utils/careers-indeed-feed.ts), so the feed can never
 * list a job, salary or title the site does not show. A job HR hides from
 * Google (seo.noindex) or one without a posted date is left out here too.
 *
 * URL: /indeed-jobs.xml  (kept out of /api/, which robots.txt disallows)
 */

import { NextResponse } from 'next/server'
import { buildJobPostingJsonLd } from '@/components/seo/job-posting-schema'
import { isMainInstitution } from '@/lib/config/multi-tenant'
import { getSiteCareers } from '@/lib/services/public-careers-search'
import { categoryLabel } from '@/lib/utils/careers-facets'
import { buildIndeedFeedXml, INDEED_UTM, type IndeedFeedEntry } from '@/lib/utils/careers-indeed-feed'
import { getSiteUrl } from '@/lib/utils/site-url'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // same 1-hour edge cache as sitemap-careers.xml

// Indeed requires the email of the employer account the feed belongs to.
// The JKKN Indeed account is opened on this address (decision 2026-11-25);
// set INDEED_ACCOUNT_EMAIL in Vercel to change it without a code change.
const INDEED_ACCOUNT_EMAIL = process.env.INDEED_ACCOUNT_EMAIL?.trim() || 'online@jkkn.org'

export async function GET() {
  // Job pages are canonical on the parent site only; a college host serves no feed.
  if (!isMainInstitution()) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const siteUrl = getSiteUrl()

  let entries: IndeedFeedEntry[]
  try {
    const site = await getSiteCareers()
    entries = site.index.jobs.flatMap(item => {
      const posting = buildJobPostingJsonLd(item.job, `${siteUrl}/careers/${item.slug}`)
      return posting
        ? [{
            jobId: item.job.id,
            posting,
            category: categoryLabel(item.job.role_category),
            experienceYears: item.job.min_experience_years,
          }]
        : []
    })
  } catch (err) {
    // MyJKKN is unreachable. An empty feed would tell Indeed every job closed;
    // a 503 tells it to keep what it has and come back.
    console.error('[indeed-jobs] feed unavailable', err)
    return new NextResponse('Service Unavailable', { status: 503, headers: { 'Retry-After': '600' } })
  }

  const xml = buildIndeedFeedXml(entries, {
    accountEmail: INDEED_ACCOUNT_EMAIL,
    utm: INDEED_UTM,
  })
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
