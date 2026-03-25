'use server'

import { z } from 'zod'
import { createPublicSupabaseClient } from '@/lib/supabase/server'

const cityEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  city: z.string().min(1, 'City is required'),
  programme: z.string().min(1, 'Programme selection is required'),
  question: z.string().optional(),
})

export type CityEnquiryState = {
  success: boolean
  message?: string
  error?: string
  fieldErrors?: Partial<Record<keyof z.infer<typeof cityEnquirySchema>, string>>
}

export async function submitCityEnquiry(
  prevState: unknown,
  formData: FormData
): Promise<CityEnquiryState> {
  // Parse and validate form data
  const raw = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    programme: formData.get('programme'),
    question: formData.get('question') ?? undefined,
  }

  const parsed = cityEnquirySchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: CityEnquiryState['fieldErrors'] = {}
    for (const [field, messages] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      const key = field as keyof typeof fieldErrors
      if (messages && messages.length > 0) {
        fieldErrors[key] = messages[0]
      }
    }
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors,
    }
  }

  const { name, phone, city, programme, question } = parsed.data

  try {
    const supabase = createPublicSupabaseClient()

    const { error } = await supabase.from('admission_inquiries').insert({
      full_name: name,
      phone: phone,
      source: 'city-landing',
      metadata: {
        city,
        programme,
        ...(question ? { question } : {}),
      },
    })

    if (error) {
      // Graceful handling when table doesn't exist or RLS blocks insert
      console.error('[city-enquiry] Supabase insert error:', error.message, error.code)

      // Code 42P01 = table does not exist
      if (error.code === '42P01') {
        return {
          success: false,
          error:
            'Our enquiry system is being set up. Please contact us via WhatsApp or call us directly.',
        }
      }

      return {
        success: false,
        error: 'Something went wrong. Please try again or contact us via WhatsApp.',
      }
    }

    return {
      success: true,
      message:
        'Thank you! Your enquiry has been submitted successfully. Our admissions team will contact you within 24 hours.',
    }
  } catch (err) {
    console.error('[city-enquiry] Unexpected error:', err)
    return {
      success: false,
      error:
        'Unable to submit your enquiry right now. Please contact us via WhatsApp or call us directly.',
    }
  }
}
