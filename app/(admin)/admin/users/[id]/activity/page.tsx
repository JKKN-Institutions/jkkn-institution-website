import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { getUserById } from '@/app/actions/users'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ActivityLogTable } from '../../../activity/activity-log-table'
import { Card } from '@/components/ui/card'
import { Activity, Sparkles, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserActivityPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    page?: string
    limit?: string
    module?: string
    action?: string
  }>
}

export async function generateMetadata({ params }: UserActivityPageProps) {
  const { id } = await params
  const user = await getUserById(id)

  return {
    title: `Activity Log - ${user?.full_name || 'User'} | JKKN Admin`,
    description: 'View user activity history',
  }
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'users:activity:view')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function UserActivityPage({
  params,
  searchParams,
}: UserActivityPageProps) {
  await checkAccess()

  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  const searchParamsResolved = await searchParams
  const page = Number(searchParamsResolved.page) || 1
  const limit = Number(searchParamsResolved.limit) || 50
  const module = searchParamsResolved.module || ''
  const action = searchParamsResolved.action || ''

  const initials =
    user.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-primary/5">
              <Link href={`/admin/users/${id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Activity Log</h1>
                <span className="badge-brand">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Audit Trail
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                View all actions performed by this user
              </p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{user.full_name || 'Unknown User'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
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
            userIdFilter={id}
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
