'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { headers } from 'next/headers'

// --- Callback Request Schema ---
const CallbackRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  courseInterest: z.string().optional(),
  preferredTime: z.string().optional(),
})

// --- Newsletter Subscribe Schema ---
const NewsletterSubscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
})

export type CallbackRequestResult = {
  success: boolean
  message: string
  referenceNumber?: string
  error?: string
}

export type NewsletterSubscribeResult = {
  success: boolean
  message: string
  error?: string
}

/**
 * Submit a callback request from a WebMCP agent.
 * Inserts into the existing admission_inquiries table with source='webmcp-callback'.
 */
export async function submitWebMCPCallbackRequest(data: {
  name: string
  phone: string
  courseInterest?: string
  preferredTime?: string
}): Promise<CallbackRequestResult> {
  try {
    const validation = CallbackRequestSchema.safeParse(data)
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid data provided.',
        error: validation.error.flatten().formErrors.join(', '),
      }
    }

    const adminClient = await createAdminSupabaseClient()
    const headersList = await headers()

    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0] || 'unknown'

    // Rate limiting - max 3 per hour per IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await adminClient
      .from('admission_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .eq('source', 'webmcp-callback')
      .gte('created_at', oneHourAgo)

    if (count && count >= 3) {
      return {
        success: false,
        message: 'Too many requests. Please try again later.',
      }
    }

    // Generate reference number
    const yearPart = new Date().getFullYear().toString()
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

    const parsed = validation.data

    const { error } = await adminClient.from('admission_inquiries').insert({
      full_name: parsed.name,
      mobile_number: parsed.phone,
      email: 'via-webmcp-agent@jkkn.ac.in',
      college_name: 'To be determined',
      course_interested: parsed.courseInterest || 'To be determined',
      current_qualification: 'To be determined',
      district_city: 'To be determined',
      consent_given: true,
      preferred_contact_time: parsed.preferredTime || null,
      ip_address: ipAddress,
      user_agent: userAgent.substring(0, 500),
      source: 'webmcp-callback',
      reference_number: referenceNumber,
      metadata: { channel: 'webmcp-agent' },
    })

    if (error) {
      console.error('Error submitting WebMCP callback request:', error)
      return {
        success: false,
        message: 'Failed to submit callback request.',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Callback request submitted. JKKN admissions will call within 24 hours.',
      referenceNumber,
    }
  } catch (error) {
    console.error('Error in submitWebMCPCallbackRequest:', error)
    return {
      success: false,
      message: 'An unexpected error occurred.',
    }
  }
}

/**
 * Subscribe an email to the JKKN newsletter from a WebMCP agent.
 */
export async function submitWebMCPNewsletterSubscription(data: {
  email: string
}): Promise<NewsletterSubscribeResult> {
  try {
    const validation = NewsletterSubscribeSchema.safeParse(data)
    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid email address.',
        error: validation.error.flatten().formErrors.join(', '),
      }
    }

    const adminClient = await createAdminSupabaseClient()
    const headersList = await headers()

    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0] || 'unknown'

    // Rate limiting - max 5 per hour per IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await adminClient
      .from('newsletter_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo)

    if (count && count >= 5) {
      return {
        success: false,
        message: 'Too many requests. Please try again later.',
      }
    }

    const parsed = validation.data

    // Upsert — if email already exists, reactivate
    const { error } = await adminClient.from('newsletter_subscriptions').upsert(
      {
        email: parsed.email,
        source: 'webmcp-agent',
        status: 'active',
        ip_address: ipAddress,
        user_agent: userAgent.substring(0, 500),
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
      },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('Error subscribing to newsletter:', error)
      return {
        success: false,
        message: 'Failed to subscribe.',
        error: error.message,
      }
    }

    return {
      success: true,
      message: `${parsed.email} subscribed to JKKN newsletter successfully.`,
    }
  } catch (error) {
    console.error('Error in submitWebMCPNewsletterSubscription:', error)
    return {
      success: false,
      message: 'An unexpected error occurred.',
    }
  }
}
