import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/auth/login')
  }

  // Check if user email is from @jkkn.ac.in domain
  const email = session.user.email
  if (!email?.endsWith('@jkkn.ac.in')) {
    // Sign out and redirect
    await supabase.auth.signOut()
    redirect('/auth/login?error=unauthorized')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Will be implemented in future tasks */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold">JKKN Admin</h1>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Will be implemented in future tasks */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
