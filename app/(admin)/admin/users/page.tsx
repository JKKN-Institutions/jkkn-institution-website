import { Suspense } from 'react'
import { UsersTable } from './users-table'
import { UserPlus, Mail, Users as UsersIcon, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface UsersPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    role?: string
    status?: string
  }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 50
  const search = params.search || ''
  const role = params.role || ''
  const status = params.status || ''

  return (
    <div className="space-y-6">
      {/* Page Header with Glassmorphism */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Users</h1>
                <span className="badge-brand">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Module 1
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                Manage user accounts, roles, and permissions
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="hover:border-primary/30 hover:bg-primary/5">
              <Link href="/admin/users/approved-emails">
                <Mail className="mr-2 h-4 w-4" />
                Approved Emails
              </Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-brand">
              <Link href="/admin/users/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table with Glass Effect */}
      <div className="glass-card rounded-2xl p-6">
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
