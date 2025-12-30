'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Validation schema for admission inquiry form
const AdmissionInquirySchema = z.object({
  fullName: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Please enter a valid email address'),
  collegeName: z.string().min(1, 'Please select a college'),
  courseInterested: z.string().min(1, 'Please select a course'),
  currentQualification: z.string().min(1, 'Please select your qualification'),
  districtCity: z
    .string()
    .min(2, 'District/City must be at least 2 characters')
    .max(100, 'District/City must be less than 100 characters'),
  preferredContactTime: z.string().optional(),
  consentGiven: z.literal(true, 'You must agree to receive communications'),
})

export type AdmissionInquiryFormData = z.infer<typeof AdmissionInquirySchema>

export type AdmissionInquiryFormState = {
  success?: boolean
  message?: string
  referenceNumber?: string
  errors?: Record<string, string[]>
}

/**
 * Update admission inquiry status (admin only)
 */
export async function updateAdmissionInquiryStatus(
  id: string,
  status: 'new' | 'contacted' | 'follow_up' | 'converted' | 'closed'
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('admission_inquiries')
      .update({
        status,
        status_changed_at: new Date().toISOString(),
        status_changed_by: user.id,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating admission inquiry:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/inquiries')
    return { success: true, message: 'Status updated successfully' }
  } catch (error) {
    console.error('Error in updateAdmissionInquiryStatus:', error)
    return { success: false, error: 'Failed to update status' }
  }
}

/**
 * Reply to an admission inquiry (admin only)
 */
export async function replyToAdmissionInquiry(inquiryId: string, replyMessage: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validation
    if (!replyMessage || replyMessage.trim().length < 10) {
      return { success: false, error: 'Reply message must be at least 10 characters' }
    }

    // Update inquiry with reply
    const { error } = await supabase
      .from('admission_inquiries')
      .update({
        reply_message: replyMessage.trim(),
        status: 'contacted',
        replied_at: new Date().toISOString(),
        replied_by: user.id,
        status_changed_at: new Date().toISOString(),
        status_changed_by: user.id,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', inquiryId)

    if (error) {
      console.error('Error replying to admission inquiry:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/inquiries')
    return { success: true, message: 'Reply saved successfully' }
  } catch (error) {
    console.error('Error in replyToAdmissionInquiry:', error)
    return { success: false, error: 'Failed to save reply' }
  }
}

/**
 * Submit an admission inquiry form
 */
export async function submitAdmissionInquiry(
  prevState: AdmissionInquiryFormState | null,
  formData: FormData
): Promise<AdmissionInquiryFormState> {
  try {
    // Use admin client to bypass RLS for public form submissions
    const adminClient = await createAdminSupabaseClient()
    const headersList = await headers()

    // Parse form data
    const rawData = {
      fullName: formData.get('fullName') as string,
      mobileNumber: formData.get('mobileNumber') as string,
      email: formData.get('email') as string,
      collegeName: formData.get('collegeName') as string,
      courseInterested: formData.get('courseInterested') as string,
      currentQualification: formData.get('currentQualification') as string,
      districtCity: formData.get('districtCity') as string,
      preferredContactTime: (formData.get('preferredContactTime') as string) || undefined,
      consentGiven:
        formData.get('consentGiven') === 'on' || formData.get('consentGiven') === 'true',
    }

    // Validate input
    const validation = AdmissionInquirySchema.safeParse(rawData)
    if (!validation.success) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const data = validation.data

    // Get client info for tracking
    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0] || 'unknown'
    const referrer = headersList.get('referer') || ''

    // Rate limiting - max 3 submissions per hour per IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await adminClient
      .from('admission_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo)

    if (count && count >= 3) {
      return {
        success: false,
        message: 'Too many submissions. Please try again later.',
      }
    }

    // Generate reference number before inserting
    const yearPart = new Date().getFullYear().toString()

    // Get next sequence number for this year
    const { data: seqData } = await adminClient
      .from('admission_inquiries')
      .select('reference_number')
      .like('reference_number', `JKKN-ADM-${yearPart}-%`)
      .order('reference_number', { ascending: false })
      .limit(1)
      .single()

    let sequenceNum = 1
    if (seqData?.reference_number) {
      const match = seqData.reference_number.match(/JKKN-ADM-\d{4}-(\d+)/)
      if (match) {
        sequenceNum = parseInt(match[1], 10) + 1
      }
    }

    const referenceNumber = `JKKN-ADM-${yearPart}-${sequenceNum.toString().padStart(5, '0')}`

    // Insert admission inquiry with generated reference number
    const { error } = await adminClient
      .from('admission_inquiries')
      .insert({
        full_name: data.fullName,
        mobile_number: data.mobileNumber,
        email: data.email,
        college_name: data.collegeName,
        course_interested: data.courseInterested,
        current_qualification: data.currentQualification,
        district_city: data.districtCity,
        preferred_contact_time: data.preferredContactTime || null,
        consent_given: data.consentGiven,
        ip_address: ipAddress,
        user_agent: userAgent.substring(0, 500),
        source: 'admission_inquiry_form',
        referrer: referrer.substring(0, 500),
        reference_number: referenceNumber,
      })

    if (error) {
      console.error('Error submitting admission inquiry:', error)
      return {
        success: false,
        message: 'Failed to submit your inquiry. Please try again.',
      }
    }

    // Revalidate admin pages
    revalidatePath('/admin/inquiries')

    return {
      success: true,
      message: 'Your inquiry has been submitted successfully!',
      referenceNumber,
    }
  } catch (error) {
    console.error('Error in submitAdmissionInquiry:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
