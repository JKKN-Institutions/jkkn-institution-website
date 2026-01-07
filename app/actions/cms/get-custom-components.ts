'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { CustomComponentData } from '@/lib/cms/component-registry'

/**
 * Server action to fetch all active custom components
 * This runs on the server and can access the database with proper auth
 */
export async function getActiveCustomComponents(): Promise<CustomComponentData[]> {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('cms_custom_components')
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true })

    if (error) {
      console.error('[getActiveCustomComponents] Database error:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Transform database records to CustomComponentData format
    const components: CustomComponentData[] = data.map((comp) => ({
      id: comp.id,
      name: comp.name,
      display_name: comp.display_name,
      description: comp.description,
      category: comp.category as 'data' | 'custom',
      icon: comp.icon,
      code: comp.code,
      props_schema: comp.props_schema as Record<string, unknown>,
      default_props: comp.default_props as Record<string, unknown>,
      source_type: comp.source_type as 'custom' | 'shadcn' | 'library' | 'builtin',
      source_url: comp.source_url,
      dependencies: comp.dependencies as string[],
      is_active: comp.is_active,
      preview_image: comp.preview_image,
      preview_status: comp.preview_status as 'pending' | 'generating' | 'completed' | 'failed',
      supports_children: comp.supports_children,
      is_full_width: comp.is_full_width,
      created_at: comp.created_at,
      updated_at: comp.updated_at,
      created_by: comp.created_by,
    }))

    return components
  } catch (err) {
    console.error('[getActiveCustomComponents] Unexpected error:', err)
    return []
  }
}
