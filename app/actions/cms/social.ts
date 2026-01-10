'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * Social media link types
 */
export interface SocialLink {
  id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | string
  url: string
  is_active: boolean
  display_order: number
}

/**
 * Get all active social links, ordered by display_order
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('site_social_links')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching social links:', error)
    return []
  }

  return data || []
}

/**
 * Get all social links (including inactive), for admin use
 */
export async function getAllSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('site_social_links')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching all social links:', error)
    return []
  }

  return data || []
}

/**
 * Get social link by platform
 */
export async function getSocialLinkByPlatform(
  platform: string
): Promise<SocialLink | null> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('site_social_links')
    .select('*')
    .eq('platform', platform)
    .eq('is_active', true)
    .single()

  return data || null
}
