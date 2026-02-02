'use client'

import { useState } from 'react'
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { PGCoursePageProps } from '@/lib/types/course-pages'

interface PGCourseEditorProps {
  control: Control<PGCoursePageProps>
  register: UseFormRegister<PGCoursePageProps>
  errors: FieldErrors<PGCoursePageProps>
  courseType: string
}

export function PGCourseEditor({ control, register, errors, courseType }: PGCourseEditorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PG Course Editor</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Postgraduate course editor with nested structure for ME/MBA programs.
          Similar to UG editor but with specialized sections for research, labs, and advanced topics.
        </p>
      </div>
    </div>
  )
}
