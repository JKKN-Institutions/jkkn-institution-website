'use client'

/**
 * Gradient Builder Component
 *
 * Advanced gradient builder with:
 * - Multi-stop color gradients with visual editor
 * - Direction controls (8 directions)
 * - Gradient presets
 * - Both Tailwind classes and CSS gradient support
 *
 * Usage: Background controls in page builder
 */

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Plus, X, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GradientStop {
  color: string
  position: number  // 0-100
}

interface GradientBuilderProps {
  gradient?: string
  stops?: GradientStop[]
  onChange: (gradient: string, stops: GradientStop[]) => void
}

type GradientDirection = 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr'

const DIRECTION_MAP: Record<GradientDirection, string> = {
  'to-r': 'to right',
  'to-br': 'to bottom right',
  'to-b': 'to bottom',
  'to-bl': 'to bottom left',
  'to-l': 'to left',
  'to-tl': 'to top left',
  'to-t': 'to top',
  'to-tr': 'to top right',
}

const GRADIENT_PRESETS = [
  { name: 'Sunset', colors: ['#ff6b6b', '#feca57'], direction: 'to-r' as GradientDirection },
  { name: 'Ocean', colors: ['#4facfe', '#00f2fe'], direction: 'to-r' as GradientDirection },
  { name: 'Forest', colors: ['#43e97b', '#38f9d7'], direction: 'to-br' as GradientDirection },
  { name: 'Purple Dream', colors: ['#667eea', '#764ba2'], direction: 'to-r' as GradientDirection },
  { name: 'Fire', colors: ['#f093fb', '#f5576c'], direction: 'to-br' as GradientDirection },
  { name: 'Sky', colors: ['#a8edea', '#fed6e3'], direction: 'to-b' as GradientDirection },
  { name: 'Peach', colors: ['#ffeaa7', '#fab1a0'], direction: 'to-r' as GradientDirection },
  { name: 'Mint', colors: ['#81ecec', '#74b9ff'], direction: 'to-bl' as GradientDirection },
  { name: 'Rose Gold', colors: ['#e9967a', '#cd853f'], direction: 'to-r' as GradientDirection },
  { name: 'Northern Lights', colors: ['#00c9ff', '#92fe9d'], direction: 'to-b' as GradientDirection },
]

export function GradientBuilder({ gradient, stops = [], onChange }: GradientBuilderProps) {
  const [direction, setDirection] = useState<GradientDirection>('to-r')
  const [localStops, setLocalStops] = useState<GradientStop[]>(
    stops.length > 0
      ? stops
      : [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ]
  )

  const generateGradient = () => {
    // Generate CSS gradient for preview
    const cssStops = localStops
      .sort((a, b) => a.position - b.position)
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ')
    const cssGradient = `linear-gradient(${DIRECTION_MAP[direction]}, ${cssStops})`

    onChange(cssGradient, localStops)
    return cssGradient
  }

  const addStop = () => {
    const newStops = [...localStops, { color: '#ffffff', position: 50 }]
    setLocalStops(newStops)
  }

  const removeStop = (index: number) => {
    if (localStops.length <= 2) return // Minimum 2 stops required
    const newStops = localStops.filter((_, i) => i !== index)
    setLocalStops(newStops)
  }

  const updateStop = (index: number, key: keyof GradientStop, value: string | number) => {
    const newStops = [...localStops]
    newStops[index] = { ...newStops[index], [key]: value }
    setLocalStops(newStops)
  }

  const applyPreset = (preset: typeof GRADIENT_PRESETS[0]) => {
    const newStops: GradientStop[] = preset.colors.map((color, index) => ({
      color,
      position: index === 0 ? 0 : 100,
    }))
    setLocalStops(newStops)
    setDirection(preset.direction)
  }

  const currentGradient = generateGradient()

  return (
    <div className="space-y-4">
      {/* Gradient Preview */}
      <div
        className="h-24 rounded-lg border shadow-sm"
        style={{ background: currentGradient }}
      />

      {/* Direction */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Direction</Label>
        <Select value={direction} onValueChange={(v) => setDirection(v as GradientDirection)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to-r">To Right →</SelectItem>
            <SelectItem value="to-br">To Bottom Right ↘</SelectItem>
            <SelectItem value="to-b">To Bottom ↓</SelectItem>
            <SelectItem value="to-bl">To Bottom Left ↙</SelectItem>
            <SelectItem value="to-l">To Left ←</SelectItem>
            <SelectItem value="to-tl">To Top Left ↖</SelectItem>
            <SelectItem value="to-t">To Top ↑</SelectItem>
            <SelectItem value="to-tr">To Top Right ↗</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gradient Stops */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Color Stops</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addStop}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>

        {localStops
          .sort((a, b) => a.position - b.position)
          .map((stop, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2.5 border rounded-lg bg-muted/30"
            >
              <Input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(index, 'color', e.target.value)}
                className="h-9 w-12 rounded border cursor-pointer p-1"
              />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    Position
                  </span>
                  <span className="text-xs font-mono font-bold">{stop.position}%</span>
                </div>
                <Slider
                  value={[stop.position]}
                  onValueChange={([v]) => updateStop(index, 'position', v)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              {localStops.length > 2 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeStop(index)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
      </div>

      {/* Preset Gradients */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5" />
          Preset Gradients
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {GRADIENT_PRESETS.map((preset, i) => {
            const presetGradient = `linear-gradient(${DIRECTION_MAP[preset.direction]}, ${preset.colors.join(', ')})`
            return (
              <button
                key={i}
                onClick={() => applyPreset(preset)}
                className={cn(
                  'h-12 rounded-md border-2 cursor-pointer transition-all hover:scale-105 hover:border-primary',
                  'shadow-sm hover:shadow-md'
                )}
                style={{ background: presetGradient }}
                title={preset.name}
              />
            )
          })}
        </div>
      </div>

      {/* Apply Button */}
      <Button type="button" onClick={generateGradient} className="w-full" size="sm">
        Apply Gradient
      </Button>
    </div>
  )
}
