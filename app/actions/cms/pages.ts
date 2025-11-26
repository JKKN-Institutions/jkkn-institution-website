'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Validation schemas
const CreatePageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  template_id: z.string().uuid().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']).default('draft'),
  visibility: z.enum(['public', 'private', 'password_protected']).default('public'),
  featured_image: z.string().url().nullable().optional(),
  show_in_navigation: z.boolean().default(true),
  navigation_label: z.string().optional(),
  is_homepage: z.boolean().default(false),
})

const UpdatePageSchema = CreatePageSchema.partial().extend({
  id: z.string().uuid('Invalid page ID'),
})

const UpdatePageContentSchema = z.object({
  page_id: z.string().uuid('Invalid page ID'),
  blocks: z.array(
    z.object({
      id: z.string().uuid().optional(),
      component_name: z.string(),
      props: z.record(z.string(), z.any()),
      sort_order: z.number(),
      parent_block_id: z.string().uuid().nullable().optional(),
      is_visible: z.boolean().default(true),
      responsive_settings: z.record(z.string(), z.any()).optional(),
      custom_css: z.string().optional(),
      custom_classes: z.string().optional(),
    })
  ),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export type PageStatus = 'draft' | 'published' | 'archived' | 'scheduled'
export type PageVisibility = 'public' | 'private' | 'password_protected'

export interface PageWithBlocks {
  id: string
  title: string
  slug: string
  description: string | null
  parent_id: string | null
  template_id: string | null
  status: PageStatus
  visibility: PageVisibility
  featured_image: string | null
  sort_order: number | null
  is_homepage: boolean | null
  show_in_navigation: boolean | null
  navigation_label: string | null
  metadata: Record<string, unknown> | null
  created_by: string
  updated_by: string | null
  created_at: string | null
  updated_at: string | null
  published_at: string | null
  cms_page_blocks: Array<{
    id: string
    component_name: string
    props: Record<string, unknown>
    sort_order: number
    parent_block_id: string | null
    is_visible: boolean | null
    responsive_settings: Record<string, unknown> | null
    custom_css: string | null
    custom_classes: string | null
  }>
  cms_seo_metadata: {
    id: string
    meta_title: string | null
    meta_description: string | null
    og_image: string | null
    seo_score: number | null
  } | null
  cms_page_fab_config: {
    id: string
    is_enabled: boolean | null
    position: string | null
    primary_action: string | null
  } | null
  creator?: {
    full_name: string | null
    email: string
  }
}

export interface PageTreeNode {
  id: string
  title: string
  slug: string
  status: PageStatus
  parent_id: string | null
  sort_order: number | null
  children: PageTreeNode[]
}

/**
 * Get all pages with pagination and filtering
 */
export async function getPages(options?: {
  page?: number
  limit?: number
  status?: PageStatus
  search?: string
  parent_id?: string | null
}) {
  const supabase = await createServerSupabaseClient()
  const { page = 1, limit = 20, status, search, parent_id } = options || {}

  let query = supabase
    .from('cms_pages')
    .select(
      `
      *,
      cms_seo_metadata (
        seo_score
      )
    `,
      { count: 'exact' }
    )
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  // Apply filters
  if (status) {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`)
  }

  if (parent_id !== undefined) {
    if (parent_id === null) {
      query = query.is('parent_id', null)
    } else {
      query = query.eq('parent_id', parent_id)
    }
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching pages:', error)
    throw new Error('Failed to fetch pages')
  }

  return {
    pages: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get page tree structure for hierarchical display
 */
export async function getPageTree(): Promise<PageTreeNode[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select('id, title, slug, status, parent_id, sort_order')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching page tree:', error)
    throw new Error('Failed to fetch page tree')
  }

  // Build tree structure
  const pages = data || []
  const pageMap = new Map<string, PageTreeNode>()
  const rootPages: PageTreeNode[] = []

  // First pass: create all nodes
  pages.forEach((page) => {
    pageMap.set(page.id, {
      ...page,
      status: page.status as PageStatus,
      children: [],
    })
  })

  // Second pass: build tree
  pages.forEach((page) => {
    const node = pageMap.get(page.id)!
    if (page.parent_id && pageMap.has(page.parent_id)) {
      pageMap.get(page.parent_id)!.children.push(node)
    } else {
      rootPages.push(node)
    }
  })

  return rootPages
}

/**
 * Get a single page by ID with all related data
 */
export async function getPageById(pageId: string): Promise<PageWithBlocks | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select(
      `
      *,
      cms_page_blocks (
        id,
        component_name,
        props,
        sort_order,
        parent_block_id,
        is_visible,
        responsive_settings,
        custom_css,
        custom_classes
      ),
      cms_seo_metadata (
        id,
        meta_title,
        meta_description,
        og_image,
        seo_score
      ),
      cms_page_fab_config (
        id,
        is_enabled,
        position,
        primary_action
      )
    `
    )
    .eq('id', pageId)
    .single()

  if (error) {
    console.error('Error fetching page:', error)
    return null
  }

  // Sort blocks by sort_order
  if (data?.cms_page_blocks) {
    data.cms_page_blocks.sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    )
  }

  return data as unknown as PageWithBlocks
}

/**
 * Get a page by slug (for public rendering)
 */
export async function getPageBySlug(slug: string): Promise<PageWithBlocks | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select(
      `
      *,
      cms_page_blocks (
        id,
        component_name,
        props,
        sort_order,
        parent_block_id,
        is_visible,
        responsive_settings,
        custom_css,
        custom_classes
      ),
      cms_seo_metadata (*),
      cms_page_fab_config (*)
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .single()

  if (error) {
    console.error('Error fetching page by slug:', error)
    return null
  }

  // Sort blocks by sort_order and filter visible
  if (data?.cms_page_blocks) {
    data.cms_page_blocks = data.cms_page_blocks
      .filter((b: { is_visible: boolean | null }) => b.is_visible !== false)
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
  }

  return data as unknown as PageWithBlocks
}

/**
 * Create a new page
 */
export async function createPage(
  prevState: FormState,
  formData: FormData
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
  const hasPermission = await checkPermission(user.id, 'cms:pages:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create pages' }
  }

  // Validate input
  const validation = CreatePageSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    parent_id: formData.get('parent_id') || null,
    template_id: formData.get('template_id') || null,
    status: formData.get('status') || 'draft',
    visibility: formData.get('visibility') || 'public',
    featured_image: formData.get('featured_image') || null,
    show_in_navigation: formData.get('show_in_navigation') === 'true',
    navigation_label: formData.get('navigation_label') || undefined,
    is_homepage: formData.get('is_homepage') === 'true',
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  // Check if slug already exists
  const { data: existing } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('slug', validation.data.slug)
    .single()

  if (existing) {
    return { success: false, message: 'A page with this slug already exists' }
  }

  // If setting as homepage, unset any existing homepage
  if (validation.data.is_homepage) {
    await supabase.from('cms_pages').update({ is_homepage: false }).eq('is_homepage', true)
  }

  // Get default blocks from template if provided
  let defaultBlocks: unknown[] = []
  if (validation.data.template_id) {
    const { data: template } = await supabase
      .from('cms_page_templates')
      .select('default_blocks')
      .eq('id', validation.data.template_id)
      .single()

    if (template?.default_blocks) {
      defaultBlocks = template.default_blocks as unknown[]
    }
  }

  // Create page
  const { data: page, error } = await supabase
    .from('cms_pages')
    .insert({
      title: validation.data.title,
      slug: validation.data.slug,
      description: validation.data.description,
      parent_id: validation.data.parent_id,
      template_id: validation.data.template_id,
      status: validation.data.status,
      visibility: validation.data.visibility,
      featured_image: validation.data.featured_image,
      show_in_navigation: validation.data.show_in_navigation,
      navigation_label: validation.data.navigation_label,
      is_homepage: validation.data.is_homepage,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating page:', error)
    return { success: false, message: 'Failed to create page. Please try again.' }
  }

  // Create default blocks from template
  if (defaultBlocks.length > 0) {
    const blocksToInsert = defaultBlocks.map((block: unknown, index: number) => {
      const b = block as { component_name: string; props: Record<string, unknown> }
      return {
        page_id: page.id,
        component_name: b.component_name,
        props: b.props || {},
        sort_order: index,
      }
    })

    await supabase.from('cms_page_blocks').insert(blocksToInsert)
  }

  // Create default SEO metadata
  await supabase.from('cms_seo_metadata').insert({
    page_id: page.id,
    meta_title: validation.data.title,
  })

  // Create default FAB config
  await supabase.from('cms_page_fab_config').insert({
    page_id: page.id,
    is_enabled: false,
  })

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'page',
    resourceId: page.id,
    metadata: { title: validation.data.title, slug: validation.data.slug },
  })

  revalidatePath('/admin/content/pages')

  return { success: true, message: 'Page created successfully', data: { id: page.id } }
}

/**
 * Update page metadata
 */
export async function updatePage(
  prevState: FormState,
  formData: FormData
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
    return { success: false, message: 'You do not have permission to edit pages' }
  }

  // Validate input
  const validation = UpdatePageSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title') || undefined,
    slug: formData.get('slug') || undefined,
    description: formData.get('description') || undefined,
    parent_id: formData.get('parent_id') || null,
    status: formData.get('status') || undefined,
    visibility: formData.get('visibility') || undefined,
    featured_image: formData.get('featured_image') || null,
    show_in_navigation:
      formData.get('show_in_navigation') !== null
        ? formData.get('show_in_navigation') === 'true'
        : undefined,
    navigation_label: formData.get('navigation_label') || undefined,
    is_homepage:
      formData.get('is_homepage') !== null
        ? formData.get('is_homepage') === 'true'
        : undefined,
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { id, ...updateData } = validation.data

  // Check if slug is being changed and already exists
  if (updateData.slug) {
    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .single()

    if (existing) {
      return { success: false, message: 'A page with this slug already exists' }
    }
  }

  // If setting as homepage, unset any existing homepage
  if (updateData.is_homepage) {
    await supabase.from('cms_pages').update({ is_homepage: false }).neq('id', id).eq('is_homepage', true)
  }

  // Update page
  const { error } = await supabase
    .from('cms_pages')
    .update({
      ...updateData,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating page:', error)
    return { success: false, message: 'Failed to update page. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'cms',
    resourceType: 'page',
    resourceId: id,
    metadata: { changes: updateData },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${id}`)

  return { success: true, message: 'Page updated successfully' }
}

/**
 * Update page content (blocks)
 */
export async function updatePageContent(
  pageId: string,
  blocks: Array<{
    id?: string
    component_name: string
    props: Record<string, unknown>
    sort_order: number
    parent_block_id?: string | null
    is_visible?: boolean
    responsive_settings?: Record<string, unknown>
    custom_css?: string
    custom_classes?: string
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
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit pages' }
  }

  // Validate
  const validation = UpdatePageContentSchema.safeParse({ page_id: pageId, blocks })
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid block data',
    }
  }

  // Get existing block IDs
  const { data: existingBlocks } = await supabase
    .from('cms_page_blocks')
    .select('id')
    .eq('page_id', pageId)

  const existingIds = new Set(existingBlocks?.map((b) => b.id) || [])
  const newBlockIds = new Set(blocks.filter((b) => b.id).map((b) => b.id))

  // Find blocks to delete (exist in DB but not in new list)
  const blocksToDelete = [...existingIds].filter((id) => !newBlockIds.has(id))

  // Delete removed blocks
  if (blocksToDelete.length > 0) {
    await supabase.from('cms_page_blocks').delete().in('id', blocksToDelete)
  }

  // Upsert blocks
  for (const block of blocks) {
    if (block.id && existingIds.has(block.id)) {
      // Update existing block
      await supabase
        .from('cms_page_blocks')
        .update({
          component_name: block.component_name,
          props: block.props,
          sort_order: block.sort_order,
          parent_block_id: block.parent_block_id || null,
          is_visible: block.is_visible ?? true,
          responsive_settings: block.responsive_settings || {},
          custom_css: block.custom_css || null,
          custom_classes: block.custom_classes || null,
        })
        .eq('id', block.id)
    } else {
      // Insert new block
      await supabase.from('cms_page_blocks').insert({
        page_id: pageId,
        component_name: block.component_name,
        props: block.props,
        sort_order: block.sort_order,
        parent_block_id: block.parent_block_id || null,
        is_visible: block.is_visible ?? true,
        responsive_settings: block.responsive_settings || {},
        custom_css: block.custom_css || null,
        custom_classes: block.custom_classes || null,
      })
    }
  }

  // Update page timestamp
  await supabase
    .from('cms_pages')
    .update({
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit_content',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { block_count: blocks.length },
  })

  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Page content saved' }
}

/**
 * Delete a page
 */
export async function deletePage(pageId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete pages' }
  }

  // Get page info for logging
  const { data: page } = await supabase
    .from('cms_pages')
    .select('title, slug, is_homepage')
    .eq('id', pageId)
    .single()

  if (!page) {
    return { success: false, message: 'Page not found' }
  }

  if (page.is_homepage) {
    return { success: false, message: 'Cannot delete the homepage. Set another page as homepage first.' }
  }

  // Check for child pages
  const { data: childPages } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('parent_id', pageId)
    .limit(1)

  if (childPages && childPages.length > 0) {
    return { success: false, message: 'Cannot delete page with child pages. Delete or move child pages first.' }
  }

  // Delete page (cascade will handle blocks, SEO, FAB, versions)
  const { error } = await supabase.from('cms_pages').delete().eq('id', pageId)

  if (error) {
    console.error('Error deleting page:', error)
    return { success: false, message: 'Failed to delete page. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, slug: page.slug },
  })

  revalidatePath('/admin/content/pages')

  return { success: true, message: 'Page deleted successfully' }
}

/**
 * Publish a page
 */
export async function publishPage(pageId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:publish')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to publish pages' }
  }

  // Update page status
  const { data: page, error } = await supabase
    .from('cms_pages')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)
    .select('title, slug')
    .single()

  if (error) {
    console.error('Error publishing page:', error)
    return { success: false, message: 'Failed to publish page. Please try again.' }
  }

  // Create a published version snapshot
  const { data: pageWithBlocks } = await supabase
    .from('cms_pages')
    .select(
      `
      title, slug, description,
      cms_page_blocks (*),
      cms_seo_metadata (*),
      cms_page_fab_config (*)
    `
    )
    .eq('id', pageId)
    .single()

  if (pageWithBlocks) {
    // Get next version number
    const { data: nextVersion } = await supabase.rpc('get_next_page_version_number', {
      p_page_id: pageId,
    })

    await supabase.from('cms_page_versions').insert({
      page_id: pageId,
      version_number: nextVersion || 1,
      title: pageWithBlocks.title,
      slug: pageWithBlocks.slug,
      description: pageWithBlocks.description,
      blocks_snapshot: pageWithBlocks.cms_page_blocks || [],
      seo_snapshot: pageWithBlocks.cms_seo_metadata || {},
      fab_snapshot: pageWithBlocks.cms_page_fab_config || {},
      is_published_version: true,
      change_summary: 'Published',
      created_by: user.id,
    })
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'publish',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, slug: page.slug },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)
  revalidatePath(`/${page.slug}`)

  return { success: true, message: 'Page published successfully' }
}

/**
 * Unpublish a page (set to draft)
 */
export async function unpublishPage(pageId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:publish')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to unpublish pages' }
  }

  // Update page status
  const { data: page, error } = await supabase
    .from('cms_pages')
    .update({
      status: 'draft',
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)
    .select('title, slug')
    .single()

  if (error) {
    console.error('Error unpublishing page:', error)
    return { success: false, message: 'Failed to unpublish page. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'unpublish',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Page unpublished' }
}

/**
 * Archive a page
 */
export async function archivePage(pageId: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to archive pages' }
  }

  // Update page status
  const { data: page, error } = await supabase
    .from('cms_pages')
    .update({
      status: 'archived',
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)
    .select('title')
    .single()

  if (error) {
    console.error('Error archiving page:', error)
    return { success: false, message: 'Failed to archive page. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'archive',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Page archived' }
}

/**
 * Duplicate a page
 */
export async function duplicatePage(pageId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create pages' }
  }

  // Get original page with blocks
  const { data: originalPage, error: fetchError } = await supabase
    .from('cms_pages')
    .select('*, cms_page_blocks(*), cms_seo_metadata(*), cms_page_fab_config(*)')
    .eq('id', pageId)
    .single()

  if (fetchError || !originalPage) {
    return { success: false, message: 'Page not found' }
  }

  // Generate unique slug
  let suffix = 1
  let newSlug = `${originalPage.slug}-copy`

  const { data: existingSlugs } = await supabase
    .from('cms_pages')
    .select('slug')
    .like('slug', `${originalPage.slug}-copy%`)

  if (existingSlugs && existingSlugs.length > 0) {
    const slugSet = new Set(existingSlugs.map((p) => p.slug))
    while (slugSet.has(newSlug)) {
      suffix++
      newSlug = `${originalPage.slug}-copy-${suffix}`
    }
  }

  // Create new page
  const { data: newPage, error: createError } = await supabase
    .from('cms_pages')
    .insert({
      title: `${originalPage.title} (Copy)`,
      slug: newSlug,
      description: originalPage.description,
      parent_id: originalPage.parent_id,
      template_id: originalPage.template_id,
      status: 'draft',
      visibility: originalPage.visibility,
      featured_image: originalPage.featured_image,
      show_in_navigation: false,
      navigation_label: originalPage.navigation_label,
      is_homepage: false,
      metadata: originalPage.metadata,
      created_by: user.id,
    })
    .select()
    .single()

  if (createError) {
    console.error('Error duplicating page:', createError)
    return { success: false, message: 'Failed to duplicate page. Please try again.' }
  }

  // Copy blocks
  if (originalPage.cms_page_blocks?.length > 0) {
    const blocksToInsert = originalPage.cms_page_blocks.map(
      (block: {
        component_name: string
        props: Record<string, unknown>
        sort_order: number
        is_visible: boolean | null
        responsive_settings: Record<string, unknown> | null
        custom_css: string | null
        custom_classes: string | null
      }) => ({
        page_id: newPage.id,
        component_name: block.component_name,
        props: block.props,
        sort_order: block.sort_order,
        is_visible: block.is_visible,
        responsive_settings: block.responsive_settings,
        custom_css: block.custom_css,
        custom_classes: block.custom_classes,
      })
    )

    await supabase.from('cms_page_blocks').insert(blocksToInsert)
  }

  // Copy SEO metadata
  if (originalPage.cms_seo_metadata) {
    const seo = originalPage.cms_seo_metadata
    await supabase.from('cms_seo_metadata').insert({
      page_id: newPage.id,
      meta_title: `${seo.meta_title} (Copy)`,
      meta_description: seo.meta_description,
      meta_keywords: seo.meta_keywords,
      og_title: seo.og_title,
      og_description: seo.og_description,
      og_image: seo.og_image,
      twitter_title: seo.twitter_title,
      twitter_description: seo.twitter_description,
      twitter_image: seo.twitter_image,
      structured_data: seo.structured_data,
    })
  } else {
    await supabase.from('cms_seo_metadata').insert({
      page_id: newPage.id,
      meta_title: `${originalPage.title} (Copy)`,
    })
  }

  // Copy FAB config
  if (originalPage.cms_page_fab_config) {
    const fab = originalPage.cms_page_fab_config
    await supabase.from('cms_page_fab_config').insert({
      page_id: newPage.id,
      is_enabled: fab.is_enabled,
      position: fab.position,
      theme: fab.theme,
      primary_action: fab.primary_action,
      show_whatsapp: fab.show_whatsapp,
      show_phone: fab.show_phone,
      show_email: fab.show_email,
      whatsapp_number: fab.whatsapp_number,
      phone_number: fab.phone_number,
      email_address: fab.email_address,
    })
  } else {
    await supabase.from('cms_page_fab_config').insert({
      page_id: newPage.id,
      is_enabled: false,
    })
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'duplicate',
    module: 'cms',
    resourceType: 'page',
    resourceId: newPage.id,
    metadata: { original_page_id: pageId, new_slug: newSlug },
  })

  revalidatePath('/admin/content/pages')

  return {
    success: true,
    message: `Page duplicated as "${newPage.title}"`,
    data: { id: newPage.id },
  }
}

/**
 * Reorder pages (update sort_order)
 */
export async function reorderPages(
  pageOrders: Array<{ id: string; sort_order: number; parent_id: string | null }>
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
    return { success: false, message: 'You do not have permission to reorder pages' }
  }

  // Update each page's sort_order and parent_id
  for (const { id, sort_order, parent_id } of pageOrders) {
    await supabase
      .from('cms_pages')
      .update({
        sort_order,
        parent_id,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'reorder',
    module: 'cms',
    resourceType: 'pages',
    metadata: { pages_reordered: pageOrders.length },
  })

  revalidatePath('/admin/content/pages')

  return { success: true, message: 'Pages reordered' }
}

/**
 * Get all published page slugs (for generateStaticParams)
 */
export async function getPublishedPageSlugs(): Promise<string[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select('slug')
    .eq('status', 'published')
    .eq('visibility', 'public')

  if (error) {
    console.error('Error fetching published slugs:', error)
    return []
  }

  return data?.map((p) => p.slug) || []
}
