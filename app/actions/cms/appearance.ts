'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * Logo size configuration type
 */
export interface LogoSizes {
  mobile: number
  tablet: number
  desktop: number
  desktopLarge: number
}

/**
 * Get logo size configuration from site settings
 */
export async function getLogoSizes(): Promise<LogoSizes> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('setting_key, setting_value')
    .in('setting_key', [
      'logo_mobile_size',
      'logo_tablet_size',
      'logo_desktop_size',
      'logo_desktop_large_size'
    ])

  if (error) {
    console.error('Error fetching logo sizes:', error)
    // Return defaults if fetch fails
    return {
      mobile: 64,
      tablet: 80,
      desktop: 80,
      desktopLarge: 96
    }
  }

  const sizes: LogoSizes = {
    mobile: 64,
    tablet: 80,
    desktop: 80,
    desktopLarge: 96
  }

  data?.forEach((setting) => {
    const value = typeof setting.setting_value === 'number'
      ? setting.setting_value
      : parseInt(String(setting.setting_value))

    switch (setting.setting_key) {
      case 'logo_mobile_size':
        sizes.mobile = value
        break
      case 'logo_tablet_size':
        sizes.tablet = value
        break
      case 'logo_desktop_size':
        sizes.desktop = value
        break
      case 'logo_desktop_large_size':
        sizes.desktopLarge = value
        break
    }
  })

  return sizes
}

/**
 * Get logo URL from site settings
 */
export async function getLogoUrl(): Promise<string> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('site_settings')
    .select('setting_value')
    .eq('setting_key', 'logo_url')
    .single()

  return data?.setting_value ? String(data.setting_value) : '/images/logo.png'
}
