'use client'

// Enquiry dialog for every public page - the pattern the six college sites run since 2026-10-22
// (Pharmacy dc48c9b, Dental d485baf + 2d277f1). Every "Apply" link to jkkn.ai opens the site's own
// 3-box form, which posts into the SAME jkkn.ai form (jkkn-admission-2026), so the lead lands in
// the same CRM list without the trip and without picking the college again.
//
// WHY NOT AN IFRAME OF THE jkkn.ai PAGE. jkkn.ai answers with X-Frame-Options: SAMEORIGIN (checked
// 2026-10-16), so the browser refuses to show it inside this site.
//
// Outside the provider useEnquiryModal() returns null; on an institution other than main or
// engineering the provider renders its children only, so nothing changes there.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { EnquiryForm } from '@/components/lead/enquiry-form'
import { currentEnquirySite, fullApplicationHref, sourcePageFromPath } from '@/lib/enquiry/site'
import { ENQUIRY_DONE_KEY, readStore, sendLeadEvent } from '@/lib/enquiry/lead-events'
import { campaignTagsSnapshot, parseCampaignTags, tagApplyHref } from '@/lib/enquiry/campaign-tags'
import {
  gateIntentForHref,
  isGateNumber,
  isGateOffPath,
  isUngatedPath,
  numberAtOffset,
  pageTag,
  programmeForPath,
  telUrlFor,
  type GateIntent,
} from '@/lib/call-gate'

type OpenOptions = { programmeId?: string; intent?: GateIntent }
type OpenState = { sourcePage: string; programmeId?: string; intent?: GateIntent }
type EnquiryModalApi = { openEnquiry: (sourcePage: string, options?: OpenOptions) => void }

/** GA4 event-name stem per gate: event NAMES split call from WhatsApp in every report, with no
 *  custom dimension to register first. */
const GATE_EVENT: Record<GateIntent, string> = { call: 'gate_call', whatsapp: 'gate_wa' }

/** Editable content (SPEC section 6, 2026-11-04): a click inside a rich-text editor or a form box
 *  is editing or typing, never a call. */
const EDITABLE = 'input, textarea, select, [contenteditable], [role=textbox]'

function isEditable(target: Element): boolean {
  return (target instanceof HTMLElement && target.isContentEditable) || !!target.closest(EDITABLE)
}

/** The text node + character offset under a tap, in Chrome / Safari (caretRangeFromPoint) and
 *  Firefox (caretPositionFromPoint). null when the browser has neither. */
function textAtPoint(x: number, y: number): { text: string; offset: number } | null {
  const d = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null
  }
  if (typeof d.caretPositionFromPoint === 'function') {
    const pos = d.caretPositionFromPoint(x, y)
    if (pos && pos.offsetNode.nodeType === Node.TEXT_NODE) return { text: pos.offsetNode.textContent ?? '', offset: pos.offset }
  }
  if (typeof d.caretRangeFromPoint === 'function') {
    const range = d.caretRangeFromPoint(x, y)
    if (range && range.startContainer.nodeType === Node.TEXT_NODE)
      return { text: range.startContainer.textContent ?? '', offset: range.startOffset }
  }
  return null
}

const EnquiryModalContext = createContext<EnquiryModalApi | null>(null)

/** null outside the provider - callers must fall back to their ordinary link. */
export function useEnquiryModal() {
  return useContext(EnquiryModalContext)
}

const APPLY_LINK = 'a[href*="jkkn.ai/apply"]'

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const site = currentEnquirySite()
  const [open, setOpen] = useState<OpenState | null>(null)

  const openEnquiry = useCallback((source: string, options?: OpenOptions) => {
    // Only where the dialog was opened from - no name, no phone. A gate open is counted under its
    // own name, so enquiry_open keeps meaning what it meant before 2026-11-04 (popup + Apply links).
    const event = options?.intent ? `${GATE_EVENT[options.intent]}_open` : 'enquiry_open'
    sendLeadEvent(event, { source_page: source, page_path: window.location.pathname })
    setOpen({ sourcePage: source, programmeId: options?.programmeId, intent: options?.intent })
  }, [])

  const close = useCallback(() => setOpen(null), [])
  const api = useMemo(() => ({ openEnquiry }), [openEnquiry])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!site) return

    // Every jkkn.ai/apply link on the site opens this form instead (user's choice 2026-10-31, same
    // as the six college sites). One listener rather than dozens of edited links - most of them
    // come from CMS content - so the links stay real <a href>s: without JavaScript, or on a Ctrl /
    // Shift / Meta / Alt / middle click, they still open jkkn.ai. A link marked
    // data-full-application (the small one in the dialog) is never caught.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.(APPLY_LINK)
      if (!link || link.hasAttribute('data-full-application')) return
      e.preventDefault()
      openEnquiry(`apply-link-${sourcePageFromPath(window.location.pathname)}`.slice(0, 60))
    }

    // A link that does go through to jkkn.ai (new-tab click, long-press, right-click, keyboard) is
    // tagged first: with the visit's own campaign tags when it arrived with some (lib/enquiry/
    // campaign-tags.ts, 2026-10-31), else with this site and page. None of the apply links in this
    // codebase carried a utm before (repo scan 2026-10-31); a fixed utm_medium=organic in CMS content
    // is dropped. The dialog's full-application link is included, so an ad visitor keeps the ad tag.
    campaignTagsSnapshot()
    const tag = (e: Event) => {
      const link = (e.target as Element | null)?.closest?.(APPLY_LINK) as HTMLAnchorElement | null
      if (!link) return
      const next = tagApplyHref(link.href, parseCampaignTags(campaignTagsSnapshot()), {
        utmSource: site.host,
        utmCampaign: `${site.campaignPrefix}-apply-link-${sourcePageFromPath(window.location.pathname)}`,
      })
      if (next !== link.href) link.href = next
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerdown', tag, true)
    document.addEventListener('contextmenu', tag, true)
    document.addEventListener('focusin', tag, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerdown', tag, true)
      document.removeEventListener('contextmenu', tag, true)
      document.removeEventListener('focusin', tag, true)
    }
  }, [site, openEnquiry])

  // Call / WhatsApp gate (lib/call-gate.ts, ported 2026-11-04 from the Dental site). A tap on any
  // link to 93458 55001 - tel: or WhatsApp, from page code or CMS content - opens this form first;
  // its button sends the lead and opens the dialer / WhatsApp in the same tap. Same shape as the
  // Apply listener above: the links stay real <a href>s, so without JavaScript, or on a Ctrl /
  // Shift / middle click, they still dial or open WhatsApp directly, and nothing in the page HTML
  // (or the phone number in it) changes. ConversionTracking still counts the tap itself as
  // phone_click / whatsapp_click.
  // Not gated: links inside the dialog, careers and the school pages (isUngatedPath), staff routes
  // (isGateOffPath), a link marked data-no-gate, a link inside editable content, and a visitor
  // whose enquiry the CRM already accepted on this browser (they are a lead already).
  useEffect(() => {
    if (!site) return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const target = e.target as Element | null
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!link || link.hasAttribute('data-no-gate') || link.closest('[role=dialog]') || isEditable(link)) return
      const intent = gateIntentForHref(link.getAttribute('href') ?? '')
      if (!intent) return
      const pathname = window.location.pathname
      if (isGateOffPath(pathname) || isUngatedPath(pathname)) return
      if (readStore(ENQUIRY_DONE_KEY)) {
        sendLeadEvent(`${GATE_EVENT[intent]}_bypass`, { reason: 'already_enquired', page_path: pathname })
        return
      }
      e.preventDefault()
      const source = `${intent === 'call' ? 'call-gate' : 'wa-gate'}${pageTag(pathname)}`.slice(0, 60)
      openEnquiry(source, { intent, programmeId: programmeForPath(pathname) })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [site, openEnquiry])

  // A tap on a phone number written as PLAIN TEXT (FAQ answers, the admission pages, page copy),
  // user's choice 2026-11-04: it goes the same way as a Call button. The root layout switches
  // iPhone's own number detection off (it dialled outside the gate), so this listener is now what
  // makes such a number tappable - on Android too, where it never was. Nothing in the page changes:
  // the tap position is read with caretRangeFromPoint, no text is wrapped or rewritten.
  // The admission number opens the call gate (or dials, on the ungated pages and for a visitor who
  // already enquired); any other mobile dials directly, as iPhone did before. Nothing at all happens
  // on a staff route or inside editable content (SPEC section 6: a CMS editor clicking a number).
  useEffect(() => {
    if (!site) return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const target = e.target as Element | null
      if (!target || target.closest('a, button, label, [role=dialog]') || isEditable(target)) return
      const pathname = window.location.pathname
      if (isGateOffPath(pathname)) return
      if (window.getSelection()?.toString()) return // the visitor is selecting text, not tapping
      const hit = textAtPoint(e.clientX, e.clientY)
      if (!hit) return
      const digits = numberAtOffset(hit.text, hit.offset)
      if (!digits) return
      if (!isGateNumber(digits) || isUngatedPath(pathname)) {
        window.location.assign(telUrlFor(digits))
        return
      }
      if (readStore(ENQUIRY_DONE_KEY)) {
        sendLeadEvent('gate_call_bypass', { reason: 'already_enquired', page_path: pathname })
        window.location.assign(telUrlFor(digits))
        return
      }
      e.preventDefault()
      openEnquiry(`call-gate-text${pageTag(pathname)}`.slice(0, 60), {
        intent: 'call',
        programmeId: programmeForPath(pathname),
      })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [site, openEnquiry])

  if (!site) return children

  return (
    <EnquiryModalContext.Provider value={api}>
      {children}
      {open && (
        <EnquiryDialog
          sourcePage={open.sourcePage}
          programmeId={open.programmeId}
          intent={open.intent}
          onClose={close}
        />
      )}
    </EnquiryModalContext.Provider>
  )
}

// The backdrop does NOT close the dialog: on a phone a thumb near the edge would throw away a
// half-typed form. Close = the 44 px X button or Escape.
function EnquiryDialog({
  sourcePage,
  programmeId,
  intent,
  onClose,
}: {
  sourcePage: string
  programmeId?: string
  intent?: GateIntent
  onClose: () => void
}) {
  const site = currentEnquirySite()
  if (!site) return null

  const title =
    intent === 'call'
      ? 'Talk to our admission counsellor'
      : intent === 'whatsapp'
        ? 'Chat with our admission team on WhatsApp'
        : site.dialogTitle

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-dialog-title"
        className="relative w-full max-w-sm lg:max-w-md max-h-[90vh] overflow-y-auto rounded-[20px] bg-white p-5 min-[640px]:p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f7f3] shadow-lg hover:bg-[#e3ece6] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <p id="enquiry-dialog-title" className="font-bold leading-snug text-[#032816] text-lg pr-12 mb-4">
          {title}
        </p>

        <EnquiryForm sourcePage={sourcePage} defaultProgrammeId={programmeId} compact bare gate={intent} />

        {/* The full jkkn.ai application stays one tap away for people ready to apply now.
            data-full-application keeps the site-wide apply-link listener off it.
            Not in a Call / WhatsApp gate: there the visitor came to talk, not to apply. */}
        {!intent && (
          <p className="mt-3 text-center text-xs text-[#4b5563]">
            Ready to apply now?{' '}
            <a
              href={fullApplicationHref(site, sourcePage)}
              target="_blank"
              rel="noopener noreferrer"
              data-full-application
              className="text-[#0b6d41] font-semibold underline"
            >
              Fill the full application form
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
