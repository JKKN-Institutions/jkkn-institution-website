/**
 * Media URL Optimization Utilities
 *
 * Provides helpers for optimizing media loading performance from Supabase Storage
 */

/**
 * Gets the optimized media URL from Supabase Storage
 * Applies CDN configuration if available
 *
 * @param path - Relative path in Supabase storage (e.g., 'media/video.mp4')
 * @returns Full URL to the media file
 */
export function getOptimizedMediaUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cdnEnabled = process.env.NEXT_PUBLIC_SUPABASE_CDN_ENABLED === 'true';

  if (!baseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined');
    return path;
  }

  // If path is already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Construct storage URL
  // In the future, we can add CDN-specific URL patterns here
  // For now, use standard Supabase Storage URL
  return `${baseUrl}/storage/v1/object/public/${cleanPath}`;
}

/**
 * Determines optimal preload strategy based on video context
 *
 * @param context - Where the video is being used
 * @param autoplay - Whether video autoplays
 * @returns Optimal preload value
 */
export function getVideoPreloadStrategy(
  context: 'hero' | 'background' | 'content' | 'thumbnail',
  autoplay: boolean = false
): 'none' | 'metadata' | 'auto' {
  // Background and hero videos with autoplay
  if ((context === 'hero' || context === 'background') && autoplay) {
    return 'none'; // Defer loading, use poster image
  }

  // Content videos (user-initiated)
  if (context === 'content') {
    return 'metadata'; // Load metadata only
  }

  // Thumbnails and previews
  if (context === 'thumbnail') {
    return 'metadata';
  }

  // Default safe strategy
  return 'metadata';
}

/**
 * Checks if a media URL is from Supabase Storage
 *
 * @param url - URL to check
 * @returns True if URL is from Supabase Storage
 */
export function isSupabaseStorageUrl(url: string): boolean {
  if (!url) return false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;

  return url.includes(supabaseUrl) && url.includes('/storage/v1/object/');
}

/**
 * Extracts storage path from full Supabase Storage URL
 *
 * @param url - Full Supabase Storage URL
 * @returns Relative storage path or original URL if not Supabase
 */
export function extractStoragePath(url: string): string {
  if (!isSupabaseStorageUrl(url)) return url;

  const match = url.match(/\/storage\/v1\/object\/public\/(.+)$/);
  return match ? match[1] : url;
}

/**
 * Generates cache headers for media requests
 *
 * @param mediaType - Type of media (video, image, etc.)
 * @returns Cache-Control header value
 */
export function getMediaCacheHeaders(mediaType: 'video' | 'image' | 'audio'): string {
  switch (mediaType) {
    case 'video':
      // Videos are large, cache aggressively
      return 'public, max-age=31536000, immutable';
    case 'image':
      // Images can be cached for a long time
      return 'public, max-age=31536000, immutable';
    case 'audio':
      // Audio files, cache similarly to videos
      return 'public, max-age=31536000, immutable';
    default:
      return 'public, max-age=3600';
  }
}
