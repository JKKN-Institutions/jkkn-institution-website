'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  description?: string
  accept?: string
  maxSize?: number // in MB
  bucket?: string
  folder?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  label,
  description,
  accept = 'image/*',
  maxSize = 2, // 2MB default
  bucket = 'cms-media',
  folder = 'images',
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const supabase = createClient()

  const handleUpload = useCallback(
    async (file: File) => {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSize}MB`)
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setIsUploading(true)

      try {
        // Generate unique filename
        const ext = file.name.split('.').pop()
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (error) {
          throw error
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path)

        onChange(urlData.publicUrl)
        toast.success('Image uploaded successfully')
      } catch (error: unknown) {
        console.error('Upload error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
        toast.error(errorMessage)
      } finally {
        setIsUploading(false)
      }
    },
    [bucket, folder, maxSize, onChange, supabase.storage]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleUpload(file)
      }
    },
    [handleUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleUpload(file)
      }
    },
    [handleUpload]
  )

  const handleRemove = useCallback(async () => {
    if (!value) return

    try {
      // Extract path from URL
      const url = new URL(value)
      const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`)
      if (pathParts[1]) {
        await supabase.storage.from(bucket).remove([pathParts[1]])
      }
    } catch (error) {
      console.error('Error removing file:', error)
    }

    onChange('')
    toast.success('Image removed')
  }, [bucket, onChange, supabase.storage, value])

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div>
          <Label>{label}</Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {value ? (
        // Image preview
        <div className="relative group">
          <div className="relative aspect-video rounded-xl border overflow-hidden bg-muted">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Upload area
        <div
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 transition-colors',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            isUploading && 'pointer-events-none opacity-50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
                <p className="text-sm font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-muted mb-4">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">
                  Drop an image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF, WebP up to {maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
