'use client'

import { useState, useEffect } from 'react'
import { throttleRAF } from '@/lib/utils/dom-performance'

/**
 * Custom hook for parallax scrolling effect
 * Returns the current scroll offset for creating smooth parallax animations
 *
 * @returns {number} Current page Y offset
 *
 * @example
 * const parallaxOffset = useParallax()
 * const parallaxStyle = {
 *   transform: `translateY(${parallaxOffset * 0.5}px)`
 * }
 */
export function useParallax() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = throttleRAF(() => {
      setOffset(window.pageYOffset)
    })

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return offset
}
