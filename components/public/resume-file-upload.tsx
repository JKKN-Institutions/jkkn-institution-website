'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Upload, File, X, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn, formatBytes } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ResumeFileUploadProps {
  jobId: string
  onUploadSuccess: (fileData: {
    file_path: string
    file_name: string
    file_size: number
    mime_type: string
  }) => void
  disabled?: boolean
}

interface UploadedFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  uploadedPath?: string
}

export function ResumeFileUpload({ jobId, onUploadSuccess, disabled }: ResumeFileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const supabase = createClient()

  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPE = 'application/pdf'

  // Handle file selection/drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]

    // Client-side validation
    if (file.type !== ALLOWED_TYPE) {
      toast.error('Only PDF files are allowed')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('File size must be less than 10MB')
      return
    }

    setUploadedFile({ file, status: 'pending' })
  }, [MAX_SIZE])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    multiple: false,
    disabled,
  })

  // Upload to Supabase Storage
  const handleUpload = async () => {
    if (!uploadedFile || uploadedFile.status !== 'pending') return

    setUploadedFile({ ...uploadedFile, status: 'uploading' })

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const uuid = crypto.randomUUID().slice(0, 8)
      const fileName = `${timestamp}_${uuid}.pdf`
      const filePath = `${jobId}/${fileName}`

      // Upload to storage
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, uploadedFile.file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Success
      setUploadedFile({
        ...uploadedFile,
        status: 'success',
        uploadedPath: data.path,
      })

      // Notify parent
      onUploadSuccess({
        file_path: data.path,
        file_name: uploadedFile.file.name,
        file_size: uploadedFile.file.size,
        mime_type: uploadedFile.file.type,
      })

      toast.success('Resume uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      setUploadedFile({
        ...uploadedFile,
        status: 'error',
        error: 'Failed to upload file',
      })
      toast.error('Failed to upload resume. Please try again.')
    }
  }

  // Remove file
  const handleRemove = () => {
    setUploadedFile(null)
    onUploadSuccess({
      file_path: '',
      file_name: '',
      file_size: 0,
      mime_type: '',
    })
  }

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        // Dropzone
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-muted mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            {isDragActive ? (
              <p className="text-sm font-medium text-primary">Drop your resume here...</p>
            ) : (
              <>
                <p className="text-sm font-medium">Drag & drop your resume</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                <p className="text-xs text-muted-foreground/70 mt-3">PDF only, max 10MB</p>
              </>
            )}
          </div>
        </div>
      ) : (
        // File preview
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border',
            uploadedFile.status === 'error' && 'border-destructive bg-destructive/5',
            uploadedFile.status === 'success' && 'border-green-500 bg-green-500/5'
          )}
        >
          {/* PDF Icon */}
          <div className="h-10 w-10 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
            <File className="h-5 w-5 text-red-600" />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(uploadedFile.file.size)}
            </p>
            {uploadedFile.status === 'error' && (
              <p className="text-xs text-destructive mt-1">{uploadedFile.error}</p>
            )}
          </div>

          {/* Status/Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {uploadedFile.status === 'pending' && (
              <>
                <Button type="button" variant="ghost" size="icon" onClick={handleRemove}>
                  <X className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" onClick={handleUpload} disabled={disabled}>
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </>
            )}
            {uploadedFile.status === 'uploading' && (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
            {uploadedFile.status === 'success' && (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                  Change
                </Button>
              </>
            )}
            {uploadedFile.status === 'error' && (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                  Remove
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
