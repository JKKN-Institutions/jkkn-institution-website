'use client'

// Posts straight from the browser to MyJKKN (see lib/services/public-careers-apply.ts
// for why this deliberately bypasses Server Actions). Client Zod rules mirror the
// API's field table; the API's own 400 `fields` map is merged onto the inputs.
// Where resume auto-fill is on, the candidate first chooses to upload a resume
// (which fills the fields — spec docs/superpowers/specs/2026-10-12-careers-resume-autofill-design.md)
// or to type them. Either way the same request goes to MyJKKN.

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, Loader2, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trackCareersEvent } from '@/lib/analytics/careers-events'
import { applyFormSchema, type ApplyFormValues, type AutofillField } from '@/lib/schemas/careers-apply-form'
import {
  buildApplyFormData, resumeClientError, submitApplication, type ApplyFailureKind, type ApplyResult,
} from '@/lib/services/public-careers-apply'
import { autofillWrites, type ResumeAutofillResult } from '@/lib/utils/resume-fields'
import { ApplyModeChooser, type ApplyMode } from './apply-mode-chooser'
import { ResumeAutofillPanel, ResumeChip, type AutofillVia } from './resume-autofill-panel'

interface ApplyFormProps {
  jobId: string
  jobTitle: string
  apiBaseUrl: string
  /** How this deployment reads resumes (resumeAutofillMode()), or null when it does not. */
  autofillVia: AutofillVia | null
}

const FAILURE_TITLES: Record<ApplyFailureKind, string> = {
  validation: 'Please correct the highlighted fields',
  origin: 'This form can only be submitted from the JKKN website',
  not_found: 'This job is no longer accepting applications',
  duplicate: 'You have already applied for this job',
  rate_limited: 'Too many applications from this connection',
  unavailable: 'Applications are temporarily unavailable',
  error: 'Something went wrong',
}

const switchLink =
  'font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export function ApplyForm({ jobId, jobTitle, apiBaseUrl, autofillVia }: ApplyFormProps) {
  const autofillEnabled = autofillVia !== null
  const [mode, setMode] = useState<'choose' | ApplyMode>(autofillEnabled ? 'choose' : 'manual')
  const [resume, setResume] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  /** Fields showing a value read from the resume that the candidate has not edited. */
  const [autofilled, setAutofilled] = useState<ReadonlySet<AutofillField>>(() => new Set())
  const [result, setResult] = useState<ApplyResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const started = useRef(false)

  // First interaction with the panel (a choice card or any field) = the candidate has started applying.
  function onFirstFocus() {
    if (started.current) return
    started.current = true
    trackCareersEvent('careers_apply_start', { job_id: jobId })
  }

  const {
    register, handleSubmit, setError, setValue, getValues, control, formState: { errors },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      first_name: '', last_name: '', email: '', phone: '', qualification: '', experience_months: '',
      current_job_title: '', current_company: '', current_job_duration_months: '', worked_cities: '',
      consent: false, website: '',
    },
  })

  const consent = useWatch({ control, name: 'consent' })

  function chooseMode(next: ApplyMode) {
    trackCareersEvent('careers_apply_mode', { job_id: jobId, mode: next })
    setMode(next)
  }

  function attachResume(file: File | null, error: string | null) {
    setResume(file)
    setResumeError(error)
  }

  /** Writes a reading's values into fields the candidate has not typed; returns how many. */
  function applyAutofill(r: ResumeAutofillResult, opts: { partial?: boolean } = {}): number {
    if (!r.ok) {
      trackCareersEvent('careers_resume_autofill', { job_id: jobId, outcome: r.reason, fields_filled: 0 })
      return 0
    }
    const writes = autofillWrites(getValues(), autofilled, r.values)
    const written = Object.keys(writes) as AutofillField[]
    for (const field of written) setValue(field, writes[field] as string, { shouldValidate: true })
    setAutofilled(prev => new Set([...prev, ...written]))
    if (opts.partial) return written.length // email/phone ahead of the Max-lane answer; tracked once at the end
    trackCareersEvent('careers_resume_autofill', {
      job_id: jobId, outcome: written.length > 0 ? 'filled' : 'none', fields_filled: written.length,
    })
    return written.length
  }

  function markEdited(field: AutofillField) {
    setAutofilled(prev => {
      if (!prev.has(field)) return prev
      const next = new Set(prev)
      next.delete(field)
      return next
    })
  }

  async function onSubmit(values: ApplyFormValues) {
    const fileErr = resumeClientError(resume)
    setResumeError(fileErr)
    if (fileErr || !resume) return

    setSubmitting(true)
    setResult(null)
    const fd = buildApplyFormData({
      ...values,
      experience_months: Number(values.experience_months),
      current_job_duration_months: values.current_job_duration_months === '' ? null : Number(values.current_job_duration_months),
      consent: true,
      resume,
      utm_source: typeof window !== 'undefined' ? window.location.hostname : undefined,
    })
    const r = await submitApplication(apiBaseUrl, jobId, fd)
    setSubmitting(false)
    setResult(r)
    if (r.ok) trackCareersEvent('careers_apply_complete', { job_id: jobId })

    if (!r.ok && r.kind === 'validation') {
      for (const [field, message] of Object.entries(r.fields)) {
        if (field === 'resume') setResumeError(message)
        else if (field in applyFormSchema.shape) setError(field as keyof ApplyFormValues, { type: 'server', message })
      }
    }
  }

  if (result?.ok) {
    return (
      <div role="status" className="rounded-2xl border border-primary/30 bg-card p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">Application submitted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for applying for <strong>{jobTitle}</strong>. We&apos;ve emailed you a confirmation.
        </p>
        <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Your reference</p>
        <p className="break-all font-mono text-lg font-semibold text-foreground">{result.reference}</p>
        <p className="mt-3 text-xs text-muted-foreground">Keep this reference for any follow-up with our HR team.</p>
        <Link
          href="/careers"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to careers
        </Link>
      </div>
    )
  }

  const field = (
    name: AutofillField,
    label: string,
    opts: { required?: boolean; type?: string; placeholder?: string; hint?: string; inputMode?: 'numeric'; focus?: boolean } = {},
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}{opts.required && <span className="text-destructive"> *</span>}</Label>
      <Input
        id={name}
        type={opts.type ?? 'text'}
        inputMode={opts.inputMode}
        placeholder={opts.placeholder}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={autofilled.has(name) ? `${name}-autofilled` : undefined}
        data-apply-focus={opts.focus ? '' : undefined}
        {...register(name, { onChange: () => markEdited(name) })}
      />
      {/* Under the box, not beside the label: in the two-column row a badge would wrap and push one input lower. */}
      {autofilled.has(name) && (
        <p id={`${name}-autofilled`} className="flex items-center gap-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" aria-hidden="true" />From your resume
        </p>
      )}
      {opts.hint && !errors[name] && <p className="text-xs text-muted-foreground">{opts.hint}</p>}
      {errors[name] && <p className="text-xs text-destructive">{errors[name]?.message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={onFirstFocus} noValidate className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Apply for this role</h2>
        <p className="text-sm text-muted-foreground">Takes about two minutes. No account needed.</p>
      </div>

      {mode === 'choose' ? (
        <ApplyModeChooser onChoose={chooseMode} maxLane={autofillVia === 'max'} />
      ) : (
        <>
          {result && !result.ok && result.kind !== 'validation' && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">{FAILURE_TITLES[result.kind]}</p>
                <p className="text-sm text-muted-foreground">{result.message}</p>
              </div>
            </div>
          )}

          {mode === 'upload' && (
            <ResumeAutofillPanel
              file={resume}
              fileError={resumeError}
              onFile={attachResume}
              onResult={applyAutofill}
              via={autofillVia ?? 'api'}
              apiBaseUrl={apiBaseUrl}
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field('first_name', 'First name', { required: true, focus: true })}
            {field('last_name', 'Last name', { required: true })}
          </div>
          {field('email', 'Email', { required: true, type: 'email' })}
          {field('phone', 'Phone', { required: true, type: 'tel', placeholder: '+91 98765 43210' })}
          {field('qualification', 'Highest qualification', { required: true, placeholder: 'e.g. M.Pharm' })}
          {field('experience_months', 'Total experience (months)', { required: true, inputMode: 'numeric', hint: 'Enter 0 if you are a fresher.' })}

          <details className="rounded-xl border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium text-foreground">Current employment (optional)</summary>
            <div className="mt-4 space-y-4">
              {field('current_job_title', 'Current job title')}
              {field('current_company', 'Current employer')}
              {field('current_job_duration_months', 'Time in current role (months)', { inputMode: 'numeric' })}
              {field('worked_cities', 'Cities you have worked in', { hint: 'Comma-separated, e.g. Salem, Erode' })}
            </div>
          </details>

          {mode === 'manual' && (
            <div className="space-y-1.5">
              <Label htmlFor={resume ? undefined : 'resume'}>Resume<span className="text-destructive"> *</span></Label>
              {resume ? (
                <ResumeChip file={resume} onPick={f => attachResume(f, resumeClientError(f))} />
              ) : (
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null
                    attachResume(file, resumeClientError(file))
                  }}
                  className="block w-full text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                />
              )}
              <p className="text-xs text-muted-foreground">PDF, DOC or DOCX, up to 2 MB.</p>
              {resumeError && <p className="text-xs text-destructive">{resumeError}</p>}
            </div>
          )}

          {/* Honeypot: invisible to people, irresistible to bots. Never remove `name`. */}
          <input {...register('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={v => setValue('consent', v === true, { shouldValidate: true })}
            />
            <Label htmlFor="consent" className="text-sm font-normal leading-snug text-muted-foreground">
              I consent to JKKN Institutions storing and processing my details and resume for recruitment purposes.
              <span className="text-destructive"> *</span>
            </Label>
          </div>
          {errors.consent && <p className="-mt-3 text-xs text-destructive">{errors.consent.message}</p>}

          <Button type="submit" disabled={submitting} className="w-full rounded-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Submitting…' : 'Submit application'}
          </Button>

          {autofillEnabled && (
            <p className="text-center text-sm text-muted-foreground">
              {mode === 'upload' ? (
                <>Prefer typing? <button type="button" onClick={() => chooseMode('manual')} className={switchLink}>Enter details manually</button></>
              ) : (
                <>Have a resume? <button type="button" onClick={() => chooseMode('upload')} className={switchLink}>Upload it to auto-fill</button></>
              )}
            </p>
          )}
        </>
      )}
    </form>
  )
}
