'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Validation schemas
const UploadMediaSchema = z.object({
  file_name: z.string().min(1, 'File name is required'),
  original_name: z.string().min(1, 'Original name is required'),
  file_path: z.string().min(1, 'File path is required'),
  file_url: z.string().url('Invalid file URL'),
  file_type: z.string().min(1, 'File type is required'),
  mime_type: z.string().min(1, 'MIME type is required'),
  file_size: z.number().positive('File size must be positive'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  alt_text: z.string().optional(),
  caption: z.string().optional(),
  folder: z.string().default('general'),
  tags: z.array(z.string()).default([]),
})

const UpdateMediaSchema = z.object({
  id: z.string().uuid('Invalid media ID'),
  alt_text: z.string().optional(),
  caption: z.string().optional(),
  folder: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface MediaItem {
  id: string
  file_name: string
  original_name: string
  file_path: string
  file_url: string
  file_type: string
  mime_type: string
  file_size: number
  width: number | null
  height: number | null
  alt_text: string | null
  caption: string | null
  folder: string | null
  tags: string[] | null
  metadata: Record<string, unknown> | null
  uploaded_by: string
  created_at: string | null
  updated_at: string | null
  uploader?: {
    full_name: string | null
    email: string
  }
}

export interface MediaLibraryResult {
  items: MediaItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Get media library with pagination and filtering
 */
export async function getMediaLibrary(options?: {
  page?: number
  limit?: number
  file_type?: string
  folder?: string
  search?: string
  tags?: string[]
}): Promise<MediaLibraryResult> {
  const supabase = await createServerSupabaseClient()
  const { page = 1, limit = 24, file_type, folder, search, tags } = options || {}

  let query = supabase
    .from('cms_media_library')
    .select(
      `*`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })

  // Apply filters
  if (file_type) {
    query = query.eq('file_type', file_type)
  }

  if (folder) {
    query = query.eq('folder', folder)
  }

  if (search) {
    query = query.or(
      `original_name.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`
    )
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching media library:', error)
    throw new Error('Failed to fetch media library')
  }

  return {
    items: (data as unknown as MediaItem[]) || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get a single media item by ID
 */
export async function getMediaById(mediaId: string): Promise<MediaItem | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_media_library')
    .select(`*`)
    .eq('id', mediaId)
    .single()

  if (error) {
    console.error('Error fetching media item:', error)
    return null
  }

  return data as unknown as MediaItem
}

/**
 * Upload a media file (metadata only - actual file uploaded via client)
 */
export async function uploadMedia(
  metadata: {
    file_name: string
    original_name: string
    file_path: string
    file_url: string
    file_type: string
    mime_type: string
    file_size: number
    width?: number
    height?: number
    alt_text?: string
    caption?: string
    folder?: string
    tags?: string[]
  }
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:upload')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to upload media' }
  }

  // Validate
  const validation = UploadMediaSchema.safeParse(metadata)
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid media data',
    }
  }

  // Insert media record
  const { data, error } = await supabase
    .from('cms_media_library')
    .insert({
      ...validation.data,
      uploaded_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error uploading media:', error)
    return { success: false, message: 'Failed to save media. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'upload',
    module: 'cms',
    resourceType: 'media',
    resourceId: data.id,
    metadata: { file_name: validation.data.original_name, file_type: validation.data.file_type },
  })

  revalidatePath('/admin/content/media')

  return { success: true, message: 'Media uploaded successfully', data: { id: data.id } }
}

/**
 * Upload multiple media files (batch)
 */
export async function uploadMediaBatch(
  items: Array<{
    file_name: string
    original_name: string
    file_path: string
    file_url: string
    file_type: string
    mime_type: string
    file_size: number
    width?: number
    height?: number
    folder?: string
  }>
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:upload')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to upload media' }
  }

  // Insert all media records
  const recordsToInsert = items.map((item) => ({
    ...item,
    uploaded_by: user.id,
    tags: [],
  }))

  const { data, error } = await supabase
    .from('cms_media_library')
    .insert(recordsToInsert)
    .select()

  if (error) {
    console.error('Error uploading media batch:', error)
    return { success: false, message: 'Failed to save media. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'upload_batch',
    module: 'cms',
    resourceType: 'media',
    metadata: { count: items.length },
  })

  revalidatePath('/admin/content/media')

  return {
    success: true,
    message: `${items.length} files uploaded successfully`,
    data: { ids: data.map((d) => d.id) },
  }
}

/**
 * Update media metadata
 */
export async function updateMediaMeta(
  mediaId: string,
  updates: {
    alt_text?: string
    caption?: string
    folder?: string
    tags?: string[]
  }
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit media' }
  }

  // Validate
  const validation = UpdateMediaSchema.safeParse({ id: mediaId, ...updates })
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid media data',
    }
  }

  // Update media
  const { error } = await supabase
    .from('cms_media_library')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mediaId)

  if (error) {
    console.error('Error updating media:', error)
    return { success: false, message: 'Failed to update media. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'cms',
    resourceType: 'media',
    resourceId: mediaId,
    metadata: { updates: Object.keys(updates) },
  })

  revalidatePath('/admin/content/media')

  return { success: true, message: 'Media updated successfully' }
}

/**
 * Delete a media file
 */
export async function deleteMedia(mediaId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete media' }
  }

  // Get media info for storage deletion
  const { data: media } = await supabase
    .from('cms_media_library')
    .select('file_path, original_name')
    .eq('id', mediaId)
    .single()

  if (!media) {
    return { success: false, message: 'Media not found' }
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('cms-media')
    .remove([media.file_path])

  if (storageError) {
    console.error('Error deleting from storage:', storageError)
    // Continue to delete the database record even if storage fails
  }

  // Delete database record
  const { error } = await supabase.from('cms_media_library').delete().eq('id', mediaId)

  if (error) {
    console.error('Error deleting media:', error)
    return { success: false, message: 'Failed to delete media. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'media',
    resourceId: mediaId,
    metadata: { file_name: media.original_name },
  })

  revalidatePath('/admin/content/media')

  return { success: true, message: 'Media deleted successfully' }
}

/**
 * Delete multiple media files (batch)
 */
export async function deleteMediaBatch(mediaIds: string[]): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete media' }
  }

  // Get media info for storage deletion
  const { data: mediaItems } = await supabase
    .from('cms_media_library')
    .select('file_path')
    .in('id', mediaIds)

  if (mediaItems && mediaItems.length > 0) {
    // Delete from storage
    const filePaths = mediaItems.map((m) => m.file_path)
    await supabase.storage.from('cms-media').remove(filePaths)
  }

  // Delete database records
  const { error } = await supabase.from('cms_media_library').delete().in('id', mediaIds)

  if (error) {
    console.error('Error deleting media batch:', error)
    return { success: false, message: 'Failed to delete media. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete_batch',
    module: 'cms',
    resourceType: 'media',
    metadata: { count: mediaIds.length },
  })

  revalidatePath('/admin/content/media')

  return { success: true, message: `${mediaIds.length} files deleted successfully` }
}

/**
 * Get media usage (which pages use this media)
 */
export async function getMediaUsage(
  mediaId: string
): Promise<{ pages: Array<{ id: string; title: string; slug: string }> }> {
  const supabase = await createServerSupabaseClient()

  // Get media URL
  const { data: media } = await supabase
    .from('cms_media_library')
    .select('file_url')
    .eq('id', mediaId)
    .single()

  if (!media) {
    return { pages: [] }
  }

  // Search for pages that reference this media URL in their blocks
  const { data: blocks } = await supabase
    .from('cms_page_blocks')
    .select(
      `
      page_id,
      cms_pages!inner (
        id,
        title,
        slug
      )
    `
    )
    .filter('props', 'cs', `{"src":"${media.file_url}"}`)

  if (!blocks || blocks.length === 0) {
    // Also check for image references in other prop fields
    const { data: allBlocks } = await supabase
      .from('cms_page_blocks')
      .select(
        `
        page_id,
        props,
        cms_pages!inner (
          id,
          title,
          slug
        )
      `
      )

    const matchingPages = new Map<
      string,
      { id: string; title: string; slug: string }
    >()

    allBlocks?.forEach((block) => {
      const propsString = JSON.stringify(block.props)
      if (propsString.includes(media.file_url)) {
        const pageData = block.cms_pages as unknown as { id: string; title: string; slug: string }
        if (pageData && pageData.id) {
          matchingPages.set(pageData.id, pageData)
        }
      }
    })

    return { pages: Array.from(matchingPages.values()) }
  }

  // Deduplicate pages
  const uniquePages = new Map<string, { id: string; title: string; slug: string }>()
  blocks.forEach((block) => {
    const pageData = block.cms_pages as unknown as { id: string; title: string; slug: string }
    if (pageData && pageData.id) {
      uniquePages.set(pageData.id, pageData)
    }
  })

  return { pages: Array.from(uniquePages.values()) }
}

/**
 * Get all folders in the media library
 */
export async function getMediaFolders(): Promise<string[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_media_library')
    .select('folder')
    .not('folder', 'is', null)

  if (error) {
    console.error('Error fetching folders:', error)
    return ['general']
  }

  const folders = new Set<string>(['general'])
  data?.forEach((item) => {
    if (item.folder) {
      folders.add(item.folder)
    }
  })

  return Array.from(folders).sort()
}

/**
 * Move media to a different folder
 */
export async function moveMediaToFolder(
  mediaIds: string[],
  folder: string
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to move media' }
  }

  // Update folder for all media
  const { error } = await supabase
    .from('cms_media_library')
    .update({
      folder,
      updated_at: new Date().toISOString(),
    })
    .in('id', mediaIds)

  if (error) {
    console.error('Error moving media:', error)
    return { success: false, message: 'Failed to move media. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'move',
    module: 'cms',
    resourceType: 'media',
    metadata: { count: mediaIds.length, folder },
  })

  revalidatePath('/admin/content/media')

  return { success: true, message: `${mediaIds.length} files moved to ${folder}` }
}

/**
 * Create a new folder (virtual - folders are derived from media items)
 * This updates all items with an empty folder to move them to the new folder
 */
export async function createFolder(folderName: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage folders' }
  }

  // Validate folder name
  if (!folderName || folderName.trim().length === 0) {
    return { success: false, message: 'Folder name is required' }
  }

  const sanitizedName = folderName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')

  // Check if folder already exists
  const existingFolders = await getMediaFolders()
  if (existingFolders.includes(sanitizedName)) {
    return { success: false, message: 'A folder with this name already exists' }
  }

  // Log activity (folder creation is virtual - no DB changes needed)
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'folder',
    metadata: { folder: sanitizedName },
  })

  revalidatePath('/admin/content/media')

  return { success: true, message: 'Folder created successfully', data: { folder: sanitizedName } }
}

/**
 * Rename a folder (updates all media items in that folder)
 */
export async function renameFolder(
  oldName: string,
  newName: string
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage folders' }
  }

  // Validate names
  if (!oldName || !newName) {
    return { success: false, message: 'Folder names are required' }
  }

  if (oldName === 'general') {
    return { success: false, message: 'Cannot rename the general folder' }
  }

  const sanitizedNewName = newName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')

  // Check if new folder name already exists
  const existingFolders = await getMediaFolders()
  if (existingFolders.includes(sanitizedNewName) && sanitizedNewName !== oldName) {
    return { success: false, message: 'A folder with this name already exists' }
  }

  // Update all media items in the old folder
  const { error, count } = await supabase
    .from('cms_media_library')
    .update({
      folder: sanitizedNewName,
      updated_at: new Date().toISOString(),
    })
    .eq('folder', oldName)

  if (error) {
    console.error('Error renaming folder:', error)
    return { success: false, message: 'Failed to rename folder. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'rename',
    module: 'cms',
    resourceType: 'folder',
    metadata: { oldName, newName: sanitizedNewName, itemsUpdated: count },
  })

  revalidatePath('/admin/content/media')

  return { success: true, message: 'Folder renamed successfully' }
}

/**
 * Delete a folder (moves all items to general folder)
 */
export async function deleteFolder(
  folderName: string,
  moveToGeneral: boolean = true
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:media:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage folders' }
  }

  if (folderName === 'general') {
    return { success: false, message: 'Cannot delete the general folder' }
  }

  if (moveToGeneral) {
    // Move all files to general folder
    const { error, count } = await supabase
      .from('cms_media_library')
      .update({
        folder: 'general',
        updated_at: new Date().toISOString(),
      })
      .eq('folder', folderName)

    if (error) {
      console.error('Error deleting folder:', error)
      return { success: false, message: 'Failed to delete folder. Please try again.' }
    }

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'delete',
      module: 'cms',
      resourceType: 'folder',
      metadata: { folder: folderName, itemsMovedToGeneral: count },
    })
  }

  revalidatePath('/admin/content/media')

  return { success: true, message: 'Folder deleted successfully' }
}

/**
 * Get folder statistics (file count per folder)
 */
export async function getFolderStats(): Promise<Record<string, number>> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_media_library')
    .select('folder')

  if (error) {
    console.error('Error fetching folder stats:', error)
    return { general: 0 }
  }

  const stats: Record<string, number> = { general: 0 }
  data?.forEach((item) => {
    const folder = item.folder || 'general'
    stats[folder] = (stats[folder] || 0) + 1
  })

  return stats
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats(): Promise<{
  totalFiles: number
  totalSize: number
  byType: Record<string, { count: number; size: number }>
}> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_media_library')
    .select('file_type, file_size')

  if (error) {
    console.error('Error fetching storage stats:', error)
    return { totalFiles: 0, totalSize: 0, byType: {} }
  }

  const stats = {
    totalFiles: data?.length || 0,
    totalSize: 0,
    byType: {} as Record<string, { count: number; size: number }>,
  }

  data?.forEach((item) => {
    stats.totalSize += item.file_size

    if (!stats.byType[item.file_type]) {
      stats.byType[item.file_type] = { count: 0, size: 0 }
    }
    stats.byType[item.file_type].count++
    stats.byType[item.file_type].size += item.file_size
  })

  return stats
}
