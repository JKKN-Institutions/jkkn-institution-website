'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export interface ShadcnTextareaBlockProps {
  placeholder?: string
  rows?: number
  disabled?: boolean
  label?: string
}

export function ShadcnTextareaBlock({
  placeholder = 'Enter text...',
  rows = 4,
  disabled = false,
  label,
}: ShadcnTextareaBlockProps) {
  const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <Textarea
        id={textareaId}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
    </div>
  )
}

export default ShadcnTextareaBlock
