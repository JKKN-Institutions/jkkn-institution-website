/**
 * Google Drive URL Utilities
 *
 * Converts Google Drive share links to embeddable URLs for images and videos.
 *
 * IMPORTANT: Files must be shared with "Anyone with the link can view" permission.
 *
 * Supported input formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - Just the FILE_ID itself
 */

/**
 * Regex patterns for extracting Google Drive file IDs
 */
const GOOGLE_DRIVE_PATTERNS = [
  // https://drive.google.com/file/d/FILE_ID/view
  /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
  // https://drive.google.com/open?id=FILE_ID
  /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
  // https://drive.google.com/uc?id=FILE_ID or uc?export=view&id=FILE_ID
  /drive\.google\.com\/uc\?(?:export=view&)?id=([a-zA-Z0-9_-]+)/,
  // https://lh3.googleusercontent.com/d/FILE_ID
  /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/,
]

/**
 * Check if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false
  return (
    url.includes('drive.google.com') ||
    url.includes('googleusercontent.com/d/')
  )
}

/**
 * Extract the file ID from a Google Drive URL
 * @param url - Google Drive share URL or file ID
 * @returns File ID or null if not found
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null

  // If it's already just a file ID (alphanumeric, underscores, hyphens)
  if (/^[a-zA-Z0-9_-]+$/.test(url) && url.length > 10) {
    return url
  }

  // Try each pattern
  for (const pattern of GOOGLE_DRIVE_PATTERNS) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Convert a Google Drive URL to an embeddable image URL
 * Uses lh3.googleusercontent.com which works well with next/image
 *
 * @param url - Google Drive share URL or file ID
 * @returns Embeddable image URL
 */
export function convertToGoogleDriveImageUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    // Return original URL if we can't extract a file ID
    return url
  }

  // Use lh3.googleusercontent.com format - works best with next/image
  return `https://lh3.googleusercontent.com/d/${fileId}`
}

/**
 * Convert a Google Drive URL to an embeddable video URL (for iframe)
 *
 * @param url - Google Drive share URL or file ID
 * @returns Embeddable video URL for iframe
 */
export function convertToGoogleDriveVideoUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return url
  }

  // Google Drive video preview URL for iframe embedding
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Get the direct download URL for a Google Drive file
 * Useful for direct file access (not recommended for images due to redirects)
 *
 * @param url - Google Drive share URL or file ID
 * @returns Direct download URL
 */
export function getGoogleDriveDownloadUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return url
  }

  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

/**
 * Process a URL - if it's a Google Drive URL, convert it to embeddable format
 * Otherwise return the original URL
 *
 * @param url - Any URL
 * @param type - 'image' or 'video'
 * @returns Processed URL
 */
export function processMediaUrl(
  url: string,
  type: 'image' | 'video' = 'image'
): string {
  if (!url) return url

  if (isGoogleDriveUrl(url)) {
    return type === 'video'
      ? convertToGoogleDriveVideoUrl(url)
      : convertToGoogleDriveImageUrl(url)
  }

  return url
}

/**
 * Validate that a Google Drive file is accessible
 * Note: This only checks if the URL format is valid, not if the file is actually shared
 *
 * @param url - Google Drive URL
 * @returns Validation result
 */
export function validateGoogleDriveUrl(url: string): {
  isValid: boolean
  fileId: string | null
  imageUrl: string | null
  videoUrl: string | null
  error?: string
} {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return {
      isValid: false,
      fileId: null,
      imageUrl: null,
      videoUrl: null,
      error: 'Could not extract file ID from URL. Please use a valid Google Drive share link.',
    }
  }

  return {
    isValid: true,
    fileId,
    imageUrl: convertToGoogleDriveImageUrl(url),
    videoUrl: convertToGoogleDriveVideoUrl(url),
  }
}

/**
 * Instructions for users on how to get a Google Drive share link
 */
export const GOOGLE_DRIVE_INSTRUCTIONS = `
How to use Google Drive images/videos:

1. Upload your file to Google Drive
2. Right-click the file and select "Share"
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Copy link"
6. Paste the link in the image/video field

The system will automatically convert the link to an embeddable format.

Supported formats:
- Images: JPG, PNG, GIF, WebP
- Videos: MP4, MOV, AVI (will be embedded as iframe)
`.trim()
