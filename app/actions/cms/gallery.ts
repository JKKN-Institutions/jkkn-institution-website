'use server'

import { createPublicSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Type definitions
export interface GalleryCategory {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  category_id: string
  title: string | null
  alt_text: string | null
  caption: string | null
  image_url: string
  thumbnail_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface GalleryCategoryWithImages extends GalleryCategory {
  images: GalleryImage[]
}

/**
 * Get all active gallery categories with their images
 * Used for the public gallery page
 */
export async function getGalleryCategories(): Promise<GalleryCategoryWithImages[]> {
  const supabase = createPublicSupabaseClient()

  // Fetch categories with images in a single query
  const { data: categories, error: catError } = await supabase
    .from('gallery_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (catError) {
    console.error('Error fetching gallery categories:', catError)
    return []
  }

  if (!categories || categories.length === 0) {
    return []
  }

  // Fetch all images for these categories
  const categoryIds = categories.map((c) => c.id)
  const { data: images, error: imgError } = await supabase
    .from('gallery_images')
    .select('*')
    .in('category_id', categoryIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (imgError) {
    console.error('Error fetching gallery images:', imgError)
    return categories.map((cat) => ({ ...cat, images: [] }))
  }

  // Group images by category
  const imagesByCategory = (images || []).reduce(
    (acc, img) => {
      if (!acc[img.category_id]) {
        acc[img.category_id] = []
      }
      acc[img.category_id].push(img)
      return acc
    },
    {} as Record<string, GalleryImage[]>
  )

  // Combine categories with their images
  return categories.map((cat) => ({
    ...cat,
    images: imagesByCategory[cat.id] || [],
  }))
}

/**
 * Get a single category by slug with its images
 */
export async function getGalleryCategoryBySlug(
  slug: string
): Promise<GalleryCategoryWithImages | null> {
  const supabase = createPublicSupabaseClient()

  const { data: category, error: catError } = await supabase
    .from('gallery_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (catError || !category) {
    console.error('Error fetching gallery category:', catError)
    return null
  }

  const { data: images, error: imgError } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (imgError) {
    console.error('Error fetching gallery images:', imgError)
    return { ...category, images: [] }
  }

  return { ...category, images: images || [] }
}

// ============================================
// Admin Functions (require authentication)
// ============================================

/**
 * Create a new gallery category (admin only)
 */
export async function createGalleryCategory(data: {
  name: string
  slug: string
  description?: string
  cover_image?: string
  sort_order?: number
}) {
  const supabase = await createServerSupabaseClient()

  const { data: category, error } = await supabase
    .from('gallery_categories')
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      cover_image: data.cover_image || null,
      sort_order: data.sort_order ?? 0,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating gallery category:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/gallery')
  return { success: true, data: category }
}

/**
 * Update a gallery category (admin only)
 */
export async function updateGalleryCategory(
  id: string,
  data: Partial<{
    name: string
    slug: string
    description: string | null
    cover_image: string | null
    sort_order: number
    is_active: boolean
  }>
) {
  const supabase = await createServerSupabaseClient()

  const { data: category, error } = await supabase
    .from('gallery_categories')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating gallery category:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/gallery')
  return { success: true, data: category }
}

/**
 * Delete a gallery category (admin only)
 */
export async function deleteGalleryCategory(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from('gallery_categories').delete().eq('id', id)

  if (error) {
    console.error('Error deleting gallery category:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/gallery')
  return { success: true }
}

/**
 * Add an image to a gallery category (admin only)
 */
export async function addGalleryImage(data: {
  category_id: string
  title?: string
  alt_text?: string
  caption?: string
  image_url: string
  thumbnail_url?: string
  sort_order?: number
}) {
  const supabase = await createServerSupabaseClient()

  const { data: image, error } = await supabase
    .from('gallery_images')
    .insert({
      category_id: data.category_id,
      title: data.title || null,
      alt_text: data.alt_text || null,
      caption: data.caption || null,
      image_url: data.image_url,
      thumbnail_url: data.thumbnail_url || null,
      sort_order: data.sort_order ?? 0,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding gallery image:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/gallery')
  return { success: true, data: image }
}

/**
 * Update a gallery image (admin only)
 */
export async function updateGalleryImage(
  id: string,
  data: Partial<{
    title: string | null
    alt_text: string | null
    caption: string | null
    image_url: string
    thumbnail_url: string | null
    sort_order: number
    is_active: boolean
  }>
) {
  const supabase = await createServerSupabaseClient()

  const { data: image, error } = await supabase
    .from('gallery_images')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating gallery image:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/gallery')
  return { success: true, data: image }
}

/**
 * Delete a gallery image (admin only)
 */
export async function deleteGalleryImage(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from('gallery_images').delete().eq('id', id)

  if (error) {
    console.error('Error deleting gallery image:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/gallery')
  return { success: true }
}

/**
 * Bulk add images to a category (admin only)
 */
export async function bulkAddGalleryImages(
  categoryId: string,
  images: Array<{
    title?: string
    alt_text?: string
    image_url: string
  }>
) {
  const supabase = await createServerSupabaseClient()

  // Get current max sort order
  const { data: existing } = await supabase
    .from('gallery_images')
    .select('sort_order')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const startOrder = existing?.[0]?.sort_order ?? 0

  const insertData = images.map((img, index) => ({
    category_id: categoryId,
    title: img.title || null,
    alt_text: img.alt_text || null,
    image_url: img.image_url,
    sort_order: startOrder + index + 1,
    is_active: true,
  }))

  const { data, error } = await supabase.from('gallery_images').insert(insertData).select()

  if (error) {
    console.error('Error bulk adding gallery images:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/gallery')
  return { success: true, data }
}
