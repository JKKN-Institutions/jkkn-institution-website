# Video Implementation Quick Start Guide

**Last Updated**: 2026-01-18
**Purpose**: Quick reference for implementing videos with optimal performance

---

## TL;DR - Copy & Paste Solutions

### Standard Video Player

```tsx
import VideoPlayer from '@/components/cms-blocks/media/video-player'

// Self-hosted video
<VideoPlayer
  src="https://yourproject.supabase.co/storage/v1/object/public/media/video.mp4"
  poster="https://yourproject.supabase.co/storage/v1/object/public/media/poster.jpg"
  provider="self"
  controls={true}
  autoplay={false}
/>

// YouTube video
<VideoPlayer
  src="https://www.youtube.com/watch?v=VIDEO_ID"
  provider="youtube"
  controls={true}
/>
```

### Progressive Video Player (For Large Videos)

```tsx
import ProgressiveVideoPlayer from '@/components/cms-blocks/media/progressive-video-player'

<ProgressiveVideoPlayer
  src="https://yourproject.supabase.co/storage/v1/object/public/media/large-video.mp4"
  poster="https://yourproject.supabase.co/storage/v1/object/public/media/poster.jpg"
  aspectRatio="16/9"
  controls={true}
  onLoadStart={() => console.log('Video loading started')}
  onCanPlay={() => console.log('Video ready to play')}
/>
```

### Background Video (Hero Section)

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  preload="none"
  poster="/images/hero-poster.jpg"
  className="absolute inset-0 w-full h-full object-cover"
  onLoadStart={(e) => {
    // Defer loading until after page is interactive
    e.currentTarget.setAttribute('preload', 'auto')
  }}
>
  <source src="/videos/hero-background.mp4" type="video/mp4" />
</video>
```

---

## When to Use What

| Scenario | Component | Preload Strategy |
|----------|-----------|------------------|
| **User clicks to watch** | `VideoPlayer` | `metadata` |
| **Large video (>20MB)** | `ProgressiveVideoPlayer` | `metadata` → `auto` on click |
| **Background video (autoplay)** | Native `<video>` | `none` → `auto` after load |
| **Video thumbnail/preview** | Native `<video>` | `metadata` |
| **Above-the-fold video** | `ProgressiveVideoPlayer` | `metadata` |
| **Below-the-fold video** | `VideoPlayer` or `ProgressiveVideoPlayer` | `metadata` |
| **YouTube/Vimeo embed** | `VideoPlayer` | N/A (handled by platform) |

---

## Performance Rules (Follow These Always)

### ✅ DO

1. **Always set poster image**
   ```tsx
   <video poster="/path/to/poster.jpg" />
   ```

2. **Use appropriate preload**
   ```tsx
   // User-initiated
   <video preload="metadata" />

   // Background/autoplay
   <video preload="none" />
   ```

3. **Add loading states for large videos**
   ```tsx
   <ProgressiveVideoPlayer /> // Has built-in loading state
   ```

4. **Use Supabase Storage for hosting**
   ```
   https://PROJECT.supabase.co/storage/v1/object/public/media/video.mp4
   ```

5. **Generate poster images**
   - Extract first frame from video
   - Optimize as WebP or AVIF
   - Same dimensions as video

### ❌ DON'T

1. **Never omit preload attribute**
   ```tsx
   // BAD - defaults to "auto", downloads entire video
   <video src="/video.mp4" />

   // GOOD
   <video src="/video.mp4" preload="metadata" />
   ```

2. **Never use preload="auto" unless necessary**
   ```tsx
   // BAD - downloads video immediately
   <video preload="auto" />

   // GOOD - only for autoplay videos
   <video autoPlay muted preload="auto" />
   ```

3. **Never skip poster images**
   ```tsx
   // BAD - blank space while loading
   <video src="/video.mp4" />

   // GOOD
   <video src="/video.mp4" poster="/poster.jpg" />
   ```

4. **Never load multiple large videos at once**
   - Use lazy loading
   - Use progressive loading
   - Load on user interaction

5. **Never upload uncompressed videos**
   - Compress to H.264
   - Target: <50MB for short videos
   - Use 720p or 1080p max

---

## Common Patterns

### Pattern 1: Click-to-Play Video Card

```tsx
'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import Image from 'next/image'

export function VideoCard({ src, poster, title }) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!isPlaying) {
    return (
      <div className="relative cursor-pointer" onClick={() => setIsPlaying(true)}>
        <Image src={poster} alt={title} width={640} height={360} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="w-16 h-16 text-white" />
        </div>
      </div>
    )
  }

  return (
    <video src={src} controls autoPlay preload="auto" className="w-full" />
  )
}
```

### Pattern 2: Video Gallery with Thumbnails

```tsx
'use client'

import { useState } from 'react'

export function VideoGallery({ videos }) {
  const [activeVideo, setActiveVideo] = useState(videos[0])

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Main player */}
      <div className="col-span-8">
        <video
          key={activeVideo.id}
          src={activeVideo.url}
          poster={activeVideo.poster}
          controls
          preload="metadata"
          className="w-full"
        />
      </div>

      {/* Thumbnails */}
      <div className="col-span-4 space-y-2">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="w-full"
          >
            <video
              src={video.url}
              poster={video.poster}
              preload="metadata"
              className="w-full rounded"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Pattern 3: Autoplay Background Video with Fallback

```tsx
export function HeroWithVideo({ videoUrl, posterUrl, fallbackImage }) {
  return (
    <div className="relative h-screen">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={posterUrl}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          // Fallback to image if video fails
          e.currentTarget.style.display = 'none'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Fallback image */}
      <Image
        src={fallbackImage}
        alt="Hero background"
        fill
        className="object-cover -z-10"
      />

      {/* Content */}
      <div className="relative z-10">
        <h1>Your Content Here</h1>
      </div>
    </div>
  )
}
```

---

## Performance Monitoring

### Check Video Load Time

```typescript
import { useVideoPerformanceTracking } from '@/lib/analytics/video-performance'

function MyVideo({ src }) {
  const tracking = useVideoPerformanceTracking('my-video-id', src)

  return (
    <video
      src={src}
      onLoadedMetadata={tracking.onLoadedMetadata}
      onCanPlay={tracking.onCanPlay}
      onPlaying={tracking.onPlaying}
      onError={tracking.onError}
    />
  )
}
```

### Debug Performance in Console

```javascript
// View all video metrics
logPerformanceSummary()

// Check specific video
const tracker = trackVideoPerformance('video-1', 'url')
console.log(tracker.getMetrics())
```

---

## Troubleshooting

### Video Won't Autoplay

**Problem**: Video element with `autoPlay` doesn't play

**Solution**: Ensure video is muted
```tsx
<video autoPlay muted loop playsInline />
```

**Reason**: Browser autoplay policies require muted videos

---

### Video Loads Slowly

**Problem**: Video takes 10+ seconds to start playing

**Check**:
1. File size - Should be <50MB
2. Preload attribute - Should be `metadata` or `none`
3. Network speed - Test on throttled connection
4. Supabase Storage - Check bandwidth limits

**Solution**: Use `ProgressiveVideoPlayer` or compress video

---

### Video Shows 304 But Still Slow

**Problem**: Network shows 304 (cached) but video loads slowly

**Reason**: Browser is revalidating cache with server

**Solution**:
1. Ensure proper cache headers are set
2. Use CDN for better caching
3. Check Supabase Storage cache configuration

---

### Poster Image Doesn't Show

**Problem**: Blank space instead of poster image

**Check**:
1. Poster URL is valid
2. CORS headers allow image loading
3. Image file exists and is accessible

**Solution**:
```tsx
// Use absolute URL
<video poster="https://full-url.com/poster.jpg" />

// Or Next.js static
<video poster="/images/poster.jpg" />
```

---

## Video Compression Guide

### Recommended Settings

**For Web Videos**:
- **Resolution**: 1080p max (1920x1080), 720p for mobile
- **Codec**: H.264 (MP4)
- **Bitrate**: 2-5 Mbps for 1080p, 1-2 Mbps for 720p
- **Audio**: AAC, 128 kbps
- **Frame Rate**: 30 fps

### Using FFmpeg

```bash
# Compress video for web
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4

# Extract poster image (first frame)
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 poster.jpg
```

### Using Online Tools

- **CloudConvert**: https://cloudconvert.com/mp4-converter
- **HandBrake**: Free desktop app
- **Adobe Media Encoder**: Professional option

---

## File Size Guidelines

| Duration | Max File Size | Recommended |
|----------|---------------|-------------|
| 0-30 sec | 10 MB | 5 MB |
| 30-60 sec | 20 MB | 10 MB |
| 1-3 min | 50 MB | 30 MB |
| 3-5 min | 100 MB | 60 MB |
| 5+ min | Use HLS streaming | Use CDN |

**Rule of Thumb**: ~10-15 MB per minute for 720p

---

## Checklist Before Deploying Video

- [ ] Video compressed (H.264, <50MB)
- [ ] Poster image generated and optimized
- [ ] Preload attribute set correctly
- [ ] Tested on mobile device
- [ ] Tested on slow network (Fast 3G)
- [ ] Checked Lighthouse Performance score
- [ ] Verified video plays in Safari/iOS
- [ ] Added fallback for unsupported formats
- [ ] Configured proper cache headers
- [ ] Uploaded to Supabase Storage (not embedded in code)

---

## Need Help?

**Documentation**: `/docs/VIDEO-PERFORMANCE-OPTIMIZATION.md`
**Performance Issues**: Check `/lib/analytics/video-performance.ts`
**Utilities**: Check `/lib/utils/media-url.ts`
**Components**:
- `/components/cms-blocks/media/video-player.tsx`
- `/components/cms-blocks/media/progressive-video-player.tsx`

---

**Last Updated**: 2026-01-18
**Maintained By**: Development Team
**Version**: 1.0
