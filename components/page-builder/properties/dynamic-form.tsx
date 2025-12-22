'use client'

import { useCallback, useState, useTransition } from 'react'
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
import { Plus, Trash2, Image as ImageIcon, X, Check, ChevronDown, ChevronUp, GripVertical, User, Loader2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { ComponentRegistryEntry } from '@/lib/cms/registry-types'
import { BRAND_COLORS, BRAND_GRADIENTS, type BrandColor } from '@/lib/cms/brand-colors'
import { isGoogleDriveUrl, convertToGoogleDriveImageUrl, convertToGoogleDriveVideoUrl, GOOGLE_DRIVE_INSTRUCTIONS } from '@/lib/utils/google-drive'
import { extractYouTubeVideoId } from '@/lib/utils/youtube'
import { getYouTubeVideoMetadata } from '@/app/actions/cms/youtube'
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
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'color' | 'url' | 'image' | 'video' | 'media' | 'object'
  label: string
  description?: string
  required?: boolean
  defaultValue?: unknown
  options?: string[]
  min?: number
  max?: number
  step?: number
  unit?: string
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
  /** For object type: nested property definitions */
  properties?: Array<{
    name: string
    type: string
    label?: string
    required?: boolean
    itemType?: string
    itemSchema?: {
      properties: Record<string, {
        type: string
        label?: string
        required?: boolean
        format?: string
      }>
      required?: string[]
    }
  }>
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
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={numValue}
        onChange={(e) => onChange(Number(e.target.value))}
        min={config.min}
        max={config.max}
        step={config.step}
        className="bg-background/50 border-border/50 flex-1"
      />
      {config.unit && (
        <span className="text-sm text-muted-foreground font-medium min-w-[2.5rem]">
          {config.unit}
        </span>
      )}
    </div>
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

/**
 * NestedArrayField - For editing nested arrays within object array items
 * Supports both simple string arrays (like specializations) and complex object arrays (like courses)
 */
interface NestedArrayFieldProps {
  label: string
  value: unknown[]
  onChange: (value: unknown[]) => void
  itemSchema?: {
    properties: Record<string, {
      type: string
      label?: string
      required?: boolean
      itemType?: string
      itemSchema?: {
        properties: Record<string, { type: string; label?: string; required?: boolean }>
      }
    }>
    required?: string[]
  }
  itemType?: string
}

function NestedArrayField({ label, value, onChange, itemSchema, itemType }: NestedArrayFieldProps) {
  const arrayValue = Array.isArray(value) ? value : []
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]))

  const toggleExpanded = (index: number) => {
    const newSet = new Set(expandedItems)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setExpandedItems(newSet)
  }

  // Simple string array (like specializations)
  if (!itemSchema || itemType === 'string') {
    const handleAddString = () => {
      onChange([...arrayValue, ''])
    }

    const handleRemoveString = (index: number) => {
      const newValue = arrayValue.filter((_, i) => i !== index)
      onChange(newValue)
    }

    const handleChangeString = (index: number, newVal: string) => {
      const newValue = [...arrayValue]
      newValue[index] = newVal
      onChange(newValue)
    }

    return (
      <div className="space-y-2 pl-2 border-l-2 border-border/40">
        {arrayValue.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              value={item as string}
              onChange={(e) => handleChangeString(index, e.target.value)}
              placeholder={`Enter ${label.toLowerCase().replace(/s$/, '')}...`}
              className="h-8 text-sm bg-background/50 border-border/50 flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              onClick={() => handleRemoveString(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs"
          onClick={handleAddString}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add {label.replace(/s$/, '') || 'Item'}
        </Button>
      </div>
    )
  }

  // Complex object array (like courses)
  const handleAddObject = () => {
    const newItem: Record<string, unknown> = {}
    if (itemSchema?.properties) {
      Object.entries(itemSchema.properties).forEach(([key, prop]) => {
        if (prop.type === 'array') {
          newItem[key] = []
        } else if (prop.type === 'number') {
          newItem[key] = 0
        } else {
          newItem[key] = ''
        }
      })
    }
    onChange([...arrayValue, newItem])
    setExpandedItems(new Set([...expandedItems, arrayValue.length]))
  }

  const handleRemoveObject = (index: number) => {
    const newValue = arrayValue.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const handleObjectFieldChange = (index: number, fieldKey: string, fieldValue: unknown) => {
    const newValue = [...arrayValue]
    newValue[index] = { ...(newValue[index] as Record<string, unknown>), [fieldKey]: fieldValue }
    onChange(newValue)
  }

  // Get primary display field
  const getPrimaryField = (): string => {
    if (!itemSchema?.properties) return ''
    const candidates = ['name', 'title', 'label']
    for (const candidate of candidates) {
      if (itemSchema.properties[candidate]) return candidate
    }
    return Object.keys(itemSchema.properties)[0] || ''
  }

  const primaryField = getPrimaryField()

  return (
    <div className="space-y-2 pl-2 border-l-2 border-border/40">
      {arrayValue.map((item, index) => {
        const itemObj = item as Record<string, unknown>
        const isExpanded = expandedItems.has(index)
        const displayValue = itemObj[primaryField] as string || `Item ${index + 1}`

        return (
          <Collapsible key={index} open={isExpanded} onOpenChange={() => toggleExpanded(index)}>
            <div className="rounded-md border border-border/50 bg-background/30 overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{displayValue}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveObject(index)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-2 pb-2 pt-1 space-y-2 border-t border-border/30">
                  {itemSchema?.properties && Object.entries(itemSchema.properties).map(([fieldKey, propSchema]) => {
                    const fieldLabel = propSchema.label || formatLabel(fieldKey)
                    const fieldValue = itemObj[fieldKey] ?? (propSchema.type === 'array' ? [] : '')

                    return (
                      <div key={fieldKey} className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">
                          {fieldLabel}
                          {itemSchema.required?.includes(fieldKey) && (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </Label>
                        {propSchema.type === 'array' ? (
                          // Nested nested array (like specializations within courses)
                          <NestedArrayField
                            label={fieldLabel}
                            value={fieldValue as unknown[]}
                            onChange={(newValue) => handleObjectFieldChange(index, fieldKey, newValue)}
                            itemSchema={propSchema.itemSchema}
                            itemType={propSchema.itemType}
                          />
                        ) : propSchema.type === 'number' ? (
                          <Input
                            type="number"
                            value={fieldValue as number}
                            onChange={(e) => handleObjectFieldChange(index, fieldKey, Number(e.target.value))}
                            placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                            className="h-7 text-xs bg-background/50 border-border/50"
                          />
                        ) : (
                          <Input
                            value={fieldValue as string}
                            onChange={(e) => handleObjectFieldChange(index, fieldKey, e.target.value)}
                            placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                            className="h-7 text-xs bg-background/50 border-border/50"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )
      })}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-7 text-xs"
        onClick={handleAddObject}
      >
        <Plus className="h-3 w-3 mr-1" />
        Add {label.replace(/s$/, '') || 'Item'}
      </Button>
    </div>
  )
}

/**
 * ObjectArrayField - For editing arrays of complex objects with individual fields
 * Each item is rendered as a collapsible card with editable fields for each property
 */
interface ObjectArrayFieldProps extends FieldProps {
  config: FieldConfig & {
    itemSchema?: {
      properties: Record<string, {
        type: string
        label?: string
        required?: boolean
        format?: string
        description?: string
        multiline?: boolean
      }>
      required?: string[]
    }
  }
}

function ObjectArrayField({ config, value, onChange }: ObjectArrayFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingImageField, setEditingImageField] = useState<{ index: number; field: string } | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0])) // First item expanded by default
  const [fetchingYouTube, setFetchingYouTube] = useState<Set<number>>(new Set()) // Track which items are fetching YouTube metadata

  const arrayValue = Array.isArray(value)
    ? value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item as Record<string, unknown>
        }
        // Try to parse JSON string
        if (typeof item === 'string') {
          try {
            return JSON.parse(item) as Record<string, unknown>
          } catch {
            return {}
          }
        }
        return {}
      })
    : []

  const schema = config.itemSchema

  // Get the primary display field (usually 'name' or 'title')
  const getPrimaryField = (): string => {
    if (!schema?.properties) return ''
    const candidates = ['name', 'title', 'label', 'heading']
    for (const candidate of candidates) {
      if (schema.properties[candidate]) return candidate
    }
    return Object.keys(schema.properties)[0] || ''
  }

  const primaryField = getPrimaryField()

  // Create a default empty item based on schema
  const createEmptyItem = (): Record<string, unknown> => {
    if (!schema?.properties) return {}
    const item: Record<string, unknown> = {}
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (propSchema.type === 'string') {
        item[key] = ''
      } else if (propSchema.type === 'number') {
        item[key] = 0
      } else if (propSchema.type === 'boolean') {
        item[key] = false
      } else {
        item[key] = ''
      }
    }
    return item
  }

  const handleAddItem = () => {
    const newItem = createEmptyItem()
    const newArray = [...arrayValue, newItem]
    onChange(newArray)
    // Expand the new item
    setExpandedItems(prev => new Set([...prev, newArray.length - 1]))
  }

  const handleRemoveItem = (index: number) => {
    onChange(arrayValue.filter((_, i) => i !== index))
    setExpandedItems(prev => {
      const newSet = new Set<number>()
      prev.forEach(i => {
        if (i < index) newSet.add(i)
        else if (i > index) newSet.add(i - 1)
      })
      return newSet
    })
  }

  const handleItemFieldChange = async (index: number, field: string, newValue: unknown) => {
    const newArray = [...arrayValue]
    newArray[index] = { ...newArray[index], [field]: newValue }
    onChange(newArray)

    // Auto-fetch YouTube metadata when videoUrl field changes
    if (field === 'videoUrl' && typeof newValue === 'string' && newValue.trim()) {
      const videoId = extractYouTubeVideoId(newValue)
      if (videoId) {
        // Check if title and thumbnail are empty (don't override existing values)
        const currentItem = newArray[index]
        const hasTitle = currentItem.title && String(currentItem.title).trim()
        const hasThumbnail = currentItem.thumbnail && String(currentItem.thumbnail).trim()

        if (!hasTitle || !hasThumbnail) {
          // Set loading state
          setFetchingYouTube(prev => new Set([...prev, index]))

          try {
            const result = await getYouTubeVideoMetadata(newValue)
            if (result.success && result.data) {
              // Create updated array with fetched metadata
              const updatedArray = [...arrayValue]
              updatedArray[index] = {
                ...updatedArray[index],
                [field]: newValue,
                ...((!hasTitle) && { title: result.data.title }),
                ...((!hasThumbnail) && { thumbnail: result.data.thumbnail })
              }
              onChange(updatedArray)
            }
          } catch (error) {
            console.error('Failed to fetch YouTube metadata:', error)
          } finally {
            // Clear loading state
            setFetchingYouTube(prev => {
              const newSet = new Set(prev)
              newSet.delete(index)
              return newSet
            })
          }
        }
      }
    }
  }

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    if (!editingImageField) return
    const selected = Array.isArray(media) ? media[0] : media
    handleItemFieldChange(editingImageField.index, editingImageField.field, selected.file_url)
    setEditingImageField(null)
  }

  const openMediaPicker = (index: number, field: string) => {
    setEditingImageField({ index, field })
    setPickerOpen(true)
  }

  // Determine if a field should use image picker
  const isImageField = (fieldKey: string, propSchema: { type: string; format?: string }): boolean => {
    // Check if type is explicitly 'image'
    if (propSchema.type === 'image') return true

    const imageKeywords = ['image', 'photo', 'picture', 'avatar', 'thumbnail', 'src', 'logo']
    const keyLower = fieldKey.toLowerCase()
    return (
      propSchema.format === 'uri' ||
      propSchema.format === 'url' ||
      imageKeywords.some(kw => keyLower.includes(kw))
    )
  }

  // Determine if a field should be multiline
  const isMultilineField = (fieldKey: string, propSchema: { type: string; multiline?: boolean; description?: string }): boolean => {
    if (propSchema.multiline) return true
    const multilineKeywords = ['message', 'description', 'content', 'text', 'bio', 'paragraph', 'body', 'quote']
    const keyLower = fieldKey.toLowerCase()
    return multilineKeywords.some(kw => keyLower.includes(kw))
  }

  if (!schema?.properties || Object.keys(schema.properties).length === 0) {
    // Fallback to simple ArrayField if no schema
    return <ArrayField config={config} value={value} onChange={onChange} />
  }

  return (
    <div className="space-y-3">
      {arrayValue.map((item, index) => {
        const isExpanded = expandedItems.has(index)
        const displayValue = item[primaryField] as string || `Item ${index + 1}`

        return (
          <Collapsible key={index} open={isExpanded} onOpenChange={() => toggleExpanded(index)}>
            <div className="rounded-lg border border-border/60 bg-background/40 overflow-hidden">
              {/* Header */}
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors">
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />

                  {/* Thumbnail for image fields */}
                  {Object.entries(schema.properties).some(([k, v]) => isImageField(k, v)) && (
                    <div className="w-10 h-10 rounded-md overflow-hidden border border-border/50 bg-muted flex-shrink-0">
                      {(() => {
                        const imageField = Object.entries(schema.properties).find(([k, v]) => isImageField(k, v))
                        const imageUrl = imageField ? item[imageField[0]] as string : ''
                        if (imageUrl) {
                          return (
                            <img
                              src={imageUrl}
                              alt={displayValue}
                              className="w-full h-full object-cover"
                            />
                          )
                        }
                        return (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{displayValue}</p>
                    {!isExpanded && (
                      <p className="text-xs text-muted-foreground truncate">
                        {Object.entries(item)
                          .filter(([k]) => k !== primaryField)
                          .slice(0, 2)
                          .map(([k, v]) => `${formatLabel(k)}: ${String(v).slice(0, 20)}${String(v).length > 20 ? '...' : ''}`)
                          .join(' • ')}
                      </p>
                    )}
                  </div>

                  {/* Loading indicator for YouTube metadata fetch */}
                  {fetchingYouTube.has(index) && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 flex-shrink-0 min-w-fit">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveItem(index)
                      }}
                      title="Delete this item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>

              {/* Expanded Content */}
              <CollapsibleContent>
                <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border/40">
                  {Object.entries(schema.properties).map(([fieldKey, propSchema]) => {
                    const fieldLabel = propSchema.label || formatLabel(fieldKey)
                    const fieldValue = item[fieldKey] ?? ''
                    const isImage = isImageField(fieldKey, propSchema)
                    const isMultiline = isMultilineField(fieldKey, propSchema)

                    return (
                      <div key={fieldKey} className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          {fieldLabel}
                          {schema.required?.includes(fieldKey) && (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </Label>

                        {isImage ? (
                          // Image field with media picker
                          <div className="flex gap-2 items-start">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border/50 bg-muted flex-shrink-0">
                              {fieldValue ? (
                                <img
                                  src={fieldValue as string}
                                  alt={fieldLabel}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full h-7 text-xs"
                                onClick={() => openMediaPicker(index, fieldKey)}
                              >
                                <ImageIcon className="h-3 w-3 mr-1.5" />
                                {fieldValue ? 'Change' : 'Select'} Image
                              </Button>
                              <Input
                                value={fieldValue as string}
                                onChange={(e) => handleItemFieldChange(index, fieldKey, e.target.value)}
                                placeholder="Or paste URL..."
                                className="h-7 text-xs bg-background/50 border-border/50"
                              />
                            </div>
                          </div>
                        ) : isMultiline ? (
                          // Multiline text field
                          <Textarea
                            value={fieldValue as string}
                            onChange={(e) => handleItemFieldChange(index, fieldKey, e.target.value)}
                            placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                            rows={3}
                            className="text-sm bg-background/50 border-border/50 resize-none"
                          />
                        ) : propSchema.type === 'number' ? (
                          // Number field
                          <Input
                            type="number"
                            value={fieldValue as number}
                            onChange={(e) => handleItemFieldChange(index, fieldKey, Number(e.target.value))}
                            placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                            className="h-8 text-sm bg-background/50 border-border/50"
                          />
                        ) : propSchema.type === 'array' ? (
                          // Nested array field
                          <NestedArrayField
                            label={fieldLabel}
                            value={fieldValue as unknown[]}
                            onChange={(newValue) => handleItemFieldChange(index, fieldKey, newValue)}
                            itemSchema={(propSchema as unknown as { itemSchema?: { properties: Record<string, { type: string; label?: string; required?: boolean }> } }).itemSchema}
                            itemType={(propSchema as unknown as { itemType?: string }).itemType}
                          />
                        ) : (
                          // Default string field
                          <Input
                            value={fieldValue as string}
                            onChange={(e) => handleItemFieldChange(index, fieldKey, e.target.value)}
                            placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                            className="h-8 text-sm bg-background/50 border-border/50"
                          />
                        )}

                        {propSchema.description && (
                          <p className="text-[10px] text-muted-foreground">{propSchema.description}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddItem}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {config.label.replace(/s$/, '') || 'Item'}
      </Button>

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleMediaSelect}
        fileType="image"
        currentValue={editingImageField ? (arrayValue[editingImageField.index]?.[editingImageField.field] as string) : undefined}
      />
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

/**
 * ObjectField - For editing nested object properties (like boysHostel, girlsHostel)
 * Renders a collapsible section containing all nested fields
 */
interface ObjectFieldProps extends FieldProps {
  config: FieldConfig & {
    properties?: Array<{
      name: string
      type: string
      label?: string
      required?: boolean
      itemType?: string
      itemSchema?: {
        properties: Record<string, {
          type: string
          label?: string
          required?: boolean
          format?: string
        }>
        required?: string[]
      }
    }>
  }
}

function ObjectField({ config, value, onChange }: ObjectFieldProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingImageField, setEditingImageField] = useState<{ arrayIndex: number; field: string } | null>(null)

  const objectValue = (value && typeof value === 'object' && !Array.isArray(value))
    ? value as Record<string, unknown>
    : {}

  const handleFieldChange = (fieldKey: string, newValue: unknown) => {
    onChange({ ...objectValue, [fieldKey]: newValue })
  }

  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    if (!editingImageField) return
    const selected = Array.isArray(media) ? media[0] : media

    // Update the image in the array
    const currentArray = objectValue[editingImageField.field] as Array<{ src: string; alt?: string }> || []
    const newArray = [...currentArray]
    if (editingImageField.arrayIndex < newArray.length) {
      newArray[editingImageField.arrayIndex] = { ...newArray[editingImageField.arrayIndex], src: selected.file_url }
    } else {
      newArray.push({ src: selected.file_url, alt: '' })
    }
    handleFieldChange(editingImageField.field, newArray)
    setEditingImageField(null)
  }

  if (!config.properties || config.properties.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">
        No configurable properties
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border border-border/60 bg-background/40 overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{config.label}</p>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-3 pb-3 pt-1 space-y-4 border-t border-border/40">
            {config.properties.map((prop) => {
              const fieldLabel = prop.label || formatLabel(prop.name)
              const fieldValue = objectValue[prop.name]

              // Handle nested arrays with images
              if (prop.type === 'array' && prop.itemType === 'object' && prop.itemSchema) {
                const arrayValue = Array.isArray(fieldValue) ? fieldValue as Array<Record<string, unknown>> : []

                // Check if this is an image array (has 'src' property with image format)
                const isImageArray = prop.itemSchema.properties?.src?.format === 'image' ||
                  prop.name.toLowerCase().includes('image')

                if (isImageArray) {
                  return (
                    <div key={prop.name} className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-medium">
                        {fieldLabel}
                        {prop.required && <span className="text-red-500 ml-0.5">*</span>}
                      </Label>
                      <div className="space-y-2">
                        {arrayValue.map((item, index) => (
                          <div key={index} className="flex gap-2 items-start p-2 rounded-md border border-border/40 bg-background/30">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border/50 bg-muted flex-shrink-0">
                              {item.src ? (
                                <img
                                  src={item.src as string}
                                  alt={item.alt as string || `Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full h-7 text-xs"
                                onClick={() => {
                                  setEditingImageField({ arrayIndex: index, field: prop.name })
                                  setPickerOpen(true)
                                }}
                              >
                                <ImageIcon className="h-3 w-3 mr-1.5" />
                                {item.src ? 'Change' : 'Select'} Image
                              </Button>
                              <Input
                                value={item.alt as string || ''}
                                onChange={(e) => {
                                  const newArray = [...arrayValue]
                                  newArray[index] = { ...newArray[index], alt: e.target.value }
                                  handleFieldChange(prop.name, newArray)
                                }}
                                placeholder="Alt text"
                                className="h-7 text-xs bg-background/50 border-border/50"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                              onClick={() => {
                                const newArray = arrayValue.filter((_, i) => i !== index)
                                handleFieldChange(prop.name, newArray)
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs"
                          onClick={() => {
                            setEditingImageField({ arrayIndex: arrayValue.length, field: prop.name })
                            setPickerOpen(true)
                          }}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Add Image
                        </Button>
                      </div>
                    </div>
                  )
                }

                // Non-image object arrays
                return (
                  <div key={prop.name} className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-medium">
                      {fieldLabel}
                      {prop.required && <span className="text-red-500 ml-0.5">*</span>}
                    </Label>
                    <ObjectArrayField
                      config={{
                        key: prop.name,
                        type: 'array',
                        label: fieldLabel,
                        itemType: 'object',
                        itemSchema: prop.itemSchema
                      }}
                      value={fieldValue}
                      onChange={(v) => handleFieldChange(prop.name, v)}
                    />
                  </div>
                )
              }

              // Handle simple string arrays (paragraphs, highlights)
              if (prop.type === 'array' && (!prop.itemType || prop.itemType === 'string')) {
                const stringArray = Array.isArray(fieldValue) ? fieldValue as string[] : []

                return (
                  <div key={prop.name} className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-medium">
                      {fieldLabel}
                      {prop.required && <span className="text-red-500 ml-0.5">*</span>}
                    </Label>
                    <div className="space-y-2">
                      {stringArray.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <Textarea
                            value={item}
                            onChange={(e) => {
                              const newArray = [...stringArray]
                              newArray[index] = e.target.value
                              handleFieldChange(prop.name, newArray)
                            }}
                            placeholder={`Enter ${fieldLabel.toLowerCase().replace(/s$/, '')}...`}
                            rows={2}
                            className="flex-1 text-sm bg-background/50 border-border/50 resize-none"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 mt-1"
                            onClick={() => {
                              const newArray = stringArray.filter((_, i) => i !== index)
                              handleFieldChange(prop.name, newArray)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => {
                          handleFieldChange(prop.name, [...stringArray, ''])
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add {fieldLabel.replace(/s$/, '') || 'Item'}
                      </Button>
                    </div>
                  </div>
                )
              }

              // Handle simple string fields
              if (prop.type === 'string') {
                return (
                  <div key={prop.name} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      {fieldLabel}
                      {prop.required && <span className="text-red-500 ml-0.5">*</span>}
                    </Label>
                    <Input
                      value={fieldValue as string || ''}
                      onChange={(e) => handleFieldChange(prop.name, e.target.value)}
                      placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                      className="h-8 text-sm bg-background/50 border-border/50"
                    />
                  </div>
                )
              }

              // Default: render as text input
              return (
                <div key={prop.name} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium">
                    {fieldLabel}
                  </Label>
                  <Input
                    value={String(fieldValue || '')}
                    onChange={(e) => handleFieldChange(prop.name, e.target.value)}
                    placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                    className="h-8 text-sm bg-background/50 border-border/50"
                  />
                </div>
              )
            })}
          </div>
        </CollapsibleContent>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleMediaSelect}
        fileType="image"
        currentValue={editingImageField && objectValue[editingImageField.field]
          ? ((objectValue[editingImageField.field] as Array<{ src: string }>)[editingImageField.arrayIndex]?.src)
          : undefined
        }
      />
    </Collapsible>
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
      properties: prop.properties,
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

            {field.type === 'array' && field.itemType === 'object' && field.itemSchema && (
              <ObjectArrayField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
              />
            )}

            {field.type === 'array' && field.itemType !== 'image' && field.itemType !== 'object' && (
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

            {field.type === 'object' && field.properties && (
              <ObjectField
                config={field}
                value={fieldValue}
                onChange={(v) => handleFieldChange(field.key, v)}
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
