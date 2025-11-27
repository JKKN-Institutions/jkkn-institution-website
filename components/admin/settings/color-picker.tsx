'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Predefined color palette for quick selection
const presetColors = [
  '#1e40af', // Blue
  '#059669', // Green
  '#dc2626', // Red
  '#7c3aed', // Purple
  '#f97316', // Orange
  '#0891b2', // Cyan
  '#be185d', // Pink
  '#4b5563', // Gray
  '#ca8a04', // Yellow
  '#166534', // Dark Green
]

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  description?: string
  className?: string
}

export function ColorPicker({
  value,
  onChange,
  label,
  description,
  className,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value || '#1e40af')

  // Sync input value when prop changes
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value)
    }
  }, [value])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    // Only call onChange if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue)
    }
  }

  const handlePresetClick = (color: string) => {
    setInputValue(color)
    onChange(color)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div>
          <Label>{label}</Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Color preview and native picker */}
        <div className="relative">
          <input
            type="color"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="w-12 h-12 rounded-xl border-2 border-border shadow-sm cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: inputValue }}
          />
        </div>

        {/* Hex input */}
        <div className="flex-1">
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="#1e40af"
            className="font-mono uppercase"
            maxLength={7}
          />
        </div>
      </div>

      {/* Preset colors */}
      <div className="flex flex-wrap gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handlePresetClick(color)}
            className={cn(
              'w-8 h-8 rounded-lg border-2 transition-all hover:scale-110',
              inputValue.toLowerCase() === color.toLowerCase()
                ? 'border-foreground ring-2 ring-offset-2 ring-foreground'
                : 'border-transparent hover:border-muted-foreground/30'
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}
