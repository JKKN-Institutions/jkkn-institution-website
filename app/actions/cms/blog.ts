'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Content size validation constants
const MAX_CONTENT_SIZE_MB = 2.5 // MB (buffer before 3MB Next.js limit)

// Custom content size validator
const contentSizeValidator = z.any().refine(
  (content) => {
    try {
      const size = new Blob([JSON.stringify(content)]).size
      const sizeMB = size / (1024 * 1024)
      return sizeMB < MAX_CONTENT_SIZE_MB
    } catch {
      return false
    }
  },
  {
    message: `Content size exceeds ${MAX_CONTENT_SIZE_MB}MB limit. Please reduce content size or ensure images are uploaded to the media library (not embedded as base64).`,
  }
)

// Validation schemas
const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(300, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().max(500).optional().nullable(),
  content: contentSizeValidator, // JSON content from rich text editor with size validation
  featured_image: z.string().url().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  author_id: z.string().uuid(),
  co_authors: z.array(z.string().uuid()).optional().default([]),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
  visibility: z.enum(['public', 'private', 'password_protected']).default('public'),
  password_hash: z.string().optional().nullable(),
  published_at: z.string().datetime().optional().nullable(),
  scheduled_at: z.string().datetime().optional().nullable(),
  reading_time_minutes: z.coerce.number().min(1).default(5),
  is_featured: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  allow_comments: z.boolean().default(true),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(500).optional().nullable(),
  seo_keywords: z.array(z.string()).optional().default([]),
  og_image: z.string().url().optional().nullable(),
  canonical_url: z.string().url().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().default({}),
})

const UpdatePostSchema = CreatePostSchema.partial().extend({
  id: z.string().uuid('Invalid post ID'),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived'
export type PostVisibility = 'public' | 'private' | 'password_protected'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: Record<string, unknown>
  featured_image: string | null
  category_id: string | null
  author_id: string
  co_authors: string[] | null
  status: PostStatus | null
  visibility: PostVisibility | null
  password_hash: string | null
  published_at: string | null
  scheduled_at: string | null
  reading_time_minutes: number | null
  view_count: number | null
  is_featured: boolean | null
  is_pinned: boolean | null
  allow_comments: boolean | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  og_image: string | null
  canonical_url: string | null
  metadata: Record<string, unknown> | null
  created_by: string | null
  updated_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface BlogPostWithRelations extends BlogPost {
  category?: {
    id: string
    name: string
    slug: string
    color: string | null
  } | null
  author?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
  tags?: Array<{
    id: string
    name: string
    slug: string
    color: string | null
  }>
}

// Metadata-only types (content excluded for large posts)
export interface BlogPostMetadata extends Omit<BlogPost, 'content'> {
  content?: Record<string, unknown> // Optional for metadata-only
}

export interface BlogPostMetadataWithRelations extends Omit<BlogPostWithRelations, 'content'> {
  content?: Record<string, unknown>
}

/**
 * Get all blog posts with pagination and filtering
 */
export async function getBlogPosts(options?: {
  page?: number
  limit?: number
  status?: PostStatus
  category_id?: string
  author_id?: string
  search?: string
  is_featured?: boolean
  is_pinned?: boolean
  orderBy?: 'created_at' | 'published_at' | 'title' | 'view_count'
  orderDirection?: 'asc' | 'desc'
}) {
  const supabase = await createServerSupabaseClient()
  const {
    page = 1,
    limit = 20,
    status,
    category_id,
    author_id,
    search,
    is_featured,
    is_pinned,
    orderBy = 'created_at',
    orderDirection = 'desc',
  } = options || {}

  const offset = (page - 1) * limit

  let query = supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories!category_id (
        id, name, slug, color
      ),
      author:profiles!author_id (
        id, full_name, email, avatar_url
      )
    `,
      { count: 'exact' }
    )
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  if (category_id) {
    query = query.eq('category_id', category_id)
  }

  if (author_id) {
    query = query.eq('author_id', author_id)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured)
  }

  if (is_pinned !== undefined) {
    query = query.eq('is_pinned', is_pinned)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error('Failed to fetch blog posts')
  }

  return {
    data: data as BlogPostWithRelations[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get published blog posts for public display
 */
export async function getPublishedBlogPosts(options?: {
  page?: number
  limit?: number
  category_slug?: string
  tag_slug?: string
  author_id?: string
  search?: string
}) {
  const supabase = await createServerSupabaseClient()
  const {
    page = 1,
    limit = 10,
    category_slug,
    tag_slug,
    author_id,
    search,
  } = options || {}

  const offset = (page - 1) * limit

  let query = supabase
    .from('blog_posts')
    .select(
      `
      id, title, slug, excerpt, featured_image, published_at, reading_time_minutes, view_count,
      category:blog_categories!category_id (
        id, name, slug, color
      ),
      author:profiles!author_id (
        id, full_name, avatar_url
      )
    `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .eq('visibility', 'public')
    .lte('published_at', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category_slug) {
    // Get category ID from slug first
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', category_slug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  if (author_id) {
    query = query.eq('author_id', author_id)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching published blog posts:', error)
    throw new Error('Failed to fetch blog posts')
  }

  // If filtering by tag, we need to filter post-query
  let filteredData = data
  if (tag_slug && data) {
    // Get tag ID from slug
    const { data: tag } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('slug', tag_slug)
      .single()

    if (tag) {
      // Get post IDs that have this tag
      const { data: postTags } = await supabase
        .from('blog_post_tags')
        .select('post_id')
        .eq('tag_id', tag.id)

      const postIds = postTags?.map((pt) => pt.post_id) || []
      filteredData = data.filter((post) => postIds.includes(post.id))
    }
  }

  return {
    data: (filteredData || []) as unknown as BlogPostWithRelations[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get a single blog post by ID with all relations
 */
export async function getBlogPost(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories!category_id (
        id, name, slug, color
      ),
      author:profiles!author_id (
        id, full_name, email, avatar_url
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  // Get tags for the post
  const { data: postTags } = await supabase
    .from('blog_post_tags')
    .select(
      `
      tag:blog_tags (
        id, name, slug, color
      )
    `
    )
    .eq('post_id', id)

  const tags = postTags?.map((pt) => pt.tag).filter(Boolean) || []

  return { ...post, tags } as BlogPostWithRelations
}

/**
 * Get blog post metadata without content (for edit page with large posts)
 * Excludes the content field to avoid Next.js props serialization limit (~128KB)
 */
export async function getBlogPostMetadata(id: string) {
  const supabase = await createServerSupabaseClient()

  // Select all fields EXCEPT content to keep props small
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(
      `
      id, title, slug, excerpt, featured_image, category_id, author_id,
      co_authors, status, visibility, password_hash, published_at, scheduled_at,
      reading_time_minutes, view_count, is_featured, is_pinned, allow_comments,
      seo_title, seo_description, seo_keywords, og_image, canonical_url,
      metadata, created_by, updated_by, created_at, updated_at,
      category:blog_categories!category_id (
        id, name, slug, color
      ),
      author:profiles!author_id (
        id, full_name, email, avatar_url
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post metadata:', error)
    return null
  }

  // Get tags for the post
  const { data: postTags } = await supabase
    .from('blog_post_tags')
    .select(
      `
      tag:blog_tags (
        id, name, slug, color
      )
    `
    )
    .eq('post_id', id)

  const tags = postTags?.map((pt) => pt.tag).filter(Boolean) || []

  return { ...post, tags } as unknown as BlogPostMetadataWithRelations
}

/**
 * Get only the content field of a blog post (for client-side loading)
 */
export async function getBlogPostContent(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('content')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post content:', error)
    return null
  }

  return data?.content as Record<string, unknown> | null
}

/**
 * Get a single blog post by slug (for public display)
 */
export async function getBlogPostBySlug(slug: string, incrementViews: boolean = true) {
  const supabase = await createServerSupabaseClient()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories!category_id (
        id, name, slug, color
      ),
      author:profiles!author_id (
        id, full_name, email, avatar_url
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching blog post by slug:', error)
    return null
  }

  // Get tags for the post
  const { data: postTags } = await supabase
    .from('blog_post_tags')
    .select(
      `
      tag:blog_tags (
        id, name, slug, color
      )
    `
    )
    .eq('post_id', post.id)

  const tags = postTags?.map((pt) => pt.tag).filter(Boolean) || []

  // Increment view count
  if (incrementViews) {
    await supabase
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id)
  }

  return { ...post, tags } as BlogPostWithRelations
}

/**
 * Create a new blog post
 */
export async function createBlogPost(
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
    return { success: false, message: 'You do not have permission to create blog posts' }
  }

  // Parse content JSON
  let content = {}
  try {
    const contentStr = formData.get('content')
    if (contentStr && typeof contentStr === 'string') {
      content = JSON.parse(contentStr)
    }
  } catch {
    return {
      success: false,
      message: 'Invalid content format',
      errors: { content: ['Content must be valid JSON'] },
    }
  }

  // Parse tags array
  let tagIds: string[] = []
  try {
    const tagsStr = formData.get('tags')
    if (tagsStr && typeof tagsStr === 'string') {
      tagIds = JSON.parse(tagsStr)
    }
  } catch {
    // Ignore tag parsing errors
  }

  // Parse and validate data
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt') || null,
    content,
    featured_image: formData.get('featured_image') || null,
    category_id: formData.get('category_id') || null,
    author_id: formData.get('author_id') || user.id,
    co_authors: [],
    status: formData.get('status') || 'draft',
    visibility: formData.get('visibility') || 'public',
    password_hash: formData.get('password_hash') || null,
    published_at: formData.get('published_at') || null,
    scheduled_at: formData.get('scheduled_at') || null,
    reading_time_minutes: formData.get('reading_time_minutes') || 5,
    is_featured: formData.get('is_featured') === 'true',
    is_pinned: formData.get('is_pinned') === 'true',
    allow_comments: formData.get('allow_comments') !== 'false',
    seo_title: formData.get('seo_title') || null,
    seo_description: formData.get('seo_description') || null,
    seo_keywords: [],
    og_image: formData.get('og_image') || null,
    canonical_url: formData.get('canonical_url') || null,
    metadata: {},
  }

  const validation = CreatePostSchema.safeParse(rawData)

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
      message: 'A post with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Set published_at if publishing
  const insertData = {
    ...validation.data,
    created_by: user.id,
    updated_by: user.id,
    published_at:
      validation.data.status === 'published'
        ? validation.data.published_at || new Date().toISOString()
        : validation.data.published_at,
  }

  // Create post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert([insertData])
    .select()
    .single()

  if (error) {
    console.error('Error creating blog post:', error)
    return { success: false, message: 'Failed to create post' }
  }

  // Add tags
  if (tagIds.length > 0) {
    const tagInserts = tagIds.map((tag_id) => ({ post_id: post.id, tag_id }))
    await supabase.from('blog_post_tags').insert(tagInserts)
  }

  // Create initial version
  await createPostVersion(post.id, user.id, 'manual', 'Initial version')

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms:blog',
    resourceType: 'blog_post',
    resourceId: post.id,
    metadata: { title: post.title, slug: post.slug, status: post.status },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Post created successfully',
    data: post,
  }
}

/**
 * Update a blog post
 */
export async function updateBlogPost(
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
    return { success: false, message: 'You do not have permission to edit blog posts' }
  }

  const id = formData.get('id') as string
  if (!id) {
    return { success: false, message: 'Post ID is required' }
  }

  // Get existing post
  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('status, published_at')
    .eq('id', id)
    .single()

  if (!existingPost) {
    return { success: false, message: 'Post not found' }
  }

  // Parse content JSON
  let content
  try {
    const contentStr = formData.get('content')
    if (contentStr && typeof contentStr === 'string') {
      content = JSON.parse(contentStr)
    }
  } catch {
    return {
      success: false,
      message: 'Invalid content format',
      errors: { content: ['Content must be valid JSON'] },
    }
  }

  // Parse tags array
  let tagIds: string[] | undefined
  try {
    const tagsStr = formData.get('tags')
    if (tagsStr && typeof tagsStr === 'string') {
      tagIds = JSON.parse(tagsStr)
    }
  } catch {
    // Ignore tag parsing errors
  }

  // Build update data (only include fields that are present)
  const updateData: Record<string, unknown> = {
    updated_by: user.id,
  }

  const fields = [
    'title',
    'slug',
    'excerpt',
    'featured_image',
    'category_id',
    'author_id',
    'status',
    'visibility',
    'password_hash',
    'scheduled_at',
    'reading_time_minutes',
    'seo_title',
    'seo_description',
    'og_image',
    'canonical_url',
  ]

  fields.forEach((field) => {
    const value = formData.get(field)
    if (value !== null) {
      updateData[field] = value === '' ? null : value
    }
  })

  // Handle boolean fields
  if (formData.has('is_featured')) {
    updateData.is_featured = formData.get('is_featured') === 'true'
  }
  if (formData.has('is_pinned')) {
    updateData.is_pinned = formData.get('is_pinned') === 'true'
  }
  if (formData.has('allow_comments')) {
    updateData.allow_comments = formData.get('allow_comments') !== 'false'
  }

  // Handle content
  if (content !== undefined) {
    updateData.content = content
  }

  // Handle publishing
  const newStatus = formData.get('status') as string
  if (newStatus === 'published' && existingPost.status !== 'published') {
    updateData.published_at = formData.get('published_at') || new Date().toISOString()
  }

  // Check for duplicate slug (excluding current post)
  if (updateData.slug) {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', updateData.slug as string)
      .neq('id', id)
      .single()

    if (existing) {
      return {
        success: false,
        message: 'A post with this slug already exists',
        errors: { slug: ['Slug must be unique'] },
      }
    }
  }

  // Update post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog post:', error)
    return { success: false, message: 'Failed to update post' }
  }

  // Update tags if provided
  if (tagIds !== undefined) {
    // Remove existing tags
    await supabase.from('blog_post_tags').delete().eq('post_id', id)

    // Add new tags
    if (tagIds.length > 0) {
      const tagInserts = tagIds.map((tag_id) => ({ post_id: id, tag_id }))
      await supabase.from('blog_post_tags').insert(tagInserts)
    }
  }

  // Create version on significant changes
  const shouldCreateVersion =
    content !== undefined || updateData.title || newStatus === 'published'
  if (shouldCreateVersion) {
    await createPostVersion(
      id,
      user.id,
      newStatus === 'published' ? 'publish' : 'manual',
      newStatus === 'published' ? 'Published version' : undefined
    )
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'cms:blog',
    resourceType: 'blog_post',
    resourceId: id,
    metadata: { title: post.title, status: post.status },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath(`/admin/content/blog/${id}`)
  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)

  return {
    success: true,
    message: 'Post updated successfully',
    data: post,
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to delete blog posts' }
  }

  // Get post info
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, slug')
    .eq('id', id)
    .single()

  if (!post) {
    return { success: false, message: 'Post not found' }
  }

  // Delete post (cascade will handle tags, versions, comments)
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    return { success: false, message: 'Failed to delete post' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms:blog',
    resourceType: 'blog_post',
    resourceId: id,
    metadata: { title: post.title, slug: post.slug },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Post deleted successfully',
  }
}

/**
 * Publish a blog post
 */
export async function publishBlogPost(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to publish blog posts' }
  }

  // Update post status
  const { data: post, error } = await supabase
    .from('blog_posts')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq('id', id)
    .select('title, slug')
    .single()

  if (error) {
    console.error('Error publishing blog post:', error)
    return { success: false, message: 'Failed to publish post' }
  }

  // Create published version
  await createPostVersion(id, user.id, 'publish', 'Published version')

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'publish',
    module: 'cms:blog',
    resourceType: 'blog_post',
    resourceId: id,
    metadata: { title: post.title },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)

  return {
    success: true,
    message: 'Post published successfully',
  }
}

/**
 * Unpublish a blog post (revert to draft)
 */
export async function unpublishBlogPost(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to unpublish blog posts' }
  }

  // Update post status
  const { data: post, error } = await supabase
    .from('blog_posts')
    .update({
      status: 'draft',
      updated_by: user.id,
    })
    .eq('id', id)
    .select('title, slug')
    .single()

  if (error) {
    console.error('Error unpublishing blog post:', error)
    return { success: false, message: 'Failed to unpublish post' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'unpublish',
    module: 'cms:blog',
    resourceType: 'blog_post',
    resourceId: id,
    metadata: { title: post.title },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Post unpublished successfully',
  }
}

/**
 * Archive a blog post
 */
export async function archiveBlogPost(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to archive blog posts' }
  }

  // Update post status
  const { data: post, error } = await supabase
    .from('blog_posts')
    .update({
      status: 'archived',
      updated_by: user.id,
    })
    .eq('id', id)
    .select('title')
    .single()

  if (error) {
    console.error('Error archiving blog post:', error)
    return { success: false, message: 'Failed to archive post' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'archive',
    module: 'cms:blog',
    resourceType: 'blog_post',
    resourceId: id,
    metadata: { title: post.title },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: 'Post archived successfully',
  }
}

/**
 * Toggle featured status
 */
export async function toggleBlogPostFeatured(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to edit blog posts' }
  }

  // Get current status
  const { data: post } = await supabase
    .from('blog_posts')
    .select('is_featured, title')
    .eq('id', id)
    .single()

  if (!post) {
    return { success: false, message: 'Post not found' }
  }

  // Toggle status
  const newStatus = !post.is_featured
  const { error } = await supabase
    .from('blog_posts')
    .update({ is_featured: newStatus, updated_by: user.id })
    .eq('id', id)

  if (error) {
    console.error('Error toggling featured status:', error)
    return { success: false, message: 'Failed to update post' }
  }

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: `Post ${newStatus ? 'marked as featured' : 'unmarked as featured'}`,
  }
}

/**
 * Toggle pinned status
 */
export async function toggleBlogPostPinned(id: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to edit blog posts' }
  }

  // Get current status
  const { data: post } = await supabase
    .from('blog_posts')
    .select('is_pinned, title')
    .eq('id', id)
    .single()

  if (!post) {
    return { success: false, message: 'Post not found' }
  }

  // Toggle status
  const newStatus = !post.is_pinned
  const { error } = await supabase
    .from('blog_posts')
    .update({ is_pinned: newStatus, updated_by: user.id })
    .eq('id', id)

  if (error) {
    console.error('Error toggling pinned status:', error)
    return { success: false, message: 'Failed to update post' }
  }

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: `Post ${newStatus ? 'pinned' : 'unpinned'}`,
  }
}

/**
 * Bulk delete posts
 */
export async function bulkDeleteBlogPosts(ids: string[]): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to delete blog posts' }
  }

  if (!ids.length) {
    return { success: false, message: 'No posts selected' }
  }

  // Delete posts
  const { error } = await supabase.from('blog_posts').delete().in('id', ids)

  if (error) {
    console.error('Error bulk deleting blog posts:', error)
    return { success: false, message: 'Failed to delete posts' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_delete',
    module: 'cms:blog',
    resourceType: 'blog_posts',
    metadata: { count: ids.length },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: `${ids.length} post(s) deleted successfully`,
  }
}

/**
 * Bulk update post status
 */
export async function bulkUpdateBlogPostStatus(
  ids: string[],
  status: PostStatus
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission based on status
  const requiredPermission =
    status === 'published' ? 'cms:blog:publish' : 'cms:blog:edit'
  const hasPermission = await checkPermission(user.id, requiredPermission)
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to update post status' }
  }

  if (!ids.length) {
    return { success: false, message: 'No posts selected' }
  }

  // Build update data
  const updateData: Record<string, unknown> = {
    status,
    updated_by: user.id,
  }

  if (status === 'published') {
    updateData.published_at = new Date().toISOString()
  }

  // Update posts
  const { error } = await supabase.from('blog_posts').update(updateData).in('id', ids)

  if (error) {
    console.error('Error bulk updating blog posts:', error)
    return { success: false, message: 'Failed to update posts' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: `bulk_${status}`,
    module: 'cms:blog',
    resourceType: 'blog_posts',
    metadata: { count: ids.length, status },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath('/blog')

  return {
    success: true,
    message: `${ids.length} post(s) updated to ${status}`,
  }
}

/**
 * Create a post version (for version history)
 */
async function createPostVersion(
  postId: string,
  userId: string,
  snapshotType: 'auto' | 'manual' | 'publish' = 'auto',
  description?: string
) {
  const supabase = await createServerSupabaseClient()

  // Get current post data
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, content, excerpt')
    .eq('id', postId)
    .single()

  if (!post) return

  // Get next version number using database function
  const { data: versionNumber } = await supabase.rpc('get_next_blog_post_version_number', {
    p_post_id: postId,
  })

  // Create version
  await supabase.from('blog_post_versions').insert([
    {
      post_id: postId,
      version_number: versionNumber || 1,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      snapshot_type: snapshotType,
      created_by: userId,
    },
  ])
}

/**
 * Get post versions
 */
export async function getBlogPostVersions(postId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_post_versions')
    .select(
      `
      *,
      creator:profiles!created_by (
        full_name, email
      )
    `
    )
    .eq('post_id', postId)
    .order('version_number', { ascending: false })

  if (error) {
    console.error('Error fetching blog post versions:', error)
    return []
  }

  return data
}

/**
 * Restore a post to a specific version
 */
export async function restoreBlogPostVersion(
  postId: string,
  versionId: string
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
    return { success: false, message: 'You do not have permission to restore versions' }
  }

  // Get version data
  const { data: version } = await supabase
    .from('blog_post_versions')
    .select('title, content, excerpt, version_number')
    .eq('id', versionId)
    .eq('post_id', postId)
    .single()

  if (!version) {
    return { success: false, message: 'Version not found' }
  }

  // Create a new version before restoring (to preserve current state)
  await createPostVersion(postId, user.id, 'manual', 'Before restore')

  // Update post with version data
  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: version.title,
      content: version.content,
      excerpt: version.excerpt,
      updated_by: user.id,
    })
    .eq('id', postId)

  if (error) {
    console.error('Error restoring blog post version:', error)
    return { success: false, message: 'Failed to restore version' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'restore_version',
    module: 'cms:blog',
    resourceType: 'blog_post',
    resourceId: postId,
    metadata: { version_number: version.version_number },
  })

  revalidatePath('/admin/content/blog')
  revalidatePath(`/admin/content/blog/${postId}`)

  return {
    success: true,
    message: `Restored to version ${version.version_number}`,
  }
}

/**
 * Calculate reading time from content (internal utility, not a server action)
 */
function calculateReadingTime(content: Record<string, unknown>): number {
  // Extract text from JSON content (TipTap format)
  const extractText = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as Record<string, unknown>
    if (n.text && typeof n.text === 'string') return n.text
    if (Array.isArray(n.content)) {
      return n.content.map(extractText).join(' ')
    }
    return ''
  }

  const text = extractText(content)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const wordsPerMinute = 200

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Get related posts
 */
export async function getRelatedBlogPosts(postId: string, limit: number = 3) {
  const supabase = await createServerSupabaseClient()

  // Get current post's category and tags
  const { data: currentPost } = await supabase
    .from('blog_posts')
    .select('category_id')
    .eq('id', postId)
    .single()

  const { data: currentTags } = await supabase
    .from('blog_post_tags')
    .select('tag_id')
    .eq('post_id', postId)

  const tagIds = currentTags?.map((t) => t.tag_id) || []

  // Get posts with same category or tags
  let query = supabase
    .from('blog_posts')
    .select(
      `
      id, title, slug, excerpt, featured_image, published_at,
      category:blog_categories!category_id (name, slug, color),
      author:profiles!author_id (full_name, avatar_url)
    `
    )
    .eq('status', 'published')
    .eq('visibility', 'public')
    .neq('id', postId)
    .limit(limit)

  if (currentPost?.category_id) {
    query = query.eq('category_id', currentPost.category_id)
  }

  const { data, error } = await query.order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return data
}
