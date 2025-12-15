import { notFound } from 'next/navigation'
import { ArrowLeft, Briefcase, Edit, Eye, MapPin, Clock, Users, Star, AlertCircle, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCareerJob } from '@/app/actions/cms/careers'
import { format } from 'date-fns'

interface CareerJobPageProps {
  params: Promise<{
    id: string
  }>
}

const statusLabels: Record<string, { label: string; class: string }> = {
  draft: { label: 'Draft', class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
  published: { label: 'Published', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  paused: { label: 'Paused', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  closed: { label: 'Closed', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  filled: { label: 'Filled', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
}

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  visiting: 'Visiting',
}

const experienceLevelLabels: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  director: 'Director',
}

export default async function CareerJobPage({ params }: CareerJobPageProps) {
  const { id } = await params
  const job = await getCareerJob(id)

  if (!job) {
    notFound()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title={job.title}
        description={job.description}
        badge="Careers"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            {job.status === 'published' && (
              <Button asChild variant="outline" className="min-h-[44px]">
                <Link href={`/careers/${job.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View Live
                </Link>
              </Button>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90 min-h-[44px]">
              <Link href={`/admin/content/careers/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <Badge variant="secondary">{jobTypeLabels[job.job_type]}</Badge>
                </div>
                {job.experience_level && (
                  <div>
                    <p className="text-sm text-muted-foreground">Experience Level</p>
                    <Badge variant="outline">{experienceLevelLabels[job.experience_level]}</Badge>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Work Mode</p>
                  <Badge variant="outline" className="capitalize">{job.work_mode}</Badge>
                </div>
              </div>

              {(job.experience_years_min || job.experience_years_max) && (
                <div>
                  <p className="text-sm text-muted-foreground">Experience Required</p>
                  <p className="font-medium">
                    {job.experience_years_min || 0} - {job.experience_years_max || '10+'} years
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Qualifications</p>
                <div className="flex flex-wrap gap-2">
                  {job.qualifications.map((qual, i) => (
                    <Badge key={i} variant="outline">{qual}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              {job.skills_preferred && job.skills_preferred.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Preferred Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_preferred.map((skill, i) => (
                      <Badge key={i} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Full Description (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(job.content, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, i) => (
                    <Badge key={i} variant="outline">{benefit}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusLabels[job.status].class}>
                  {statusLabels[job.status].label}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Positions</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{job.positions_filled}/{job.positions_available}</span>
                </div>
              </div>

              {job.is_featured && (
                <div className="flex items-center gap-2 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">Featured Job</span>
                </div>
              )}

              {job.is_urgent && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Urgent Hiring</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department */}
          <Card>
            <CardHeader>
              <CardTitle>Department</CardTitle>
            </CardHeader>
            <CardContent>
              {job.department ? (
                <Badge
                  variant="outline"
                  style={{ borderColor: job.department.color || undefined }}
                >
                  {job.department.name}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">Not assigned</span>
              )}
            </CardContent>
          </Card>

          {/* Compensation */}
          {job.show_salary && (job.salary_min || job.salary_max) && (
            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {job.salary_currency} {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                  {job.salary_period}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Application Info */}
          <Card>
            <CardHeader>
              <CardTitle>Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <Badge variant="outline" className="capitalize">{job.application_method}</Badge>
              </div>

              {job.deadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(job.deadline), 'MMM d, yyyy')}
                  </span>
                </div>
              )}

              {job.application_method === 'external' && job.external_apply_url && (
                <div>
                  <span className="text-muted-foreground">Apply URL</span>
                  <p className="font-mono text-xs break-all mt-1">{job.external_apply_url}</p>
                </div>
              )}

              {job.application_method === 'email' && job.apply_email && (
                <div>
                  <span className="text-muted-foreground">Apply Email</span>
                  <p className="font-mono text-xs mt-1">{job.apply_email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hiring Manager */}
          {job.hiring_manager && (
            <Card>
              <CardHeader>
                <CardTitle>Hiring Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-medium text-primary">
                      {(job.hiring_manager.full_name || job.hiring_manager.email)[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{job.hiring_manager.full_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{job.hiring_manager.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {job.published_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span>{format(new Date(job.published_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {job.created_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(job.created_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {job.updated_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{format(new Date(job.updated_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          {(job.seo_title || job.seo_description) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {job.seo_title && (
                  <div>
                    <span className="text-muted-foreground">Title</span>
                    <p className="font-medium">{job.seo_title}</p>
                  </div>
                )}
                {job.seo_description && (
                  <div>
                    <span className="text-muted-foreground">Description</span>
                    <p>{job.seo_description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
