// Keeps the page behind an open dialog from scrolling. Set on <html> because six of the eight sites
// set overflow-x there, so a lock on <body> alone did not stop the page (form UI audit, 2026-11-23).
// scrollbar-gutter holds the page width on a desktop, so opening the popup does not shift the layout.

import { useEffect } from "react"

export function useDialogScrollLock() {
  useEffect(() => {
    const root = document.documentElement
    const { overflow, scrollbarGutter } = root.style
    if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = "stable"
    root.style.overflow = "hidden"
    return () => {
      root.style.overflow = overflow
      root.style.scrollbarGutter = scrollbarGutter
    }
  }, [])
}
