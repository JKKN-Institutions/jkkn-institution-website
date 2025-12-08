import { Suspense } from 'react'
import { UsersTable } from './users-table'
import { Users as UsersIcon, UserCheck, UserX, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AddUserModal } from './add-user-modal'

interface UsersPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    role?: string
    status?: string
  }>
}

async function getUserStats() {
  const supabase = await createServerSupabaseClient()

  // Use optimized database function for single-query stats
  const { data, error } = await supabase.rpc('get_user_stats')

  if (error) {
    console.error('Error fetching user stats:', error)
    return { total: 0, active: 0, pending: 0, blocked: 0 }
  }

  return {
    total: data?.total || 0,
    active: data?.active || 0,
    pending: data?.pending || 0,
    blocked: data?.blocked || 0
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 50
  const search = params.search || ''
  const role = params.role || ''
  const status = params.status || ''

  const stats = await getUserStats()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <AddUserModal />
        </div>
      </div>

      {/* User Stats Cards - 4 cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <UsersIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </div>

        {/* Active Users */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <UserCheck className="h-4 w-4" />
            <span className="text-sm font-medium">Active Users</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>

        {/* Pending Users */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Pending Users</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
        </div>

        {/* Blocked Users */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <UserX className="h-4 w-4" />
            <span className="text-sm font-medium">Blocked Users</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTable
            page={page}
            limit={limit}
            search={search}
            roleFilter={role}
            statusFilter={status}
          />
        </Suspense>
      </div>
    </div>
  )
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
        <div className="flex-1" />
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-20 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
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
