'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  EducationVideo,
  fetchYouTubeMetadata,
  createEducationVideo,
  updateEducationVideo,
} from '@/app/actions/videos'
import { extractYouTubeVideoId } from '@/lib/utils/youtube'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, Youtube, Video, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface VideoFormProps {
  video?: EducationVideo
  mode: 'create' | 'edit'
}

export function VideoForm({ video, mode }: VideoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Form state
  const [youtubeUrl, setYoutubeUrl] = useState(video?.youtube_url || '')
  const [videoId, setVideoId] = useState(video?.youtube_video_id || '')
  const [title, setTitle] = useState(video?.title || '')
  const [description, setDescription] = useState(video?.description || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnail_url || '')
  const [duration, setDuration] = useState(video?.duration || '')
  const [category, setCategory] = useState(video?.category || '')
  const [isActive, setIsActive] = useState(video?.is_active ?? true)

  // Auto-fetch metadata when URL changes
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!youtubeUrl) {
        setFetchStatus('idle')
        return
      }

      const extractedId = extractYouTubeVideoId(youtubeUrl)
      if (!extractedId) {
        setFetchStatus('error')
        return
      }

      setIsFetching(true)
      setFetchStatus('idle')

      const metadata = await fetchYouTubeMetadata(youtubeUrl)

      if (metadata) {
        setVideoId(metadata.video_id)
        if (!title || mode === 'create') {
          setTitle(metadata.title)
        }
        setThumbnailUrl(metadata.thumbnail_url)
        setFetchStatus('success')
      } else {
        setFetchStatus('error')
      }

      setIsFetching(false)
    }

    // Debounce the fetch
    const timer = setTimeout(fetchMetadata, 500)
    return () => clearTimeout(timer)
  }, [youtubeUrl, mode, title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!youtubeUrl || !videoId || !title) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('youtube_url', youtubeUrl)
    formData.append('youtube_video_id', videoId)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('thumbnail_url', thumbnailUrl)
    formData.append('duration', duration)
    formData.append('category', category)
    formData.append('is_active', String(isActive))

    let result
    if (mode === 'create') {
      result = await createEducationVideo(formData)
    } else if (video) {
      result = await updateEducationVideo(video.id, formData)
    }

    setIsLoading(false)

    if (result?.success) {
      toast.success(mode === 'create' ? 'Video added successfully' : 'Video updated successfully')
      router.push('/admin/videos')
      router.refresh()
    } else {
      toast.error(result?.error || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* YouTube URL Input */}
      <div className="space-y-2">
        <Label htmlFor="youtube_url" className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          YouTube URL *
        </Label>
        <div className="relative">
          <Input
            id="youtube_url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="pr-10"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isFetching && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            {!isFetching && fetchStatus === 'success' && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {!isFetching && fetchStatus === 'error' && (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste a YouTube video URL. Metadata will be auto-fetched.
        </p>
      </div>

      {/* Thumbnail Preview */}
      {thumbnailUrl && (
        <div className="space-y-2">
          <Label>Thumbnail Preview</Label>
          <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={thumbnailUrl}
              alt="Video thumbnail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Auto-fetched from YouTube. You can edit if needed.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Video description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Category & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g., Lectures, Events, Tours"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g., 01:24:50"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
        <div className="space-y-0.5">
          <Label htmlFor="is_active">Active</Label>
          <p className="text-sm text-muted-foreground">
            Show this video on the homepage
          </p>
        </div>
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="youtube_video_id" value={videoId} />
      <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !videoId}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {mode === 'create' ? 'Add Video' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
