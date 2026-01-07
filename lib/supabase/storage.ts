import { createClient } from './client'

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  MEDIA: 'media',
  PREVIEWS: 'previews',
  RESUMES: 'resumes',
} as const

/**
 * Allowed image types for avatar uploads
 */
export const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

/**
 * Maximum file size for avatars (5MB)
 */
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024

/**
 * Validate a file for avatar upload
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.',
    }
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5MB.',
    }
  }

  return { valid: true }
}

/**
 * Upload an avatar image to Supabase Storage
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient()

  // Validate file
  const validation = validateAvatarFile(file)
  if (!validation.valid) {
    return { url: null, error: validation.error || 'Invalid file' }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const filePath = `${userId}/${timestamp}.${fileExt}`

  // Delete existing avatars for this user
  const { data: existingFiles } = await supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .list(userId)

  if (existingFiles && existingFiles.length > 0) {
    const filesToDelete = existingFiles.map((f) => `${userId}/${f.name}`)
    await supabase.storage.from(STORAGE_BUCKETS.AVATARS).remove(filesToDelete)
  }

  // Upload new avatar
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    console.error('Avatar upload error:', uploadError)
    return { url: null, error: 'Failed to upload image. Please try again.' }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.AVATARS).getPublicUrl(filePath)

  return { url: publicUrl, error: null }
}

/**
 * Delete a user's avatar
 */
export async function deleteAvatar(
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient()

  // List all files in user's folder
  const { data: existingFiles, error: listError } = await supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .list(userId)

  if (listError) {
    console.error('Error listing avatars:', listError)
    return { success: false, error: 'Failed to delete avatar' }
  }

  if (!existingFiles || existingFiles.length === 0) {
    return { success: true, error: null }
  }

  // Delete all files
  const filesToDelete = existingFiles.map((f) => `${userId}/${f.name}`)
  const { error: deleteError } = await supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .remove(filesToDelete)

  if (deleteError) {
    console.error('Error deleting avatars:', deleteError)
    return { success: false, error: 'Failed to delete avatar' }
  }

  return { success: true, error: null }
}

/**
 * Get public URL for a storage file
 */
export function getStorageUrl(bucket: string, path: string): string {
  const supabase = createClient()
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}

/**
 * Upload a component preview image to Supabase Storage
 * Supports multi-viewport previews (desktop, tablet, mobile)
 */
export async function uploadComponentPreview(
  componentId: string,
  blob: Blob,
  viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient()

  // Generate filename with viewport suffix
  const fileName = `${componentId}-${viewport}.png`
  const filePath = `components/${fileName}`

  // Delete existing preview for this specific viewport
  await supabase.storage.from(STORAGE_BUCKETS.PREVIEWS).remove([filePath])

  // Upload new preview
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.PREVIEWS)
    .upload(filePath, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/png',
    })

  if (uploadError) {
    console.error(`Preview upload error (${viewport}):`, uploadError)
    return { url: null, error: `Failed to upload ${viewport} preview. Please try again.` }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.PREVIEWS).getPublicUrl(filePath)

  return { url: publicUrl, error: null }
}

/**
 * Allowed MIME type for resumes
 */
export const ALLOWED_RESUME_TYPE = 'application/pdf'

/**
 * Maximum file size for resumes (10MB)
 */
export const MAX_RESUME_SIZE = 10 * 1024 * 1024

/**
 * Validate a file for resume upload
 */
export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  if (file.type !== ALLOWED_RESUME_TYPE) {
    return {
      valid: false,
      error: 'Only PDF files are allowed.',
    }
  }

  if (file.size > MAX_RESUME_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 10MB.',
    }
  }

  return { valid: true }
}

/**
 * Upload a resume file to Supabase Storage
 */
export async function uploadResume(
  jobId: string,
  file: File
): Promise<{ path: string | null; error: string | null }> {
  const supabase = createClient()

  // Validate file
  const validation = validateResumeFile(file)
  if (!validation.valid) {
    return { path: null, error: validation.error || 'Invalid file' }
  }

  // Generate unique filename
  const timestamp = Date.now()
  const uuid = crypto.randomUUID().slice(0, 8)
  const fileName = `${timestamp}_${uuid}.pdf`
  const filePath = `${jobId}/${fileName}`

  // Upload to storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.RESUMES)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Resume upload error:', error)
    return { path: null, error: 'Failed to upload file.' }
  }

  return { path: data.path, error: null }
}

/**
 * Delete a resume file from storage
 */
export async function deleteResume(filePath: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.RESUMES)
    .remove([filePath])

  if (error) {
    console.error('Error deleting resume:', error)
    return false
  }

  return true
}

/**
 * Get signed URL for a resume file (for admin viewing)
 */
export async function getResumeSignedUrl(
  filePath: string,
  expiresIn = 3600
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.RESUMES)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error('Error getting signed URL:', error)
    return { url: null, error: 'Failed to generate download link' }
  }

  return { url: data.signedUrl, error: null }
}
