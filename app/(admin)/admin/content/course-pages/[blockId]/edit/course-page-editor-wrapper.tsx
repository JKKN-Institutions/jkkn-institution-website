'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CoursePageEditor } from '@/components/admin/course-page-editor'
import { updateCoursePageContent } from '@/app/actions/cms/course-pages'
import type { BEMechanicalCoursePageProps } from '@/components/cms-blocks/content/be-mechanical-course-page'
import { CheckCircle, XCircle } from 'lucide-react'

interface CoursePageEditorWrapperProps {
  blockId: string
  initialData: BEMechanicalCoursePageProps
}

export function CoursePageEditorWrapper({
  blockId,
  initialData,
}: CoursePageEditorWrapperProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const handleSave = async (data: BEMechanicalCoursePageProps) => {
    setIsSaving(true)
    setSaveStatus(null)

    try {
      const result = await updateCoursePageContent(blockId, data)

      if (result.success) {
        setSaveStatus({
          type: 'success',
          message: 'Course page updated successfully!',
        })

        // Refresh the page data
        router.refresh()

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus(null)
        }, 3000)
      } else {
        setSaveStatus({
          type: 'error',
          message: result.error || 'Failed to save changes',
        })
      }
    } catch (error) {
      console.error('Error saving course page:', error)
      setSaveStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Status Message */}
      {saveStatus && (
        <div
          className={`px-6 py-3 flex items-center gap-3 ${
            saveStatus.type === 'success'
              ? 'bg-green-50 border-b border-green-200'
              : 'bg-red-50 border-b border-red-200'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {saveStatus.message}
          </span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CoursePageEditor
          initialData={initialData}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}
