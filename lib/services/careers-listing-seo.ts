// lib/services/careers-listing-seo.ts
//
// SEO for the /careers listing, edited the same way as every other page:
// Admin → Content → Pages → "careers" → SEO settings (cms_seo_metadata).
// The coded /careers route shadows that CMS page's body but still uses its SEO.
// Server-only. Never throws — the route falls back to built-in text.

import { createPublicSupabaseClient } from '@/lib/supabase/public'

const CMS_SLUG = 'careers'

export interface CareersListingSeo {
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
}

export async function getCareersListingSeo(): Promise<CareersListingSeo | null> {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from('cms_pages')
      .select('cms_seo_metadata(meta_title, meta_description, meta_keywords, og_title, og_description, og_image)')
      .eq('slug', CMS_SLUG)
      .eq('status', 'published')
      .maybeSingle()
    if (error || !data) return null
    const seo = data.cms_seo_metadata as CareersListingSeo | CareersListingSeo[] | null
    return (Array.isArray(seo) ? seo[0] : seo) ?? null
  } catch (err) {
    console.error('[careers] listing SEO unavailable', err)
    return null
  }
}
