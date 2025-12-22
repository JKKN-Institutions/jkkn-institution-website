'use client'

import { useState, useEffect } from 'react'

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
    const handleScroll = () => {
      setOffset(window.pageYOffset)
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return offset
}
