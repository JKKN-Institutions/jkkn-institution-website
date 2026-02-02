'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface UploadCourseImageResult {
  success: boolean
  imageUrl?: string
  imagePath?: string
  error?: string
}

/**
 * Upload a course-related image to Supabase Storage
 * Supports: hero images, faculty photos, facility images, lab images, recruiter logos
 */
export async function uploadCourseImage(
  formData: FormData,
  options?: {
    folder?: string // e.g., 'courses/be-cse/faculty', 'courses/me-cse/labs'
    maxSizeMB?: number
    allowedTypes?: string[]
  }
): Promise<UploadCourseImageResult> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    const allowedTypes = options?.allowedTypes || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      }
    }

    // Validate file size (default 10MB)
    const maxSizeBytes = (options?.maxSizeMB || 10) * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `File too large. Maximum size: ${options?.maxSizeMB || 10}MB`,
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExt = file.name.split('.').pop()
    const folder = options?.folder || 'courses/general'
    const fileName = `${timestamp}-${randomString}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage (media bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' }
    }

    // Track in cms_media_library
    const { error: mediaLibraryError } = await supabase
      .from('cms_media_library')
      .insert({
        file_name: fileName,
        original_name: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_type: 'image',
        mime_type: file.type,
        file_size: file.size,
        folder: folder.split('/')[0], // Store top-level folder only
        tags: ['course', folder.split('/')[1] || 'general'],
        uploaded_by: user.id,
      })

    if (mediaLibraryError) {
      console.error('Media library tracking error:', mediaLibraryError)
      // Don't fail the operation if tracking fails
    }

    return {
      success: true,
      imageUrl: urlData.publicUrl,
      imagePath: filePath,
    }
  } catch (error) {
    console.error('Error in uploadCourseImage:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Delete a course image from Supabase Storage
 */
export async function deleteCourseImage(
  imagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('media')
      .remove([imagePath])

    if (deleteError) {
      console.error('Storage delete error:', deleteError)
      return { success: false, error: deleteError.message }
    }

    // Remove from media library
    const { error: mediaLibraryError } = await supabase
      .from('cms_media_library')
      .delete()
      .eq('file_path', imagePath)

    if (mediaLibraryError) {
      console.error('Media library delete error:', mediaLibraryError)
      // Don't fail if tracking removal fails
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteCourseImage:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get course images by folder
 */
export async function getCourseImages(
  folder: string
): Promise<{ success: boolean; images?: Array<{ url: string; path: string; name: string }>; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: files, error } = await supabase.storage
      .from('media')
      .list(folder, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('Error listing course images:', error)
      return { success: false, error: error.message }
    }

    const images = files.map(file => {
      const filePath = `${folder}/${file.name}`
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath)

      return {
        url: urlData.publicUrl,
        path: filePath,
        name: file.name,
      }
    })

    return { success: true, images }
  } catch (error) {
    console.error('Error in getCourseImages:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
