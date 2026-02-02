'use client'

import { useState } from 'react'
import { Control, FieldErrors, UseFormRegister, useFieldArray } from 'react-hook-form'
import {
  Award,
  BookOpen,
  TrendingUp,
  FileText,
  Briefcase,
  Building2,
  Users,
  IndianRupee,
  HelpCircle,
  Settings,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { UGCoursePageProps } from '@/lib/types/course-pages'
import { CourseImageUploader } from '../course-image-uploader'

interface UGCourseEditorProps {
  control: Control<UGCoursePageProps>
  register: UseFormRegister<UGCoursePageProps>
  errors: FieldErrors<UGCoursePageProps>
  courseType: string
}

type TabKey =
  | 'hero'
  | 'overview'
  | 'benefits'
  | 'curriculum'
  | 'specializations'
  | 'career'
  | 'recruiters'
  | 'facilities'
  | 'faculty'
  | 'admission'
  | 'fees'
  | 'faqs'

const TABS = [
  { key: 'hero' as const, label: 'Hero Section', icon: Award },
  { key: 'overview' as const, label: 'Overview', icon: BookOpen },
  { key: 'benefits' as const, label: 'Why Choose', icon: TrendingUp },
  { key: 'curriculum' as const, label: 'Curriculum', icon: FileText },
  { key: 'specializations' as const, label: 'Specializations', icon: Settings },
  { key: 'career' as const, label: 'Career Paths', icon: Briefcase },
  { key: 'recruiters' as const, label: 'Recruiters', icon: Building2 },
  { key: 'facilities' as const, label: 'Facilities', icon: Building2 },
  { key: 'faculty' as const, label: 'Faculty', icon: Users },
  { key: 'admission' as const, label: 'Admission', icon: FileText },
  { key: 'fees' as const, label: 'Fee Structure', icon: IndianRupee },
  { key: 'faqs' as const, label: 'FAQs', icon: HelpCircle },
]

export function UGCourseEditor({ control, register, errors, courseType }: UGCourseEditorProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('hero')

  return (
    <div className="flex gap-6">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            Edit Sections
          </h3>
          {TABS.map(tab => {
            const Icon = tab.icon
            const hasError = errors[tab.key as keyof typeof errors]

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-green-50 text-green-700 border-2 border-green-200'
                    : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
                } ${hasError ? 'border-red-200 bg-red-50' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {hasError && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {activeTab === 'hero' && <HeroSection register={register} errors={errors} control={control} courseType={courseType} />}
        {activeTab === 'overview' && <OverviewSection register={register} errors={errors} control={control} />}
        {activeTab === 'benefits' && <BenefitsSection control={control} errors={errors} />}
        {activeTab === 'curriculum' && <CurriculumSection control={control} errors={errors} />}
        {activeTab === 'specializations' && <SpecializationsSection control={control} errors={errors} />}
        {activeTab === 'career' && <CareerSection control={control} errors={errors} />}
        {activeTab === 'recruiters' && <RecruitersSection control={control} errors={errors} />}
        {activeTab === 'facilities' && <FacilitiesSection control={control} errors={errors} courseType={courseType} />}
        {activeTab === 'faculty' && <FacultySection control={control} errors={errors} courseType={courseType} />}
        {activeTab === 'admission' && <AdmissionSection control={control} errors={errors} />}
        {activeTab === 'fees' && <FeesSection control={control} errors={errors} />}
        {activeTab === 'faqs' && <FAQsSection control={control} errors={errors} />}
      </div>
    </div>
  )
}

// Hero Section Component
function HeroSection({ register, errors, control, courseType }: any) {
  const { fields: statsFields, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: 'heroStats',
  })

  const { fields: ctaFields, append: appendCTA, remove: removeCTA } = useFieldArray({
    control,
    name: 'heroCTAs',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Hero Section</h2>
        <p className="text-sm text-gray-600">Main banner content and call-to-action</p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Hero Title"
          required
          error={errors.heroTitle?.message}
        >
          <input
            {...register('heroTitle')}
            className="form-input"
            placeholder="BE Computer Science and Engineering"
          />
        </FormField>

        <FormField
          label="Hero Subtitle"
          error={errors.heroSubtitle?.message}
        >
          <textarea
            {...register('heroSubtitle')}
            rows={3}
            className="form-input"
            placeholder="Shape the future with cutting-edge technology..."
          />
        </FormField>

        <FormField
          label="Affiliated To"
          required
          error={errors.affiliatedTo?.message}
        >
          <input
            {...register('affiliatedTo')}
            className="form-input"
            placeholder="Affiliated to Anna University | Approved by AICTE"
          />
        </FormField>

        {/* Hero Stats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label">Hero Stats</label>
            <button
              type="button"
              onClick={() => appendStat({ icon: '🏆', label: '', value: '' })}
              className="btn-secondary-sm"
            >
              <Plus className="w-4 h-4" />
              Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {statsFields.map((field, index) => (
              <div key={field.id} className="card-inset">
                <div className="flex items-start gap-3">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <input
                      {...register(`heroStats.${index}.icon`)}
                      className="form-input-sm"
                      placeholder="🏆"
                    />
                    <input
                      {...register(`heroStats.${index}.label`)}
                      className="form-input-sm"
                      placeholder="Placement Rate"
                    />
                    <input
                      {...register(`heroStats.${index}.value`)}
                      className="form-input-sm"
                      placeholder="95%"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="btn-danger-sm mt-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label">Call-to-Action Buttons</label>
            <button
              type="button"
              onClick={() => appendCTA({ label: '', link: '', variant: 'primary' })}
              className="btn-secondary-sm"
            >
              <Plus className="w-4 h-4" />
              Add CTA
            </button>
          </div>

          <div className="space-y-3">
            {ctaFields.map((field, index) => (
              <div key={field.id} className="card-inset">
                <div className="flex items-start gap-3">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <input
                      {...register(`heroCTAs.${index}.label`)}
                      className="form-input-sm"
                      placeholder="Apply Now"
                    />
                    <input
                      {...register(`heroCTAs.${index}.link`)}
                      className="form-input-sm"
                      placeholder="/apply"
                    />
                    <select
                      {...register(`heroCTAs.${index}.variant`)}
                      className="form-input-sm"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCTA(index)}
                    className="btn-danger-sm mt-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image Upload */}
        <FormField label="Hero Background Image">
          <CourseImageUploader
            folder={`courses/${courseType}/hero`}
            currentImageUrl={(control._formValues as any).heroImage}
            onImageUploaded={(url) => {
              // Update form value
              control._formValues.heroImage = url
            }}
          />
        </FormField>
      </div>
    </div>
  )
}

// Overview Section (simplified for brevity)
function OverviewSection({ register, errors, control }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'overviewCards',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Course Overview</h2>
        <p className="text-sm text-gray-600">Key information cards</p>
      </div>

      <FormField label="Overview Title" required error={errors.overviewTitle?.message}>
        <input
          {...register('overviewTitle')}
          className="form-input"
          placeholder="Course at a Glance"
        />
      </FormField>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label">Overview Cards</label>
          <button
            type="button"
            onClick={() => append({ icon: '⏱️', title: '', value: '', description: '' })}
            className="btn-secondary-sm"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="card-inset">
              <div className="flex items-start gap-3">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <input {...register(`overviewCards.${index}.icon`)} className="form-input-sm" placeholder="⏱️" />
                  <input {...register(`overviewCards.${index}.title`)} className="form-input-sm" placeholder="Duration" />
                  <input {...register(`overviewCards.${index}.value`)} className="form-input-sm" placeholder="4 Years" />
                  <input {...register(`overviewCards.${index}.description`)} className="form-input-sm" placeholder="8 Semesters" />
                </div>
                <button type="button" onClick={() => remove(index)} className="btn-danger-sm mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simplified sections for brevity - add similar patterns for other sections
function BenefitsSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">Benefits Section - Add benefits cards here</div>
}

function CurriculumSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">Curriculum Section - Complex curriculum editor</div>
}

function SpecializationsSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">Specializations Section</div>
}

function CareerSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">Career Opportunities Section</div>
}

function RecruitersSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">Top Recruiters Section</div>
}

function FacilitiesSection({ control, errors, courseType }: any) {
  return <div className="text-center py-12 text-gray-500">Facilities & Labs Section</div>
}

function FacultySection({ control, errors, courseType }: any) {
  return <div className="text-center py-12 text-gray-500">Faculty Members Section</div>
}

function AdmissionSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">Admission Process Section</div>
}

function FeesSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">Fee Structure Section</div>
}

function FAQsSection({ control, errors }: any) {
  return <div className="text-center py-12 text-gray-500">FAQs Section</div>
}

// Reusable Form Field Component
function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}
