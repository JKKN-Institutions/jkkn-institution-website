'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Validation schemas
const BlockSchema = z.object({
  page_id: z.string().uuid('Invalid page ID'),
  component_name: z.string().min(1, 'Component name is required'),
  props: z.record(z.string(), z.any()).default({}),
  sort_order: z.number().default(0),
  parent_block_id: z.string().uuid().nullable().optional(),
  is_visible: z.boolean().default(true),
  responsive_settings: z.record(z.string(), z.any()).optional(),
  custom_css: z.string().optional(),
  custom_classes: z.string().optional(),
})

const UpdateBlockSchema = BlockSchema.partial().extend({
  id: z.string().uuid('Invalid block ID'),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface Block {
  id: string
  page_id: string
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  parent_block_id: string | null
  is_visible: boolean | null
  responsive_settings: Record<string, unknown> | null
  custom_css: string | null
  custom_classes: string | null
  created_at: string | null
  updated_at: string | null
}

/**
 * Get blocks for a page
 */
export async function getBlocksByPageId(pageId: string): Promise<Block[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_blocks')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching blocks:', error)
    throw new Error('Failed to fetch blocks')
  }

  return data || []
}

/**
 * Add a new block to a page
 */
export async function addBlock(
  pageId: string,
  componentName: string,
  props: Record<string, unknown> = {},
  insertAt?: number
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
  const hasPermission = await checkPermission(user.id, 'cms:blocks:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to add blocks' }
  }

  // Validate
  const validation = BlockSchema.safeParse({
    page_id: pageId,
    component_name: componentName,
    props,
    sort_order: insertAt ?? 0,
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid block data',
    }
  }

  // Get current max sort_order if insertAt not specified
  let sortOrder = insertAt
  if (sortOrder === undefined) {
    const { data: maxBlock } = await supabase
      .from('cms_page_blocks')
      .select('sort_order')
      .eq('page_id', pageId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    sortOrder = (maxBlock?.sort_order ?? -1) + 1
  } else {
    // Shift existing blocks down
    await supabase.rpc('increment_block_sort_orders', {
      p_page_id: pageId,
      p_from_position: insertAt,
    })
  }

  // Insert block
  const { data: block, error } = await supabase
    .from('cms_page_blocks')
    .insert({
      page_id: pageId,
      component_name: componentName,
      props,
      sort_order: sortOrder,
      is_visible: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding block:', error)
    return { success: false, message: 'Failed to add block. Please try again.' }
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
    action: 'add_block',
    module: 'cms',
    resourceType: 'block',
    resourceId: block.id,
    metadata: { page_id: pageId, component_name: componentName },
  })

  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Block added', data: { id: block.id } }
}

/**
 * Update a block's properties
 */
export async function updateBlock(
  blockId: string,
  updates: {
    props?: Record<string, unknown>
    is_visible?: boolean
    responsive_settings?: Record<string, unknown>
    custom_css?: string
    custom_classes?: string
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
  const hasPermission = await checkPermission(user.id, 'cms:blocks:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit blocks' }
  }

  // Get block to find page_id
  const { data: existingBlock } = await supabase
    .from('cms_page_blocks')
    .select('page_id')
    .eq('id', blockId)
    .single()

  if (!existingBlock) {
    return { success: false, message: 'Block not found' }
  }

  // Update block
  const { error } = await supabase
    .from('cms_page_blocks')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', blockId)

  if (error) {
    console.error('Error updating block:', error)
    return { success: false, message: 'Failed to update block. Please try again.' }
  }

  // Update page timestamp
  await supabase
    .from('cms_pages')
    .update({
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingBlock.page_id)

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit_block',
    module: 'cms',
    resourceType: 'block',
    resourceId: blockId,
    metadata: { updates: Object.keys(updates) },
  })

  revalidatePath(`/admin/content/pages/${existingBlock.page_id}`)

  return { success: true, message: 'Block updated' }
}

/**
 * Delete a block
 */
export async function deleteBlock(blockId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blocks:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete blocks' }
  }

  // Get block info
  const { data: block } = await supabase
    .from('cms_page_blocks')
    .select('page_id, component_name, sort_order')
    .eq('id', blockId)
    .single()

  if (!block) {
    return { success: false, message: 'Block not found' }
  }

  // Delete block
  const { error } = await supabase.from('cms_page_blocks').delete().eq('id', blockId)

  if (error) {
    console.error('Error deleting block:', error)
    return { success: false, message: 'Failed to delete block. Please try again.' }
  }

  // Update sort_orders of remaining blocks
  await supabase
    .from('cms_page_blocks')
    .update({
      sort_order: supabase.rpc('decrement', { x: 1 }),
    })
    .eq('page_id', block.page_id)
    .gt('sort_order', block.sort_order)

  // Update page timestamp
  await supabase
    .from('cms_pages')
    .update({
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', block.page_id)

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete_block',
    module: 'cms',
    resourceType: 'block',
    resourceId: blockId,
    metadata: { page_id: block.page_id, component_name: block.component_name },
  })

  revalidatePath(`/admin/content/pages/${block.page_id}`)

  return { success: true, message: 'Block deleted' }
}

/**
 * Duplicate a block
 */
export async function duplicateBlock(blockId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blocks:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to duplicate blocks' }
  }

  // Get original block
  const { data: originalBlock } = await supabase
    .from('cms_page_blocks')
    .select('*')
    .eq('id', blockId)
    .single()

  if (!originalBlock) {
    return { success: false, message: 'Block not found' }
  }

  // Shift blocks below
  await supabase
    .from('cms_page_blocks')
    .update({
      sort_order: supabase.rpc('increment', { x: 1 }),
    })
    .eq('page_id', originalBlock.page_id)
    .gt('sort_order', originalBlock.sort_order)

  // Create duplicate
  const { data: newBlock, error } = await supabase
    .from('cms_page_blocks')
    .insert({
      page_id: originalBlock.page_id,
      component_name: originalBlock.component_name,
      props: originalBlock.props,
      sort_order: originalBlock.sort_order + 1,
      parent_block_id: originalBlock.parent_block_id,
      is_visible: originalBlock.is_visible,
      responsive_settings: originalBlock.responsive_settings,
      custom_css: originalBlock.custom_css,
      custom_classes: originalBlock.custom_classes,
    })
    .select()
    .single()

  if (error) {
    console.error('Error duplicating block:', error)
    return { success: false, message: 'Failed to duplicate block. Please try again.' }
  }

  // Update page timestamp
  await supabase
    .from('cms_pages')
    .update({
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', originalBlock.page_id)

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'duplicate_block',
    module: 'cms',
    resourceType: 'block',
    resourceId: newBlock.id,
    metadata: { original_block_id: blockId, component_name: originalBlock.component_name },
  })

  revalidatePath(`/admin/content/pages/${originalBlock.page_id}`)

  return { success: true, message: 'Block duplicated', data: { id: newBlock.id } }
}

/**
 * Reorder blocks within a page
 */
export async function reorderBlocks(
  pageId: string,
  blockOrders: Array<{ id: string; sort_order: number; parent_block_id: string | null }>
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
  const hasPermission = await checkPermission(user.id, 'cms:blocks:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to reorder blocks' }
  }

  // Update each block's sort_order
  for (const { id, sort_order, parent_block_id } of blockOrders) {
    await supabase
      .from('cms_page_blocks')
      .update({
        sort_order,
        parent_block_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('page_id', pageId)
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
    action: 'reorder_blocks',
    module: 'cms',
    resourceType: 'page',
    resourceId: pageId,
    metadata: { blocks_reordered: blockOrders.length },
  })

  revalidatePath(`/admin/content/pages/${pageId}`)

  return { success: true, message: 'Blocks reordered' }
}

/**
 * Move a block up or down
 */
export async function moveBlock(
  blockId: string,
  direction: 'up' | 'down'
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
  const hasPermission = await checkPermission(user.id, 'cms:blocks:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to move blocks' }
  }

  // Get current block
  const { data: currentBlock } = await supabase
    .from('cms_page_blocks')
    .select('id, page_id, sort_order, parent_block_id')
    .eq('id', blockId)
    .single()

  if (!currentBlock) {
    return { success: false, message: 'Block not found' }
  }

  // Find adjacent block
  let query = supabase
    .from('cms_page_blocks')
    .select('id, sort_order')
    .eq('page_id', currentBlock.page_id)

  // Handle null parent_block_id
  if (currentBlock.parent_block_id === null) {
    query = query.is('parent_block_id', null)
  } else {
    query = query.eq('parent_block_id', currentBlock.parent_block_id)
  }

  if (direction === 'up') {
    query = query
      .lt('sort_order', currentBlock.sort_order)
      .order('sort_order', { ascending: false })
  } else {
    query = query
      .gt('sort_order', currentBlock.sort_order)
      .order('sort_order', { ascending: true })
  }

  const { data: adjacentBlocks } = await query.limit(1)

  if (!adjacentBlocks || adjacentBlocks.length === 0) {
    return { success: false, message: `Cannot move block ${direction}` }
  }

  const adjacentBlock = adjacentBlocks[0]

  // Swap sort orders
  await supabase
    .from('cms_page_blocks')
    .update({ sort_order: adjacentBlock.sort_order })
    .eq('id', currentBlock.id)

  await supabase
    .from('cms_page_blocks')
    .update({ sort_order: currentBlock.sort_order })
    .eq('id', adjacentBlock.id)

  // Update page timestamp
  await supabase
    .from('cms_pages')
    .update({
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentBlock.page_id)

  revalidatePath(`/admin/content/pages/${currentBlock.page_id}`)

  return { success: true, message: `Block moved ${direction}` }
}

/**
 * Toggle block visibility
 */
export async function toggleBlockVisibility(blockId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:blocks:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit blocks' }
  }

  // Get current visibility
  const { data: block } = await supabase
    .from('cms_page_blocks')
    .select('page_id, is_visible')
    .eq('id', blockId)
    .single()

  if (!block) {
    return { success: false, message: 'Block not found' }
  }

  // Toggle visibility
  const newVisibility = !block.is_visible

  const { error } = await supabase
    .from('cms_page_blocks')
    .update({
      is_visible: newVisibility,
      updated_at: new Date().toISOString(),
    })
    .eq('id', blockId)

  if (error) {
    console.error('Error toggling block visibility:', error)
    return { success: false, message: 'Failed to toggle visibility. Please try again.' }
  }

  // Update page timestamp
  await supabase
    .from('cms_pages')
    .update({
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', block.page_id)

  revalidatePath(`/admin/content/pages/${block.page_id}`)

  return {
    success: true,
    message: newVisibility ? 'Block shown' : 'Block hidden',
    data: { is_visible: newVisibility },
  }
}
