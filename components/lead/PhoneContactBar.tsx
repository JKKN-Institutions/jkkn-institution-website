// Phone strip with Call + WhatsApp (form UI audit 2026-11-23: on most phone pages neither button
// was on the first screen). Both are ordinary links to the admission number, so the existing gate
// in the enquiry modal catches the tap, takes the 3-box form first, and then opens the dialer or
// WhatsApp. Nothing new is sent or tracked here.
//
// It sits on top of the site's bottom nav and steps aside when it would cover a form field, when the
// form's own buttons are in view, while typing, near the end of the page, or while a page's own
// contact strip is showing.

"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, Phone } from "lucide-react"
import { GATE_PHONE, isGateOffPath, isUngatedPath } from "@/lib/call-gate"

const BAR_HEIGHT = 53
const WHATSAPP_HREF = `https://wa.me/${GATE_PHONE.replace("+", "")}`

function bottomNavHeight(): number {
  const vh = window.innerHeight
  let height = 0
  for (const nav of Array.from(document.querySelectorAll("nav"))) {
    let box: HTMLElement | null = nav
    while (box && getComputedStyle(box).position !== "fixed") box = box.parentElement
    if (!box) continue
    const r = box.getBoundingClientRect()
    if (r.height > 0 && r.bottom >= vh - 2 && r.top > vh / 2) height = Math.max(height, vh - r.top)
  }
  return Math.round(height)
}

// True when the strip would sit on a form field or button, or the form's own Call / WhatsApp buttons
// are already in view. A form inside the popup does not count: the popup covers the strip anyway.
function formNeedsTheSpace(bandTop: number, bandBottom: number): boolean {
  return Array.from(document.querySelectorAll("form input[name=source_page]")).some((field) => {
    const form = field.closest("form")
    if (!form || form.closest("[role=dialog]") || form.getClientRects().length === 0) return false
    const underStrip = Array.from(form.querySelectorAll<HTMLElement>("input:not([type=hidden]), select, textarea, button")).some((el) => {
      if (el.tabIndex < 0) return false
      const r = el.getBoundingClientRect()
      return r.width > 1 && r.top < bandBottom && r.bottom > bandTop
    })
    const submit = form.querySelector("button[type=submit]")?.getBoundingClientRect()
    return underStrip || (!!submit && submit.width > 1 && submit.top >= 0 && submit.bottom <= bandTop)
  })
}

export default function PhoneContactBar() {
  const pathname = usePathname() ?? "/"
  const [bottom, setBottom] = useState<number | null>(null)
  const off = isGateOffPath(pathname) || isUngatedPath(pathname)

  useEffect(() => {
    if (off) return
    let frame = 0
    const read = () => {
      frame = 0
      if (window.innerWidth >= 768) return setBottom(null)
      const vh = window.innerHeight
      const navHeight = bottomNavHeight()
      const atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 140
      const ownStrip = !!document.querySelector('[aria-label="Contact the admission office"][aria-hidden="false"]')
      const typing = !!document.activeElement?.matches("input, select, textarea")
      setBottom(atEnd || ownStrip || typing || formNeedsTheSpace(vh - navHeight - BAR_HEIGHT, vh - navHeight) ? null : navHeight)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    schedule()
    const late = window.setTimeout(schedule, 700)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    document.addEventListener("focusin", schedule)
    document.addEventListener("focusout", schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(late)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      document.removeEventListener("focusin", schedule)
      document.removeEventListener("focusout", schedule)
    }
  }, [off, pathname])

  if (off || bottom === null) return null

  const button = "flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg text-sm font-bold"
  return (
    <>
      {/* Floating buttons at the same height move above the strip; its WhatsApp replaces the bubble. */}
      <style>{`@media (max-width:767.98px){button[aria-label="Scroll to top"],div.fixed:has(> button[aria-label$="contact menu"]){bottom:${
        bottom + BAR_HEIGHT + 12
      }px !important}a[aria-label="Chat with the admission team on WhatsApp"]{display:none !important}}`}</style>
      <div
        role="region"
        aria-label="Call or WhatsApp the admission team"
        className="fixed inset-x-0 z-[70] border-t border-gray-200 bg-white px-3 py-1 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] min-[768px]:hidden"
        style={{ bottom }}
      >
        <div className="mx-auto flex max-w-xl gap-2">
          <a href={`tel:${GATE_PHONE}`} className={`${button} bg-[#0b6d41] text-white`}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call
          </a>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={`${button} bg-[#25d366] text-[#032816]`}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
