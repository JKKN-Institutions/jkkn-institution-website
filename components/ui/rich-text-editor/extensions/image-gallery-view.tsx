'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Images,
  Edit2,
  Trash2,
  Plus,
  LayoutGrid,
  GalleryHorizontal,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GalleryImage } from './image-gallery'

interface ImageGalleryViewProps extends NodeViewProps {
  onAddImages?: () => void
}

export function ImageGalleryView({
  node,
  updateAttributes,
  deleteNode,
  selected,
  extension,
}: ImageGalleryViewProps) {
  const { images, layout, columns } = node.attrs as {
    images: GalleryImage[]
    layout: 'carousel' | 'grid'
    columns: number
  }
  const [isEditing, setIsEditing] = useState(false)
  const [editingCaption, setEditingCaption] = useState<number | null>(null)
  const [captionValue, setCaptionValue] = useState('')

  // Start editing a caption
  const startEditingCaption = (index: number) => {
    setEditingCaption(index)
    setCaptionValue(images[index]?.caption || '')
  }

  // Save caption
  const saveCaption = () => {
    if (editingCaption !== null) {
      const updatedImages = [...images]
      updatedImages[editingCaption] = {
        ...updatedImages[editingCaption],
        caption: captionValue,
      }
      updateAttributes({ images: updatedImages })
      setEditingCaption(null)
      setCaptionValue('')
    }
  }

  // Remove image from gallery
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    updateAttributes({ images: updatedImages })
  }

  // Get the onAddImages callback from extension storage
  const handleAddImages = () => {
    const callback = extension.storage?.onAddImages
    if (callback) {
      callback((newImages: GalleryImage[]) => {
        updateAttributes({ images: [...images, ...newImages] })
      })
    }
  }

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={cn(
          'relative rounded-lg border-2 p-4',
          selected
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-dashed border-muted-foreground/30'
        )}
      >
        {/* Gallery Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Images className="h-4 w-4" />
            <span>Image Gallery ({images.length} images)</span>
            <span className="px-2 py-0.5 bg-muted rounded text-xs flex items-center gap-1">
              {layout === 'carousel' ? (
                <>
                  <GalleryHorizontal className="h-3 w-3" />
                  Carousel
                </>
              ) : (
                <>
                  <LayoutGrid className="h-3 w-3" />
                  Grid {columns}x
                </>
              )}
            </span>
          </div>

          {/* Edit Controls */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleAddImages}
              title="Add more images"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Popover open={isEditing} onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Layout</Label>
                    <Select
                      value={layout}
                      onValueChange={(value: 'carousel' | 'grid') =>
                        updateAttributes({ layout: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carousel">
                          <div className="flex items-center gap-2">
                            <GalleryHorizontal className="h-4 w-4" />
                            Carousel
                          </div>
                        </SelectItem>
                        <SelectItem value="grid">
                          <div className="flex items-center gap-2">
                            <LayoutGrid className="h-4 w-4" />
                            Grid
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {layout === 'grid' && (
                    <div className="space-y-2">
                      <Label>Columns</Label>
                      <Select
                        value={String(columns)}
                        onValueChange={(value) =>
                          updateAttributes({ columns: parseInt(value, 10) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => deleteNode()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Gallery Preview Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded overflow-hidden bg-muted group"
              >
                <Image
                  src={img.src}
                  alt={img.alt || ''}
                  fill
                  className="object-cover"
                />

                {/* Image overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEditingCaption(idx)}
                    className="text-white text-xs hover:underline"
                  >
                    {img.caption ? 'Edit Caption' : 'Add Caption'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-red-400 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {/* Caption indicator */}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <Images className="h-8 w-8 mx-auto mb-2" />
            <p>No images yet. Click + to add images.</p>
          </div>
        )}

        {/* Caption Editor Modal */}
        {editingCaption !== null && (
          <div className="absolute inset-0 bg-background/95 rounded-lg flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-4">
              <div className="flex items-center justify-between">
                <Label>Edit Caption</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setEditingCaption(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={captionValue}
                onChange={(e) => setCaptionValue(e.target.value)}
                placeholder="Enter image caption..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    saveCaption()
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={saveCaption}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingCaption(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
