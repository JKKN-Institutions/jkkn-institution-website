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
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react'
import type { ComponentRegistryEntry } from '@/lib/cms/registry-types'
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

function ColorField({ config, value, onChange }: FieldProps) {
  const colorValue = (value as string) || '#000000'

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={colorValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 rounded border border-border cursor-pointer"
      />
      <Input
        type="text"
        value={colorValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 bg-background/50 border-border/50"
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

interface MediaFieldProps extends FieldProps {
  mediaType: 'image' | 'video' | 'all'
}

function MediaField({ config, value, onChange, mediaType }: MediaFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const urlValue = (value as string) || ''

  const handleMediaSelect = (media: MediaItem | MediaItem[]) => {
    const selected = Array.isArray(media) ? media[0] : media
    onChange(selected.file_url)
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="space-y-3">
      {urlValue ? (
        <div className="relative rounded-lg border border-border/50 overflow-hidden">
          {mediaType === 'image' || urlValue.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
            <img
              src={urlValue}
              alt={config.label}
              className="w-full h-32 object-cover"
            />
          ) : mediaType === 'video' || urlValue.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={urlValue}
              className="w-full h-32 object-cover"
              muted
            />
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

      {/* Manual URL input as fallback */}
      <Input
        type="url"
        value={urlValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or enter URL directly..."
        className="bg-background/50 border-border/50 text-xs"
      />

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

            {field.type === 'array' && (
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
