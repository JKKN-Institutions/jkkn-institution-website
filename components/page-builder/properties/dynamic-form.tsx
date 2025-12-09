'use client'

import { useCallback, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Image as ImageIcon, X, Check } from 'lucide-react'
import type { ComponentRegistryEntry } from '@/lib/cms/registry-types'
import { BRAND_COLORS, BRAND_GRADIENTS, type BrandColor } from '@/lib/cms/brand-colors'
import { isGoogleDriveUrl, convertToGoogleDriveImageUrl, convertToGoogleDriveVideoUrl, GOOGLE_DRIVE_INSTRUCTIONS } from '@/lib/utils/google-drive'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import type { MediaItem } from '@/app/actions/cms/media'

interface DynamicFormProps {
  componentEntry: ComponentRegistryEntry
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
}

interface FieldConfig {
  key: string
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'color' | 'url' | 'image' | 'video' | 'media'
  label: string
  description?: string
  required?: boolean
  defaultValue?: unknown
  options?: string[]
  min?: number
  max?: number
  step?: number
  multiline?: boolean
  placeholder?: string
  /** For array type: what kind of items (string, image, object) */
  itemType?: 'string' | 'image' | 'object'
  /** For array type with object items: the schema of each item */
  itemSchema?: {
    properties: Record<string, {
      type: string
      label?: string
      required?: boolean
      format?: string
    }>
    required?: string[]
  }
}

// Helper to convert camelCase/snake_case to Title Case
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

// Field renderer components
interface FieldProps {
  config: FieldConfig
  value: unknown
  onChange: (value: unknown) => void
}

function StringField({ config, value, onChange }: FieldProps) {
  const stringValue = (value as string) || ''

  if (config.multiline) {
    return (
      <Textarea
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}...`}
        rows={3}
        className="bg-background/50 border-border/50"
      />
    )
  }

  return (
    <Input
      type={config.type === 'url' ? 'url' : 'text'}
      value={stringValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}...`}
      className="bg-background/50 border-border/50"
    />
  )
}

function NumberField({ config, value, onChange }: FieldProps) {
  const numValue = typeof value === 'number' ? value : (config.defaultValue as number) ?? 0

  // Use slider for bounded values
  if (config.min !== undefined && config.max !== undefined) {
    return (
      <div className="flex items-center gap-4">
        <Slider
          value={[numValue]}
          onValueChange={([v]) => onChange(v)}
          min={config.min}
          max={config.max}
          step={config.step ?? (config.max <= 1 ? 0.1 : 1)}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-12 text-right">
          {numValue}
        </span>
      </div>
    )
  }

  return (
    <Input
      type="number"
      value={numValue}
      onChange={(e) => onChange(Number(e.target.value))}
      min={config.min}
      max={config.max}
      step={config.step}
      className="bg-background/50 border-border/50"
    />
  )
}

function BooleanField({ config, value, onChange }: FieldProps) {
  const boolValue = typeof value === 'boolean' ? value : (config.defaultValue as boolean) ?? false

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={config.key} className="text-sm cursor-pointer">
        {config.label}
      </Label>
      <Switch
        id={config.key}
        checked={boolValue}
        onCheckedChange={onChange}
      />
    </div>
  )
}

function EnumField({ config, value, onChange }: FieldProps) {
  const enumValue = (value as string) || (config.defaultValue as string) || config.options?.[0] || ''

  return (
    <Select value={enumValue} onValueChange={onChange}>
      <SelectTrigger className="bg-background/50 border-border/50">
        <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {config.options?.map((option) => (
          <SelectItem key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * Enhanced Color Field with Brand Color Swatches
 * Shows brand colors organized by category for quick selection
 */
function ColorField({ config, value, onChange }: FieldProps) {
  const colorValue = (value as string) || '#000000'

  // Group brand colors by category
  const primaryColors = BRAND_COLORS.filter(c => c.category === 'primary')
  const secondaryColors = BRAND_COLORS.filter(c => c.category === 'secondary')
  const neutralColors = BRAND_COLORS.filter(c => c.category === 'neutral')

  const ColorSwatch = ({ color, isSelected }: { color: BrandColor; isSelected: boolean }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onChange(color.value)}
            className={cn(
              'w-7 h-7 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
              'hover:scale-110 hover:shadow-md',
              isSelected
                ? 'border-foreground ring-2 ring-offset-1 ring-primary/50'
                : 'border-transparent hover:border-border'
            )}
            style={{ backgroundColor: color.value }}
          >
            {isSelected && (
              <Check
                className={cn(
                  'h-4 w-4',
                  // Use contrasting color for checkmark
                  ['#ffffff', '#fbfbee', '#f8f9fa', '#fff0a3', '#ffde59', '#e5e5e5'].includes(color.value)
                    ? 'text-gray-800'
                    : 'text-white'
                )}
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p className="font-medium">{color.name}</p>
          <p className="text-muted-foreground">{color.value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="space-y-3">
      {/* Brand Color Swatches */}
      <div className="space-y-2">
        {/* Primary Colors */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground w-16 flex-shrink-0">
            Primary
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {primaryColors.map((color) => (
              <ColorSwatch
                key={color.value}
                color={color}
                isSelected={colorValue.toLowerCase() === color.value.toLowerCase()}
              />
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground w-16 flex-shrink-0">
            Accent
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {secondaryColors.map((color) => (
              <ColorSwatch
                key={color.value}
                color={color}
                isSelected={colorValue.toLowerCase() === color.value.toLowerCase()}
              />
            ))}
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground w-16 flex-shrink-0">
            Neutral
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {neutralColors.map((color) => (
              <ColorSwatch
                key={color.value}
                color={color}
                isSelected={colorValue.toLowerCase() === color.value.toLowerCase()}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Custom Color Picker */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={colorValue}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 rounded-md border border-border cursor-pointer opacity-0 absolute inset-0"
          />
          <div
            className="h-9 w-9 rounded-md border border-border"
            style={{ backgroundColor: colorValue }}
          />
        </div>
        <Input
          type="text"
          value={colorValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 bg-background/50 border-border/50 font-mono text-sm"
        />
      </div>
    </div>
  )
}

/**
 * Gradient Field for selecting brand gradients
 */
function GradientField({ config, value, onChange }: FieldProps) {
  const gradientValue = (value as string) || ''

  return (
    <div className="space-y-3">
      {/* Gradient Presets */}
      <div className="grid grid-cols-3 gap-2">
        {BRAND_GRADIENTS.map((gradient) => {
          const isSelected = gradientValue === gradient.value
          return (
            <TooltipProvider key={gradient.name} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onChange(gradient.value)}
                    className={cn(
                      'h-12 rounded-lg border-2 transition-all duration-200',
                      'hover:scale-105 hover:shadow-md',
                      isSelected
                        ? 'border-primary ring-2 ring-offset-1 ring-primary/50'
                        : 'border-transparent hover:border-border'
                    )}
                    style={{ background: gradient.value }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p className="font-medium">{gradient.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      {/* Custom Gradient Input */}
      <Input
        type="text"
        value={gradientValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="linear-gradient(135deg, #color1, #color2)"
        className="bg-background/50 border-border/50 font-mono text-xs"
      />
    </div>
  )
}

function ArrayField({ config, value, onChange }: FieldProps) {
  const arrayValue = Array.isArray(value) ? value : []

  const handleAddItem = () => {
    onChange([...arrayValue, ''])
  }

  const handleRemoveItem = (index: number) => {
    onChange(arrayValue.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, newValue: unknown) => {
    const newArray = [...arrayValue]
    newArray[index] = newValue
    onChange(newArray)
  }

  return (
    <div className="space-y-3">
      {arrayValue.map((item, index) => (
        <div
          key={index}
          className="relative flex items-center gap-2"
        >
          <Input
            value={typeof item === 'string' ? item : JSON.stringify(item)}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={`Item ${index + 1}`}
            className="flex-1 bg-background/50 border-border/50"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => handleRemoveItem(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddItem}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  )
}

// Image item type for slider/gallery images
interface ImageItem {
  src: string
  alt: string
  caption?: string
}

// Extended FieldProps for ImageArrayField with itemSchema support
interface ImageArrayFieldProps extends FieldProps {
  config: FieldConfig & {
    itemSchema?: {
      properties: Record<string, {
        type: string
        label?: string
        required?: boolean
        format?: string
      }>
      required?: string[]
    }
  }
}

function ImageArrayField({ config, value, onChange }: ImageArrayFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const arrayValue = Array.isArray(value)
    ? value.map(item => {
        // Ensure each item is an object with src, alt, caption
        if (typeof item === 'object' && item !== null) {
          return item as ImageItem
        }
        // Convert string to image object
        return { src: String(item), alt: '', caption: '' }
      })
    : []

  const handleAddItem = () => {
    // Open media picker for new item
    setEditingIndex(arrayValue.length)
    setPickerOpen(true)
  }

  const handleRemoveItem = (index: number) => {
    onChange(arrayValue.filter((_, i) => i !== index))
  }

  const handleItemFieldChange = (index: number, field: keyof ImageItem, newValue: string) => {
    const newArray = [...arrayValue]
    newArray[index] = { ...newArray[index], [field]: newValue }
    onChange(newArray)
  }

  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    const selected = Array.isArray(media) ? media[0] : media
    const newItem: ImageItem = {
      src: selected.file_url,
      alt: selected.alt_text || selected.original_name || '',
      caption: selected.caption || '',
    }

    const newArray = [...arrayValue]
    if (editingIndex !== null && editingIndex < arrayValue.length) {
      // Replacing existing item's image
      newArray[editingIndex] = { ...newArray[editingIndex], src: newItem.src }
    } else {
      // Adding new item
      newArray.push(newItem)
    }
    onChange(newArray)
    setEditingIndex(null)
  }

  const handleBrowseMedia = (index: number) => {
    setEditingIndex(index)
    setPickerOpen(true)
  }

  return (
    <div className="space-y-3">
      {arrayValue.map((item, index) => (
        <div
          key={index}
          className="relative rounded-lg border border-border/50 bg-background/30 p-3 space-y-3"
        >
          {/* Image preview and browse button */}
          <div className="flex gap-3">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border/50 bg-muted flex-shrink-0">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt || 'Preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="flex-1 space-y-2">
              {/* Browse Media button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full h-8"
                onClick={() => handleBrowseMedia(index)}
              >
                <ImageIcon className="h-3 w-3 mr-2" />
                {item.src ? 'Change Image' : 'Browse Media'}
              </Button>

              {/* Alt text */}
              <Input
                value={item.alt || ''}
                onChange={(e) => handleItemFieldChange(index, 'alt', e.target.value)}
                placeholder="Alt text"
                className="h-8 text-xs bg-background/50 border-border/50"
              />
            </div>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              onClick={() => handleRemoveItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Caption (optional, full width) */}
          <Input
            value={item.caption || ''}
            onChange={(e) => handleItemFieldChange(index, 'caption', e.target.value)}
            placeholder="Caption (optional)"
            className="h-8 text-xs bg-background/50 border-border/50"
          />
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddItem}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Image
      </Button>

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleMediaSelect}
        fileType="image"
        currentValue={editingIndex !== null && editingIndex < arrayValue.length ? arrayValue[editingIndex].src : undefined}
      />
    </div>
  )
}

interface MediaFieldProps extends FieldProps {
  mediaType: 'image' | 'video' | 'all'
}

function MediaField({ config, value, onChange, mediaType }: MediaFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showGoogleDriveHelp, setShowGoogleDriveHelp] = useState(false)
  const urlValue = (value as string) || ''

  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    const selected = Array.isArray(media) ? media[0] : media
    onChange(selected.file_url)
  }

  const handleClear = () => {
    onChange('')
  }

  // Auto-convert Google Drive URLs when pasted
  const handleUrlChange = (url: string) => {
    if (isGoogleDriveUrl(url)) {
      // Convert Google Drive URL to embeddable format
      const convertedUrl = mediaType === 'video'
        ? convertToGoogleDriveVideoUrl(url)
        : convertToGoogleDriveImageUrl(url)
      onChange(convertedUrl)
    } else {
      onChange(url)
    }
  }

  // Check if current URL is from Google Drive
  const isGoogleDrive = urlValue.includes('googleusercontent.com') || urlValue.includes('drive.google.com')

  return (
    <div className="space-y-3">
      {urlValue ? (
        <div className="relative rounded-lg border border-border/50 overflow-hidden">
          {mediaType === 'image' || urlValue.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || urlValue.includes('googleusercontent.com') ? (
            <img
              src={urlValue}
              alt={config.label}
              className="w-full h-32 object-cover"
              onError={(e) => {
                // Show placeholder on error
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image</text></svg>'
              }}
            />
          ) : mediaType === 'video' || urlValue.match(/\.(mp4|webm|ogg)$/i) || urlValue.includes('drive.google.com/file') ? (
            urlValue.includes('drive.google.com') ? (
              <iframe
                src={urlValue}
                className="w-full h-32"
                allow="autoplay"
                title={config.label}
              />
            ) : (
              <video
                src={urlValue}
                className="w-full h-32 object-cover"
                muted
              />
            )
          ) : (
            <div className="w-full h-32 bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
          {isGoogleDrive && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
              Google Drive
            </div>
          )}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setPickerOpen(true)}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {urlValue ? 'Change Media' : 'Browse Media'}
        </Button>
      </div>

      {/* Manual URL input with Google Drive support */}
      <div className="space-y-1">
        <Input
          type="url"
          value={urlValue}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Paste URL or Google Drive link..."
          className="bg-background/50 border-border/50 text-xs"
        />
        <button
          type="button"
          onClick={() => setShowGoogleDriveHelp(!showGoogleDriveHelp)}
          className="text-[10px] text-primary hover:underline"
        >
          {showGoogleDriveHelp ? 'Hide' : 'How to use Google Drive?'}
        </button>
      </div>

      {/* Google Drive help text */}
      {showGoogleDriveHelp && (
        <div className="text-[10px] text-muted-foreground bg-muted/50 p-2 rounded-md whitespace-pre-line">
          {GOOGLE_DRIVE_INSTRUCTIONS}
        </div>
      )}

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleMediaSelect}
        fileType={mediaType}
        currentValue={urlValue}
      />
    </div>
  )
}

// Generate field configs from component entry metadata
function getFieldConfigs(componentEntry: ComponentRegistryEntry): FieldConfig[] {
  const fields: FieldConfig[] = []

  // Use editableProps from component entry if available
  const editableProps = componentEntry.editableProps || []

  for (const prop of editableProps) {
    // Skip internal props
    if (['id', 'className', 'style', 'children'].includes(prop.name)) {
      continue
    }

    const config: FieldConfig = {
      key: prop.name,
      type: prop.type as FieldConfig['type'],
      label: prop.label || formatLabel(prop.name),
      description: prop.description,
      required: prop.required,
      defaultValue: prop.defaultValue,
      options: prop.options,
      min: prop.min,
      max: prop.max,
      step: prop.step,
      multiline: prop.multiline,
      placeholder: prop.placeholder,
      itemType: prop.itemType,
      itemSchema: prop.itemSchema,
    }

    fields.push(config)
  }

  return fields
}

export function DynamicForm({ componentEntry, values, onChange }: DynamicFormProps) {
  const fields = getFieldConfigs(componentEntry)

  const handleFieldChange = useCallback(
    (key: string, value: unknown) => {
      onChange({ ...values, [key]: value })
    },
    [values, onChange]
  )

  return (
    <div className="space-y-5">
      {fields.map((field) => {
        const fieldValue = values[field.key]

        // Boolean fields render their own label
        if (field.type === 'boolean') {
          return (
            <div key={field.key}>
              <BooleanField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
              {field.description && (
                <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
              )}
            </div>
          )
        }

        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="text-sm text-foreground">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {field.type === 'string' && (
              <StringField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'url' && (
              <StringField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'number' && (
              <NumberField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'enum' && (
              <EnumField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'color' && (
              <ColorField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'array' && field.itemType === 'image' && (
              <ImageArrayField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'array' && field.itemType !== 'image' && (
              <ArrayField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'image' && (
              <MediaField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
                mediaType="image"
              />
            )}

            {field.type === 'video' && (
              <MediaField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
                mediaType="video"
              />
            )}

            {field.type === 'media' && (
              <MediaField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
                mediaType="all"
              />
            )}

            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )
      })}

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No configurable properties for this component
        </p>
      )}
    </div>
  )
}
