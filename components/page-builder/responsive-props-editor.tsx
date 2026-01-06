'use client'

/**
 * Responsive Props Editor
 *
 * Allows editing component properties per breakpoint (desktop/tablet/mobile).
 * Displays a visual diff showing which props are overridden at each breakpoint.
 *
 * Database: Stores in cms_page_blocks.responsive_settings jsonb column
 * Structure: { desktop: {...}, tablet: {...}, mobile: {...} }
 */

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DeviceBreakpoint = 'desktop' | 'tablet' | 'mobile'

interface ResponsivePropsEditorProps {
  componentName: string
  propsSchema: any // Component's props schema from registry
  baseProps: Record<string, any> // Desktop/default props
  responsiveSettings: Record<DeviceBreakpoint, Record<string, any>> // Current responsive overrides
  currentBreakpoint: DeviceBreakpoint
  onChange: (breakpoint: DeviceBreakpoint, props: Record<string, any>) => void
  onReset: (breakpoint: DeviceBreakpoint, propKey?: string) => void
}

export function ResponsivePropsEditor({
  componentName,
  propsSchema,
  baseProps,
  responsiveSettings,
  currentBreakpoint,
  onChange,
  onReset,
}: ResponsivePropsEditorProps) {
  const [showOnlyOverrides, setShowOnlyOverrides] = useState(false)

  const currentBreakpointProps = responsiveSettings[currentBreakpoint] || {}

  // Determine which props are overridden at current breakpoint
  const isOverridden = (propKey: string) => {
    return currentBreakpointProps.hasOwnProperty(propKey)
  }

  // Get effective value (override or base)
  const getEffectiveValue = (propKey: string) => {
    return isOverridden(propKey) ? currentBreakpointProps[propKey] : baseProps[propKey]
  }

  // Reset specific prop override
  const handleResetProp = (propKey: string) => {
    const updated = { ...currentBreakpointProps }
    delete updated[propKey]
    onChange(currentBreakpoint, updated)
  }

  // Reset all overrides for current breakpoint
  const handleResetAll = () => {
    onChange(currentBreakpoint, {})
  }

  // Get editable props from schema
  const editableProps = getEditablePropsFromSchema(propsSchema)

  // Filter props if showing only overrides
  const displayedProps = showOnlyOverrides
    ? editableProps.filter(prop => isOverridden(prop.key))
    : editableProps

  const overrideCount = Object.keys(currentBreakpointProps).length

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={overrideCount > 0 ? 'default' : 'secondary'} className="text-xs">
            {overrideCount} {overrideCount === 1 ? 'override' : 'overrides'}
          </Badge>
          {currentBreakpoint !== 'desktop' && (
            <span className="text-xs text-muted-foreground">
              Inherits from desktop by default
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOnlyOverrides(!showOnlyOverrides)}
            className="h-8 text-xs"
          >
            {showOnlyOverrides ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Show All
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Overrides Only
              </>
            )}
          </Button>

          {overrideCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAll}
              className="h-8 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset All
            </Button>
          )}
        </div>
      </div>

      {/* Info alert for non-desktop breakpoints */}
      {currentBreakpoint !== 'desktop' && overrideCount === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This component uses desktop settings. Override any property below to customize for {currentBreakpoint} devices.
          </AlertDescription>
        </Alert>
      )}

      {/* Props editor */}
      <div className="space-y-3">
        {displayedProps.length === 0 && showOnlyOverrides && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No overrides for {currentBreakpoint}
          </div>
        )}

        {displayedProps.map((prop) => (
          <ResponsivePropField
            key={prop.key}
            propKey={prop.key}
            propSchema={prop.schema}
            value={getEffectiveValue(prop.key)}
            isOverridden={isOverridden(prop.key)}
            baseValue={baseProps[prop.key]}
            onChange={(value) => {
              onChange(currentBreakpoint, {
                ...currentBreakpointProps,
                [prop.key]: value,
              })
            }}
            onReset={() => handleResetProp(prop.key)}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Individual Prop Field with Override Indicator
// ============================================================================

interface ResponsivePropFieldProps {
  propKey: string
  propSchema: any
  value: any
  isOverridden: boolean
  baseValue: any
  onChange: (value: any) => void
  onReset: () => void
}

function ResponsivePropField({
  propKey,
  propSchema,
  value,
  isOverridden,
  baseValue,
  onChange,
  onReset,
}: ResponsivePropFieldProps) {
  const { type, label, description, options, placeholder } = propSchema

  return (
    <div
      className={cn(
        'relative rounded-lg border p-3 transition-colors',
        isOverridden
          ? 'border-primary bg-primary/5'
          : 'border-border bg-background'
      )}
    >
      {/* Label with override indicator */}
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={propKey} className="text-sm font-medium flex items-center gap-2">
          {label || propKey}
          {isOverridden && (
            <Badge variant="default" className="text-xs px-1.5 py-0">
              Override
            </Badge>
          )}
        </Label>

        {isOverridden && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-6 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
      )}

      {/* Input based on type */}
      {renderPropInput(type, propKey, value, onChange, { options, placeholder })}

      {/* Base value indicator */}
      {isOverridden && baseValue !== undefined && (
        <div className="mt-2 text-xs text-muted-foreground">
          Desktop value: <code className="px-1 py-0.5 rounded bg-muted">{formatValue(baseValue)}</code>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Prop Input Renderers
// ============================================================================

function renderPropInput(
  type: string,
  id: string,
  value: any,
  onChange: (value: any) => void,
  options: { options?: any[]; placeholder?: string }
) {
  switch (type) {
    case 'string':
    case 'text':
      return (
        <Input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={options.placeholder}
        />
      )

    case 'number':
      return (
        <Input
          id={id}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={options.placeholder}
        />
      )

    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={id}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <Label htmlFor={id} className="text-sm font-normal">
            {value ? 'Enabled' : 'Disabled'}
          </Label>
        </div>
      )

    case 'select':
    case 'enum':
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={options.placeholder || 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {options.options?.map((opt: any) => (
              <SelectItem key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'textarea':
    case 'longtext':
      return (
        <Textarea
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={options.placeholder}
          rows={4}
        />
      )

    case 'color':
      return (
        <div className="flex gap-2">
          <Input
            id={id}
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-10 p-1"
          />
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      )

    default:
      // Fallback for unknown types
      return (
        <Input
          id={id}
          type="text"
          value={typeof value === 'object' ? JSON.stringify(value) : value || ''}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              onChange(parsed)
            } catch {
              onChange(e.target.value)
            }
          }}
          placeholder="Enter value..."
        />
      )
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

function getEditablePropsFromSchema(schema: any): Array<{ key: string; schema: any }> {
  // Extract editable props from component schema
  // This is a placeholder - will integrate with actual registry
  if (!schema || !schema.properties) {
    return []
  }

  return Object.entries(schema.properties).map(([key, propSchema]: [string, any]) => ({
    key,
    schema: {
      type: propSchema.type || 'string',
      label: propSchema.title || key,
      description: propSchema.description,
      options: propSchema.enum || propSchema.options,
      placeholder: propSchema.placeholder,
    },
  }))
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'none'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
