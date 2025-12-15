import { Suspense } from 'react'
import { Briefcase, Plus, FolderOpen, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { CareerJobsTable } from './career-jobs-table'
import { getCareerJobs, type JobStatus, type JobType } from '@/app/actions/cms/careers'
import { getCareerDepartments } from '@/app/actions/cms/career-departments'

interface CareerJobsPageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    department?: string
    type?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }>
}

export default async function CareerJobsPage({ searchParams }: CareerJobsPageProps) {
  const params = await searchParams

  const page = parseInt(params.page || '1')
  const status = (params.status || 'all') as JobStatus | 'all'
  const department_id = params.department || undefined
  const job_type = params.type as JobType | undefined
  const search = params.search || ''
  const sortBy = params.sortBy || 'created_at'
  const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc'

  const [{ jobs, total }, departments] = await Promise.all([
    getCareerJobs({
      status,
      department_id,
      job_type,
      search,
      page,
      pageSize: 20,
      sortBy,
      sortOrder,
    }),
    getCareerDepartments({ includeInactive: true }),
  ])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Career Jobs"
        description="Manage job postings and vacancies"
        badge="Careers"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/careers/departments">
                <FolderOpen className="mr-2 h-4 w-4" />
                Departments
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/careers/applications">
                <Users className="mr-2 h-4 w-4" />
                Applications
              </Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 min-h-[44px]">
              <Link href="/admin/content/careers/new">
                <Plus className="mr-2 h-4 w-4" />
                New Job
              </Link>
            </Button>
          </div>
        }
      />

      {/* Jobs Table */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<TableSkeleton />}>
          <CareerJobsTable
            jobs={jobs}
            departments={departments}
            total={total}
            currentPage={page}
            pageSize={20}
            currentStatus={status}
            currentDepartment={department_id || ''}
            currentType={job_type || ''}
            currentSearch={search}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
          />
        </Suspense>
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
