'use client'

import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

export interface ShadcnSliderBlockProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  label?: string
}

export function ShadcnSliderBlock({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  label,
}: ShadcnSliderBlockProps) {
  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      <Slider
        defaultValue={[defaultValue]}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
}

export default ShadcnSliderBlock
