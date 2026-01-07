'use client'

import { use, cache } from 'react'
import { createClient } from '@/lib/supabase/client'
import { registerCustomComponents } from '@/lib/cms/component-registry'
import type { CustomComponentData } from '@/lib/cms/component-registry'

/**
 * Cache function to load custom components
 * This is called synchronously during render using React.use()
 */
const loadCustomComponents = cache(async () => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('cms_custom_components')
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true })

    if (error) {
      console.error('[CustomComponentLoader] Error fetching components:', error)
      return []
    }

    if (data && data.length > 0) {
      // Transform database records to CustomComponentData format
      const components = data.map((comp) => ({
        id: comp.id,
        name: comp.name,
        display_name: comp.display_name,
        description: comp.description,
        category: comp.category,
        icon: comp.icon,
        code: comp.code,
        props_schema: comp.props_schema,
        default_props: comp.default_props,
        source_type: comp.source_type,
        source_url: comp.source_url,
        dependencies: comp.dependencies,
        is_active: comp.is_active,
        preview_image: comp.preview_image,
        preview_status: comp.preview_status,
        supports_children: comp.supports_children,
        is_full_width: comp.is_full_width,
        created_at: comp.created_at,
        updated_at: comp.updated_at,
        created_by: comp.created_by,
      })) as CustomComponentData[]

      return components
    }

    return []
  } catch (err) {
    console.error('[CustomComponentLoader] Error loading custom components:', err)
    return []
  }
})

/**
 * Custom Component Loader
 *
 * This component fetches all active custom components from the database
 * and registers them in the component registry so they can be rendered
 * on public pages.
 *
 * IMPORTANT: This uses React.use() to load components synchronously during render,
 * ensuring components are registered BEFORE PageRenderer tries to use them.
 */
export function CustomComponentLoader() {
  // Load components synchronously using React.use()
  const components = use(loadCustomComponents())

  // Register components immediately
  if (components.length > 0) {
    registerCustomComponents(components)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[CustomComponentLoader] Registered ${components.length} custom components:`, components.map(c => c.name))
    }
  }

  // This component doesn't render anything
  return null
}
