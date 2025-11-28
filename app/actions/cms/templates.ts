'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Validation schemas
const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  slug: z.string().min(1, 'Template slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(500).optional(),
  thumbnail_url: z.string().url().optional().nullable(),
  default_blocks: z.array(z.unknown()).default([]),
  category: z.enum(['general', 'landing', 'content', 'blog', 'portfolio', 'ecommerce']).default('general'),
})

const UpdateTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  default_blocks: z.array(z.unknown()).optional(),
  category: z.enum(['general', 'landing', 'content', 'blog', 'portfolio', 'ecommerce']).optional(),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export type TemplateCategory = 'general' | 'landing' | 'content' | 'blog' | 'portfolio' | 'ecommerce'

export interface Template {
  id: string
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  default_blocks: unknown[]
  is_system: boolean
  category: TemplateCategory
  created_at: string | null
  updated_at: string | null
  created_by: string | null
  creator?: {
    full_name: string | null
    email: string
  } | null
}

// Get all templates with optional filtering
export async function getTemplates(options?: {
  category?: TemplateCategory
  search?: string
  includeSystem?: boolean
  page?: number
  limit?: number
}): Promise<{
  templates: Template[]
  total: number
  totalPages: number
}> {
  const supabase = await createServerSupabaseClient()

  const page = options?.page || 1
  const limit = options?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('cms_page_templates')
    .select(`
      *,
      creator:created_by(full_name, email)
    `, { count: 'exact' })

  // Apply filters
  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  if (!options?.includeSystem) {
    query = query.eq('is_system', false)
  }

  // Order and paginate
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching templates:', error)
    return { templates: [], total: 0, totalPages: 0 }
  }

  return {
    templates: (data || []) as Template[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// Get single template by ID
export async function getTemplateById(templateId: string): Promise<Template | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_templates')
    .select(`
      *,
      creator:created_by(full_name, email)
    `)
    .eq('id', templateId)
    .single()

  if (error) {
    console.error('Error fetching template:', error)
    return null
  }

  return data as Template
}

// Create new template
export async function createTemplate(formData: FormData): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:templates:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create templates' }
  }

  // Parse and validate input
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    thumbnail_url: formData.get('thumbnail_url') || undefined,
    default_blocks: formData.get('default_blocks')
      ? JSON.parse(formData.get('default_blocks') as string)
      : [],
    category: formData.get('category') || 'general',
  }

  const parsed = CreateTemplateSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Check for duplicate slug
  const { data: existingTemplate } = await supabase
    .from('cms_page_templates')
    .select('id')
    .eq('slug', parsed.data.slug)
    .single()

  if (existingTemplate) {
    return { success: false, message: 'A template with this slug already exists' }
  }

  // Create template
  const { data: template, error } = await supabase
    .from('cms_page_templates')
    .insert({
      ...parsed.data,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating template:', error)
    return { success: false, message: 'Failed to create template' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'template',
    resourceId: template.id,
    metadata: { name: parsed.data.name, category: parsed.data.category },
  })

  revalidatePath('/admin/content/templates')

  return {
    success: true,
    message: 'Template created successfully',
    data: template,
  }
}

// Create template from existing page
export async function createTemplateFromPage(
  pageId: string,
  name: string,
  description?: string,
  category?: TemplateCategory
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:templates:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create templates' }
  }

  // Get page with blocks
  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .select(`
      id,
      title,
      cms_page_blocks(
        id,
        component_name,
        props,
        order_index,
        parent_block_id
      )
    `)
    .eq('id', pageId)
    .single()

  if (pageError || !page) {
    return { success: false, message: 'Page not found' }
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Check for duplicate slug
  const { data: existingTemplate } = await supabase
    .from('cms_page_templates')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existingTemplate) {
    return { success: false, message: 'A template with this name already exists' }
  }

  // Extract blocks (without IDs for template)
  const templateBlocks = (page.cms_page_blocks || []).map((block: {
    component_name: string
    props: unknown
    order_index: number
    parent_block_id: string | null
  }) => ({
    component_name: block.component_name,
    props: block.props,
    order_index: block.order_index,
    parent_block_id: block.parent_block_id,
  }))

  // Create template
  const { data: template, error } = await supabase
    .from('cms_page_templates')
    .insert({
      name,
      slug,
      description: description || `Template created from "${page.title}"`,
      default_blocks: templateBlocks,
      category: category || 'general',
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating template from page:', error)
    return { success: false, message: 'Failed to create template' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'template',
    resourceId: template.id,
    metadata: { name, fromPage: pageId, pageTitle: page.title },
  })

  revalidatePath('/admin/content/templates')

  return {
    success: true,
    message: 'Template created from page successfully',
    data: template,
  }
}

// Update template
export async function updateTemplate(
  templateId: string,
  updates: z.infer<typeof UpdateTemplateSchema>
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:templates:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit templates' }
  }

  // Validate input
  const parsed = UpdateTemplateSchema.safeParse(updates)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Check if template exists and is not system
  const { data: existingTemplate } = await supabase
    .from('cms_page_templates')
    .select('id, name, is_system')
    .eq('id', templateId)
    .single()

  if (!existingTemplate) {
    return { success: false, message: 'Template not found' }
  }

  if (existingTemplate.is_system) {
    return { success: false, message: 'System templates cannot be modified' }
  }

  // Update template
  const { data: template, error } = await supabase
    .from('cms_page_templates')
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', templateId)
    .select()
    .single()

  if (error) {
    console.error('Error updating template:', error)
    return { success: false, message: 'Failed to update template' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'cms',
    resourceType: 'template',
    resourceId: templateId,
    metadata: { name: template.name, changes: Object.keys(parsed.data) },
  })

  revalidatePath('/admin/content/templates')
  revalidatePath(`/admin/content/templates/${templateId}`)

  return {
    success: true,
    message: 'Template updated successfully',
    data: template,
  }
}

// Delete template
export async function deleteTemplate(templateId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:templates:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete templates' }
  }

  // Check if template exists and is not system
  const { data: template } = await supabase
    .from('cms_page_templates')
    .select('id, name, is_system')
    .eq('id', templateId)
    .single()

  if (!template) {
    return { success: false, message: 'Template not found' }
  }

  if (template.is_system) {
    return { success: false, message: 'System templates cannot be deleted' }
  }

  // Delete template
  const { error } = await supabase
    .from('cms_page_templates')
    .delete()
    .eq('id', templateId)

  if (error) {
    console.error('Error deleting template:', error)
    return { success: false, message: 'Failed to delete template' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'template',
    resourceId: templateId,
    metadata: { name: template.name },
  })

  revalidatePath('/admin/content/templates')

  return {
    success: true,
    message: 'Template deleted successfully',
  }
}

// Apply template to page (creates new blocks from template)
export async function applyTemplateToPage(
  pageId: string,
  templateId: string,
  replaceExisting: boolean = false
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit pages' }
  }

  // Get template
  const { data: template, error: templateError } = await supabase
    .from('cms_page_templates')
    .select('id, name, default_blocks')
    .eq('id', templateId)
    .single()

  if (templateError || !template) {
    return { success: false, message: 'Template not found' }
  }

  // Check if page exists
  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .select('id, title')
    .eq('id', pageId)
    .single()

  if (pageError || !page) {
    return { success: false, message: 'Page not found' }
  }

  // If replacing, delete existing blocks first
  if (replaceExisting) {
    const { error: deleteError } = await supabase
      .from('cms_page_blocks')
      .delete()
      .eq('page_id', pageId)

    if (deleteError) {
      console.error('Error deleting existing blocks:', deleteError)
      return { success: false, message: 'Failed to clear existing blocks' }
    }
  }

  // Get highest order_index if not replacing
  let startIndex = 0
  if (!replaceExisting) {
    const { data: maxBlock } = await supabase
      .from('cms_page_blocks')
      .select('order_index')
      .eq('page_id', pageId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    if (maxBlock) {
      startIndex = maxBlock.order_index + 1
    }
  }

  // Create blocks from template
  const templateBlocks = template.default_blocks as Array<{
    component_name: string
    props: unknown
    order_index: number
    parent_block_id?: string | null
  }>

  if (templateBlocks && templateBlocks.length > 0) {
    const blocksToInsert = templateBlocks.map((block, index) => ({
      page_id: pageId,
      component_name: block.component_name,
      props: block.props,
      order_index: startIndex + index,
      parent_block_id: null, // Reset parent relationships for now
    }))

    const { error: insertError } = await supabase
      .from('cms_page_blocks')
      .insert(blocksToInsert)

    if (insertError) {
      console.error('Error inserting template blocks:', insertError)
      return { success: false, message: 'Failed to apply template blocks' }
    }
  }

  // Update page timestamp
  await supabase
    .from('cms_pages')
    .update({
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq('id', pageId)

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: {
      action: 'apply_template',
      templateId,
      templateName: template.name,
      replaceExisting,
    },
  })

  revalidatePath(`/admin/content/pages/${pageId}/edit`)

  return {
    success: true,
    message: `Template "${template.name}" applied successfully`,
    data: { blocksAdded: templateBlocks?.length || 0 },
  }
}

// Duplicate template
export async function duplicateTemplate(templateId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:templates:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create templates' }
  }

  // Get original template
  const { data: original, error: fetchError } = await supabase
    .from('cms_page_templates')
    .select('*')
    .eq('id', templateId)
    .single()

  if (fetchError || !original) {
    return { success: false, message: 'Template not found' }
  }

  // Generate new slug
  let newSlug = `${original.slug}-copy`
  let counter = 1

  // Check for existing slug and increment counter if needed
  while (true) {
    const { data: existing } = await supabase
      .from('cms_page_templates')
      .select('id')
      .eq('slug', newSlug)
      .single()

    if (!existing) break

    counter++
    newSlug = `${original.slug}-copy-${counter}`
  }

  // Create duplicate
  const { data: duplicate, error } = await supabase
    .from('cms_page_templates')
    .insert({
      name: `${original.name} (Copy)`,
      slug: newSlug,
      description: original.description,
      thumbnail_url: original.thumbnail_url,
      default_blocks: original.default_blocks,
      category: original.category,
      is_system: false,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error duplicating template:', error)
    return { success: false, message: 'Failed to duplicate template' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'template',
    resourceId: duplicate.id,
    metadata: { name: duplicate.name, duplicatedFrom: templateId },
  })

  revalidatePath('/admin/content/templates')

  return {
    success: true,
    message: 'Template duplicated successfully',
    data: duplicate,
  }
}
