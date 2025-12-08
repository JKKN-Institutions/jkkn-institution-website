import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Info } from 'lucide-react'
import { DashboardStatsCards } from '@/components/dashboard/dashboard-stats-cards'
import { RecentUsersSection } from '@/components/dashboard/recent-users-section'
import { RecentActivitySection } from '@/components/dashboard/recent-activity-section'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'

async function getUserDashboardData(userId: string) {
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

  type RoleData = { id: string; name: string; display_name: string }
  const roles = userRoles?.map((ur: { roles: RoleData | RoleData[] | null }) => {
    if (Array.isArray(ur.roles)) return ur.roles[0]
    return ur.roles
  }).filter(Boolean) as RoleData[] || []

  const roleNames = roles.map((r) => r?.name).filter(Boolean)
  const isSuperAdmin = roleNames.includes('super_admin')
  const primaryRoleDisplay = roles[0]?.display_name || 'Guest'

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

  return {
    profile,
    primaryRoleDisplay,
    permissions,
    isGuestOnly: roleNames.length === 1 && roleNames[0] === 'guest',
  }
}

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please log in to view the dashboard.</p>
      </div>
    )
  }

  const userData = await getUserDashboardData(user.id)

  return (
    <div className="space-y-6">
      {/* Guest User Banner */}
      {userData.isGuestOnly && (
        <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800 rounded-xl">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <AlertDescription className="ml-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                  Account Pending Approval
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 rounded-full">
                  Guest User
                </span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Your account is currently in guest mode with limited access. An administrator will review and approve your account shortly.
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-amber-700 dark:text-amber-400">
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <span>You will receive an email notification once your account is approved.</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards Row */}
      <DashboardStatsCards />

      {/* Recent Users and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Users - Takes 3 columns */}
        <div className="lg:col-span-3">
          <RecentUsersSection />
        </div>

        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivitySection />
        </div>
      </div>

      {/* Welcome Banner */}
      <WelcomeBanner />
    </div>
  )
}
