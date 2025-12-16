'use server'

import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '@/lib/utils/youtube'

interface YouTubeOEmbedResponse {
  title: string
  author_name: string
  author_url: string
  type: string
  height: number
  width: number
  version: string
  provider_name: string
  provider_url: string
  thumbnail_height: number
  thumbnail_width: number
  thumbnail_url: string
  html: string
}

export interface YouTubeMetadata {
  title: string
  thumbnail: string
  author: string
}

/**
 * Fetch YouTube video metadata using the oEmbed API
 * This is a server action to avoid CORS issues
 */
export async function getYouTubeVideoMetadata(url: string): Promise<{
  success: boolean
  data?: YouTubeMetadata
  error?: string
}> {
  try {
    // Validate that it's a YouTube URL
    const videoId = extractYouTubeVideoId(url)
    if (!videoId) {
      return { success: false, error: 'Invalid YouTube URL' }
    }

    // Fetch metadata from YouTube oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`

    const response = await fetch(oembedUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch video metadata' }
    }

    const data: YouTubeOEmbedResponse = await response.json()

    // Get high-quality thumbnail using our utility
    const thumbnail = getYouTubeThumbnailUrl(videoId, 'maxres')

    return {
      success: true,
      data: {
        title: data.title,
        thumbnail: thumbnail,
        author: data.author_name
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error)
    return { success: false, error: 'Failed to fetch video metadata' }
  }
}
