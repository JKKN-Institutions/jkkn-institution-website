'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Settings, RotateCcw, Save } from 'lucide-react'
import { toast } from 'sonner'

interface PropSchema {
  type: string
  description?: string
  default?: unknown
  enum?: string[]
  required?: boolean
}

interface PropsEditorPanelProps {
  propsSchema: Record<string, PropSchema>
  currentProps: Record<string, unknown>
  onChange: (props: Record<string, unknown>) => void
  onSaveAsDefaults?: () => void
}

export function PropsEditorPanel({
  propsSchema,
  currentProps,
  onChange,
  onSaveAsDefaults,
}: PropsEditorPanelProps) {
  const [localProps, setLocalProps] = useState<Record<string, unknown>>(currentProps)

  const updateProp = useCallback(
    (key: string, value: unknown) => {
      const newProps = { ...localProps, [key]: value }
      setLocalProps(newProps)
      onChange(newProps)
    },
    [localProps, onChange]
  )

  const resetToDefaults = useCallback(() => {
    const defaults: Record<string, unknown> = {}
    Object.entries(propsSchema).forEach(([key, schema]) => {
      if (schema.default !== undefined) {
        defaults[key] = schema.default
      }
    })
    setLocalProps(defaults)
    onChange(defaults)
    toast.success('Props reset to defaults')
  }, [propsSchema, onChange])

  const handleSaveAsDefaults = useCallback(() => {
    onSaveAsDefaults?.()
    toast.success('Props saved as defaults')
  }, [onSaveAsDefaults])

  const hasPropChanges = JSON.stringify(localProps) !== JSON.stringify(currentProps)

  // If no props schema, show empty state
  if (!propsSchema || Object.keys(propsSchema).length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Test Props
          </CardTitle>
          <CardDescription className="text-xs">
            No props defined for this component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No props to configure</p>
            <p className="text-xs mt-1">
              Add a props interface to your component code
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <CardTitle className="text-sm">Test Props</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {Object.keys(propsSchema).length} props
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Modify props to see changes in real-time
        </CardDescription>
      </CardHeader>

      {/* Props Fields */}
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-4 pb-4">
          {Object.entries(propsSchema).map(([key, schema]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium flex items-center gap-2">
                  {key}
                  {schema.required && (
                    <Badge variant="destructive" className="text-[10px] px-1 py-0">
                      required
                    </Badge>
                  )}
                </Label>
                <Badge variant="outline" className="text-[10px]">
                  {schema.type}
                </Badge>
              </div>

              {schema.description && (
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {schema.description}
                </p>
              )}

              {/* String Input */}
              {schema.type === 'string' && !schema.enum && (
                <Input
                  value={(localProps[key] as string) || ''}
                  onChange={(e) => updateProp(key, e.target.value)}
                  placeholder={schema.default as string || `Enter ${key}...`}
                  className="text-sm"
                />
              )}

              {/* Number Input */}
              {schema.type === 'number' && (
                <Input
                  type="number"
                  value={(localProps[key] as number) || 0}
                  onChange={(e) => updateProp(key, Number(e.target.value))}
                  placeholder={String(schema.default) || '0'}
                  className="text-sm"
                />
              )}

              {/* Boolean Switch */}
              {schema.type === 'boolean' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={(localProps[key] as boolean) || false}
                    onCheckedChange={(checked) => updateProp(key, checked)}
                  />
                  <Label className="text-sm text-muted-foreground">
                    {localProps[key] ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              )}

              {/* Enum Select */}
              {schema.enum && (
                <Select
                  value={(localProps[key] as string) || ''}
                  onValueChange={(value) => updateProp(key, value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={`Select ${key}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {schema.enum.map((option) => (
                      <SelectItem key={option} value={option} className="text-sm">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Object/Array JSON Editor */}
              {(schema.type === 'object' || schema.type === 'array') && (
                <Textarea
                  value={JSON.stringify(localProps[key], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      updateProp(key, parsed)
                    } catch {
                      // Invalid JSON, ignore for now
                    }
                  }}
                  placeholder={JSON.stringify(schema.default, null, 2) || '{}'}
                  className="font-mono text-xs"
                  rows={schema.type === 'array' ? 5 : 6}
                />
              )}

              {key !== Object.keys(propsSchema)[Object.keys(propsSchema).length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-muted/10 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="flex-1 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset to Defaults
          </Button>
          {onSaveAsDefaults && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveAsDefaults}
              disabled={!hasPropChanges}
              className="flex-1 text-xs"
            >
              <Save className="h-3 w-3 mr-1" />
              Save as Defaults
            </Button>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Changes apply immediately to preview
        </p>
      </div>
    </Card>
  )
}
