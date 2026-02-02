'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { BEMechanicalCoursePagePropsSchema, type BEMechanicalCoursePageProps } from '@/components/cms-blocks/content/be-mechanical-course-page'

export async function updateCoursePageContent(
  blockId: string,
  props: BEMechanicalCoursePageProps
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate props against schema
    const validatedProps = BEMechanicalCoursePagePropsSchema.parse(props)

    const supabase = await createServerSupabaseClient()

    // Update the page block with new props
    const { error } = await supabase
      .from('cms_page_blocks')
      .update({
        props: validatedProps,
        updated_at: new Date().toISOString(),
      })
      .eq('id', blockId)

    if (error) {
      console.error('Error updating course page:', error)
      return { success: false, error: error.message }
    }

    // Get the page slug for revalidation
    const { data: block } = await supabase
      .from('cms_page_blocks')
      .select('page_id, cms_pages!inner(slug)')
      .eq('id', blockId)
      .single()

    // Type assertion for the joined cms_pages data
    const pageData = block?.cms_pages as { slug: string } | undefined
    if (pageData?.slug) {
      // Revalidate the public page
      revalidatePath(`/${pageData.slug}`)
    }

    // Revalidate admin pages list
    revalidatePath('/admin/content/pages')

    return { success: true }
  } catch (error) {
    console.error('Error in updateCoursePageContent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function getCoursePageBlock(blockId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_blocks')
    .select('*, cms_pages(id, title, slug, status)')
    .eq('id', blockId)
    .single()

  if (error) {
    console.error('Error fetching course page block:', error)
    return null
  }

  return data
}

export async function getCoursePageBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select(`
      *,
      cms_page_blocks(*)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching course page:', error)
    return null
  }

  return data
}
