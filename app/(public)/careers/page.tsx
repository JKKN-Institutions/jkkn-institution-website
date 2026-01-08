import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedCareerJobs } from '@/app/actions/cms/careers'
import { getCareerDepartments } from '@/app/actions/cms/career-departments'
import { getPageWithVisibility } from '@/app/actions/cms/pages'
import { getActiveCustomComponents } from '@/app/actions/cms/get-custom-components'
import { PageRenderer } from '@/components/cms-blocks/page-renderer'
import { CustomComponentRegistrar } from '@/components/cms-blocks/custom-component-registrar'
import { Skeleton } from '@/components/ui/skeleton'
import { PasswordProtectedPage, PrivatePageGate } from '@/components/public/password-protected-page'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
  CalendarDays,
  Users,
  GraduationCap,
  Filter
} from 'lucide-react'
import { getBreadcrumbsForPath, generateBreadcrumbSchema, serializeSchema } from '@/lib/seo'

// Generate metadata with breadcrumb schema
export async function generateMetadata(): Promise<Metadata> {
  const breadcrumbs = getBreadcrumbsForPath('/careers')
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)

  // Check if CMS page exists for careers
  const { getPageBySlug } = await import('@/app/actions/cms/pages')
  const cmsPage = await getPageBySlug('careers')

  // If CMS page exists, use its SEO metadata
  if (cmsPage) {
    const seo = cmsPage.cms_seo_metadata

    return {
      title: {
        absolute: seo?.meta_title || cmsPage.title
      },
      description: seo?.meta_description || cmsPage.description || undefined,
      keywords: seo?.meta_keywords || undefined,
      openGraph: {
        title: seo?.og_title || seo?.meta_title || cmsPage.title,
        description: seo?.og_description || seo?.meta_description || cmsPage.description || undefined,
        images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
        type: (seo?.og_type as any) || 'website',
      },
      twitter: {
        card: (seo?.twitter_card as any) || 'summary_large_image',
        title: seo?.twitter_title || seo?.og_title || seo?.meta_title || cmsPage.title,
        description: seo?.twitter_description || seo?.og_description || seo?.meta_description || cmsPage.description || undefined,
        images: seo?.twitter_image ? [seo.twitter_image] : (seo?.og_image ? [seo.og_image] : undefined),
      },
      alternates: seo?.canonical_url ? {
        canonical: seo.canonical_url,
      } : undefined,
      robots: seo?.robots_directive || undefined,
      other: {
        'script:ld+json:breadcrumb': serializeSchema(breadcrumbSchema),
      },
    }
  }

  // Default metadata if no CMS page
  return {
    title: 'Careers | JKKN Institution',
    description: 'Join our team! Explore current job openings and career opportunities at JKKN Institution.',
    openGraph: {
      title: 'Careers at JKKN Institution',
      description: 'Join our team! Explore current job openings and career opportunities at JKKN Institution.',
      type: 'website',
    },
    other: {
      'script:ld+json:breadcrumb': serializeSchema(breadcrumbSchema),
    },
  }
}

interface CareersPageProps {
  searchParams: Promise<{
    page?: string
    department?: string
    type?: string
    location?: string
    search?: string
  }>
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatSalary(min: number | null, max: number | null, currency: string = 'INR', period: string = 'monthly'): string {
  if (!min && !max) return 'Competitive'

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  })

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)} / ${period}`
  } else if (min) {
    return `${formatter.format(min)}+ / ${period}`
  } else if (max) {
    return `Up to ${formatter.format(max)} / ${period}`
  }
  return 'Competitive'
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  visiting: 'Visiting Faculty',
}

const WORK_MODE_LABELS: Record<string, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  lead: 'Lead / Principal',
  director: 'Director / Executive',
}

// Job Card Component
function JobCard({ job }: { job: {
  id: string
  title: string
  slug: string
  description: string
  job_type: string
  experience_level: string | null
  location: string
  work_mode: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  salary_period: string
  show_salary: boolean
  deadline: string | null
  positions_available: number
  is_featured: boolean
  is_urgent: boolean
  published_at: string | null
  department?: { id: string; name: string; slug: string; color: string | null } | null
} }) {
  const isDeadlineSoon = job.deadline &&
    new Date(job.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 // 7 days

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-border/50 ${job.is_featured ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {job.is_featured && (
                <Badge className="bg-amber-500 text-white gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              {job.is_urgent && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Urgent
                </Badge>
              )}
              {isDeadlineSoon && !job.is_urgent && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Closing Soon
                </Badge>
              )}
            </div>

            {/* Department */}
            {job.department && (
              <Badge
                variant="secondary"
                className="mb-2"
                style={{ backgroundColor: job.department.color ? `${job.department.color}20` : undefined }}
              >
                <Building2 className="h-3 w-3 mr-1" />
                {job.department.name}
              </Badge>
            )}

            {/* Title */}
            <Link href={`/careers/${job.slug}`}>
              <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </CardTitle>
            </Link>
          </div>
        </div>

        {/* Description */}
        <CardDescription className="line-clamp-2 mt-2">
          {job.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {/* Job Type */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span>{JOB_TYPE_LABELS[job.job_type] || job.job_type}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          {/* Work Mode */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span>{WORK_MODE_LABELS[job.work_mode] || job.work_mode}</span>
          </div>

          {/* Experience */}
          {job.experience_level && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap className="h-4 w-4 flex-shrink-0" />
              <span>{EXPERIENCE_LABELS[job.experience_level] || job.experience_level}</span>
            </div>
          )}

          {/* Salary */}
          {job.show_salary && (job.salary_min || job.salary_max) && (
            <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
              <IndianRupee className="h-4 w-4 flex-shrink-0" />
              <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}</span>
            </div>
          )}

          {/* Positions */}
          {job.positions_available > 1 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{job.positions_available} positions</span>
            </div>
          )}

          {/* Deadline */}
          {job.deadline && (
            <div className={`flex items-center gap-1.5 ${isDeadlineSoon ? 'text-orange-600' : 'text-muted-foreground'}`}>
              <CalendarDays className="h-4 w-4 flex-shrink-0" />
              <span>Apply by {formatDate(job.deadline)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Posted {formatDate(job.published_at)}
        </span>
        <Button asChild size="sm">
          <Link href={`/careers/${job.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sidebar Filters Component
async function JobFilters({
  currentDepartment,
  currentType,
  currentSearch
}: {
  currentDepartment?: string
  currentType?: string
  currentSearch?: string
}) {
  const departments = await getCareerDepartments({ includeInactive: false })

  return (
    <aside className="space-y-6">
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/careers" method="GET" className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Job title or keyword..."
                  defaultValue={currentSearch}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select name="department" defaultValue={currentDepartment || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.slug}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Type</label>
              <Select name="type" defaultValue={currentType || 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="visiting">Visiting Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Apply Filters
            </Button>

            {(currentDepartment || currentType || currentSearch) && (
              <Button variant="outline" asChild className="w-full">
                <Link href="/careers">Clear Filters</Link>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {departments.slice(0, 5).map((dept) => (
              <div key={dept.id} className="flex items-center justify-between">
                <Link
                  href={`/careers?department=${dept.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {dept.name}
                </Link>
                <Badge variant="secondary">{dept.job_count || 0}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

// Main Job List Component
async function JobList({
  page,
  departmentSlug,
  jobType,
  search
}: {
  page: number
  departmentSlug?: string
  jobType?: string
  search?: string
}) {
  const pageSize = 10
  const { jobs, total } = await getPublishedCareerJobs({
    page,
    pageSize,
    job_type: jobType as 'full_time' | 'part_time' | 'contract' | 'internship' | 'visiting' | undefined,
    search,
  })
  const totalPages = Math.ceil(total / pageSize)

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No open positions</h2>
        <p className="text-muted-foreground mb-4">
          {search || departmentSlug || jobType
            ? 'No jobs match your search criteria. Try adjusting your filters.'
            : 'There are currently no open positions. Please check back later.'}
        </p>
        {(search || departmentSlug || jobType) && (
          <Button asChild variant="outline">
            <Link href="/careers">View all positions</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {jobs.length} of {total} open position{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link href={`/careers?page=${page - 1}${departmentSlug ? `&department=${departmentSlug}` : ''}${jobType ? `&type=${jobType}` : ''}${search ? `&search=${search}` : ''}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </>
            )}
          </Button>

          <span className="text-sm text-muted-foreground px-4">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            asChild={page < totalPages}
          >
            {page < totalPages ? (
              <Link href={`/careers?page=${page + 1}${departmentSlug ? `&department=${departmentSlug}` : ''}${jobType ? `&type=${jobType}` : ''}${search ? `&search=${search}` : ''}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
  // First, check if a CMS page with slug "careers" exists
  const cmsPageResult = await getPageWithVisibility('careers')

  // If CMS page exists and is accessible, render it instead of the static careers module
  if (cmsPageResult.status === 'found' && cmsPageResult.page) {
    const customComponents = await getActiveCustomComponents()
    const page = cmsPageResult.page

    const blocks = page.cms_page_blocks.map((block) => ({
      id: block.id,
      component_name: block.component_name,
      props: block.props,
      sort_order: block.sort_order,
      parent_block_id: block.parent_block_id,
      is_visible: block.is_visible ?? true,
    }))

    const pageTypography = (page.metadata as Record<string, unknown> | null)?.typography as PageTypographySettings | undefined

    return (
      <article>
        <Suspense fallback={<CMSPageSkeleton />}>
          <CustomComponentRegistrar components={customComponents}>
            <PageRenderer blocks={blocks} pageTypography={pageTypography} />
          </CustomComponentRegistrar>
        </Suspense>
      </article>
    )
  }

  // Handle CMS page visibility restrictions
  if (cmsPageResult.status === 'requires_auth') {
    return <PrivatePageGate />
  }

  if (cmsPageResult.status === 'requires_password') {
    return <PasswordProtectedPage slug="careers" pageTitle="Careers" />
  }

  // If no CMS page exists or not published, show the default careers module
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const departmentSlug = params.department === 'all' ? undefined : params.department
  const jobType = params.type === 'all' ? undefined : params.type
  const search = params.search

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Be part of a dynamic team dedicated to excellence in education. Explore our current openings and take the next step in your career.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>Multiple Departments</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>Diverse Roles</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Various Locations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 order-1">
              <Suspense fallback={<FiltersSkeleton />}>
                <JobFilters
                  currentDepartment={departmentSlug}
                  currentType={jobType}
                  currentSearch={search}
                />
              </Suspense>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-2">
              {/* Active Filters */}
              {(departmentSlug || jobType || search) && (
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: &quot;{search}&quot;
                    </Badge>
                  )}
                  {departmentSlug && (
                    <Badge variant="secondary" className="gap-1">
                      Department: {departmentSlug}
                    </Badge>
                  )}
                  {jobType && (
                    <Badge variant="secondary" className="gap-1">
                      Type: {JOB_TYPE_LABELS[jobType] || jobType}
                    </Badge>
                  )}
                  <Link href="/careers" className="text-sm text-primary hover:underline ml-2">
                    Clear all
                  </Link>
                </div>
              )}

              <Suspense fallback={<JobListSkeleton />}>
                <JobList
                  page={page}
                  departmentSlug={departmentSlug}
                  jobType={jobType}
                  search={search}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Loading Skeletons
function FiltersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function JobListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-5 bg-muted rounded animate-pulse w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="h-9 bg-muted rounded animate-pulse w-28 ml-auto" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function CMSPageSkeleton() {
  return (
    <div className="space-y-8 p-4">
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
