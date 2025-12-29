'use server'

/**
 * Instagram oEmbed metadata fetching
 * Uses Instagram's oEmbed API to get thumbnail and other metadata from reel/post URLs
 */

export interface InstagramMetadata {
  thumbnail_url: string
  title: string
  author_name: string
  author_url: string
  html: string
  width: number
  height: number
}

// Simple in-memory cache for Instagram metadata (resets on server restart)
const metadataCache = new Map<string, { data: InstagramMetadata; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

/**
 * Fetch Instagram metadata using oEmbed API
 * Returns thumbnail URL and other metadata for a given Instagram URL
 */
export async function getInstagramMetadata(url: string): Promise<InstagramMetadata | null> {
  if (!url || !url.includes('instagram.com')) {
    return null
  }

  // Check cache first
  const cached = metadataCache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`
    const response = await fetch(oembedUrl, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      console.error(`Instagram oEmbed API error: ${response.status}`)
      return null
    }

    const data = await response.json() as InstagramMetadata

    // Cache the result
    metadataCache.set(url, { data, timestamp: Date.now() })

    return data
  } catch (error) {
    console.error('Failed to fetch Instagram metadata:', error)
    return null
  }
}

/**
 * Get just the thumbnail URL for an Instagram post/reel
 */
export async function getInstagramThumbnail(url: string): Promise<string | null> {
  const metadata = await getInstagramMetadata(url)
  return metadata?.thumbnail_url || null
}

/**
 * Batch fetch thumbnails for multiple Instagram URLs
 */
export async function getInstagramThumbnails(
  urls: string[]
): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {}

  await Promise.all(
    urls.map(async (url) => {
      results[url] = await getInstagramThumbnail(url)
    })
  )

  return results
}
