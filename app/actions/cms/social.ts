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

function logSupabaseError(context: string, error: unknown) {
  if (error && typeof error === 'object') {
    const e = error as { message?: string; code?: string; hint?: string; details?: string }
    if (e.code === '42P01') return
    console.error(`[${context}]`, {
      message: e.message,
      code: e.code,
      hint: e.hint,
      details: e.details,
    })
  } else {
    console.error(`[${context}]`, error)
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('site_social_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      logSupabaseError('getSocialLinks', error)
      return []
    }

    return data || []
  } catch (err) {
    logSupabaseError('getSocialLinks:throw', err)
    return []
  }
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('site_social_links')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      logSupabaseError('getAllSocialLinks', error)
      return []
    }

    return data || []
  } catch (err) {
    logSupabaseError('getAllSocialLinks:throw', err)
    return []
  }
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
