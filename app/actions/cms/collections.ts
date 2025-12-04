'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'
import type {
  ComponentCollection,
  ComponentCollectionInsert,
} from '@/lib/supabase/database.types'

// =============================================================================
// Validation Schemas
// =============================================================================

const CollectionSlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')

const CreateCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: CollectionSlugSchema,
  description: z.string().optional(),
  icon: z.string().optional().default('Folder'),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format')
    .optional()
    .default('#6366f1'),
  parent_id: z.string().uuid().nullable().optional(),
  sort_order: z.coerce.number().min(0).optional().default(0),
})

const UpdateCollectionSchema = CreateCollectionSchema.partial().extend({
  id: z.string().uuid('Invalid collection ID'),
})

// =============================================================================
// Types
// =============================================================================

export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface CollectionTreeNode extends ComponentCollection {
  children: CollectionTreeNode[]
  component_count?: number
}

export interface CollectionWithCount extends ComponentCollection {
  component_count: number
}

// =============================================================================
// Collection CRUD Actions
// =============================================================================

/**
 * Get all collections
 */
export async function getCollections(): Promise<CollectionWithCount[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_component_collections')
    .select(
      `
      *,
      cms_custom_components (id)
    `
    )
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching collections:', error)
    throw new Error('Failed to fetch collections')
  }

  // Calculate component count for each collection
  return (data || []).map((collection) => ({
    ...collection,
    component_count: collection.cms_custom_components?.length || 0,
    cms_custom_components: undefined, // Remove the nested array
  })) as CollectionWithCount[]
}

/**
 * Get collection tree structure
 */
export async function getCollectionTree(): Promise<CollectionTreeNode[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_component_collections')
    .select(
      `
      *,
      cms_custom_components (id)
    `
    )
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching collection tree:', error)
    throw new Error('Failed to fetch collection tree')
  }

  // Build tree structure
  const collections = (data || []).map((c) => ({
    ...c,
    component_count: c.cms_custom_components?.length || 0,
    children: [] as CollectionTreeNode[],
  })) as CollectionTreeNode[]

  const collectionMap = new Map<string, CollectionTreeNode>()
  const rootCollections: CollectionTreeNode[] = []

  // First pass: create all nodes
  collections.forEach((collection) => {
    collectionMap.set(collection.id, collection)
  })

  // Second pass: build tree
  collections.forEach((collection) => {
    if (collection.parent_id && collectionMap.has(collection.parent_id)) {
      collectionMap.get(collection.parent_id)!.children.push(collection)
    } else {
      rootCollections.push(collection)
    }
  })

  return rootCollections
}

/**
 * Get a single collection by ID
 */
export async function getCollectionById(id: string): Promise<CollectionWithCount | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_component_collections')
    .select(
      `
      *,
      cms_custom_components (id)
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching collection:', error)
    }
    return null
  }

  return {
    ...data,
    component_count: data.cms_custom_components?.length || 0,
  } as CollectionWithCount
}

/**
 * Get a collection by slug
 */
export async function getCollectionBySlug(slug: string): Promise<ComponentCollection | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_component_collections')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching collection by slug:', error)
    }
    return null
  }

  return data
}

/**
 * Create a new collection
 */
export async function createCollection(
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
  const hasPermission = await checkPermission(user.id, 'cms:collections:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage collections' }
  }

  // Validate input
  const validation = CreateCollectionSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    icon: formData.get('icon') || 'Folder',
    color: formData.get('color') || '#6366f1',
    parent_id: formData.get('parent_id') || null,
    sort_order: formData.get('sort_order') || 0,
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
    .from('cms_component_collections')
    .select('id')
    .eq('slug', validation.data.slug)
    .single()

  if (existing) {
    return { success: false, message: 'A collection with this slug already exists' }
  }

  // Create collection
  const insertData: ComponentCollectionInsert = {
    name: validation.data.name,
    slug: validation.data.slug,
    description: validation.data.description || null,
    icon: validation.data.icon,
    color: validation.data.color,
    parent_id: validation.data.parent_id,
    sort_order: validation.data.sort_order,
    is_system: false,
    created_by: user.id,
  }

  const { data: collection, error } = await supabase
    .from('cms_component_collections')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating collection:', error)
    return { success: false, message: 'Failed to create collection. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'collection',
    resourceId: collection.id,
    metadata: { name: validation.data.name, slug: validation.data.slug },
  })

  revalidatePath('/admin/content/components')
  revalidatePath('/admin/content/components/collections')

  return { success: true, message: 'Collection created successfully', data: { id: collection.id } }
}

/**
 * Update an existing collection
 */
export async function updateCollection(
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
  const hasPermission = await checkPermission(user.id, 'cms:collections:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage collections' }
  }

  // Validate input
  const validation = UpdateCollectionSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name') || undefined,
    slug: formData.get('slug') || undefined,
    description: formData.get('description') || undefined,
    icon: formData.get('icon') || undefined,
    color: formData.get('color') || undefined,
    parent_id: formData.get('parent_id') || undefined,
    sort_order: formData.get('sort_order') || undefined,
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { id, ...updateData } = validation.data

  // Check if system collection
  const { data: existingCollection } = await supabase
    .from('cms_component_collections')
    .select('is_system')
    .eq('id', id)
    .single()

  if (existingCollection?.is_system) {
    return { success: false, message: 'Cannot modify system collections' }
  }

  // Check if slug is being changed and already exists
  if (updateData.slug) {
    const { data: existing } = await supabase
      .from('cms_component_collections')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .single()

    if (existing) {
      return { success: false, message: 'A collection with this slug already exists' }
    }
  }

  // Prevent circular parent reference
  if (updateData.parent_id === id) {
    return { success: false, message: 'Collection cannot be its own parent' }
  }

  // Check for circular reference in nested parents
  if (updateData.parent_id) {
    const isCircular = await checkCircularReference(id, updateData.parent_id)
    if (isCircular) {
      return { success: false, message: 'This would create a circular reference' }
    }
  }

  // Update collection
  const { error } = await supabase
    .from('cms_component_collections')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating collection:', error)
    return { success: false, message: 'Failed to update collection. Please try again.' }
  }

  // If slug changed, update file paths for all components in this collection
  if (updateData.slug) {
    await updateComponentFilePaths(id, updateData.slug)
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'cms',
    resourceType: 'collection',
    resourceId: id,
    metadata: { changes: Object.keys(updateData) },
  })

  revalidatePath('/admin/content/components')
  revalidatePath('/admin/content/components/collections')

  return { success: true, message: 'Collection updated successfully' }
}

/**
 * Delete a collection
 */
export async function deleteCollection(
  id: string,
  moveComponentsTo?: string | null
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
  const hasPermission = await checkPermission(user.id, 'cms:collections:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage collections' }
  }

  // Check if system collection
  const { data: collection } = await supabase
    .from('cms_component_collections')
    .select('name, is_system')
    .eq('id', id)
    .single()

  if (!collection) {
    return { success: false, message: 'Collection not found' }
  }

  if (collection.is_system) {
    return { success: false, message: 'Cannot delete system collections' }
  }

  // Check for child collections
  const { data: childCollections } = await supabase
    .from('cms_component_collections')
    .select('id')
    .eq('parent_id', id)
    .limit(1)

  if (childCollections && childCollections.length > 0) {
    return {
      success: false,
      message: 'Cannot delete collection with child collections. Delete or move children first.',
    }
  }

  // Move components to target collection or set to null
  const { data: components } = await supabase
    .from('cms_custom_components')
    .select('id, name')
    .eq('collection_id', id)

  if (components && components.length > 0) {
    const targetSlug = moveComponentsTo
      ? await getCollectionSlugById(moveComponentsTo)
      : 'uncategorized'

    for (const component of components) {
      const filePath = `components/cms-blocks/custom/${targetSlug}/${kebabCase(component.name)}.tsx`

      await supabase
        .from('cms_custom_components')
        .update({
          collection_id: moveComponentsTo || null,
          file_path: filePath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', component.id)
    }
  }

  // Delete collection
  const { error } = await supabase.from('cms_component_collections').delete().eq('id', id)

  if (error) {
    console.error('Error deleting collection:', error)
    return { success: false, message: 'Failed to delete collection. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'collection',
    resourceId: id,
    metadata: {
      name: collection.name,
      moved_components_to: moveComponentsTo,
      component_count: components?.length || 0,
    },
  })

  revalidatePath('/admin/content/components')
  revalidatePath('/admin/content/components/collections')

  return { success: true, message: 'Collection deleted successfully' }
}

/**
 * Reorder collections
 */
export async function reorderCollections(
  orders: Array<{ id: string; sort_order: number; parent_id: string | null }>
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
  const hasPermission = await checkPermission(user.id, 'cms:collections:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage collections' }
  }

  // Update each collection's order
  for (const { id, sort_order, parent_id } of orders) {
    // Check for circular reference before updating
    if (parent_id) {
      const isCircular = await checkCircularReference(id, parent_id)
      if (isCircular) {
        return {
          success: false,
          message: `Cannot move collection - would create circular reference`,
        }
      }
    }

    await supabase
      .from('cms_component_collections')
      .update({
        sort_order,
        parent_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_system', false) // Don't update system collections
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'reorder',
    module: 'cms',
    resourceType: 'collections',
    metadata: { collections_reordered: orders.length },
  })

  revalidatePath('/admin/content/components')
  revalidatePath('/admin/content/components/collections')

  return { success: true, message: 'Collections reordered successfully' }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Check for circular reference in collection hierarchy
 */
async function checkCircularReference(
  collectionId: string,
  parentId: string
): Promise<boolean> {
  const supabase = await createServerSupabaseClient()

  // If parent is the same as collection, it's circular
  if (collectionId === parentId) {
    return true
  }

  // Walk up the parent chain
  let currentId: string | null = parentId
  const visited = new Set<string>([collectionId])

  while (currentId) {
    if (visited.has(currentId)) {
      return true
    }
    visited.add(currentId)

    const queryResult: { data: { parent_id: string | null } | null; error: unknown } = await supabase
      .from('cms_component_collections')
      .select('parent_id')
      .eq('id', currentId)
      .single()

    currentId = queryResult.data?.parent_id ?? null
  }

  return false
}

/**
 * Get collection slug by ID
 */
async function getCollectionSlugById(collectionId: string): Promise<string> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('cms_component_collections')
    .select('slug')
    .eq('id', collectionId)
    .single()

  return data?.slug || 'uncategorized'
}

/**
 * Update file paths for all components in a collection
 */
async function updateComponentFilePaths(collectionId: string, newSlug: string): Promise<void> {
  const supabase = await createServerSupabaseClient()

  const { data: components } = await supabase
    .from('cms_custom_components')
    .select('id, name')
    .eq('collection_id', collectionId)

  if (components && components.length > 0) {
    for (const component of components) {
      const filePath = `components/cms-blocks/custom/${newSlug}/${kebabCase(component.name)}.tsx`

      await supabase
        .from('cms_custom_components')
        .update({
          file_path: filePath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', component.id)
    }
  }
}

/**
 * Convert PascalCase to kebab-case
 */
function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Get uncategorized components count
 */
export async function getUncategorizedCount(): Promise<number> {
  const supabase = await createServerSupabaseClient()

  const { count, error } = await supabase
    .from('cms_custom_components')
    .select('id', { count: 'exact', head: true })
    .is('collection_id', null)

  if (error) {
    console.error('Error counting uncategorized components:', error)
    return 0
  }

  return count || 0
}
