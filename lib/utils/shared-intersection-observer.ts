/**
 * Shared Intersection Observer Utility
 *
 * Creates a single shared IntersectionObserver per configuration to reduce
 * the overhead of multiple observers for animated elements.
 *
 * This improves INP (Interaction to Next Paint) by reducing the number of
 * active observers on the page.
 */

type ObserverCallback = (entry: IntersectionObserverEntry) => void

interface ObserverConfig {
  threshold: number
  rootMargin: string
}

// Store observers by their configuration key
const observers = new Map<string, IntersectionObserver>()

// Store callbacks by element
const callbacks = new Map<Element, ObserverCallback>()

/**
 * Creates a unique key for an observer configuration
 */
function getObserverKey(config: ObserverConfig): string {
  return `${config.threshold}-${config.rootMargin}`
}

/**
 * Gets or creates a shared IntersectionObserver for the given configuration
 */
function getSharedObserver(config: ObserverConfig): IntersectionObserver {
  const key = getObserverKey(config)

  if (!observers.has(key)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = callbacks.get(entry.target)
          if (callback) {
            callback(entry)
          }
        })
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin,
      }
    )
    observers.set(key, observer)
  }

  return observers.get(key)!
}

/**
 * Observes an element using a shared IntersectionObserver
 *
 * @param element - The DOM element to observe
 * @param callback - Function called when intersection changes
 * @param options - Observer configuration options
 * @returns Cleanup function to stop observing
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   if (!ref.current) return
 *
 *   return observeElement(
 *     ref.current,
 *     (entry) => {
 *       if (entry.isIntersecting) {
 *         setIsVisible(true)
 *       }
 *     },
 *     { threshold: 0.1, rootMargin: '0px' }
 *   )
 * }, [])
 * ```
 */
export function observeElement(
  element: Element,
  callback: ObserverCallback,
  options: Partial<ObserverConfig> = {}
): () => void {
  const config: ObserverConfig = {
    threshold: options.threshold ?? 0.1,
    rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
  }

  const observer = getSharedObserver(config)

  // Store the callback for this element
  callbacks.set(element, callback)

  // Start observing
  observer.observe(element)

  // Return cleanup function
  return () => {
    observer.unobserve(element)
    callbacks.delete(element)

    // Clean up empty observers
    const key = getObserverKey(config)
    if (observers.has(key)) {
      // Check if any elements are still being observed
      // We can't directly check this, so we keep the observer alive
      // It will be garbage collected when no elements are observed
    }
  }
}

/**
 * Disconnects all shared observers (useful for cleanup)
 */
export function disconnectAllObservers(): void {
  observers.forEach((observer) => observer.disconnect())
  observers.clear()
  callbacks.clear()
}

export default { observeElement, disconnectAllObservers }
