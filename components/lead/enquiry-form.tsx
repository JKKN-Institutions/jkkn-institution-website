'use client'

// The site enquiry form - the same 3-box / full form the six college sites run (Dental, Pharmacy,
// Nursing, Arts, AHS, Education; "What Happens Next" white card, user's pick 2026-10-22), ported to
// the main site and Engineering on 2026-10-31. Same fields, labels and CRM payload.
// On Engineering the programme list is Engineering's 7 CRM programmes; on the main site it is all
// seven colleges, grouped by college, so the parent picks one programme and the college follows.
//
// CALL / WHATSAPP (2026-11-04, ported from the Dental site, user's choice "full ah calls and
// whatsapp"): the one "Get a Call Back" button that ended on a 24-hour thank-you screen is gone.
// Every form shows "Call Counsellor" + "Chat on WhatsApp" (a gate shows one of them): one tap sends
// the lead (keepalive POST to /api/enquiry, the same server action) and opens the dialer or
// WhatsApp. The CRM payload is unchanged. The server action stays on the form for a visitor
// without JavaScript.
//
// PII rule, and it is not a style preference: name and phone are collected here and NEVER sent to
// GA4. Only the source page, the programme id and the path leave this component - and the
// WhatsApp text carries the course and a page reference, never the name or the phone.

import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiry'
import { CampaignFields } from '@/components/lead/campaign-fields'
import { institutionsForSite } from '@/lib/enquiry/crm-programmes'
import { currentEnquirySite } from '@/lib/enquiry/site'
import { ENQUIRY_DONE_KEY, sendLeadEvent, writeStore } from '@/lib/enquiry/lead-events'
import { GATE_PHONE_DISPLAY, telGateUrl, whatsappGateUrl, type GateIntent } from '@/lib/call-gate'

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
  /** Call / WhatsApp gate (lib/call-gate.ts): ONE button, "Call Counsellor" or "Chat on WhatsApp".
   *  Left out (every page form, the homepage popup and the Apply popup, user's choice 2026-11-04):
   *  TWO buttons, "Call Counsellor" + "Chat on WhatsApp". Either way ONE tap sends the lead and
   *  opens the app. */
  gate?: GateIntent
}

type GatePhase =
  | { step: 'form' }
  | { step: 'opened'; result: 'waiting' | 'saved' | 'failed'; programmeId: string; intent: GateIntent }

export function EnquiryForm({
  sourcePage,
  defaultProgrammeId,
  heading = 'Talk to Our Admission Team',
  compact = false,
  bare = false,
  gate,
}: Props) {
  const site = currentEnquirySite()
  // Unique per instance: a page can show this form twice (section + popup).
  const uid = useId()
  const fid = (name: string) => `${uid}-${name}`
  const [state, formAction, isPending] = useActionState<EnquiryState | null, FormData>(submitEnquiry, null)
  const fired = useRef(false)
  const [gatePhase, setGatePhase] = useState<GatePhase>({ step: 'form' })
  // Which of the two buttons was pressed. Read from SubmitEvent.submitter where the browser has it;
  // this ref (set on the button's own click) covers the rest. Enter in a box = the first button, Call.
  const chosen = useRef<GateIntent>(gate ?? 'call')

  // Fires once, only on a CRM-accepted submit - not on click, not before the round trip. (Since
  // 2026-11-04 this path runs only without JavaScript-driven submit; the buttons below send their
  // own lead_form_submit after the CRM answers.)
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
  const siteId = site.id
  const formName = site.formName
  const eventFor = (intent: GateIntent) => (intent === 'call' ? 'gate_call' : 'gate_wa')

  const surface = bare ? '' : 'bg-white rounded-[20px] shadow-[0_18px_40px_rgba(3,40,22,0.35)] p-4 min-[640px]:p-6'

  // Opens the dialer / WhatsApp. Called inside the visitor's tap (the browser allows another app
  // only then), and again from the fallback button if the phone ignored the first try.
  // location.assign(), not location.href = : eslint react-hooks/immutability rejects the assignment
  // inside a component (Dental e5f1508).
  const openApp = (programmeId: string, intent: GateIntent) => {
    if (intent === 'call') {
      window.location.assign(telGateUrl)
      return
    }
    const url = whatsappGateUrl(programmeId, window.location.pathname, siteId)
    // A new tab keeps this page (and the request still in flight) alive; a blocked tab falls back
    // to the same tab, where keepalive still lets the request finish.
    const tab = window.open(url, '_blank')
    if (tab) tab.opener = null
    else window.location.assign(url)
  }

  // ONE tap: check the boxes, send the lead without waiting, open the app at once.
  const onGateSubmit = (e: FormEvent<HTMLFormElement>) => {
    // preventDefault also stops React's form action (it skips a prevented submit), so the server
    // action runs only when JavaScript is off - the progressive-enhancement path stays intact.
    e.preventDefault()
    const form = e.currentTarget
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const fromButton = submitter?.value === 'whatsapp' || submitter?.value === 'call' ? submitter.value : null
    const intent: GateIntent = gate ?? (fromButton as GateIntent | null) ?? chosen.current
    const gateEvent = eventFor(intent)
    const nameBox = form.elements.namedItem('name') as HTMLInputElement | null
    if (nameBox) nameBox.setCustomValidity(nameBox.value.trim().length < 2 ? 'Please enter your full name.' : '')
    // Same three rules as the server (name, 10-digit mobile from 6-9, a programme). Checked here
    // because the app opens before the server has answered.
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const programmeId = String(data.get('programme') ?? '')
    const body = new URLSearchParams()
    data.forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value)
    })
    // No trailing slash: this site does not normalise to one (next.config.ts has no trailingSlash).
    const request = fetch('/api/enquiry', { method: 'POST', body, keepalive: true })

    sendLeadEvent(`${gateEvent}_launch`, { source_page: sourcePage, page_path: window.location.pathname })
    openApp(programmeId, intent)
    setGatePhase({ step: 'opened', result: 'waiting', programmeId, intent })

    request
      .then((res) => res.json() as Promise<EnquiryState>)
      .then((result) => {
        if (!result.success) throw new Error('not accepted')
        writeStore(ENQUIRY_DONE_KEY, new Date().toISOString())
        // Same event, same params as the ordinary form, so lead_form_submit stays one series.
        sendLeadEvent('lead_form_submit', {
          form_name: formName,
          source_page: sourcePage,
          programme: result.tracking?.programme_id ?? 'not_selected',
          destination: 'crm',
          page_path: window.location.pathname,
        })
        sendLeadEvent(`${gateEvent}_lead`, { source_page: sourcePage, page_path: window.location.pathname })
        setGatePhase((p) => (p.step === 'opened' ? { ...p, result: 'saved' } : p))
      })
      .catch(() => {
        sendLeadEvent('lead_form_error', {
          form_name: formName,
          source_page: sourcePage,
          page_path: window.location.pathname,
        })
        sendLeadEvent(`${gateEvent}_fail`, { source_page: sourcePage, page_path: window.location.pathname })
        setGatePhase((p) => (p.step === 'opened' ? { ...p, result: 'failed' } : p))
      })
  }

  if (gatePhase.step === 'opened') {
    const isCall = gatePhase.intent === 'call'
    const gateEvent = eventFor(gatePhase.intent)
    return (
      <div className={`${surface} space-y-4 text-center`} role="status" aria-live="polite">
        <p className="text-[#032816] text-lg font-semibold">
          {isCall ? 'Opening your phone dialer…' : 'Opening WhatsApp…'}
        </p>
        <p className="text-[#4b5563] text-sm">
          {isCall
            ? `Tap the green Call button on your phone to talk to our counsellor at ${GATE_PHONE_DISPLAY}.`
            : 'Your message is typed in WhatsApp. Tap Send to reach our admission team.'}
        </p>
        {/* A <button>, not an <a>: ConversionTracking counts <a> taps, and this second try must not
            count as a second call tap. */}
        <button
          type="button"
          onClick={() => {
            sendLeadEvent(`${gateEvent}_fallback`, { source_page: sourcePage, page_path: window.location.pathname })
            openApp(gatePhase.programmeId, gatePhase.intent)
          }}
          className={
            isCall
              ? 'w-full bg-[#0b6d41] hover:bg-[#095a36] text-white font-bold py-4 rounded-full text-base transition-colors'
              : 'w-full bg-[#25d366] hover:bg-[#1ebe5a] text-[#032816] font-bold py-4 rounded-full text-base transition-colors'
          }
        >
          {isCall ? `Did not open? Call ${GATE_PHONE_DISPLAY}` : 'Did not open? Open WhatsApp'}
        </button>
        {gatePhase.result === 'failed' && (
          <p className="text-[#b42318] text-sm" role="alert">
            Your details did not reach our system. Please tell the counsellor your name and course.
          </p>
        )}
      </div>
    )
  }

  // Reached only by a visitor without JavaScript (the server action answered): the buttons above
  // never let a JavaScript submit get here.
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
  // The 3-step strip says what the buttons do (the old "We call in 24 hrs" step went with the
  // 24-hour callback, 2026-11-04).
  const steps =
    gate === 'call'
      ? ['Fill 3 details', 'Tap Call Counsellor', 'Talk to us now']
      : gate === 'whatsapp'
        ? ['Fill 3 details', 'Tap Chat on WhatsApp', 'Send the message']
        : [compact ? 'Fill 3 details' : 'Fill your details', 'Tap Call or WhatsApp', 'Talk to us now']

  return (
    <form action={formAction} onSubmit={onGateSubmit} className={`${surface} space-y-4 text-left`}>
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

      <h2 className="sr-only">
        {gate === 'call' ? 'Call our admission counsellor' : gate === 'whatsapp' ? 'Chat with us on WhatsApp' : heading}
      </h2>

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
            onInput={(e) => e.currentTarget.setCustomValidity('')}
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

      {/* One tap = lead + app. Two buttons on every page form and popup (user's choice 2026-11-04:
          the old "Get a Call Back" ended on a 24-hour thank-you screen); one in a gate. */}
      {(gate ? [gate] : (['call', 'whatsapp'] as GateIntent[])).map((intent) => (
        <button
          key={intent}
          type="submit"
          name="cta"
          value={intent}
          disabled={isPending}
          onClick={() => {
            chosen.current = intent
          }}
          className={
            intent === 'whatsapp'
              ? 'w-full bg-[#25d366] hover:bg-[#1ebe5a] disabled:opacity-60 text-[#032816] font-bold py-4 rounded-full text-base transition-colors'
              : 'w-full bg-[#0b6d41] hover:bg-[#095a36] disabled:opacity-60 text-white font-bold py-4 rounded-full text-base transition-colors'
          }
        >
          {isPending ? 'Submitting…' : intent === 'call' ? 'Call Counsellor' : 'Chat on WhatsApp'}
        </button>
      ))}

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

      {/* "Or call us directly" links removed 2026-11-04: the form is a must (user's choice), and
          those two links would be a way round it. */}

      <p className="text-center text-[#5f6b66] text-xs">By submitting, you agree to be contacted by our admission team.</p>
    </form>
  )
}
