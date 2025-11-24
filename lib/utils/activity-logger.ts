import { createServerSupabaseClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export interface ActivityLog {
  userId: string
  action: string
  module: string
  resourceType?: string
  resourceId?: string
  metadata?: Record<string, any>
}

async function getClientIP(): Promise<string | null> {
  const FALLBACK_IP = '0.0.0.0'
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return headersList.get('x-real-ip') || FALLBACK_IP
}

export async function logActivity({
  userId,
  action,
  module,
  resourceType,
  resourceId,
  metadata = {},
}: ActivityLog): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient()
    const headersList = await headers()

    await supabase.from('user_activity_logs').insert({
      user_id: userId,
      action,
      module,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
      ip_address: await getClientIP(),
      user_agent: headersList.get('user-agent') || 'Unknown',
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    // Log error but don't throw to avoid breaking the main operation
    console.error('Failed to log activity:', error)
  }
}
