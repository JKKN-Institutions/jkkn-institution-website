import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResponsiveNavigation } from '@/components/admin/responsive-navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminLayoutClient } from '@/components/admin/admin-layout-client'

// Type for role relation from Supabase join
type RoleData = { id: string; name: string; display_name: string }
type RoleRelation = RoleData | RoleData[] | null

function getRoleData(roles: RoleRelation): RoleData | undefined {
  if (!roles) return undefined
  if (Array.isArray(roles)) return roles[0]
  return roles
}

async function getUserData(userId: string) {
  const supabase = await createServerSupabaseClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single()

  // Get user roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('roles(id, name, display_name)')
    .eq('user_id', userId)

  const roles = userRoles?.map((ur) => getRoleData(ur.roles as RoleRelation)).filter(Boolean) as RoleData[] || []
  const roleNames = roles.map((r) => r?.name).filter(Boolean)
  const isSuperAdmin = roleNames.includes('super_admin')

  // Get permissions
  let permissions: string[] = []
  if (isSuperAdmin) {
    permissions = ['*:*:*']
  } else if (roles.length > 0) {
    const roleIds = roles.map((r) => r?.id).filter(Boolean)
    const { data: rolePermissions } = await supabase
      .from('role_permissions')
      .select('permission')
      .in('role_id', roleIds)

    permissions = [...new Set(rolePermissions?.map((rp) => rp.permission) || [])]
  }

  // Get primary role display name
  const primaryRole = roles[0]?.display_name || 'User'

  return {
    name: profile?.full_name || 'User',
    email: profile?.email || '',
    role: primaryRole,
    permissions,
  }
}

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

  // Get user data including permissions
  const userData = await getUserData(session.user.id)

  // Pass initial user data to client - this gets cached and won't re-fetch on navigation
  const initialUserData = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    permissions: userData.permissions,
  }

  return (
    <AdminLayoutClient userId={session.user.id} initialUserData={initialUserData}>
      <div className="admin-layout flex h-screen w-full max-w-full overflow-hidden bg-background">
        {/* Decorative gradient background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Responsive Navigation (Desktop Sidebar + Mobile Bottom Nav) */}
        <ResponsiveNavigation />

        {/* Main Content Area with Fixed Header */}
        <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
          {/* Fixed Header - uses user data from context */}
          <AdminHeader />

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminLayoutClient>
  )
}
