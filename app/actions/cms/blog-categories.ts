'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Validation schemas
const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  color: z.string().max(7).optional().nullable(),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
})

const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  id: z.string().uuid('Invalid category ID'),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  icon: string | null
  color: string | null
  sort_order: number | null
  is_active: boolean | null
  post_count: number | null
  created_at: string | null
  updated_at: string | null
  parent?: BlogCategory | null
  children?: BlogCategory[]
}

/**
 * Get all blog categories with optional filtering
 */
export async function getBlogCategories(options?: {
  includeInactive?: boolean
  parentId?: string | null
  search?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { includeInactive = false, parentId, search } = options || {}

  let query = supabase
    .from('blog_categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  if (parentId !== undefined) {
    if (parentId === null) {
      query = query.is('parent_id', null)
    } else {
      query = query.eq('parent_id', parentId)
    }
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog categories:', error)
    throw new Error('Failed to fetch blog categories')
  }

  return data as BlogCategory[]
}

/**
 * Get a single blog category by ID
 */
export async function getBlogCategory(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog category:', error)
    return null
  }

  return data as BlogCategory
}

/**
 * Get a single blog category by slug
 */
export async function getBlogCategoryBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching blog category by slug:', error)
    return null
  }

  return data as BlogCategory
}

/**
 * Get categories with hierarchy (tree structure)
 */
export async function getBlogCategoriesTree() {
  const categories = await getBlogCategories({ includeInactive: true })

  // Build tree structure
  const categoryMap = new Map<string, BlogCategory & { children: BlogCategory[] }>()
  const rootCategories: (BlogCategory & { children: BlogCategory[] })[] = []

  // First pass: create map with children arrays
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] })
  })

  // Second pass: build tree
  categories.forEach((cat) => {
    const categoryWithChildren = categoryMap.get(cat.id)!
    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)!.children.push(categoryWithChildren)
    } else {
      rootCategories.push(categoryWithChildren)
    }
  })

  return rootCategories
}

/**
 * Create a new blog category
 */
export async function createBlogCategory(
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
    return { success: false, message: 'You do not have permission to create blog categories' }
  }

  // Parse and validate data
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    parent_id: formData.get('parent_id') || null,
    icon: formData.get('icon') || null,
    color: formData.get('color') || null,
    sort_order: formData.get('sort_order') || 0,
    is_active: formData.get('is_active') === 'true',
  }

  const validation = CreateCategorySchema.safeParse(rawData)

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  // Check for duplicate slug
  const { data: existing } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', validation.data.slug)
    .single()

  if (existing) {
    return {
      success: false,
      message: 'A category with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Create category
  const { data, error } = await supabase
    .from('blog_categories')
    .insert([validation.data])
    .select()
    .single()

  if (error) {
    console.error('Error creating blog category:', error)
    return { success: false, message: 'Failed to create category' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms:blog',
    resourceType: 'blog_category',
    resourceId: data.id,
    metadata: { name: data.name, slug: data.slug },
  })

  revalidatePath('/admin/content/blog/categories')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Category created successfully',
    data,
  }
}

/**
 * Update a blog category
 */
export async function updateBlogCategory(
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
    return { success: false, message: 'You do not have permission to edit blog categories' }
  }

  // Parse and validate data
  const rawData = {
    id: formData.get('id'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    parent_id: formData.get('parent_id') || null,
    icon: formData.get('icon') || null,
    color: formData.get('color') || null,
    sort_order: formData.get('sort_order') || 0,
    is_active: formData.get('is_active') === 'true',
  }

  const validation = UpdateCategorySchema.safeParse(rawData)

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { id, ...updateData } = validation.data

  // Check for duplicate slug (excluding current category)
  if (updateData.slug) {
    const { data: existing } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .single()

    if (existing) {
      return {
        success: false,
        message: 'A category with this slug already exists',
        errors: { slug: ['Slug must be unique'] },
      }
    }
  }

  // Prevent circular parent reference
  if (updateData.parent_id === id) {
    return {
      success: false,
      message: 'A category cannot be its own parent',
      errors: { parent_id: ['Invalid parent category'] },
    }
  }

  // Update category
  const { data, error } = await supabase
    .from('blog_categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog category:', error)
    return { success: false, message: 'Failed to update category' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'cms:blog',
    resourceType: 'blog_category',
    resourceId: id,
    metadata: { name: data.name, slug: data.slug },
  })

  revalidatePath('/admin/content/blog/categories')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Category updated successfully',
    data,
  }
}

/**
 * Delete a blog category
 */
export async function deleteBlogCategory(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to delete blog categories' }
  }

  // Check if category has posts
  const { data: category } = await supabase
    .from('blog_categories')
    .select('name, post_count')
    .eq('id', id)
    .single()

  if (!category) {
    return { success: false, message: 'Category not found' }
  }

  if (category.post_count && category.post_count > 0) {
    return {
      success: false,
      message: `Cannot delete category "${category.name}" because it has ${category.post_count} post(s). Please move or delete the posts first.`,
    }
  }

  // Check if category has children
  const { data: children } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('parent_id', id)
    .limit(1)

  if (children && children.length > 0) {
    return {
      success: false,
      message: 'Cannot delete category because it has subcategories. Please delete or move subcategories first.',
    }
  }

  // Delete category
  const { error } = await supabase.from('blog_categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting blog category:', error)
    return { success: false, message: 'Failed to delete category' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms:blog',
    resourceType: 'blog_category',
    resourceId: id,
    metadata: { name: category.name },
  })

  revalidatePath('/admin/content/blog/categories')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Category deleted successfully',
  }
}

/**
 * Toggle category active status
 */
export async function toggleBlogCategoryStatus(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to edit blog categories' }
  }

  // Get current status
  const { data: category } = await supabase
    .from('blog_categories')
    .select('is_active, name')
    .eq('id', id)
    .single()

  if (!category) {
    return { success: false, message: 'Category not found' }
  }

  // Toggle status
  const newStatus = !category.is_active
  const { error } = await supabase
    .from('blog_categories')
    .update({ is_active: newStatus })
    .eq('id', id)

  if (error) {
    console.error('Error toggling blog category status:', error)
    return { success: false, message: 'Failed to update category status' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: newStatus ? 'activate' : 'deactivate',
    module: 'cms:blog',
    resourceType: 'blog_category',
    resourceId: id,
    metadata: { name: category.name, is_active: newStatus },
  })

  revalidatePath('/admin/content/blog/categories')
  revalidatePath('/blog')

  return {
    success: true,
    message: `Category ${newStatus ? 'activated' : 'deactivated'} successfully`,
  }
}

/**
 * Reorder categories
 */
export async function reorderBlogCategories(
  orderedIds: { id: string; sort_order: number }[]
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
    return { success: false, message: 'You do not have permission to reorder categories' }
  }

  // Update each category's sort order
  const updates = orderedIds.map(({ id, sort_order }) =>
    supabase.from('blog_categories').update({ sort_order }).eq('id', id)
  )

  const results = await Promise.all(updates)
  const hasError = results.some((r) => r.error)

  if (hasError) {
    console.error('Error reordering blog categories')
    return { success: false, message: 'Failed to reorder categories' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'reorder',
    module: 'cms:blog',
    resourceType: 'blog_categories',
    metadata: { count: orderedIds.length },
  })

  revalidatePath('/admin/content/blog/categories')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Categories reordered successfully',
  }
}
