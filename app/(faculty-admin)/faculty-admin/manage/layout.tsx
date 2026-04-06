import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FacultyAdminHeader } from './faculty-admin-header'

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
    <div className="min-h-screen bg-gray-50">
      <FacultyAdminHeader userEmail={user.email || ''} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
