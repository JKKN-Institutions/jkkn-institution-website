'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { submitApplication } from '@/app/actions/cms/career-applications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  FileText,
  Link as LinkIcon,
  Linkedin,
  Upload,
} from 'lucide-react'

interface ApplicationFormProps {
  jobId: string
  jobTitle: string
  jobSlug: string
}

export function ApplicationForm({ jobId, jobTitle, jobSlug }: ApplicationFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(submitApplication, null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Handle successful submission
  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true)
      // Redirect after a brief delay
      setTimeout(() => {
        router.push(`/careers/${jobSlug}?applied=true`)
      }, 3000)
    }
  }, [state?.success, jobSlug, router])

  if (showSuccess) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for applying for the <strong>{jobTitle}</strong> position.
          We&apos;ll review your application and get back to you soon.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting you back to the job page...
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden job ID */}
      <input type="hidden" name="job_id" value={jobId} />

      {/* Error Alert */}
      {state?.success === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {state.message || 'Failed to submit application. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="applicant_name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="applicant_name"
            name="applicant_name"
            type="text"
            placeholder="Enter your full name"
            required
            disabled={isPending}
          />
          {state?.errors?.applicant_name && (
            <p className="text-sm text-destructive">{state.errors.applicant_name[0]}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="applicant_email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="applicant_email"
            name="applicant_email"
            type="email"
            placeholder="your.email@example.com"
            required
            disabled={isPending}
          />
          {state?.errors?.applicant_email && (
            <p className="text-sm text-destructive">{state.errors.applicant_email[0]}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="applicant_phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="applicant_phone"
            name="applicant_phone"
            type="tel"
            placeholder="+91 98765 43210"
            disabled={isPending}
          />
          {state?.errors?.applicant_phone && (
            <p className="text-sm text-destructive">{state.errors.applicant_phone[0]}</p>
          )}
        </div>
      </div>

      {/* Professional Links */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Professional Links</h3>

        {/* Resume URL */}
        <div className="space-y-2">
          <Label htmlFor="resume_url" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Resume/CV URL
          </Label>
          <Input
            id="resume_url"
            name="resume_url"
            type="url"
            placeholder="https://drive.google.com/your-resume"
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">
            Upload your resume to Google Drive, Dropbox, or any cloud storage and paste the link here
          </p>
          {state?.errors?.resume_url && (
            <p className="text-sm text-destructive">{state.errors.resume_url[0]}</p>
          )}
        </div>

        {/* Portfolio URL */}
        <div className="space-y-2">
          <Label htmlFor="portfolio_url" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Portfolio/Website URL
          </Label>
          <Input
            id="portfolio_url"
            name="portfolio_url"
            type="url"
            placeholder="https://your-portfolio.com"
            disabled={isPending}
          />
          {state?.errors?.portfolio_url && (
            <p className="text-sm text-destructive">{state.errors.portfolio_url[0]}</p>
          )}
        </div>

        {/* LinkedIn URL */}
        <div className="space-y-2">
          <Label htmlFor="linkedin_url" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn Profile URL
          </Label>
          <Input
            id="linkedin_url"
            name="linkedin_url"
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            disabled={isPending}
          />
          {state?.errors?.linkedin_url && (
            <p className="text-sm text-destructive">{state.errors.linkedin_url[0]}</p>
          )}
        </div>
      </div>

      {/* Cover Letter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Cover Letter</h3>

        <div className="space-y-2">
          <Label htmlFor="cover_letter" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Why are you interested in this position?
          </Label>
          <Textarea
            id="cover_letter"
            name="cover_letter"
            placeholder="Tell us about yourself, your experience, and why you'd be a great fit for this role..."
            rows={6}
            disabled={isPending}
          />
          {state?.errors?.cover_letter && (
            <p className="text-sm text-destructive">{state.errors.cover_letter[0]}</p>
          )}
        </div>
      </div>

      {/* Hidden answers field (for custom questions - future use) */}
      <input type="hidden" name="answers" value="{}" />

      {/* Submit Button */}
      <div className="pt-4 border-t">
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Application...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          By submitting this application, you agree to our privacy policy and terms of service.
        </p>
      </div>
    </form>
  )
}
