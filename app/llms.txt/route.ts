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

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  const content = getLlmsTxt(institutionId, siteUrl)

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
