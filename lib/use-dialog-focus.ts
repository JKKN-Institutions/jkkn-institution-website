// Moves keyboard focus into an open dialog, keeps Tab inside it, and hands focus back on close
// (WCAG 2.4.3, form UI audit 2026-11-23). Focus goes to the dialog box, not a text field, so a
// phone does not open its keyboard by itself when the popup appears.

import { useEffect, useRef } from "react"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]'

export function useDialogFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const box = ref.current
    if (!box) return
    const opener = document.activeElement as HTMLElement | null
    box.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const items = Array.from(box.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el !== box && el.tabIndex >= 0 && el.getClientRects().length > 0
      )
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (!box.contains(active) || active === box) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      if (opener && opener !== document.body && opener.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  return ref
}
