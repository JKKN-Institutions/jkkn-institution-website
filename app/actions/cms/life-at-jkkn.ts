'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'
import { getBlogCategories, type BlogCategory, type CategoryType } from './blog-categories'

// ============================================================================
// Types
// ============================================================================

export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface LifeAtJKKNItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  category_id: string | null
  status: 'draft' | 'published'
  icon: string | null
  link: string | null
  video: string | null
  sort_order: number
  created_at: string | null
  updated_at: string | null
  category?: {
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
  } | null
}

// ============================================================================
// Validation Schemas
// ============================================================================

const CreateLifeAtJKKNItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().max(500, 'Description is too long').optional().nullable(),
  featured_image: z.string().url().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  icon: z.string().max(50).optional().nullable(),
  link: z.string().url().optional().nullable().or(z.literal('')),
  video: z.string().url().optional().nullable().or(z.literal('')),
  sort_order: z.coerce.number().min(0).default(0),
})

const UpdateLifeAtJKKNItemSchema = CreateLifeAtJKKNItemSchema.partial().extend({
  id: z.string().uuid('Invalid item ID'),
})

// ============================================================================
// Category Functions (Life@JKKN specific)
// ============================================================================

/**
 * Get Life@JKKN categories only
 */
export async function getLifeAtJKKNCategories(options?: {
  includeInactive?: boolean
}) {
  return getBlogCategories({
    ...options,
    categoryType: 'life_at_jkkn',
  })
}

// ============================================================================
// Item CRUD Functions
// ============================================================================

/**
 * Get all Life@JKKN items with pagination and filtering
 */
export async function getLifeAtJKKNItems(options?: {
  page?: number
  limit?: number
  status?: 'draft' | 'published'
  category_id?: string
  search?: string
}) {
  const supabase = await createServerSupabaseClient()
  const {
    page = 1,
    limit = 20,
    status,
    category_id,
    search,
  } = options || {}

  const offset = (page - 1) * limit

  // First, get all Life@JKKN category IDs
  const lifeAtJKKNCategories = await getLifeAtJKKNCategories({ includeInactive: true })
  const categoryIds = lifeAtJKKNCategories.map(c => c.id)

  // If no Life@JKKN categories exist, return empty result
  if (categoryIds.length === 0) {
    return {
      data: [] as LifeAtJKKNItem[],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  let query = supabase
    .from('blog_posts')
    .select(
      `
      id, title, slug, excerpt, featured_image, category_id, status,
      created_at, updated_at,
      metadata,
      category:blog_categories!category_id (
        id, name, slug, color, icon
      )
    `,
      { count: 'exact' }
    )
    .in('category_id', categoryIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  if (category_id) {
    query = query.eq('category_id', category_id)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching Life@JKKN items:', error)
    throw new Error('Failed to fetch Life@JKKN items')
  }

  // Map to LifeAtJKKNItem format (extract icon, link, video from metadata)
  const items: LifeAtJKKNItem[] = (data || []).map((item) => {
    const metadata = (item.metadata as Record<string, unknown>) || {}
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      featured_image: item.featured_image,
      category_id: item.category_id,
      status: item.status as 'draft' | 'published',
      icon: (metadata.icon as string) || null,
      link: (metadata.link as string) || null,
      video: (metadata.video as string) || null,
      sort_order: (metadata.sort_order as number) || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
      category: Array.isArray(item.category)
        ? (item.category[0] as LifeAtJKKNItem['category'])
        : (item.category as LifeAtJKKNItem['category']),
    }
  })

  return {
    data: items,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get a single Life@JKKN item by ID
 */
export async function getLifeAtJKKNItem(id: string): Promise<LifeAtJKKNItem | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      id, title, slug, excerpt, featured_image, category_id, status,
      created_at, updated_at,
      metadata,
      category:blog_categories!category_id (
        id, name, slug, color, icon
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching Life@JKKN item:', error)
    return null
  }

  const metadata = (data.metadata as Record<string, unknown>) || {}
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    featured_image: data.featured_image,
    category_id: data.category_id,
    status: data.status as 'draft' | 'published',
    icon: (metadata.icon as string) || null,
    link: (metadata.link as string) || null,
    video: (metadata.video as string) || null,
    sort_order: (metadata.sort_order as number) || 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
    category: Array.isArray(data.category)
      ? (data.category[0] as LifeAtJKKNItem['category'])
      : (data.category as LifeAtJKKNItem['category']),
  }
}

/**
 * Get published Life@JKKN items for public display
 */
export async function getPublishedLifeAtJKKNItems(options?: {
  limit?: number
  category_slug?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { limit = 6, category_slug } = options || {}

  // Get Life@JKKN category IDs
  const lifeAtJKKNCategories = await getLifeAtJKKNCategories()
  const categoryIds = lifeAtJKKNCategories.map(c => c.id)

  if (categoryIds.length === 0) {
    return { data: [] as LifeAtJKKNItem[], total: 0 }
  }

  let query = supabase
    .from('blog_posts')
    .select(
      `
      id, title, slug, excerpt, featured_image, category_id, status,
      created_at, updated_at,
      metadata,
      category:blog_categories!category_id (
        id, name, slug, color, icon
      )
    `,
      { count: 'exact' }
    )
    .in('category_id', categoryIds)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit)

  // Filter by specific category slug if provided
  if (category_slug) {
    const category = lifeAtJKKNCategories.find(c => c.slug === category_slug)
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching published Life@JKKN items:', error)
    return { data: [] as LifeAtJKKNItem[], total: 0 }
  }

  const items: LifeAtJKKNItem[] = (data || []).map((item) => {
    const metadata = (item.metadata as Record<string, unknown>) || {}
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      featured_image: item.featured_image,
      category_id: item.category_id,
      status: item.status as 'draft' | 'published',
      icon: (metadata.icon as string) || null,
      link: (metadata.link as string) || null,
      video: (metadata.video as string) || null,
      sort_order: (metadata.sort_order as number) || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
      category: Array.isArray(item.category)
        ? (item.category[0] as LifeAtJKKNItem['category'])
        : (item.category as LifeAtJKKNItem['category']),
    }
  })

  return { data: items, total: count || 0 }
}

/**
 * Create a new Life@JKKN item
 */
export async function createLifeAtJKKNItem(
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
    return { success: false, message: 'You do not have permission to create Life@JKKN items' }
  }

  // Parse and validate data
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt') || null,
    featured_image: formData.get('featured_image') || null,
    category_id: formData.get('category_id') || null,
    status: formData.get('status') || 'draft',
    icon: formData.get('icon') || null,
    link: formData.get('link') || null,
    video: formData.get('video') || null,
    sort_order: formData.get('sort_order') || 0,
  }

  const validation = CreateLifeAtJKKNItemSchema.safeParse(rawData)

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  // Check for duplicate slug
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', validation.data.slug)
    .single()

  if (existing) {
    return {
      success: false,
      message: 'An item with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Prepare data for blog_posts table
  const insertData = {
    title: validation.data.title,
    slug: validation.data.slug,
    excerpt: validation.data.excerpt,
    featured_image: validation.data.featured_image,
    category_id: validation.data.category_id,
    status: validation.data.status,
    author_id: user.id,
    created_by: user.id,
    updated_by: user.id,
    content: {}, // Empty content for Life@JKKN items
    visibility: 'public',
    published_at: validation.data.status === 'published' ? new Date().toISOString() : null,
    // Store Life@JKKN specific fields in metadata
    metadata: {
      icon: validation.data.icon,
      link: validation.data.link || null,
      video: validation.data.video || null,
      sort_order: validation.data.sort_order,
      is_life_at_jkkn: true, // Flag to identify Life@JKKN items
    },
  }

  // Create item
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([insertData])
    .select()
    .single()

  if (error) {
    console.error('Error creating Life@JKKN item:', error)
    return { success: false, message: 'Failed to create item' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms:life_at_jkkn',
    resourceType: 'life_at_jkkn_item',
    resourceId: data.id,
    metadata: { title: data.title, slug: data.slug },
  })

  revalidatePath('/admin/content/blog/life-at-jkkn')
  revalidatePath('/')

  return {
    success: true,
    message: 'Item created successfully',
    data,
  }
}

/**
 * Update a Life@JKKN item
 */
export async function updateLifeAtJKKNItem(
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
    return { success: false, message: 'You do not have permission to edit Life@JKKN items' }
  }

  const id = formData.get('id') as string
  if (!id) {
    return { success: false, message: 'Item ID is required' }
  }

  // Get existing item
  const { data: existingItem } = await supabase
    .from('blog_posts')
    .select('status, published_at, metadata')
    .eq('id', id)
    .single()

  if (!existingItem) {
    return { success: false, message: 'Item not found' }
  }

  // Parse and validate data
  const rawData = {
    id,
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt') || null,
    featured_image: formData.get('featured_image') || null,
    category_id: formData.get('category_id') || null,
    status: formData.get('status') || 'draft',
    icon: formData.get('icon') || null,
    link: formData.get('link') || null,
    video: formData.get('video') || null,
    sort_order: formData.get('sort_order') || 0,
  }

  const validation = UpdateLifeAtJKKNItemSchema.safeParse(rawData)

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  // Check for duplicate slug (excluding current item)
  if (validation.data.slug) {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', validation.data.slug)
      .neq('id', id)
      .single()

    if (existing) {
      return {
        success: false,
        message: 'An item with this slug already exists',
        errors: { slug: ['Slug must be unique'] },
      }
    }
  }

  // Prepare update data
  const existingMetadata = (existingItem.metadata as Record<string, unknown>) || {}
  const updateData = {
    title: validation.data.title,
    slug: validation.data.slug,
    excerpt: validation.data.excerpt,
    featured_image: validation.data.featured_image,
    category_id: validation.data.category_id,
    status: validation.data.status,
    updated_by: user.id,
    published_at:
      validation.data.status === 'published' && existingItem.status !== 'published'
        ? new Date().toISOString()
        : existingItem.published_at,
    metadata: {
      ...existingMetadata,
      icon: validation.data.icon,
      link: validation.data.link || null,
      video: validation.data.video || null,
      sort_order: validation.data.sort_order,
      is_life_at_jkkn: true,
    },
  }

  // Update item
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating Life@JKKN item:', error)
    return { success: false, message: 'Failed to update item' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'cms:life_at_jkkn',
    resourceType: 'life_at_jkkn_item',
    resourceId: id,
    metadata: { title: data.title, slug: data.slug },
  })

  revalidatePath('/admin/content/blog/life-at-jkkn')
  revalidatePath(`/admin/content/blog/life-at-jkkn/${id}/edit`)
  revalidatePath('/')

  return {
    success: true,
    message: 'Item updated successfully',
    data,
  }
}

/**
 * Delete a Life@JKKN item
 */
export async function deleteLifeAtJKKNItem(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to delete Life@JKKN items' }
  }

  // Get item info
  const { data: item } = await supabase
    .from('blog_posts')
    .select('title')
    .eq('id', id)
    .single()

  if (!item) {
    return { success: false, message: 'Item not found' }
  }

  // Delete item
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting Life@JKKN item:', error)
    return { success: false, message: 'Failed to delete item' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms:life_at_jkkn',
    resourceType: 'life_at_jkkn_item',
    resourceId: id,
    metadata: { title: item.title },
  })

  revalidatePath('/admin/content/blog/life-at-jkkn')
  revalidatePath('/')

  return {
    success: true,
    message: 'Item deleted successfully',
  }
}

/**
 * Toggle item publish status
 */
export async function toggleLifeAtJKKNItemStatus(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blog:publish')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to publish Life@JKKN items' }
  }

  // Get current status
  const { data: item } = await supabase
    .from('blog_posts')
    .select('status, title')
    .eq('id', id)
    .single()

  if (!item) {
    return { success: false, message: 'Item not found' }
  }

  // Toggle status
  const newStatus = item.status === 'published' ? 'draft' : 'published'
  const updateData: Record<string, unknown> = {
    status: newStatus,
    updated_by: user.id,
  }

  if (newStatus === 'published') {
    updateData.published_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error toggling Life@JKKN item status:', error)
    return { success: false, message: 'Failed to update item status' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: newStatus === 'published' ? 'publish' : 'unpublish',
    module: 'cms:life_at_jkkn',
    resourceType: 'life_at_jkkn_item',
    resourceId: id,
    metadata: { title: item.title, status: newStatus },
  })

  revalidatePath('/admin/content/blog/life-at-jkkn')
  revalidatePath('/')

  return {
    success: true,
    message: `Item ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
  }
}

/**
 * Bulk delete Life@JKKN items
 */
export async function bulkDeleteLifeAtJKKNItems(ids: string[]): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to delete Life@JKKN items' }
  }

  if (!ids.length) {
    return { success: false, message: 'No items selected' }
  }

  // Delete items
  const { error } = await supabase.from('blog_posts').delete().in('id', ids)

  if (error) {
    console.error('Error bulk deleting Life@JKKN items:', error)
    return { success: false, message: 'Failed to delete items' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_delete',
    module: 'cms:life_at_jkkn',
    resourceType: 'life_at_jkkn_items',
    metadata: { count: ids.length },
  })

  revalidatePath('/admin/content/blog/life-at-jkkn')
  revalidatePath('/')

  return {
    success: true,
    message: `${ids.length} item(s) deleted successfully`,
  }
}
