'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from './permissions'
import type { SiteSetting, SettingCategory, SettingKey } from '@/lib/settings/types'

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

/**
 * Get all settings, optionally filtered by category
 * Public settings are visible to all, private settings require authentication
 */
export async function getSettings(category?: SettingCategory): Promise<{
  success: boolean
  data?: SiteSetting[]
  error?: string
}> {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase.from('site_settings').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('setting_key')

    if (error) {
      console.error('Error fetching settings:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as SiteSetting[] }
  } catch (error) {
    console.error('Error in getSettings:', error)
    return { success: false, error: 'Failed to fetch settings' }
  }
}

/**
 * Get a single setting by key
 */
export async function getSetting(key: SettingKey): Promise<{
  success: boolean
  data?: unknown
  error?: string
}> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: `Setting "${key}" not found` }
      }
      console.error('Error fetching setting:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data.setting_value }
  } catch (error) {
    console.error('Error in getSetting:', error)
    return { success: false, error: 'Failed to fetch setting' }
  }
}

/**
 * Get multiple settings by keys
 */
export async function getSettingsByKeys(keys: SettingKey[]): Promise<{
  success: boolean
  data?: Record<string, unknown>
  error?: string
}> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', keys)

    if (error) {
      console.error('Error fetching settings:', error)
      return { success: false, error: error.message }
    }

    const settingsMap: Record<string, unknown> = {}
    data?.forEach((row) => {
      settingsMap[row.setting_key] = row.setting_value
    })

    return { success: true, data: settingsMap }
  } catch (error) {
    console.error('Error in getSettingsByKeys:', error)
    return { success: false, error: 'Failed to fetch settings' }
  }
}

/**
 * Get all public settings (for use in public pages)
 */
export async function getPublicSettings(): Promise<{
  success: boolean
  data?: Record<string, unknown>
  error?: string
}> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .eq('is_public', true)

    if (error) {
      console.error('Error fetching public settings:', error)
      return { success: false, error: error.message }
    }

    const settingsMap: Record<string, unknown> = {}
    data?.forEach((row) => {
      settingsMap[row.setting_key] = row.setting_value
    })

    return { success: true, data: settingsMap }
  } catch (error) {
    console.error('Error in getPublicSettings:', error)
    return { success: false, error: 'Failed to fetch public settings' }
  }
}

// Validation schema for updating a setting
const UpdateSettingSchema = z.object({
  key: z.string().min(1, 'Setting key is required'),
  value: z.unknown(),
})

/**
 * Update a single setting (super_admin only)
 */
export async function updateSetting(
  key: SettingKey,
  value: unknown
): Promise<FormState> {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: 'You must be logged in to update settings' }
    }

    // Check permission
    const hasPermission = await checkPermission(user.id, 'system:settings:edit')
    if (!hasPermission) {
      return { success: false, message: 'You do not have permission to update settings' }
    }

    // Validate input
    const validation = UpdateSettingSchema.safeParse({ key, value })
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid input',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Update the setting
    const { data, error } = await supabase
      .from('site_settings')
      .update({
        setting_value: value,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('setting_key', key)
      .select()
      .single()

    if (error) {
      console.error('Error updating setting:', error)
      return { success: false, message: error.message }
    }

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'update',
      module: 'settings',
      resourceType: 'setting',
      resourceId: data.id,
      metadata: {
        setting_key: key,
        old_value: null, // Could fetch old value if needed
        new_value: value,
      },
    })

    // Revalidate settings pages
    revalidatePath('/admin/settings')
    revalidatePath('/admin/settings/general')
    revalidatePath('/admin/settings/appearance')
    revalidatePath('/admin/settings/notifications')
    revalidatePath('/admin/settings/system')

    return { success: true, message: 'Setting updated successfully', data }
  } catch (error) {
    console.error('Error in updateSetting:', error)
    return { success: false, message: 'Failed to update setting' }
  }
}

// Validation schema for bulk update
const BulkUpdateSettingsSchema = z.record(z.string(), z.unknown())

/**
 * Update multiple settings at once (super_admin only)
 */
export async function updateSettings(
  settings: Record<string, unknown>
): Promise<FormState> {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: 'You must be logged in to update settings' }
    }

    // Check permission
    const hasPermission = await checkPermission(user.id, 'system:settings:edit')
    if (!hasPermission) {
      return { success: false, message: 'You do not have permission to update settings' }
    }

    // Validate input
    const validation = BulkUpdateSettingsSchema.safeParse(settings)
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid input',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    // Update each setting
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase
        .from('site_settings')
        .update({
          setting_value: value,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('setting_key', key)
    )

    const results = await Promise.all(updates)

    // Check for errors
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      console.error('Errors updating settings:', errors.map((e) => e.error))
      return {
        success: false,
        message: `Failed to update ${errors.length} setting(s)`,
      }
    }

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'update',
      module: 'settings',
      resourceType: 'settings',
      resourceId: 'bulk',
      metadata: {
        updated_keys: Object.keys(settings),
        count: Object.keys(settings).length,
      },
    })

    // Revalidate settings pages
    revalidatePath('/admin/settings')
    revalidatePath('/admin/settings/general')
    revalidatePath('/admin/settings/appearance')
    revalidatePath('/admin/settings/notifications')
    revalidatePath('/admin/settings/system')

    return {
      success: true,
      message: `Successfully updated ${Object.keys(settings).length} setting(s)`,
    }
  } catch (error) {
    console.error('Error in updateSettings:', error)
    return { success: false, message: 'Failed to update settings' }
  }
}

/**
 * Create a new setting (super_admin only)
 */
export async function createSetting(
  key: string,
  value: unknown,
  category: SettingCategory,
  description?: string,
  isPublic?: boolean
): Promise<FormState> {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: 'You must be logged in to create settings' }
    }

    // Check permission
    const hasPermission = await checkPermission(user.id, 'system:settings:edit')
    if (!hasPermission) {
      return { success: false, message: 'You do not have permission to create settings' }
    }

    // Insert the setting
    const { data, error } = await supabase
      .from('site_settings')
      .insert({
        setting_key: key,
        setting_value: value,
        category,
        description,
        is_public: isPublic ?? false,
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return { success: false, message: `Setting "${key}" already exists` }
      }
      console.error('Error creating setting:', error)
      return { success: false, message: error.message }
    }

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'create',
      module: 'settings',
      resourceType: 'setting',
      resourceId: data.id,
      metadata: {
        setting_key: key,
        category,
      },
    })

    revalidatePath('/admin/settings')

    return { success: true, message: 'Setting created successfully', data }
  } catch (error) {
    console.error('Error in createSetting:', error)
    return { success: false, message: 'Failed to create setting' }
  }
}

/**
 * Delete a setting (super_admin only)
 */
export async function deleteSetting(key: string): Promise<FormState> {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: 'You must be logged in to delete settings' }
    }

    // Check permission
    const hasPermission = await checkPermission(user.id, 'system:settings:edit')
    if (!hasPermission) {
      return { success: false, message: 'You do not have permission to delete settings' }
    }

    // Delete the setting
    const { error } = await supabase
      .from('site_settings')
      .delete()
      .eq('setting_key', key)

    if (error) {
      console.error('Error deleting setting:', error)
      return { success: false, message: error.message }
    }

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'delete',
      module: 'settings',
      resourceType: 'setting',
      resourceId: key,
      metadata: { setting_key: key },
    })

    revalidatePath('/admin/settings')

    return { success: true, message: 'Setting deleted successfully' }
  } catch (error) {
    console.error('Error in deleteSetting:', error)
    return { success: false, message: 'Failed to delete setting' }
  }
}

// Validation schema for test email
const TestEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
})

/**
 * Send a test email to verify SMTP settings (super_admin only)
 */
export async function sendTestEmail(to: string): Promise<FormState> {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: 'You must be logged in to send test emails' }
    }

    // Check permission
    const hasPermission = await checkPermission(user.id, 'system:settings:edit')
    if (!hasPermission) {
      return { success: false, message: 'You do not have permission to send test emails' }
    }

    // Validate input
    const validation = TestEmailSchema.safeParse({ to })
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid email address',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Get SMTP settings
    const { data: smtpSetting } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'smtp_settings')
      .single()

    if (!smtpSetting?.setting_value) {
      return { success: false, message: 'SMTP settings not configured' }
    }

    const smtp = smtpSetting.setting_value as {
      host: string
      port: number
      secure: boolean
      user: string
      password: string
      from_email: string
      from_name: string
    }

    if (!smtp.host || !smtp.user || !smtp.password) {
      return { success: false, message: 'SMTP settings are incomplete' }
    }

    // TODO: Implement actual email sending using nodemailer or similar
    // For now, just simulate a successful test
    // In production, you would:
    // 1. Create a transporter with the SMTP settings
    // 2. Send a test email
    // 3. Return success/failure based on the result

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'test',
      module: 'settings',
      resourceType: 'smtp',
      resourceId: 'test-email',
      metadata: { to },
    })

    // Simulated success (in production, remove this and implement real email sending)
    return {
      success: true,
      message: `Test email would be sent to ${to}. SMTP sending not yet implemented.`,
    }
  } catch (error) {
    console.error('Error in sendTestEmail:', error)
    return { success: false, message: 'Failed to send test email' }
  }
}

/**
 * Clear application cache (super_admin only)
 */
export async function clearCache(): Promise<FormState> {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: 'You must be logged in to clear cache' }
    }

    // Check permission
    const hasPermission = await checkPermission(user.id, 'system:settings:edit')
    if (!hasPermission) {
      return { success: false, message: 'You do not have permission to clear cache' }
    }

    // Revalidate all paths
    revalidatePath('/', 'layout')
    revalidatePath('/admin', 'layout')

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'clear',
      module: 'settings',
      resourceType: 'cache',
      resourceId: 'all',
      metadata: {},
    })

    return { success: true, message: 'Cache cleared successfully' }
  } catch (error) {
    console.error('Error in clearCache:', error)
    return { success: false, message: 'Failed to clear cache' }
  }
}

// Validation schema for footer settings
const FooterSettingsSchema = z.object({
  tagline: z.string(),
  description: z.string(),
  institutions: z.array(z.object({
    label: z.string(),
    href: z.string(),
    order: z.number(),
    visible: z.boolean(),
  })),
  programs: z.array(z.object({
    label: z.string(),
    href: z.string(),
    order: z.number(),
    visible: z.boolean(),
  })),
  resources: z.array(z.object({
    label: z.string(),
    href: z.string(),
    order: z.number(),
    visible: z.boolean(),
  })),
  show_about: z.boolean(),
  show_institutions: z.boolean(),
  show_programs: z.boolean(),
  show_resources: z.boolean(),
  show_social: z.boolean(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  address_line1: z.string(),
  address_line2: z.string().optional(),
  address_city: z.string(),
  address_state: z.string(),
  address_pincode: z.string(),
  address_country: z.string(),
  social_facebook: z.string().optional(),
  social_twitter: z.string().optional(),
  social_instagram: z.string().optional(),
  social_linkedin: z.string().optional(),
  social_youtube: z.string().optional(),
  map_embed_url: z.string().optional(),
  map_link_url: z.string().optional(),
})

/**
 * Update footer settings (super_admin only)
 */
export async function updateFooterSettings(
  data: z.infer<typeof FooterSettingsSchema>
): Promise<FormState> {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: 'You must be logged in to update footer settings' }
    }

    // Check permission
    const hasPermission = await checkPermission(user.id, 'system:settings:edit')
    if (!hasPermission) {
      return { success: false, message: 'You do not have permission to update footer settings' }
    }

    // Validate input
    const validation = FooterSettingsSchema.safeParse(data)
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid input',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    // Prepare settings to update
    const settingsToUpdate = {
      footer_tagline: data.tagline,
      footer_description: data.description,
      footer_institutions: data.institutions,
      footer_programs: data.programs,
      footer_resources: data.resources,
      footer_sections_visibility: {
        show_about: data.show_about,
        show_institutions: data.show_institutions,
        show_programs: data.show_programs,
        show_resources: data.show_resources,
        show_social: data.show_social,
      },
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      address: {
        line1: data.address_line1,
        line2: data.address_line2 || '',
        city: data.address_city,
        state: data.address_state,
        pincode: data.address_pincode,
        country: data.address_country,
      },
      social_links: {
        facebook: data.social_facebook || '',
        twitter: data.social_twitter || '',
        instagram: data.social_instagram || '',
        linkedin: data.social_linkedin || '',
        youtube: data.social_youtube || '',
      },
      footer_map: {
        embedUrl: data.map_embed_url || '',
        linkUrl: data.map_link_url || '',
      },
    }

    // Update each setting
    const updates = Object.entries(settingsToUpdate).map(([key, value]) =>
      supabase
        .from('site_settings')
        .update({
          setting_value: value,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('setting_key', key)
    )

    const results = await Promise.all(updates)

    // Check for errors
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      console.error('Errors updating footer settings:', errors.map((e) => e.error))
      return {
        success: false,
        message: `Failed to update ${errors.length} footer setting(s)`,
      }
    }

    // Log activity
    await logActivity({
      userId: user.id,
      action: 'update',
      module: 'settings',
      resourceType: 'footer_settings',
      resourceId: 'footer',
      metadata: {
        updated_keys: Object.keys(settingsToUpdate),
        count: Object.keys(settingsToUpdate).length,
      },
    })

    // Revalidate pages
    revalidatePath('/admin/settings/footer')
    revalidatePath('/', 'layout')

    return {
      success: true,
      message: 'Footer settings updated successfully',
    }
  } catch (error) {
    console.error('Error in updateFooterSettings:', error)
    return { success: false, message: 'Failed to update footer settings' }
  }
}
