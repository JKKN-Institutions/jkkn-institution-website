'use client'

import { useMemo } from 'react'
import { X, Settings2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getComponentEntry } from '@/lib/cms/component-registry'
import type { EditableProp } from '@/lib/cms/registry-types'
import { usePageBuilder } from './page-builder-context'
import { GlassmorphismControls } from './elementor/glassmorphism-controls'
import type { GlassSettings } from '@/lib/cms/styling-types'

interface PropsPanelProps {
  className?: string
}

export function PropsPanel({ className }: PropsPanelProps) {
  const { blocks, selectedBlockId, selectBlock, updateBlock } = usePageBuilder()

  const selectedBlock = useMemo(() => {
    return blocks.find((b) => b.id === selectedBlockId)
  }, [blocks, selectedBlockId])

  const componentEntry = useMemo(() => {
    if (!selectedBlock) return null
    return getComponentEntry(selectedBlock.component_name)
  }, [selectedBlock])

  const handlePropChange = (propName: string, value: unknown) => {
    if (!selectedBlock) return
    updateBlock(selectedBlock.id, {
      props: {
        ...selectedBlock.props,
        [propName]: value,
      },
    })
  }

  const handleCustomClassesChange = (value: string) => {
    if (!selectedBlock) return
    updateBlock(selectedBlock.id, { custom_classes: value })
  }

  const handleCustomCssChange = (value: string) => {
    if (!selectedBlock) return
    updateBlock(selectedBlock.id, { custom_css: value })
  }

  if (!selectedBlock || !componentEntry) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Properties
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-sm">Select a block to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const editableProps = componentEntry.editableProps || []

  const renderPropField = (prop: EditableProp) => {
    const value = selectedBlock.props[prop.name] ?? prop.defaultValue

    switch (prop.type) {
      case 'string':
        return prop.multiline ? (
          <Textarea
            id={prop.name}
            value={(value as string) || ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            placeholder={prop.placeholder}
            rows={4}
          />
        ) : (
          <Input
            id={prop.name}
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            placeholder={prop.placeholder}
          />
        )

      case 'number':
        if (prop.min !== undefined && prop.max !== undefined) {
          return (
            <div className="flex items-center gap-4">
              <Slider
                value={[(value as number) || prop.min]}
                onValueChange={([v]) => handlePropChange(prop.name, v)}
                min={prop.min}
                max={prop.max}
                step={prop.step || 1}
                className="flex-1"
              />
              <span className="w-12 text-sm text-muted-foreground text-right">
                {value as number}
              </span>
            </div>
          )
        }
        return (
          <Input
            id={prop.name}
            type="number"
            value={(value as number) || ''}
            onChange={(e) => handlePropChange(prop.name, parseFloat(e.target.value) || 0)}
            min={prop.min}
            max={prop.max}
            step={prop.step}
          />
        )

      case 'boolean':
        return (
          <Switch
            id={prop.name}
            checked={(value as boolean) || false}
            onCheckedChange={(checked) => handlePropChange(prop.name, checked)}
          />
        )

      case 'enum':
        return (
          <Select
            value={(value as string) || ''}
            onValueChange={(v) => handlePropChange(prop.name, v)}
          >
            <SelectTrigger id={prop.name}>
              <SelectValue placeholder={`Select ${prop.label}`} />
            </SelectTrigger>
            <SelectContent>
              {prop.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <Input
              id={prop.name}
              type="color"
              value={(value as string) || '#000000'}
              onChange={(e) => handlePropChange(prop.name, e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => handlePropChange(prop.name, e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        )

      case 'url':
        return (
          <Input
            id={prop.name}
            type="url"
            value={(value as string) || ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            placeholder="https://"
          />
        )

      default:
        return (
          <Input
            id={prop.name}
            type="text"
            value={String(value || '')}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
          />
        )
    }
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{componentEntry.displayName}</h3>
          <p className="text-xs text-muted-foreground">Block Settings</p>
        </div>
        <button
          onClick={() => selectBlock(null)}
          className="p-1.5 rounded hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Props Form */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Component Properties */}
          {editableProps.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Properties</h4>
              {editableProps.map((prop) => (
                <div key={prop.name} className="space-y-2">
                  <Label
                    htmlFor={prop.name}
                    className="text-sm flex items-center justify-between"
                  >
                    <span>
                      {prop.label || prop.name}
                      {prop.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </Label>
                  {renderPropField(prop)}
                  {prop.description && (
                    <p className="text-xs text-muted-foreground">{prop.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {editableProps.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No editable properties for this component.
              <br />
              Edit the component props directly in the code.
            </div>
          )}

          <Separator />

          {/* Glass Effects Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Glass Effects
            </h4>
            <GlassmorphismControls
              glass={(selectedBlock.props._styles as { _glass?: Partial<GlassSettings> } | undefined)?._glass}
              onChange={(glass) => {
                handlePropChange('_styles', {
                  ...((selectedBlock.props._styles as Record<string, unknown>) || {}),
                  _glass: glass,
                })
              }}
            />
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Advanced</h4>

            {/* Custom Classes */}
            <div className="space-y-2">
              <Label htmlFor="customClasses">Custom CSS Classes</Label>
              <Input
                id="customClasses"
                value={selectedBlock.custom_classes || ''}
                onChange={(e) => handleCustomClassesChange(e.target.value)}
                placeholder="e.g., my-custom-class"
              />
              <p className="text-xs text-muted-foreground">
                Add Tailwind or custom CSS classes
              </p>
            </div>

            {/* Custom CSS */}
            <div className="space-y-2">
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea
                id="customCss"
                value={selectedBlock.custom_css || ''}
                onChange={(e) => handleCustomCssChange(e.target.value)}
                placeholder="e.g., color: red; font-size: 16px;"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Add inline CSS styles (use sparingly)
              </p>
            </div>

            {/* Block ID */}
            <div className="space-y-2">
              <Label>Block ID</Label>
              <Input value={selectedBlock.id} disabled className="font-mono text-xs" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
