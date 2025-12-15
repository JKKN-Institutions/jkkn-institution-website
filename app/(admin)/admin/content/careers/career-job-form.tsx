'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, Star, AlertCircle, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createCareerJob,
  updateCareerJob,
  type CareerJobWithRelations,
  type JobType,
  type ExperienceLevel,
  type WorkMode,
  type ApplicationMethod,
} from '@/app/actions/cms/careers'
import { type CareerDepartment } from '@/app/actions/cms/career-departments'
import { toast } from 'sonner'

interface CareerJobFormProps {
  job?: CareerJobWithRelations
  departments: CareerDepartment[]
  staffMembers: Array<{
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  }>
}

export function CareerJobForm({
  job,
  departments,
  staffMembers,
}: CareerJobFormProps) {
  const router = useRouter()
  const isEditing = !!job

  // Form state
  const [formData, setFormData] = useState({
    title: job?.title || '',
    slug: job?.slug || '',
    description: job?.description || '',
    content: job?.content ? JSON.stringify(job.content, null, 2) : '{}',
    department_id: job?.department_id || '',
    job_type: job?.job_type || 'full_time',
    experience_level: job?.experience_level || '',
    location: job?.location || '',
    work_mode: job?.work_mode || 'onsite',
    salary_min: job?.salary_min?.toString() || '',
    salary_max: job?.salary_max?.toString() || '',
    salary_currency: job?.salary_currency || 'INR',
    salary_period: job?.salary_period || 'monthly',
    show_salary: job?.show_salary || false,
    benefits: job?.benefits?.join(', ') || '',
    qualifications: job?.qualifications?.join(', ') || '',
    skills_required: job?.skills_required?.join(', ') || '',
    skills_preferred: job?.skills_preferred?.join(', ') || '',
    experience_years_min: job?.experience_years_min?.toString() || '',
    experience_years_max: job?.experience_years_max?.toString() || '',
    deadline: job?.deadline ? job.deadline.split('T')[0] : '',
    positions_available: job?.positions_available?.toString() || '1',
    application_method: job?.application_method || 'internal',
    external_apply_url: job?.external_apply_url || '',
    apply_email: job?.apply_email || '',
    is_featured: job?.is_featured || false,
    is_urgent: job?.is_urgent || false,
    seo_title: job?.seo_title || '',
    seo_description: job?.seo_description || '',
    hiring_manager_id: job?.hiring_manager_id || '',
  })

  // Form actions
  const action = isEditing ? updateCareerJob : createCareerJob
  const [formState, formAction] = useActionState(action, {})

  // Handle form state changes
  useEffect(() => {
    if (formState.success) {
      toast.success(formState.message)
      if (!isEditing && formState.data) {
        router.push(`/admin/content/careers/${formState.data.id}`)
      }
    } else if (formState.message && !formState.success) {
      toast.error(formState.message)
    }
  }, [formState, isEditing, router])

  // Generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        !isEditing && !prev.slug
          ? title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          : prev.slug,
    }))
  }

  return (
    <form action={formAction}>
      {isEditing && <input type="hidden" name="id" value={job.id} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
                {formState.errors?.title && (
                  <p className="text-sm text-destructive">{formState.errors.title[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="senior-software-engineer"
                  required
                />
                {formState.errors?.slug && (
                  <p className="text-sm text-destructive">{formState.errors.slug[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief overview of the position..."
                  rows={3}
                  required
                />
                {formState.errors?.description && (
                  <p className="text-sm text-destructive">{formState.errors.description[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Full Job Description (JSON)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder='{"responsibilities": [], "requirements": []}'
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter JSON object with responsibilities, requirements, etc.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Type *</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, job_type: v as JobType }))}
                    name="job_type"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="visiting">Visiting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select
                    value={formData.experience_level || 'none'}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, experience_level: (v === 'none' ? '' : v) as ExperienceLevel }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Chennai, Tamil Nadu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Work Mode</Label>
                  <Select
                    value={formData.work_mode}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, work_mode: v as WorkMode }))}
                    name="work_mode"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_years_min">Min Experience (years)</Label>
                  <Input
                    id="experience_years_min"
                    name="experience_years_min"
                    type="number"
                    min="0"
                    value={formData.experience_years_min}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience_years_min: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years_max">Max Experience (years)</Label>
                  <Input
                    id="experience_years_max"
                    name="experience_years_max"
                    type="number"
                    min="0"
                    value={formData.experience_years_max}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience_years_max: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="positions_available">Positions Available</Label>
                <Input
                  id="positions_available"
                  name="positions_available"
                  type="number"
                  min="1"
                  value={formData.positions_available}
                  onChange={(e) => setFormData((prev) => ({ ...prev, positions_available: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications *</Label>
                <Textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => setFormData((prev) => ({ ...prev, qualifications: e.target.value }))}
                  placeholder="Bachelor's in Computer Science, Master's preferred (comma-separated)"
                  rows={2}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter qualifications separated by commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills_required">Required Skills *</Label>
                <Textarea
                  id="skills_required"
                  name="skills_required"
                  value={formData.skills_required}
                  onChange={(e) => setFormData((prev) => ({ ...prev, skills_required: e.target.value }))}
                  placeholder="JavaScript, TypeScript, React, Node.js (comma-separated)"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills_preferred">Preferred Skills</Label>
                <Textarea
                  id="skills_preferred"
                  name="skills_preferred"
                  value={formData.skills_preferred}
                  onChange={(e) => setFormData((prev) => ({ ...prev, skills_preferred: e.target.value }))}
                  placeholder="AWS, Docker, Kubernetes (comma-separated)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show_salary">Show Salary</Label>
                <Switch
                  id="show_salary"
                  checked={formData.show_salary}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, show_salary: checked }))}
                />
                <input type="hidden" name="show_salary" value={String(formData.show_salary)} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary_min">Min Salary</Label>
                  <Input
                    id="salary_min"
                    name="salary_min"
                    type="number"
                    min="0"
                    value={formData.salary_min}
                    onChange={(e) => setFormData((prev) => ({ ...prev, salary_min: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary_max">Max Salary</Label>
                  <Input
                    id="salary_max"
                    name="salary_max"
                    type="number"
                    min="0"
                    value={formData.salary_max}
                    onChange={(e) => setFormData((prev) => ({ ...prev, salary_max: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={formData.salary_currency}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, salary_currency: v }))}
                    name="salary_currency"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Salary Period</Label>
                <Select
                  value={formData.salary_period}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, salary_period: v }))}
                  name="salary_period"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Per Month</SelectItem>
                    <SelectItem value="yearly">Per Year</SelectItem>
                    <SelectItem value="hourly">Per Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData((prev) => ({ ...prev, benefits: e.target.value }))}
                  placeholder="Health insurance, PF, Annual bonus (comma-separated)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seo_title: e.target.value }))}
                  placeholder="Leave blank to use job title"
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seo_description: e.target.value }))}
                  placeholder="Leave blank to use job description"
                  rows={2}
                  maxLength={500}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Save Changes' : 'Create Job'}
              </Button>
              {isEditing && job.status === 'published' && (
                <Button type="button" variant="outline" className="w-full" asChild>
                  <a href={`/careers/${job.slug}`} target="_blank" rel="noopener">
                    <Eye className="mr-2 h-4 w-4" />
                    View Live
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Department */}
          <Card>
            <CardHeader>
              <CardTitle>Department</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.department_id || 'none'}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, department_id: v === 'none' ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Hiring Manager */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.hiring_manager_id || 'none'}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, hiring_manager_id: v === 'none' ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not assigned</SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name || staff.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Application Method</Label>
                <Select
                  value={formData.application_method}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, application_method: v as ApplicationMethod }))}
                  name="application_method"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal Form</SelectItem>
                    <SelectItem value="external">External URL</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.application_method === 'external' && (
                <div className="space-y-2">
                  <Label htmlFor="external_apply_url">Application URL</Label>
                  <Input
                    id="external_apply_url"
                    name="external_apply_url"
                    type="url"
                    value={formData.external_apply_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, external_apply_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              )}

              {formData.application_method === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="apply_email">Application Email</Label>
                  <Input
                    id="apply_email"
                    name="apply_email"
                    type="email"
                    value={formData.apply_email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, apply_email: e.target.value }))}
                    placeholder="careers@example.com"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <Label htmlFor="is_featured">Featured Job</Label>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                />
                <input type="hidden" name="is_featured" value={String(formData.is_featured)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <Label htmlFor="is_urgent">Urgent Hiring</Label>
                </div>
                <Switch
                  id="is_urgent"
                  checked={formData.is_urgent}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_urgent: checked }))}
                />
                <input type="hidden" name="is_urgent" value={String(formData.is_urgent)} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
