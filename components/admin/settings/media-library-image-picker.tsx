'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { X, ImageIcon } from 'lucide-react'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import { type MediaItem } from '@/app/actions/cms/media'
import Image from 'next/image'

interface MediaLibraryImagePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  description?: string
  className?: string
  folder?: string
}

export function MediaLibraryImagePicker({
  value,
  onChange,
  label,
  description,
  className,
  folder = 'branding',
}: MediaLibraryImagePickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelect = (media: MediaItem | MediaItem[]) => {
    if (Array.isArray(media)) {
      // Should not happen since we're using single selection
      onChange(media[0]?.file_url || '')
    } else {
      onChange(media.file_url)
    }
    setIsModalOpen(false)
  }

  const handleRemove = () => {
    onChange('')
  }

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
              alt="Selected image"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="flex-1"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Change Image
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        // No image selected
        <div className="space-y-2">
          <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center text-center bg-muted/30">
            <div className="p-3 rounded-full bg-muted mb-4">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No image selected</p>
            <p className="text-xs text-muted-foreground">
              Click below to select from Media Library
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Select from Media Library
          </Button>
        </div>
      )}

      <MediaPickerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelect}
        fileType="image"
        multiple={false}
        currentValue={value}
      />
    </div>
  )
}
