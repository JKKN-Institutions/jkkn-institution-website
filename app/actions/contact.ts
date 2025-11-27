'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { headers } from 'next/headers'

// Validation schema for contact form
const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),
      'Please enter a valid phone number'
    ),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

export type ContactFormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Submit a contact form
 */
export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const headersList = await headers()

    // Parse form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    // Validate input
    const validation = ContactFormSchema.safeParse(rawData)
    if (!validation.success) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const data = validation.data

    // Get client info for spam detection
    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0] || 'unknown'

    // Rate limiting check - max 5 submissions per hour per IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo)

    if (count && count >= 5) {
      return {
        success: false,
        message: 'Too many submissions. Please try again later.',
      }
    }

    // Insert contact submission
    const { error } = await supabase.from('contact_submissions').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      source: 'contact_form',
      ip_address: ipAddress,
      user_agent: userAgent.substring(0, 500), // Limit length
    })

    if (error) {
      console.error('Error submitting contact form:', error)
      return {
        success: false,
        message: 'Failed to submit your message. Please try again.',
      }
    }

    // TODO: Send email notification to admin (implement when SMTP is configured)
    // await sendAdminNotification(data)

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    }
  } catch (error) {
    console.error('Error in submitContactForm:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Get all contact submissions (admin only)
 */
export async function getContactSubmissions(options?: {
  status?: string
  limit?: number
  offset?: number
}) {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching contact submissions:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data, count }
  } catch (error) {
    console.error('Error in getContactSubmissions:', error)
    return { success: false, error: 'Failed to fetch contact submissions' }
  }
}

/**
 * Update contact submission status (admin only)
 */
export async function updateContactSubmissionStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived'
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const updateData: Record<string, unknown> = { status }

    if (status === 'replied') {
      updateData.replied_at = new Date().toISOString()
      updateData.replied_by = user.id
    }

    const { error } = await supabase
      .from('contact_submissions')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating contact submission:', error)
      return { success: false, error: error.message }
    }

    return { success: true, message: 'Status updated successfully' }
  } catch (error) {
    console.error('Error in updateContactSubmissionStatus:', error)
    return { success: false, error: 'Failed to update status' }
  }
}
