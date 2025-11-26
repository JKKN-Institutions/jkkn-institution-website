'use client'

import { useState, useRef, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Camera, Trash2, Loader2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  uploadAvatar,
  deleteAvatar,
  validateAvatarFile,
  ALLOWED_AVATAR_TYPES,
  MAX_AVATAR_SIZE,
} from '@/lib/supabase/storage'
import { toast } from 'sonner'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string | null
  fallbackText: string
  onAvatarChange?: (url: string | null) => void
  disabled?: boolean
  className?: string
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  fallbackText,
  onAvatarChange,
  disabled = false,
  className,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateAvatarFile(file)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }

      setIsUploading(true)
      try {
        const { url, error } = await uploadAvatar(userId, file)

        if (error) {
          toast.error(error)
          return
        }

        if (url) {
          setAvatarUrl(url)
          onAvatarChange?.(url)
          toast.success('Avatar uploaded successfully')
        }
      } catch (error) {
        toast.error('Failed to upload avatar')
        console.error('Avatar upload error:', error)
      } finally {
        setIsUploading(false)
      }
    },
    [userId, onAvatarChange]
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled || isUploading) return

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [disabled, isUploading, handleFileSelect]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDelete = async () => {
    if (!avatarUrl) return

    setIsDeleting(true)
    try {
      const { success, error } = await deleteAvatar(userId)

      if (error) {
        toast.error(error)
        return
      }

      if (success) {
        setAvatarUrl(null)
        onAvatarChange?.(null)
        toast.success('Avatar removed')
      }
    } catch (error) {
      toast.error('Failed to remove avatar')
      console.error('Avatar delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const triggerFileInput = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <Label className="text-foreground font-medium">Profile Photo</Label>

      {/* Avatar with Drop Zone */}
      <div
        className={cn(
          'relative group cursor-pointer',
          isDragging && 'ring-2 ring-primary ring-offset-2 rounded-full',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={avatarUrl || undefined} alt="Profile photo" />
          <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-white">
            {fallbackText}
          </AvatarFallback>
        </Avatar>

        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-black/50 flex items-center justify-center',
            'opacity-0 transition-opacity',
            !disabled && !isUploading && 'group-hover:opacity-100'
          )}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_AVATAR_TYPES.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={disabled || isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {avatarUrl ? 'Change Photo' : 'Upload Photo'}
            </>
          )}
        </Button>

        {avatarUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={disabled || isDeleting}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Remove
              </>
            )}
          </Button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        JPEG, PNG, WebP or GIF. Max {MAX_AVATAR_SIZE / 1024 / 1024}MB.
        <br />
        Drag and drop or click to upload.
      </p>
    </div>
  )
}
