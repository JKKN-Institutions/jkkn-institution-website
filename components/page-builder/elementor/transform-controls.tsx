'use client'

/**
 * Transform Controls Component
 *
 * Provides UI controls for CSS transform properties:
 * - Rotate (-180° to 180°)
 * - Scale X/Y (0.1 to 2)
 * - Skew X/Y (-45° to 45°)
 * - Translate X/Y (pixels)
 *
 * Usage in PropsPanel accordion as "Transform" section
 */

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RotateCw, Move } from 'lucide-react'

export interface TransformSettings {
  rotate?: number      // -180 to 180 degrees
  scaleX?: number      // 0.1 to 2
  scaleY?: number      // 0.1 to 2
  skewX?: number       // -45 to 45 degrees
  skewY?: number       // -45 to 45 degrees
  translateX?: number  // pixels
  translateY?: number  // pixels
}

interface TransformControlsProps {
  transform?: TransformSettings
  onChange: (transform: TransformSettings) => void
}

export function TransformControls({ transform = {}, onChange }: TransformControlsProps) {
  const updateTransform = (key: keyof TransformSettings, value: number) => {
    onChange({ ...transform, [key]: value })
  }

  const resetTransform = () => {
    onChange({})
  }

  return (
    <div className="space-y-4">
      {/* Rotate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium flex items-center gap-1.5">
            <RotateCw className="h-3.5 w-3.5" />
            Rotate
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={transform.rotate || 0}
              onChange={(e) => updateTransform('rotate', Number(e.target.value))}
              className="h-7 w-16 text-xs text-right"
              min={-180}
              max={180}
            />
            <span className="text-xs text-muted-foreground">deg</span>
          </div>
        </div>
        <Slider
          value={[transform.rotate || 0]}
          onValueChange={([v]) => updateTransform('rotate', v)}
          min={-180}
          max={180}
          step={1}
          className="w-full"
        />
      </div>

      {/* Scale X */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Scale X</Label>
          <Input
            type="number"
            value={transform.scaleX || 1}
            onChange={(e) => updateTransform('scaleX', Number(e.target.value))}
            className="h-7 w-16 text-xs text-right"
            step="0.1"
            min="0.1"
            max="2"
          />
        </div>
        <Slider
          value={[transform.scaleX || 1]}
          onValueChange={([v]) => updateTransform('scaleX', v)}
          min={0.1}
          max={2}
          step={0.1}
        />
      </div>

      {/* Scale Y */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Scale Y</Label>
          <Input
            type="number"
            value={transform.scaleY || 1}
            onChange={(e) => updateTransform('scaleY', Number(e.target.value))}
            className="h-7 w-16 text-xs text-right"
            step="0.1"
            min="0.1"
            max="2"
          />
        </div>
        <Slider
          value={[transform.scaleY || 1]}
          onValueChange={([v]) => updateTransform('scaleY', v)}
          min={0.1}
          max={2}
          step={0.1}
        />
      </div>

      {/* Skew X */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Skew X</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={transform.skewX || 0}
              onChange={(e) => updateTransform('skewX', Number(e.target.value))}
              className="h-7 w-16 text-xs text-right"
              min={-45}
              max={45}
            />
            <span className="text-xs text-muted-foreground">deg</span>
          </div>
        </div>
        <Slider
          value={[transform.skewX || 0]}
          onValueChange={([v]) => updateTransform('skewX', v)}
          min={-45}
          max={45}
          step={1}
        />
      </div>

      {/* Skew Y */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Skew Y</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={transform.skewY || 0}
              onChange={(e) => updateTransform('skewY', Number(e.target.value))}
              className="h-7 w-16 text-xs text-right"
              min={-45}
              max={45}
            />
            <span className="text-xs text-muted-foreground">deg</span>
          </div>
        </div>
        <Slider
          value={[transform.skewY || 0]}
          onValueChange={([v]) => updateTransform('skewY', v)}
          min={-45}
          max={45}
          step={1}
        />
      </div>

      {/* Translate X */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium flex items-center gap-1.5">
            <Move className="h-3.5 w-3.5" />
            Move X
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={transform.translateX || 0}
              onChange={(e) => updateTransform('translateX', Number(e.target.value))}
              className="h-7 w-16 text-xs text-right"
              min={-200}
              max={200}
            />
            <span className="text-xs text-muted-foreground">px</span>
          </div>
        </div>
        <Slider
          value={[transform.translateX || 0]}
          onValueChange={([v]) => updateTransform('translateX', v)}
          min={-200}
          max={200}
          step={1}
        />
      </div>

      {/* Translate Y */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Move Y</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={transform.translateY || 0}
              onChange={(e) => updateTransform('translateY', Number(e.target.value))}
              className="h-7 w-16 text-xs text-right"
              min={-200}
              max={200}
            />
            <span className="text-xs text-muted-foreground">px</span>
          </div>
        </div>
        <Slider
          value={[transform.translateY || 0]}
          onValueChange={([v]) => updateTransform('translateY', v)}
          min={-200}
          max={200}
          step={1}
        />
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={resetTransform}
        className="w-full mt-4"
      >
        Reset Transform
      </Button>
    </div>
  )
}
