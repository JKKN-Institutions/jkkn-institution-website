'use client'

// Posts straight from the browser to MyJKKN (see lib/services/public-careers-apply.ts
// for why this deliberately bypasses Server Actions). Client Zod rules mirror the
// API's field table; the API's own 400 `fields` map is merged onto the inputs.

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  buildApplyFormData, resumeClientError, submitApplication, type ApplyFailureKind, type ApplyResult,
} from '@/lib/services/public-careers-apply'

const optionalMonths = z
  .string()
  .trim()
  .refine(v => v === '' || /^\d{1,3}$/.test(v), 'Whole months only.')
  .refine(v => v === '' || Number(v) <= 720, 'Enter 0–720 months.')

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.').max(100),
  last_name: z.string().trim().min(1, 'Last name is required.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(200),
  phone: z.string().trim().refine(
    v => /^\d{10,15}$/.test(v.replace(/[\s+\-()]/g, '')),
    'Enter a valid phone number (10-15 digits).',
  ),
  qualification: z.string().trim().min(1, 'Qualification is required.').max(200),
  experience_months: z
    .string()
    .trim()
    .refine(v => /^\d{1,3}$/.test(v), 'Enter your experience as whole months (0 for freshers).')
    .refine(v => Number(v) <= 720, 'Enter 0–720 months.'),
  current_job_title: z.string().trim().max(150),
  current_company: z.string().trim().max(150),
  current_job_duration_months: optionalMonths,
  worked_cities: z.string().trim().max(1000),
  consent: z.boolean().refine(v => v === true, 'Please accept the privacy consent to apply.'),
  website: z.string().max(0), // honeypot
})
type FormValues = z.infer<typeof schema>

interface ApplyFormProps {
  jobId: string
  jobTitle: string
  apiBaseUrl: string
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

export function ApplyForm({ jobId, jobTitle, apiBaseUrl }: ApplyFormProps) {
  const [resume, setResume] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [result, setResult] = useState<ApplyResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register, handleSubmit, setError, setValue, control, formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '', last_name: '', email: '', phone: '', qualification: '', experience_months: '',
      current_job_title: '', current_company: '', current_job_duration_months: '', worked_cities: '',
      consent: false, website: '',
    },
  })

  const consent = useWatch({ control, name: 'consent' })

  async function onSubmit(values: FormValues) {
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

    if (!r.ok && r.kind === 'validation') {
      for (const [field, message] of Object.entries(r.fields)) {
        if (field === 'resume') setResumeError(message)
        else if (field in schema.shape) setError(field as keyof FormValues, { type: 'server', message })
      }
    }
  }

  if (result?.ok) {
    return (
      <div role="status" className="rounded-2xl border border-primary/30 bg-card p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">Application received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for applying for <strong>{jobTitle}</strong>. We&apos;ve emailed you a confirmation.
        </p>
        <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Your reference</p>
        <p className="font-mono text-lg font-semibold text-foreground">{result.reference}</p>
      </div>
    )
  }

  type TextField = Exclude<keyof FormValues, 'consent' | 'website'>
  const field = (
    name: TextField,
    label: string,
    opts: { required?: boolean; type?: string; placeholder?: string; hint?: string; inputMode?: 'numeric' } = {},
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}{opts.required && <span className="text-destructive"> *</span>}</Label>
      <Input
        id={name}
        type={opts.type ?? 'text'}
        inputMode={opts.inputMode}
        placeholder={opts.placeholder}
        aria-invalid={Boolean(errors[name])}
        {...register(name)}
      />
      {opts.hint && !errors[name] && <p className="text-xs text-muted-foreground">{opts.hint}</p>}
      {errors[name] && <p className="text-xs text-destructive">{errors[name]?.message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Apply for this role</h2>
        <p className="text-sm text-muted-foreground">Takes about two minutes. No account needed.</p>
      </div>

      {result && !result.ok && result.kind !== 'validation' && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">{FAILURE_TITLES[result.kind]}</p>
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('first_name', 'First name', { required: true })}
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

      <div className="space-y-1.5">
        <Label htmlFor="resume">Resume<span className="text-destructive"> *</span></Label>
        <input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={e => {
            const file = e.target.files?.[0] ?? null
            setResume(file)
            setResumeError(resumeClientError(file))
          }}
          className="block w-full text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
        />
        <p className="text-xs text-muted-foreground">PDF, DOC or DOCX, up to 2 MB.</p>
        {resumeError && <p className="text-xs text-destructive">{resumeError}</p>}
      </div>

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
    </form>
  )
}
