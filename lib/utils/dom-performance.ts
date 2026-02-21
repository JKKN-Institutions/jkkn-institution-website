/**
 * DOM Performance Utilities
 *
 * Prevents forced reflows by throttling scroll/resize handlers
 * and caching layout property reads during drag operations.
 */

/**
 * Creates a requestAnimationFrame-throttled callback.
 * Ensures the callback fires at most once per animation frame (~16ms).
 *
 * @example
 * useEffect(() => {
 *   const handleScroll = throttleRAF(() => {
 *     setIsScrolled(window.scrollY > 20)
 *   })
 *   window.addEventListener('scroll', handleScroll, { passive: true })
 *   return () => {
 *     handleScroll.cancel()
 *     window.removeEventListener('scroll', handleScroll)
 *   }
 * }, [])
 */
export function throttleRAF<T extends (...args: unknown[]) => void>(
  callback: T
): T & { cancel: () => void } {
  let rafId: number | null = null

  const throttled = ((...args: unknown[]) => {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      callback(...args)
      rafId = null
    })
  }) as T & { cancel: () => void }

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  return throttled
}

/**
 * Debounces a callback by the given delay in milliseconds.
 *
 * @example
 * const handleResize = debounce(() => {
 *   setIsMobile(window.innerWidth < 768)
 * }, 150)
 */
export function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: unknown[]) => {
    if (timeoutId !== null) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(...args)
      timeoutId = null
    }, delay)
  }) as T & { cancel: () => void }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
