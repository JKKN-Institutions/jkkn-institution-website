'use client'

// The site enquiry form - the same 3-box / full form the six college sites run (Dental, Pharmacy,
// Nursing, Arts, AHS, Education; "What Happens Next" white card, user's pick 2026-10-22), ported to
// the main site and Engineering on 2026-10-31. Same fields, labels, button text and CRM payload.
// On Engineering the programme list is Engineering's 7 CRM programmes; on the main site it is all
// seven colleges, grouped by college, so the parent picks one programme and the college follows.
//
// PII rule, and it is not a style preference: name and phone are collected here and NEVER sent to
// GA4. Only the source page, the programme id and the path leave this component.

import { useActionState, useEffect, useId, useRef } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiry'
import { CampaignFields } from '@/components/lead/campaign-fields'
import { institutionsForSite } from '@/lib/enquiry/crm-programmes'
import { currentEnquirySite } from '@/lib/enquiry/site'
import { ENQUIRY_DONE_KEY, sendLeadEvent, writeStore } from '@/lib/enquiry/lead-events'

type Props = {
  /** Which page this instance sits on, e.g. "admissions-be-cse". Tags the lead in the CRM. */
  sourcePage: string
  /** Pre-selected programme id, so the B.E. CSE page opens on B.E. CSE. Optional. */
  defaultProgrammeId?: string
  heading?: string
  /** 3 boxes only (name, mobile, programme) - for the popup. District and the question box are
   *  optional in the CRM form, so a compact lead is still a complete lead. */
  compact?: boolean
  /** No white card of its own - for a host that already is the white card (the popup). */
  bare?: boolean
}

export function EnquiryForm({
  sourcePage,
  defaultProgrammeId,
  heading = 'Get a Call Back',
  compact = false,
  bare = false,
}: Props) {
  const site = currentEnquirySite()
  // Unique per instance: a page can show this form twice (section + popup).
  const uid = useId()
  const fid = (name: string) => `${uid}-${name}`
  const [state, formAction, isPending] = useActionState<EnquiryState | null, FormData>(submitEnquiry, null)
  const fired = useRef(false)

  // Fires once, only on a CRM-accepted submit - not on click, not before the round trip.
  useEffect(() => {
    if (!site || !state?.success || fired.current) return
    fired.current = true
    writeStore(ENQUIRY_DONE_KEY, new Date().toISOString())
    sendLeadEvent('lead_form_submit', {
      form_name: site.formName,
      source_page: sourcePage,
      programme: state.tracking?.programme_id ?? 'not_selected',
      destination: 'crm',
      page_path: window.location.pathname,
    })
  }, [state, sourcePage, site])

  // A form that silently fails and a form nobody used both read 0. This is what separates them.
  useEffect(() => {
    if (!site || !state || state.success || !state.error) return
    sendLeadEvent('lead_form_error', {
      form_name: site.formName,
      source_page: sourcePage,
      page_path: window.location.pathname,
    })
  }, [state, sourcePage, site])

  if (!site) return null
  const groups = institutionsForSite(site.id)
  const wa = `https://wa.me/${site.phone.replace('+', '')}`

  const surface = bare ? '' : 'bg-white rounded-[20px] shadow-[0_18px_40px_rgba(3,40,22,0.35)] p-4 min-[640px]:p-6'

  if (state?.success) {
    return (
      <div className={`${surface} space-y-4 text-center`} role="status" aria-live="polite">
        <p className="text-[#032816] text-lg font-semibold">{state.message}</p>
        <p className="text-[#4b5563] text-sm">You can also reach us directly:</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a href={`tel:${site.phone}`} className="bg-[#0b6d41] text-white px-4 py-2 rounded-full text-sm font-semibold">
            {site.phoneDisplay}
          </a>
          {/* Dark text: white on WhatsApp green is 1.98:1, below the 4.5:1 text minimum. */}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25d366] text-[#032816] px-4 py-2 rounded-full text-sm font-semibold"
          >
            WhatsApp
          </a>
        </div>
      </div>
    )
  }

  const err = state?.fieldErrors
  // 16 px text in every box: below 16 px, iPhone Safari zooms the page on focus. Border #75867e is
  // 3.84:1 on white and the hint text #5f6b66 is 5.55:1 (WCAG minimums 3:1 and 4.5:1).
  const inputCls =
    'w-full bg-white border-[1.5px] border-[#75867e] rounded-xl px-4 py-3 text-base text-[#1f2a24] placeholder:text-[#5f6b66] focus:outline-none focus:border-[#0b6d41] focus:ring-[3px] focus:ring-[#0b6d41]/20'
  const labelCls = 'block text-[#032816] text-sm font-semibold mb-1.5'
  const errCls = 'text-[#b42318] text-xs mt-1'
  const twoCol = compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 min-[640px]:grid-cols-2 gap-4'
  const steps = [compact ? 'Fill 3 details' : 'Fill your details', 'We call in 24 hrs', 'Get fee and admission details']

  return (
    <form action={formAction} className={`${surface} space-y-4 text-left`}>
      <input type="hidden" name="source_page" value={sourcePage} />
      <CampaignFields />

      {/* Honeypot. Off-screen rather than display:none - a real browser autofill will not reach it
          and a bot will. Never remove: the CRM scores this field. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <h2 className="sr-only">{heading}</h2>

      <ol aria-label="What happens next" className="grid grid-cols-3 gap-1.5">
        {steps.map((step, i) => (
          <li
            key={step}
            className="rounded-xl bg-[#f1f7f3] px-1.5 py-2.5 text-center text-xs font-semibold leading-tight text-[#032816] hyphens-auto"
          >
            <span
              aria-hidden="true"
              className="mx-auto mb-1.5 grid h-6 w-6 place-items-center rounded-full bg-[#ffde59] text-xs font-bold"
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className={twoCol}>
        <div>
          <label htmlFor={fid('name')} className={labelCls}>
            Your Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={fid('name')}
            type="text"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Enter your full name"
            aria-invalid={!!err?.name}
            className={inputCls}
          />
          {err?.name && <p className={errCls}>{err.name}</p>}
        </div>
        <div>
          <label htmlFor={fid('phone')} className={labelCls}>
            Mobile Number <span aria-hidden="true">*</span>
          </label>
          <input
            id={fid('phone')}
            type="tel"
            name="phone"
            required
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            title="10-digit mobile number starting with 6, 7, 8 or 9"
            maxLength={10}
            autoComplete="tel-national"
            placeholder="10-digit mobile number"
            aria-invalid={!!err?.phone}
            className={inputCls}
          />
          {err?.phone && <p className={errCls}>{err.phone}</p>}
        </div>
      </div>

      <div className={twoCol}>
        <div>
          <label htmlFor={fid('programme')} className={labelCls}>
            Programme Interested In <span aria-hidden="true">*</span>
          </label>
          {/* appearance-none hides the native arrow, so draw one: without it the box does not read
              as a dropdown. */}
          <div className="relative">
            <select
              id={fid('programme')}
              name="programme"
              required
              defaultValue={defaultProgrammeId ?? ''}
              aria-invalid={!!err?.programme}
              className={`${inputCls} appearance-none pr-10`}
            >
              <option value="" disabled>
                Select a Programme
              </option>
              {groups.length === 1
                ? groups[0].programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))
                : groups.map((g) => (
                    <optgroup key={g.id} label={g.label}>
                      {g.programmes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4b5563]"
            />
          </div>
          {err?.programme && <p className={errCls}>{err.programme}</p>}
        </div>
        {!compact && (
          <div>
            <label htmlFor={fid('district')} className={labelCls}>
              Your District <span className="font-normal text-[#4b5563]">(optional)</span>
            </label>
            <input
              id={fid('district')}
              type="text"
              name="district"
              maxLength={60}
              placeholder="e.g., Namakkal"
              className={inputCls}
            />
          </div>
        )}
      </div>

      {!compact && (
        <div>
          <label htmlFor={fid('question')} className={labelCls}>
            Any Questions? <span className="font-normal text-[#4b5563]">(optional)</span>
          </label>
          <textarea
            id={fid('question')}
            name="question"
            rows={3}
            maxLength={300}
            placeholder={site.questionPlaceholder}
            className={`${inputCls} resize-none`}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#0b6d41] hover:bg-[#095a36] disabled:opacity-60 text-white font-bold py-4 rounded-full text-base transition-colors"
      >
        {isPending ? 'Submitting…' : compact ? 'Get a Call Back' : 'Submit Enquiry — Get a Call Back'}
      </button>

      {state && !state.success && state.error && (
        <p className="text-[#b42318] text-sm text-center" role="alert">
          {state.error}
        </p>
      )}

      {site.trust.length > 0 && (
        <ul
          aria-label="Recognition"
          className="flex flex-wrap justify-center gap-x-3.5 gap-y-1.5 text-[12.5px] font-semibold text-[#032816]"
        >
          {site.trust.map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#0b6d41]" />
              {t}
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-[#4b5563] text-sm">
        Or call us directly:{' '}
        <a href={`tel:${site.phone}`} className="text-[#0b6d41] font-semibold underline">
          {site.phoneDisplay}
        </a>{' '}
        •{' '}
        <a href={wa} target="_blank" rel="noopener noreferrer" className="text-[#0b6d41] font-semibold underline">
          WhatsApp
        </a>
      </p>

      <p className="text-center text-[#5f6b66] text-xs">By submitting, you agree to be contacted by our admission team.</p>
    </form>
  )
}
