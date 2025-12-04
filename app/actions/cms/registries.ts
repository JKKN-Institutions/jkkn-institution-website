'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'
import type { ExternalRegistry, RegistryType } from '@/lib/supabase/database.types'

// =============================================================================
// Validation Schemas
// =============================================================================

const CreateRegistrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  registry_url: z.string().url('Invalid URL'),
  registry_type: z.enum(['shadcn', 'reactbits', 'custom'] as const),
  api_endpoint: z.string().url().optional().nullable(),
  auth_config: z.record(z.string(), z.unknown()).optional().default({}),
})

const UpdateRegistrySchema = CreateRegistrySchema.partial().extend({
  id: z.string().uuid('Invalid registry ID'),
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

export interface RegistryComponent {
  name: string
  displayName: string
  description?: string
  category?: string
  preview?: string
  dependencies?: string[]
  files?: Array<{
    name: string
    content?: string
  }>
}

export interface SyncResult {
  success: boolean
  components: RegistryComponent[]
  error?: string
}

// =============================================================================
// Registry CRUD Actions
// =============================================================================

/**
 * Get all registries
 */
export async function getRegistries(): Promise<{ registries: ExternalRegistry[] | null; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_external_registries')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching registries:', error)
    return { registries: null, error: 'Failed to fetch registries' }
  }

  return { registries: data || [], error: null }
}

/**
 * Get active registries only
 */
export async function getActiveRegistries(): Promise<ExternalRegistry[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_external_registries')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching active registries:', error)
    return []
  }

  return data || []
}

/**
 * Get a single registry by ID
 */
export async function getRegistryById(id: string): Promise<ExternalRegistry | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_external_registries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching registry:', error)
    }
    return null
  }

  return data
}

/**
 * Get a registry by slug
 */
export async function getRegistryBySlug(slug: string): Promise<ExternalRegistry | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_external_registries')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching registry by slug:', error)
    }
    return null
  }

  return data
}

/**
 * Add a new registry
 */
export async function addRegistry(
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
  const hasPermission = await checkPermission(user.id, 'cms:registries:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage registries' }
  }

  // Parse auth config
  let authConfig = {}
  try {
    const authConfigStr = formData.get('auth_config')
    if (authConfigStr && typeof authConfigStr === 'string') {
      authConfig = JSON.parse(authConfigStr)
    }
  } catch {
    // Ignore parse errors, use empty object
  }

  // Validate input
  const validation = CreateRegistrySchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    registry_url: formData.get('registry_url'),
    registry_type: formData.get('registry_type'),
    api_endpoint: formData.get('api_endpoint') || null,
    auth_config: authConfig,
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
    .from('cms_external_registries')
    .select('id')
    .eq('slug', validation.data.slug)
    .single()

  if (existing) {
    return { success: false, message: 'A registry with this slug already exists' }
  }

  // Create registry
  const { data: registry, error } = await supabase
    .from('cms_external_registries')
    .insert({
      name: validation.data.name,
      slug: validation.data.slug,
      description: validation.data.description || null,
      registry_url: validation.data.registry_url,
      registry_type: validation.data.registry_type,
      api_endpoint: validation.data.api_endpoint,
      auth_config: validation.data.auth_config,
      is_active: true,
      sync_status: 'never',
      cached_components: [],
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating registry:', error)
    return { success: false, message: 'Failed to create registry. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'registry',
    resourceId: registry.id,
    metadata: { name: validation.data.name, registry_type: validation.data.registry_type },
  })

  revalidatePath('/admin/content/components/registries')
  revalidatePath('/admin/content/components/browse')

  return { success: true, message: 'Registry added successfully', data: { id: registry.id } }
}

/**
 * Update an existing registry
 */
export async function updateRegistry(
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
  const hasPermission = await checkPermission(user.id, 'cms:registries:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage registries' }
  }

  // Parse auth config
  let authConfig: Record<string, unknown> | undefined
  try {
    const authConfigStr = formData.get('auth_config')
    if (authConfigStr && typeof authConfigStr === 'string') {
      authConfig = JSON.parse(authConfigStr)
    }
  } catch {
    // Ignore parse errors
  }

  // Validate input
  const validation = UpdateRegistrySchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name') || undefined,
    slug: formData.get('slug') || undefined,
    description: formData.get('description') || undefined,
    registry_url: formData.get('registry_url') || undefined,
    registry_type: formData.get('registry_type') || undefined,
    api_endpoint: formData.get('api_endpoint') || undefined,
    auth_config: authConfig,
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
      .from('cms_external_registries')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .single()

    if (existing) {
      return { success: false, message: 'A registry with this slug already exists' }
    }
  }

  // Update registry
  const { error } = await supabase
    .from('cms_external_registries')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating registry:', error)
    return { success: false, message: 'Failed to update registry. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'cms',
    resourceType: 'registry',
    resourceId: id,
    metadata: { changes: Object.keys(updateData) },
  })

  revalidatePath('/admin/content/components/registries')
  revalidatePath('/admin/content/components/browse')

  return { success: true, message: 'Registry updated successfully' }
}

/**
 * Delete a registry
 */
export async function deleteRegistry(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:registries:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage registries' }
  }

  // Get registry info for logging
  const { data: registry } = await supabase
    .from('cms_external_registries')
    .select('name, slug')
    .eq('id', id)
    .single()

  if (!registry) {
    return { success: false, message: 'Registry not found' }
  }

  // Delete registry
  const { error } = await supabase.from('cms_external_registries').delete().eq('id', id)

  if (error) {
    console.error('Error deleting registry:', error)
    return { success: false, message: 'Failed to delete registry. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'registry',
    resourceId: id,
    metadata: { name: registry.name, slug: registry.slug },
  })

  revalidatePath('/admin/content/components/registries')
  revalidatePath('/admin/content/components/browse')

  return { success: true, message: 'Registry deleted successfully' }
}

/**
 * Toggle registry active status
 */
export async function toggleRegistryActive(id: string, isActive: boolean): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:registries:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage registries' }
  }

  const { data: registry, error } = await supabase
    .from('cms_external_registries')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('name')
    .single()

  if (error) {
    console.error('Error toggling registry active:', error)
    return { success: false, message: 'Failed to update registry status' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: isActive ? 'activate' : 'deactivate',
    module: 'cms',
    resourceType: 'registry',
    resourceId: id,
    metadata: { name: registry.name },
  })

  revalidatePath('/admin/content/components/registries')
  revalidatePath('/admin/content/components/browse')

  return {
    success: true,
    message: isActive ? 'Registry activated' : 'Registry deactivated',
  }
}

// =============================================================================
// Direct-call wrappers (for forms that don't use useFormState)
// =============================================================================

/**
 * Add a registry - direct call version (without prevState)
 */
export async function addRegistryDirect(formData: FormData): Promise<FormState> {
  return addRegistry({}, formData)
}

/**
 * Update a registry - direct call version (without prevState)
 * Accepts id and formData, adds id to formData before calling main function
 */
export async function updateRegistryDirect(id: string, formData: FormData): Promise<FormState> {
  formData.set('id', id)
  return updateRegistry({}, formData)
}

// =============================================================================
// Sync & Fetch Actions
// =============================================================================

/**
 * Sync components from a registry
 */
export async function syncRegistry(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:registries:manage')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to sync registries' }
  }

  // Get registry
  const { data: registry } = await supabase
    .from('cms_external_registries')
    .select('*')
    .eq('id', id)
    .single()

  if (!registry) {
    return { success: false, message: 'Registry not found' }
  }

  // Update sync status to syncing
  await supabase
    .from('cms_external_registries')
    .update({ sync_status: 'syncing' })
    .eq('id', id)

  try {
    // Fetch components based on registry type
    const result = await fetchComponentsFromRegistry(registry)

    if (!result.success) {
      await supabase
        .from('cms_external_registries')
        .update({
          sync_status: 'error',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      return { success: false, message: result.error || 'Failed to sync registry' }
    }

    // Update registry with cached components
    await supabase
      .from('cms_external_registries')
      .update({
        cached_components: result.components as unknown as object[],
        sync_status: 'success',
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'sync',
      module: 'cms',
      resourceType: 'registry',
      resourceId: id,
      metadata: {
        name: registry.name,
        component_count: result.components.length,
      },
    })

    revalidatePath('/admin/content/components/registries')
    revalidatePath('/admin/content/components/browse')
    revalidatePath(`/admin/content/components/browse/${registry.slug}`)

    return {
      success: true,
      message: `Synced ${result.components.length} components from ${registry.name}`,
      data: { component_count: result.components.length },
    }
  } catch (error) {
    console.error('Error syncing registry:', error)

    await supabase
      .from('cms_external_registries')
      .update({
        sync_status: 'error',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    return { success: false, message: 'Failed to sync registry. Please try again.' }
  }
}

/**
 * Fetch components from a registry based on its type
 */
async function fetchComponentsFromRegistry(registry: ExternalRegistry): Promise<SyncResult> {
  switch (registry.registry_type) {
    case 'shadcn':
      return fetchShadcnComponents(registry)
    case 'reactbits':
      return fetchReactBitsComponents(registry)
    case 'custom':
      return fetchCustomRegistryComponents(registry)
    default:
      return { success: false, components: [], error: 'Unknown registry type' }
  }
}

/**
 * Fetch components from shadcn/ui registry
 */
async function fetchShadcnComponents(registry: ExternalRegistry): Promise<SyncResult> {
  try {
    // shadcn/ui uses a registry.json endpoint
    const registryUrl = registry.api_endpoint || `${registry.registry_url}/registry/index.json`

    const response = await fetch(registryUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JKKN-CMS/1.0',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return {
        success: false,
        components: [],
        error: `Failed to fetch from shadcn registry: ${response.status}`,
      }
    }

    const data = await response.json()

    // shadcn registry format varies, handle different structures
    const components: RegistryComponent[] = []

    if (Array.isArray(data)) {
      for (const item of data) {
        components.push({
          name: item.name,
          displayName: item.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: item.description || '',
          category: item.type || 'ui',
          dependencies: item.dependencies || [],
          files: item.files || [],
        })
      }
    } else if (data.components) {
      // Alternative format
      for (const [name, details] of Object.entries(data.components)) {
        const d = details as Record<string, unknown>
        components.push({
          name,
          displayName: (d.title as string) || name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: (d.description as string) || '',
          category: (d.category as string) || 'ui',
          dependencies: (d.dependencies as string[]) || [],
        })
      }
    }

    return { success: true, components }
  } catch (error) {
    console.error('Error fetching shadcn components:', error)
    return {
      success: false,
      components: [],
      error: 'Failed to fetch shadcn components',
    }
  }
}

/**
 * Fetch components from ReactBits registry
 */
async function fetchReactBitsComponents(registry: ExternalRegistry): Promise<SyncResult> {
  try {
    // ReactBits might have a different API structure
    const registryUrl = registry.api_endpoint || `${registry.registry_url}/api/components`

    const response = await fetch(registryUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JKKN-CMS/1.0',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      // Fallback: Try to parse from main page or use cached data
      return {
        success: false,
        components: [],
        error: `Failed to fetch from ReactBits registry: ${response.status}`,
      }
    }

    const data = await response.json()
    const components: RegistryComponent[] = []

    // Parse based on ReactBits structure
    if (Array.isArray(data)) {
      for (const item of data) {
        components.push({
          name: item.name || item.id,
          displayName: item.title || item.name,
          description: item.description || '',
          category: item.category || 'components',
          preview: item.preview || item.thumbnail,
          dependencies: item.dependencies || [],
        })
      }
    }

    return { success: true, components }
  } catch (error) {
    console.error('Error fetching ReactBits components:', error)
    return {
      success: false,
      components: [],
      error: 'Failed to fetch ReactBits components',
    }
  }
}

/**
 * Fetch components from a custom registry
 */
async function fetchCustomRegistryComponents(registry: ExternalRegistry): Promise<SyncResult> {
  try {
    const registryUrl = registry.api_endpoint || registry.registry_url

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'JKKN-CMS/1.0',
    }

    // Add auth if configured
    const authConfig = registry.auth_config as Record<string, unknown>
    if (authConfig?.token) {
      headers['Authorization'] = `Bearer ${authConfig.token}`
    } else if (authConfig?.apiKey) {
      headers['X-API-Key'] = authConfig.apiKey as string
    }

    const response = await fetch(registryUrl, {
      headers,
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return {
        success: false,
        components: [],
        error: `Failed to fetch from custom registry: ${response.status}`,
      }
    }

    const data = await response.json()
    const components: RegistryComponent[] = []

    // Handle various response formats
    const items = Array.isArray(data) ? data : data.components || data.items || []

    for (const item of items) {
      components.push({
        name: item.name || item.id,
        displayName: item.displayName || item.title || item.name,
        description: item.description || '',
        category: item.category || 'custom',
        preview: item.preview || item.thumbnail || item.image,
        dependencies: item.dependencies || [],
        files: item.files || [],
      })
    }

    return { success: true, components }
  } catch (error) {
    console.error('Error fetching custom registry components:', error)
    return {
      success: false,
      components: [],
      error: 'Failed to fetch custom registry components',
    }
  }
}

/**
 * Get cached components from a registry
 */
export async function fetchRegistryComponents(id: string): Promise<RegistryComponent[]> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('cms_external_registries')
    .select('cached_components')
    .eq('id', id)
    .single()

  return (data?.cached_components as unknown as RegistryComponent[]) || []
}

/**
 * Install a component from an external registry
 */
export async function installFromRegistry(
  registryId: string,
  componentName: string,
  collectionId?: string | null
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
  const hasPermission = await checkPermission(user.id, 'cms:components:install')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to install components' }
  }

  // Get registry
  const { data: registry } = await supabase
    .from('cms_external_registries')
    .select('*')
    .eq('id', registryId)
    .single()

  if (!registry) {
    return { success: false, message: 'Registry not found' }
  }

  // Find component in cached components
  const cachedComponents = registry.cached_components as unknown as RegistryComponent[]
  const component = cachedComponents.find((c) => c.name === componentName)

  if (!component) {
    return { success: false, message: 'Component not found in registry. Try syncing first.' }
  }

  // Check if component already exists
  const pascalName = componentName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const { data: existing } = await supabase
    .from('cms_custom_components')
    .select('id')
    .eq('name', pascalName)
    .single()

  if (existing) {
    return { success: false, message: 'A component with this name already exists' }
  }

  // Fetch actual component code based on registry type
  let code = ''
  try {
    code = await fetchComponentCode(registry, componentName)
    if (!code) {
      return { success: false, message: 'Failed to fetch component code' }
    }
  } catch (error) {
    console.error('Error fetching component code:', error)
    return { success: false, message: 'Failed to fetch component code from registry' }
  }

  // Generate file path
  const collectionSlug = collectionId
    ? await getCollectionSlug(collectionId)
    : 'uncategorized'
  const filePath = `components/cms-blocks/custom/${collectionSlug}/${componentName}.tsx`

  // Create component record
  const { data: newComponent, error } = await supabase
    .from('cms_custom_components')
    .insert({
      name: pascalName,
      display_name: component.displayName,
      description: component.description || null,
      category: mapCategory(component.category),
      icon: 'Package',
      source_type: registry.registry_type as 'shadcn' | 'reactbits' | 'external',
      source_url: `${registry.registry_url}/${componentName}`,
      source_registry: registry.slug,
      file_path: filePath,
      code,
      props_schema: {},
      default_props: {},
      editable_props: [],
      supports_children: false,
      is_full_width: false,
      collection_id: collectionId || null,
      keywords: [componentName, registry.registry_type, registry.name],
      dependencies: component.dependencies?.map((d) => ({ name: d })) || [],
      preview_status: 'pending',
      is_active: true,
      version: '1.0.0',
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error installing component:', error)
    return { success: false, message: 'Failed to install component. Please try again.' }
  }

  // Queue preview generation
  await supabase.from('cms_preview_jobs').insert({
    component_id: newComponent.id,
    status: 'pending',
  })

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'install',
    module: 'cms',
    resourceType: 'component',
    resourceId: newComponent.id,
    metadata: {
      name: pascalName,
      registry: registry.name,
      source: componentName,
    },
  })

  revalidatePath('/admin/content/components')
  revalidatePath('/admin/content/components/browse')

  return {
    success: true,
    message: `Component "${component.displayName}" installed successfully`,
    data: { id: newComponent.id },
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Fetch actual component code from registry
 */
async function fetchComponentCode(
  registry: ExternalRegistry,
  componentName: string
): Promise<string> {
  switch (registry.registry_type) {
    case 'shadcn':
      return fetchShadcnComponentCode(registry, componentName)
    case 'reactbits':
      return fetchReactBitsComponentCode(registry, componentName)
    case 'custom':
      return fetchCustomComponentCode(registry, componentName)
    default:
      return ''
  }
}

/**
 * Fetch shadcn component code
 */
async function fetchShadcnComponentCode(
  registry: ExternalRegistry,
  componentName: string
): Promise<string> {
  try {
    // shadcn components are typically fetched via the CLI or direct file URL
    const codeUrl = `${registry.registry_url}/registry/styles/default/${componentName}.json`

    const response = await fetch(codeUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JKKN-CMS/1.0',
      },
    })

    if (!response.ok) {
      // Try alternative URL format
      const altUrl = `${registry.registry_url}/${componentName}.tsx`
      const altResponse = await fetch(altUrl)
      if (altResponse.ok) {
        return altResponse.text()
      }
      return ''
    }

    const data = await response.json()

    // shadcn returns files array with content
    if (data.files && data.files.length > 0) {
      return data.files[0].content || ''
    }

    return ''
  } catch (error) {
    console.error('Error fetching shadcn component code:', error)
    return ''
  }
}

/**
 * Fetch ReactBits component code
 */
async function fetchReactBitsComponentCode(
  registry: ExternalRegistry,
  componentName: string
): Promise<string> {
  try {
    const codeUrl = `${registry.registry_url}/api/components/${componentName}/code`

    const response = await fetch(codeUrl, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'JKKN-CMS/1.0',
      },
    })

    if (!response.ok) {
      return ''
    }

    return response.text()
  } catch (error) {
    console.error('Error fetching ReactBits component code:', error)
    return ''
  }
}

/**
 * Fetch custom registry component code
 */
async function fetchCustomComponentCode(
  registry: ExternalRegistry,
  componentName: string
): Promise<string> {
  try {
    const codeUrl = `${registry.registry_url}/components/${componentName}`
    const authConfig = registry.auth_config as Record<string, unknown>

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'JKKN-CMS/1.0',
    }

    if (authConfig?.token) {
      headers['Authorization'] = `Bearer ${authConfig.token}`
    } else if (authConfig?.apiKey) {
      headers['X-API-Key'] = authConfig.apiKey as string
    }

    const response = await fetch(codeUrl, { headers })

    if (!response.ok) {
      return ''
    }

    const data = await response.json()
    return data.code || data.content || data.source || ''
  } catch (error) {
    console.error('Error fetching custom component code:', error)
    return ''
  }
}

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
 * Map external category to our categories
 */
function mapCategory(
  category?: string
): 'content' | 'media' | 'layout' | 'data' | 'custom' {
  if (!category) return 'custom'

  const lowerCategory = category.toLowerCase()

  if (['ui', 'component', 'components', 'content'].includes(lowerCategory)) {
    return 'content'
  }
  if (['media', 'image', 'video', 'gallery'].includes(lowerCategory)) {
    return 'media'
  }
  if (['layout', 'grid', 'container', 'structure'].includes(lowerCategory)) {
    return 'layout'
  }
  if (['data', 'table', 'list', 'chart'].includes(lowerCategory)) {
    return 'data'
  }

  return 'custom'
}
