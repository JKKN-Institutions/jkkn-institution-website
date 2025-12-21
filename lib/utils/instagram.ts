/**
 * Instagram utility functions
 * Helper functions for extracting Instagram IDs and converting URLs to embeddable format
 */

/**
 * Extract Instagram post/reel ID from URL
 * Supports both /p/ (posts) and /reel/ (reels) formats
 *
 * @param url - Instagram post or reel URL
 * @returns Post/reel ID or null if invalid
 *
 * @example
 * extractInstagramId('https://www.instagram.com/p/ABC123/') // 'ABC123'
 * extractInstagramId('https://www.instagram.com/reel/XYZ789/') // 'XYZ789'
 */
export function extractInstagramId(url: string): string | null {
  if (!url) return null

  const match = url.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/)
  return match ? match[2] : null
}

/**
 * Convert Instagram URL to embeddable iframe format
 * Adds autoplay parameter if specified
 *
 * @param url - Instagram post or reel URL
 * @param autoplay - Whether to enable autoplay (default: true)
 * @returns Embed URL for iframe src
 *
 * @example
 * getInstagramEmbedUrl('https://www.instagram.com/p/ABC123/', true)
 * // 'https://www.instagram.com/p/ABC123/embed/?autoplay=1'
 */
export function getInstagramEmbedUrl(url: string, autoplay = true): string {
  const postId = extractInstagramId(url)
  if (!postId) return url

  const embedUrl = `https://www.instagram.com/p/${postId}/embed/`
  return autoplay ? `${embedUrl}?autoplay=1` : embedUrl
}

/**
 * Validate if a URL is a valid Instagram post or reel URL
 *
 * @param url - URL to validate
 * @returns true if valid Instagram URL
 *
 * @example
 * isValidInstagramUrl('https://www.instagram.com/p/ABC123/') // true
 * isValidInstagramUrl('https://www.youtube.com/watch?v=123') // false
 */
export function isValidInstagramUrl(url: string): boolean {
  if (!url) return false

  const instagramPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+(\/)?(\?.*)?$/
  return instagramPattern.test(url)
}
