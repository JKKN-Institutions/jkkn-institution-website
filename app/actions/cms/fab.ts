import { createPublicSupabaseClient } from '@/lib/supabase/public'

// FAB Config type matching cms_page_fab_config table
export interface GlobalFabConfig {
  id: string
  is_enabled: boolean
  position: string
  theme: string | null
  show_whatsapp: boolean
  show_phone: boolean
  show_email: boolean
  show_directions: boolean
  whatsapp_number: string | null
  phone_number: string | null
  email_address: string | null
  directions_url: string | null
  animation: string | null
  delay_ms: number | null
  hide_on_scroll: boolean | null
}

// Default FAB config used when no database config exists
const DEFAULT_FAB_CONFIG: GlobalFabConfig = {
  id: 'default',
  is_enabled: true,
  position: 'bottom-right',
  theme: 'default',
  show_whatsapp: true,
  show_phone: true,
  show_email: true,
  show_directions: true,
  whatsapp_number: '+914222661100',
  phone_number: '+914222661100',
  email_address: 'info@jkkn.ac.in',
  directions_url: 'https://maps.google.com/?q=JKKN+Komarapalayam',
  animation: 'fade',
  delay_ms: 2000,
  hide_on_scroll: false,
}

/**
 * Fetch global FAB config from Home page's cms_page_fab_config
 * Falls back to default config if not found or disabled
 */
export async function getGlobalFabConfig(): Promise<GlobalFabConfig> {
  try {
    const supabase = createPublicSupabaseClient()

    // Try to get FAB config from "home" page first
    const { data: homePageConfig, error: homeError } = await supabase
      .from('cms_page_fab_config')
      .select(`
        id,
        is_enabled,
        position,
        theme,
        show_whatsapp,
        show_phone,
        show_email,
        show_directions,
        whatsapp_number,
        phone_number,
        email_address,
        directions_url,
        animation,
        delay_ms,
        hide_on_scroll,
        cms_pages!inner(slug)
      `)
      .eq('cms_pages.slug', 'home')
      .single()

    if (!homeError && homePageConfig) {
      // Return home page config with defaults for null values
      return {
        id: homePageConfig.id,
        is_enabled: homePageConfig.is_enabled ?? true,
        position: homePageConfig.position ?? 'bottom-right',
        theme: homePageConfig.theme,
        show_whatsapp: homePageConfig.show_whatsapp ?? true,
        show_phone: homePageConfig.show_phone ?? true,
        show_email: homePageConfig.show_email ?? true,
        show_directions: homePageConfig.show_directions ?? true,
        whatsapp_number: homePageConfig.whatsapp_number ?? DEFAULT_FAB_CONFIG.whatsapp_number,
        phone_number: homePageConfig.phone_number ?? DEFAULT_FAB_CONFIG.phone_number,
        email_address: homePageConfig.email_address ?? DEFAULT_FAB_CONFIG.email_address,
        directions_url: homePageConfig.directions_url ?? DEFAULT_FAB_CONFIG.directions_url,
        animation: homePageConfig.animation,
        delay_ms: homePageConfig.delay_ms ?? 2000,
        hide_on_scroll: homePageConfig.hide_on_scroll ?? false,
      }
    }

    // Fallback: try to find any page with FAB enabled
    const { data: anyEnabledConfig } = await supabase
      .from('cms_page_fab_config')
      .select(`
        id,
        is_enabled,
        position,
        theme,
        show_whatsapp,
        show_phone,
        show_email,
        show_directions,
        whatsapp_number,
        phone_number,
        email_address,
        directions_url,
        animation,
        delay_ms,
        hide_on_scroll
      `)
      .eq('is_enabled', true)
      .limit(1)
      .single()

    if (anyEnabledConfig) {
      return {
        id: anyEnabledConfig.id,
        is_enabled: anyEnabledConfig.is_enabled ?? true,
        position: anyEnabledConfig.position ?? 'bottom-right',
        theme: anyEnabledConfig.theme,
        show_whatsapp: anyEnabledConfig.show_whatsapp ?? true,
        show_phone: anyEnabledConfig.show_phone ?? true,
        show_email: anyEnabledConfig.show_email ?? true,
        show_directions: anyEnabledConfig.show_directions ?? true,
        whatsapp_number: anyEnabledConfig.whatsapp_number ?? DEFAULT_FAB_CONFIG.whatsapp_number,
        phone_number: anyEnabledConfig.phone_number ?? DEFAULT_FAB_CONFIG.phone_number,
        email_address: anyEnabledConfig.email_address ?? DEFAULT_FAB_CONFIG.email_address,
        directions_url: anyEnabledConfig.directions_url ?? DEFAULT_FAB_CONFIG.directions_url,
        animation: anyEnabledConfig.animation,
        delay_ms: anyEnabledConfig.delay_ms ?? 2000,
        hide_on_scroll: anyEnabledConfig.hide_on_scroll ?? false,
      }
    }

    // Return default config if nothing found
    return DEFAULT_FAB_CONFIG
  } catch (error) {
    console.error('Error fetching global FAB config:', error)
    return DEFAULT_FAB_CONFIG
  }
}
