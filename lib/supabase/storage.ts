import { createClient } from './client'

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  MEDIA: 'media',
  PREVIEWS: 'previews',
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
 */
export async function uploadComponentPreview(
  componentId: string,
  blob: Blob
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient()

  // Generate filename
  const timestamp = Date.now()
  const filePath = `components/${componentId}/${timestamp}.png`

  // Delete existing previews for this component
  const { data: existingFiles } = await supabase.storage
    .from(STORAGE_BUCKETS.PREVIEWS)
    .list(`components/${componentId}`)

  if (existingFiles && existingFiles.length > 0) {
    const filesToDelete = existingFiles.map((f) => `components/${componentId}/${f.name}`)
    await supabase.storage.from(STORAGE_BUCKETS.PREVIEWS).remove(filesToDelete)
  }

  // Upload new preview
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.PREVIEWS)
    .upload(filePath, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/png',
    })

  if (uploadError) {
    console.error('Preview upload error:', uploadError)
    return { url: null, error: 'Failed to upload preview. Please try again.' }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.PREVIEWS).getPublicUrl(filePath)

  return { url: publicUrl, error: null }
}
