/**
 * Video Performance Monitoring
 *
 * Tracks video loading performance metrics for optimization
 */

export interface VideoPerformanceMetrics {
  videoId: string
  videoUrl: string
  startTime: number
  metadataLoadTime?: number
  canPlayTime?: number
  firstFrameTime?: number
  errorTime?: number
  fileSize?: number
  duration?: number
  errorMessage?: string
}

const performanceMetrics = new Map<string, VideoPerformanceMetrics>()

/**
 * Start tracking video performance
 *
 * @param videoId - Unique identifier for the video
 * @param videoUrl - URL of the video being loaded
 * @returns Tracker object with methods to record events
 */
export function trackVideoPerformance(videoId: string, videoUrl: string) {
  const startTime = performance.now()

  // Initialize metrics
  const metrics: VideoPerformanceMetrics = {
    videoId,
    videoUrl,
    startTime,
  }

  performanceMetrics.set(videoId, metrics)

  return {
    /**
     * Record when video metadata is loaded
     */
    onMetadataLoaded: (video: HTMLVideoElement) => {
      const metric = performanceMetrics.get(videoId)
      if (metric) {
        metric.metadataLoadTime = performance.now() - startTime
        metric.duration = video.duration
        metric.fileSize = estimateVideoSize(video)

        console.log(`[Video Performance] ${videoId} - Metadata loaded in ${metric.metadataLoadTime.toFixed(2)}ms`)
      }
    },

    /**
     * Record when video is ready to play
     */
    onCanPlay: () => {
      const metric = performanceMetrics.get(videoId)
      if (metric) {
        metric.canPlayTime = performance.now() - startTime

        console.log(`[Video Performance] ${videoId} - Ready to play in ${metric.canPlayTime.toFixed(2)}ms`)

        // Warn if load time is excessive
        if (metric.canPlayTime > 5000) {
          console.warn(
            `[Video Performance] ⚠️ Slow video load detected: ${videoId} took ${(metric.canPlayTime / 1000).toFixed(2)}s`
          )
        }
      }
    },

    /**
     * Record when first frame is rendered (video starts playing)
     */
    onFirstFrame: () => {
      const metric = performanceMetrics.get(videoId)
      if (metric) {
        metric.firstFrameTime = performance.now() - startTime
        console.log(`[Video Performance] ${videoId} - First frame at ${metric.firstFrameTime.toFixed(2)}ms`)
      }
    },

    /**
     * Record when video encounters an error
     */
    onError: (error: string) => {
      const metric = performanceMetrics.get(videoId)
      if (metric) {
        metric.errorTime = performance.now() - startTime
        metric.errorMessage = error

        console.error(`[Video Performance] ${videoId} - Error after ${metric.errorTime.toFixed(2)}ms: ${error}`)
      }
    },

    /**
     * Get final metrics report
     */
    getMetrics: () => {
      return performanceMetrics.get(videoId)
    },

    /**
     * Clean up tracking
     */
    cleanup: () => {
      performanceMetrics.delete(videoId)
    },
  }
}

/**
 * Estimate video file size based on duration and quality
 * This is a rough estimate for monitoring purposes
 */
function estimateVideoSize(video: HTMLVideoElement): number {
  // Estimate: 1 minute of 720p video ≈ 10-20 MB
  // Using conservative estimate of 15 MB/min
  const duration = video.duration
  const estimatedMBPerMinute = 15

  if (!duration || isNaN(duration)) return 0

  return (duration / 60) * estimatedMBPerMinute * 1024 * 1024 // Convert to bytes
}

/**
 * Get all performance metrics
 */
export function getAllVideoMetrics(): VideoPerformanceMetrics[] {
  return Array.from(performanceMetrics.values())
}

/**
 * Get performance summary for debugging
 */
export function getPerformanceSummary(): string {
  const metrics = getAllVideoMetrics()

  if (metrics.length === 0) {
    return 'No video performance data available'
  }

  const summary = metrics.map((m) => {
    const lines = [
      `Video: ${m.videoId}`,
      `URL: ${m.videoUrl}`,
      m.metadataLoadTime ? `  Metadata: ${m.metadataLoadTime.toFixed(2)}ms` : '',
      m.canPlayTime ? `  Ready: ${m.canPlayTime.toFixed(2)}ms` : '',
      m.firstFrameTime ? `  First Frame: ${m.firstFrameTime.toFixed(2)}ms` : '',
      m.duration ? `  Duration: ${m.duration.toFixed(2)}s` : '',
      m.fileSize ? `  Est. Size: ${(m.fileSize / 1024 / 1024).toFixed(2)} MB` : '',
      m.errorMessage ? `  Error: ${m.errorMessage}` : '',
    ]

    return lines.filter(Boolean).join('\n')
  })

  return summary.join('\n\n')
}

/**
 * Log performance summary to console
 */
export function logPerformanceSummary(): void {
  console.log('=== Video Performance Summary ===')
  console.log(getPerformanceSummary())
  console.log('=================================')
}

/**
 * Clear all metrics
 */
export function clearAllMetrics(): void {
  performanceMetrics.clear()
}

/**
 * Hook into video element for automatic tracking
 *
 * @param video - Video element to track
 * @param videoId - Unique identifier
 */
export function attachVideoPerformanceTracking(
  video: HTMLVideoElement,
  videoId: string
): () => void {
  const tracker = trackVideoPerformance(videoId, video.src || video.currentSrc)

  const handleLoadedMetadata = () => tracker.onMetadataLoaded(video)
  const handleCanPlay = () => tracker.onCanPlay()
  const handlePlaying = () => tracker.onFirstFrame()
  const handleError = () => tracker.onError(video.error?.message || 'Unknown error')

  video.addEventListener('loadedmetadata', handleLoadedMetadata)
  video.addEventListener('canplay', handleCanPlay)
  video.addEventListener('playing', handlePlaying)
  video.addEventListener('error', handleError)

  // Return cleanup function
  return () => {
    video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    video.removeEventListener('canplay', handleCanPlay)
    video.removeEventListener('playing', handlePlaying)
    video.removeEventListener('error', handleError)
    tracker.cleanup()
  }
}

/**
 * React hook for video performance tracking
 */
export function useVideoPerformanceTracking(videoId: string, videoUrl: string) {
  const trackerRef = { current: trackVideoPerformance(videoId, videoUrl) }

  return {
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) =>
      trackerRef.current.onMetadataLoaded(e.currentTarget),
    onCanPlay: () => trackerRef.current.onCanPlay(),
    onPlaying: () => trackerRef.current.onFirstFrame(),
    onError: (e: React.SyntheticEvent<HTMLVideoElement>) =>
      trackerRef.current.onError(e.currentTarget.error?.message || 'Unknown error'),
    getMetrics: () => trackerRef.current.getMetrics(),
    cleanup: () => trackerRef.current.cleanup(),
  }
}
