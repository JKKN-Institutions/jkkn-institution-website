import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FacultyAdminShell } from './faculty-admin-shell'

export default async function FacultyManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/faculty-admin')
  }

  return (
    <FacultyAdminShell userEmail={user.email || ''}>
      {children}
    </FacultyAdminShell>
  )
}
