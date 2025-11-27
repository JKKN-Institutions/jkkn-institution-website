import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DashboardGrid } from '@/components/dashboard/dashboard-grid'
import { DEFAULT_LAYOUTS, type WidgetConfig, type DashboardLayoutItem } from '@/lib/dashboard/widget-registry'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Info, Sparkles } from 'lucide-react'

async function getWidgets(): Promise<WidgetConfig[]> {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('dashboard_widgets')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return (data as WidgetConfig[]) || []
}

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
  const primaryRoleName = roleNames[0] || 'guest'
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

  // Get user's custom layout (if exists)
  const { data: customLayout } = await supabase
    .from('dashboard_layouts')
    .select('layout_config')
    .eq('user_id', userId)
    .single()

  // Get role-based default layout
  const { data: roleLayout } = await supabase
    .from('dashboard_layouts')
    .select('layout_config, role_id, roles(name)')
    .in('role_id', roles.map((r) => r?.id).filter(Boolean))
    .eq('is_default', true)
    .limit(1)
    .single()

  // Determine layout to use
  let layout: DashboardLayoutItem[]
  if (customLayout?.layout_config) {
    layout = customLayout.layout_config as unknown as DashboardLayoutItem[]
  } else if (roleLayout?.layout_config) {
    layout = roleLayout.layout_config as unknown as DashboardLayoutItem[]
  } else {
    // Use default layout based on role
    layout = DEFAULT_LAYOUTS[primaryRoleName] || DEFAULT_LAYOUTS.guest
  }

  return {
    profile,
    primaryRoleName,
    primaryRoleDisplay,
    permissions,
    layout,
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

  const [widgets, userData] = await Promise.all([
    getWidgets(),
    getUserDashboardData(user.id),
  ])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Guest User Banner - Mobile Optimized */}
      {userData.isGuestOnly && (
        <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800 rounded-xl sm:rounded-2xl">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <AlertDescription className="ml-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-amber-900 dark:text-amber-200">
                  Account Pending Approval
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 rounded-full">
                  Guest User
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                Your account is currently in guest mode with limited access. An administrator will review and approve your account shortly.
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-amber-700 dark:text-amber-400">
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="line-clamp-2 sm:line-clamp-none">You will receive an email notification once your account is approved.</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Header - Mobile Responsive */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-primary font-medium mb-2">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Welcome, {userData.profile?.full_name || 'User'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl line-clamp-2 sm:line-clamp-none">
            Here&apos;s your personalized dashboard. Monitor activity, manage content, and access quick actions.
          </p>
        </div>
      </div>

      {/* Widget Grid */}
      <DashboardGrid
        widgets={widgets}
        layout={userData.layout}
        userPermissions={userData.permissions}
        userId={user.id}
        userName={userData.profile?.full_name || 'User'}
        userRole={userData.primaryRoleDisplay}
      />
    </div>
  )
}
