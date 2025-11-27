'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface NavItem {
  id: string
  label: string
  href: string
  is_homepage: boolean
  children?: NavItem[]
}

interface PageNavData {
  id: string
  title: string
  slug: string
  parent_id: string | null
  sort_order: number | null
  navigation_label: string | null
  is_homepage: boolean
}

/**
 * Build hierarchical navigation tree from flat pages array
 */
function buildNavTree(pages: PageNavData[]): NavItem[] {
  const pageMap = new Map<string, NavItem & { parent_id: string | null; sort_order: number }>()

  // Create nav items from pages
  pages.forEach((page) => {
    const href = page.is_homepage ? '/' : `/${page.slug}`
    pageMap.set(page.id, {
      id: page.id,
      label: page.navigation_label || page.title,
      href,
      is_homepage: page.is_homepage,
      parent_id: page.parent_id,
      sort_order: page.sort_order ?? 999,
      children: [],
    })
  })

  const rootItems: NavItem[] = []

  // Build tree structure
  pages.forEach((page) => {
    const item = pageMap.get(page.id)!
    if (page.parent_id && pageMap.has(page.parent_id)) {
      const parent = pageMap.get(page.parent_id)!
      if (!parent.children) parent.children = []
      parent.children.push(item)
    } else {
      rootItems.push(item)
    }
  })

  // Sort function
  const sortItems = (items: (NavItem & { sort_order?: number })[]): NavItem[] => {
    return items
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
      .map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sort_order, parent_id, ...rest } = item as NavItem & { sort_order?: number; parent_id?: string }
        return {
          ...rest,
          children: item.children && item.children.length > 0
            ? sortItems(item.children as (NavItem & { sort_order?: number })[])
            : undefined,
        }
      })
  }

  return sortItems(rootItems)
}

/**
 * Get public navigation from CMS pages
 * Returns hierarchical navigation tree from published pages with show_in_navigation=true
 */
export async function getPublicNavigation(): Promise<NavItem[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select('id, title, slug, parent_id, sort_order, navigation_label, is_homepage')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('show_in_navigation', true)
    .order('sort_order', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching navigation:', error)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return buildNavTree(data as PageNavData[])
}

/**
 * Get navigation for a specific section (by parent page slug)
 */
export async function getSectionNavigation(parentSlug: string): Promise<NavItem[]> {
  const supabase = await createServerSupabaseClient()

  // First, find the parent page
  const { data: parentPage, error: parentError } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('slug', parentSlug)
    .eq('status', 'published')
    .single()

  if (parentError || !parentPage) {
    return []
  }

  // Get child pages
  const { data, error } = await supabase
    .from('cms_pages')
    .select('id, title, slug, parent_id, sort_order, navigation_label, is_homepage')
    .eq('parent_id', parentPage.id)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('show_in_navigation', true)
    .order('sort_order', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching section navigation:', error)
    return []
  }

  return buildNavTree(data as PageNavData[])
}
