'use server'

// Template for a JKKN Server Action module.
// Copy to app/actions/<entity>.ts (or app/actions/cms/<entity>.ts).
// Replace "Widget"/"widgets" with the entity name + table.

import { createServerSupabaseClient } from '@/lib/supabase/server'
// import { createAdminSupabaseClient } from '@/lib/supabase/server' // only for service-role ops
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
// import { checkPermission } from './permissions' // for protected operations

export interface Widget {
  id: string
  name: string
  description: string | null
  is_active: boolean
  display_order: number
  created_at: string
  created_by: string | null
}

const WidgetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

// ---------------- READS (no auth needed for public reads; RLS still applies) ----------------

export async function getWidgets(): Promise<Widget[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('widgets')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching widgets:', error)
    return []
  }
  return data ?? []
}

export async function getWidget(id: string): Promise<Widget | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('widgets').select('*').eq('id', id).single()
  if (error) {
    console.error('Error fetching widget:', error)
    return null
  }
  return data
}

// ---------------- CREATE ----------------

export async function createWidget(
  formData: FormData
): Promise<{ success: boolean; error?: string; data?: Widget }> {
  const supabase = await createServerSupabaseClient()

  // 1) Auth
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 2) (optional) permission
  // if (!(await checkPermission(user.id, 'cms:widgets:create')))
  //   return { success: false, error: 'Forbidden' }

  try {
    // 3) Validate
    const validated = WidgetSchema.parse({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      is_active: formData.get('is_active') === 'true',
    })

    // 4) Mutate
    const { data, error } = await supabase
      .from('widgets')
      .insert({ ...validated, created_by: user.id })
      .select()
      .single()

    if (error) {
      console.error('Error creating widget:', error)
      return { success: false, error: error.message }
    }

    // 5) Log activity
    await logActivity({
      userId: user.id,
      action: 'create',
      module: 'cms',
      resourceType: 'widget',
      resourceId: data.id,
      metadata: { name: data.name },
    })

    // 6) Revalidate every affected route
    revalidatePath('/admin/widgets')
    revalidatePath('/')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to create widget' }
  }
}

// ---------------- UPDATE ----------------

export async function updateWidget(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const validated = WidgetSchema.partial().parse({
      name: formData.get('name') ?? undefined,
      description: formData.get('description') ?? undefined,
      is_active: formData.get('is_active') === 'true',
    })

    const { error } = await supabase.from('widgets').update(validated).eq('id', id)
    if (error) return { success: false, error: error.message }

    await logActivity({
      userId: user.id,
      action: 'update',
      module: 'cms',
      resourceType: 'widget',
      resourceId: id,
      metadata: { changes: validated },
    })

    revalidatePath('/admin/widgets')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, error: error.issues[0].message }
    return { success: false, error: 'Failed to update widget' }
  }
}

// ---------------- DELETE ----------------

export async function deleteWidget(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase.from('widgets').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'cms',
    resourceType: 'widget',
    resourceId: id,
  })

  revalidatePath('/admin/widgets')
  revalidatePath('/')
  return { success: true }
}
