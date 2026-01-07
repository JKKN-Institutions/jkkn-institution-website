'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'
import type {
  CustomComponent,
  CustomComponentInsert,
  ComponentCategory,
  ComponentSourceType,
  PreviewStatus,
} from '@/lib/supabase/database.types'

// =============================================================================
// Validation Schemas
// =============================================================================

const ComponentNameSchema = z
  .string()
  .min(1, 'Component name is required')
  .max(100, 'Component name is too long')
  .regex(/^[A-Z][a-zA-Z0-9]*$/, 'Component name must be PascalCase (e.g., MyComponent)')

const ComponentCodeSchema = z
  .string()
  .min(1, 'Component code is required')
  .refine(
    (code) => code.includes('export') || code.includes('function') || code.includes('=>'),
    'Code must export a valid React component'
  )

const CreateComponentSchema = z.object({
  name: ComponentNameSchema,
  display_name: z.string().min(1, 'Display name is required').max(200),
  description: z.string().optional(),
  category: z.enum(['content', 'media', 'layout', 'data', 'custom'] as const),
  icon: z.string().optional().default('Puzzle'),
  source_type: z.enum(['manual', 'shadcn', 'reactbits', 'external'] as const),
  source_url: z.string().url().optional().nullable(),
  source_registry: z.string().optional().nullable(),
  code: ComponentCodeSchema,
  props_schema: z.record(z.string(), z.unknown()).optional().default({}),
  default_props: z.record(z.string(), z.unknown()).optional().default({}),
  editable_props: z.array(z.record(z.string(), z.unknown())).optional().default([]),
  supports_children: z.boolean().optional().default(false),
  is_full_width: z.boolean().optional().default(false),
  collection_id: z.string().uuid().optional().nullable(),
  keywords: z.array(z.string()).optional().default([]),
  dependencies: z.array(z.record(z.string(), z.unknown())).optional().default([]),
})

const UpdateComponentSchema = CreateComponentSchema.partial().extend({
  id: z.string().uuid('Invalid component ID'),
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

export interface ComponentWithCollection extends CustomComponent {
  cms_component_collections?: {
    id: string
    name: string
    slug: string
    color: string | null
  } | null
}

export interface GetComponentsOptions {
  page?: number
  limit?: number
  category?: ComponentCategory
  collection_id?: string | null
  source_type?: ComponentSourceType
  search?: string
  is_active?: boolean
}

// =============================================================================
// Component CRUD Actions
// =============================================================================

/**
 * Get all custom components with pagination and filtering
 */
export async function getComponents(options?: GetComponentsOptions) {
  const supabase = await createServerSupabaseClient()
  const {
    page = 1,
    limit = 20,
    category,
    collection_id,
    source_type,
    search,
    is_active,
  } = options || {}

  let query = supabase
    .from('cms_custom_components')
    .select(
      `
      *,
      cms_component_collections (
        id,
        name,
        slug,
        color
      )
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })

  // Apply filters
  if (category) {
    query = query.eq('category', category)
  }

  if (source_type) {
    query = query.eq('source_type', source_type)
  }

  if (collection_id !== undefined) {
    if (collection_id === null) {
      query = query.is('collection_id', null)
    } else {
      query = query.eq('collection_id', collection_id)
    }
  }

  if (is_active !== undefined) {
    query = query.eq('is_active', is_active)
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,display_name.ilike.%${search}%,description.ilike.%${search}%`
    )
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching components:', error)
    throw new Error('Failed to fetch components')
  }

  return {
    components: (data || []) as ComponentWithCollection[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get a single component by ID
 */
export async function getComponentById(id: string): Promise<ComponentWithCollection | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_custom_components')
    .select(
      `
      *,
      cms_component_collections (
        id,
        name,
        slug,
        color
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching component:', error)
    }
    return null
  }

  return data as ComponentWithCollection
}

/**
 * Get a component by name
 */
export async function getComponentByName(name: string): Promise<CustomComponent | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_custom_components')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching component by name:', error)
    }
    return null
  }

  return data
}

/**
 * Search components by query
 */
export async function searchComponents(query: string, limit = 10) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_custom_components')
    .select('id, name, display_name, description, category, icon, preview_image')
    .eq('is_active', true)
    .or(
      `name.ilike.%${query}%,display_name.ilike.%${query}%,description.ilike.%${query}%,keywords.cs.{${query}}`
    )
    .limit(limit)

  if (error) {
    console.error('Error searching components:', error)
    return []
  }

  return data || []
}

/**
 * Create a new custom component
 */
export async function createCustomComponent(
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
  const hasPermission = await checkPermission(user.id, 'cms:components:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create components' }
  }

  // Parse JSON fields
  let propsSchema = {}
  let defaultProps = {}
  let editableProps: Record<string, unknown>[] = []
  let keywords: string[] = []
  let dependencies: Record<string, unknown>[] = []

  try {
    const propsSchemaStr = formData.get('props_schema')
    if (propsSchemaStr && typeof propsSchemaStr === 'string') {
      propsSchema = JSON.parse(propsSchemaStr)
    }

    const defaultPropsStr = formData.get('default_props')
    if (defaultPropsStr && typeof defaultPropsStr === 'string') {
      defaultProps = JSON.parse(defaultPropsStr)
    }

    const editablePropsStr = formData.get('editable_props')
    if (editablePropsStr && typeof editablePropsStr === 'string') {
      editableProps = JSON.parse(editablePropsStr)
    }

    const keywordsStr = formData.get('keywords')
    if (keywordsStr && typeof keywordsStr === 'string') {
      keywords = JSON.parse(keywordsStr)
    }

    const dependenciesStr = formData.get('dependencies')
    if (dependenciesStr && typeof dependenciesStr === 'string') {
      dependencies = JSON.parse(dependenciesStr)
    }
  } catch (e) {
    console.error('Error parsing JSON fields:', e)
    return { success: false, message: 'Invalid JSON in form fields' }
  }

  // Validate input
  const validation = CreateComponentSchema.safeParse({
    name: formData.get('name'),
    display_name: formData.get('display_name'),
    description: formData.get('description') || undefined,
    category: formData.get('category'),
    icon: formData.get('icon') || 'Puzzle',
    source_type: formData.get('source_type') || 'manual',
    source_url: formData.get('source_url') || null,
    source_registry: formData.get('source_registry') || null,
    code: formData.get('code'),
    props_schema: propsSchema,
    default_props: defaultProps,
    editable_props: editableProps,
    supports_children: formData.get('supports_children') === 'true',
    is_full_width: formData.get('is_full_width') === 'true',
    collection_id: formData.get('collection_id') || null,
    keywords,
    dependencies,
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  // Check if component name already exists
  const { data: existing } = await supabase
    .from('cms_custom_components')
    .select('id')
    .eq('name', validation.data.name)
    .single()

  if (existing) {
    return { success: false, message: 'A component with this name already exists' }
  }

  // Generate file path
  const collectionSlug = validation.data.collection_id
    ? await getCollectionSlug(validation.data.collection_id)
    : 'uncategorized'
  const filePath = `components/cms-blocks/custom/${collectionSlug}/${kebabCase(validation.data.name)}.tsx`

  // Create component record
  const insertData = {
    name: validation.data.name,
    display_name: validation.data.display_name,
    description: validation.data.description || null,
    category: validation.data.category,
    icon: validation.data.icon,
    source_type: validation.data.source_type,
    source_url: validation.data.source_url,
    source_registry: validation.data.source_registry,
    file_path: filePath,
    code: validation.data.code,
    props_schema: validation.data.props_schema as Record<string, unknown>,
    default_props: validation.data.default_props as Record<string, unknown>,
    editable_props: validation.data.editable_props as unknown[],
    supports_children: validation.data.supports_children,
    is_full_width: validation.data.is_full_width,
    collection_id: validation.data.collection_id,
    keywords: validation.data.keywords,
    dependencies: validation.data.dependencies as unknown[],
    preview_status: (/import\s+.*?from\s+['"](?!react)([^'"]+)['"]/.test(validation.data.code) ? 'completed' : 'pending') as PreviewStatus, // Auto-complete if has external imports
    is_active: true, // Auto-activate for immediate page builder availability
    version: '1.0.0',
    created_by: user.id,
    updated_by: user.id,
  }

  const { data: component, error } = await supabase
    .from('cms_custom_components')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating component:', error)
    return { success: false, message: 'Failed to create component. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'component',
    resourceId: component.id,
    metadata: { name: validation.data.name, source_type: validation.data.source_type },
  })

  revalidatePath('/admin/content/components')

  // Return full component data for preview modal
  return {
    success: true,
    message: 'Component created successfully',
    data: component, // Return full component data
  }
}

/**
 * Update an existing component
 */
export async function updateCustomComponent(
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
  const hasPermission = await checkPermission(user.id, 'cms:components:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit components' }
  }

  // Parse JSON fields
  let propsSchema: Record<string, unknown> | undefined
  let defaultProps: Record<string, unknown> | undefined
  let editableProps: Record<string, unknown>[] | undefined
  let keywords: string[] | undefined
  let dependencies: Record<string, unknown>[] | undefined

  try {
    const propsSchemaStr = formData.get('props_schema')
    if (propsSchemaStr && typeof propsSchemaStr === 'string') {
      propsSchema = JSON.parse(propsSchemaStr)
    }

    const defaultPropsStr = formData.get('default_props')
    if (defaultPropsStr && typeof defaultPropsStr === 'string') {
      defaultProps = JSON.parse(defaultPropsStr)
    }

    const editablePropsStr = formData.get('editable_props')
    if (editablePropsStr && typeof editablePropsStr === 'string') {
      editableProps = JSON.parse(editablePropsStr)
    }

    const keywordsStr = formData.get('keywords')
    if (keywordsStr && typeof keywordsStr === 'string') {
      keywords = JSON.parse(keywordsStr)
    }

    const dependenciesStr = formData.get('dependencies')
    if (dependenciesStr && typeof dependenciesStr === 'string') {
      dependencies = JSON.parse(dependenciesStr)
    }
  } catch (e) {
    console.error('Error parsing JSON fields:', e)
    return { success: false, message: 'Invalid JSON in form fields' }
  }

  // Validate input
  const validation = UpdateComponentSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name') || undefined,
    display_name: formData.get('display_name') || undefined,
    description: formData.get('description') || undefined,
    category: formData.get('category') || undefined,
    icon: formData.get('icon') || undefined,
    source_type: formData.get('source_type') || undefined,
    source_url: formData.get('source_url') || undefined,
    source_registry: formData.get('source_registry') || undefined,
    code: formData.get('code') || undefined,
    props_schema: propsSchema,
    default_props: defaultProps,
    editable_props: editableProps,
    supports_children:
      formData.get('supports_children') !== null
        ? formData.get('supports_children') === 'true'
        : undefined,
    is_full_width:
      formData.get('is_full_width') !== null
        ? formData.get('is_full_width') === 'true'
        : undefined,
    collection_id: formData.get('collection_id') || undefined,
    keywords,
    dependencies,
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { id, ...updateData } = validation.data

  // Check if name is being changed and already exists
  if (updateData.name) {
    const { data: existing } = await supabase
      .from('cms_custom_components')
      .select('id')
      .eq('name', updateData.name)
      .neq('id', id)
      .single()

    if (existing) {
      return { success: false, message: 'A component with this name already exists' }
    }
  }

  // Get existing component for comparison
  const { data: existingComponent } = await supabase
    .from('cms_custom_components')
    .select('code, collection_id, name')
    .eq('id', id)
    .single()

  // Update file path if collection or name changed
  let filePath: string | undefined
  if (updateData.collection_id !== undefined || updateData.name) {
    const collectionId = updateData.collection_id ?? existingComponent?.collection_id
    const componentName = updateData.name ?? existingComponent?.name
    const collectionSlug = collectionId
      ? await getCollectionSlug(collectionId)
      : 'uncategorized'
    filePath = `components/cms-blocks/custom/${collectionSlug}/${kebabCase(componentName!)}.tsx`
  }

  // Check if code changed (need to regenerate preview)
  const codeChanged = updateData.code && updateData.code !== existingComponent?.code

  // Detect external imports if code changed
  let previewStatus: PreviewStatus | undefined
  if (codeChanged && updateData.code) {
    const hasExternalImports = /import\s+.*?from\s+['"](?!react)([^'"]+)['"]/.test(updateData.code)
    previewStatus = hasExternalImports ? 'completed' : 'pending'
  }

  // Update component
  const { error } = await supabase
    .from('cms_custom_components')
    .update({
      ...updateData,
      ...(filePath && { file_path: filePath }),
      ...(previewStatus && { preview_status: previewStatus }),
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating component:', error)
    return { success: false, message: 'Failed to update component. Please try again.' }
  }

  // Queue preview regeneration if code changed
  if (codeChanged) {
    await supabase.from('cms_preview_jobs').insert({
      component_id: id,
      status: 'pending',
    })
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'cms',
    resourceType: 'component',
    resourceId: id,
    metadata: { changes: Object.keys(updateData) },
  })

  revalidatePath('/admin/content/components')
  revalidatePath(`/admin/content/components/${id}`)

  return { success: true, message: 'Component updated successfully' }
}

/**
 * Delete a component
 */
export async function deleteCustomComponent(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:components:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete components' }
  }

  // Get component info for logging
  const { data: component } = await supabase
    .from('cms_custom_components')
    .select('name, display_name, file_path')
    .eq('id', id)
    .single()

  if (!component) {
    return { success: false, message: 'Component not found' }
  }

  // Check if component is used in any pages
  const { data: usedInPages } = await supabase
    .from('cms_page_blocks')
    .select('id')
    .eq('component_name', component.name)
    .limit(1)

  if (usedInPages && usedInPages.length > 0) {
    return {
      success: false,
      message:
        'Cannot delete component that is used in pages. Remove it from all pages first.',
    }
  }

  // Delete component (cascade will handle preview_jobs)
  const { error } = await supabase.from('cms_custom_components').delete().eq('id', id)

  if (error) {
    console.error('Error deleting component:', error)
    return { success: false, message: 'Failed to delete component. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'component',
    resourceId: id,
    metadata: { name: component.name, display_name: component.display_name },
  })

  revalidatePath('/admin/content/components')

  return { success: true, message: 'Component deleted successfully' }
}

/**
 * Duplicate a component
 */
export async function duplicateComponent(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:components:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create components' }
  }

  // Get original component
  const { data: original, error: fetchError } = await supabase
    .from('cms_custom_components')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !original) {
    return { success: false, message: 'Component not found' }
  }

  // Generate unique name
  let suffix = 1
  let newName = `${original.name}Copy`

  const { data: existingNames } = await supabase
    .from('cms_custom_components')
    .select('name')
    .like('name', `${original.name}Copy%`)

  if (existingNames && existingNames.length > 0) {
    const nameSet = new Set(existingNames.map((c) => c.name))
    while (nameSet.has(newName)) {
      suffix++
      newName = `${original.name}Copy${suffix}`
    }
  }

  // Generate file path
  const collectionSlug = original.collection_id
    ? await getCollectionSlug(original.collection_id)
    : 'uncategorized'
  const filePath = `components/cms-blocks/custom/${collectionSlug}/${kebabCase(newName)}.tsx`

  // Create new component
  const { data: newComponent, error: createError } = await supabase
    .from('cms_custom_components')
    .insert({
      name: newName,
      display_name: `${original.display_name} (Copy)`,
      description: original.description,
      category: original.category,
      icon: original.icon,
      source_type: 'manual',
      source_url: null,
      source_registry: null,
      file_path: filePath,
      code: original.code,
      props_schema: original.props_schema,
      default_props: original.default_props,
      editable_props: original.editable_props,
      supports_children: original.supports_children,
      is_full_width: original.is_full_width,
      collection_id: original.collection_id,
      keywords: original.keywords,
      dependencies: original.dependencies,
      preview_status: 'completed', // Skip async preview - use icon as fallback
      is_active: true,
      version: '1.0.0',
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single()

  if (createError) {
    console.error('Error duplicating component:', createError)
    return { success: false, message: 'Failed to duplicate component. Please try again.' }
  }

  // Note: Preview generation is skipped - components use their icon as placeholder

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'duplicate',
    module: 'cms',
    resourceType: 'component',
    resourceId: newComponent.id,
    metadata: { original_id: id, new_name: newName },
  })

  revalidatePath('/admin/content/components')

  return {
    success: true,
    message: `Component duplicated as "${newName}"`,
    data: { id: newComponent.id },
  }
}

/**
 * Toggle component active status
 */
export async function toggleComponentActive(id: string, isActive: boolean): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:components:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit components' }
  }

  const { data: component, error } = await supabase
    .from('cms_custom_components')
    .update({
      is_active: isActive,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('name')
    .single()

  if (error) {
    console.error('Error toggling component active:', error)
    return { success: false, message: 'Failed to update component status' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: isActive ? 'activate' : 'deactivate',
    module: 'cms',
    resourceType: 'component',
    resourceId: id,
    metadata: { name: component.name },
  })

  revalidatePath('/admin/content/components')

  return {
    success: true,
    message: isActive ? 'Component activated' : 'Component deactivated',
  }
}

// =============================================================================
// Organization Actions
// =============================================================================

/**
 * Move a component to a collection
 */
export async function moveComponentToCollection(
  id: string,
  collectionId: string | null
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
  const hasPermission = await checkPermission(user.id, 'cms:components:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to organize components' }
  }

  // Get component name for file path update
  const { data: component } = await supabase
    .from('cms_custom_components')
    .select('name')
    .eq('id', id)
    .single()

  if (!component) {
    return { success: false, message: 'Component not found' }
  }

  // Generate new file path
  const collectionSlug = collectionId
    ? await getCollectionSlug(collectionId)
    : 'uncategorized'
  const filePath = `components/cms-blocks/custom/${collectionSlug}/${kebabCase(component.name)}.tsx`

  const { error } = await supabase
    .from('cms_custom_components')
    .update({
      collection_id: collectionId,
      file_path: filePath,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error moving component:', error)
    return { success: false, message: 'Failed to move component' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'move',
    module: 'cms',
    resourceType: 'component',
    resourceId: id,
    metadata: { collection_id: collectionId },
  })

  revalidatePath('/admin/content/components')

  return { success: true, message: 'Component moved successfully' }
}

/**
 * Bulk move components to a collection
 */
export async function bulkMoveComponents(
  ids: string[],
  collectionId: string | null
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
  const hasPermission = await checkPermission(user.id, 'cms:components:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to organize components' }
  }

  const collectionSlug = collectionId
    ? await getCollectionSlug(collectionId)
    : 'uncategorized'

  // Update each component
  for (const id of ids) {
    const { data: component } = await supabase
      .from('cms_custom_components')
      .select('name')
      .eq('id', id)
      .single()

    if (component) {
      const filePath = `components/cms-blocks/custom/${collectionSlug}/${kebabCase(component.name)}.tsx`

      await supabase
        .from('cms_custom_components')
        .update({
          collection_id: collectionId,
          file_path: filePath,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_move',
    module: 'cms',
    resourceType: 'components',
    metadata: { component_count: ids.length, collection_id: collectionId },
  })

  revalidatePath('/admin/content/components')

  return { success: true, message: `${ids.length} components moved successfully` }
}

/**
 * Bulk delete components
 */
export async function bulkDeleteComponents(ids: string[]): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:components:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete components' }
  }

  // Get component names for checking usage
  const { data: components } = await supabase
    .from('cms_custom_components')
    .select('id, name')
    .in('id', ids)

  if (!components) {
    return { success: false, message: 'Components not found' }
  }

  // Check if any component is used in pages
  for (const component of components) {
    const { data: usedInPages } = await supabase
      .from('cms_page_blocks')
      .select('id')
      .eq('component_name', component.name)
      .limit(1)

    if (usedInPages && usedInPages.length > 0) {
      return {
        success: false,
        message: `Cannot delete "${component.name}" as it is used in pages`,
      }
    }
  }

  // Delete components
  const { error } = await supabase.from('cms_custom_components').delete().in('id', ids)

  if (error) {
    console.error('Error bulk deleting components:', error)
    return { success: false, message: 'Failed to delete components' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_delete',
    module: 'cms',
    resourceType: 'components',
    metadata: { component_count: ids.length },
  })

  revalidatePath('/admin/content/components')

  return { success: true, message: `${ids.length} components deleted successfully` }
}

// =============================================================================
// Preview Actions
// =============================================================================

/**
 * Trigger preview generation for a component
 */
export async function triggerPreviewGeneration(componentId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:components:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to generate previews' }
  }

  // Get component and check for external imports
  const { data: component } = await supabase
    .from('cms_custom_components')
    .select('code')
    .eq('id', componentId)
    .single()

  if (!component) {
    return { success: false, message: 'Component not found' }
  }

  // Detect external imports
  const hasExternalImports = /import\s+.*?from\s+['"](?!react)([^'"]+)['"]/.test(component.code)

  // Update status based on import detection
  await supabase
    .from('cms_custom_components')
    .update({
      preview_status: hasExternalImports ? 'completed' : 'pending',
      updated_at: new Date().toISOString()
    })
    .eq('id', componentId)

  revalidatePath('/admin/content/components')
  revalidatePath(`/admin/content/components/${componentId}`)

  return {
    success: true,
    message: hasExternalImports
      ? 'Preview will show placeholder for components with external imports. Open preview generator to capture.'
      : 'Preview ready. Open preview generator to capture screenshots.'
  }
}

/**
 * Get preview status for a component
 */
export async function getPreviewStatus(
  componentId: string
): Promise<{ status: PreviewStatus; preview_image: string | null } | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_custom_components')
    .select('preview_status, preview_image')
    .eq('id', componentId)
    .single()

  if (error) {
    console.error('Error fetching preview status:', error)
    return null
  }

  return {
    status: data.preview_status as PreviewStatus,
    preview_image: data.preview_image,
  }
}

// =============================================================================
// Code Validation Actions
// =============================================================================

/**
 * Validate component code syntax and structure
 */
export async function validateComponentCode(code: string): Promise<{
  valid: boolean
  errors: string[]
  warnings: string[]
}> {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic checks
  if (!code || code.trim().length === 0) {
    errors.push('Code cannot be empty')
    return { valid: false, errors, warnings }
  }

  // Check for export
  if (!code.includes('export')) {
    errors.push('Component must have an export statement')
  }

  // Check for function/component definition
  const hasFunctionDef =
    code.includes('function') || code.includes('=>') || code.includes('React.FC')
  if (!hasFunctionDef) {
    errors.push('Code must define a function component')
  }

  // Check for return statement with JSX
  if (!code.includes('return') && !code.includes('=>')) {
    errors.push('Component must return JSX')
  }

  // Check for potential issues
  if (code.includes('dangerouslySetInnerHTML')) {
    warnings.push('Usage of dangerouslySetInnerHTML detected - ensure proper sanitization')
  }

  if (code.includes('eval(')) {
    errors.push('eval() is not allowed for security reasons')
  }

  if (code.includes('document.') || code.includes('window.')) {
    warnings.push(
      'Direct DOM access detected - ensure component works with SSR'
    )
  }

  // Check for TypeScript props interface
  if (!code.includes('Props') && !code.includes('interface') && !code.includes('type ')) {
    warnings.push('Consider adding TypeScript props interface for better type safety')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Extract props schema from component code
 */
export async function extractPropsSchema(code: string): Promise<{
  schema: Record<string, unknown>
  editable: Array<{ name: string; type: string; label: string }>
}> {
  const schema: Record<string, unknown> = {}
  const editable: Array<{ name: string; type: string; label: string }> = []

  // Basic props extraction using regex
  // Match interface/type Props definitions (using [\s\S] instead of /s flag for compatibility)
  const propsMatch = code.match(
    /(?:interface|type)\s+\w*Props\w*\s*(?:=\s*)?\{([\s\S]*?)\}/
  )

  if (propsMatch) {
    const propsContent = propsMatch[1]
    const propLines = propsContent.split('\n')

    for (const line of propLines) {
      const propMatch = line.match(/^\s*(\w+)(\?)?\s*:\s*([^;,\n]+)/)
      if (propMatch) {
        const [, name, optional, type] = propMatch
        const trimmedType = type.trim()

        schema[name] = {
          type: trimmedType,
          required: !optional,
        }

        // Determine editable field type
        let fieldType = 'text'
        if (trimmedType === 'string') fieldType = 'text'
        else if (trimmedType === 'number') fieldType = 'number'
        else if (trimmedType === 'boolean') fieldType = 'boolean'
        else if (trimmedType.includes('[]')) fieldType = 'array'
        else if (trimmedType.includes('{')) fieldType = 'object'

        editable.push({
          name,
          type: fieldType,
          label: name.replace(/([A-Z])/g, ' $1').trim(),
        })
      }
    }
  }

  return { schema, editable }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get collection slug by ID
 */
async function getCollectionSlug(collectionId: string): Promise<string> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('cms_component_collections')
    .select('slug')
    .eq('id', collectionId)
    .single()

  return data?.slug || 'uncategorized'
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
 * Get all active custom components for registry extension
 */
export async function getActiveCustomComponents() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_custom_components')
    .select('*')
    .eq('is_active', true)
    .order('display_name', { ascending: true })

  if (error) {
    console.error('Error fetching active components:', error)
    return []
  }

  return data || []
}
