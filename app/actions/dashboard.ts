'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DashboardLayoutItem } from '@/lib/dashboard/widget-registry'

export interface DashboardWidget {
  id: string
  widget_key: string
  name: string
  description: string | null
  component_name: string
  min_width: number
  min_height: number
  max_width: number | null
  max_height: number | null
  required_permissions: string[]
  is_active: boolean
}

export interface UserWidgetPreference {
  id: string
  widget_id: string
  widget_key: string
  position: DashboardLayoutItem
  config: Record<string, unknown> | null
  is_visible: boolean
}

/**
 * Get all available widgets for the current user based on permissions
 */
export async function getAvailableWidgets(): Promise<{ data: DashboardWidget[] | null; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Unauthorized' }
  }

  // Get all active widgets
  const { data: widgets, error } = await supabase
    .from('dashboard_widgets')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    return { data: null, error: error.message }
  }

  // Get user permissions
  const { data: userPermissions } = await supabase.rpc('get_user_permissions', {
    user_uuid: user.id,
  })

  const permissions = (userPermissions as string[]) || []
  const isSuperAdmin = permissions.includes('*:*:*')

  // Filter widgets based on permissions
  const filteredWidgets = (widgets || []).filter((widget) => {
    if (isSuperAdmin) return true
    if (!widget.required_permissions || widget.required_permissions.length === 0) return true

    return widget.required_permissions.every((required: string) => {
      if (permissions.includes(required)) return true

      const [module, resource, action] = required.split(':')

      return permissions.some((perm: string) => {
        const [permModule, permResource, permAction] = perm.split(':')
        if (permModule === module && permResource === '*' && permAction === '*') return true
        if (permModule === module && permResource === resource && permAction === '*') return true
        return false
      })
    })
  })

  return { data: filteredWidgets, error: null }
}

/**
 * Get user's dashboard widget preferences
 */
export async function getUserDashboardPreferences(): Promise<{
  data: UserWidgetPreference[] | null
  error: string | null
}> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('user_dashboard_preferences')
    .select(
      `
      id,
      widget_id,
      position,
      config,
      is_visible,
      dashboard_widgets!inner (
        widget_key
      )
    `
    )
    .eq('user_id', user.id)
    .eq('is_visible', true)

  if (error) {
    return { data: null, error: error.message }
  }

  // Transform data to include widget_key
  const preferences = (data || []).map((pref) => ({
    id: pref.id,
    widget_id: pref.widget_id,
    widget_key: (pref.dashboard_widgets as { widget_key: string }[])[0]?.widget_key,
    position: pref.position as DashboardLayoutItem,
    config: pref.config as Record<string, unknown> | null,
    is_visible: pref.is_visible,
  }))

  return { data: preferences, error: null }
}

/**
 * Save user's dashboard layout
 */
export async function saveDashboardLayout(
  layout: DashboardLayoutItem[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Get widget IDs by widget_key
  const widgetKeys = layout.map((item) => item.i)
  const { data: widgets } = await supabase
    .from('dashboard_widgets')
    .select('id, widget_key')
    .in('widget_key', widgetKeys)

  if (!widgets || widgets.length === 0) {
    return { success: false, error: 'No valid widgets found' }
  }

  const widgetMap = new Map(widgets.map((w) => [w.widget_key, w.id]))

  // Upsert each widget preference
  for (const item of layout) {
    const widgetId = widgetMap.get(item.i)
    if (!widgetId) continue

    const { error } = await supabase.from('user_dashboard_preferences').upsert(
      {
        user_id: user.id,
        widget_id: widgetId,
        position: {
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          minW: item.minW,
          minH: item.minH,
          maxW: item.maxW,
          maxH: item.maxH,
        },
        is_visible: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,widget_id',
      }
    )

    if (error) {
      console.error('Error saving widget preference:', error)
    }
  }

  revalidatePath('/admin')

  return { success: true, error: null }
}

/**
 * Add a widget to user's dashboard
 */
export async function addWidgetToDashboard(
  widgetKey: string,
  position?: Partial<DashboardLayoutItem>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Get widget by key
  const { data: widget, error: widgetError } = await supabase
    .from('dashboard_widgets')
    .select('id, min_width, min_height')
    .eq('widget_key', widgetKey)
    .single()

  if (widgetError || !widget) {
    return { success: false, error: 'Widget not found' }
  }

  // Create default position
  const defaultPosition = {
    i: widgetKey,
    x: position?.x ?? 0,
    y: position?.y ?? 0,
    w: position?.w ?? widget.min_width ?? 2,
    h: position?.h ?? widget.min_height ?? 2,
    minW: widget.min_width ?? 1,
    minH: widget.min_height ?? 1,
  }

  const { error } = await supabase.from('user_dashboard_preferences').upsert(
    {
      user_id: user.id,
      widget_id: widget.id,
      position: defaultPosition,
      is_visible: true,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,widget_id',
    }
  )

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')

  return { success: true, error: null }
}

/**
 * Remove a widget from user's dashboard
 */
export async function removeWidgetFromDashboard(
  widgetKey: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Get widget by key
  const { data: widget } = await supabase
    .from('dashboard_widgets')
    .select('id')
    .eq('widget_key', widgetKey)
    .single()

  if (!widget) {
    return { success: false, error: 'Widget not found' }
  }

  // Mark as not visible instead of deleting
  const { error } = await supabase
    .from('user_dashboard_preferences')
    .update({ is_visible: false, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('widget_id', widget.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')

  return { success: true, error: null }
}

/**
 * Reset dashboard to default layout based on user's role
 */
export async function resetDashboardToDefault(): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Delete all user preferences
  const { error: deleteError } = await supabase
    .from('user_dashboard_preferences')
    .delete()
    .eq('user_id', user.id)

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  revalidatePath('/admin')

  return { success: true, error: null }
}
