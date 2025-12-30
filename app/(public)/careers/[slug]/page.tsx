import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCareerJobBySlug } from '@/app/actions/cms/careers'
import { JobPostingSchema } from '@/components/seo/job-posting-schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Building2,
  ArrowLeft,
  Calendar,
  GraduationCap,
  Users,
  Star,
  AlertCircle,
  CheckCircle2,
  Share2,
  ExternalLink,
  Mail,
  Laptop
} from 'lucide-react'

interface JobDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)

  if (!job) {
    return {
      title: 'Job Not Found | JKKN Careers',
    }
  }

  return {
    title: `${job.seo_title || job.title} | JKKN Careers`,
    description: job.seo_description || job.description,
    openGraph: {
      title: job.seo_title || job.title,
      description: job.seo_description || job.description,
      type: 'website',
    },
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
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
  entry: 'Entry Level (0-2 years)',
  mid: 'Mid Level (2-5 years)',
  senior: 'Senior Level (5-8 years)',
  lead: 'Lead / Principal (8-12 years)',
  director: 'Director / Executive (12+ years)',
}

// Content Renderer - Renders TipTap JSON content
function ContentRenderer({ content }: { content: Record<string, unknown> }) {
  const renderNode = (node: Record<string, unknown>, index: number): React.ReactNode => {
    const type = node.type as string
    const contentArr = node.content as Record<string, unknown>[] | undefined
    const text = node.text as string | undefined
    const marks = node.marks as { type: string; attrs?: Record<string, unknown> }[] | undefined

    switch (type) {
      case 'doc':
        return contentArr?.map((child, i) => renderNode(child, i))

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {contentArr?.map((child, i) => renderNode(child, i))}
          </p>
        )

      case 'heading':
        const level = (node.attrs as { level: number })?.level || 2
        const headingClasses = {
          1: 'text-2xl font-bold mb-4 mt-6',
          2: 'text-xl font-bold mb-3 mt-5',
          3: 'text-lg font-semibold mb-2 mt-4',
          4: 'text-base font-semibold mb-2 mt-3',
          5: 'text-sm font-medium mb-2 mt-3',
          6: 'text-sm font-medium mb-2 mt-2',
        }
        const headingClass = headingClasses[level as keyof typeof headingClasses]
        const headingContent = contentArr?.map((child, i) => renderNode(child, i))
        if (level === 1) return <h1 key={index} className={headingClass}>{headingContent}</h1>
        if (level === 2) return <h2 key={index} className={headingClass}>{headingContent}</h2>
        if (level === 3) return <h3 key={index} className={headingClass}>{headingContent}</h3>
        if (level === 4) return <h4 key={index} className={headingClass}>{headingContent}</h4>
        if (level === 5) return <h5 key={index} className={headingClass}>{headingContent}</h5>
        return <h6 key={index} className={headingClass}>{headingContent}</h6>

      case 'bulletList':
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-1">
            {contentArr?.map((child, i) => renderNode(child, i))}
          </ul>
        )

      case 'orderedList':
        return (
          <ol key={index} className="list-decimal pl-6 mb-4 space-y-1">
            {contentArr?.map((child, i) => renderNode(child, i))}
          </ol>
        )

      case 'listItem':
        return (
          <li key={index}>
            {contentArr?.map((child, i) => renderNode(child, i))}
          </li>
        )

      case 'text':
        let textContent: React.ReactNode = text

        marks?.forEach((mark) => {
          switch (mark.type) {
            case 'bold':
              textContent = <strong key={index}>{textContent}</strong>
              break
            case 'italic':
              textContent = <em key={index}>{textContent}</em>
              break
            case 'link':
              const href = (mark.attrs as { href: string })?.href
              textContent = (
                <a
                  key={index}
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {textContent}
                </a>
              )
              break
          }
        })

        return textContent

      default:
        return null
    }
  }

  return <div>{renderNode(content, 0)}</div>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date()
  const isDeadlineSoon = job.deadline &&
    new Date(job.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  const canApply = !isDeadlinePassed &&
    job.status === 'published' &&
    (job.positions_filled || 0) < job.positions_available

  return (
    <div className="min-h-screen bg-cream">
      {/* JobPosting Schema for Google Jobs */}
      <JobPostingSchema job={job} />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6 -ml-2">
              <Link href="/careers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Careers
              </Link>
            </Button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {job.is_featured && (
                <Badge className="bg-amber-500 text-white gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              {job.is_urgent && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Urgent Hiring
                </Badge>
              )}
              {isDeadlineSoon && !isDeadlinePassed && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Closing Soon
                </Badge>
              )}
              {isDeadlinePassed && (
                <Badge variant="secondary">Applications Closed</Badge>
              )}
            </div>

            {/* Department */}
            {job.department && (
              <Badge
                variant="secondary"
                className="mb-3"
                style={{ backgroundColor: job.department.color ? `${job.department.color}20` : undefined }}
              >
                <Building2 className="h-3 w-3 mr-1" />
                {job.department.name}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {job.title}
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{JOB_TYPE_LABELS[job.job_type] || job.job_type}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Laptop className="h-4 w-4" />
                <span>{WORK_MODE_LABELS[job.work_mode] || job.work_mode}</span>
              </div>
              {job.experience_level && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{EXPERIENCE_LABELS[job.experience_level] || job.experience_level}</span>
                </div>
              )}
            </div>

            {/* Apply Button (Hero) */}
            <div className="flex items-center gap-4">
              {canApply ? (
                job.application_method === 'internal' ? (
                  <Button size="lg" asChild>
                    <Link href={`/careers/apply/${slug}`}>
                      Apply Now
                    </Link>
                  </Button>
                ) : job.application_method === 'external' && job.external_apply_url ? (
                  <Button size="lg" asChild>
                    <a href={job.external_apply_url} target="_blank" rel="noopener noreferrer">
                      Apply on External Site
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : job.application_method === 'email' && job.apply_email ? (
                  <Button size="lg" asChild>
                    <a href={`mailto:${job.apply_email}?subject=Application for ${job.title}`}>
                      Apply via Email
                      <Mail className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null
              ) : (
                <Button size="lg" disabled>
                  {isDeadlinePassed ? 'Applications Closed' : 'Position Filled'}
                </Button>
              )}

              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>

                  {/* Rich Content */}
                  {job.content && Object.keys(job.content).length > 0 && (
                    <div className="prose-content">
                      <ContentRenderer content={job.content as Record<string, unknown>} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Qualifications</CardTitle>
                    <CardDescription>Required qualifications for this position</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.qualifications.map((qual, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Skills Required */}
              {job.skills_required && job.skills_required.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Preferred */}
              {job.skills_preferred && job.skills_preferred.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferred Skills</CardTitle>
                    <CardDescription>Nice to have, but not required</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_preferred.map((skill, i) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Job Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Salary */}
                    {job.show_salary && (job.salary_min || job.salary_max) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Salary</p>
                        <p className="font-medium flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {(job.experience_years_min || job.experience_years_max) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Experience</p>
                        <p className="font-medium">
                          {job.experience_years_min && job.experience_years_max
                            ? `${job.experience_years_min} - ${job.experience_years_max} years`
                            : job.experience_years_min
                              ? `${job.experience_years_min}+ years`
                              : `Up to ${job.experience_years_max} years`}
                        </p>
                      </div>
                    )}

                    {/* Positions */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Positions Available</p>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.positions_available - (job.positions_filled || 0)} of {job.positions_available}
                      </p>
                    </div>

                    {/* Deadline */}
                    {job.deadline && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Application Deadline</p>
                        <p className={`font-medium flex items-center gap-1 ${isDeadlinePassed ? 'text-destructive' : isDeadlineSoon ? 'text-orange-600' : ''}`}>
                          <Calendar className="h-4 w-4" />
                          {formatDate(job.deadline)}
                        </p>
                      </div>
                    )}

                    {/* Posted Date */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Posted On</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(job.published_at)}
                      </p>
                    </div>

                    <Separator />

                    {/* Apply Button */}
                    {canApply ? (
                      job.application_method === 'internal' ? (
                        <Button className="w-full" size="lg" asChild>
                          <Link href={`/careers/apply/${slug}`}>
                            Apply Now
                          </Link>
                        </Button>
                      ) : job.application_method === 'external' && job.external_apply_url ? (
                        <Button className="w-full" size="lg" asChild>
                          <a href={job.external_apply_url} target="_blank" rel="noopener noreferrer">
                            Apply on External Site
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : job.application_method === 'email' && job.apply_email ? (
                        <Button className="w-full" size="lg" asChild>
                          <a href={`mailto:${job.apply_email}?subject=Application for ${job.title}`}>
                            Apply via Email
                            <Mail className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : null
                    ) : (
                      <Button className="w-full" size="lg" disabled>
                        {isDeadlinePassed ? 'Applications Closed' : 'Position Filled'}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Hiring Manager */}
                {job.hiring_manager && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Hiring Manager</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-medium text-primary">
                            {(job.hiring_manager.full_name || 'H')[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{job.hiring_manager.full_name || 'Hiring Manager'}</p>
                          <p className="text-sm text-muted-foreground">{job.hiring_manager.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Back to Careers */}
                <Button variant="outline" asChild className="w-full">
                  <Link href="/careers">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Browse More Jobs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
