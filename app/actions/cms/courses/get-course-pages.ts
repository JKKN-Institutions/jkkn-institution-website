'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { CourseMetadata } from '@/lib/types/course-pages'

export interface CoursePageRecord {
  id: string
  pageId: string
  blockId: string
  courseType: string
  courseName: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  category: 'undergraduate' | 'postgraduate'
  lastUpdated: string
  contentSize: number
}

/**
 * Get all course pages from the CMS
 * Returns course metadata for the admin dashboard
 */
export async function getCoursePages(filters?: {
  category?: 'undergraduate' | 'postgraduate'
  status?: 'draft' | 'published' | 'archived'
  search?: string
}): Promise<{ success: boolean; data?: CoursePageRecord[]; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Build query to find all course pages
    // Course pages are identified by component names that end with 'CoursePage'
    let query = supabase
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
      .like('component_name', '%CoursePage')
      .order('updated_at', { ascending: false })

    const { data: blocks, error } = await query

    if (error) {
      console.error('Error fetching course pages:', error)
      return { success: false, error: error.message }
    }

    if (!blocks || blocks.length === 0) {
      return { success: true, data: [] }
    }

    // Transform data into CoursePageRecord format
    const coursePages: CoursePageRecord[] = blocks.map((block: any) => {
      const page = Array.isArray(block.cms_pages) ? block.cms_pages[0] : block.cms_pages
      const componentName = block.component_name

      // Determine course type from component name
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

      return {
        id: block.id,
        pageId: page?.id || '',
        blockId: block.id,
        courseType,
        courseName: page?.title || 'Untitled Course',
        slug: page?.slug || '',
        status: page?.status || 'draft',
        category,
        lastUpdated: block.updated_at,
        contentSize: JSON.stringify(block.props || {}).length,
      }
    })

    // Apply filters
    let filteredCourses = coursePages

    if (filters?.category) {
      filteredCourses = filteredCourses.filter(c => c.category === filters.category)
    }

    if (filters?.status) {
      filteredCourses = filteredCourses.filter(c => c.status === filters.status)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredCourses = filteredCourses.filter(c =>
        c.courseName.toLowerCase().includes(searchLower) ||
        c.courseType.toLowerCase().includes(searchLower)
      )
    }

    return { success: true, data: filteredCourses }
  } catch (error) {
    console.error('Error in getCoursePages:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get course page counts by category and status
 */
export async function getCoursePageStats(): Promise<{
  success: boolean
  data?: {
    total: number
    undergraduate: number
    postgraduate: number
    published: number
    draft: number
  }
  error?: string
}> {
  try {
    const result = await getCoursePages()

    if (!result.success || !result.data) {
      return { success: false, error: result.error }
    }

    const stats = {
      total: result.data.length,
      undergraduate: result.data.filter(c => c.category === 'undergraduate').length,
      postgraduate: result.data.filter(c => c.category === 'postgraduate').length,
      published: result.data.filter(c => c.status === 'published').length,
      draft: result.data.filter(c => c.status === 'draft').length,
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error in getCoursePageStats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
