import { Metadata } from 'next'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { getCareerJobBySlug } from '@/app/actions/cms/careers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Briefcase,
  MapPin,
  Building2,
  ArrowLeft,
  Calendar,
} from 'lucide-react'
import { ApplicationForm } from './application-form'

interface ApplyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ApplyPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)

  if (!job) {
    return {
      title: 'Job Not Found | JKKN Careers',
    }
  }

  return {
    title: `Apply for ${job.title} | JKKN Careers`,
    description: `Submit your application for the ${job.title} position at JKKN Institution.`,
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

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  visiting: 'Visiting Faculty',
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)

  if (!job) {
    notFound()
  }

  // Check if job accepts internal applications
  if (job.application_method !== 'internal') {
    redirect(`/careers/${slug}`)
  }

  // Check if applications are still open
  const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date()
  const positionsFilled = (job.positions_filled || 0) >= job.positions_available

  if (isDeadlinePassed || positionsFilled || job.status !== 'published') {
    redirect(`/careers/${slug}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="relative py-8 md:py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-4 -ml-2">
              <Link href={`/careers/${slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Job Details
              </Link>
            </Button>

            {/* Job Info Card */}
            <Card>
              <CardHeader className="pb-3">
                {job.department && (
                  <Badge
                    variant="secondary"
                    className="w-fit mb-2"
                    style={{ backgroundColor: job.department.color ? `${job.department.color}20` : undefined }}
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    {job.department.name}
                  </Badge>
                )}
                <CardTitle className="text-xl">Apply for: {job.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {JOB_TYPE_LABELS[job.job_type] || job.job_type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  {job.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Apply by {formatDate(job.deadline)}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
                <CardDescription>
                  Fill in your details below. Fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationForm jobId={job.id} jobTitle={job.title} jobSlug={slug} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
