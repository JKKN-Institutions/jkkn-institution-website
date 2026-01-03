import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResponsiveNavigation } from '@/components/admin/responsive-navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminLayoutClient } from '@/components/admin/admin-layout-client'
import { AdminBottomNav } from '@/components/navigation/bottom-nav/admin/admin-bottom-nav'
import { AdminThemeProvider } from '@/components/providers/admin-theme-provider'

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

  // SECURITY: Use getUser() instead of getSession() to verify token with Supabase Auth server
  // getSession() reads from cookies directly and may not be authentic
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user email is from @jkkn.ac.in domain
  const email = user.email
  if (!email?.endsWith('@jkkn.ac.in')) {
    // Sign out and redirect
    await supabase.auth.signOut()
    redirect('/auth/login?error=unauthorized')
  }

  // Get user data including permissions
  const userData = await getUserData(user.id)

  // Pass initial user data to client - this gets cached and won't re-fetch on navigation
  const initialUserData = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    permissions: userData.permissions,
  }

  return (
    <AdminThemeProvider>
      <AdminLayoutClient userId={user.id} initialUserData={initialUserData}>
        <div className="admin-layout flex h-screen w-full max-w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-[2px]">
          {/* Decorative gradient background - Modern Glassmorphism (reduced blur for INP) */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Top right primary glow */}
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-primary/10 to-primary/5 blur-3xl" />

            {/* Bottom left secondary glow */}
            <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-secondary/10 to-secondary/5 blur-3xl" />

            {/* Center subtle accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-accent/5 blur-3xl" />

            {/* Mesh pattern overlay for texture */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          {/* Responsive Navigation (Desktop Sidebar + Mobile Bottom Nav) */}
          <ResponsiveNavigation />

          {/* Main Content Area with Fixed Header */}
          <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
            {/* Fixed Header - uses user data from context */}
            <AdminHeader />

            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
          </div>
        </div>

        {/* Mobile Bottom Navbar */}
        <AdminBottomNav userPermissions={initialUserData.permissions} />
      </AdminLayoutClient>
    </AdminThemeProvider>
  )
}
