'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { buildAbsoluteUrl } from '@/lib/utils/site-url'

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface PreviewLink {
  id: string
  page_id: string
  token: string
  name: string | null
  expires_at: string | null
  password_hash: string | null
  is_active: boolean
  max_views: number | null
  view_count: number
  last_viewed_at: string | null
  allowed_emails: string[] | null
  created_by: string
  created_at: string | null
  updated_at: string | null
  page?: {
    title: string
    slug: string
    status: string
  }
}

/**
 * Generate a unique preview token
 */
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Get all preview links for a page
 */
export async function getPreviewLinks(pageId: string): Promise<PreviewLink[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_preview_links')
    .select(`
      *,
      page:cms_pages (
        title,
        slug,
        status
      )
    `)
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching preview links:', error)
    return []
  }

  return (data as unknown as PreviewLink[]) || []
}

/**
 * Get a preview link by ID
 */
export async function getPreviewLinkById(linkId: string): Promise<PreviewLink | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_preview_links')
    .select(`
      *,
      page:cms_pages (
        title,
        slug,
        status
      )
    `)
    .eq('id', linkId)
    .single()

  if (error) {
    console.error('Error fetching preview link:', error)
    return null
  }

  return data as unknown as PreviewLink
}

/**
 * Get a preview link by token (for public access)
 */
export async function getPreviewLinkByToken(token: string): Promise<{
  link: PreviewLink | null
  error: string | null
  requiresPassword: boolean
}> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_preview_links')
    .select(`
      *,
      page:cms_pages (
        id,
        title,
        slug,
        status,
        description,
        featured_image
      )
    `)
    .eq('token', token)
    .single()

  if (error || !data) {
    return { link: null, error: 'Preview link not found', requiresPassword: false }
  }

  const link = data as unknown as PreviewLink

  // Check if link is active
  if (!link.is_active) {
    return { link: null, error: 'This preview link has been deactivated', requiresPassword: false }
  }

  // Check expiration
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return { link: null, error: 'This preview link has expired', requiresPassword: false }
  }

  // Check view limit
  if (link.max_views && link.view_count >= link.max_views) {
    return { link: null, error: 'This preview link has reached its view limit', requiresPassword: false }
  }

  // Check if password protected
  if (link.password_hash) {
    return { link, error: null, requiresPassword: true }
  }

  return { link, error: null, requiresPassword: false }
}

/**
 * Verify preview link password
 */
export async function verifyPreviewPassword(
  token: string,
  password: string
): Promise<{ valid: boolean; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_preview_links')
    .select('password_hash')
    .eq('token', token)
    .single()

  if (error || !data || !data.password_hash) {
    return { valid: false, error: 'Preview link not found' }
  }

  const isValid = await bcrypt.compare(password, data.password_hash)
  return { valid: isValid, error: isValid ? null : 'Incorrect password' }
}

/**
 * Record a view for a preview link
 */
export async function recordPreviewView(token: string): Promise<void> {
  const supabase = await createServerSupabaseClient()

  // Get current view count
  const { data } = await supabase
    .from('cms_preview_links')
    .select('view_count')
    .eq('token', token)
    .single()

  if (data) {
    await supabase
      .from('cms_preview_links')
      .update({
        view_count: (data.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq('token', token)
  }
}

/**
 * Create a new preview link
 */
export async function createPreviewLink(
  pageId: string,
  options?: {
    name?: string
    expiresIn?: number // hours
    password?: string
    maxViews?: number
    allowedEmails?: string[]
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
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create preview links' }
  }

  // Verify page exists
  const { data: page } = await supabase
    .from('cms_pages')
    .select('id, title')
    .eq('id', pageId)
    .single()

  if (!page) {
    return { success: false, message: 'Page not found' }
  }

  // Generate token
  const token = generateToken()

  // Hash password if provided
  let passwordHash: string | null = null
  if (options?.password) {
    passwordHash = await bcrypt.hash(options.password, 10)
  }

  // Calculate expiration
  let expiresAt: string | null = null
  if (options?.expiresIn) {
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + options.expiresIn)
    expiresAt = expiry.toISOString()
  }

  // Create preview link
  const { data: link, error } = await supabase
    .from('cms_preview_links')
    .insert({
      page_id: pageId,
      token,
      name: options?.name || null,
      expires_at: expiresAt,
      password_hash: passwordHash,
      max_views: options?.maxViews || null,
      allowed_emails: options?.allowedEmails || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating preview link:', error)
    return { success: false, message: 'Failed to create preview link' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'preview_link',
    resourceId: link.id,
    metadata: { page_id: pageId, name: options?.name },
  })

  revalidatePath(`/admin/content/pages/${pageId}`)

  return {
    success: true,
    message: 'Preview link created successfully',
    data: { link, token },
  }
}

/**
 * Update a preview link
 */
export async function updatePreviewLink(
  linkId: string,
  updates: {
    name?: string
    is_active?: boolean
    expires_at?: string | null
    max_views?: number | null
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
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to update preview links' }
  }

  // Update link
  const { data: link, error } = await supabase
    .from('cms_preview_links')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', linkId)
    .select('page_id')
    .single()

  if (error) {
    console.error('Error updating preview link:', error)
    return { success: false, message: 'Failed to update preview link' }
  }

  revalidatePath(`/admin/content/pages/${link.page_id}`)

  return { success: true, message: 'Preview link updated successfully' }
}

/**
 * Delete a preview link
 */
export async function deletePreviewLink(linkId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete preview links' }
  }

  // Get link first to get page_id for revalidation
  const { data: link } = await supabase
    .from('cms_preview_links')
    .select('page_id')
    .eq('id', linkId)
    .single()

  // Delete link
  const { error } = await supabase
    .from('cms_preview_links')
    .delete()
    .eq('id', linkId)

  if (error) {
    console.error('Error deleting preview link:', error)
    return { success: false, message: 'Failed to delete preview link' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'preview_link',
    resourceId: linkId,
  })

  if (link) {
    revalidatePath(`/admin/content/pages/${link.page_id}`)
  }

  return { success: true, message: 'Preview link deleted successfully' }
}

/**
 * Get the preview URL for a token
 * Note: This is an async function to comply with Server Actions requirements,
 * but can be called from client components as well.
 */
export async function getPreviewUrl(token: string): Promise<string> {
  return buildAbsoluteUrl(`/preview/${token}`)
}
