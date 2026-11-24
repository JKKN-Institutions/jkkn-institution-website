// A closed <select> shows one line and cuts the rest. On a 320 px phone two courses that start with the
// same words then look the same, e.g. two M.Pharm specialisations (form UI audit, 2026-11-23). This gives
// the chosen course's full name only while the box is cutting it, so the form can print it under the box.
// It is measured with the box's own font, so a wide box (a desktop) shows nothing extra.

import { useCallback, useRef, useState } from "react"

let canvas: HTMLCanvasElement | null = null

function cutText(box: HTMLSelectElement): string {
  const option = box.options[box.selectedIndex]
  const text = option && option.value ? option.text.trim() : ""
  if (!text) return ""
  const style = getComputedStyle(box)
  const room = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  if (!canvas) canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  return ctx.measureText(text).width > room ? text : ""
}

export function useCutSelectLabel() {
  const [label, setLabel] = useState("")
  const box = useRef<HTMLSelectElement | null>(null)
  const watch = useRef<ResizeObserver | null>(null)

  const measure = useCallback(() => {
    const el = box.current
    // A hidden box (a closed popup) has no width to measure; the observer measures it again when it shows.
    if (!el || el.clientWidth === 0) return
    const next = cutText(el)
    setLabel((old) => (old === next ? old : next))
  }, [])

  const attach = useCallback(
    (el: HTMLSelectElement | null) => {
      watch.current?.disconnect()
      watch.current = null
      box.current = el
      if (!el) return
      measure()
      if (typeof ResizeObserver !== "undefined") {
        watch.current = new ResizeObserver(measure)
        watch.current.observe(el)
      }
      // The web font can arrive after the first measure and change the text width.
      document.fonts?.ready.then(measure).catch(() => {})
    },
    [measure],
  )

  // A tuple, so each form names the parts itself: the label is plain state, and the lint never
  // mistakes it for a ref read.
  return [label, attach, measure] as const
}
