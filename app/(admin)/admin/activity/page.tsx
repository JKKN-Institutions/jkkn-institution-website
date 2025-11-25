import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ActivityLogTable } from './activity-log-table'
import { Card } from '@/components/ui/card'
import { Activity, Sparkles, Shield } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ActivityPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    module?: string
    action?: string
    userId?: string
  }>
}

export const metadata = {
  title: 'System Activity Log | JKKN Admin',
  description: 'View all system activity and user actions',
}

async function checkSuperAdminAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const isSuperAdminUser = await isSuperAdmin(user.id)
  if (!isSuperAdminUser) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
  await checkSuperAdminAccess()

  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 50
  const module = params.module || ''
  const action = params.action || ''
  const userId = params.userId || ''

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">System Activity Log</h1>
                <span className="badge-brand">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Audit Trail
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                Monitor all user actions across the system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
              Super Admin Only
            </span>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <Card className="glass-card border-0 p-6">
        <Suspense fallback={<ActivityTableSkeleton />}>
          <ActivityLogTable
            page={page}
            limit={limit}
            moduleFilter={module}
            actionFilter={action}
            userIdFilter={userId}
          />
        </Suspense>
      </Card>
    </div>
  )
}

function ActivityTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-64 rounded-lg" />
                <Skeleton className="h-3 w-40 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
