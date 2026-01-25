'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'
import { NotificationHelpers } from '@/lib/utils/notification-sender'
import {
  extractSlugSegment,
  validateSlugHierarchy,
  validateSlugDepth,
  validateHomepageParent,
  preventCircularParent,
  updateChildSlugs,
  getPageChildren,
} from '@/lib/utils/page-hierarchy'

// Validation schemas
const CreatePageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(500, 'Slug is too long') // Increased for hierarchical paths
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/,
      'Slug must be lowercase with hyphens, paths separated by /'
    ),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional().or(z.literal('')).nullable().transform(val => val || null),
  template_id: z.string().uuid().optional().or(z.literal('')).nullable().transform(val => val || null),
  status: z.enum(['draft', 'pending_review', 'approved', 'published', 'archived', 'scheduled']).default('draft'),
  visibility: z.enum(['public', 'private', 'password_protected']).default('public'),
  featured_image: z.union([z.string().url(), z.literal('')]).optional().nullable().transform(val => val || null),
  sort_order: z.coerce.number().min(1).optional(),
  show_in_navigation: z.boolean().default(true),
  navigation_label: z.string().optional(),
  is_homepage: z.boolean().default(false),
  external_url: z.union([z.string().url('Please enter a valid URL'), z.literal('')]).optional().nullable().transform(val => val || null),
  slug_overridden: z.boolean().default(false),
  hierarchical_slug: z.string().max(500).optional().nullable(),
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

export type PageStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'archived' | 'scheduled'
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
  external_url: string | null
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
  cms_seo_metadata: Array<{
    id: string
    meta_title: string | null
    meta_description: string | null
    meta_keywords: string[] | null
    og_title: string | null
    og_description: string | null
    og_image: string | null
    og_type: string | null
    twitter_card: string | null
    twitter_title: string | null
    twitter_description: string | null
    twitter_image: string | null
    canonical_url: string | null
    robots_directive: string | null
    structured_data: Record<string, unknown> | null
    custom_head_tags: string | null
    seo_score: number | null
    last_analyzed_at: string | null
  }> | null
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
 * Returns pages in hierarchical order: parent pages followed by their children
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

  // First, get ALL pages to build hierarchy (we'll paginate after sorting)
  let allPagesQuery = supabase
    .from('cms_pages')
    .select(
      `
      *,
      cms_seo_metadata (
        seo_score
      )
    `
    )
    .is('deleted_at', null) // Exclude soft-deleted pages
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('title', { ascending: true })

  // Apply filters (but not pagination yet)
  if (status) {
    allPagesQuery = allPagesQuery.eq('status', status)
  }

  if (search) {
    allPagesQuery = allPagesQuery.or(`title.ilike.%${search}%,slug.ilike.%${search}%`)
  }

  // Only apply parent_id filter if explicitly set
  if (parent_id !== undefined) {
    if (parent_id === null) {
      allPagesQuery = allPagesQuery.is('parent_id', null)
    } else {
      allPagesQuery = allPagesQuery.eq('parent_id', parent_id)
    }
  }

  const { data: allPages, error } = await allPagesQuery

  if (error) {
    console.error('Error fetching pages:', error)
    throw new Error('Failed to fetch pages')
  }

  // Build hierarchical order: parent pages followed by their children
  const pages = allPages || []
  const parentPages = pages.filter(p => !p.parent_id).sort((a, b) =>
    (a.sort_order ?? 999) - (b.sort_order ?? 999)
  )
  const childrenMap = new Map<string, typeof pages>()

  // Group children by parent_id
  pages.forEach(p => {
    if (p.parent_id) {
      const children = childrenMap.get(p.parent_id) || []
      children.push(p)
      childrenMap.set(p.parent_id, children)
    }
  })

  // Sort children within each parent
  childrenMap.forEach((children) => {
    children.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
  })

  // Build final ordered list: parent followed by children
  const orderedPages: typeof pages = []
  parentPages.forEach(parent => {
    orderedPages.push(parent)
    const children = childrenMap.get(parent.id) || []
    orderedPages.push(...children)
  })

  // Add orphan pages (children whose parents don't exist or are filtered out)
  const orphans = pages.filter(p =>
    p.parent_id && !parentPages.some(pp => pp.id === p.parent_id)
  )
  orderedPages.push(...orphans)

  // Now apply pagination to the ordered list
  const total = orderedPages.length
  const from = (page - 1) * limit
  const to = from + limit
  const paginatedPages = orderedPages.slice(from, to)

  return {
    pages: paginatedPages,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
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
 * Get all navigation pages for reordering (flat list with parent info)
 * Returns ALL pages that show in navigation, sorted by hierarchy
 */
export async function getAllNavigationPages(): Promise<Array<{
  id: string
  title: string
  slug: string
  status: string
  sort_order: number | null
  parent_id: string | null
  show_in_navigation: boolean | null
}>> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select('id, title, slug, status, sort_order, parent_id, show_in_navigation')
    .eq('show_in_navigation', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching navigation pages:', error)
    throw new Error('Failed to fetch navigation pages')
  }

  return data || []
}

/**
 * Get parent page's sort_order by parent_id
 */
export async function getParentPageOrder(parentId: string | null | undefined): Promise<number | null> {
  if (!parentId) return null

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select('sort_order')
    .eq('id', parentId)
    .single()

  if (error || !data) {
    return null
  }

  return data.sort_order
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
    // PGRST116 = "Results contain 0 rows" - expected for non-existent pages
    if (error.code !== 'PGRST116') {
      console.error('Error fetching page:', error)
    }
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
 * For homepage (empty slug), queries by is_homepage=true flag
 */
export async function getPageBySlug(slug: string): Promise<PageWithBlocks | null> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
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
    .eq('status', 'published')
    .eq('visibility', 'public')

  // For homepage (empty slug), query by is_homepage flag
  if (slug === '') {
    query = query.eq('is_homepage', true)
  } else {
    query = query.eq('slug', slug)
  }

  const { data, error } = await query.single()

  if (error) {
    // PGRST116 = "Results contain 0 rows" - this is expected for non-existent pages
    if (error.code !== 'PGRST116') {
      console.error('Error fetching page by slug:', error)
    }
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
 * Page visibility result for public rendering
 */
export type PageVisibilityResult = {
  page: PageWithBlocks | null
  visibility: PageVisibility | null
  requiresAuth: boolean
  requiresPassword: boolean
  status: 'found' | 'not_found' | 'not_published' | 'requires_auth' | 'requires_password'
}

/**
 * Get a page by slug with visibility information (for public rendering)
 * This returns the page along with visibility requirements
 */
export async function getPageWithVisibility(slug: string): Promise<PageVisibilityResult> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
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

  // For homepage (empty slug), query by is_homepage flag
  if (slug === '') {
    query = query.eq('is_homepage', true)
  } else {
    query = query.eq('slug', slug)
  }

  const { data, error } = await query.single()

  if (error) {
    // PGRST116 = "Results contain 0 rows"
    if (error.code === 'PGRST116') {
      return { page: null, visibility: null, requiresAuth: false, requiresPassword: false, status: 'not_found' }
    }
    console.error('Error fetching page with visibility:', error)
    return { page: null, visibility: null, requiresAuth: false, requiresPassword: false, status: 'not_found' }
  }

  // Check if page is published
  if (data.status !== 'published') {
    return { page: null, visibility: null, requiresAuth: false, requiresPassword: false, status: 'not_published' }
  }

  // Sort and filter blocks
  if (data?.cms_page_blocks) {
    data.cms_page_blocks = data.cms_page_blocks
      .filter((b: { is_visible: boolean | null }) => b.is_visible !== false)
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
  }

  const page = data as unknown as PageWithBlocks
  const visibility = page.visibility

  // Handle different visibility types
  if (visibility === 'public') {
    return { page, visibility, requiresAuth: false, requiresPassword: false, status: 'found' }
  }

  if (visibility === 'private') {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return { page, visibility, requiresAuth: false, requiresPassword: false, status: 'found' }
    }
    return { page: null, visibility, requiresAuth: true, requiresPassword: false, status: 'requires_auth' }
  }

  if (visibility === 'password_protected') {
    // Return metadata but indicate password is required
    // The actual page content should not be returned until password is verified
    return { page: null, visibility, requiresAuth: false, requiresPassword: true, status: 'requires_password' }
  }

  return { page, visibility, requiresAuth: false, requiresPassword: false, status: 'found' }
}

/**
 * Verify password for a password-protected page
 */
export async function verifyPagePassword(slug: string, password: string): Promise<{ success: boolean; page?: PageWithBlocks }> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('cms_pages')
    .select(
      `
      id,
      password_hash,
      status,
      visibility
    `
    )

  // For homepage (empty slug), query by is_homepage flag
  if (slug === '') {
    query = query.eq('is_homepage', true)
  } else {
    query = query.eq('slug', slug)
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return { success: false }
  }

  // Page must be published and password protected
  if (data.status !== 'published' || data.visibility !== 'password_protected') {
    return { success: false }
  }

  // Simple password comparison (in production, use bcrypt or similar)
  // For now, we'll do a simple hash comparison
  const crypto = await import('crypto')
  const inputHash = crypto.createHash('sha256').update(password).digest('hex')

  if (data.password_hash !== inputHash) {
    return { success: false }
  }

  // Password verified - fetch full page content
  const result = await getPageBySlugInternal(slug)
  if (result) {
    return { success: true, page: result }
  }

  return { success: false }
}

/**
 * Internal function to get page by slug without visibility filter
 */
async function getPageBySlugInternal(slug: string): Promise<PageWithBlocks | null> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
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
    .eq('status', 'published')

  // For homepage (empty slug), query by is_homepage flag
  if (slug === '') {
    query = query.eq('is_homepage', true)
  } else {
    query = query.eq('slug', slug)
  }

  const { data, error } = await query.single()

  if (error) {
    return null
  }

  // Sort and filter blocks
  if (data?.cms_page_blocks) {
    data.cms_page_blocks = data.cms_page_blocks
      .filter((b: { is_visible: boolean | null }) => b.is_visible !== false)
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
  }

  return data as unknown as PageWithBlocks
}

/**
 * Set password for a page (for use in page settings)
 */
export async function setPagePassword(pageId: string, password: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user and check permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit pages' }
  }

  // Hash the password
  const crypto = await import('crypto')
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

  const { error } = await supabase
    .from('cms_pages')
    .update({
      password_hash: passwordHash,
      visibility: 'password_protected',
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('Error setting page password:', error)
    return { success: false, message: 'Failed to set page password' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { action: 'set_password' },
  })

  revalidatePath('/admin/content/pages')
  return { success: true, message: 'Page password set successfully' }
}

/**
 * Create a new page
 */
export async function createPage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    console.log('🔍 [createPage] Starting page creation...')
    console.log('📋 [createPage] FormData entries:', Object.fromEntries(formData.entries()))

    const supabase = await createServerSupabaseClient()

    // Get current user
    console.log('👤 [createPage] Fetching current user...')
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError) {
      console.error('❌ [createPage] Auth error:', userError)
      return { success: false, message: `Authentication error: ${userError.message}` }
    }

    if (!user) {
      console.error('❌ [createPage] No user found')
      return { success: false, message: 'Unauthorized' }
    }

    console.log('✅ [createPage] User authenticated:', user.id)

    // Check permission
    console.log('🔐 [createPage] Checking permissions...')
    const hasPermission = await checkPermission(user.id, 'cms:pages:create')
    if (!hasPermission) {
      console.error('❌ [createPage] Permission denied')
      return { success: false, message: 'You do not have permission to create pages' }
    }

    console.log('✅ [createPage] Permission granted')

    // Get raw input values
    const rawSlug = formData.get('slug') as string
    const parentId = formData.get('parent_id') as string | null
    const isHomepage = formData.get('is_homepage') === 'true'

    console.log('📝 [createPage] Raw input - slug:', rawSlug, 'parentId:', parentId, 'isHomepage:', isHomepage)

    // Build hierarchical slug if parent exists
    let finalSlug = rawSlug

    if (parentId && parentId !== 'none' && parentId !== '') {
      console.log('🔗 [createPage] Fetching parent page...')
      const { data: parent } = await supabase
      .from('cms_pages')
      .select('slug')
      .eq('id', parentId)
      .single()

      if (!parent) {
        console.error('❌ [createPage] Parent page not found')
        return { success: false, message: 'Parent page not found' }
      }

      // Prepend parent path if not already included
      if (!rawSlug.startsWith(`${parent.slug}/`)) {
        finalSlug = `${parent.slug}/${rawSlug}`
      }
      console.log('✅ [createPage] Parent page found, final slug:', finalSlug)
    }

    // Validate homepage parent constraint
    console.log('🏠 [createPage] Validating homepage constraints...')
    const homepageValidation = validateHomepageParent(isHomepage, parentId)
    if (!homepageValidation.valid) {
      console.error('❌ [createPage] Homepage validation failed:', homepageValidation.error)
      return { success: false, message: homepageValidation.error }
    }

    // Validate slug depth
    console.log('📏 [createPage] Validating slug depth...')
    const depthValidation = validateSlugDepth(finalSlug)
    if (!depthValidation.valid) {
      console.error('❌ [createPage] Slug depth validation failed:', depthValidation.error)
      return { success: false, message: depthValidation.error }
    }

    // Validate input with hierarchical slug
    console.log('✔️ [createPage] Validating input schema...')
    const validation = CreatePageSchema.safeParse({
      title: formData.get('title'),
      slug: finalSlug,
      description: formData.get('description') || undefined,
      parent_id: parentId || null,
      template_id: formData.get('template_id') || null,
      status: formData.get('status') || 'draft',
      visibility: formData.get('visibility') || 'public',
      featured_image: formData.get('featured_image') || null,
      show_in_navigation: formData.get('show_in_navigation') === 'true',
      navigation_label: formData.get('navigation_label') || undefined,
      is_homepage: isHomepage,
      external_url: formData.get('external_url') || null,
    })

    if (!validation.success) {
      console.error('❌ [createPage] Schema validation failed:', validation.error.flatten().fieldErrors)
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
        message: 'Invalid fields. Please check the form.',
      }
    }

    console.log('✅ [createPage] Schema validation passed')

    // Validate hierarchical slug structure
    console.log('🔗 [createPage] Validating slug hierarchy...')
    const slugValidation = await validateSlugHierarchy(
      finalSlug,
      parentId || null,
      null,
      supabase
    )

    if (!slugValidation.valid) {
      console.error('❌ [createPage] Slug hierarchy validation failed:', slugValidation.error)
      return { success: false, message: slugValidation.error }
    }

    console.log('✅ [createPage] Slug hierarchy validated')

    // If setting as homepage, unset any existing homepage
    if (validation.data.is_homepage) {
      console.log('🏠 [createPage] Unsetting existing homepage...')
      await supabase.from('cms_pages').update({ is_homepage: false }).eq('is_homepage', true)
    }

    // Get default blocks from template if provided
    let defaultBlocks: unknown[] = []
    if (validation.data.template_id) {
      console.log('📄 [createPage] Fetching template blocks...')
      const { data: template } = await supabase
        .from('cms_page_templates')
        .select('default_blocks')
        .eq('id', validation.data.template_id)
        .single()

      if (template?.default_blocks) {
        defaultBlocks = template.default_blocks as unknown[]
        console.log('✅ [createPage] Template blocks loaded:', defaultBlocks.length)
      }
    }

    // Get redirect URL from form (stored in metadata)
    const redirectUrl = (formData.get('redirect_url') as string) || null

    // Build metadata object
    const metadata = redirectUrl ? { redirect_url: redirectUrl } : null

    // Create page
    console.log('💾 [createPage] Creating page in database...')
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
        external_url: validation.data.external_url,
        metadata,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('❌ [createPage] Database error:', error)
      return { success: false, message: 'Failed to create page. Please try again.' }
    }

    console.log('✅ [createPage] Page created in database:', page.id)

    // Create default blocks from template
    if (defaultBlocks.length > 0) {
      console.log('📦 [createPage] Inserting default blocks...')
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
      console.log('✅ [createPage] Default blocks inserted')
    }

    // Create default SEO metadata
    console.log('🔍 [createPage] Creating SEO metadata...')
    await supabase.from('cms_seo_metadata').insert({
      page_id: page.id,
      meta_title: validation.data.title,
    })

    // Create default FAB config
    console.log('⚙️ [createPage] Creating FAB config...')
    await supabase.from('cms_page_fab_config').insert({
      page_id: page.id,
      is_enabled: false,
    })

    // Log activity
    console.log('📝 [createPage] Logging activity...')
    await logActivity({
      userId: user.id,
      action: 'create',
      module: 'cms',
      resourceType: 'page',
      resourceId: page.id,
      metadata: { title: validation.data.title, slug: validation.data.slug },
    })

    // Revalidate cache (non-blocking)
    try {
      revalidatePath('/admin/content/pages')
    } catch (error) {
      // Log error but don't fail the operation since page was created successfully
      console.error('Cache revalidation failed:', error)
    }

    console.log('✅ [createPage] Page created successfully:', page.id)
    return { success: true, message: 'Page created successfully', data: { id: page.id } }
  } catch (error) {
    console.error('💥 [createPage] Fatal error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
    }
  }
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

  // Get page ID and new values
  const pageId = formData.get('id') as string
  const newSlug = formData.get('slug') as string | undefined
  const newParentId = formData.get('parent_id') as string | null
  const isHomepage = formData.get('is_homepage') === 'true'
  const slugOverridden = formData.get('slug_overridden') === 'true'

  // Get current page state
  const { data: currentPage, error: fetchError } = await supabase
    .from('cms_pages')
    .select('slug, parent_id, slug_overridden, hierarchical_slug')
    .eq('id', pageId)
    .single()

  if (fetchError || !currentPage) {
    return { success: false, message: 'Page not found' }
  }

  // Detect if parent is changing
  const parentChanged = currentPage.parent_id !== newParentId
  const slugChanged = newSlug && newSlug !== currentPage.slug
  const overrideChanged = slugOverridden !== (currentPage.slug_overridden ?? false)

  // Prevent circular parent references
  if (newParentId && newParentId !== 'none' && newParentId !== '') {
    const circularCheck = await preventCircularParent(pageId, newParentId, supabase)
    if (!circularCheck.valid) {
      return { success: false, message: circularCheck.error }
    }
  }

  // Build hierarchical slug if parent changed OR slug changed
  let finalSlug = newSlug || currentPage.slug
  let hierarchicalSlug = currentPage.hierarchical_slug || currentPage.slug

  // Handle slug override logic
  if (slugOverridden) {
    // Custom URL mode: use slug as-is, don't prepend parent
    finalSlug = newSlug || currentPage.slug

    // But still calculate hierarchical_slug for navigation context
    const effectiveParentId = newParentId !== undefined ? newParentId : currentPage.parent_id

    if (effectiveParentId && effectiveParentId !== 'none' && effectiveParentId !== '') {
      const { data: parent } = await supabase
        .from('cms_pages')
        .select('slug, hierarchical_slug')
        .eq('id', effectiveParentId)
        .single()

      if (!parent) {
        return { success: false, message: 'Parent page not found' }
      }

      // Use parent's hierarchical_slug for proper nesting
      const parentHierarchical = parent.hierarchical_slug || parent.slug
      const segment = extractSlugSegment(finalSlug)
      hierarchicalSlug = `${parentHierarchical}/${segment}`
    } else {
      // Root level page
      hierarchicalSlug = extractSlugSegment(finalSlug)
    }
  } else {
    // Hierarchical mode (current behavior): build from parent
    if (slugChanged || parentChanged) {
      const effectiveParentId = newParentId !== undefined ? newParentId : currentPage.parent_id

      if (effectiveParentId && effectiveParentId !== 'none' && effectiveParentId !== '') {
        const { data: parent } = await supabase
          .from('cms_pages')
          .select('slug, hierarchical_slug')
          .eq('id', effectiveParentId)
          .single()

        if (!parent) {
          return { success: false, message: 'Parent page not found' }
        }

        // Build hierarchical slug from parent's hierarchical path
        const parentHierarchical = parent.hierarchical_slug || parent.slug
        const segment = extractSlugSegment(newSlug || currentPage.slug)
        finalSlug = `${parentHierarchical}/${segment}`
        hierarchicalSlug = finalSlug
      } else {
        // Root level page: use segment only
        finalSlug = extractSlugSegment(newSlug || currentPage.slug)
        hierarchicalSlug = finalSlug
      }
    }
  }

  // Validate homepage parent constraint
  const homepageValidation = validateHomepageParent(isHomepage, newParentId)
  if (!homepageValidation.valid) {
    return { success: false, message: homepageValidation.error }
  }

  // Validate slug depth if slug is being updated
  if (finalSlug !== currentPage.slug) {
    const depthValidation = validateSlugDepth(finalSlug)
    if (!depthValidation.valid) {
      return { success: false, message: depthValidation.error }
    }

    // Validate hierarchical slug structure (skip if override is enabled)
    // When slug_overridden is true, the slug can be independent of parent hierarchy
    if (!slugOverridden) {
      const slugValidation = await validateSlugHierarchy(
        finalSlug,
        newParentId || null,
        pageId,
        supabase
      )

      if (!slugValidation.valid) {
        return { success: false, message: slugValidation.error }
      }
    }
  }

  // Validate input
  const sortOrderValue = formData.get('sort_order')
  const descriptionValue = formData.get('description')
  const validation = UpdatePageSchema.safeParse({
    id: pageId,
    title: formData.get('title') || undefined,
    slug: finalSlug,
    description: descriptionValue !== null ? String(descriptionValue) : undefined,
    parent_id: newParentId || null,
    status: formData.get('status') || undefined,
    visibility: formData.get('visibility') || undefined,
    featured_image: formData.get('featured_image') || null,
    sort_order: sortOrderValue ? parseInt(String(sortOrderValue), 10) : undefined,
    show_in_navigation:
      formData.get('show_in_navigation') !== null
        ? formData.get('show_in_navigation') === 'true'
        : undefined,
    navigation_label: formData.get('navigation_label') || undefined,
    is_homepage: isHomepage || undefined,
    external_url: formData.get('external_url') || undefined,
    slug_overridden: slugOverridden,
    hierarchical_slug: hierarchicalSlug,
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { id, ...updateData } = validation.data

  // If setting as homepage, unset any existing homepage
  if (updateData.is_homepage) {
    await supabase.from('cms_pages').update({ is_homepage: false }).neq('id', id).eq('is_homepage', true)
  }

  // Handle redirect_url stored in metadata
  const redirectUrl = formData.get('redirect_url') as string | null

  // Fetch existing metadata to preserve other fields
  const { data: existingPage } = await supabase
    .from('cms_pages')
    .select('metadata')
    .eq('id', id)
    .single()

  // Build updated metadata object
  let updatedMetadata = (existingPage?.metadata as Record<string, unknown>) || {}
  if (redirectUrl !== null) {
    if (redirectUrl) {
      updatedMetadata = { ...updatedMetadata, redirect_url: redirectUrl }
    } else {
      // Remove redirect_url if empty string
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { redirect_url: _, ...rest } = updatedMetadata
      updatedMetadata = rest
    }
  }

  // Update page
  const { error } = await supabase
    .from('cms_pages')
    .update({
      ...updateData,
      metadata: Object.keys(updatedMetadata).length > 0 ? updatedMetadata : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating page:', error)
    return { success: false, message: 'Failed to update page. Please try again.' }
  }

  // Update SEO metadata if provided
  const metaTitle = formData.get('meta_title')
  const metaDescription = formData.get('meta_description')

  if (metaTitle !== null || metaDescription !== null) {
    // Check if SEO metadata exists
    const { data: existingSeo } = await supabase
      .from('cms_seo_metadata')
      .select('id')
      .eq('page_id', id)
      .single()

    const seoData: Record<string, unknown> = {}
    if (metaTitle !== null) seoData.meta_title = String(metaTitle)
    if (metaDescription !== null) seoData.meta_description = String(metaDescription)
    seoData.updated_at = new Date().toISOString()

    if (existingSeo) {
      // Update existing SEO metadata
      await supabase
        .from('cms_seo_metadata')
        .update(seoData)
        .eq('page_id', id)
    } else {
      // Create new SEO metadata
      await supabase
        .from('cms_seo_metadata')
        .insert({
          page_id: id,
          ...seoData,
        })
    }
  }

  // Cascade slug updates to children if slug changed
  let childrenAffected = 0
  if (currentPage.slug !== finalSlug) {
    try {
      const children = await getPageChildren(id, supabase)
      childrenAffected = children.length

      if (childrenAffected > 0) {
        await updateChildSlugs(id, finalSlug, supabase)
      }
    } catch (cascadeError) {
      console.error('Error cascading slug updates:', cascadeError)
      // Don't fail the update - children can be updated manually if needed
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'cms',
    resourceType: 'page',
    resourceId: id,
    metadata: {
      changes: updateData,
      slug_changed: currentPage.slug !== finalSlug,
      children_affected: childrenAffected,
      parent_changed: parentChanged,
    },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${id}`)
  revalidatePath('/', 'layout') // Revalidate public layout to refresh navigation

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

  // Get page slug for revalidation
  const { data: pageData } = await supabase
    .from('cms_pages')
    .select('slug, hierarchical_slug')
    .eq('id', pageId)
    .single()

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

  // Revalidate the public page path
  if (pageData) {
    const publicPath = pageData.hierarchical_slug || pageData.slug
    revalidatePath(`/${publicPath}`)
    revalidatePath('/', 'layout') // Revalidate layout to refresh navigation
  }

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

  // Soft delete page (move to trash) instead of hard delete
  const { error } = await supabase
    .from('cms_pages')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

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
    metadata: { title: page.title, slug: page.slug, deletionType: 'soft' },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath('/admin/content/pages/trash')

  return { success: true, message: 'Page moved to trash. It will be permanently deleted after 30 days.' }
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

  // Get page creator to notify them
  const { data: pageData } = await supabase
    .from('cms_pages')
    .select('created_by')
    .eq('id', pageId)
    .single()

  // Notify the page creator (if not the same as publisher)
  if (pageData?.created_by && pageData.created_by !== user.id) {
    await NotificationHelpers.contentPublished(
      pageData.created_by,
      page.title,
      page.slug
    )
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
  revalidatePath('/', 'layout') // Revalidate public layout to refresh navigation

  return { success: true, message: 'Page published successfully' }
}

/**
 * Schedule a page for future publishing
 */
export async function schedulePagePublish(
  pageId: string,
  publishAt: Date
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
  const hasPermission = await checkPermission(user.id, 'cms:pages:publish')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to schedule pages' }
  }

  // Validate the publish date is in the future
  if (publishAt <= new Date()) {
    return { success: false, message: 'Scheduled publish date must be in the future' }
  }

  // Update page status to scheduled
  const { data: page, error } = await supabase
    .from('cms_pages')
    .update({
      status: 'scheduled',
      scheduled_publish_at: publishAt.toISOString(),
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)
    .select('title, slug')
    .single()

  if (error) {
    console.error('Error scheduling page:', error)
    return { success: false, message: 'Failed to schedule page. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'schedule',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: {
      title: page.title,
      slug: page.slug,
      scheduled_publish_at: publishAt.toISOString(),
    },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)
  revalidatePath(`/admin/content/pages/${pageId}/edit`)

  return {
    success: true,
    message: `Page scheduled to publish on ${publishAt.toLocaleDateString()} at ${publishAt.toLocaleTimeString()}`,
  }
}

/**
 * Cancel scheduled publishing
 */
export async function cancelScheduledPublish(pageId: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to manage scheduled pages' }
  }

  // Update page status back to draft
  const { data: page, error } = await supabase
    .from('cms_pages')
    .update({
      status: 'draft',
      scheduled_publish_at: null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)
    .eq('status', 'scheduled')
    .select('title, slug')
    .single()

  if (error) {
    console.error('Error canceling scheduled publish:', error)
    return { success: false, message: 'Failed to cancel scheduled publish. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'cancel_schedule',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, slug: page.slug },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)
  revalidatePath(`/admin/content/pages/${pageId}/edit`)

  return { success: true, message: 'Scheduled publish canceled. Page is now a draft.' }
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

  // Revalidate admin and public pages
  revalidatePath('/admin/content/pages')
  revalidatePath('/', 'layout') // Revalidate public layout to refresh navigation

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

/**
 * Update SEO metadata for a page
 */
export async function updatePageSeo(
  pageId: string,
  seoData: {
    meta_title?: string | null
    meta_description?: string | null
    meta_keywords?: string[] | null
    canonical_url?: string | null
    robots_directive?: string | null
    og_title?: string | null
    og_description?: string | null
    og_image?: string | null
    og_type?: string | null
    twitter_card?: string | null
    twitter_title?: string | null
    twitter_description?: string | null
    twitter_image?: string | null
    structured_data?: Record<string, unknown>[] | null
    custom_head_tags?: string | null
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
    return { success: false, message: 'You do not have permission to edit page SEO' }
  }

  // Check if SEO record exists
  const { data: existingSeo } = await supabase
    .from('cms_seo_metadata')
    .select('id')
    .eq('page_id', pageId)
    .single()

  // Calculate SEO score based on filled fields
  let seoScore = 0
  if (seoData.meta_title && seoData.meta_title.length >= 30 && seoData.meta_title.length <= 60) seoScore += 20
  else if (seoData.meta_title) seoScore += 10
  if (seoData.meta_description && seoData.meta_description.length >= 120 && seoData.meta_description.length <= 160) seoScore += 20
  else if (seoData.meta_description) seoScore += 10
  if (seoData.meta_keywords && seoData.meta_keywords.length > 0) seoScore += 10
  if (seoData.og_title) seoScore += 10
  if (seoData.og_description) seoScore += 10
  if (seoData.og_image) seoScore += 10
  if (seoData.twitter_title || seoData.og_title) seoScore += 5
  if (seoData.twitter_description || seoData.og_description) seoScore += 5
  if (seoData.twitter_image || seoData.og_image) seoScore += 5
  if (seoData.canonical_url) seoScore += 5

  const updateData = {
    ...seoData,
    seo_score: seoScore,
    last_analyzed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (existingSeo) {
    // Update existing record
    const { error } = await supabase
      .from('cms_seo_metadata')
      .update(updateData)
      .eq('id', existingSeo.id)

    if (error) {
      console.error('Error updating SEO:', error)
      return { success: false, message: 'Failed to update SEO settings' }
    }
  } else {
    // Create new record
    const { error } = await supabase.from('cms_seo_metadata').insert({
      page_id: pageId,
      ...updateData,
    })

    if (error) {
      console.error('Error creating SEO:', error)
      return { success: false, message: 'Failed to create SEO settings' }
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
    action: 'edit_seo',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { seo_score: seoScore },
  })

  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'SEO settings saved', data: { seo_score: seoScore } }
}

/**
 * Get SEO metadata for a page
 */
export async function getPageSeo(pageId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_seo_metadata')
    .select('*')
    .eq('page_id', pageId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching SEO:', error)
    return null
  }

  return data
}

/**
 * Update FAB configuration for a page
 */
export async function updatePageFab(
  pageId: string,
  fabConfig: {
    is_enabled?: boolean
    position?: string
    theme?: string
    primary_action?: string
    custom_action_label?: string | null
    custom_action_url?: string | null
    custom_action_icon?: string | null
    show_whatsapp?: boolean
    show_phone?: boolean
    show_email?: boolean
    show_directions?: boolean
    whatsapp_number?: string | null
    phone_number?: string | null
    email_address?: string | null
    directions_url?: string | null
    animation?: string
    delay_ms?: number
    hide_on_scroll?: boolean
    custom_css?: string | null
    // Admin actions
    show_add?: boolean
    add_label?: string | null
    add_url?: string | null
    show_edit?: boolean
    edit_label?: string | null
    show_update?: boolean
    update_label?: string | null
    show_settings?: boolean
    settings_label?: string | null
    settings_url?: string | null
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
    return { success: false, message: 'You do not have permission to edit page FAB settings' }
  }

  // Check if FAB record exists
  const { data: existingFab } = await supabase
    .from('cms_page_fab_config')
    .select('id')
    .eq('page_id', pageId)
    .single()

  const updateData = {
    ...fabConfig,
    updated_at: new Date().toISOString(),
  }

  if (existingFab) {
    // Update existing record
    const { error } = await supabase
      .from('cms_page_fab_config')
      .update(updateData)
      .eq('id', existingFab.id)

    if (error) {
      console.error('Error updating FAB config:', error)
      return { success: false, message: 'Failed to update FAB settings' }
    }
  } else {
    // Create new record
    const { error } = await supabase.from('cms_page_fab_config').insert({
      page_id: pageId,
      ...updateData,
    })

    if (error) {
      console.error('Error creating FAB config:', error)
      return { success: false, message: 'Failed to create FAB settings' }
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
    action: 'edit_fab',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { is_enabled: fabConfig.is_enabled },
  })

  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'FAB settings saved' }
}

/**
 * Get FAB configuration for a page
 */
export async function getPageFab(pageId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_fab_config')
    .select('*')
    .eq('page_id', pageId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching FAB config:', error)
    return null
  }

  return data
}

/**
 * Update page typography settings (stored in metadata.typography)
 */
export async function updatePageTypography(
  pageId: string,
  typography: {
    title?: {
      fontSize?: string
      fontWeight?: string
      fontStyle?: string
      color?: string
    }
    subtitle?: {
      fontSize?: string
      fontWeight?: string
      fontStyle?: string
      color?: string
    }
    badge?: {
      fontSize?: string
      fontWeight?: string
      fontStyle?: string
      color?: string
      backgroundColor?: string
    }
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
    return { success: false, message: 'You do not have permission to edit page typography' }
  }

  // Get current page metadata
  const { data: page, error: fetchError } = await supabase
    .from('cms_pages')
    .select('metadata')
    .eq('id', pageId)
    .single()

  if (fetchError) {
    console.error('Error fetching page:', fetchError)
    return { success: false, message: 'Failed to fetch page' }
  }

  // Merge typography into existing metadata
  const currentMetadata = (page?.metadata as Record<string, unknown>) || {}
  const updatedMetadata = {
    ...currentMetadata,
    typography,
  }

  // Update page metadata
  const { error } = await supabase
    .from('cms_pages')
    .update({
      metadata: updatedMetadata,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('Error updating typography:', error)
    return { success: false, message: 'Failed to update typography settings' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit_typography',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { typography },
  })

  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Typography settings saved' }
}

/**
 * Get page typography settings from metadata
 */
export async function getPageTypography(pageId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select('metadata')
    .eq('id', pageId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching page metadata:', error)
    return null
  }

  const metadata = data?.metadata as Record<string, unknown> | null
  return metadata?.typography || null
}

// ============================================
// APPROVAL WORKFLOW FUNCTIONS
// ============================================

export type PageReviewAction = 'submitted' | 'approved' | 'rejected' | 'revision_requested'

/**
 * Submit a page for review (for users without publish permission)
 */
export async function submitPageForReview(pageId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check edit permission (not publish - that's for approvers)
  const hasEditPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasEditPermission) {
    return { success: false, message: 'You do not have permission to edit pages' }
  }

  // Get current page status
  const { data: page, error: fetchError } = await supabase
    .from('cms_pages')
    .select('title, slug, status')
    .eq('id', pageId)
    .single()

  if (fetchError || !page) {
    return { success: false, message: 'Page not found' }
  }

  // Only draft pages can be submitted for review
  if (page.status !== 'draft') {
    return { success: false, message: 'Only draft pages can be submitted for review' }
  }

  // Update page status to pending_review
  const { error } = await supabase
    .from('cms_pages')
    .update({
      status: 'pending_review',
      submitted_for_review_at: new Date().toISOString(),
      submitted_by: user.id,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('Error submitting page for review:', error)
    return { success: false, message: 'Failed to submit page for review' }
  }

  // Create review history entry
  await supabase.from('cms_page_reviews').insert({
    page_id: pageId,
    action: 'submitted',
    from_status: 'draft',
    to_status: 'pending_review',
    reviewed_by: user.id,
  })

  // Notify users with approve permission (super_admin and admin)
  const { data: approvers } = await supabase
    .from('user_roles')
    .select('user_id, roles!inner(name)')
    .in('roles.name', ['super_admin', 'admin'])

  if (approvers) {
    for (const approver of approvers) {
      if (approver.user_id !== user.id) {
        await NotificationHelpers.contentNeedsReview(
          approver.user_id,
          page.title,
          pageId
        )
      }
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'submit_for_review',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, slug: page.slug },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Page submitted for review' }
}

/**
 * Approve a page and optionally publish it
 */
export async function approvePage(
  pageId: string,
  options?: { notes?: string; publishImmediately?: boolean }
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check approve permission
  const hasApprovePermission = await checkPermission(user.id, 'content:pages:approve')
  if (!hasApprovePermission) {
    return { success: false, message: 'You do not have permission to approve pages' }
  }

  // Get current page
  const { data: page, error: fetchError } = await supabase
    .from('cms_pages')
    .select('title, slug, status, submitted_by')
    .eq('id', pageId)
    .single()

  if (fetchError || !page) {
    return { success: false, message: 'Page not found' }
  }

  // Only pending_review pages can be approved
  if (page.status !== 'pending_review') {
    return { success: false, message: 'Only pages pending review can be approved' }
  }

  const newStatus = options?.publishImmediately ? 'published' : 'approved'
  const publishedAt = options?.publishImmediately ? new Date().toISOString() : null

  // Update page status
  const { error } = await supabase
    .from('cms_pages')
    .update({
      status: newStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_notes: options?.notes || null,
      published_at: publishedAt,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('Error approving page:', error)
    return { success: false, message: 'Failed to approve page' }
  }

  // Create review history entry
  await supabase.from('cms_page_reviews').insert({
    page_id: pageId,
    action: 'approved',
    from_status: 'pending_review',
    to_status: newStatus,
    notes: options?.notes,
    reviewed_by: user.id,
  })

  // Notify the submitter
  if (page.submitted_by && page.submitted_by !== user.id) {
    await NotificationHelpers.contentPublished(
      page.submitted_by,
      `Your page "${page.title}" has been approved${options?.publishImmediately ? ' and published' : ''}`,
      `/admin/content/pages/${pageId}`
    )
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: options?.publishImmediately ? 'approve_and_publish' : 'approve',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, notes: options?.notes },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)
  if (options?.publishImmediately) {
    revalidatePath(`/${page.slug}`)
    revalidatePath('/', 'layout')
  }

  return {
    success: true,
    message: options?.publishImmediately
      ? 'Page approved and published'
      : 'Page approved. It can now be published.',
  }
}

/**
 * Reject a page review
 */
export async function rejectPage(pageId: string, notes: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check approve permission
  const hasApprovePermission = await checkPermission(user.id, 'content:pages:approve')
  if (!hasApprovePermission) {
    return { success: false, message: 'You do not have permission to reject pages' }
  }

  if (!notes || notes.trim().length === 0) {
    return { success: false, message: 'Please provide a reason for rejection' }
  }

  // Get current page
  const { data: page, error: fetchError } = await supabase
    .from('cms_pages')
    .select('title, slug, status, submitted_by')
    .eq('id', pageId)
    .single()

  if (fetchError || !page) {
    return { success: false, message: 'Page not found' }
  }

  if (page.status !== 'pending_review') {
    return { success: false, message: 'Only pages pending review can be rejected' }
  }

  // Update page status back to draft
  const { error } = await supabase
    .from('cms_pages')
    .update({
      status: 'draft',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_notes: notes,
      submitted_for_review_at: null,
      submitted_by: null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('Error rejecting page:', error)
    return { success: false, message: 'Failed to reject page' }
  }

  // Create review history entry
  await supabase.from('cms_page_reviews').insert({
    page_id: pageId,
    action: 'rejected',
    from_status: 'pending_review',
    to_status: 'draft',
    notes,
    reviewed_by: user.id,
  })

  // Notify the submitter
  if (page.submitted_by && page.submitted_by !== user.id) {
    await NotificationHelpers.contentPublished(
      page.submitted_by,
      `Your page "${page.title}" was not approved. Reason: ${notes}`,
      `/admin/content/pages/${pageId}`
    )
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'reject',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, notes },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Page rejected. The author has been notified.' }
}

/**
 * Request revision on a page (similar to reject but with different messaging)
 */
export async function requestPageRevision(pageId: string, notes: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check approve permission
  const hasApprovePermission = await checkPermission(user.id, 'content:pages:approve')
  if (!hasApprovePermission) {
    return { success: false, message: 'You do not have permission to request revisions' }
  }

  if (!notes || notes.trim().length === 0) {
    return { success: false, message: 'Please provide revision instructions' }
  }

  // Get current page
  const { data: page, error: fetchError } = await supabase
    .from('cms_pages')
    .select('title, slug, status, submitted_by')
    .eq('id', pageId)
    .single()

  if (fetchError || !page) {
    return { success: false, message: 'Page not found' }
  }

  if (page.status !== 'pending_review') {
    return { success: false, message: 'Only pages pending review can have revisions requested' }
  }

  // Update page status back to draft
  const { error } = await supabase
    .from('cms_pages')
    .update({
      status: 'draft',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_notes: notes,
      submitted_for_review_at: null,
      submitted_by: null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('Error requesting revision:', error)
    return { success: false, message: 'Failed to request revision' }
  }

  // Create review history entry
  await supabase.from('cms_page_reviews').insert({
    page_id: pageId,
    action: 'revision_requested',
    from_status: 'pending_review',
    to_status: 'draft',
    notes,
    reviewed_by: user.id,
  })

  // Notify the submitter
  if (page.submitted_by && page.submitted_by !== user.id) {
    await NotificationHelpers.contentPublished(
      page.submitted_by,
      `Revision requested for "${page.title}": ${notes}`,
      `/admin/content/pages/${pageId}/edit`
    )
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'request_revision',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, notes },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Revision requested. The author has been notified.' }
}

/**
 * Get all pages pending review (for approval queue)
 */
export async function getPendingReviews(options?: {
  page?: number
  limit?: number
}) {
  const supabase = await createServerSupabaseClient()
  const { page = 1, limit = 20 } = options || {}

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { pages: [], total: 0, page: 1, limit: 20, totalPages: 0 }
  }

  // Check if user can approve
  const hasApprovePermission = await checkPermission(user.id, 'content:pages:approve')
  if (!hasApprovePermission) {
    return { pages: [], total: 0, page: 1, limit: 20, totalPages: 0 }
  }

  // Get total count
  const { count } = await supabase
    .from('cms_pages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending_review')

  const total = count || 0
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Get pending pages with submitter info
  const { data, error } = await supabase
    .from('cms_pages')
    .select(`
      id,
      title,
      slug,
      status,
      submitted_for_review_at,
      submitted_by,
      created_at,
      updated_at,
      profiles:submitted_by (
        full_name,
        email
      )
    `)
    .eq('status', 'pending_review')
    .order('submitted_for_review_at', { ascending: true })
    .range(from, to)

  if (error) {
    console.error('Error fetching pending reviews:', error)
    return { pages: [], total: 0, page, limit, totalPages: 0 }
  }

  return {
    pages: data || [],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Get review history for a page
 */
export async function getPageReviewHistory(pageId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_reviews')
    .select(`
      id,
      action,
      from_status,
      to_status,
      notes,
      created_at,
      profiles:reviewed_by (
        full_name,
        email
      )
    `)
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching review history:', error)
    return []
  }

  return data || []
}

/**
 * Get deleted pages (trash bin)
 */
export async function getDeletedPages(options?: {
  page?: number
  limit?: number
  search?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { page = 1, limit = 20, search } = options || {}

  // Permission check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { pages: [], total: 0, page, limit, totalPages: 0 }
  }

  // Check if user has permission to view trash
  const { data: hasPermission } = await supabase.rpc('has_permission', {
    user_uuid: user.id,
    required_permission: 'cms:pages:delete'
  })

  if (!hasPermission) {
    return { pages: [], total: 0, page, limit, totalPages: 0 }
  }

  // Build query for deleted pages only
  let query = supabase
    .from('cms_pages')
    .select(`
      id,
      title,
      slug,
      description,
      status,
      visibility,
      is_homepage,
      show_in_navigation,
      sort_order,
      parent_id,
      created_at,
      updated_at,
      deleted_at,
      created_by,
      deleted_by,
      cms_seo_metadata (
        seo_score
      )
    `, { count: 'exact' })
    .not('deleted_at', 'is', null) // Only show deleted pages
    .order('deleted_at', { ascending: false }) // Most recently deleted first

  // Apply search filter if provided
  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`)
  }

  // Get total count
  const { count: total } = await query

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching deleted pages:', error)
    return { pages: [], total: 0, page, limit, totalPages: 0 }
  }

  // Fetch creator and deleter profiles separately
  const pagesWithProfiles = await Promise.all((data || []).map(async (page) => {
    let creator = null
    let deleter = null

    // Fetch creator profile
    if (page.created_by) {
      const { data: creatorProfile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', page.created_by)
        .single()
      creator = creatorProfile
    }

    // Fetch deleter profile
    if (page.deleted_by) {
      const { data: deleterProfile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', page.deleted_by)
        .single()
      deleter = deleterProfile
    }

    return {
      ...page,
      creator,
      deleter
    }
  }))

  return {
    pages: pagesWithProfiles,
    total: total || 0,
    page,
    limit,
    totalPages: Math.ceil((total || 0) / limit),
  }
}

/**
 * Restore a deleted page from trash
 */
export async function restorePage(pageId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'You must be logged in to restore pages.' }
  }

  // Check permission
  const { data: hasPermission } = await supabase.rpc('has_permission', {
    user_uuid: user.id,
    required_permission: 'cms:pages:restore'
  })

  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to restore pages.' }
  }

  // Get page details before restoring
  const { data: page } = await supabase
    .from('cms_pages')
    .select('title, slug, deleted_at')
    .eq('id', pageId)
    .single()

  if (!page || !page.deleted_at) {
    return { success: false, message: 'Page not found in trash.' }
  }

  // Restore page using database function
  const { data: restored, error } = await supabase.rpc('restore_page', {
    page_uuid: pageId
  })

  if (error || !restored) {
    console.error('Error restoring page:', error)
    return { success: false, message: 'Failed to restore page. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'restore',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, slug: page.slug },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath('/admin/content/pages/trash')

  return { success: true, message: `Page "${page.title}" has been restored successfully.` }
}

/**
 * Permanently delete a page from trash
 */
export async function permanentlyDeletePage(pageId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'You must be logged in to delete pages.' }
  }

  // Check permission
  const { data: hasPermission } = await supabase.rpc('has_permission', {
    user_uuid: user.id,
    required_permission: 'cms:pages:delete'
  })

  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to permanently delete pages.' }
  }

  // Get page details before deleting
  const { data: page } = await supabase
    .from('cms_pages')
    .select('title, slug, deleted_at')
    .eq('id', pageId)
    .single()

  if (!page || !page.deleted_at) {
    return { success: false, message: 'Page not found in trash.' }
  }

  // Permanently delete page using database function
  const { data: deleted, error } = await supabase.rpc('permanently_delete_page', {
    page_uuid: pageId
  })

  if (error || !deleted) {
    console.error('Error permanently deleting page:', error)
    return { success: false, message: 'Failed to permanently delete page. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { title: page.title, slug: page.slug, deletionType: 'permanent' },
  })

  revalidatePath('/admin/content/pages')
  revalidatePath('/admin/content/pages/trash')

  return { success: true, message: `Page "${page.title}" has been permanently deleted.` }
}

/**
 * Get trash statistics
 */
export async function getTrashStatistics(): Promise<{ total_in_trash: number; expiring_soon: number }> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.rpc('get_trash_statistics').single()

  if (error) {
    console.error('Error fetching trash statistics:', error)
    return { total_in_trash: 0, expiring_soon: 0 }
  }

  return (data as { total_in_trash: number; expiring_soon: number }) || { total_in_trash: 0, expiring_soon: 0 }
}
