'use client'

// "Upload resume" in the apply form (spec 2026-10-12 §3.2). The chosen file is
// the application's resume straight away; reading it to fill the form is a
// bonus that can fail without blocking anything.

import { useEffect, useId, useRef, useState, type DragEvent } from 'react'
import { CheckCircle2, FileText, FileUp, Info, Loader2 } from 'lucide-react'
import { extractResumeFields } from '@/app/actions/careers/resume-autofill'
import { resumeClientError } from '@/lib/services/public-careers-apply'
import type { AutofillFailure, ResumeAutofillResult } from '@/lib/utils/resume-fields'
import { AUTOFILL_PRIVACY_NOTICE } from './apply-mode-chooser'

export const AUTOFILL_FAILURE_MESSAGES: Record<AutofillFailure, string> = {
  unsupported_type: "We can't read this file type automatically. Your resume is attached. Please fill in the fields below.",
  too_large: 'Resume must be under 2 MB.',
  unreadable: "We couldn't pick out your details from this file. Please fill them in below.",
  rate_limited: "Auto-fill isn't available right now. Please fill in the fields below.",
  unavailable: "Auto-fill isn't available right now. Please fill in the fields below.",
}

type Status =
  | { kind: 'idle' }
  | { kind: 'reading' }
  | { kind: 'done'; written: number }
  | { kind: 'failed'; reason: AutofillFailure }

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

const ACCEPT = '.pdf,.doc,.docx'

/** The attached resume with a way to swap it. Used in both apply modes. */
export function ResumeChip({ file, onPick, disabled }: { file: File; onPick: (file: File) => void; disabled?: boolean }) {
  const inputId = useId()
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2">
      <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
      </div>
      <label
        htmlFor={inputId}
        className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        Change<span className="sr-only"> resume file</span>
        <input
          id={inputId}
          type="file"
          accept={ACCEPT}
          disabled={disabled}
          className="sr-only"
          onChange={e => {
            const next = e.target.files?.[0]
            e.target.value = '' // picking the same file again must still fire
            if (next) onPick(next)
          }}
        />
      </label>
    </div>
  )
}

interface ResumeAutofillPanelProps {
  file: File | null
  /** The parent's resume error (client check or MyJKKN's 400), shown here in upload mode. */
  fileError: string | null
  /** Attach a file as the application's resume, with its client-check error if any. */
  onFile: (file: File | null, error: string | null) => void
  /** Apply a reading's result to the form; returns how many fields were written. */
  onResult: (result: ResumeAutofillResult) => number
}

export function ResumeAutofillPanel({ file, fileError, onFile, onResult }: ResumeAutofillPanelProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [dragging, setDragging] = useState(false)
  const inputId = useId()
  const latest = useRef(0)

  // The result arrives after an await: apply it with the form's current state.
  const onResultRef = useRef(onResult)
  useEffect(() => { onResultRef.current = onResult })
  // Leaving upload mode abandons a reading in flight.
  useEffect(() => () => { latest.current += 1 }, [])

  async function read(next: File) {
    const error = resumeClientError(next)
    onFile(next, error)
    if (error) {
      setStatus({ kind: 'idle' })
      return
    }
    const id = ++latest.current
    setStatus({ kind: 'reading' })
    let result: ResumeAutofillResult
    try {
      const fd = new FormData()
      fd.set('resume', next)
      result = await extractResumeFields(fd)
    } catch {
      result = { ok: false, reason: 'unavailable' } // network drop or the action failed
    }
    if (id !== latest.current) return // a newer file was chosen while this one was being read
    const written = onResultRef.current(result)
    setStatus(result.ok ? { kind: 'done', written } : { kind: 'failed', reason: result.reason })
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragging(false)
    const next = e.dataTransfer.files?.[0]
    if (next) void read(next)
  }

  return (
    <div className="space-y-3">
      {file ? (
        <ResumeChip file={file} onPick={next => void read(next)} disabled={status.kind === 'reading'} />
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${
            dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <FileUp className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="text-sm text-foreground">
            Drop your resume here or <span className="font-semibold text-primary underline">choose file</span>
          </span>
          <span className="text-xs text-muted-foreground">PDF or DOCX, up to 2 MB</span>
          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={e => {
              const next = e.target.files?.[0]
              e.target.value = ''
              if (next) void read(next)
            }}
          />
        </label>
      )}

      {fileError && <p className="text-xs text-destructive">{fileError}</p>}

      <div role="status" aria-live="polite">
        {status.kind === 'reading' && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Reading your resume… this usually takes a few seconds.
          </p>
        )}
        {status.kind === 'done' && (
          <p className="flex items-start gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {status.written > 0
              ? `${status.written} ${status.written === 1 ? 'field' : 'fields'} filled from your resume. Please check them before submitting.`
              : "Your resume matched the details you've already entered."}
          </p>
        )}
        {status.kind === 'failed' && (
          <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {AUTOFILL_FAILURE_MESSAGES[status.reason]}
          </p>
        )}
      </div>

      {/* A file attached in manual mode can still be read once the candidate switches here. */}
      {file && !fileError && status.kind === 'idle' && (
        <button
          type="button"
          onClick={() => void read(file)}
          className="inline-flex min-h-9 items-center gap-2 rounded-full px-1 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <FileUp className="h-4 w-4" aria-hidden="true" /> Fill the form from this file
        </button>
      )}
      {status.kind === 'idle' && <p className="text-xs leading-relaxed text-muted-foreground">{AUTOFILL_PRIVACY_NOTICE}</p>}
    </div>
  )
}
