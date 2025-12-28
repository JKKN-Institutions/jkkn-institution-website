'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { FontFamily } from '@/lib/cms/page-typography-types'
import { GOOGLE_FONT_URLS, FONT_FAMILY_STACKS } from '@/lib/cms/page-typography-types'

interface DynamicFontLoaderProps {
  fontFamily: FontFamily
  children: ReactNode
}

/**
 * Dynamically loads Google Fonts on-demand for the selected font family.
 * Poppins is already loaded globally in app/layout.tsx, so it's skipped.
 * Other fonts are loaded via stylesheet injection when needed.
 */
export function DynamicFontLoader({ fontFamily, children }: DynamicFontLoaderProps) {
  const [fontLoaded, setFontLoaded] = useState(fontFamily === 'poppins')

  useEffect(() => {
    // Poppins is already loaded globally - no need to load again
    if (fontFamily === 'poppins') {
      setFontLoaded(true)
      return
    }

    const fontUrl = GOOGLE_FONT_URLS[fontFamily]
    if (!fontUrl) {
      setFontLoaded(true)
      return
    }

    // Check if font stylesheet is already loaded
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`)
    if (existingLink) {
      setFontLoaded(true)
      return
    }

    // Create and inject the font stylesheet
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontUrl
    link.crossOrigin = 'anonymous'

    link.onload = () => {
      setFontLoaded(true)
    }

    link.onerror = () => {
      console.warn(`Failed to load font: ${fontFamily}, using fallback`)
      // Continue with fallback fonts - don't block rendering
      setFontLoaded(true)
    }

    document.head.appendChild(link)

    // Cleanup not needed - fonts should persist across navigations
  }, [fontFamily])

  // Apply font family via inline style wrapper
  // Render immediately with fallback fonts for smooth UX
  return (
    <div
      className="page-font-wrapper"
      style={{
        fontFamily: FONT_FAMILY_STACKS[fontFamily],
      }}
    >
      {children}
    </div>
  )
}
