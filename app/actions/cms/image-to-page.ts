'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'
import { analyzeImageAndGenerateBlocks, type GeneratedBlock } from '@/lib/ai/image-to-page'
import { v4 as uuidv4 } from 'uuid'

export interface ImageToPageState {
  success?: boolean
  message?: string
  step?: 'idle' | 'uploading' | 'analyzing' | 'generating' | 'complete' | 'error'
  progress?: number
  blocks?: GeneratedBlock[]
  templateId?: string
  pageId?: string
}

/**
 * Analyze an uploaded image and generate page blocks
 */
export async function analyzeTemplateImage(
  formData: FormData
): Promise<ImageToPageState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized', step: 'error' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:templates:create')
  if (!hasPermission) {
    return {
      success: false,
      message: 'You do not have permission to create templates',
      step: 'error'
    }
  }

  // Get the uploaded file
  const file = formData.get('image') as File | null
  if (!file) {
    return { success: false, message: 'No image uploaded', step: 'error' }
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.',
      step: 'error'
    }
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      message: 'Image too large. Maximum size is 10MB.',
      step: 'error'
    }
  }

  try {
    // Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Determine media type
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
    if (file.type === 'image/png') mediaType = 'image/png'
    else if (file.type === 'image/gif') mediaType = 'image/gif'
    else if (file.type === 'image/webp') mediaType = 'image/webp'

    // Analyze with AI
    const result = await analyzeImageAndGenerateBlocks(base64, mediaType)

    if (!result.success || !result.blocks) {
      return {
        success: false,
        message: result.error || 'Failed to analyze image',
        step: 'error',
      }
    }

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'create',
      module: 'cms',
      resourceType: 'image_analysis',
      resourceId: uuidv4(),
      metadata: {
        fileName: file.name,
        blocksGenerated: result.blocks.length,
      },
    })

    return {
      success: true,
      message: `Successfully generated ${result.blocks.length} blocks from image`,
      step: 'complete',
      blocks: result.blocks,
    }
  } catch (error) {
    console.error('Image analysis error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
      step: 'error',
    }
  }
}

/**
 * Create a template from generated blocks
 */
export async function createTemplateFromBlocks(
  name: string,
  description: string,
  blocks: GeneratedBlock[],
  thumbnailUrl?: string
): Promise<ImageToPageState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized', step: 'error' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:templates:create')
  if (!hasPermission) {
    return {
      success: false,
      message: 'You do not have permission to create templates',
      step: 'error'
    }
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
    return {
      success: false,
      message: 'A template with this name already exists',
      step: 'error'
    }
  }

  // Prepare blocks for storage
  const templateBlocks = blocks.map((block, index) => ({
    component_name: block.component_name,
    props: block.props,
    sort_order: block.sort_order ?? index,
    parent_block_id: null,
    is_visible: true,
  }))

  // Create template
  const { data: template, error } = await supabase
    .from('cms_page_templates')
    .insert({
      name,
      slug,
      description,
      default_blocks: templateBlocks,
      thumbnail_url: thumbnailUrl,
      category: 'general',
      is_system: false,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating template:', error)
    return {
      success: false,
      message: 'Failed to create template',
      step: 'error'
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'template',
    resourceId: template.id,
    metadata: {
      name,
      source: 'image_to_page',
      blockCount: blocks.length,
    },
  })

  revalidatePath('/admin/content/templates')

  return {
    success: true,
    message: 'Template created successfully',
    step: 'complete',
    templateId: template.id,
  }
}

/**
 * Create a page directly from generated blocks
 */
export async function createPageFromBlocks(
  title: string,
  slug: string,
  blocks: GeneratedBlock[]
): Promise<ImageToPageState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized', step: 'error' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:create')
  if (!hasPermission) {
    return {
      success: false,
      message: 'You do not have permission to create pages',
      step: 'error'
    }
  }

  // Check for duplicate slug
  const { data: existingPage } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existingPage) {
    return {
      success: false,
      message: 'A page with this slug already exists',
      step: 'error'
    }
  }

  // Create page
  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .insert({
      title,
      slug,
      status: 'draft',
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single()

  if (pageError) {
    console.error('Error creating page:', pageError)
    return {
      success: false,
      message: 'Failed to create page',
      step: 'error'
    }
  }

  // Create blocks for the page
  const pageBlocks = blocks.map((block, index) => ({
    page_id: page.id,
    component_name: block.component_name,
    props: block.props,
    order_index: block.sort_order ?? index,
    parent_block_id: null,
    is_visible: true,
  }))

  if (pageBlocks.length > 0) {
    const { error: blocksError } = await supabase
      .from('cms_page_blocks')
      .insert(pageBlocks)

    if (blocksError) {
      console.error('Error creating page blocks:', blocksError)
      // Delete the page if blocks failed
      await supabase.from('cms_pages').delete().eq('id', page.id)
      return {
        success: false,
        message: 'Failed to create page blocks',
        step: 'error'
      }
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'page',
    resourceId: page.id,
    metadata: {
      title,
      source: 'image_to_page',
      blockCount: blocks.length,
    },
  })

  revalidatePath('/admin/content/pages')

  return {
    success: true,
    message: 'Page created successfully',
    step: 'complete',
    pageId: page.id,
  }
}
