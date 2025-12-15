'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { checkPermission } from '@/app/actions/permissions'
import { logActivity } from '@/lib/utils/activity-logger'

// Types
export type JobStatus = 'draft' | 'published' | 'paused' | 'closed' | 'filled'
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'visiting'
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'director'
export type WorkMode = 'onsite' | 'remote' | 'hybrid'
export type ApplicationMethod = 'internal' | 'external' | 'email'

export interface CareerJob {
  id: string
  title: string
  slug: string
  description: string
  content: Record<string, unknown>
  department_id: string | null
  job_type: JobType
  experience_level: ExperienceLevel | null
  location: string
  work_mode: WorkMode
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  salary_period: string
  show_salary: boolean
  benefits: string[] | null
  qualifications: string[]
  skills_required: string[]
  skills_preferred: string[] | null
  experience_years_min: number | null
  experience_years_max: number | null
  status: JobStatus
  published_at: string | null
  deadline: string | null
  positions_available: number
  positions_filled: number
  application_method: ApplicationMethod
  external_apply_url: string | null
  apply_email: string | null
  is_featured: boolean
  is_urgent: boolean
  seo_title: string | null
  seo_description: string | null
  hiring_manager_id: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface CareerJobWithRelations extends CareerJob {
  department?: {
    id: string
    name: string
    slug: string
    color: string | null
  } | null
  hiring_manager?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
  applications_count?: number
}

// Form state type
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: CareerJob
}

// Validation schemas
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().transform((val) => {
    try {
      return JSON.parse(val)
    } catch {
      return {}
    }
  }),
  department_id: z.string().uuid().optional().nullable(),
  job_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'visiting']),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'director']).optional().nullable(),
  location: z.string().min(1, 'Location is required').max(100),
  work_mode: z.enum(['onsite', 'remote', 'hybrid']).default('onsite'),
  salary_min: z.coerce.number().min(0).optional().nullable(),
  salary_max: z.coerce.number().min(0).optional().nullable(),
  salary_currency: z.string().max(3).default('INR'),
  salary_period: z.string().max(20).default('monthly'),
  show_salary: z.coerce.boolean().default(false),
  benefits: z.string().transform((val) => val ? val.split(',').map((s) => s.trim()).filter(Boolean) : null).optional().nullable(),
  qualifications: z.string().transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean)),
  skills_required: z.string().transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean)),
  skills_preferred: z.string().transform((val) => val ? val.split(',').map((s) => s.trim()).filter(Boolean) : null).optional().nullable(),
  experience_years_min: z.coerce.number().int().min(0).optional().nullable(),
  experience_years_max: z.coerce.number().int().min(0).optional().nullable(),
  deadline: z.string().optional().nullable(),
  positions_available: z.coerce.number().int().min(1).default(1),
  application_method: z.enum(['internal', 'external', 'email']).default('internal'),
  external_apply_url: z.string().url().optional().nullable(),
  apply_email: z.string().email().optional().nullable(),
  is_featured: z.coerce.boolean().default(false),
  is_urgent: z.coerce.boolean().default(false),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(500).optional().nullable(),
  hiring_manager_id: z.string().uuid().optional().nullable(),
})

const updateJobSchema = createJobSchema.extend({
  id: z.string().uuid(),
})

// Get all jobs (admin)
export async function getCareerJobs(options?: {
  status?: JobStatus | 'all'
  department_id?: string
  job_type?: JobType
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): Promise<{ jobs: CareerJobWithRelations[]; total: number }> {
  const supabase = await createServerSupabaseClient()

  const page = options?.page || 1
  const pageSize = options?.pageSize || 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('career_jobs')
    .select(`
      *,
      department:career_departments!career_jobs_department_id_fkey(id, name, slug, color),
      hiring_manager:profiles!career_jobs_hiring_manager_id_fkey(id, full_name, email, avatar_url)
    `, { count: 'exact' })

  // Apply filters
  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  if (options?.department_id) {
    query = query.eq('department_id', options.department_id)
  }

  if (options?.job_type) {
    query = query.eq('job_type', options.job_type)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`)
  }

  // Sorting
  const sortBy = options?.sortBy || 'created_at'
  const sortOrder = options?.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching career jobs:', error)
    return { jobs: [], total: 0 }
  }

  return {
    jobs: data || [],
    total: count || 0,
  }
}

// Get published jobs (public)
export async function getPublishedCareerJobs(options?: {
  department_id?: string
  job_type?: JobType
  work_mode?: WorkMode
  search?: string
  page?: number
  pageSize?: number
}): Promise<{ jobs: CareerJobWithRelations[]; total: number }> {
  const supabase = await createServerSupabaseClient()

  const page = options?.page || 1
  const pageSize = options?.pageSize || 10
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('career_jobs')
    .select(`
      *,
      department:career_departments!career_jobs_department_id_fkey(id, name, slug, color)
    `, { count: 'exact' })
    .eq('status', 'published')
    .or('deadline.is.null,deadline.gt.' + new Date().toISOString())

  // Apply filters
  if (options?.department_id) {
    query = query.eq('department_id', options.department_id)
  }

  if (options?.job_type) {
    query = query.eq('job_type', options.job_type)
  }

  if (options?.work_mode) {
    query = query.eq('work_mode', options.work_mode)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`)
  }

  // Sort by featured, urgent, then date
  query = query
    .order('is_featured', { ascending: false })
    .order('is_urgent', { ascending: false })
    .order('published_at', { ascending: false })

  // Pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching published career jobs:', error)
    return { jobs: [], total: 0 }
  }

  return {
    jobs: data || [],
    total: count || 0,
  }
}

// Get job by ID
export async function getCareerJob(id: string): Promise<CareerJobWithRelations | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('career_jobs')
    .select(`
      *,
      department:career_departments!career_jobs_department_id_fkey(id, name, slug, color),
      hiring_manager:profiles!career_jobs_hiring_manager_id_fkey(id, full_name, email, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching career job:', error)
    return null
  }

  return data
}

// Get job by slug (public)
export async function getCareerJobBySlug(slug: string): Promise<CareerJobWithRelations | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('career_jobs')
    .select(`
      *,
      department:career_departments!career_jobs_department_id_fkey(id, name, slug, color)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching career job by slug:', error)
    return null
  }

  return data
}

// Create job
export async function createCareerJob(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:create')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    content: formData.get('content') as string || '{}',
    department_id: formData.get('department_id') as string || null,
    job_type: formData.get('job_type') as string,
    experience_level: formData.get('experience_level') as string || null,
    location: formData.get('location') as string,
    work_mode: formData.get('work_mode') as string || 'onsite',
    salary_min: formData.get('salary_min') as string || null,
    salary_max: formData.get('salary_max') as string || null,
    salary_currency: formData.get('salary_currency') as string || 'INR',
    salary_period: formData.get('salary_period') as string || 'monthly',
    show_salary: formData.get('show_salary') === 'true',
    benefits: formData.get('benefits') as string || null,
    qualifications: formData.get('qualifications') as string,
    skills_required: formData.get('skills_required') as string,
    skills_preferred: formData.get('skills_preferred') as string || null,
    experience_years_min: formData.get('experience_years_min') as string || null,
    experience_years_max: formData.get('experience_years_max') as string || null,
    deadline: formData.get('deadline') as string || null,
    positions_available: formData.get('positions_available') as string || '1',
    application_method: formData.get('application_method') as string || 'internal',
    external_apply_url: formData.get('external_apply_url') as string || null,
    apply_email: formData.get('apply_email') as string || null,
    is_featured: formData.get('is_featured') === 'true',
    is_urgent: formData.get('is_urgent') === 'true',
    seo_title: formData.get('seo_title') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    hiring_manager_id: formData.get('hiring_manager_id') as string || null,
  }

  // Validate
  const result = createJobSchema.safeParse(rawData)
  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const data = result.data

  // Check slug uniqueness
  const { data: existingSlug } = await supabase
    .from('career_jobs')
    .select('id')
    .eq('slug', data.slug)
    .single()

  if (existingSlug) {
    return {
      success: false,
      message: 'A job with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Create job
  const { data: job, error } = await supabase
    .from('career_jobs')
    .insert({
      ...data,
      status: 'draft',
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating career job:', error)
    return {
      success: false,
      message: 'Failed to create job posting',
    }
  }

  // Update department job count
  if (data.department_id) {
    await supabase.rpc('increment_department_jobs', { dept_id: data.department_id })
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'careers',
    resourceType: 'job',
    resourceId: job.id,
    metadata: { title: data.title },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: 'Job posting created successfully',
    data: job,
  }
}

// Update job
export async function updateCareerJob(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:edit')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const rawData = {
    id: formData.get('id') as string,
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    content: formData.get('content') as string || '{}',
    department_id: formData.get('department_id') as string || null,
    job_type: formData.get('job_type') as string,
    experience_level: formData.get('experience_level') as string || null,
    location: formData.get('location') as string,
    work_mode: formData.get('work_mode') as string || 'onsite',
    salary_min: formData.get('salary_min') as string || null,
    salary_max: formData.get('salary_max') as string || null,
    salary_currency: formData.get('salary_currency') as string || 'INR',
    salary_period: formData.get('salary_period') as string || 'monthly',
    show_salary: formData.get('show_salary') === 'true',
    benefits: formData.get('benefits') as string || null,
    qualifications: formData.get('qualifications') as string,
    skills_required: formData.get('skills_required') as string,
    skills_preferred: formData.get('skills_preferred') as string || null,
    experience_years_min: formData.get('experience_years_min') as string || null,
    experience_years_max: formData.get('experience_years_max') as string || null,
    deadline: formData.get('deadline') as string || null,
    positions_available: formData.get('positions_available') as string || '1',
    application_method: formData.get('application_method') as string || 'internal',
    external_apply_url: formData.get('external_apply_url') as string || null,
    apply_email: formData.get('apply_email') as string || null,
    is_featured: formData.get('is_featured') === 'true',
    is_urgent: formData.get('is_urgent') === 'true',
    seo_title: formData.get('seo_title') as string || null,
    seo_description: formData.get('seo_description') as string || null,
    hiring_manager_id: formData.get('hiring_manager_id') as string || null,
  }

  // Validate
  const result = updateJobSchema.safeParse(rawData)
  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const data = result.data

  // Get existing job for department count updates
  const { data: existingJob } = await supabase
    .from('career_jobs')
    .select('department_id')
    .eq('id', data.id)
    .single()

  // Check slug uniqueness (excluding current)
  const { data: existingSlug } = await supabase
    .from('career_jobs')
    .select('id')
    .eq('slug', data.slug)
    .neq('id', data.id)
    .single()

  if (existingSlug) {
    return {
      success: false,
      message: 'A job with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Update job
  const { data: job, error } = await supabase
    .from('career_jobs')
    .update({
      ...data,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating career job:', error)
    return {
      success: false,
      message: 'Failed to update job posting',
    }
  }

  // Update department job counts if department changed
  if (existingJob && existingJob.department_id !== data.department_id) {
    if (existingJob.department_id) {
      await supabase.rpc('decrement_department_jobs', { dept_id: existingJob.department_id })
    }
    if (data.department_id) {
      await supabase.rpc('increment_department_jobs', { dept_id: data.department_id })
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'careers',
    resourceType: 'job',
    resourceId: job.id,
    metadata: { title: data.title },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath(`/admin/content/careers/${job.id}`)
  revalidatePath('/careers')
  revalidatePath(`/careers/${job.slug}`)

  return {
    success: true,
    message: 'Job posting updated successfully',
    data: job,
  }
}

// Delete job
export async function deleteCareerJob(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:delete')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get job for logging and department update
  const { data: job } = await supabase
    .from('career_jobs')
    .select('title, department_id')
    .eq('id', id)
    .single()

  if (!job) {
    return { success: false, message: 'Job posting not found' }
  }

  // Delete job
  const { error } = await supabase
    .from('career_jobs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting career job:', error)
    return {
      success: false,
      message: 'Failed to delete job posting',
    }
  }

  // Update department job count
  if (job.department_id) {
    await supabase.rpc('decrement_department_jobs', { dept_id: job.department_id })
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'careers',
    resourceType: 'job',
    resourceId: id,
    metadata: { title: job.title },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: 'Job posting deleted successfully',
  }
}

// Publish job
export async function publishCareerJob(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:publish')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const { data: job, error } = await supabase
    .from('career_jobs')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('title')
    .single()

  if (error) {
    console.error('Error publishing career job:', error)
    return {
      success: false,
      message: 'Failed to publish job posting',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'publish',
    module: 'careers',
    resourceType: 'job',
    resourceId: id,
    metadata: { title: job.title },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: 'Job posting published successfully',
  }
}

// Pause job
export async function pauseCareerJob(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:publish')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const { data: job, error } = await supabase
    .from('career_jobs')
    .update({
      status: 'paused',
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('title')
    .single()

  if (error) {
    console.error('Error pausing career job:', error)
    return {
      success: false,
      message: 'Failed to pause job posting',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'pause',
    module: 'careers',
    resourceType: 'job',
    resourceId: id,
    metadata: { title: job.title },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: 'Job posting paused',
  }
}

// Close job
export async function closeCareerJob(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:publish')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const { data: job, error } = await supabase
    .from('career_jobs')
    .update({
      status: 'closed',
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('title')
    .single()

  if (error) {
    console.error('Error closing career job:', error)
    return {
      success: false,
      message: 'Failed to close job posting',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'close',
    module: 'careers',
    resourceType: 'job',
    resourceId: id,
    metadata: { title: job.title },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: 'Job posting closed',
  }
}

// Mark job as filled
export async function markCareerJobFilled(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:publish')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const { data: job, error } = await supabase
    .from('career_jobs')
    .update({
      status: 'filled',
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('title')
    .single()

  if (error) {
    console.error('Error marking career job as filled:', error)
    return {
      success: false,
      message: 'Failed to update job posting',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'fill',
    module: 'careers',
    resourceType: 'job',
    resourceId: id,
    metadata: { title: job.title },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: 'Job posting marked as filled',
  }
}

// Toggle featured status
export async function toggleCareerJobFeatured(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:edit')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get current status
  const { data: current } = await supabase
    .from('career_jobs')
    .select('is_featured, title')
    .eq('id', id)
    .single()

  if (!current) {
    return { success: false, message: 'Job posting not found' }
  }

  // Toggle
  const { error } = await supabase
    .from('career_jobs')
    .update({
      is_featured: !current.is_featured,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error toggling career job featured:', error)
    return {
      success: false,
      message: 'Failed to update job posting',
    }
  }

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: current.is_featured ? 'Removed from featured' : 'Marked as featured',
  }
}

// Toggle urgent status
export async function toggleCareerJobUrgent(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:edit')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get current status
  const { data: current } = await supabase
    .from('career_jobs')
    .select('is_urgent, title')
    .eq('id', id)
    .single()

  if (!current) {
    return { success: false, message: 'Job posting not found' }
  }

  // Toggle
  const { error } = await supabase
    .from('career_jobs')
    .update({
      is_urgent: !current.is_urgent,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error toggling career job urgent:', error)
    return {
      success: false,
      message: 'Failed to update job posting',
    }
  }

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: current.is_urgent ? 'Removed urgent flag' : 'Marked as urgent',
  }
}

// Bulk delete jobs
export async function bulkDeleteCareerJobs(ids: string[]): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:delete')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  if (ids.length === 0) {
    return { success: false, message: 'No jobs selected' }
  }

  // Get jobs for department count updates
  const { data: jobs } = await supabase
    .from('career_jobs')
    .select('department_id')
    .in('id', ids)

  // Delete jobs
  const { error } = await supabase
    .from('career_jobs')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Error bulk deleting career jobs:', error)
    return {
      success: false,
      message: 'Failed to delete job postings',
    }
  }

  // Update department job counts
  if (jobs) {
    const deptCounts = jobs.reduce((acc, job) => {
      if (job.department_id) {
        acc[job.department_id] = (acc[job.department_id] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    for (const [deptId, count] of Object.entries(deptCounts)) {
      for (let i = 0; i < count; i++) {
        await supabase.rpc('decrement_department_jobs', { dept_id: deptId })
      }
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_delete',
    module: 'careers',
    resourceType: 'job',
    resourceId: ids.join(','),
    metadata: { count: ids.length },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: `${ids.length} job posting(s) deleted`,
  }
}

// Bulk update job status
export async function bulkUpdateCareerJobStatus(
  ids: string[],
  status: JobStatus
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:publish')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  if (ids.length === 0) {
    return { success: false, message: 'No jobs selected' }
  }

  const updateData: Record<string, unknown> = {
    status,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }

  if (status === 'published') {
    updateData.published_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('career_jobs')
    .update(updateData)
    .in('id', ids)

  if (error) {
    console.error('Error bulk updating career job status:', error)
    return {
      success: false,
      message: 'Failed to update job postings',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_status_update',
    module: 'careers',
    resourceType: 'job',
    resourceId: ids.join(','),
    metadata: { count: ids.length, newStatus: status },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/careers')

  return {
    success: true,
    message: `${ids.length} job posting(s) updated`,
  }
}
