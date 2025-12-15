'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

// Types for homepage sections
export interface HomepageNewsItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  date: string
  link: string
  category: string
  readTime?: number
}

export interface HomepageBuzzItem {
  id: string
  title: string
  slug: string
  image: string | null
  link: string
  category: string
  excerpt?: string
}

export interface HomepageEventItem {
  id: string
  title: string
  slug: string
  image: string | null
  date: string
  link: string
  description: string | null
  location?: string
}

/**
 * Fetch blog posts for College News section
 */
export async function getCollegeNewsItems(limit: number = 6): Promise<HomepageNewsItem[]> {
  const supabase = await createServerSupabaseClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      id, title, slug, excerpt, featured_image, published_at, reading_time_minutes,
      category:blog_categories!category_id (name)
    `)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('blog_categories.slug', 'college-news')
    .lte('published_at', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching college news:', error)
    return []
  }

  return (posts || []).map((post) => {
    // Handle Supabase's array return for joins
    const categoryData = Array.isArray(post.category) ? post.category[0] : post.category
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      image: post.featured_image,
      date: post.published_at || new Date().toISOString(),
      link: `/blog/${post.slug}`,
      category: categoryData?.name || 'College News',
      readTime: post.reading_time_minutes || 5,
    }
  })
}

/**
 * Fetch blog posts for Latest Buzz section
 */
export async function getLatestBuzzItems(limit: number = 6): Promise<HomepageBuzzItem[]> {
  const supabase = await createServerSupabaseClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      id, title, slug, excerpt, featured_image,
      category:blog_categories!category_id (name)
    `)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('blog_categories.slug', 'latest-buzz')
    .lte('published_at', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest buzz:', error)
    return []
  }

  return (posts || []).map((post) => {
    // Handle Supabase's array return for joins
    const categoryData = Array.isArray(post.category) ? post.category[0] : post.category
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      image: post.featured_image,
      link: `/blog/${post.slug}`,
      category: categoryData?.name || 'Latest Buzz',
      excerpt: post.excerpt || undefined,
    }
  })
}

/**
 * Fetch blog posts for Past Events section
 */
export async function getPastEventsItems(limit: number = 6): Promise<HomepageEventItem[]> {
  const supabase = await createServerSupabaseClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      id, title, slug, excerpt, featured_image, published_at, metadata
    `)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('blog_categories.slug', 'past-events')
    .lte('published_at', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching past events:', error)
    return []
  }

  return (posts || []).map((post) => {
    const metadata = post.metadata as Record<string, unknown> | null
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      image: post.featured_image,
      date: post.published_at || new Date().toISOString(),
      link: `/blog/${post.slug}`,
      description: post.excerpt,
      location: (metadata?.location as string) || undefined,
    }
  })
}

/**
 * Fetch blog posts by category slug (generic function)
 */
export async function getBlogPostsByCategory(
  categorySlug: string,
  limit: number = 6
): Promise<{
  posts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    featured_image: string | null
    published_at: string | null
    reading_time_minutes: number | null
    metadata: Record<string, unknown> | null
    category: { name: string; slug: string; color: string | null } | null
  }>
  category: { id: string; name: string; slug: string; color: string | null } | null
}> {
  console.log(`[getBlogPostsByCategory] Called with: categorySlug="${categorySlug}", limit=${limit}`)

  const supabase = await createServerSupabaseClient()

  // First get the category
  const { data: category, error: catError } = await supabase
    .from('blog_categories')
    .select('id, name, slug, color')
    .eq('slug', categorySlug)
    .eq('is_active', true)
    .single()

  console.log(`[getBlogPostsByCategory] Category result: id=${category?.id}, name=${category?.name}, error=${catError?.message || 'none'}`)

  if (catError || !category) {
    console.error('Error fetching category:', catError)
    return { posts: [], category: null }
  }

  // Then fetch posts for this category
  const { data: posts, error: postsError } = await supabase
    .from('blog_posts')
    .select(`
      id, title, slug, excerpt, featured_image, published_at, reading_time_minutes, metadata,
      category:blog_categories!category_id (name, slug, color)
    `)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .eq('category_id', category.id)
    .lte('published_at', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  console.log(`[getBlogPostsByCategory] Posts result: count=${posts?.length || 0}, error=${postsError?.message || 'none'}`)

  if (postsError) {
    console.error('Error fetching posts by category:', postsError)
    return { posts: [], category }
  }

  return {
    posts: (posts || []).map((post) => {
      // Handle Supabase's array return for joins
      const categoryData = Array.isArray(post.category) ? post.category[0] : post.category
      return {
        ...post,
        category: categoryData as { name: string; slug: string; color: string | null } | null,
      }
    }),
    category,
  }
}
