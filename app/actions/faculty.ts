'use server'

// app/actions/faculty.ts
//
// As of 2026-05-07, faculty data is managed exclusively in MyJKKN. Writes from
// this site have been removed; only reads remain. The sync engine
// (lib/sync/faculty-sync.ts) keeps the local `faculty` table mirrored from the
// API on a 15-min cron + manual trigger. The legacy admin module is now
// read-only and deep-links to MyJKKN for edits.

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createPublicSupabaseClient } from '@/lib/supabase/server'
import type { FacultyRow } from '@/lib/schemas/faculty'

// ============================================
// READ operations only
// ============================================

/** Get all faculty (admin — includes drafts + inactive). */
export async function getAllFaculty(): Promise<FacultyRow[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching faculty:', error)
    return []
  }
  return (data || []) as FacultyRow[]
}

/** Get published faculty (public pages). */
export async function getPublishedFaculty(department?: string): Promise<FacultyRow[]> {
  const supabase = createPublicSupabaseClient()
  let query = supabase
    .from('faculty')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (department) query = query.eq('department', department)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching published faculty:', error)
    return []
  }
  return (data || []) as FacultyRow[]
}

/** Get a single faculty by ID (admin). */
export async function getFacultyById(id: string): Promise<FacultyRow | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching faculty:', error)
    return null
  }
  return data as FacultyRow
}

/** Get a single faculty by slug (public). */
export async function getFacultyBySlug(slug: string): Promise<FacultyRow | null> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching faculty by slug:', error)
    return null
  }
  return data as FacultyRow
}

/** Get unique departments from published faculty. */
export async function getFacultyDepartments(): Promise<string[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase
    .from('faculty')
    .select('department')
    .eq('is_active', true)
    .eq('status', 'published')
    .order('department')

  if (error) {
    console.error('Error fetching departments:', error)
    return []
  }
  return [...new Set((data || []).map(d => d.department))]
}

/** Get related faculty (same department, excluding current). */
export async function getRelatedFaculty(department: string, excludeSlug: string, limit = 4): Promise<FacultyRow[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('department', department)
    .eq('is_active', true)
    .eq('status', 'published')
    .neq('slug', excludeSlug)
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching related faculty:', error)
    return []
  }
  return (data || []) as FacultyRow[]
}
