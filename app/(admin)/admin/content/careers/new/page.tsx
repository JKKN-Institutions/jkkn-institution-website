import { Suspense } from 'react'
import { CareerJobForm } from '../career-job-form'
import { ArrowLeft, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { getCareerDepartments } from '@/app/actions/cms/career-departments'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function NewCareerJobPage() {
  // Fetch data for form
  const [departments, supabase] = await Promise.all([
    getCareerDepartments(),
    createServerSupabaseClient(),
  ])

  // Get staff members for hiring manager selection
  const { data: staffMembers } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .order('full_name')

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="New Job Posting"
        description="Create a new job vacancy"
        badge="Careers"
        actions={
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/admin/content/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        }
      />

      {/* Job Form */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<FormSkeleton />}>
          <CareerJobForm
            departments={departments}
            staffMembers={staffMembers || []}
          />
        </Suspense>
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
