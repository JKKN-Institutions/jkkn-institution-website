/**
 * llms.txt Route Handler — Institution-Aware
 *
 * Serves a machine-readable brief for AI language models (ChatGPT, Perplexity,
 * Google AI Mode, Claude) so they can accurately cite this institution.
 *
 * Standard: https://llmstxt.org/
 * GEO signal: Structured factual content increases AI citation accuracy.
 *
 * Each institution deployment serves its own llms.txt via
 * NEXT_PUBLIC_INSTITUTION_ID and NEXT_PUBLIC_SITE_URL env vars.
 */

import { getLlmsTxt } from '@/lib/config/llms-txt.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  // Refuse to serve a brief this deployment cannot address correctly.
  //
  // getLlmsTxt() interpolates siteUrl into EVERY link in the file. If the variable is missing
  // or points at localhost — which is the case on the engineering deployment as at 2026-08-25,
  // where robots.txt and sitemap.xml both publish http://localhost:3000 — the brief would hand
  // AI crawlers a page of unreachable URLs, and they would ingest those as fact.
  //
  // Falling back to a hardcoded production URL is NOT safe here either. The shared
  // getSiteUrl() fallback in lib/utils/site-url.ts is 'https://jkkn.ac.in', the PARENT, so an
  // engineering deployment would publish a brief about engineering that links to the parent.
  // Wrong and plausible is worse than absent.
  //
  // 503 rather than 404: the route works and the file exists. This is a configuration fault,
  // and it heals itself the moment NEXT_PUBLIC_SITE_URL is set for that deployment. A 404
  // would tell crawlers the resource does not exist and teach them to stop asking.
  if (!siteUrl || siteUrl.includes('localhost')) {
    return new NextResponse(
      'llms.txt is temporarily unavailable: NEXT_PUBLIC_SITE_URL is not configured for this deployment.\n',
      {
        status: 503,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  const content = getLlmsTxt(institutionId, siteUrl.replace(/\/$/, ''))

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
