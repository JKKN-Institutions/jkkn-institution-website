/**
 * Anonymous Visitor ID Generation
 *
 * Creates a privacy-safe, anonymous visitor identifier using:
 * - Random bytes
 * - Timestamp
 * - SHA-256 hashing
 *
 * No PII is collected or stored.
 */

const VISITOR_ID_KEY = 'jkkn_visitor_id'

/**
 * Generate a SHA-256 hash of the input string
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a new anonymous visitor ID
 */
async function generateVisitorId(): Promise<string> {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16))
  const randomString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  const timestamp = Date.now().toString(36)
  const rawId = `${randomString}-${timestamp}`

  // Hash to ensure no raw data is stored
  return sha256(rawId)
}

/**
 * Get or create an anonymous visitor ID
 * Stored in localStorage for session persistence
 */
export async function getVisitorId(): Promise<string> {
  if (typeof window === 'undefined') {
    // Server-side: generate temporary ID
    return generateVisitorId()
  }

  try {
    // Check for existing ID
    const existingId = localStorage.getItem(VISITOR_ID_KEY)
    if (existingId && existingId.length === 64) {
      return existingId
    }

    // Generate new ID
    const newId = await generateVisitorId()
    localStorage.setItem(VISITOR_ID_KEY, newId)
    return newId
  } catch {
    // Fallback for private browsing or localStorage disabled
    return generateVisitorId()
  }
}

/**
 * Detect device type based on user agent and screen size
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const ua = navigator.userAgent.toLowerCase()
  const screenWidth = window.innerWidth

  // Check for mobile devices
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile'
  }

  // Check for tablets
  if (/tablet|ipad|playbook|silk/i.test(ua) || (screenWidth >= 600 && screenWidth < 1024)) {
    return 'tablet'
  }

  // Check screen width as fallback
  if (screenWidth < 768) {
    return 'mobile'
  }

  return 'desktop'
}

/**
 * Get browser name from user agent
 */
export function getBrowserName(): string {
  if (typeof window === 'undefined') return 'Unknown'

  const ua = navigator.userAgent

  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('SamsungBrowser')) return 'Samsung'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'

  return 'Other'
}

/**
 * Check if user has "Do Not Track" enabled
 */
export function isDoNotTrackEnabled(): boolean {
  if (typeof window === 'undefined') return false

  return (
    navigator.doNotTrack === '1' ||
    (window as Window & { doNotTrack?: string }).doNotTrack === '1'
  )
}
