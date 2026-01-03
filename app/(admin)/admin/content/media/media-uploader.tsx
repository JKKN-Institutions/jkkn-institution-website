'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Upload,
  File,
  ImageIcon,
  FileVideo,
  FileAudio,
  X,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn, formatBytes } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { uploadMediaBatch } from '@/app/actions/cms/media'
import { getMediaBucket } from '@/lib/config/multi-tenant'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

interface MediaUploaderProps {
  folders: string[]
  onSuccess: () => void
}

interface UploadFile {
  id: string
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  uploadedUrl?: string
  uploadedPath?: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  'video/*': ['.mp4', '.webm', '.mov'],
  'audio/*': ['.mp3', '.wav', '.ogg'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

function getFileType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  return 'document'
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon
  if (mimeType.startsWith('video/')) return FileVideo
  return File
}

export function MediaUploader({ folders, onSuccess }: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [selectedFolder, setSelectedFolder] = useState('general')
  const [newFolder, setNewFolder] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const supabase = createClient()

  // Handle dropped files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      progress: 0,
      status: 'pending',
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    onDropRejected: (rejections) => {
      rejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            toast.error(`${rejection.file.name} is too large. Max size is 50MB.`)
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${rejection.file.name} is not a supported file type.`)
          }
        })
      })
    },
  })

  // Remove a file from the list
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  // Upload all files
  const handleUpload = async () => {
    if (files.length === 0) return

    const folder = newFolder || selectedFolder
    setIsUploading(true)

    // Upload to Supabase Storage
    const uploadedItems: Array<{
      file_name: string
      original_name: string
      file_path: string
      file_url: string
      file_type: string
      mime_type: string
      file_size: number
      width?: number
      height?: number
      folder: string
    }> = []

    for (const uploadFile of files) {
      if (uploadFile.status === 'success') continue

      try {
        // Update status to uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 10 } : f
          )
        )

        // Generate unique file name
        const ext = uploadFile.file.name.split('.').pop()
        const fileName = `${uuidv4()}.${ext}`
        const filePath = `${folder}/${fileName}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(getMediaBucket())
          .upload(filePath, uploadFile.file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (error) throw error

        // Update progress
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 70 } : f))
        )

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(getMediaBucket()).getPublicUrl(data.path)

        // Get image dimensions if applicable
        let width: number | undefined
        let height: number | undefined

        if (uploadFile.file.type.startsWith('image/')) {
          const dimensions = await getImageDimensions(uploadFile.file)
          width = dimensions.width
          height = dimensions.height
        }

        // Add to uploaded items
        uploadedItems.push({
          file_name: fileName,
          original_name: uploadFile.file.name,
          file_path: data.path,
          file_url: publicUrl,
          file_type: getFileType(uploadFile.file.type),
          mime_type: uploadFile.file.type,
          file_size: uploadFile.file.size,
          width,
          height,
          folder,
        })

        // Update status to success
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: 'success',
                  progress: 100,
                  uploadedUrl: publicUrl,
                  uploadedPath: data.path,
                }
              : f
          )
        )
      } catch (error) {
        console.error('Upload error:', error)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: 'error', error: 'Failed to upload' }
              : f
          )
        )
      }
    }

    // Save metadata to database
    if (uploadedItems.length > 0) {
      try {
        const result = await uploadMediaBatch(uploadedItems)
        if (result.success) {
          toast.success(`${uploadedItems.length} files uploaded successfully`)
          // Clean up and close
          files.forEach((f) => {
            if (f.preview) URL.revokeObjectURL(f.preview)
          })
          setFiles([])
          onSuccess()
        } else {
          toast.error(result.message || 'Failed to save file metadata')
        }
      } catch {
        toast.error('An error occurred while saving files')
      }
    }

    setIsUploading(false)
  }

  // Get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = () => {
        resolve({ width: 0, height: 0 })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // Count files by status
  const pendingCount = files.filter((f) => f.status === 'pending').length
  const successCount = files.filter((f) => f.status === 'success').length
  const errorCount = files.filter((f) => f.status === 'error').length

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-full bg-muted mb-4">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          {isDragActive ? (
            <p className="text-sm font-medium text-primary">Drop files here...</p>
          ) : (
            <>
              <p className="text-sm font-medium">Drag & drop files here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse (max 50MB per file)
              </p>
              {/* Supported file types */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  <span>Images</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileVideo className="h-4 w-4 text-purple-500" />
                  <span>Videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileAudio className="h-4 w-4 text-green-500" />
                  <span>Audio</span>
                </div>
                <div className="flex items-center gap-1">
                  <File className="h-4 w-4 text-amber-500" />
                  <span>Documents</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-2">
                Supported: JPG, PNG, GIF, WebP, MP4, WebM, MOV, MP3, WAV, PDF, DOC, DOCX
              </p>
            </>
          )}
        </div>
      </div>

      {/* Folder selection */}
      {files.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Label>Upload to folder</Label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {folder}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label>Or create new folder</Label>
            <Input
              placeholder="New folder name"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="max-h-48 overflow-y-auto border rounded-lg">
          <div className="space-y-2 p-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.file.type)

              return (
                <div
                  key={file.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    file.status === 'error' && 'border-destructive bg-destructive/5',
                    file.status === 'success' && 'border-green-500 bg-green-500/5'
                  )}
                >
                  {/* Preview/Icon */}
                  <div className="relative h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                    {file.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.file.size)}
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1 mt-1" />
                    )}
                    {file.status === 'error' && (
                      <p className="text-xs text-destructive mt-1">{file.error}</p>
                    )}
                  </div>

                  {/* Status/Actions */}
                  <div className="flex-shrink-0">
                    {file.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {file.status === 'uploading' && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                    {file.status === 'success' && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
            {successCount > 0 && <span className="text-green-500"> &bull; {successCount} uploaded</span>}
            {errorCount > 0 && <span className="text-destructive"> &bull; {errorCount} failed</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                files.forEach((f) => {
                  if (f.preview) URL.revokeObjectURL(f.preview)
                })
                setFiles([])
              }}
              disabled={isUploading}
            >
              Clear All
            </Button>
            <Button onClick={handleUpload} disabled={pendingCount === 0 || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {pendingCount} File{pendingCount !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
