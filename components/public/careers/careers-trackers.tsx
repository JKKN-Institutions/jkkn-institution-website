'use client'

// Render-nothing components that report what the server just rendered to GA4
// (spec §7). They sit beside server-rendered results, so the page itself stays
// a Server Component.

import { useEffect } from 'react'
import { trackCareersEvent } from '@/lib/analytics/careers-events'

interface SearchTrackerProps {
  query: string
  /** "department:Pharmaceutics|experience:5–10 years" — empty when unfiltered. */
  filters: string
  total: number
  mode: string
}

/** One event per distinct search/filter combination, not per page or sort change. */
export function CareersSearchTracker({ query, filters, total, mode }: SearchTrackerProps) {
  useEffect(() => {
    if (!query && !filters) return
    if (query) trackCareersEvent('search', { search_term: query, result_count: total, match_mode: mode })
    if (total === 0) trackCareersEvent('careers_no_results', { search_term: query, filters })
  }, [query, filters, total, mode])
  return null
}

export function JobViewTracker({ jobId, title, institution }: { jobId: string; title: string; institution: string }) {
  useEffect(() => {
    trackCareersEvent('careers_job_view', { job_id: jobId, job_title: title, institution })
  }, [jobId, title, institution])
  return null
}
