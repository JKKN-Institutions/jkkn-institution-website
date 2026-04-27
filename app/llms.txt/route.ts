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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  const content = getLlmsTxt(institutionId, siteUrl)

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
