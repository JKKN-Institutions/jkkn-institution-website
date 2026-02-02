'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  UGCoursePagePropsSchema,
  PGCoursePagePropsSchema,
  type UGCoursePageProps,
  type PGCoursePageProps,
} from '@/lib/types/course-pages'

export interface UpdateCourseContentInput {
  blockId: string
  category: 'undergraduate' | 'postgraduate'
  props: UGCoursePageProps | PGCoursePageProps
  seoMetadata?: {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    ogImage?: string
  }
}

/**
 * Update course page content
 * Validates data against appropriate schema (UG or PG)
 * Updates cms_page_blocks and optionally cms_seo_metadata
 */
export async function updateCourseContent(
  input: UpdateCourseContentInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate props against appropriate schema
    let validatedProps: UGCoursePageProps | PGCoursePageProps

    if (input.category === 'undergraduate') {
      const result = UGCoursePagePropsSchema.safeParse(input.props)
      if (!result.success) {
        console.error('UG Course validation error:', result.error)
        return {
          success: false,
          error: `Validation failed: ${result.error.issues[0]?.message || 'Invalid data'}`,
        }
      }
      validatedProps = result.data
    } else {
      const result = PGCoursePagePropsSchema.safeParse(input.props)
      if (!result.success) {
        console.error('PG Course validation error:', result.error)
        return {
          success: false,
          error: `Validation failed: ${result.error.issues[0]?.message || 'Invalid data'}`,
        }
      }
      validatedProps = result.data
    }

    // Update the page block with new props
    const { error: updateError } = await supabase
      .from('cms_page_blocks')
      .update({
        props: validatedProps,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.blockId)

    if (updateError) {
      console.error('Error updating course page:', updateError)
      return { success: false, error: updateError.message }
    }

    // Get the page ID for SEO updates and revalidation
    const { data: block } = await supabase
      .from('cms_page_blocks')
      .select('page_id, cms_pages(slug)')
      .eq('id', input.blockId)
      .single()

    if (!block) {
      return { success: false, error: 'Course page not found' }
    }

    const pageId = block.page_id
    const slug = (block.cms_pages as any)?.slug

    // Update SEO metadata if provided
    if (input.seoMetadata && pageId) {
      const { error: seoError } = await supabase
        .from('cms_seo_metadata')
        .upsert({
          page_id: pageId,
          meta_title: input.seoMetadata.metaTitle,
          meta_description: input.seoMetadata.metaDescription,
          meta_keywords: input.seoMetadata.metaKeywords || [],
          og_image: input.seoMetadata.ogImage,
          updated_at: new Date().toISOString(),
        })

      if (seoError) {
        console.error('Error updating SEO metadata:', seoError)
        // Don't fail the entire operation if SEO update fails
      }
    }

    // Log activity
    await supabase.from('user_activity_logs').insert({
      user_id: user.id,
      action: 'update',
      module: 'courses',
      resource_type: 'course_page',
      resource_id: input.blockId,
      metadata: {
        category: input.category,
        slug,
      },
    })

    // Revalidate the public course page
    if (slug) {
      revalidatePath(`/${slug}`)
      revalidatePath(`/courses/${slug}`)
    }

    // Revalidate admin pages
    revalidatePath('/admin/content/courses')

    return { success: true }
  } catch (error) {
    console.error('Error in updateCourseContent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Update course page status (draft, published, archived)
 */
export async function updateCourseStatus(
  pageId: string,
  status: 'draft' | 'published' | 'archived'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('cms_pages')
      .update({
        status,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        ...(status === 'published' && { published_at: new Date().toISOString() }),
      })
      .eq('id', pageId)

    if (error) {
      console.error('Error updating course status:', error)
      return { success: false, error: error.message }
    }

    // Get slug for revalidation
    const { data: page } = await supabase
      .from('cms_pages')
      .select('slug')
      .eq('id', pageId)
      .single()

    if (page?.slug) {
      revalidatePath(`/${page.slug}`)
      revalidatePath(`/courses/${page.slug}`)
    }

    revalidatePath('/admin/content/courses')

    return { success: true }
  } catch (error) {
    console.error('Error in updateCourseStatus:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
