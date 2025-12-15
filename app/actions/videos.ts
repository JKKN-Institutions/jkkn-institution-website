'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { extractYouTubeVideoId } from '@/lib/utils/youtube'

// Types
export interface EducationVideo {
  id: string
  youtube_url: string
  youtube_video_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  duration: string | null
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface YouTubeMetadata {
  title: string
  thumbnail_url: string
  author_name: string
  video_id: string
}

// Schema for video creation/update
const videoSchema = z.object({
  youtube_url: z.string().url('Invalid YouTube URL'),
  youtube_video_id: z.string().min(1, 'Video ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  thumbnail_url: z.string().url().optional(),
  duration: z.string().optional(),
  category: z.string().optional(),
  is_active: z.boolean().default(true),
})

/**
 * Fetch YouTube video metadata using oEmbed API
 */
export async function fetchYouTubeMetadata(url: string): Promise<YouTubeMetadata | null> {
  try {
    const videoId = extractYouTubeVideoId(url)
    if (!videoId) {
      return null
    }

    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const response = await fetch(oembedUrl)

    if (!response.ok) {
      console.error('Failed to fetch YouTube metadata:', response.statusText)
      return null
    }

    const data = await response.json()

    return {
      title: data.title || '',
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      author_name: data.author_name || '',
      video_id: videoId,
    }
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error)
    return null
  }
}

/**
 * Get all education videos (for admin)
 */
export async function getEducationVideos(): Promise<EducationVideo[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('education_videos')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching videos:', error)
    return []
  }

  return data || []
}

/**
 * Get active education videos (for public display)
 */
export async function getActiveEducationVideos(): Promise<EducationVideo[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('education_videos')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching active videos:', error)
    return []
  }

  return data || []
}

/**
 * Get a single video by ID
 */
export async function getEducationVideo(id: string): Promise<EducationVideo | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('education_videos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching video:', error)
    return null
  }

  return data
}

/**
 * Create a new education video
 */
export async function createEducationVideo(formData: FormData): Promise<{ success: boolean; error?: string; data?: EducationVideo }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const rawData = {
      youtube_url: formData.get('youtube_url') as string,
      youtube_video_id: formData.get('youtube_video_id') as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      thumbnail_url: (formData.get('thumbnail_url') as string) || undefined,
      duration: (formData.get('duration') as string) || undefined,
      category: (formData.get('category') as string) || undefined,
      is_active: formData.get('is_active') === 'true',
    }

    const validatedData = videoSchema.parse(rawData)

    // Get the next display order
    const { data: lastVideo } = await supabase
      .from('education_videos')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (lastVideo?.display_order || 0) + 1

    const { data, error } = await supabase
      .from('education_videos')
      .insert({
        ...validatedData,
        display_order: nextOrder,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating video:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/videos')
    revalidatePath('/')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to create video' }
  }
}

/**
 * Update an education video
 */
export async function updateEducationVideo(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const rawData = {
      youtube_url: formData.get('youtube_url') as string,
      youtube_video_id: formData.get('youtube_video_id') as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      thumbnail_url: (formData.get('thumbnail_url') as string) || undefined,
      duration: (formData.get('duration') as string) || undefined,
      category: (formData.get('category') as string) || undefined,
      is_active: formData.get('is_active') === 'true',
    }

    const validatedData = videoSchema.parse(rawData)

    const { error } = await supabase
      .from('education_videos')
      .update(validatedData)
      .eq('id', id)

    if (error) {
      console.error('Error updating video:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/videos')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to update video' }
  }
}

/**
 * Delete an education video
 */
export async function deleteEducationVideo(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('education_videos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting video:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/videos')
  revalidatePath('/')

  return { success: true }
}

/**
 * Toggle video active status
 */
export async function toggleVideoStatus(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('education_videos')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Error toggling video status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/videos')
  revalidatePath('/')

  return { success: true }
}

/**
 * Reorder videos
 */
export async function reorderVideos(videoIds: string[]): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Update each video's display_order
    for (let i = 0; i < videoIds.length; i++) {
      const { error } = await supabase
        .from('education_videos')
        .update({ display_order: i })
        .eq('id', videoIds[i])

      if (error) {
        console.error('Error reordering video:', error)
        return { success: false, error: error.message }
      }
    }

    revalidatePath('/admin/videos')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder videos' }
  }
}
