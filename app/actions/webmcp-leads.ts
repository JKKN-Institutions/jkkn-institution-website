'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { headers } from 'next/headers'

// The callback-request action that lived here (submitWebMCPCallbackRequest) was removed 2026-11-02:
// it inserted admission leads into admission_inquiries, a table the jkkn.ai CRM never reads.
// Admission leads go only to the CRM (lib/enquiry/crm-submit.ts). This file now holds the newsletter only.

// --- Newsletter Subscribe Schema ---
const NewsletterSubscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
})

export type NewsletterSubscribeResult = {
  success: boolean
  message: string
  error?: string
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
