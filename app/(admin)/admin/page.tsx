import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Shield, Activity, TrendingUp, Clock, ArrowUpRight, Sparkles, AlertCircle, Info } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient()

  // Get counts in parallel
  const [usersResult, rolesResult, activityResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('roles').select('id', { count: 'exact', head: true }),
    supabase.from('user_activity_logs').select('id', { count: 'exact', head: true }),
  ])

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from('user_activity_logs')
    .select('*, profiles:user_id(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalUsers: usersResult.count || 0,
    totalRoles: rolesResult.count || 0,
    totalActivities: activityResult.count || 0,
    recentActivity: recentActivity || [],
  }
}

async function getUserRoles() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)

  return userRoles?.map((ur: any) => ur.roles?.name).filter(Boolean) || []
}

export default async function AdminDashboard() {
  const [stats, userRoles] = await Promise.all([getDashboardStats(), getUserRoles()])
  const isGuestUser = userRoles.includes('guest') && userRoles.length === 1

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
      trend: '+12%',
      trendUp: true,
      gradient: 'from-primary to-primary/80',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      title: 'Roles',
      value: stats.totalRoles,
      icon: Shield,
      description: 'Defined roles',
      trend: '+2',
      trendUp: true,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      title: 'Activities',
      value: stats.totalActivities,
      icon: Activity,
      description: 'Total logged actions',
      trend: '+48%',
      trendUp: true,
      gradient: 'from-secondary to-secondary/80',
      iconBg: 'bg-secondary/20 text-secondary-foreground',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Guest User Banner */}
      {isGuestUser && (
        <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="ml-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-900 dark:text-amber-200">
                  Account Pending Approval
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 rounded-full">
                  Guest User
                </span>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Your account is currently in guest mode with limited access. An administrator will review and approve your account shortly. You can view basic information but cannot perform administrative actions.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 dark:text-amber-400">
                <Info className="h-3.5 w-3.5" />
                <span>You will receive an email notification once your account is approved.</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Welcome Message with Glassmorphism */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Welcome back</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            JKKN Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Here&apos;s an overview of your institution&apos;s platform. Monitor user activity,
            manage roles, and track system performance all in one place.
          </p>
        </div>
      </div>

      {/* Stats Grid with Gradient Border Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.title} className="stat-card p-6 hover-glow transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity with Glassmorphism */}
        <Card className="glass-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="mt-1">
                  Latest actions across the platform
                </CardDescription>
              </div>
              <Link
                href="/admin/activity"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity: {
                  id: string
                  action: string
                  module: string
                  resource_type: string | null
                  created_at: string
                  profiles: { full_name: string | null; email: string } | null
                }) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0 group"
                  >
                    <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">
                          {activity.profiles?.full_name || 'Unknown user'}
                        </span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        {activity.resource_type && (
                          <span className="text-muted-foreground">
                            {activity.resource_type} in{' '}
                            <span className="badge-brand">{activity.module}</span>
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.created_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions with Glassmorphism */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link
                href="/admin/users"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group shine"
              >
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Manage Users
                  </p>
                  <p className="text-sm text-muted-foreground">
                    View and manage user accounts
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              <Link
                href="/admin/roles"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200 group shine"
              >
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Manage Roles
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Configure roles and permissions
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </Link>

              <Link
                href="/admin/activity"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-200 group shine"
              >
                <div className="p-3 rounded-xl bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                  <Activity className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-secondary-foreground transition-colors">
                    Activity Logs
                  </p>
                  <p className="text-sm text-muted-foreground">
                    View system activity and audit trail
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary-foreground transition-colors" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
