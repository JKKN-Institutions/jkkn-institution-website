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
import { sendLeadEvent } from '@/lib/enquiry/lead-events'

type OpenState = { sourcePage: string }
type EnquiryModalApi = { openEnquiry: (sourcePage: string) => void }

const EnquiryModalContext = createContext<EnquiryModalApi | null>(null)

/** null outside the provider - callers must fall back to their ordinary link. */
export function useEnquiryModal() {
  return useContext(EnquiryModalContext)
}

const APPLY_LINK = 'a[href*="jkkn.ai/apply"]'

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const site = currentEnquirySite()
  const [open, setOpen] = useState<OpenState | null>(null)

  const openEnquiry = useCallback((source: string) => {
    // Only where the dialog was opened from - no name, no phone.
    sendLeadEvent('enquiry_open', { source_page: source, page_path: window.location.pathname })
    setOpen({ sourcePage: source })
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

    // A link that does go through to jkkn.ai (new-tab click, long-press, right-click) is tagged
    // first, so the CRM can tell it came from this site and this page. None of the apply links in
    // this codebase carried a utm before (repo scan 2026-10-31). Tags already present are kept.
    const tag = (e: Event) => {
      const link = (e.target as Element | null)?.closest?.(APPLY_LINK) as HTMLAnchorElement | null
      if (!link || link.hasAttribute('data-full-application')) return
      try {
        const url = new URL(link.href)
        if (url.searchParams.has('utm_source')) return
        const tagged = new URL(
          fullApplicationHref(site, `apply-link-${sourcePageFromPath(window.location.pathname)}`.slice(0, 60))
        )
        // Only the utm values are added; the link keeps its own path and any other parameters.
        tagged.searchParams.forEach((value, key) => url.searchParams.set(key, value))
        link.href = url.toString()
      } catch {
        /* leave an unparseable href alone */
      }
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerdown', tag, true)
    document.addEventListener('contextmenu', tag, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerdown', tag, true)
      document.removeEventListener('contextmenu', tag, true)
    }
  }, [site, openEnquiry])

  if (!site) return children

  return (
    <EnquiryModalContext.Provider value={api}>
      {children}
      {open && <EnquiryDialog sourcePage={open.sourcePage} onClose={close} />}
    </EnquiryModalContext.Provider>
  )
}

// The backdrop does NOT close the dialog: on a phone a thumb near the edge would throw away a
// half-typed form. Close = the 44 px X button or Escape.
function EnquiryDialog({ sourcePage, onClose }: { sourcePage: string; onClose: () => void }) {
  const site = currentEnquirySite()
  if (!site) return null

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
          {site.dialogTitle}
        </p>

        <EnquiryForm sourcePage={sourcePage} compact bare />

        {/* The full jkkn.ai application stays one tap away for people ready to apply now.
            data-full-application keeps the site-wide apply-link listener off it. */}
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
      </div>
    </div>
  )
}
