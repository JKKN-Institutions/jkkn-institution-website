'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSettings,
  getSetting,
  getPublicSettings,
  updateSetting,
  updateSettings,
} from '@/app/actions/settings'
import type { SettingCategory, SettingKey, SiteSetting } from '@/lib/settings/types'

/**
 * Hook to fetch all settings for a category
 */
export function useSettings(category?: SettingCategory) {
  return useQuery({
    queryKey: ['settings', category],
    queryFn: async () => {
      const result = await getSettings(category)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch settings')
      }
      return result.data as SiteSetting[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single setting by key
 */
export function useSetting<T = unknown>(key: SettingKey) {
  return useQuery({
    queryKey: ['setting', key],
    queryFn: async () => {
      const result = await getSetting(key)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch setting')
      }
      return result.data as T
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch all public settings
 * Useful for public pages that need site-wide settings
 */
export function usePublicSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: async () => {
      const result = await getPublicSettings()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch public settings')
      }
      return result.data as Record<string, unknown>
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for public settings
  })
}

/**
 * Hook to update a single setting
 */
export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ key, value }: { key: SettingKey; value: unknown }) => {
      const result = await updateSetting(key, value)
      if (!result.success) {
        throw new Error(result.message || 'Failed to update setting')
      }
      return result
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['setting', variables.key] })
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

/**
 * Hook to update multiple settings at once
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: Record<string, unknown>) => {
      const result = await updateSettings(settings)
      if (!result.success) {
        throw new Error(result.message || 'Failed to update settings')
      }
      return result
    },
    onSuccess: () => {
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      queryClient.invalidateQueries({ queryKey: ['setting'] })
    },
  })
}

/**
 * Hook to get settings as a key-value map
 * Useful for forms that need multiple settings at once
 */
export function useSettingsMap(category?: SettingCategory) {
  const { data: settings, ...rest } = useSettings(category)

  const settingsMap: Record<string, unknown> = {}
  settings?.forEach((s) => {
    settingsMap[s.setting_key] = s.setting_value
  })

  return {
    ...rest,
    data: settings,
    settingsMap,
  }
}

/**
 * Typed setting hooks for common settings
 */

export function useSiteName() {
  return useSetting<string>('site_name')
}

export function useSiteDescription() {
  return useSetting<string>('site_description')
}

export function useContactEmail() {
  return useSetting<string>('contact_email')
}

export function useContactPhone() {
  return useSetting<string>('contact_phone')
}

export function useAddress() {
  return useSetting<{
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    country: string
  }>('address')
}

export function useSocialLinks() {
  return useSetting<{
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }>('social_links')
}

export function useThemeColors() {
  const primary = useSetting<string>('theme_primary_color')
  const secondary = useSetting<string>('theme_secondary_color')

  return {
    primaryColor: primary.data || '#1e40af',
    secondaryColor: secondary.data || '#f97316',
    isLoading: primary.isLoading || secondary.isLoading,
    error: primary.error || secondary.error,
  }
}

export function useMaintenanceMode() {
  const { data: isEnabled } = useSetting<boolean>('maintenance_mode')
  const { data: message } = useSetting<string>('maintenance_message')

  return {
    isEnabled: isEnabled ?? false,
    message: message || 'We are currently performing scheduled maintenance.',
  }
}

export function useLogoUrls() {
  const light = useSetting<string>('logo_url')
  const dark = useSetting<string>('logo_dark_url')

  return {
    lightLogo: light.data || '',
    darkLogo: dark.data || '',
    isLoading: light.isLoading || dark.isLoading,
    error: light.error || dark.error,
  }
}

export function useSEODefaults() {
  const title = useSetting<string>('default_meta_title')
  const description = useSetting<string>('default_meta_description')

  return {
    defaultTitle: title.data || 'JKKN Institution',
    defaultDescription: description.data || '',
    isLoading: title.isLoading || description.isLoading,
    error: title.error || description.error,
  }
}
