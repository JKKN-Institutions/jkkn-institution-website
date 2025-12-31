import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ApprovedEmailsTable } from './approved-emails-table'
import { Card } from '@/components/ui/card'
import { Mail, Sparkles, Plus, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ApprovedEmailsPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    status?: string
  }>
}

export const metadata = {
  title: 'Approved Emails | JKKN Admin',
  description: 'Manage approved email addresses for user registration',
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'users:emails:view')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function ApprovedEmailsPage({
  searchParams,
}: ApprovedEmailsPageProps) {
  await checkAccess()

  const searchParamsResolved = await searchParams
  const page = Number(searchParamsResolved.page) || 1
  const limit = Number(searchParamsResolved.limit) || 50
  const search = searchParamsResolved.search || ''
  const status = searchParamsResolved.status || ''

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/5 shrink-0">
                <Link href="/admin/users">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="p-2.5 sm:p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 shrink-0">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">Approved Emails</h1>
                  <span className="badge-brand hidden sm:inline-flex">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Whitelist
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                  Manage approved email addresses
                </p>
              </div>
            </div>
            <Button asChild className="gap-2 w-full sm:w-auto shrink-0">
              <Link href="/admin/users/new">
                <Plus className="h-4 w-4" />
                <span>Add Email</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="glass-card border-0 p-6">
        <Suspense fallback={<ApprovedEmailsTableSkeleton />}>
          <ApprovedEmailsTable
            page={page}
            limit={limit}
            searchFilter={search}
            statusFilter={status}
          />
        </Suspense>
      </Card>
    </div>
  )
}

function ApprovedEmailsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-6 w-64 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
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
