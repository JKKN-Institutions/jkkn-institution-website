'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { checkPermission } from '@/app/actions/permissions'
import { logActivity } from '@/lib/utils/activity-logger'

// Types
export type ApplicationStatus =
  | 'new'
  | 'reviewing'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn'

export interface CareerApplication {
  id: string
  job_id: string
  applicant_name: string
  applicant_email: string
  applicant_phone: string | null
  applicant_user_id: string | null
  cover_letter: string | null
  resume_url: string | null
  portfolio_url: string | null
  linkedin_url: string | null
  answers: Record<string, unknown>
  status: ApplicationStatus
  status_changed_at: string
  status_changed_by: string | null
  rating: number | null
  internal_notes: string | null
  last_contact_at: string | null
  interview_date: string | null
  created_at: string
  updated_at: string
}

export interface CareerApplicationWithRelations extends CareerApplication {
  job?: {
    id: string
    title: string
    slug: string
    department?: {
      id: string
      name: string
    } | null
  }
  status_changer?: {
    id: string
    full_name: string | null
    email: string
  } | null
}

export interface ApplicationHistory {
  id: string
  application_id: string
  previous_status: string | null
  new_status: string
  notes: string | null
  changed_by: string | null
  created_at: string
  changer?: {
    id: string
    full_name: string | null
    email: string
  } | null
}

// Form state type
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: CareerApplication
}

// Validation schemas
const submitApplicationSchema = z.object({
  job_id: z.string().uuid('Invalid job ID'),
  applicant_name: z.string().min(1, 'Name is required').max(200),
  applicant_email: z.string().email('Invalid email address'),
  applicant_phone: z.string().max(20).optional().nullable(),
  cover_letter: z.string().max(5000).optional().nullable(),
  resume_url: z.string().url().optional().nullable(),
  portfolio_url: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  answers: z.string().transform((val) => {
    try {
      return JSON.parse(val)
    } catch {
      return {}
    }
  }).optional(),
})

const updateApplicationSchema = z.object({
  status: z.enum(['new', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected', 'withdrawn']),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  internal_notes: z.string().max(5000).optional().nullable(),
  interview_date: z.string().optional().nullable(),
  status_note: z.string().max(500).optional(),
})

// Get all applications (admin)
export async function getApplications(options?: {
  status?: ApplicationStatus | 'all'
  job_id?: string
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): Promise<{ applications: CareerApplicationWithRelations[]; total: number }> {
  const supabase = await createServerSupabaseClient()

  // Check permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { applications: [], total: 0 }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:applications')
  if (!hasPermission) {
    return { applications: [], total: 0 }
  }

  const page = options?.page || 1
  const pageSize = options?.pageSize || 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('career_applications')
    .select(`
      *,
      job:career_jobs!career_applications_job_id_fkey(
        id, title, slug,
        department:career_departments(id, name)
      ),
      status_changer:profiles!career_applications_status_changed_by_fkey(id, full_name, email)
    `, { count: 'exact' })

  // Apply filters
  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  if (options?.job_id) {
    query = query.eq('job_id', options.job_id)
  }

  if (options?.search) {
    query = query.or(`applicant_name.ilike.%${options.search}%,applicant_email.ilike.%${options.search}%`)
  }

  // Sorting
  const sortBy = options?.sortBy || 'created_at'
  const sortOrder = options?.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching applications:', error)
    return { applications: [], total: 0 }
  }

  return {
    applications: data || [],
    total: count || 0,
  }
}

// Get applications for a specific job
export async function getJobApplications(
  jobId: string,
  options?: {
    status?: ApplicationStatus | 'all'
  }
): Promise<CareerApplicationWithRelations[]> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('career_applications')
    .select(`
      *,
      status_changer:profiles!career_applications_status_changed_by_fkey(id, full_name, email)
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching job applications:', error)
    return []
  }

  return data || []
}

// Get application by ID
export async function getApplication(id: string): Promise<CareerApplicationWithRelations | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('career_applications')
    .select(`
      *,
      job:career_jobs!career_applications_job_id_fkey(
        id, title, slug,
        department:career_departments(id, name)
      ),
      status_changer:profiles!career_applications_status_changed_by_fkey(id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching application:', error)
    return null
  }

  return data
}

// Get application history
export async function getApplicationHistory(applicationId: string): Promise<ApplicationHistory[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('career_application_history')
    .select(`
      *,
      changer:profiles!career_application_history_changed_by_fkey(id, full_name, email)
    `)
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching application history:', error)
    return []
  }

  return data || []
}

// Get application statistics
export async function getApplicationStats(jobId?: string): Promise<Record<ApplicationStatus, number>> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('career_applications')
    .select('status')

  if (jobId) {
    query = query.eq('job_id', jobId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching application stats:', error)
    return {
      new: 0,
      reviewing: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
      withdrawn: 0,
    }
  }

  const stats: Record<ApplicationStatus, number> = {
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
  }

  data?.forEach((app) => {
    if (app.status in stats) {
      stats[app.status as ApplicationStatus]++
    }
  })

  return stats
}

// Submit application (public)
export async function submitApplication(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const rawData = {
    job_id: formData.get('job_id') as string,
    applicant_name: formData.get('applicant_name') as string,
    applicant_email: formData.get('applicant_email') as string,
    applicant_phone: formData.get('applicant_phone') as string || null,
    cover_letter: formData.get('cover_letter') as string || null,
    resume_url: formData.get('resume_url') as string || null,
    portfolio_url: formData.get('portfolio_url') as string || null,
    linkedin_url: formData.get('linkedin_url') as string || null,
    answers: formData.get('answers') as string || '{}',
  }

  // Validate
  const result = submitApplicationSchema.safeParse(rawData)
  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const data = result.data

  // Verify job exists and is accepting applications
  const { data: job, error: jobError } = await supabase
    .from('career_jobs')
    .select('id, title, status, deadline, application_method, positions_available, positions_filled')
    .eq('id', data.job_id)
    .eq('status', 'published')
    .single()

  if (jobError || !job) {
    return {
      success: false,
      message: 'Job posting not found or not accepting applications',
    }
  }

  if (job.application_method !== 'internal') {
    return {
      success: false,
      message: 'This job does not accept online applications',
    }
  }

  if (job.deadline && new Date(job.deadline) < new Date()) {
    return {
      success: false,
      message: 'Application deadline has passed',
    }
  }

  if (job.positions_filled >= job.positions_available) {
    return {
      success: false,
      message: 'All positions have been filled',
    }
  }

  // Check for duplicate application
  const { data: existingApp } = await supabase
    .from('career_applications')
    .select('id')
    .eq('job_id', data.job_id)
    .eq('applicant_email', data.applicant_email)
    .single()

  if (existingApp) {
    return {
      success: false,
      message: 'You have already applied for this position',
    }
  }

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Create application
  const { data: application, error } = await supabase
    .from('career_applications')
    .insert({
      job_id: data.job_id,
      applicant_name: data.applicant_name,
      applicant_email: data.applicant_email,
      applicant_phone: data.applicant_phone,
      applicant_user_id: user?.id || null,
      cover_letter: data.cover_letter,
      resume_url: data.resume_url,
      portfolio_url: data.portfolio_url,
      linkedin_url: data.linkedin_url,
      answers: data.answers,
      status: 'new',
      status_changed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating application:', error)
    return {
      success: false,
      message: 'Failed to submit application',
    }
  }

  // Create initial history entry
  await supabase
    .from('career_application_history')
    .insert({
      application_id: application.id,
      previous_status: null,
      new_status: 'new',
      notes: 'Application submitted',
    })

  // TODO: Queue email notification

  revalidatePath('/admin/content/careers/applications')

  return {
    success: true,
    message: 'Application submitted successfully',
    data: application,
  }
}

// Update application status (admin)
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  options?: {
    notes?: string
    rating?: number
    internal_notes?: string
    interview_date?: string
  }
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:applications')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get current application
  const { data: current } = await supabase
    .from('career_applications')
    .select('status, job:career_jobs(title)')
    .eq('id', applicationId)
    .single()

  if (!current) {
    return { success: false, message: 'Application not found' }
  }

  // Update application
  const updateData: Record<string, unknown> = {
    status,
    status_changed_at: new Date().toISOString(),
    status_changed_by: user.id,
    updated_at: new Date().toISOString(),
  }

  if (options?.rating !== undefined) {
    updateData.rating = options.rating
  }

  if (options?.internal_notes !== undefined) {
    updateData.internal_notes = options.internal_notes
  }

  if (options?.interview_date !== undefined) {
    updateData.interview_date = options.interview_date
  }

  if (status === 'interview' || status === 'shortlisted' || status === 'offered') {
    updateData.last_contact_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('career_applications')
    .update(updateData)
    .eq('id', applicationId)

  if (error) {
    console.error('Error updating application:', error)
    return {
      success: false,
      message: 'Failed to update application',
    }
  }

  // Add history entry
  await supabase
    .from('career_application_history')
    .insert({
      application_id: applicationId,
      previous_status: current.status,
      new_status: status,
      notes: options?.notes,
      changed_by: user.id,
    })

  // If hired, increment positions_filled
  if (status === 'hired' && current.status !== 'hired') {
    await supabase.rpc('increment_positions_filled', { application_id: applicationId })
  }

  // If un-hired (moved from hired to something else), decrement positions_filled
  if (current.status === 'hired' && status !== 'hired') {
    await supabase.rpc('decrement_positions_filled', { application_id: applicationId })
  }

  // TODO: Queue email notification based on status change

  // Log activity
  const jobData = current.job as unknown as { title: string } | null
  await logActivity({
    userId: user.id,
    action: 'update_status',
    module: 'careers',
    resourceType: 'application',
    resourceId: applicationId,
    metadata: {
      previousStatus: current.status,
      newStatus: status,
      jobTitle: jobData?.title,
    },
  })

  revalidatePath('/admin/content/careers/applications')

  const statusLabels: Record<ApplicationStatus, string> = {
    new: 'New',
    reviewing: 'Under Review',
    shortlisted: 'Shortlisted',
    interview: 'Interview Scheduled',
    offered: 'Offered',
    hired: 'Hired',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  }

  return {
    success: true,
    message: `Application marked as ${statusLabels[status]}`,
  }
}

// Bulk update application status
export async function bulkUpdateApplicationStatus(
  applicationIds: string[],
  status: ApplicationStatus,
  notes?: string
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:applications')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  if (applicationIds.length === 0) {
    return { success: false, message: 'No applications selected' }
  }

  // Get current statuses for history
  const { data: currentApps } = await supabase
    .from('career_applications')
    .select('id, status')
    .in('id', applicationIds)

  // Update applications
  const { error } = await supabase
    .from('career_applications')
    .update({
      status,
      status_changed_at: new Date().toISOString(),
      status_changed_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .in('id', applicationIds)

  if (error) {
    console.error('Error bulk updating applications:', error)
    return {
      success: false,
      message: 'Failed to update applications',
    }
  }

  // Add history entries
  if (currentApps) {
    const historyEntries = currentApps.map((app) => ({
      application_id: app.id,
      previous_status: app.status,
      new_status: status,
      notes,
      changed_by: user.id,
    }))

    await supabase
      .from('career_application_history')
      .insert(historyEntries)
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_update_status',
    module: 'careers',
    resourceType: 'application',
    resourceId: applicationIds.join(','),
    metadata: { count: applicationIds.length, newStatus: status },
  })

  revalidatePath('/admin/content/careers/applications')

  return {
    success: true,
    message: `${applicationIds.length} applications updated`,
  }
}

// Update application rating
export async function updateApplicationRating(
  applicationId: string,
  rating: number
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:applications')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  if (rating < 1 || rating > 5) {
    return { success: false, message: 'Rating must be between 1 and 5' }
  }

  const { error } = await supabase
    .from('career_applications')
    .update({
      rating,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  if (error) {
    console.error('Error updating application rating:', error)
    return {
      success: false,
      message: 'Failed to update rating',
    }
  }

  revalidatePath('/admin/content/careers/applications')

  return {
    success: true,
    message: 'Rating updated',
  }
}

// Update application notes
export async function updateApplicationNotes(
  applicationId: string,
  notes: string
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:applications')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const { error } = await supabase
    .from('career_applications')
    .update({
      internal_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  if (error) {
    console.error('Error updating application notes:', error)
    return {
      success: false,
      message: 'Failed to update notes',
    }
  }

  revalidatePath('/admin/content/careers/applications')

  return {
    success: true,
    message: 'Notes updated',
  }
}

// Delete application
export async function deleteApplication(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:applications')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get application for logging
  const { data: application } = await supabase
    .from('career_applications')
    .select('applicant_name, job:career_jobs(title)')
    .eq('id', id)
    .single()

  if (!application) {
    return { success: false, message: 'Application not found' }
  }

  const { error } = await supabase
    .from('career_applications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting application:', error)
    return {
      success: false,
      message: 'Failed to delete application',
    }
  }

  // Log activity
  const appJobData = application.job as unknown as { title: string } | null
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'careers',
    resourceType: 'application',
    resourceId: id,
    metadata: {
      applicantName: application.applicant_name,
      jobTitle: appJobData?.title,
    },
  })

  revalidatePath('/admin/content/careers/applications')

  return {
    success: true,
    message: 'Application deleted',
  }
}

// Bulk delete applications
export async function bulkDeleteApplications(ids: string[]): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:applications')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  if (ids.length === 0) {
    return { success: false, message: 'No applications selected' }
  }

  const { error } = await supabase
    .from('career_applications')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Error bulk deleting applications:', error)
    return {
      success: false,
      message: 'Failed to delete applications',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_delete',
    module: 'careers',
    resourceType: 'application',
    resourceId: ids.join(','),
    metadata: { count: ids.length },
  })

  revalidatePath('/admin/content/careers/applications')

  return {
    success: true,
    message: `${ids.length} applications deleted`,
  }
}
