'use client'

/**
 * Filter Controls Component
 *
 * Provides CSS filter effects controls:
 * - Blur (0-10px)
 * - Brightness (0-200%)
 * - Contrast (0-200%)
 * - Saturation (0-200%)
 * - Grayscale (0-100%)
 * - Hue Rotate (0-360°)
 * - Invert (0-100%)
 * - Sepia (0-100%)
 *
 * Usage in PropsPanel accordion as "Filters" section
 */

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export interface FilterSettings {
  blur?: number          // 0-10px
  brightness?: number    // 0-200%
  contrast?: number      // 0-200%
  saturate?: number      // 0-200%
  grayscale?: number     // 0-100%
  hueRotate?: number     // 0-360deg
  invert?: number        // 0-100%
  sepia?: number         // 0-100%
}

interface FilterControlsProps {
  filters?: FilterSettings
  onChange: (filters: FilterSettings) => void
}

export function FilterControls({ filters = {}, onChange }: FilterControlsProps) {
  const updateFilter = (key: keyof FilterSettings, value: number) => {
    onChange({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    onChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-4">
      {/* Blur */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Blur</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.blur || 0}px
          </span>
        </div>
        <Slider
          value={[filters.blur || 0]}
          onValueChange={([v]) => updateFilter('blur', v)}
          max={10}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Brightness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Brightness</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.brightness ?? 100}%
          </span>
        </div>
        <Slider
          value={[filters.brightness ?? 100]}
          onValueChange={([v]) => updateFilter('brightness', v)}
          min={0}
          max={200}
          step={5}
          className="w-full"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Contrast</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.contrast ?? 100}%
          </span>
        </div>
        <Slider
          value={[filters.contrast ?? 100]}
          onValueChange={([v]) => updateFilter('contrast', v)}
          min={0}
          max={200}
          step={5}
          className="w-full"
        />
      </div>

      {/* Saturation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Saturation</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.saturate ?? 100}%
          </span>
        </div>
        <Slider
          value={[filters.saturate ?? 100]}
          onValueChange={([v]) => updateFilter('saturate', v)}
          min={0}
          max={200}
          step={5}
          className="w-full"
        />
      </div>

      {/* Grayscale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Grayscale</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.grayscale || 0}%
          </span>
        </div>
        <Slider
          value={[filters.grayscale || 0]}
          onValueChange={([v]) => updateFilter('grayscale', v)}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Hue Rotate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Hue Rotate</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.hueRotate || 0}°
          </span>
        </div>
        <Slider
          value={[filters.hueRotate || 0]}
          onValueChange={([v]) => updateFilter('hueRotate', v)}
          max={360}
          step={5}
          className="w-full"
        />
      </div>

      {/* Invert */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Invert</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.invert || 0}%
          </span>
        </div>
        <Slider
          value={[filters.invert || 0]}
          onValueChange={([v]) => updateFilter('invert', v)}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Sepia */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Sepia</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {filters.sepia || 0}%
          </span>
        </div>
        <Slider
          value={[filters.sepia || 0]}
          onValueChange={([v]) => updateFilter('sepia', v)}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-full mt-4"
        >
          <Sparkles className="h-3.5 w-3.5 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  )
}
