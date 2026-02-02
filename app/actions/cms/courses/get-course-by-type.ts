'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { UGCoursePageProps, PGCoursePageProps } from '@/lib/types/course-pages'

export interface CoursePageData {
  id: string
  pageId: string
  blockId: string
  courseType: string
  courseName: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  category: 'undergraduate' | 'postgraduate'
  componentName: string
  props: UGCoursePageProps | PGCoursePageProps
  seoMetadata?: {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    ogImage?: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Get a specific course page by block ID
 */
export async function getCourseByBlockId(blockId: string): Promise<{
  success: boolean
  data?: CoursePageData
  error?: string
}> {
  try {
    console.log('=== getCourseByBlockId START ===')
    console.log('Block ID:', blockId)

    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth user:', user?.email)
    console.log('Auth error:', authError)

    const { data: block, error: blockError } = await supabase
      .from('cms_page_blocks')
      .select(`
        id,
        component_name,
        props,
        created_at,
        updated_at,
        cms_pages!inner (
          id,
          title,
          slug,
          status
        )
      `)
      .eq('id', blockId)
      .single()

    console.log('Block data:', !!block)
    console.log('Block error:', blockError)

    if (blockError) {
      console.error('Error fetching course block:', blockError)
      return {
        success: false,
        error: `Database error: ${blockError.message || JSON.stringify(blockError)}`
      }
    }

    if (!block) {
      return { success: false, error: 'Course not found' }
    }

    const page = Array.isArray(block.cms_pages) ? block.cms_pages[0] : block.cms_pages
    const componentName = block.component_name

    // Determine course type and category
    let courseType = 'unknown'
    let category: 'undergraduate' | 'postgraduate' = 'undergraduate'

    if (componentName.includes('BE')) {
      category = 'undergraduate'
      if (componentName.includes('CSE')) courseType = 'be-cse'
      else if (componentName.includes('ECE')) courseType = 'be-ece'
      else if (componentName.includes('EEE')) courseType = 'be-eee'
      else if (componentName.includes('IT')) courseType = 'be-it'
      else if (componentName.includes('Mechanical')) courseType = 'be-mechanical'
    } else if (componentName.includes('ME')) {
      category = 'postgraduate'
      if (componentName.includes('CSE')) courseType = 'me-cse'
    } else if (componentName.includes('MBA')) {
      category = 'postgraduate'
      courseType = 'mba'
    }

    // Fetch SEO metadata if exists
    const { data: seoData } = await supabase
      .from('cms_seo_metadata')
      .select('meta_title, meta_description, meta_keywords, og_image')
      .eq('page_id', page.id)
      .single()

    const courseData: CoursePageData = {
      id: block.id,
      pageId: page.id,
      blockId: block.id,
      courseType,
      courseName: page.title,
      slug: page.slug,
      status: page.status,
      category,
      componentName,
      props: block.props as UGCoursePageProps | PGCoursePageProps,
      seoMetadata: seoData ? {
        metaTitle: seoData.meta_title,
        metaDescription: seoData.meta_description,
        metaKeywords: seoData.meta_keywords || [],
        ogImage: seoData.og_image,
      } : undefined,
      createdAt: block.created_at,
      updatedAt: block.updated_at,
    }

    return { success: true, data: courseData }
  } catch (error) {
    console.error('Error in getCourseByBlockId:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get a course page by course type (e.g., 'be-cse', 'me-cse')
 */
export async function getCourseByType(courseType: string): Promise<{
  success: boolean
  data?: CoursePageData
  error?: string
}> {
  try {
    const supabase = await createServerSupabaseClient()

    // Map course type to component name pattern
    const componentNameMap: Record<string, string> = {
      'be-cse': 'BECSECoursePage',
      'be-ece': 'BEECECoursePage',
      'be-eee': 'BEEEECoursePage',
      'be-it': 'BEITCoursePage',
      'be-mechanical': 'BEMechanicalCoursePage',
      'me-cse': 'MECSECoursePage',
      'mba': 'MBACoursePage',
    }

    const componentName = componentNameMap[courseType.toLowerCase()]

    if (!componentName) {
      return { success: false, error: `Unknown course type: ${courseType}` }
    }

    const { data: blocks, error: blockError } = await supabase
      .from('cms_page_blocks')
      .select(`
        id,
        component_name,
        props,
        created_at,
        updated_at,
        cms_pages!inner (
          id,
          title,
          slug,
          status
        )
      `)
      .eq('component_name', componentName)
      .limit(1)

    if (blockError) {
      console.error('Error fetching course by type:', blockError)
      return { success: false, error: blockError.message }
    }

    if (!blocks || blocks.length === 0) {
      return { success: false, error: `Course not found: ${courseType}` }
    }

    const block = blocks[0]

    // Use getCourseByBlockId to get full data
    return await getCourseByBlockId(block.id)
  } catch (error) {
    console.error('Error in getCourseByType:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
