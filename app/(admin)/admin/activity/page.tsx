import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ActivityLogTable } from './activity-log-table'
import { Card } from '@/components/ui/card'
import { Activity, Shield } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'

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
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Responsive */}
      <ResponsivePageHeader
        icon={<Activity className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />}
        title="System Activity Log"
        description="Monitor all user actions across the system"
        badge="Audit Trail"
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 w-full sm:w-auto justify-center">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
              Super Admin Only
            </span>
          </div>
        }
      />

      {/* Activity Table - Responsive padding */}
      <Card className="glass-card border-0 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
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
