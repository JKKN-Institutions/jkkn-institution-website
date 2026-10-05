'use client'

// Keeps "Apply now" one tap away on the job page (spec §5.3).
//
// The form itself is the sticky right-hand column on desktop, so the extra
// reach is only needed below lg: a floating button that takes the candidate to
// the form and steps aside once the form is on screen.

import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { trackCareersEvent } from '@/lib/analytics/careers-events'
import { APPLY_SECTION_ID } from '@/lib/utils/careers-format'

function goToForm(jobId: string, placement: string) {
  trackCareersEvent('careers_apply_click', { job_id: jobId, placement })
  const section = document.getElementById(APPLY_SECTION_ID)
  if (!section) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  // Move keyboard and screen-reader focus with the scroll.
  section.querySelector<HTMLElement>('input:not([type="hidden"]):not([tabindex="-1"])')?.focus({ preventScroll: true })
}

const HEADER_APPLY_ID = 'apply-now-header'

/** In-page button for the job header. */
export function ApplyNowButton({ jobId }: { jobId: string }) {
  return (
    <button
      type="button"
      id={HEADER_APPLY_ID}
      onClick={() => goToForm(jobId, 'header')}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Apply now <ArrowDown className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

/**
 * Floating button for phones and tablets. It appears only when neither the
 * header's Apply button nor the form is on screen — never as a duplicate.
 */
export function StickyApply({ jobId }: { jobId: string }) {
  const [show, setShow] = useState(false) // hidden until we know what is on screen

  useEffect(() => {
    const targets = [document.getElementById(HEADER_APPLY_ID), document.getElementById(APPLY_SECTION_ID)]
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return
    const onScreen = new Set<Element>()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target)
        else onScreen.delete(entry.target)
      }
      setShow(onScreen.size === 0)
    })
    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (!show) return null
  return (
    // bottom-20 / right-24: sits above the public bottom nav and beside the
    // contact FAB (components/public/floating-action-button.tsx).
    <div className="fixed bottom-20 left-4 right-24 z-[80] lg:hidden">
      <button
        type="button"
        onClick={() => goToForm(jobId, 'sticky')}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Apply now <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
