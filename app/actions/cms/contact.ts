'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * Contact information types
 */
export interface ContactInfo {
  id: string
  contact_type: 'phone' | 'email' | 'address' | 'fax'
  contact_value: string
  display_label?: string | null
  is_primary: boolean
  display_order: number
}

/**
 * Get all contact information, ordered by display_order
 */
export async function getContactInfo(): Promise<ContactInfo[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('site_contact_info')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching contact info:', error)
    return []
  }

  return data || []
}

/**
 * Get primary phone number
 */
export async function getPrimaryPhone(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('site_contact_info')
    .select('contact_value')
    .eq('contact_type', 'phone')
    .eq('is_primary', true)
    .single()

  return data?.contact_value || null
}

/**
 * Get primary email address
 */
export async function getPrimaryEmail(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('site_contact_info')
    .select('contact_value')
    .eq('contact_type', 'email')
    .eq('is_primary', true)
    .single()

  return data?.contact_value || null
}

/**
 * Get contact info by type
 */
export async function getContactByType(
  type: 'phone' | 'email' | 'address' | 'fax'
): Promise<ContactInfo[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('site_contact_info')
    .select('*')
    .eq('contact_type', type)
    .order('display_order', { ascending: true })

  if (error) {
    console.error(`Error fetching ${type} contact info:`, error)
    return []
  }

  return data || []
}
