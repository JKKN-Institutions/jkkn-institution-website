import { Suspense } from 'react'
import { UsersTable } from './users-table'
import { UserPlus, Mail, Users as UsersIcon, UserCheck, UserX, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

  // Get total count
  const { count: totalCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get guest role id
  const { data: guestRole } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'guest')
    .single()

  // Get active users (users with roles other than guest)
  const { data: activeUsers } = await supabase
    .from('user_roles')
    .select('user_id')

  // Filter out users who only have guest role
  const { data: guestOnlyUsers } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role_id', guestRole?.id || '')

  const allUserIds = new Set(activeUsers?.map(u => u.user_id) || [])
  const guestOnlyUserIds = new Set(guestOnlyUsers?.map(u => u.user_id) || [])

  // Active = users with any role that's not guest only
  const activeCount = allUserIds.size

  // Blocked = total - active (users with no roles or pending approval)
  const blockedCount = (totalCount || 0) - activeCount

  return {
    total: totalCount || 0,
    active: activeCount,
    blocked: blockedCount > 0 ? blockedCount : 0
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
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Responsive */}
      <ResponsivePageHeader
        icon={<UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="User Management"
        description="Manage user accounts, roles, and permissions"
        badge="Module 1"
        actions={
          <>
            <Button
              variant="outline"
              asChild
              className="hover:border-primary/30 hover:bg-primary/5 w-full sm:w-auto min-h-[44px]"
            >
              <Link href="/admin/users/approved-emails">
                <Mail className="mr-2 h-4 w-4" />
                <span className="sm:inline">Approved Emails</span>
              </Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 shadow-brand w-full sm:w-auto min-h-[44px]"
            >
              <Link href="/admin/users/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Link>
            </Button>
          </>
        }
      />

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <UsersIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-destructive/10">
            <UserX className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.blocked}</p>
            <p className="text-sm text-muted-foreground">Blocked Users</p>
          </div>
        </div>
      </div>

      {/* Users Table with Glass Effect - Responsive padding */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
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
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
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
