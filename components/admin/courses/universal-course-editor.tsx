'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Save,
  Eye,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { updateCourseContent } from '@/app/actions/cms/courses/update-course-content'
import {
  UGCoursePagePropsSchema,
  PGCoursePagePropsSchema,
  type UGCoursePageProps,
  type PGCoursePageProps,
} from '@/lib/types/course-pages'
import type { CoursePageData } from '@/app/actions/cms/courses/get-course-by-type'
import { UGCourseEditor } from './editors/ug-course-editor'
import { PGCourseEditor } from './editors/pg-course-editor'

interface UniversalCourseEditorProps {
  course: CoursePageData
}

export function UniversalCourseEditor({ course }: UniversalCourseEditorProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')

  const isUG = course.category === 'undergraduate'
  const schema = isUG ? UGCoursePagePropsSchema : PGCoursePagePropsSchema

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UGCoursePageProps | PGCoursePageProps>({
    resolver: zodResolver(schema) as any,
    defaultValues: course.props,
  })

  const onSubmit = async (data: UGCoursePageProps | PGCoursePageProps) => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const result = await updateCourseContent({
        blockId: course.blockId,
        category: course.category,
        props: data,
        seoMetadata: course.seoMetadata,
      })

      if (result.success) {
        setSaveStatus('success')
        setSaveMessage('Course page saved successfully!')
        reset(data) // Reset form with new values to clear dirty state
        router.refresh()

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        setSaveMessage(result.error || 'Failed to save course page')
      }
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
      setSaveMessage('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    window.open(`/${course.slug}`, '_blank')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isDirty && (
              <span className="text-sm text-amber-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Unsaved changes
              </span>
            )}

            {saveStatus === 'success' && (
              <span className="text-sm text-green-600 flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4" />
                {saveMessage}
              </span>
            )}

            {saveStatus === 'error' && (
              <span className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {saveMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-green-500 hover:text-green-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving || !isDirty}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {isUG ? (
            <UGCourseEditor
              control={control as any}
              register={register as any}
              errors={errors as any}
              courseType={course.courseType}
            />
          ) : (
            <PGCourseEditor
              control={control as any}
              register={register as any}
              errors={errors as any}
              courseType={course.courseType}
            />
          )}
        </form>
      </div>
    </div>
  )
}
