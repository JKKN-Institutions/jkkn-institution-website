/**
 * API Route: Faculty Achievements
 *
 * GET /api/achievements/faculty
 * Returns faculty achievements with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getFacultyAchievements,
  getFeaturedFacultyAchievements,
} from '@/lib/data/achievements'
import type { AchievementFilters } from '@/types/achievements'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Check if requesting featured achievements
    const featured = searchParams.get('featured') === 'true'

    if (featured) {
      const achievements = await getFeaturedFacultyAchievements(20)
      return NextResponse.json(achievements)
    }

    // Build filters from query params
    const filters: AchievementFilters = {
      courseId: searchParams.get('courseId'),
      categoryId: searchParams.get('categoryId'),
      year: searchParams.get('year')
        ? parseInt(searchParams.get('year')!)
        : null,
      search: searchParams.get('search'),
    }

    const achievements = await getFacultyAchievements(filters)

    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error in faculty achievements API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch faculty achievements' },
      { status: 500 }
    )
  }
}
