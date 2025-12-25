'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
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
 * Submit an admission inquiry form
 */
export async function submitAdmissionInquiry(
  prevState: AdmissionInquiryFormState | null,
  formData: FormData
): Promise<AdmissionInquiryFormState> {
  try {
    const supabase = await createServerSupabaseClient()
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
    const { count } = await supabase
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

    // Insert admission inquiry
    const { data: result, error } = await supabase
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
      })
      .select('reference_number')
      .single()

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
      referenceNumber: result.reference_number,
    }
  } catch (error) {
    console.error('Error in submitAdmissionInquiry:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
