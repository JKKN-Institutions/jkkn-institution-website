'use client'

// First step of the apply panel when resume auto-fill is on (spec 2026-10-12 §3.1).

import { FileUp, PenLine } from 'lucide-react'

export type ApplyMode = 'upload' | 'manual'

export const AUTOFILL_PRIVACY_NOTICE =
  "Your resume is read by AI (Anthropic's Claude) to fill in this form. We don't keep it. It's only sent to JKKN HR when you submit."

const card =
  'flex w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const icon = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'

export function ApplyModeChooser({ onChoose }: { onChoose: (mode: ApplyMode) => void }) {
  return (
    <div className="space-y-3">
      <p id="apply-mode-heading" className="text-sm font-medium text-foreground">How would you like to apply?</p>
      <div role="group" aria-labelledby="apply-mode-heading" className="space-y-3">
        <div className="space-y-2">
          {/* data-apply-focus: "Apply now" buttons move focus here (apply-cta.tsx). */}
          <button type="button" data-apply-focus="" onClick={() => onChoose('upload')} className={card}>
            <span className={icon}><FileUp className="h-5 w-5" aria-hidden="true" /></span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
                Upload resume
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">Fastest</span>
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">We fill in the form for you</span>
            </span>
          </button>
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">{AUTOFILL_PRIVACY_NOTICE}</p>
        </div>
        <button type="button" onClick={() => onChoose('manual')} className={card}>
          <span className={icon}><PenLine className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block font-semibold text-foreground">Enter details manually</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">Type each field yourself</span>
          </span>
        </button>
      </div>
    </div>
  )
}
