'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { uploadCourseImage, deleteCourseImage } from '@/app/actions/cms/courses/upload-course-image'
import Image from 'next/image'

interface CourseImageUploaderProps {
  folder: string // e.g., 'courses/be-cse/faculty'
  currentImageUrl?: string
  onImageUploaded?: (url: string) => void
  onImageDeleted?: () => void
  maxSizeMB?: number
}

export function CourseImageUploader({
  folder,
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  maxSizeMB = 10,
}: CourseImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadCourseImage(formData, {
        folder,
        maxSizeMB,
      })

      if (result.success && result.imageUrl) {
        setImageUrl(result.imageUrl)
        setUploadProgress(100)
        onImageUploaded?.(result.imageUrl)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async () => {
    if (!imageUrl || !confirm('Are you sure you want to delete this image?')) return

    try {
      // Extract path from URL
      const url = new URL(imageUrl)
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/media\/(.+)$/)
      const imagePath = pathMatch ? pathMatch[1] : ''

      if (imagePath) {
        await deleteCourseImage(imagePath)
      }

      setImageUrl('')
      onImageDeleted?.()
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete image')
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {imageUrl && (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!imageUrl && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto" />
              <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP, GIF, SVG up to {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Change Image Button */}
      {imageUrl && !isUploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-green-500 hover:text-green-700 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          Change Image
        </button>
      )}
    </div>
  )
}
