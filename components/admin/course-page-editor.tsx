'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Trash2, Save, ChevronDown, ChevronUp, GripVertical,
  BookOpen, Users, Briefcase, Building2, IndianRupee, Award,
  FileText, HelpCircle, TrendingUp, Settings as SettingsIcon
} from 'lucide-react'
import { BEMechanicalCoursePagePropsSchema, type BEMechanicalCoursePageProps } from '@/components/cms-blocks/content/be-mechanical-course-page'

interface CoursePageEditorProps {
  initialData?: BEMechanicalCoursePageProps
  onSave: (data: BEMechanicalCoursePageProps) => Promise<void>
  isSaving?: boolean
}

type TabKey = 'hero' | 'overview' | 'benefits' | 'curriculum' | 'specializations' | 'career' | 'recruiters' | 'facilities' | 'faculty' | 'admission' | 'fees' | 'faqs' | 'placement' | 'styling'

const TABS: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
  { key: 'hero', label: 'Hero Section', icon: <Award className="w-4 h-4" /> },
  { key: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'benefits', label: 'Why Choose', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'curriculum', label: 'Curriculum', icon: <FileText className="w-4 h-4" /> },
  { key: 'specializations', label: 'Specializations', icon: <SettingsIcon className="w-4 h-4" /> },
  { key: 'career', label: 'Career Paths', icon: <Briefcase className="w-4 h-4" /> },
  { key: 'recruiters', label: 'Recruiters', icon: <Building2 className="w-4 h-4" /> },
  { key: 'facilities', label: 'Facilities', icon: <Building2 className="w-4 h-4" /> },
  { key: 'faculty', label: 'Faculty', icon: <Users className="w-4 h-4" /> },
  { key: 'admission', label: 'Admission', icon: <FileText className="w-4 h-4" /> },
  { key: 'fees', label: 'Fee Structure', icon: <IndianRupee className="w-4 h-4" /> },
  { key: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-4 h-4" /> },
  { key: 'placement', label: 'Placement Stats', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'styling', label: 'Colors & Styling', icon: <SettingsIcon className="w-4 h-4" /> },
]

export function CoursePageEditor({ initialData, onSave, isSaving }: CoursePageEditorProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('hero')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BEMechanicalCoursePageProps>({
    resolver: zodResolver(BEMechanicalCoursePagePropsSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: BEMechanicalCoursePageProps) => {
    await onSave(data)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar Tabs */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Edit Sections
          </h3>
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Save Button (Fixed at top) */}
          <div className="sticky top-0 z-10 bg-gray-50 pb-4 mb-6 border-b border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === 'hero' && <HeroSection register={register} errors={errors} control={control} />}
            {activeTab === 'overview' && <OverviewSection register={register} errors={errors} control={control} />}
            {activeTab === 'benefits' && <BenefitsSection control={control} errors={errors} />}
            {activeTab === 'curriculum' && <CurriculumSection control={control} errors={errors} />}
            {activeTab === 'specializations' && <SpecializationsSection control={control} errors={errors} />}
            {activeTab === 'career' && <CareerSection control={control} errors={errors} />}
            {activeTab === 'recruiters' && <RecruitersSection control={control} errors={errors} />}
            {activeTab === 'facilities' && <FacilitiesSection control={control} errors={errors} />}
            {activeTab === 'faculty' && <FacultySection control={control} errors={errors} />}
            {activeTab === 'admission' && <AdmissionSection control={control} errors={errors} />}
            {activeTab === 'fees' && <FeesSection control={control} errors={errors} />}
            {activeTab === 'faqs' && <FAQsSection control={control} errors={errors} />}
            {activeTab === 'placement' && <PlacementSection control={control} errors={errors} />}
            {activeTab === 'styling' && <StylingSection register={register} errors={errors} />}
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// Section Components
// ============================================

function HeroSection({ register, errors, control }: any) {
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
      <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Title *
        </label>
        <input
          {...register('heroTitle')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="BE Mechanical Engineering"
        />
        {errors.heroTitle && (
          <p className="mt-1 text-sm text-red-600">{errors.heroTitle.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Subtitle
        </label>
        <textarea
          {...register('heroSubtitle')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Engineering excellence in mechanical systems..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Affiliated To *
        </label>
        <input
          {...register('affiliatedTo')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Affiliated to Anna University | Approved by AICTE"
        />
      </div>

      {/* Hero Stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Hero Stats</label>
          <button
            type="button"
            onClick={() => appendStat({ icon: '🏆', label: '', value: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Stat
          </button>
        </div>

        <div className="space-y-3">
          {statsFields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="grid grid-cols-3 gap-3 flex-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                    <input
                      {...register(`heroStats.${index}.icon`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="🏆"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                    <input
                      {...register(`heroStats.${index}.label`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="Placement Rate"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                    <input
                      {...register(`heroStats.${index}.value`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="95%"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero CTAs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Call-to-Action Buttons</label>
          <button
            type="button"
            onClick={() => appendCTA({ label: '', link: '', variant: 'primary' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add CTA
          </button>
        </div>

        <div className="space-y-3">
          {ctaFields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="grid grid-cols-3 gap-3 flex-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                    <input
                      {...register(`heroCTAs.${index}.label`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="Apply Now"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link</label>
                    <input
                      {...register(`heroCTAs.${index}.link`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="/apply"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Variant</label>
                    <select
                      {...register(`heroCTAs.${index}.variant`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCTA(index)}
                  className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
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

function OverviewSection({ register, errors, control }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'overviewCards',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Course Overview</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overview Title *
        </label>
        <input
          {...register('overviewTitle')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Course at a Glance"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Overview Cards</label>
          <button
            type="button"
            onClick={() => append({ icon: '⏱️', title: '', value: '', description: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                    <input
                      {...register(`overviewCards.${index}.icon`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="⏱️"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      {...register(`overviewCards.${index}.title`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="Duration"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                    <input
                      {...register(`overviewCards.${index}.value`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="4 Years"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <input
                      {...register(`overviewCards.${index}.description`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="8 Semesters"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
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

function BenefitsSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'benefits',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Why Choose This Program</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Benefits</label>
          <button
            type="button"
            onClick={() => append({ icon: '✨', title: '', description: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Benefit
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`benefits.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <input
                          value={formField.value.icon || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, icon: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="✨"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          value={formField.value.title || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, title: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Industry-Aligned Curriculum"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={formField.value.description || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Describe the benefit..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CurriculumSection({ control, errors }: any) {
  const { fields: yearFields } = useFieldArray({
    control,
    name: 'curriculumYears',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Curriculum</h2>
      <p className="text-sm text-gray-600">
        Note: Curriculum editing is complex. Use the JSON editor or contact admin for bulk updates.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Pro Tip:</strong> For detailed curriculum editing with subjects and credits,
          use the advanced JSON editor or the dedicated curriculum management module.
        </p>
      </div>

      {yearFields.map((field: any, yearIndex: number) => (
        <div key={field.id} className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Year {yearIndex + 1}</h3>
          <p className="text-sm text-gray-600">
            {field.semesters?.length || 0} semesters configured
          </p>
        </div>
      ))}
    </div>
  )
}

function SpecializationsSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specializations',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Specializations</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Specialization Tracks</label>
          <button
            type="button"
            onClick={() => append({ title: '', description: '', icon: '🔧' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Specialization
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`specializations.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                          <input
                            value={formField.value.icon || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, icon: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="🔧"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                          <input
                            value={formField.value.title || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, title: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Thermal Engineering"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={formField.value.description || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Focus on heat transfer, refrigeration..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CareerSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'careerPaths',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Career Opportunities</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Career Paths</label>
          <button
            type="button"
            onClick={() => append({ icon: '💼', title: '', description: '', avgSalary: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Career Path
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`careerPaths.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                          <input
                            value={formField.value.icon || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, icon: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="💼"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                          <input
                            value={formField.value.title || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, title: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Mechanical Design Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Avg Salary</label>
                          <input
                            value={formField.value.avgSalary || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, avgSalary: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="4-8 LPA"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={formField.value.description || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Design and develop mechanical systems..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RecruitersSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recruiters',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Top Recruiters</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Company Names</label>
          <button
            type="button"
            onClick={() => append('')}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`recruiters.${index}`}
              render={({ field: formField }) => (
                <div className="flex items-center gap-2">
                  <input
                    value={formField.value || ''}
                    onChange={(e) => formField.onChange(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="Company Name"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FacilitiesSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'facilities',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Facilities & Labs</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Facilities</label>
          <button
            type="button"
            onClick={() => append({ name: '', description: '', image: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Facility
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`facilities.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Facility Name</label>
                        <input
                          value={formField.value.name || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, name: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="CAD/CAM Laboratory"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={formField.value.description || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="State-of-the-art computer-aided design..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                        <input
                          value={formField.value.image || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, image: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FacultySection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'faculty',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Faculty Members</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Faculty</label>
          <button
            type="button"
            onClick={() => append({ name: '', designation: '', qualification: '', specialization: '', image: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Faculty
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`faculty.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                          <input
                            value={formField.value.name || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, name: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Dr. Rajesh Kumar"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Designation</label>
                          <input
                            value={formField.value.designation || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, designation: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Professor & Head"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Qualification</label>
                          <input
                            value={formField.value.qualification || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, qualification: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Ph.D. in Mechanical Engineering"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Specialization</label>
                          <input
                            value={formField.value.specialization || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, specialization: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Thermal Engineering"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                        <input
                          value={formField.value.image || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, image: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AdmissionSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'admissionSteps',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admission Process</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Admission Steps</label>
          <button
            type="button"
            onClick={() => append({ step: fields.length + 1, title: '', description: '', icon: '📝' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`admissionSteps.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Step Number</label>
                          <input
                            type="number"
                            value={formField.value.step || index + 1}
                            onChange={(e) => formField.onChange({ ...formField.value, step: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                          <input
                            value={formField.value.title || ''}
                            onChange={(e) => formField.onChange({ ...formField.value, title: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Check Eligibility"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={formField.value.description || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="10+2 with PCM (50% aggregate)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <input
                          value={formField.value.icon || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, icon: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="📝"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeesSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'feeBreakdown',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Fee Structure</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Fee Components</label>
          <button
            type="button"
            onClick={() => append({ component: '', amount: '', isTotal: false })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Component
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`feeBreakdown.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Component</label>
                        <input
                          value={formField.value.component || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, component: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Tuition Fee"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                        <input
                          value={formField.value.amount || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, amount: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="₹75,000"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formField.value.isTotal || false}
                            onChange={(e) => formField.onChange({ ...formField.value, isTotal: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-gray-700">Is Total Row</span>
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FAQsSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'faqs',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">FAQs</label>
          <button
            type="button"
            onClick={() => append({ question: '', answer: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`faqs.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                        <input
                          value={formField.value.question || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, question: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="What is the eligibility criteria?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                        <textarea
                          value={formField.value.answer || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, answer: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Candidates must have passed 10+2 with PCM..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PlacementSection({ control, errors }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'placementStats',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Placement Statistics</h2>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Placement Stats</label>
          <button
            type="button"
            onClick={() => append({ icon: '📊', label: '', value: '', description: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Stat
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <Controller
              key={field.id}
              control={control}
              name={`placementStats.${index}`}
              render={({ field: formField }) => (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <input
                          value={formField.value.icon || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, icon: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="📊"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                        <input
                          value={formField.value.label || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, label: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Placement Rate"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                        <input
                          value={formField.value.value || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, value: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="95.2%"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <input
                          value={formField.value.description || ''}
                          onChange={(e) => formField.onChange({ ...formField.value, description: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Students placed in 2023-24"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StylingSection({ register, errors }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Colors & Styling</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register('primaryColor')}
              className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              {...register('primaryColor')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="#0b6d41"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Used for headings, buttons, and accents
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register('accentColor')}
              className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              {...register('accentColor')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="#ff6b35"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Used for highlights and CTAs
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Color Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use JKKN brand green (#0b6d41) for primary color</li>
          <li>• Use complementary orange (#ff6b35) for accent highlights</li>
          <li>• Ensure sufficient contrast for accessibility (WCAG AA)</li>
          <li>• Test colors on both light and dark backgrounds</li>
        </ul>
      </div>
    </div>
  )
}
