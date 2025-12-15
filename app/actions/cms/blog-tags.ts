'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Validation schemas
const CreateTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional().nullable(),
  color: z.string().max(7).optional().nullable(),
})

const UpdateTagSchema = CreateTagSchema.partial().extend({
  id: z.string().uuid('Invalid tag ID'),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  usage_count: number | null
  created_at: string | null
}

/**
 * Get all blog tags with optional filtering
 */
export async function getBlogTags(options?: {
  search?: string
  limit?: number
  orderBy?: 'name' | 'usage_count' | 'created_at'
  orderDirection?: 'asc' | 'desc'
}) {
  const supabase = await createServerSupabaseClient()
  const {
    search,
    limit,
    orderBy = 'name',
    orderDirection = 'asc',
  } = options || {}

  let query = supabase
    .from('blog_tags')
    .select('*')
    .order(orderBy, { ascending: orderDirection === 'asc' })

  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog tags:', error)
    throw new Error('Failed to fetch blog tags')
  }

  return data as BlogTag[]
}

/**
 * Get popular tags (by usage count)
 */
export async function getPopularBlogTags(limit: number = 10) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('usage_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching popular blog tags:', error)
    throw new Error('Failed to fetch popular blog tags')
  }

  return data as BlogTag[]
}

/**
 * Get a single blog tag by ID
 */
export async function getBlogTag(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog tag:', error)
    return null
  }

  return data as BlogTag
}

/**
 * Get a single blog tag by slug
 */
export async function getBlogTagBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching blog tag by slug:', error)
    return null
  }

  return data as BlogTag
}

/**
 * Search tags for autocomplete
 */
export async function searchBlogTags(query: string, limit: number = 10) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_tags')
    .select('id, name, slug, color')
    .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
    .order('usage_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching blog tags:', error)
    return []
  }

  return data
}

/**
 * Create a new blog tag
 */
export async function createBlogTag(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blog:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create blog tags' }
  }

  // Parse and validate data
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    color: formData.get('color') || null,
  }

  const validation = CreateTagSchema.safeParse(rawData)

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  // Check for duplicate slug
  const { data: existing } = await supabase
    .from('blog_tags')
    .select('id')
    .eq('slug', validation.data.slug)
    .single()

  if (existing) {
    return {
      success: false,
      message: 'A tag with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Create tag
  const { data, error } = await supabase
    .from('blog_tags')
    .insert([validation.data])
    .select()
    .single()

  if (error) {
    console.error('Error creating blog tag:', error)
    return { success: false, message: 'Failed to create tag' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms:blog',
    resourceType: 'blog_tag',
    resourceId: data.id,
    metadata: { name: data.name, slug: data.slug },
  })

  revalidatePath('/admin/content/blog/tags')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Tag created successfully',
    data,
  }
}

/**
 * Create a tag inline (for tag input component)
 */
export async function createBlogTagInline(name: string): Promise<BlogTag | null> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blog:create')
  if (!hasPermission) {
    return null
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Check for duplicate slug
  const { data: existing } = await supabase
    .from('blog_tags')
    .select('*')
    .eq('slug', slug)
    .single()

  if (existing) {
    return existing as BlogTag
  }

  // Create tag
  const { data, error } = await supabase
    .from('blog_tags')
    .insert([{ name, slug }])
    .select()
    .single()

  if (error) {
    console.error('Error creating blog tag inline:', error)
    return null
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms:blog',
    resourceType: 'blog_tag',
    resourceId: data.id,
    metadata: { name: data.name, slug: data.slug, inline: true },
  })

  revalidatePath('/admin/content/blog/tags')

  return data as BlogTag
}

/**
 * Update a blog tag
 */
export async function updateBlogTag(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blog:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit blog tags' }
  }

  // Parse and validate data
  const rawData = {
    id: formData.get('id'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    color: formData.get('color') || null,
  }

  const validation = UpdateTagSchema.safeParse(rawData)

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { id, ...updateData } = validation.data

  // Check for duplicate slug (excluding current tag)
  if (updateData.slug) {
    const { data: existing } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .single()

    if (existing) {
      return {
        success: false,
        message: 'A tag with this slug already exists',
        errors: { slug: ['Slug must be unique'] },
      }
    }
  }

  // Update tag
  const { data, error } = await supabase
    .from('blog_tags')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog tag:', error)
    return { success: false, message: 'Failed to update tag' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'cms:blog',
    resourceType: 'blog_tag',
    resourceId: id,
    metadata: { name: data.name, slug: data.slug },
  })

  revalidatePath('/admin/content/blog/tags')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Tag updated successfully',
    data,
  }
}

/**
 * Delete a blog tag
 */
export async function deleteBlogTag(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blog:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete blog tags' }
  }

  // Get tag info
  const { data: tag } = await supabase
    .from('blog_tags')
    .select('name, usage_count')
    .eq('id', id)
    .single()

  if (!tag) {
    return { success: false, message: 'Tag not found' }
  }

  // Note: Tag can be deleted even if it has posts (junction table will cascade)
  // But we might want to warn the user
  if (tag.usage_count && tag.usage_count > 0) {
    // Allow deletion but log it
    console.log(`Deleting tag "${tag.name}" with ${tag.usage_count} posts`)
  }

  // Delete tag (cascade will remove from blog_post_tags)
  const { error } = await supabase.from('blog_tags').delete().eq('id', id)

  if (error) {
    console.error('Error deleting blog tag:', error)
    return { success: false, message: 'Failed to delete tag' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms:blog',
    resourceType: 'blog_tag',
    resourceId: id,
    metadata: { name: tag.name, usage_count: tag.usage_count },
  })

  revalidatePath('/admin/content/blog/tags')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Tag deleted successfully',
  }
}

/**
 * Bulk delete tags
 */
export async function bulkDeleteBlogTags(ids: string[]): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blog:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete blog tags' }
  }

  if (!ids.length) {
    return { success: false, message: 'No tags selected' }
  }

  // Delete tags
  const { error } = await supabase.from('blog_tags').delete().in('id', ids)

  if (error) {
    console.error('Error bulk deleting blog tags:', error)
    return { success: false, message: 'Failed to delete tags' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_delete',
    module: 'cms:blog',
    resourceType: 'blog_tags',
    metadata: { count: ids.length, ids },
  })

  revalidatePath('/admin/content/blog/tags')
  revalidatePath('/blog')

  return {
    success: true,
    message: `${ids.length} tag(s) deleted successfully`,
  }
}

/**
 * Merge tags (combine multiple tags into one)
 */
export async function mergeBlogTags(
  sourceIds: string[],
  targetId: string
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blog:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to merge tags' }
  }

  if (!sourceIds.length || sourceIds.includes(targetId)) {
    return { success: false, message: 'Invalid tag selection' }
  }

  // Get target tag info
  const { data: targetTag } = await supabase
    .from('blog_tags')
    .select('name')
    .eq('id', targetId)
    .single()

  if (!targetTag) {
    return { success: false, message: 'Target tag not found' }
  }

  // Update all posts with source tags to use target tag
  // First, get posts that have source tags but not target tag
  const { data: postsToUpdate } = await supabase
    .from('blog_post_tags')
    .select('post_id')
    .in('tag_id', sourceIds)

  if (postsToUpdate && postsToUpdate.length > 0) {
    const postIds = [...new Set(postsToUpdate.map((p) => p.post_id))]

    // Add target tag to posts (ignore duplicates)
    const inserts = postIds.map((post_id) => ({ post_id, tag_id: targetId }))

    await supabase.from('blog_post_tags').upsert(inserts, { ignoreDuplicates: true })
  }

  // Delete source tags (cascade will remove from junction table)
  const { error: deleteError } = await supabase
    .from('blog_tags')
    .delete()
    .in('id', sourceIds)

  if (deleteError) {
    console.error('Error merging blog tags:', deleteError)
    return { success: false, message: 'Failed to merge tags' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'merge',
    module: 'cms:blog',
    resourceType: 'blog_tags',
    resourceId: targetId,
    metadata: { sourceCount: sourceIds.length, targetName: targetTag.name },
  })

  revalidatePath('/admin/content/blog/tags')
  revalidatePath('/blog')

  return {
    success: true,
    message: `${sourceIds.length} tag(s) merged into "${targetTag.name}"`,
  }
}
